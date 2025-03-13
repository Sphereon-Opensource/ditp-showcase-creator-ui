"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { OnboardingScreen } from "./onboarding-screen";
import { OnboardingSteps } from "./onboarding-steps";

export const OnboardingMain = () => {
  const t = useTranslations();
  
  return (
    <div className="flex text-light-text bg-light-bg dark:bg-dark-bg dark:text-dark-text flex-col h-full w-full">
      <div className="flex flex-col h-full">
        <div className="flex gap-4 p-4 min-h-screen">
          {/* Left Section - Character Selection with Header */}
          <div className="w-1/3 bg-[white] dark:bg-dark-bg-secondary border shadow-md rounded-md flex flex-col">
          <div className="p-4 border-b shadow">
              <h2 className="text-base font-bold text-foreground">
                {t("onboarding.header_title")}
              </h2>
              <p className="w-full text-xs">{t("onboarding.header_subtitle")}</p>
          </div>
            <OnboardingScreen />
          </div>
          {/* Right Section - Character Details with Header */}
          <div className="w-2/3 bg-white dark:bg-dark-bg-secondary border shadow-md rounded-md flex flex-col">
            <OnboardingSteps />
          </div>
        </div>
      </div>
    </div>
  );
};
