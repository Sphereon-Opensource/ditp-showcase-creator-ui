import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { Credential, CredentialAttributeType } from "@/openapi-types";
import ButtonOutline from "../ui/button-outline";
import { useTranslations } from "next-intl";
import { useCredentials } from "@/hooks/use-credentials-store";
import { useCredentialDefinitions } from "@/hooks/use-credentials";
import Image from "next/image";
import { ensureBase64HasPrefix } from "@/lib/utils";

export const CredentialsDisplay = () => {
	const { setSelectedCredential, startCreating, viewCredential } =
		useCredentials();
	const [openId, setOpenId] = useState<string | null>(null);
	const t = useTranslations();
	const { data: credentials, isLoading, error } = useCredentialDefinitions();

	const handleSelectCredential = (credential: Credential) => {
		setSelectedCredential(credential);
		viewCredential(credential);
		setOpenId(credential.id);
	};

	const toggleDetails = (id: string) => {
		if (openId === id) {
			setOpenId(null);
			setSelectedCredential(null);
		} else {
			const credential = credentials?.credentialDefinitions?.filter(
				(credential: Credential) =>
					credential.id === id ? credentials.credentialDefinitions : null
			)[0];
			if (credential) handleSelectCredential(credential);
		}
	};

	const handleCreate = () => {
		startCreating();
		setOpenId(null);
	};

	return (
		<div className="w-full h-full bg-white dark:bg-dark-bg-secondary dark:border dark:border-dark-bg shadow-lg rounded-lg">
			<div className="p-4 border-b dark:border-dark-border">
				<h2 className="text-lg font-bold">
					{t("credentials.credential_title")}
				</h2>
				<p className="text-sm text-gray-400">
					{t("credentials.credential_subtitle")}
				</p>
			</div>

			<div className="mx-auto px-4 mt-4 mb-0">
				<div className="relative max-w-[550px] w-full">
					<Search
						className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
						size={22}
					/>
					<Input
						type="text"
						placeholder={t("action.search_label")}
						className="bg-white dark:bg-dark-bg w-full pl-10 pr-3 py-4 border rounded-md text-light-text dark:text-dark-text"
					/>
				</div>
			</div>

			<hr className="border-gray-200 dark:border-dark-border" />

			{isLoading && <p className="text-center py-4">Loading credentials...</p>}
			{error && (
				<p className="text-center text-red-500 py-4">
					Failed to load credentials.
				</p>
			)}

			{!isLoading && !error && credentials?.credentialDefinitions ? (
				credentials.credentialDefinitions.map((item) => (
					<div
						key={item.id}
						className="border-b dark:border-dark-border hover:bg-gray-100 dark:hover:bg-dark-bg"
					>
						{openId === item.id ? (
							<div className="p-3 bg-light-bg flex flex-col dark:bg-dark-bg items-center text-center">
								<div className="flex flex-col py-2 w-full items-center">
									<Image
										alt="Credential Icon"
										src={ensureBase64HasPrefix(item?.icon?.content) || "/assets/no-image.jpg"}	
										width={56}
										height={56}
										className="rounded-full shadow mb-4"
										style={{ aspectRatio: "1 / 1" }} 
									/>
									<span className="text-md font-semibold">{item.name}</span>
									<span className="text-sm mt-1 text-black dark:text-gray-400">
										Version {item.version}
									</span>

									<div className="flex flex-wrap gap-2 mt-2 text-xs">
										{item.credentialSchema?.attributes?.map(
											(attr: CredentialAttributeType) => (
												<span
													key={attr.id}
													className="bg-gray-200 dark:bg-dark-border px-2 py-1 rounded"
												>
													{attr.name}
												</span>
											)
										)}
									</div>
								</div>
							</div>
						) : (
							<div
								className="flex justify-between items-center p-3 cursor-pointer"
								onClick={() => toggleDetails(item.id)}
							>
								<div className="flex items-center gap-3">
									<Image
										src={ensureBase64HasPrefix(item?.icon?.content) || "/assets/no-image.jpg"}
										alt="Credential Icon"
										width={40}
										height={40}
										className="w-10 h-10 rounded-full shadow"
										style={{ aspectRatio: "1/1" }}
									/>
									<div>
										<p className="text-xs text-black dark:text-gray-200 font-bold">
											{item.name}
										</p>
										<p className="text-xs text-gray-500 dark:text-gray-400">
											{item.version}
										</p>
									</div>
								</div>

								<div>
									<p className="text-xs text-black dark:text-gray-200 font-bold">
										{t("credentials.attributes_label")}
									</p>
									<p className="text-xs text-gray-500 dark:text-gray-400">
										{item.credentialSchema?.attributes?.length || 0}
									</p>
								</div>
							</div>
						)}
					</div>
				))
			) : null}

			<div className="flex flex-col items-center p-4">
				<ButtonOutline
					className="mt-4 border w-full py-2 rounded-md font-bold"
					onClick={handleCreate}
				>
					CREATE CREDENTIAL
				</ButtonOutline>
			</div>
		</div>
	);
};
