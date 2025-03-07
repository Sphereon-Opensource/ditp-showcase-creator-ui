"use client";

import { useEffect, useMemo } from "react";
import {
  DndContext,
  closestCenter,
  DragOverlay,
  DragEndEvent,
  DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useTranslations } from "next-intl";
import { SortableStep } from "@/components/onboarding-screen/sortable-step";
import { useShowcaseStore } from "@/hooks/use-showcase-store";
import { useOnboarding } from "@/hooks/use-onboarding";
import Image from "next/image";
import ButtonOutline from "../ui/button-outline";

export const OnboardingScreen = () => {
  const t = useTranslations();
  const { showcaseJSON, selectedCharacter } = useShowcaseStore();
  const {
    screens,
    selectedStep,
    initializeScreens,
    setSelectedStep,
    moveStep,
    removeStep,
    setStepState,
    stepState,
  } = useOnboarding();

  const initialScreens = useMemo(() => {
    return JSON.parse(
      JSON.stringify(showcaseJSON.personas[selectedCharacter].onboarding)
    );
  }, [showcaseJSON.personas, selectedCharacter]);

  useEffect(() => {
    initializeScreens(initialScreens);
  }, [initialScreens, initializeScreens]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const oldIndex = screens.findIndex(
      (screen) => screen.screenId === active.id
    );
    const newIndex = screens.findIndex((screen) => screen.screenId === over.id);

    if (oldIndex !== newIndex) {
      moveStep(oldIndex, newIndex);
      setSelectedStep(newIndex);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const index = screens.findIndex(
      (screen) => screen.screenId === event.active.id
    );
    setSelectedStep(index);
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
        "Meet Joyce Joyce is a Teacher at BestBC College. To help make teacher life easier, BestBC College is going to offer Joyce a digital Teacher Card to put in her BC Wallet.",
      headshot: "../../public/assets/NavBar/Joyce.png",
      bodyImage: "../../public/assets/NavBar/Joyce.png",
      selected: false,
      isHidden: false,
    }
  ];

  return (
    <>
      <div className="bg-white dark:bg-dark-bg-secondary text-light-text dark:text-dark-text">
        <div className="flex bg-gray-100 rounded-md border-b">
          {characters.map((char: any, index: number) => (
            <div
              key={char.id}
              className={`w-1/2 p-4 text-center border ${
                index === 0
                  ? "bg-white dark:bg-dark-bg shadow-md"
                  : "bg-gray-200"
              }`}
            >
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-gray-300 rounded-full mb-2">
                  <Image
                    src={require(`../../public/assets/NavBar/${char.name}.png`)}
                    alt={char.name}
                    width={50}
                    height={50}
                    className="rounded-full"
                  />
                </div>

                <div className="text-lg font-semibold">{char.name}</div>
                <div className="text-sm text-gray-500">{char.type}</div>

                {stepState == "no-selection" && (
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

        <DndContext
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={screens.map((screen) => screen.screenId)}
            strategy={verticalListSortingStrategy}
          >
            {screens.map((screen, index) => (
              <div key={screen.screenId} className="flex flex-row">
                <SortableStep
                  selectedStep={selectedStep}
                  myScreen={screen}
                  stepIndex={index + 1}
                  totalSteps={screens.length}
                />
              </div>
            ))}

            <DragOverlay>
              {selectedStep !== null && screens[selectedStep] && (
                <div className="top-1">
                  <p>{screens[selectedStep].title}</p>
                  <div className="highlight-container w-full flex flex-row justify-items-center items-center rounded p-3 unselected-item backdrop-blur">
                    <p className="text-sm">{screens[selectedStep].text}</p>
                  </div>
                </div>
              )}
            </DragOverlay>
          </SortableContext>
        </DndContext>
      </div>

      <div className="p-4 mt-auto pt-10">
        <ButtonOutline
          onClick={() => {
            setStepState("creating-new");
            window.scrollTo({ top: 200, behavior: "smooth" });
          }}
          className="w-full"
        >
          {t("onboarding.add_step_label")}
        </ButtonOutline>
      </div>
    </>
  );
};
