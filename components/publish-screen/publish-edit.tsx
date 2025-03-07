"use client";

import { useState } from "react";
import {
  Monitor,
  X,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { FormTextArea, FormTextInput } from "../text-input";
import { Form } from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LocalFileUpload } from "../onboarding-screen/local-file-upload";
import { IssueStepFormData, issueStepSchema } from "@/schemas/onboarding";
import StepHeader from "../step-header";
import ButtonOutline from "../ui/button-outline";
import { Link } from "@/i18n/routing";

export const PublishEdit = () => {
  const t = useTranslations();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const form = useForm<IssueStepFormData>({
    resolver: zodResolver(issueStepSchema),
    mode: "all",
  });

  const onSubmit = (data: IssueStepFormData) => {
    console.log(data);
  };

  const localJSON = {
    image: form.watch("image"),
    credentials: form.watch("credentials"),
  };

  const handleCancel = () => {
    form.reset();
    // setStepState("no-selection");
    // setSelectedStep(null);
  };

  return (
    <div className="flex flex-col min-h-screen p-6">
      <StepHeader
        icon={<Monitor strokeWidth={3} />}
        title={"Publish your showcase"}
      />

      {/* Form Section */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col flex-grow space-y-6"
        >
          <div className="space-y-6 flex-grow">
            <p className="font-bold text-xl">Publishing Information</p>
            <FormTextInput
              label="Showcase Name"
              name="title"
              register={form.register}
              error={form.formState.errors.title?.message}
              placeholder="Enter showcase name"
            />
            <FormTextArea
              label="Showcase Description"
              name="title"
              register={form.register}
              error={form.formState.errors.title?.message}
              placeholder="Enter showcase description"
            />
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
                localJSON={localJSON}
              />
            </div>
          </div>

          {/* Button Section - Always at the Bottom */}
          <div className="mt-auto pt-4 border-t flex justify-between">
            <div>
              <ButtonOutline onClick={handleCancel}>
                {t("action.cancel_label")}
              </ButtonOutline>
            </div>
            <div className="flex gap-3">
              <ButtonOutline className="" onClick={handleCancel}>
                {"SAVE AS DRAFT"}
              </ButtonOutline>
              <button
                // disabled={!form.formState.isDirty}
                onClick={() => setIsModalOpen(true)}
                className="px-6 bg-light-yellow py-2 rounded text-gray-700 font-bold"
              >
                {"PUBLISH FOR REVIEW"}
              </button>
            </div>
          </div>
        </form>
      </Form>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className=" flex flex-col justify-between bg-white p-4 rounded shadow-lg max-w-[40%] text-center">
            <div>
              <div className="flex items-center justify-between border-b border-gray-300 pb-4">
                <h3 className="text-lg font-semibold flex gap-2 items-center">
                  {"Submit for Review?"}
                </h3>
                <X
                  onClick={() => setIsModalOpen(false)}
                  size={22}
                  className="cursor-pointer ml-4"
                />
              </div>
              <div className="py-4">
                <p
                  className="mt-2 text-gray-600 text-start"
                  dangerouslySetInnerHTML={{
                    __html:
                      "Once submitted, you won’t be able to make further edits until the review is complete.",
                  }}
                />

                <p
                  className="text-start font-base"
                  dangerouslySetInnerHTML={{
                    __html: "<b>Do you want to proceed?</b>",
                  }}
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2 border-t pt-3 border-gray-300">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-700 rounded"
              >
                {t("action.cancel_label")}
              </button>
              <Link href={'/'}>
              <ButtonOutline
                className="bg-light-yellow border-light-yellow hover:bg-light-yellow"
                onClick={() => setIsModalOpen(false)}
              >
                {"CONFIRM & SUBMIT FOR REVIEW"}
              </ButtonOutline>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
