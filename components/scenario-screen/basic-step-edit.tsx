"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { FormTextInput, FormTextArea } from "@/components/text-input";
import { basicStepSchema, BasicStepFormData } from "@/schemas/scenario";
import { useScenarios } from "@/hooks/use-scenarios";
import { RequestType, StepType } from "@/types";
import {
  Monitor,
} from "lucide-react";
import { useTranslations } from "next-intl";
import StepHeader from "../step-header";
import ButtonOutline from "../ui/button-outline";
import DeleteModal from "../delete-modal";

export const BasicStepEdit = () => {
  const t = useTranslations();
  const {
    scenarios,
    selectedScenario,
    selectedStep,
    setStepState,
    updateStep,
  } = useScenarios();

  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const currentScenario =
    selectedScenario !== null ? scenarios[selectedScenario] : null;
  const currentStep =
    currentScenario && selectedStep !== null
      ? currentScenario.steps[selectedStep]
      : null;

  const form = useForm<BasicStepFormData>({
    resolver: zodResolver(basicStepSchema),
    mode: "all",
    defaultValues: {
      type: StepType.BASIC,
      title: "",
      text: "",
      requestOptions: {
        type: RequestType.BASIC,
        title: "",
        text: "",
        proofRequest: {
          attributes: {},
          predicates: {},
        },
      },
    },
  });

  useEffect(() => {
    if (currentStep) {
      const formData = {
        screenId: currentStep.screenId,
        type: StepType.BASIC,
        title: currentStep.title,
        text: currentStep.text,
        requestOptions: {
          type: RequestType.BASIC,
          title: currentStep.requestOptions?.title || "",
          text: currentStep.requestOptions?.text || "",
          proofRequest: {
            attributes:
              currentStep.requestOptions?.proofRequest?.attributes || {},
            predicates:
              currentStep.requestOptions?.proofRequest?.predicates || {},
          },
        },
      };
      form.reset(formData as BasicStepFormData);
    }
  }, [currentStep, form.reset]);

  const onSubmit = (data: BasicStepFormData) => {
    if (selectedScenario === null || selectedStep === null) return;

    // Transform the form data back to the expected format
    const stepData = {
      ...data,
      type: data.type.toUpperCase() as StepType,
      requestOptions: {
        ...data.requestOptions,
        type: data.requestOptions.type.toUpperCase() as RequestType,
      },
    };

    updateStep(selectedScenario, selectedStep, stepData);
    setStepState("none-selected");
  };

  if (!currentStep) return null;

  return (
    <>
      <StepHeader
        icon={<Monitor strokeWidth={3} />}
        title={t("onboarding.basic_step_header_title")}
        onActionClick={(action) => {
          switch (action) {
            case "save":
              console.log("Save Draft clicked");
              break;
            case "preview":
              console.log("Preview clicked");
              break;
            case "revert":
              console.log("Revert Changes clicked");
              break;
            case "delete":
              console.log("Delete Page clicked");
              setIsModalOpen(true);
              setIsOpen(false);
              break;
            default:
              console.log("Unknown action");
          }
        }}
      />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-6">
            <FormTextInput
              label={t("scenario.edit_page_title_label")}
              name="title"
              register={form.register}
              error={form.formState.errors.title?.message}
              placeholder={t("scenario.edit_page_title_placeholder")}
            />

            <FormTextArea
              label={t("scenario.edit_page_description_label")}
              name="text"
              register={form.register}
              error={form.formState.errors.text?.message}
              placeholder={t("scenario.edit_page_description_placeholder")}
            />
          </div>

          <div className="mt-auto pt-4 border-t flex justify-end gap-3">
            <ButtonOutline
              className="w-1/6"
              onClick={() => setStepState("none-selected")}
            >
              {t("action.cancel_label")}
            </ButtonOutline>
            <ButtonOutline
              className="w-1/6"
              disabled={!form.formState.isDirty || !form.formState.isValid}
            >
              {t("action.next_label")}
            </ButtonOutline>
          </div>
        </form>
      </Form>
      {/* Delete Modal */}
      <DeleteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onDelete={() => {
          console.log("Item Deleted");
          setIsModalOpen(false);
        }}
        header="Are you sure you want to delete this page?"
        description="Are you sure you want to delete this page?"
        subDescription="<b>This action cannot be undone.</b>"
        cancelText="CANCEL"
        deleteText="DELETE"
      />
    </>
  );
};
