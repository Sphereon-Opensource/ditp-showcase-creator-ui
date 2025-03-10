"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormTextArea, FormTextInput } from "@/components/text-input";
import { Edit } from "lucide-react";
import { useOnboarding } from "@/hooks/use-onboarding";
import { BasicStepFormData } from "@/schemas/onboarding";
import { basicStepSchema } from "@/schemas/onboarding";
import { LocalFileUpload } from "./local-file-upload";

export const BasicStepEdit = () => {
  const { 
    screens,
    selectedStep, 
    setSelectedStep,
    updateStep,
    setStepState,
    stepState
  } = useOnboarding();

  const currentStep = selectedStep !== null ? screens[selectedStep] : null;
  const isEditMode = stepState === "editing-basic";

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
    mode: 'all',
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
      setStepState('no-selection');
      setSelectedStep(null);
    }
  };

  const handleCancel = () => {
    form.reset();
    setStepState('no-selection');
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
            <p className="text-foreground text-sm">Onboarding</p>
            <h3 className="text-2xl font-bold text-foreground">
              Step Details
            </h3>
          </div>
          <Button
            variant="outline"
            onClick={() => setStepState("editing-basic")}
            className="flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            Edit
          </Button>
        </div>
        <hr />

        <div className="space-y-6">
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">
              Page Title
            </h4>
            <p className="text-lg">{currentStep.title}</p>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">
              Page Description
            </h4>
            <p className="text-lg whitespace-pre-wrap">{currentStep.text}</p>
          </div>

          {currentStep.image && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">
                Icon
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <p className="text-foreground text-sm">Onboarding</p>
          <h3 className="text-2xl font-bold text-foreground">
            Edit a Basic Step
          </h3>
        </div>
        <hr />

        <div className="space-y-6">
          <FormTextInput
            label="Page Title"
            name="title"
            register={form.register}
            error={form.formState.errors.title?.message}
            placeholder="Enter page title"
          />

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Page Description
            </label>
            <FormTextArea
              label="Page Description"
              name="text"
              register={form.register}
              error={form.formState.errors.text?.message}
              placeholder="Enter page description"
            />
            {form.formState.errors.text && (
              <p className="text-sm text-destructive">
                {form.formState.errors.text.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <LocalFileUpload
              text="Icon"
              element="image"
              handleLocalUpdate={(_, value) => form.setValue("image", value, {
                shouldDirty: true,
                shouldTouch: true,
                shouldValidate: true,
              })}
              localJSON={{ image: form.watch("image") }}
            />
            {form.formState.errors.image && (
              <p className="text-sm text-destructive">
                {form.formState.errors.image.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={!form.formState.isDirty || !form.formState.isValid}
          >
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
};