"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useCredentials } from "@/hooks/use-credentials";
import { CredentialFormData } from "@/schemas/credential";
import { Form } from "@/components/ui/form";
import { FormTextInput } from "../text-input";
import { FileUploadFull } from "../file-upload";
import { CredentialAttributes } from "./components/credential-attribute";
import ButtonOutline from "../ui/button-outline";
import { credentialDefinition } from "@/schemas/credential";
import { Monitor } from "lucide-react";
import StepHeaderCredential from "../showcases-screen/step-header-credential";
import apiClient from "@/lib/apiService";
import { ErrorModal } from "../error-modal";
import DeleteModal from "../delete-modal";
import { ensureBase64HasPrefix } from "@/lib/utils";
import { toast } from "sonner";

export const CredentialsForm = () => {
	const { selectedCredential, mode, deleteCredential, issuers, fetchIssuers } =
		useCredentials();
	const t = useTranslations();
	const [formData, setFormData] = useState({
		name: "",
		revocation: false,
	});
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [credentialLogo, setCredentialLogo] = useState<string>();
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const [showErrorModal, setErrorModal] = useState(false);
	const form = useForm<CredentialFormData>({
		resolver: zodResolver(credentialDefinition), // Use the schema here, not the type
		mode: "onChange",
	});

	useEffect(() => {
		console.log("Fetching issuers...");
		useCredentials.getState().fetchIssuers();
	}, []);

	const handleCancel = () => {};

	const handleDeleteCredential = async () => {
		try {
			setIsSubmitting(true);
			setError(null);

		} catch (error) {
			console.error("Error during delete:", error);
			setError("There was an error while deleting the credential.");
		} finally {
			setIsSubmitting(false);
		}
	};

	const createSchemaAndThenDefinition = async () => {
		try {
			let Credentials: any = form.getValues();

			// Step 1: Create Schema
			let payload = {
				name: Credentials.name || "example_name",
				version: Credentials.version || "example_version",
				identifierType: "DID",
				identifier: "did:sov:XUeUZauFLeBNofY3NhaZCB",
				attributes: Credentials.attributes.map((item: any) => ({
					name: item.name,
					value: item.value,
					type: item.type.toUpperCase(),
				})),
			};

			const schemaResponse = await apiClient.post<any>(
				"/credentials/schemas",
				payload
			);

			const schemaId = schemaResponse.credentialSchema.id;

			// Step 2: Upload Asset using the store's createAsset
			let assetId = "";
			if (credentialLogo) {
				const base64Content = credentialLogo;

				const asset: any = {
					mediaType: "image/png",
					content: base64Content,
					fileName: "CredentialLogo.png",
					description: "Credential icon image",
				};
				const bodyResponse: any = await apiClient.post<{ id: string }>(
					"/assets",
					asset
				);
				assetId = bodyResponse ? bodyResponse.asset.id : "";
			}

			// Step 3: Create Credential Definition with Schema ID and Asset ID
			const credentialDefinitionResponse =
				await apiClient.post<CredentialFormData>("/credentials/definitions", {
					name: Credentials.name || "example_name",
					version: Credentials.version || "example_version",
					icon: assetId ? assetId : "",
					identifierType: "DID",
					identifier: "did:sov:XUeUZauFLeBNofY3NhaZCB",
					type: "ANONCRED",
					credentialSchema: schemaId,
					revocation: formData.revocation
						? {
								title: "example_revocation_title",
								description: "example_revocation_description",
						  }
						: null,
				});

			toast.success("Credential Definition created successfully!");
			return credentialDefinitionResponse;
		} catch (error) {
			toast.error("Error occurred while creating the credential."); 
			throw error;
		}
	};

	const handleCreateCredential = async () => {
		try {
			setIsSubmitting(true);
			setError(null);
			await createSchemaAndThenDefinition();

			toast.success("Credential created successfully!");

			form.reset();
			window.location.reload();
		} catch (error) {
			setError("There was an error while creating the credential.");
			toast.error("There was an error while creating the credential.");
		} finally {
			setIsSubmitting(false);
		}
	};

	useEffect(() => {
		if (mode === "create") {
			form.reset();
		}
	}, [mode, form]);

	useEffect(() => {
		if (mode === "create" && issuers.length === 0) {
			fetchIssuers();
		}
	}, [mode, issuers, fetchIssuers]);

	if (mode === "view" && selectedCredential) {
		const credentialDefinition = selectedCredential;

		const formattedDate = new Date(
			selectedCredential?.createdAt
		).toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});

		const formattedTime = new Date(
			selectedCredential?.createdAt
		).toLocaleTimeString("en-US", {
			hour: "numeric",
			minute: "numeric",
		});

		return (
			<div className=" my-4">
				<div className="px-4">
					<StepHeaderCredential
						icon={<Monitor strokeWidth={3} />}
						title={t("credentials.view_header_title")}
						onActionClick={(action) => {
							switch (action) {
								case "delete":
									setIsOpen(true);
									setIsModalOpen(true);
									setIsOpen(false);
									break;
								default:
									console.log("Unknown action");
							}
						}}
					/>
				</div>
				<div className="space-y-6">
					{/* Basic Information */}
					<div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 px-6  ">
						{credentialDefinition.icon && (
							<div className="px-2 py-2">
								<img
									src={
										ensureBase64HasPrefix(
											credentialDefinition?.icon?.content
										) || ""
									}
									alt="Credential Icon"
									className="w-24 h-24 rounded-full shadow object-cover"
								/>
							</div>
						)}
						{[
							{
								label: t("credentials.credential_name_label"),
								value: credentialDefinition?.name,
							},
							{
								label: "Created At:",
								value: `${formattedDate} at ${formattedTime}`,
							},

							{
								label: t("credentials.issuer_name_label"),
								value:
									issuers && issuers.length > 0
										? issuers[0].name
										: "Loading...",
							},
							{
								label: t("credentials.version_label"),
								value: credentialDefinition?.version,
							},
							{
								label: t("credentials.schema_id_label"),
								value: credentialDefinition?.id,
							},
							{
								label: t("credentials.identifier_type_label"),
								value: credentialDefinition?.identifierType,
							},
							{
								label: t("credentials.identifier_label"),
								value: credentialDefinition?.identifier,
							},
							{
								label: t("credentials.type_label"),
								value: credentialDefinition?.type,
							},
							{
								label: t("credentials.revocation_label"),
								value: credentialDefinition?.revocation?.description
									? "Yes"
									: "No",
							},
						].map((item, index) => (
							<div
								key={index}
								className="flex flex-col p-4  text-foreground space-y-2"
							>
								<h6 className="text-md font-semibold text-foreground">
									{item.label}
								</h6>
								<p className="text-sm font-medium text-foreground/80 break-words">
									{item.value || "—"}
								</p>
							</div>
						))}
					</div>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6 px-6 ">
						{/* Displaying Attributes */}
						{credentialDefinition?.credentialSchema &&
							credentialDefinition.credentialSchema.attributes?.length > 0 && (
								<div className="space-y-4">
									<CredentialAttributes
										mode="view"
										form={form}
										attributes={
											credentialDefinition.credentialSchema.attributes
										}
									/>
								</div>
							)}
					</div>

					<div
						className=" mx-10  flex items-center bg-[#F7F9FC] dark:bg-[#202223] dark:border-dark-border  border border-gray-300 rounded text-foreground text-sm font-bold px-4 py-3"
						role="alert"
					>
						<svg
							className="fill-current text-[#202223] dark:text-white w-4 h-4 mr-2"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 20 20"
						>
							<path d="M12.432 0c1.34 0 2.01.912 2.01 1.957 0 1.305-1.164 2.512-2.679 2.512-1.269 0-2.009-.75-1.974-1.99C9.789 1.436 10.67 0 12.432 0zM8.309 20c-1.058 0-1.833-.652-1.093-3.524l1.214-5.092c.211-.814.246-1.141 0-1.141-.317 0-1.689.562-2.502 1.117l-.528-.88c2.572-2.186 5.531-3.467 6.801-3.467 1.057 0 1.233 1.273.705 3.23l-1.391 5.352c-.246.945-.141 1.271.106 1.271.317 0 1.357-.392 2.379-1.207l.6.814C12.098 19.02 9.365 20 8.309 20z" />
						</svg>
						<p className="font-normal text-foreground/80">
							<span className="font-semibold">
								This credential is now available for use! <br />
							</span>
							You can select this credential when creating a{" "}
							<span className="font-semibold">Showcase </span>and assign it to
							any <span className="font-semibold">persona</span> in your
							scenario.
						</p>
					</div>
				</div>
				<DeleteModal
					isOpen={isModalOpen}
					onClose={() => setIsModalOpen(false)}
					onDelete={handleDeleteCredential}
					header="Are you sure you want to delete this credential?"
					description="Are you sure you want to delete this credential?"
					subDescription="<b>This action cannot be undone.</b>"
					cancelText="CANCEL"
					deleteText="DELETE"
				/>
			</div>
		);
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(handleCreateCredential)}
				className="my-4 flex flex-col"
			>
				<div className="flex items-center gap-x-2 px-4 py-3 border-b border-gray-200 dark:border-dark-border">
					<h3 className="text-lg font-bold text-foreground">
						{mode === "create"
							? t("credentials.add_header_title")
							: t("credentials.view_header_title")}
					</h3>
				</div>
				<div className="flex-1 overflow-auto p-4 space-y-4">
					{mode === "create" && (
						<>
							<div className="grid grid-cols-2 gap-4">
								<FormTextInput
									label={t("credentials.credential_name_label")}
									name="name"
									register={form.register}
									error={form.formState.errors.name?.message?.toString()}
									placeholder={t("credentials.credential_name_placeholder")}
								/>
								<FormTextInput
									label={t("credentials.version_label")}
									name="version"
									register={form.register}
									error={form.formState.errors.version?.message?.toString()}
									placeholder={t("credentials.version_placeholder")}
								/>
							</div>
							<div className="grid grid-cols-1 gap-4 mt-6">
								<div className="text-start">
									<FileUploadFull
										text={t("credentials.image_label")}
										element="headshot_image"
										// handleFileUpload={handleFileUpload}
										handleJSONUpdate={(imageType, imageData) => {
											setCredentialLogo(imageData);
										}}
									/>
								</div>
							</div>
						</>
					)}
					<CredentialAttributes mode="create" form={form} />
				</div>
				<div className="flex justify-end gap-4 mt-6 px-4">
					<ButtonOutline type="button" onClick={handleCancel}>
						{t("action.cancel_label")}
					</ButtonOutline>
					<ButtonOutline
						onClick={handleCreateCredential}
						disabled={isSubmitting} // Disable the button while submitting
					>
						{isSubmitting ? "Creating..." : "Create Credential"}
					</ButtonOutline>
				</div>
			</form>{" "}
		</Form>
	);
};
