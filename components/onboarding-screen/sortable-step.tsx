import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { OnboardingStep } from "@/types";
import Image from "next/image";
import {
  Copy,
  GripVertical,
  TriangleAlert,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useOnboarding } from "@/hooks/use-onboarding";
import { useTranslations } from "next-intl";
import { produce } from "immer";
import { useShowcaseStore } from "@/hooks/use-showcase-store";

const MAX_CHARS = 50;

export const SortableStep = ({
  selectedStep,
  myScreen,
  stepIndex,
  totalSteps,
}: {
  selectedStep: number | null;
  myScreen: OnboardingStep;
  stepIndex: number;
  totalSteps: number;
}) => {
  const t = useTranslations();
  const { setSelectedStep, setStepState, stepState } = useOnboarding();

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: myScreen.screenId,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleStepClick = () => {
    setSelectedStep(stepIndex - 1);
    setStepState(myScreen.credentials ? "editing-issue" : "editing-basic");
  };

  const handleCopyStep = (index: number) => {
    try {
      const { screens, selectedStep } = useOnboarding.getState();

      if (!screens[index]) return;

      const stepToCopy = screens[index];

      const newStep = JSON.parse(JSON.stringify(stepToCopy));
      newStep.screenId = `${Date.now()}`; // Ensure a unique ID

      useOnboarding.setState(
        produce((state) => {
          state.screens.splice(index + 1, 0, newStep);
          state.selectedStep = index + 1;

          // Update showcaseJSON
          const { selectedCharacter } = useShowcaseStore.getState();
          useShowcaseStore.setState((draft) => {
            draft.showcaseJSON.personas[selectedCharacter].onboarding =
              JSON.parse(JSON.stringify(state.screens));
          });
        })
      );
    } catch (error) {
      console.log("Error ", error);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex mb-2 flex-row items-center w-full bg-white dark:bg-dark-bg-secondary min-h-28"
    >
      <div
        className={`cursor-default h-full flex-shrink-0 flex items-center ${
          myScreen.screenId == "ACCEPT_CREDENTIAL"
            ? "bg-light-yellow"
            : "bg-[#898A8A]"
        } px-3 py-5 rounded-l`}
      >
        <div className="flex flex-col gap-3">
          <div
            {...attributes}
            {...listeners}
            className="text-white text-2xl flex flex-col gap-2 cursor-grab"
          >
            <GripVertical />
          </div>

          {/* Copy Step on Click */}
          <div
            onClick={(e) => {
              e.stopPropagation(); // Prevent drag interference
              console.log("Copy clicked");
              handleCopyStep(stepIndex - 1);
            }}
            className="text-white text-2xl flex flex-col gap-2 cursor-pointer"
          >
            <Copy />
          </div>
        </div>
      </div>
      <div
        className="bg-light-bg dark:bg-dark-bg flex flex-col w-full cursor-pointer"
        onClick={handleStepClick}
      >
        <div
          className={cn(
            "min-h-28  w-full hover:bg-light-btn-hover dark:hover:bg-dark-btn-hover",
            "flex flex-col justify-center rounded p-3",
            "border-b-2 border-light-border dark:border-dark-border",
            selectedStep === stepIndex - 1
              ? "border-foreground"
              : "border-light-bg-secondary"
          )}
        >
          

          <span className="font-semibold">{myScreen.title}</span>
          <p>
            {myScreen.text.length > MAX_CHARS ? (
              <>
                <span className="text-xs">
                  {myScreen.text.slice(0, MAX_CHARS)}...{" "}
                </span>
                <span className="text-xs">{t("action.see_more_label")}</span>
              </>
            ) : (
              myScreen.text
            )}
          </p>
          {myScreen.screenId == "ACCEPT_CREDENTIAL" && (
            <>
           {!myScreen.credentials && (
               <div className="bg-yellow-300 p-1 font-bold rounded gap-2 flex items-center justify-center">
               <TriangleAlert fill={'#FFCB00'} size={22}/>
               Select Credential to Proceed
             </div>
           )}
            <div className="bg-white dark:bg-dark-bg-secondary p-2 flex">
              <Image
                src={require(`../../public/assets/NavBar/${"Joyce"}.png`)}
                alt={"Bob"}
                width={50}
                height={50}
                className="rounded-full"
              />
              <div className="ml-4 flex-col">
                <div className="font-semibold">Student card</div>
                <div className="text-sm">Test college</div>
              </div>
              <div className="ml-24">
                <div className="font-semibold">Attributes</div>
                <div className="text-sm">3</div>
              </div>
            </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
