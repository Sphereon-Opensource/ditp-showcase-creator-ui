import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormTextInput } from "../text-input";
import { Edit } from "lucide-react";
import { useShowcaseStore } from "@/hooks/use-showcase-store";
import { useCredentials } from "@/hooks/use-credentials";
import { CredentialFormData, credentialSchema } from "@/schemas/credential";
import { CredentialAttributes } from "./components/credential-attribute";
import { useTranslations } from "next-intl";
import ButtonOutline from "../ui/button-outline";

// Accept selectedCredential as a prop
interface CredentialsFormProps {
	selectedCredential: any; // Define the correct type if you have one
}

export const CredentialsForm = ({
	selectedCredential,
}: CredentialsFormProps) => {
	const t = useTranslations();
	const {
		showcaseJSON,
		selectedCharacter,
		updateCredential,
		createCredential,
	} = useShowcaseStore();
	const { mode, cancel, startEditing } = useCredentials();

	// Grab the selected credential from showcaseJSON
	const existingCredential = selectedCredential
		? showcaseJSON.personas[selectedCharacter].credentials[selectedCredential]
		: null;

	const defaultValues = existingCredential
		? {
				name: existingCredential.name,
				issuer_name: existingCredential.issuer_name,
				version: existingCredential.version,
				icon: existingCredential.icon,
				attributes: existingCredential.attributes.map((attr) => ({
					...attr,
					type:
						(attr.type as "string" | "float" | "date" | "int" | "bool") ||
						"string",
				})),
		  }
		: {
				name: "",
				issuer_name: "",
				version: "",
				icon: "",
				attributes: [],
		  };

	const form = useForm<CredentialFormData>({
		resolver: zodResolver(credentialSchema),
		defaultValues,
		mode: "onChange",
	});

	useEffect(() => {
		if (existingCredential && mode === "edit") {
			form.reset({
				name: existingCredential.name,
				issuer_name: existingCredential.issuer_name,
				version: existingCredential.version,
				icon: existingCredential.icon,
				attributes: existingCredential.attributes.map((attr) => ({
					...attr,
					type:
						(attr.type as "string" | "float" | "date" | "int" | "bool") ||
						"string",
				})),
			});
		} else if (mode === "create") {
			form.reset(defaultValues);
		}
	}, [selectedCredential, existingCredential, form, mode]);

	const onSubmit = (data: CredentialFormData) => {
		if (mode === "create" && selectedCredential) {
			createCredential(selectedCredential, data);
		} else if (mode === "edit" && selectedCredential) {
			updateCredential(selectedCredential, data);
		}
		cancel();
	};

	const handleCancel = () => {
		form.reset();
		cancel();
	};

	if (mode === "view" && existingCredential) {
		return (
			<div className="space-y-6">
				<div className="flex justify-between items-center">
					<div>
						<h3 className="text-2xl font-bold text-foreground">
							{t("credentials.details_header_title")}
						</h3>
					</div>
					<Button
						variant="outline"
						onClick={() => startEditing(selectedCredential)}
						className="flex items-center gap-2"
					>
						<Edit className="h-4 w-4" />
						{t("action.edit_label")}
					</Button>
				</div>
				<hr />
				<div className="space-y-6">
					<div className="grid grid-cols-2 gap-4">
						<div>
							<h4 className="text-sm font-medium text-muted-foreground">
								{t("credentials.credential_name_label")}
							</h4>
							<p className="text-lg">{existingCredential.name}</p>
						</div>
						<div>
							<h4 className="text-sm font-medium text-muted-foreground">
								{t("credentials.issuer_name_label")}
							</h4>
							<p className="text-lg">{existingCredential.issuer_name}</p>
						</div>
					</div>

					<CredentialAttributes
						mode="view"
						form={form}
						attributes={existingCredential.attributes}
					/>
				</div>
			</div>
		);
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="my-4 flex flex-col"
			>
				<div className="flex items-center gap-x-2 px-4 py-3 border-b border-gray-200">
					<h3 className="text-lg font-bold text-foreground">
						{mode === "create"
							? t("credentials.add_header_title")
							: t("credentials.edit_header_title")}
					</h3>
				</div>

				<div className="flex-1 overflow-auto p-4 space-y-4">
					<div className="grid grid-cols-2 gap-4">
						{mode !== "view" && (
							<>
								<FormTextInput
									label={t("credentials.credential_name_label")}
									name="name"
									register={form.register}
									error={form.formState.errors.name?.message}
									placeholder={t("credentials.credential_name_placeholder")}
								/>
								<FormTextInput
									label={t("credentials.version_label")}
									name="version"
									register={form.register}
									error={form.formState.errors.version?.message}
									placeholder={t("credentials.version_placeholder")}
								/>
							</>
						)}
						{mode === "view" && existingCredential && (
							<>
								<div>
									<h4>{t("credentials.credential_name_label")}</h4>
									<p>{existingCredential.name}</p>
								</div>
								<div>
									<h4>{t("credentials.version_label")}</h4>
									<p>{existingCredential.version}</p>
								</div>
							</>
						)}
					</div>

					<CredentialAttributes mode={mode as "create" | "edit"} form={form} />
				</div>

				<div className="sticky bottom-0 bg-white dark:bg-dark-bg dark:border-gray-600 border-t border-gray-200 p-4 flex justify-end gap-4">
					<ButtonOutline type="button" onClick={handleCancel}>
						{t("action.cancel_label")}
					</ButtonOutline>
					<ButtonOutline
						type="submit"
						disabled={
							mode === "edit"
								? !form.formState.isValid
								: !form.formState.isDirty || !form.formState.isValid
						}
					>
						{mode === "create"
							? t("action.create_label")
							: t("action.save_label")}
					</ButtonOutline>
				</div>
			</form>
		</Form>
	);
};
