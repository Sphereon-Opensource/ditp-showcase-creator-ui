import { useOnboarding } from "@/hooks/use-onboarding";
import {
  ArrowRight,
  Monitor,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import StepHeader from "../step-header";

export const CreateNewStep = () => {
  const { createStep, setStepState } = useOnboarding();
  const [isOpen, setIsOpen] = useState(false);

  const handleAddStep = (isIssue: boolean) => {
    const newStep = {
      screenId: `${Date.now()}`,
      title: "",
      text: "",
      image: "",
      ...(isIssue && { credentials: [] }),
    };

    createStep(newStep);
    setStepState(isIssue ? "editing-issue" : "editing-basic");
  };

  const t = useTranslations();

  return (
    <>
        <StepHeader
          icon={<Monitor strokeWidth={3} />}
          title={t("scenario.add_step_label")}
        />
      <div className="py-2">
        <button
          className="flex flex-row justify-between items-center rounded p-5 my-3 w-full text-start border border-light-border-secondary dark:dark-border hover:bg-light-btn-hover dark:hover:bg-dark-btn-hover"
          onClick={() => handleAddStep(false)}
        >
          <p className="text-xl font-bold w-1/4">
            {t("onboarding.create_basic_step_label")}
          </p>
          <div className="w-1/4">
            <ul className="mx-5">
              <li>{t("onboarding.create_title_label")}</li>
              <li>{t("onboarding.create_description_label")}</li>
              <li>{t("onboarding.create_image_label")}</li>
            </ul>
          </div>

          <p className="text-xl font-bold text-end flex items-center gap-1">
            {t("onboarding.create_add_step_label")} <ArrowRight strokeWidth={3}/>
          </p>
        </button>

        <button
          className="basic-step flex flex-row justify-between items-center rounded p-5 my-3 w-full text-start border border-light-border-secondary dark:dark-border hover:bg-light-btn-hover dark:hover:bg-dark-btn-hover"
          onClick={() => handleAddStep(true)}
        >
          <p className="text-xl font-bold w-1/4">
            {t("onboarding.create_issue_step_label")}
          </p>
          <div className="w-1/4">
            <ul className="mx-5">
              <li>{t("onboarding.create_title_label")}</li>
              <li>{t("onboarding.create_description_label")}</li>
              <li>{t("onboarding.create_image_label")}</li>
              <li>{t("onboarding.create_credentials_label")}</li>
            </ul>
          </div>

          <p className="text-xl font-bold text-end flex items-center gap-1">
            {t("onboarding.create_add_step_label")} <ArrowRight strokeWidth={3}/>
          </p>
        </button>
      </div>
    </>
  );
};
