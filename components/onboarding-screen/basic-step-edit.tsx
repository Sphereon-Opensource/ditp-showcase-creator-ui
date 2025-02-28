"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormTextArea, FormTextInput } from "@/components/text-input";
import {
  Download,
  Edit,
  EllipsisVertical,
  Eye,
  Monitor,
  RotateCw,
  Search,
  Trash2,
} from "lucide-react";
import { useOnboarding } from "@/hooks/use-onboarding";
import { BasicStepFormData } from "@/schemas/onboarding";
import { basicStepSchema } from "@/schemas/onboarding";
import { LocalFileUpload } from "./local-file-upload";
import { useTranslations } from "next-intl";
import { Label } from "../ui/label";
import { DisplaySearchResults } from "./display-search-results";
import { useShowcaseStore } from "@/hooks/use-showcase-store";
import StepHeader from "../step-header";
import ButtonOutline from "../ui/button-outline";
import DeleteModal from "../delete-modal";

export const BasicStepEdit = () => {
  const t = useTranslations();
  const {
    screens,
    selectedStep,
    setSelectedStep,
    updateStep,
    setStepState,
    stepState,
  } = useOnboarding();
  const { showcaseJSON, selectedCharacter } = useShowcaseStore();
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const currentStep = selectedStep !== null ? screens[selectedStep] : null;
  const isEditMode = stepState === "editing-basic";
  const [isOpen, setIsOpen] = useState(false);

  const defaultValues = currentStep
    ? {
        title: currentStep.title,
        text: currentStep.text,
        image: currentStep.image || "",
      }
    : {
        title: "",
        text: "",
        image: "",
      };

  const form = useForm<BasicStepFormData>({
    resolver: zodResolver(basicStepSchema),
    defaultValues,
    mode: "all",
  });

  React.useEffect(() => {
    if (currentStep) {
      form.reset({
        title: currentStep.title,
        text: currentStep.text,
        image: currentStep.image || "",
      });
    }
  }, [currentStep, form]);

  const onSubmit = (data: BasicStepFormData) => {
    if (selectedStep !== null) {
      updateStep(selectedStep, {
        ...screens[selectedStep],
        ...data,
      });
      setStepState("no-selection");
      setSelectedStep(null);
    }
  };

  const handleCancel = () => {
    form.reset();
    setStepState("no-selection");
    setSelectedStep(null);
  };

  if (selectedStep === null) {
    return null;
  }

  if (!isEditMode && currentStep) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between mt-3">
          <div>
            <p className="text-foreground text-sm">
              {t("onboarding.section_title")}
            </p>
            <h3 className="text-2xl font-bold text-foreground">
              {t("onboarding.details_step_header_title")}
            </h3>
          </div>
          <Button
            variant="outline"
            onClick={() => setStepState("editing-basic")}
            className="flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            {t("action.edit_label")}
          </Button>
        </div>
        <hr />

        <div className="space-y-6">
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">
              {t("onboarding.page_title_label")}
            </h4>
            <p className="text-lg">{currentStep.title}</p>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">
              {t("onboarding.page_description_label")}
            </h4>
            <p className="text-lg whitespace-pre-wrap">{currentStep.text}</p>
          </div>

          {currentStep.image && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">
                {t("onboarding.icon_label")}
              </h4>
              <div className="w-32 h-32 rounded-lg overflow-hidden border">
                <img
                  src={currentStep.image}
                  alt="Step icon"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

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
        <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-6">
          <div className="space-y-6">
            <FormTextInput
              label={t("onboarding.page_title_label")}
              name="title"
              register={form.register}
              error={form.formState.errors.title?.message}
              placeholder={t("onboarding.page_title_placeholder")}
            />

            <div className="space-y-2">
              {/* <label className="text-sm font-medium">Page Description</label> */}
              <FormTextArea
                label={t("onboarding.page_description_label")}
                name="text"
                register={form.register}
                error={form.formState.errors.text?.message}
                placeholder={t("onboarding.page_description_placeholder")}
              />
              {form.formState.errors.text && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.text.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <LocalFileUpload
                text={t("onboarding.icon_label")}
                element="image"
                handleLocalUpdate={(_, value) =>
                  form.setValue("image", value, {
                    shouldDirty: true,
                    shouldTouch: true,
                    shouldValidate: true,
                  })
                }
                localJSON={{ image: form.watch("image") }}
              />
              {form.formState.errors.image && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.image.message}
                </p>
              )}
            </div>
            {/* <div>
            <div className="font-bold text-lg border-b-2 border-black pb-4">
              Add Credential
            </div>
            <div className="mt-4">
              <Label className="text-base font-bold" htmlFor={"Search"}>
                {"Search for a Credential:"}
              </Label>
              <div className="relative w-full mt-2">
                <input
                  className="dark:text-dark-text dark:bg-dark-input rounded pl-2 pr-10 mb-2 w-full border"
                  placeholder={t("onboarding.search_credential_placeholder")}
                  type="text"
                  // onChange={(e) => searchCredential(e.target.value)}
                />
              </div>
            </div>
            <Label className="text-base font-bold" htmlFor={"Search"}>
                {"Credential Added: "}
            </Label>
            <DisplaySearchResults
              selectedCharacter={selectedCharacter}
              showcaseJSON={showcaseJSON}
              searchResults={searchResults}
              addCredential={addCredential}
            />
          </div> */}
          </div>

        </form>
      </Form>
          <div className="mt-auto pt-4 border-t flex justify-end gap-3">
            <ButtonOutline onClick={handleCancel} className="w-1/6">
              {t("action.cancel_label")}
            </ButtonOutline>
            <ButtonOutline
              disabled={!form.formState.isDirty || !form.formState.isValid}
              className="w-1/6"
            >
              {t("action.next_label")}
            </ButtonOutline>
          </div>
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
