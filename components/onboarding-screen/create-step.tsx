"use client";

import { ArrowRight, Monitor } from "lucide-react";
import { useTranslations } from "next-intl";
import StepHeader from "../step-header";
import { createDefaultStep } from "@/lib/steps";
import { createServiceStep } from "@/lib/steps";
import { useOnboardingAdapter } from "@/hooks/use-onboarding-adapter";

export const CreateNewStep = () => {
  const { createStep, setStepState, activePersona, setActivePersonaId } = useOnboardingAdapter();
  const t = useTranslations();

  const handleAddStep = (isIssue: boolean) => {
    const personaName = activePersona?.name || "Character";    
    createStep(
      isIssue
        ? createServiceStep({
            title: isIssue 
              ? `Issue Credential with ${personaName}`
              : "Information Step",
            description: isIssue 
              ?  `In this step, ${personaName} will issue a credential to you.`
              :  "This is an informational step in the onboarding journey."
          })
        : createDefaultStep({
            title: "Information Step",
            description: "This is an informational step in the onboarding journey."
          })
    );

    setStepState(isIssue ? 'editing-issue' : 'editing-basic');
  };

  return (
    <>
      <StepHeader
        icon={<Monitor strokeWidth={3} />}
        title={t("scenario.add_step_label") || "Add Step"}
        showDropdown={false}
      />
      <div className="py-2">
        <button
          className="flex flex-row justify-between items-center rounded p-5 my-3 w-full text-start border border-light-border-secondary dark:dark-border hover:bg-light-btn-hover dark:hover:bg-dark-btn-hover"
          onClick={() => handleAddStep(false)}
        >
          <p className="text-xl font-bold w-1/4">
            {t("onboarding.create_basic_step_label") || "Basic Step"}
          </p>
          <div className="w-1/4">
            <ul className="mx-5">
              <li>{t("onboarding.create_title_label") || "Title"}</li>
              <li>{t("onboarding.create_description_label") || "Description"}</li>
              <li>{t("onboarding.create_image_label") || "Image"}</li>
            </ul>
          </div>

          <p className="text-xl font-bold text-end flex items-center gap-1">
            {t("onboarding.create_add_step_label") || "Add Step"}{" "}
            <ArrowRight strokeWidth={3} />
          </p>
        </button>

        <button
          className="basic-step flex flex-row justify-between items-center rounded p-5 my-3 w-full text-start border border-light-border-secondary dark:dark-border hover:bg-light-btn-hover dark:hover:bg-dark-btn-hover"
          onClick={() => handleAddStep(true)}
        >
          <p className="text-xl font-bold w-1/4">
            {t("onboarding.create_issue_step_label") || "Issue Step"}
          </p>
          <div className="w-1/4">
            <ul className="mx-5">
              <li>{t("onboarding.create_title_label") || "Title"}</li>
              <li>{t("onboarding.create_description_label") || "Description"}</li>
              <li>{t("onboarding.create_image_label") || "Image"}</li>
              <li>{t("onboarding.create_credentials_label") || "Credentials"}</li>
            </ul>
          </div>

          <p className="text-xl font-bold text-end flex items-center gap-1">
            {t("onboarding.create_add_step_label") || "Add Step"}{" "}
            <ArrowRight strokeWidth={3} />
          </p>
        </button>
      </div>
    </>
  );
};