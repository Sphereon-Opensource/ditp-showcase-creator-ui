import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import { ScenarioStep as ScenarioStepType } from "@/types";
import { useScenarios } from "@/hooks/use-scenarios";
import { Copy, GripVertical, Monitor, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";

const MAX_CHARS = 50;

export const ScenarioStep = ({
  step,
  stepIndex,
  scenarioIndex,
  totalSteps,
}: {
  step: ScenarioStepType;
  stepIndex: number;
  scenarioIndex: number;
  totalSteps: number;
}) => {
  const t = useTranslations();
  const {
    selectedStep,
    setSelectedStep,
    setSelectedScenario,
    setStepState,
    removeStep,
  } = useScenarios();

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: step.screenId,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleSelect = () => {
    setSelectedStep(stepIndex);
    setSelectedScenario(scenarioIndex);
    setStepState(
      step.type === "CONNET_AND_VERIFY" ? "proof-step-edit" : "basic-step-edit"
    );
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    removeStep(scenarioIndex, stepIndex);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex mb-2 flex-row  w-full bg-white dark:bg-dark-bg-secondary min-h-28"
    >
      <div
        className={`cursor-default flex-shrink-0 flex items-center ${
          step.type == "CONNET_AND_VERIFY" ? "bg-light-yellow" : "bg-[#898A8A]"
        } px-3 py-5 rounded-l`}
      >
        <div className="flex flex-col gap-3">
          {/* Dragging Only on GripVertical */}
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
            }}
            className="text-white text-2xl flex flex-col gap-2 cursor-pointer"
          >
            <Copy />
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div
        className="bg-light-bg dark:bg-dark-bg flex flex-col w-full cursor-pointer"
        onClick={handleSelect}
      >
        <div
          className={cn(
            "min-h-28  w-full hover:bg-light-btn-hover dark:hover:bg-dark-btn-hover",
            "flex flex-col justify-center rounded p-3",
            "border-b-2 border-light-border dark:border-dark-border",
            selectedStep === stepIndex
              ? "border-foreground"
              : "border-light-bg-secondary"
          )}
        >
          <span className="font-semibold">{step.title}</span>
          <p>
            {step.text.length > MAX_CHARS ? (
              <>
                <span className="text-xs">
                  {step.text.slice(0, MAX_CHARS)}...{" "}
                </span>
                <span className="text-xs">{t("action.see_more_label")}</span>
              </>
            ) : (
              step.text
            )}
          </p>
          {step.screenId == "testClothesOnlineStep1" && (
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
          )}
        </div>
      </div>
    </div>
  );
};
