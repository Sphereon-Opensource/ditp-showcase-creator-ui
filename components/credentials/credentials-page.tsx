"use client";

import ButtonOutline from "../ui/button-outline";
import { useCredentials } from "@/hooks/use-credentials-store";
import { CredentialsDisplay } from "./credentials-display";
import { CredentialsForm } from "./credentials-form";
import { CredentialsImport } from "./credentials-import";

export const CredentialsPage = () => {
	const { mode, startImporting } = useCredentials();

	const handleImport = () => {
		startImporting();
	};

	return (
		<div className="flex flex-col">
			<div className="flex justify-between items-center px-6 py-2 mt-4">
				<p className="font-bold text-3xl">Credential Library</p>

				<ButtonOutline
					className="mt-4 border py-2 rounded-md font-bold opacity-50 cursor-not-allowed "
					disabled={true}
				>
					IMPORT CREDENTIAL
				</ButtonOutline>
			</div>

			<div className="flex gap-4 p-4">
				<div className="w-1/3 bg-[white]  dark:bg-dark-bg-secondary border shadow-md rounded-md flex flex-col">
					<CredentialsDisplay />
				</div>
				<div className="w-2/3 bg-white dark:bg-dark-bg-secondary border shadow-md rounded-md flex flex-col">
					{mode === "import" ? <CredentialsImport /> : <CredentialsForm />}
				</div>
			</div>
		</div>
	);
};
