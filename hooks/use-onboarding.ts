import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { OnboardingStep } from "@/types";
import { useShowcaseStore } from "./use-showcase-store";
import { produce } from "immer";
import {
  OnboardingStepFormData,
  onboardingStepFormSchema,
} from "@/schemas/onboarding";
import { stepTypeSchema } from "@/schemas/onboarding";
import { useForm } from "react-hook-form";
import { StepTypeData } from "@/schemas/onboarding";
import { use, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  IssuanceScenarioResponse,
  ScenarioRequest,
  StepRequest,
  StepResponse,
} from "@/openapi-types";
import apiClient from "@/lib/apiService";

type OnboardingStepState =
  | "editing-basic"
  | "editing-issue"
  | "no-selection"
  | "creating-new";

interface State {
  selectedStep: number | null;
  stepState: OnboardingStepState;
  screens: OnboardingStep[];
  scenarioId: string;
  issuerId: string;
}

interface Actions {
  setSelectedStep: (index: number | null) => void;
  setStepState: (state: OnboardingStepState) => void;
  initializeScreens: (screens: OnboardingStep[]) => void;
  moveStep: (oldIndex: number, newIndex: number) => void;
  removeStep: (index: number) => void;
  createStep: (step: OnboardingStep) => void;
  updateStep: (index: number, step: OnboardingStep) => void;
  setScenarioId: (id: string) => void;
  setIssuerId: (id: string) => void;
  reset: () => void;
}

const deepClone = <T>(obj: T): T => JSON.parse(JSON.stringify(obj));

export const useOnboarding = create<State & Actions>()(
  immer((set) => ({
    selectedStep: null,
    stepState: "no-selection",
    scenarioId: "",
    issuerId: "",
    screens: [],

    setScenarioId: (id) =>
      set((state) => {
        state.scenarioId = id;
      }),

    setIssuerId: (id) =>
      set((state) => {
        state.issuerId = id;
      }),

    setSelectedStep: (index) =>
      set((state) => {
        state.selectedStep = index;
      }),

    setStepState: (newState) =>
      set((state) => {
        state.stepState = newState;
      }),

    initializeScreens: (screens) =>
      set(
        produce((state) => {
          state.screens = deepClone(screens);
        })
      ),

    moveStep: (oldIndex, newIndex) =>
      set(
        produce((state) => {
          const newScreens = [...state.screens];
          const [movedStep] = newScreens.splice(oldIndex, 1);
          newScreens.splice(newIndex, 0, movedStep);
          state.screens = newScreens;

          const { selectedCharacter } = useShowcaseStore.getState();
          useShowcaseStore.setState(
            produce((draft) => {
              draft.showcaseJSON.personas[selectedCharacter].onboarding =
                deepClone(newScreens);
            })
          );
        })
      ),

    removeStep: (index) =>
      set(
        produce((state) => {
          const newScreens = [...state.screens];
          newScreens.splice(index, 1);
          state.screens = newScreens;

          const { selectedCharacter } = useShowcaseStore.getState();
          useShowcaseStore.setState(
            produce((draft) => {
              draft.showcaseJSON.personas[selectedCharacter].onboarding =
                deepClone(newScreens);
            })
          );

          if (state.selectedStep === index) {
            state.selectedStep = null;
            state.stepState = "no-selection";
          }
        })
      ),

    createStep: (step) =>
      set((state) => {
        const newScreens = [...state.screens, step];
        state.screens = newScreens;
        state.selectedStep = newScreens.length - 1;
        state.stepState = step.credentials ? "editing-issue" : "editing-basic";

        const { selectedCharacter } = useShowcaseStore.getState();
        useShowcaseStore.setState((showcaseState) => {
          showcaseState.showcaseJSON.personas[selectedCharacter].onboarding =
            newScreens;
        });
      }),

    updateStep: (index, step) =>
      set(
        produce((state) => {
          const newScreens = [...state.screens];
          newScreens[index] = deepClone(step);
          state.screens = newScreens;

          const { selectedCharacter } = useShowcaseStore.getState();
          useShowcaseStore.setState(
            produce((draft) => {
              draft.showcaseJSON.personas[selectedCharacter].onboarding =
                deepClone(newScreens);
            })
          );
        })
      ),

    reset: () =>
      set(
        produce((state) => {
          state.selectedStep = null;
          state.stepState = "no-selection";
          state.screens = [];
        })
      ),
  }))
);

export const useCreateStep = () => {
  const { createStep, setStepState } = useOnboarding();
  const [stepType, setStepType] = useState<"basic" | "issue" | null>(null);

  const typeForm = useForm<StepTypeData>({
    resolver: zodResolver(stepTypeSchema),
  });

  const stepForm = useForm<OnboardingStepFormData>({
    resolver: zodResolver(onboardingStepFormSchema),
  });

  const handleTypeSelection = (type: "basic" | "issue") => {
    setStepType(type);
    stepForm.reset({
      type,
      title: "",
      text: "",
      image: "",
      ...(type === "issue" && { credentials: [] }),
    });
  };

  const onSubmit = (data: OnboardingStepFormData) => {
    const newStep = {
      id: `${Date.now()}`,
      title: data.title,
      description: data.text,
      image: data.image || "",
      ...(data.type === "issue" && { credentials: data.credentials || [] }),
    };

    createStep(newStep);
    setStepState("no-selection");
  };

  return {
    stepType,
    handleTypeSelection,
    stepForm,
    onSubmit,
  };
};

const staleTime = 1000 * 60 * 5; // 5 minutes

export const useCreateScenario = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: typeof ScenarioRequest._type) => {
      const response = await apiClient.post(`/scenarios/issuances`, data);
      return response;
    },
    onSettled: (data) => {
      queryClient.invalidateQueries({ queryKey: ["issuanceScenario"] });
    },
  });
};

export const useScenario = (slug: string) => {
  return useQuery({
    queryKey: ["issuanceScenario", slug],
    queryFn: async () => {
      const response = (await apiClient.get(
        `/scenarios/issuances/${slug}`
      )) as typeof IssuanceScenarioResponse._type;
      return response;
    },
    staleTime,
  });
};

export const useIssuanceStep = (slug: string) => {
  return useQuery({
    queryKey: ["issuanceStep", slug],
    queryFn: async () => {
      const response = (await apiClient.get(
        `/scenarios/issuances/${slug}/steps`
      )) as typeof StepResponse._type;
      return response;
    },
    staleTime,
  });
};

export const useCreateIssuanceStep = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      slug,
      data,
    }: {
      slug: string;
      data: typeof StepRequest._type;
    }) => {
      const response = await apiClient.post(
        `/scenarios/issuances/${slug}/steps`,
        data
      );
      return response;
    },
    onSettled: (data) => {
      queryClient.invalidateQueries({ queryKey: ["issuanceStep"] });
    },
  });
};

export const useUpdateIssuanceStep = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ slug, stepSlug, data }: { slug: string; stepSlug: string; data: typeof StepRequest._type }) => {
      const response = await apiClient.put(
        `/scenarios/issuances/${slug}/steps/${stepSlug}`,
        data
      );
      return response;
    },
    onSettled: (data) => {
      queryClient.invalidateQueries({ queryKey: ["issuanceStep"] });
    },
  });
};
