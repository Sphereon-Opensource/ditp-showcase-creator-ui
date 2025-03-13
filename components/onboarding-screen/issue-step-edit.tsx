"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { FormTextArea, FormTextInput } from "@/components/text-input";
import { LocalFileUpload } from "@/components/onboarding-screen/local-file-upload";
import { DisplaySearchResults } from "./display-search-results";
import { DisplayAddedCredentials } from "./display-added-credentials";
import { useShowcaseStore } from "@/hooks/use-showcase-store";
import { useOnboarding } from "@/hooks/use-onboarding";
import { IssueStepFormData, issueStepSchema } from "@/schemas/onboarding";
import {
  Monitor,
} from "lucide-react";
import { useTranslations } from "next-intl";
import StepHeader from "../step-header";
import ButtonOutline from "../ui/button-outline";
import DeleteModal from "../delete-modal";
import apiClient from "@/lib/apiService";
import { ErrorModal } from "../error-modal";
import Loader from "../loader";
import { toast } from "sonner";
import { IssuanceScenario } from "@/openapi-types";

export function IssueStepEdit() {
  const t = useTranslations();
  const { showcaseJSON, selectedCharacter } = useShowcaseStore();
  const { selectedStep, screens, updateStep, setSelectedStep, setStepState,removeStep } =
    useOnboarding();
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showErrorModal, setErrorModal] = useState(false);
  const [credential,setCredentials] = useState([]);
  const currentStep = selectedStep !== null ? screens[selectedStep] : null;

  const form = useForm<IssueStepFormData>({
    resolver: zodResolver(issueStepSchema),
    mode: "all",
    defaultValues: {
      credentials:['student_card']
    }
  });

  useEffect(() => {
    if (currentStep) {
      form.reset({
        title: currentStep.title,
        description: currentStep.description,
        image: currentStep.image || "",
        credentials: currentStep.credentials || [],
      });
    }
  }, [currentStep, form.reset]);

  useEffect(() => {
    listCredentialDefinitions();
  },[])

  const searchCredential = (searchText: string) => {
    setSearchResults([]);
    if (!searchText) return;
  
    const searchUpper = searchText.toUpperCase();
  
    // Ensure `credential` is an array before filtering
    if (!Array.isArray(credential)) {
      console.error("Invalid credential data format");
      return;
    }
  
    const results = credential.filter((cred: any) =>
      cred.name.toUpperCase().includes(searchUpper)
    );

    setSearchResults(results);
  };

  const addCredential = (credentialId: string) => {
    const currentCredentials = form.getValues("credentials") || [];
    if (!currentCredentials.includes(credentialId)) {
      form.setValue("credentials", [...currentCredentials, credentialId], {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
    }
    // setIssuerId() // set issuer id here to send in issuance flow
    setSearchResults([]);
  };

  const removeCredential = (credentialId: string) => {
    const currentCredentials = form.getValues("credentials") || [];
    form.setValue(
      "credentials",
      currentCredentials.filter((id) => id !== credentialId),
      {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      }
    );
  };

  const createIssuanceStep = async (issuanceFlowId: string, stepData: any) => {
    try {
      console.log(`Creating issuance step for flow: ${issuanceFlowId} with data:`, stepData);
      const response = await apiClient.post(`/scenarios/issuances/${issuanceFlowId}/steps`, stepData);
      console.log("Issuance Step Created:", response);
      setLoading(false)
      return response;
    } catch (error) {
      console.error("Error creating issuance step:", error);
      setLoading(false)
      setErrorModal(true);
    }
  };
  
  const updateIssuanceStep = async (issuanceFlowId: string, stepId: string, stepData: any) => {
    try {
      console.log(`Updating issuance step ${stepId} for flow ${issuanceFlowId} with data:`, stepData);
      const response = await apiClient.put(`/scenarios/issuances/${issuanceFlowId}/steps/${stepId}`, stepData);
      console.log("Issuance Step Updated:", response);
      setLoading(false)
      return response;
    } catch (error) {
      console.error("Error updating issuance step:", error);
      setLoading(false)
      setErrorModal(true);
    }
  };
  
  const createIssuanceStepAction = async (issuanceFlowId: string, stepId: string, actionData: any) => {
    try {
      console.log(`Creating action for step ${stepId} in flow ${issuanceFlowId} with data:`, actionData);
      const response = await apiClient.post(`/scenarios/issuances/${issuanceFlowId}/steps/${stepId}/actions`, actionData);
      console.log("Issuance Step Action Created:", response);
      setLoading(false)
      return response;
    } catch (error) {
      console.error("Error creating issuance step action:", error);
      setLoading(false)
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
      console.log(`Updating action ${actionId} for step ${stepId} in flow ${issuanceFlowId} with data:`, actionData);
      const response = await apiClient.put(
        `/scenarios/issuances/${issuanceFlowId}/steps/${stepId}/actions/${actionId}`,
        actionData
      );
      console.log("Issuance Step Action Updated:", response);
      setLoading(false)
      return response;
    } catch (error) {
      console.error("Error updating issuance step action:", error);
    }
  };
  

  const onSubmit = (data: typeof IssuanceScenario._type) => {
    if (selectedStep === null) return;

    const updatedStep = {
      ...screens[selectedStep],
      ...data,
      screenId: screens[selectedStep].id,
    };

    updateStep(selectedStep, updatedStep);
    setStepState("no-selection");
    setSelectedStep(null);
  };

  const listCredentialDefinitions = async () => {
    try {
      const response:any = await apiClient.get("/credentials/definitions");
      setCredentials(response?.credentialDefinitions);
      
      return response; // Return the list of credential definitions
    } catch (error) {
      toast.error("Error fetching credential definitions");
      setErrorModal(true);
      throw error;
    }
  };
  

  const deleteStep = async (stepId:any) => {
    try {
      if (!stepId) {
        toast.error("Error: Step ID is required for deletion.");
        return;
      }
      removeStep(stepId);
      await apiClient.delete(`/scenarios/issuances/${'credential-issuance-flow'}/steps/${stepId}`);

      toast.success("Persona deleted successfully!");

    } catch (error) {
      toast.error("Error deleting persona");
      setLoading(false)
      setErrorModal(true);
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

  const localJSON = {
    image: form.watch("image"),
    credentials: form.watch("credentials"),
  };

  return (
    <>
    {showErrorModal && <ErrorModal errorText="Unknown error occurred" setShowModal={setErrorModal}/>}
    {loading ? (
        <Loader text="Creating Step" />
      ) : (
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <StepHeader
          icon={<Monitor strokeWidth={3} />}
          title={t("onboarding.issue_step_header_title")}
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
              localJSON={{ image: form.watch("image") || currentStep?.asset?.content || "" }}
            />
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-2xl font-bold">
                {t("onboarding.add_your_credential_label")}
              </p>
              <hr className="border border-black" />
            </div>

            <div className="mt-6">
              <p className="text-md font-bold">
                {t("onboarding.search_credential_label")}
              </p>
              <div className="flex flex-row justify-center items-center my-4">
                <div className="relative w-full">
                  <input
                    className="dark:text-dark-text dark:bg-dark-input rounded pl-2 pr-10 mb-2 w-full border"
                    placeholder={t("onboarding.search_credential_placeholder")}
                    type="text"
                    onChange={(e) => searchCredential(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <DisplaySearchResults
              selectedCharacter={selectedCharacter}
              showcaseJSON={showcaseJSON}
              searchResults={searchResults}
              addCredential={addCredential}
            />

            <DisplayAddedCredentials
              selectedCharacter={selectedCharacter}
              showcaseJSON={showcaseJSON}
              localJSON={localJSON}
              removeCredential={removeCredential}
            />

            {form.formState.errors.credentials && (
              <p className="text-sm text-destructive">
                {form.formState.errors.credentials.message}
              </p>
            )}
          </div>
        <div className="mt-auto pt-4 border-t flex justify-end gap-3">
          <ButtonOutline onClick={handleCancel}>
            {t("action.cancel_label")}
          </ButtonOutline>
          <ButtonOutline onClick={handleCancel} disabled={!form.formState.isDirty}>
            {t("action.next_label")}
          </ButtonOutline>
        </div>
        </div>
      </form>
      {/* Delete Modal */}
      <DeleteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onDelete={() => {
          console.log("Item Deleted");
          setIsModalOpen(false);
          deleteStep(currentStep?.id);
        }}
        header="Are you sure you want to delete this page?"
        description="Are you sure you want to delete this page?"
        subDescription="<b>This action cannot be undone.</b>"
        cancelText="CANCEL"
        deleteText="DELETE"
      />
    </Form>
      )}
    </>
  );
}
