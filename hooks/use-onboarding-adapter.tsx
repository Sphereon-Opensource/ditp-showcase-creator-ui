// hooks/use-onboarding-adapter.tsx
import { useEffect, useState, useCallback } from "react";
import { useOnboarding } from "@/hooks/use-onboarding";
import { useShowcaseCreation } from "@/hooks/use-showcase-creation";
import { Persona, ShowcaseRequestType, StepRequestType } from "@/openapi-types";
import { createDefaultStep } from "@/lib/steps";
import { useShowcaseStore } from "@/hooks/use-showcases-store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/apiService";
import { useHelpersStore } from "./use-helpers-store";

export const useOnboardingAdapter = () => {
  const {
    screens: steps,
    selectedStep,
    initializeScreens,
    createStep,
    updateStep,
    // deleteStep,
    moveStep,
    setStepState,
    stepState
  } = useOnboarding();
  
  const {
    selectedPersonas,
    personaScenarios,
    activePersonaId,
    setActivePersonaId,
    updatePersonaSteps,
    // completeShowcaseCreation,
    // isSaving: isSavingScenarios,
  } = useShowcaseCreation();
  
  const { 
    displayShowcase, 
    setShowcase,
    showcase
  } = useShowcaseStore();

  const { selectedCredentialDefinitionIds, issuerId } = useHelpersStore();
    
  const [loadedPersonaId, setLoadedPersonaId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const loadPersonaSteps = useCallback((personaId: string) => {
    if (personaId && personaScenarios.has(personaId)) {
      const scenario = personaScenarios.get(personaId)!;
      
      const onboardingSteps = scenario.steps.map((step, index) => {
        return {
          ...createDefaultStep({
            title: step.title,
            description: step.description
          }),
          id: `step-${index}`,
          order: index,
          type: step.type,
          actions: step.actions || []
        };
      });
      
      initializeScreens(onboardingSteps);
      setLoadedPersonaId(personaId);
    }
  }, [personaScenarios, initializeScreens]);
  
  useEffect(() => {
    if (activePersonaId !== loadedPersonaId) {
      loadPersonaSteps(activePersonaId!);
    }
  }, [activePersonaId, loadedPersonaId, loadPersonaSteps]);
  
  useEffect(() => {
    if (activePersonaId && loadedPersonaId === activePersonaId && steps.length > 0) {

      const scenarioSteps: StepRequestType[] = steps.map((step, index) => ({
        title: step.title,
        description: step.description,
        order: index,
        type: step.type as 'HUMAN_TASK' | 'SERVICE' | 'SCENARIO',
        actions: step.actions || [],
        issuer: issuerId
      }));
      
      updatePersonaSteps(activePersonaId, scenarioSteps);
    }
  }, [steps, activePersonaId, loadedPersonaId, updatePersonaSteps]);
  
  const updateShowcaseMutation = useMutation({
    mutationFn: async (showcaseData: ShowcaseRequestType) => {
      let response;
      
      if (displayShowcase.id) {
        response = await apiClient.put(`/showcases/${displayShowcase.slug}`, showcaseData);
      } else {
        response = await apiClient.post('/showcases', showcaseData);
      }
      
      return response;
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['showcases'] });
    }
  });
  
  const saveShowcase = useCallback(async (data: ShowcaseRequestType) => {
    try {
      const showcaseData = {
        name: data.name,
        description: data.description,
        status: data.status || "ACTIVE",
        hidden: data.hidden || false,
        scenarios: showcase.scenarios,
        credentialDefinitions: selectedCredentialDefinitionIds,
        personas: selectedPersonas.map((p: Persona) => p.id),
        bannerImage: data.bannerImage,
      };
      
      const updatedShowcase = await updateShowcaseMutation.mutateAsync(showcaseData);      
      setShowcase(showcaseData);
      return updatedShowcase;
    } catch (error) {
      console.error("Error saving showcase:", error);
      throw error;
    }
  }, [displayShowcase, selectedPersonas, updateShowcaseMutation, setShowcase]);
  
  const activePersona = activePersonaId 
    ? selectedPersonas.find((p: Persona) => p.id === activePersonaId) || null
    : null;
  
  return {
    // From onboarding
    steps,
    selectedStep,
    createStep,
    updateStep,
    // deleteStep,
    moveStep,
    setStepState,
    stepState,
    
    // From showcase creation
    personas: selectedPersonas,
    activePersonaId,
    setActivePersonaId,
    activePersona,
    
    // Combined functionality
    saveShowcase,
    isSaving:  updateShowcaseMutation.isPending
  };
};