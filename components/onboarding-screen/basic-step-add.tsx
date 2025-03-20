"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { FormTextArea, FormTextInput } from "@/components/text-input";
import { Edit, Monitor } from "lucide-react";
import { useOnboarding, useCreateScenario } from "@/hooks/use-onboarding";
import { BasicStepFormData } from "@/schemas/onboarding";
import { basicStepSchema } from "@/schemas/onboarding";
import { LocalFileUpload } from "./local-file-upload";
import { useTranslations } from "next-intl";
import StepHeader from "../step-header";
import ButtonOutline from "../ui/button-outline";
import { useRouter } from "@/i18n/routing";
import { ErrorModal } from "../error-modal";
import Loader from "../loader";
import { IssuanceScenarioResponseType } from "@/openapi-types";
import { useShowcaseStore } from "@/hooks/use-showcases-store";
import { toast } from "sonner";
import { sampleAction } from "@/lib/steps";
import { sampleScenario } from "@/lib/steps";
import { NoSelection } from "../credentials/no-selection";
import { debounce } from "lodash";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export const BasicStepAdd = () => {
  const t = useTranslations();

  const {
    screens,
    selectedStep,
    setSelectedStep,
    setStepState,
    stepState,
    updateStep,
  } = useOnboarding();

  const router = useRouter();
  const { mutateAsync, isPending } = useCreateScenario();
  const currentStep = selectedStep !== null ? screens[selectedStep] : null;
  const { showcase, setScenarioIds, issuerId } = useShowcaseStore();
  const personas = showcase.personas || [];

  const isEditMode = stepState === "editing-basic";
  const [showErrorModal, setErrorModal] = useState(false);

  const defaultValues = {
    title: currentStep?.title || "",
    description: currentStep?.description || "",
    asset: currentStep?.asset || undefined,
  };

  const form = useForm<BasicStepFormData>({
    resolver: zodResolver(basicStepSchema),
    defaultValues,
    mode: "all",
  });

  useEffect(() => {
    if (currentStep) {
      form.reset({
        title: currentStep.title,
        description: currentStep.description,
        asset: currentStep.asset || "",
      });
    }
  }, [currentStep, form]);

  const autoSave = debounce((data: BasicStepFormData) => {
    if (!currentStep || !form.formState.isDirty) return;

    const updatedStep = {
      ...currentStep,
      title: data.title,
      description: data.description,
      asset: data.asset || undefined,
    };

    updateStep(selectedStep || 0, updatedStep);

    setTimeout(() => {
      toast.success("Changes saved", { duration: 1000 });
    }, 500);
  }, 800);

  useEffect(() => {
    const subscription = form.watch((value) => {
      if (form.formState.isDirty) {
        autoSave(value as BasicStepFormData);
      }
    });

    return () => subscription.unsubscribe();
  }, [form, autoSave]);

  const onSubmit = async (data: BasicStepFormData) => {
    // Make sure any pending auto-saves are applied immediately
    autoSave.flush();

    sampleScenario.personas = personas;
    sampleScenario.issuer = issuerId;

    sampleScenario.steps.push({
      title: data.title,
      description: data.description,
      asset: data.asset || undefined,
      type: "HUMAN_TASK",
      order: currentStep?.order || 0,
      actions: [...new Set([sampleAction])],
    });

    await mutateAsync(sampleScenario, {
      onSuccess: (data: unknown) => {
        toast.success("Scenario Created");

        setScenarioIds([
          (data as IssuanceScenarioResponseType).issuanceScenario.id,
        ]);

        router.push(`/showcases/create/publish`);
      },
      onError: (error) => {
        console.error("Error creating scenario:", error);
        setErrorModal(true);
      },
    });
  };

  const handleCancel = () => {
    form.reset();
    setStepState("no-selection");
    setSelectedStep(null);
  };

  if (selectedStep === null) {
    return <NoSelection text={t("onboarding.no_step_selected_message")} />;
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
            <p className="text-lg whitespace-pre-wrap">
              {currentStep.description}
            </p>
          </div>

          {currentStep.asset && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">
                {t("onboarding.icon_label")}
              </h4>
              <div className="w-32 h-32 rounded-lg overflow-hidden border">
                <img
                  src={currentStep.asset}
                  alt="Step icon"
                  className="w-full object-cover"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (isPending) {
    return <Loader text="Creating Step" />;
  }

  if (showErrorModal) {
    return (
      <ErrorModal
        errorText="Unknown error occurred"
        setShowModal={setErrorModal}
      />
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <StepHeader
          icon={<Monitor strokeWidth={3} />}
          title={t("onboarding.basic_step_header_title")}
          showDropdown={false}
          selector={
            <FormField
              control={form.control}
              name="step_type"
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a step type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="first">First type</SelectItem>
                    <SelectItem value="second">Second type</SelectItem>
                    <SelectItem value="third">Third type</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          }
        />

        <div className="space-y-6">
          <FormTextInput
            label={t("onboarding.page_title_label")}
            name="title"
            register={form.register}
            error={form.formState.errors.title?.message}
            placeholder={t("onboarding.page_title_placeholder")}
          />

          <div className="space-y-2">
            <FormTextArea
              label={t("onboarding.page_description_label")}
              name="description"
              register={form.register}
              error={form.formState.errors.description?.message}
              placeholder={t("onboarding.page_description_placeholder")}
            />
            {form.formState.errors.description && (
              <p className="text-sm text-destructive">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <LocalFileUpload
              text={t("onboarding.icon_label")}
              element="asset"
              handleLocalUpdate={(_, value) =>
                form.setValue("asset", value, {
                  shouldDirty: true,
                  shouldTouch: true,
                  shouldValidate: true,
                })
              }
            />
            {form.formState.errors.asset && (
              <p className="text-sm text-destructive">
                {form.formState.errors.asset.message}
              </p>
            )}
          </div>
        </div>
        <div className="mt-auto pt-4 border-t flex justify-end gap-3">
          <ButtonOutline onClick={handleCancel} type="button">
            {t("action.cancel_label")}
          </ButtonOutline>

          <ButtonOutline
            type="button"
            disabled={!form.formState.isValid}
            onClick={() => form.handleSubmit(onSubmit)()}
          >
            {t("action.next_label")}
          </ButtonOutline>
        </div>
      </form>
    </Form>
  );
};
