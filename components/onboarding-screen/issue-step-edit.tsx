"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormTextArea, FormTextInput } from "@/components/text-input";
import { Edit, Monitor } from "lucide-react";
import { useOnboarding, useCreateScenario } from "@/hooks/use-onboarding";
import { IssueStepFormData, issueStepSchema } from "@/schemas/onboarding";
import { LocalFileUpload } from "./local-file-upload";
import { useTranslations } from "next-intl";
import StepHeader from "../step-header";
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
import { useHelpersStore } from "@/hooks/use-helpers-store";
import { DisplaySearchResults } from "./display-search-results";
import apiClient from "@/lib/apiService";

export const IssuanceStepAdd = () => {
  const t = useTranslations();

  const {
    screens,
    selectedStep,
    setSelectedStep,
    setStepState,
    stepState,
    updateStep,
    removeStep,
  } = useOnboarding();

  const router = useRouter();
  const { mutateAsync, isPending } = useCreateScenario();
  const currentStep = selectedStep !== null ? screens[selectedStep] : null;
  const { showcase, setScenarioIds } = useShowcaseStore();
  const { issuerId } = useHelpersStore();
  const personas = showcase.personas || [];

  const isEditMode = stepState === "editing-issue";
  const [showErrorModal, setErrorModal] = useState(false);
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [credential, setCredentials] = useState([]);

  const defaultValues = {
    title: currentStep?.title || "",
    description: currentStep?.description || "",
    asset: currentStep?.asset || undefined,
    // credentials: []
  };

  const form = useForm<IssueStepFormData>({
    resolver: zodResolver(issueStepSchema),
    defaultValues,
    mode: "all",
  });

  useEffect(() => {
    if (currentStep) {
      form.reset({
        title: currentStep.title,
        description: currentStep.description,
        asset: currentStep.asset || undefined,
        // credentials: [],
      });
    }
  }, [currentStep, form]);

  useEffect(() => {
    listCredentialDefinitions();
  }, []);

  const autoSave = debounce((data: IssueStepFormData) => {
    if (!currentStep || !form.formState.isDirty) return;

    const updatedStep = {
      ...currentStep,
      title: data.title,
      description: data.description,
      asset: data.asset || undefined,
      // credentials: data.credentials || [],
    };

    updateStep(selectedStep || 0, updatedStep);

    setTimeout(() => {
      toast.success("Changes saved", { duration: 1000 });
    }, 500);
  }, 800);

  useEffect(() => {
    const subscription = form.watch((value) => {
      if (form.formState.isDirty) {
        autoSave(value as IssueStepFormData);
      }
    });

    return () => subscription.unsubscribe();
  }, [form, autoSave]);

  const listCredentialDefinitions = async () => {
    try {
      const response: any = await apiClient.get("/credentials/definitions");
      setCredentials(response?.credentialDefinitions);
      return response;
    } catch (error) {
      toast.error("Error fetching credential definitions");
      setErrorModal(true);
      throw error;
    }
  };

  const searchCredential = (searchText: string) => {
    setSearchResults([]);
    if (!searchText) return;

    const searchUpper = searchText.toUpperCase();

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
    setSearchResults([]);
  };

  // const onSubmit = async (data: IssueStepFormData) => {
  //   autoSave.flush();

  //   sampleScenario.personas = personas;
  //   sampleScenario.issuer = issuerId;

  //   sampleScenario.steps.push({
  //     title: data.title,
  //     description: data.description,
  //     asset: data.asset || undefined,
  //     type: "SERVICE",
  //     order: currentStep?.order || 0,
  //     actions: [...new Set([sampleAction])],
  //     // credentials: data.credentials || [],
  //   });

  //   await mutateAsync(sampleScenario, {
  //     onSuccess: (data: unknown) => {
  //       toast.success("Scenario Created");

  //       setScenarioIds([
  //         (data as IssuanceScenarioResponseType).issuanceScenario.id,
  //       ]);

  //       router.push(`/showcases/create/publish`);
  //     },
  //     onError: (error) => {
  //       console.error("Error creating scenario:", error);
  //       setErrorModal(true);
  //     },
  //   });
  // };

  const onSubmit = async (data: IssueStepFormData) => {
    autoSave.flush();  
    const personaScenarios = personas.map(persona => {
      const scenarioForPersona = JSON.parse(JSON.stringify(sampleScenario));
      
      scenarioForPersona.personas = [persona];
      scenarioForPersona.issuer = issuerId;

      scenarioForPersona.steps = [...screens.map((screen, index) => ({
        title: screen.title,
        description: screen.description,
        asset: screen.asset || undefined,
        type: screen.type || "HUMAN_TASK",
        order: index,
        actions: screen.actions || [sampleAction],
      }))];
      
      const currentStepExists = scenarioForPersona.steps.some(
        (step: any) => step.title === data.title && step.description === data.description
      );
      
      if (!currentStepExists) {
        scenarioForPersona.steps.push({
          title: data.title,
          description: data.description,
          asset: data.asset || undefined,
          type: "HUMAN_TASK",
          order: currentStep?.order || scenarioForPersona.steps.length,
          actions: [sampleAction],
        });
      }
      
      return scenarioForPersona;
    });
  
    const scenarioIds = [];
    
    for (const scenario of personaScenarios) {
      try {
        const result = await mutateAsync(scenario);
        scenarioIds.push((result as IssuanceScenarioResponseType).issuanceScenario.id);
        toast.success(`Scenario created for ${scenario.personas[0]?.name || 'persona'}`);
      } catch (error) {
        console.error("Error creating scenario:", error);
        setErrorModal(true);
        return; // Stop if there's an error
      }
    }
  
    setScenarioIds(scenarioIds);
    router.push(`/showcases/create/scenarios`);
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
              {t("onboarding.issue_step_header_title")}
            </h3>
          </div>
          <Button
            variant="outline"
            onClick={() => setStepState("editing-issue")}
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

          {/* {currentStep.credentials && currentStep.credentials.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">
                {t("onboarding.credentials_label")}
              </h4>
              <ul className="list-disc list-inside">
                {currentStep.credentials.map((cred, index) => (
                  <li key={index}>{cred}</li>
                ))}
              </ul>
            </div>
          )} */}
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
          title={t("onboarding.issue_step_header_title")}
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
              searchResults={searchResults}
              addCredential={addCredential}
            />

            {/* 
              <DisplayAddedCredentials
              // selected credentials 
                credentials={form.watch("credentials")}
                removeCredential={removeCredential}
              /> 
              */}

            {form.formState.errors.credentials && (
              <p className="text-sm text-destructive">
                {form.formState.errors.credentials.message}
              </p>
            )}
          </div>
        </div>
        <div className="mt-auto pt-4 border-t flex justify-end gap-3">
          <Button 
            variant="outline"
            onClick={handleCancel}
            size="lg"
            type="button"
          >
            {t("action.cancel_label")}
          </Button>

          <Button
            variant="outline"
            size="lg"
            type="button"
            // disabled={!form.formState.isValid}
            onClick={() => form.handleSubmit(onSubmit)()}
          >
            {t("action.next_label")}
          </Button>
        </div>
      </form>
    </Form>
  );
};
