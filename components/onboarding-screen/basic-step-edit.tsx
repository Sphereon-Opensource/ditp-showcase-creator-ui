"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormTextArea, FormTextInput } from "@/components/text-input";
import { Edit, Monitor } from "lucide-react";
import {
  useOnboarding,
  useCreateIssuanceStep,
  useUpdateIssuanceStep,
} from "@/hooks/use-onboarding";
import { BasicStepFormData } from "@/schemas/onboarding";
import { basicStepSchema } from "@/schemas/onboarding";
import { LocalFileUpload } from "./local-file-upload";
import { useTranslations } from "next-intl";
import StepHeader from "../step-header";
import ButtonOutline from "../ui/button-outline";
import DeleteModal from "../delete-modal";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import apiClient from "@/lib/apiService";
import { ErrorModal } from "../error-modal";
import Loader from "../loader";
import { StepRequest, StepResponse, Step } from "@/openapi-types";

export const BasicStepEdit = () => {
  const t = useTranslations();
  const {
    screens,
    selectedStep,
    setSelectedStep,
    updateStep,
    setStepState,
    stepState,
    removeStep,
    scenarioId,
  } = useOnboarding();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { mutateAsync } = useCreateIssuanceStep();
  const { mutateAsync: mutateAsyncStep } = useUpdateIssuanceStep();
  const currentStep: any = selectedStep !== null ? screens[selectedStep] : null;
  const isEditMode = stepState === "editing-basic";
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showErrorModal, setErrorModal] = useState(false);
  const isEditing = !!currentStep?.id && currentStep.title.trim() !== "";
  const router = useRouter();
  const defaultValues = currentStep
    ? {
        title: currentStep.title,
        description: currentStep.description,
        image: currentStep.image || "",
      }
    : {
        title: "",
        description: "",
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
        description: currentStep.description,
        image: currentStep.image || "",
      });
    }
  }, [currentStep, form]);

  const onSubmit = (data: any) => {
    if (selectedStep !== null) {
      updateStep(selectedStep, {
        ...screens[selectedStep],
        ...data,
      });
      if (isEditing) {
        updateIssuanceStep(scenarioId, currentStep.id, data);
        setStepState("no-selection");
        setSelectedStep(null);
      } else {
        createIssuanceStep(scenarioId, data);
        setStepState("no-selection");
        setSelectedStep(null);
      }
    }
  };

  const deleteStep = async (stepId: any) => {
    try {
      // issuanceScenarioId
      if (!stepId) {
        console.error("Error: Step ID is required for deletion.");
        return;
      }

      console.log("Deleting persona with ID:", stepId);
      removeStep(stepId);

      // // Step 1: Send DELETE request to the API
      await apiClient.delete(
        `/scenarios/issuances/${"credential-issuance-flow"}/steps/${stepId}`
      );

      console.log("Persona deleted successfully!");
      setLoading(false);
      // // Step 2: Update the persona list after deletion
      // GetPersona();
    } catch (error) {
      console.error("Error deleting persona:", error);
      setLoading(false);
      setErrorModal(true);
    }
  };

  const createAsset = async (
    base64Content: string | undefined
  ): Promise<string | null> => {
    try {
      if (!base64Content) {
        console.warn("No content provided for asset creation.");
        return null;
      }

      const payload = {
        mediaType: "image/jpeg",
        content: base64Content,
        fileName: "Logo.png",
        description: "Step Logo",
      };

      const response: any = await apiClient.post<{ asset: { id: string } }>(
        "/assets",
        payload
      );
      console.log("Asset Created:", response);

      return response.asset.id;
    } catch (error) {
      console.error("Error creating asset:", error);
      return null;
    }
  };

  const createIssuanceStep = async (issuanceFlowId: string, formdata: any) => {
    try {
      console.log('FormData',formdata);
      // setLoading(true);
      // const showcaseSlug = "credential-issuance-flow"; // Replace with actual slug
      // const bodyAssetId =
      //   formdata.image !== "" ? await createAsset(formdata.image) : null;
      // const stepData: typeof StepRequest._type = {
      //   title: formdata.title,
      //   description: formdata.description,
      //   order: 7,
      //   type: "HUMAN_TASK",
      //   asset: bodyAssetId ?? "",
      //   actions: [
      //     {
      //       title: "example_title1",
      //       actionType: "ARIES_OOB",
      //       text: "example_text1",
      //       proofRequest: {
      //         attributes: {
      //           attribute1: {
      //             attributes: ["attribute1", "attribute2"],
      //             restrictions: ["restriction1", "restriction2"],
      //           },
      //         },
      //         predicates: {
      //           predicate1: {
      //             name: "example_name",
      //             type: "example_type",
      //             value: "example_value",
      //             restrictions: ["restriction1", "restriction2"],
      //           },
      //         },
      //       },
      //     },
      //   ],
      // };

      // console.log(
      //   `Creating issuance step for flow: ${issuanceFlowId} with data:`,
      //   stepData
      // );
      // console.log("Slug", showcaseSlug);
      // const response = await mutateAsync(
      //   { slug: showcaseSlug, data: stepData },
      //   {
      //     onSuccess: (data) => {
      //       console.log("Issuance Step Created:", data);
      //     },
      //   }
      // );
      // setLoading(false);
      // return response;
    } catch (error) {
      console.error("Error creating issuance step:", error);
      setLoading(false);
      setErrorModal(true);
    }
  };

  const updateIssuanceStep = async (
    issuanceFlowId: string,
    stepId: string,
    formdata: any
  ) => {
    try {
      console.log("Step ID ", stepId);
      const scenarioSlug = "credential-issuance-flow";
      const stepSlug: any = currentStep?.id;
      console.log("Form data", formdata);
      const bodyAssetId =
        formdata.image !== "" ? await createAsset(formdata.image) : null;
      let stepData: typeof StepRequest._type = {
        title: formdata.title,
        description: formdata.description,
        order: 1,
        type: "HUMAN_TASK",
        asset: bodyAssetId ?? "",
        actions: [
          {
            title: "example_title1",
            actionType: "ARIES_OOB",
            text: "example_text1",
            proofRequest: {
              attributes: {
                attribute1: {
                  attributes: ["attribute1", "attribute2"],
                  restrictions: ["restriction1", "restriction2"],
                },
              },
              predicates: {
                predicate1: {
                  name: "example_name",
                  type: "example_type",
                  value: "example_value",
                  restrictions: ["restriction1", "restriction2"],
                },
              },
            },
          },
        ],
      };
      console.log(
        `Updating issuance step ${stepId} for flow ${issuanceFlowId} with data:`,
        stepData
      );
      // const response = await apiClient.put(`/scenarios/issuances/${issuanceFlowId}/steps/${stepId}`, stepData);
      // console.log("Issuance Step Updated:", response);
      const response = await mutateAsyncStep(
        { slug: scenarioSlug, stepSlug, data: stepData },
        {
          onSuccess: (data: any) => {
            console.log("Issuance Step Upadted:", data);
          },
        }
      );
      setLoading(false);
      return response;
    } catch (error) {
      console.error("Error updating issuance step:", error);
      setLoading(false);
      setErrorModal(true);
    }
  };

  const createIssuanceStepAction = async (
    issuanceFlowId: string,
    stepId: string,
    actionData: any
  ) => {
    try {
      console.log(
        `Creating action for step ${stepId} in flow ${issuanceFlowId} with data:`,
        actionData
      );
      const response = await apiClient.post(
        `/scenarios/issuances/${issuanceFlowId}/steps/${stepId}/actions`,
        actionData
      );
      console.log("Issuance Step Action Created:", response);
      setLoading(false);
      return response;
    } catch (error) {
      console.error("Error creating issuance step action:", error);
      setLoading(false);
      setErrorModal(true);
    }
  };

  const updateIssuanceStepAction = async (
    issuanceFlowId: string,
    stepId: string,
    actionId: string,
    actionData: any
  ) => {
    try {
      console.log(
        `Updating action ${actionId} for step ${stepId} in flow ${issuanceFlowId} with data:`,
        actionData
      );
      const response = await apiClient.put(
        `/scenarios/issuances/${issuanceFlowId}/steps/${stepId}/actions/${actionId}`,
        actionData
      );
      console.log("Issuance Step Action Updated:", response);
      setLoading(false);
      return response;
    } catch (error) {
      console.error("Error updating issuance step action:", error);
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

  const Pathname = pathname.split("/")[2];

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
      {showErrorModal && (
        <ErrorModal
          errorText="Unknown error occurred"
          setShowModal={setErrorModal}
        />
      )}
      {loading ? (
        <Loader text="Creating Step" />
      ) : (
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
              <div className="space-y-6 h-screen">
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
                    element="image"
                    handleLocalUpdate={(_, value) =>
                      form.setValue("image", value, {
                        shouldDirty: true,
                        shouldTouch: true,
                        shouldValidate: true,
                      })
                    }
                    localJSON={{
                      image:
                        form.watch("image") ||
                        currentStep?.asset?.content ||
                        "",
                    }}
                    // localJSON={{ image: form.watch("image") }}
                  />
                  {form.formState.errors.image && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.image.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-auto pt-4 border-t flex justify-end gap-3">
                <ButtonOutline onClick={handleCancel} type="button">
                  {t("action.cancel_label")}
                </ButtonOutline>
                <ButtonOutline type="submit">{"Save Changes"}</ButtonOutline>

                {/* <Link href={`${Pathname}/scenarios`}> */}
                <ButtonOutline
                // type="submit"
                // disabled={!form.formState.isDirty || !form.formState.isValid}
                >
                  {t("action.next_label")}
                </ButtonOutline>
                {/* </Link> */}
              </div>
            </form>
          </Form>
          <DeleteModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onDelete={() => {
              setIsModalOpen(false);
              deleteStep(currentStep?.id);
            }}
            header="Are you sure you want to delete this page?"
            description="Are you sure you want to delete this page?"
            subDescription="<b>This action cannot be undone.</b>"
            cancelText="CANCEL"
            deleteText="DELETE"
          />
        </>
      )}
    </>
  );
};
