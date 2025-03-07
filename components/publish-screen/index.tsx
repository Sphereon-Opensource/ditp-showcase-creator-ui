"use client";

import { EditStepScreen } from "@/components/scenario-screen/edit-step-screen";
import { ScenarioScreen } from "@/components/scenario-screen/scenario-screen";
import { PageParams } from "@/types";
import { useTranslations } from "next-intl";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { PublishEdit } from "./publish-edit";
import { PublishInfo } from "./publish-info";
import { useEffect } from "react";

export default function PublishMain({ params }: { params: PageParams }) {

  return (
    <div className="flex text-light-text bg-light-bg dark:bg-dark-bg dark:text-dark-text flex-col h-full w-full bg-gray-100">
      <div className="flex flex-col h-full">
        <div className="flex gap-4 p-4 h-full">
          {/* Left Section - Character Selection with Header */}
          <div className="w-1/3 bg-[white] dark:bg-dark-bg-secondary border shadow-md rounded-md flex flex-col">
            <div className="p-4 border-b shadow">
              <h2 className="text-base font-bold text-foreground">
                Review and Publish Showcase
              </h2>
              <p className="w-full text-xs">{'Select the character and review their showcase'}</p>
            </div>
            <PublishInfo />
          </div>
          {/* Right Section - Character Details with Header */}
          <div className="w-2/3 bg-white dark:bg-dark-bg-secondary border shadow-md rounded-md flex flex-col">
            <PublishEdit />
          </div>
        </div>
      </div>
    </div>
  );
}
