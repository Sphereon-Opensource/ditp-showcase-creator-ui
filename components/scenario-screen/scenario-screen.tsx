"use client";

import { useEffect } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { ScenarioStep } from "./scenario-step";
import { useShowcaseStore } from "@/hooks/use-showcase-store";
import { useScenarios } from "@/hooks/use-scenarios";
import Image from "next/image";
import { useTranslations } from "next-intl";
import ButtonOutline from "../ui/button-outline";

export const ScenarioScreen = () => {
  const t = useTranslations();
  const { showcaseJSON, selectedCharacter } = useShowcaseStore();
  const {
    scenarios,
    setScenarios,
    editScenario,
    removeScenario,
    setStepState,
    stepState,
  } = useScenarios();

  useEffect(() => {
    const initialScenarios = JSON.parse(
      JSON.stringify(showcaseJSON.personas[selectedCharacter].scenarios)
    );
    setScenarios(initialScenarios);
  }, [selectedCharacter, setScenarios]);

  const handleAddScenario = () => {
    const newScenario = {
      id: Date.now().toString(),
      name: "",
      status: "draft" as const,
      overview: {
        title: "",
        text: "",
        image: "",
      },
      summary: {
        title: "",
        text: "",
        image: "",
      },
      steps: [],
    };
    editScenario(scenarios.length);
    setScenarios([...scenarios, newScenario]);
  };

  const characters = [
    {
      id: 1,
      name: "Ana",
      type: "Student",
      description:
        "Meet Ana Ana is a student at BestBC College. To help make student life easier, BestBC College is going to offer Ana a digital Student Card to put in her BC Wallet.",
      headshot: "../../public/assets/NavBar/Joyce.png",
      bodyImage: "../../public/assets/NavBar/Joyce.png",
      selected: false,
      isHidden: false,
    },
    {
      id: 2,
      name: "Joyce",
      type: "Teacher",
      description:
        "Meet Joyce. Joyce is a Teacher at BestBC College. To help make teacher life easier, BestBC College is going to offer Joyce a digital Teacher Card to put in her BC Wallet.",
      headshot: "../../public/assets/NavBar/Joyce.png",
      bodyImage: "../../public/assets/NavBar/Joyce.png",
      selected: false,
      isHidden: false,
    }
  ];

  return (
    <div className="bg-white dark:bg-dark-bg-secondary text-light-text dark:text-dark-text">
      <div className="flex bg-gray-100 rounded-md border-b">
        {characters.map((char: any, index: number) => (
          <div
            key={char.id}
            className={`w-1/2 p-4 text-center border ${
              index === 0 ? "bg-white dark:bg-dark-bg shadow-md" : "bg-gray-200"
            }`}
          >
            <div className="flex flex-col items-center">
              {/* Character Avatar Placeholder */}
              <div className="w-12 h-12 bg-gray-300 rounded-full mb-2">
                <Image
                  src={require(`../../public/assets/NavBar/${"Joyce"}.png`)}
                  alt={char.name}
                  width={50}
                  height={50}
                  className="rounded-full"
                />
              </div>

              <div className="text-lg font-semibold">{char.name}</div>
              <div className="text-sm text-gray-500">{char.type}</div>

              {/* Status Badge */}
              {stepState == "none-selected" && (
                <div className="w-full mt-2 px-3 py-1 bg-yellow-400 text-xs font-semibold rounded">
                  Incomplete
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-cols">
        <div className="border-b w-full light-border dark:dark-border">
          <div className="p-4">
            <h2 className="text-base font-bold">
              {t("onboarding.editing_steps_label", { name: "Ana" })}
            </h2>
            <p className="text-xs">{t("onboarding.editing_steps_message")}</p>
          </div>
        </div>
      </div>

      <div className="flex">
        <div className="flex-1">
          {scenarios.map((scenario, index) => (
            <div
              key={scenario.id}
              className="pb-2 border rounded-lg dark:border-dark-border overflow-hidden flex"
            >
              <div className="w-12 bg-[#3A3B3B] flex justify-center items-center">
                <Copy className="h-6 w-6 text-white" />
              </div>

              <div className="flex-1">
                <div className="p-3 bg-light-bg dark:bg-dark-bg">
                  <h3 className="text-xl font-bold">{scenario.name}</h3>
                </div>

                {/* Steps Section */}
                <div className="p-2">
                  <DndContext collisionDetection={closestCenter}>
                    <SortableContext
                      items={scenario.steps.map((step) => step.screenId)}
                      strategy={verticalListSortingStrategy}
                    >
                      {scenario.steps.map((step, stepIndex) => (
                        <ScenarioStep
                          key={step.screenId}
                          step={step}
                          stepIndex={stepIndex}
                          scenarioIndex={index}
                          totalSteps={scenario.steps.length}
                        />
                      ))}
                    </SortableContext>
                  </DndContext>

                  <div className="mt-4 flex justify-end">
                    <ButtonOutline
                      onClick={() => {
                        setStepState("adding-step");
                      }}
                    >
                      {t("scenario.add_step_label")}
                    </ButtonOutline>
                  </div>
                </div>
                <div className="p-5 bg-light-bg dark:bg-dark-bg">
                  <Button
                    variant="destructive"
                    onClick={() => removeScenario(index)}
                  >
                    {t("scenario.delete_scenario_label")}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="p-4 mt-auto">
        <ButtonOutline
          className="w-full"
          onClick={() => {
            setStepState("editing-scenario");
            window.scrollTo({ top: 200, behavior: "smooth" });
          }}
        >
          {t("scenario.add_scenario_label").toUpperCase()}
        </ButtonOutline>
      </div>
    </div>
  );
};
