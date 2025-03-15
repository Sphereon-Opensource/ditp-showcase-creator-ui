import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "../ui/input";
import ButtonOutline from "../ui/button-outline";
import { useTranslations } from "next-intl";
import { useCredentials } from "@/hooks/use-credentials";
import { CredentialFormData, schemaAttribute } from "@/schemas/credential";
import apiClient from "@/lib/apiService"; // Import the API client
import Image from "next/image";
import { ensureBase64HasPrefix } from "@/lib/utils";

export const CredentialsDisplay = () => {
	const { setSelectedCredential, startCreating, viewCredential } =
		useCredentials();
	const [credentials, setCredentials] = useState<CredentialFormData[]>([]);
	const [filteredCredentials, setFilteredCredentials] = useState<
		CredentialFormData[]
	>([]);
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [openId, setOpenId] = useState<string | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const t = useTranslations();

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);

				// Fetch credential definitions
				const definitionResponse = await apiClient.get<{
					credentialDefinitions: CredentialFormData[];
				}>("/credentials/definitions");

				if (definitionResponse?.credentialDefinitions) {
					// Sort by the `createdAt` field (replace with the actual field if different)
					const sortedCredentials = definitionResponse.credentialDefinitions.sort(
						(a, b) => (new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
					);
					setCredentials(sortedCredentials);
					setFilteredCredentials(sortedCredentials); // Initially set the filtered credentials
				} else {
					setError("Credential definitions not found.");
				}
			} catch (err) {
				setError("Failed to fetch data.");
				console.error(err);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	const handleSelectCredential = (
		credential: CredentialFormData & { id: string }
	) => {
		setSelectedCredential(credential);
		viewCredential(credential);
		setOpenId(credential.id);
	};

	const toggleDetails = (id: string) => {
		const credential = credentials.find((cred) => cred.id === id);
		if (openId === id) {
			setOpenId(null);
			setSelectedCredential(null);
		} else {
			setOpenId(id);
			handleSelectCredential(credential as CredentialFormData & { id: string });
		}
	};

	const handleCreate = () => {
		startCreating();
		setOpenId(null);
	};

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const query = e.target.value.toLowerCase();
		setSearchQuery(query);

		// Filter the credentials based on the search query
		if (query) {
			const filtered = credentials.filter(
				(cred) =>
					cred.name.toLowerCase().includes(query) ||
					(cred.version ?? "").toLowerCase().includes(query)
			);
			setFilteredCredentials(filtered);
		} else {
			setFilteredCredentials(credentials); // Reset if the query is empty
		}
	};
	return (
		<div className="w-full h-full bg-white dark:bg-dark-bg-secondary dark:border dark:border-dark-bg shadow-lg rounded-lg">
			<div className="p-4 border-b dark:border-dark-border">
				<h2 className="text-lg font-bold">
					{t("credentials.credential_title")}
				</h2>
				<p className="text-sm text-foreground/50">
					{t("credentials.credential_subtitle")}
				</p>
			</div>

			<div className="mx-auto px-4 mt-4 mb-0">
				<div className="relative max-w-[550px] w-full">
					<Search
						className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground"
						size={22}
					/>
					<Input
						type="text"
						placeholder={t("action.search_label")}
						value={searchQuery}
						onChange={handleSearchChange} // Update on input change
						className="bg-white dark:bg-dark-bg w-full pl-10 pr-3 py-4 border rounded-md text-foreground"
					/>
				</div>
			</div>
			<hr className="border-gray-200 dark:border-dark-border" />
			{loading && <p className="text-center py-4">Loading credentials...</p>}
			{error && <p className="text-center text-red-500 py-4">{error}</p>}

			{!loading && !error && filteredCredentials.length === 0 && (
				<p className="text-center py-4">No credentials found.</p>
			)}

			{!loading &&
				!error &&
				filteredCredentials.map((item: any) => (
					<div
						key={item.id}
						className="border-b dark:border-dark-border hover:bg-gray-100 dark:hover:bg-dark-bg-tertiary"
					>
						{openId === item.id ? (
							<div className="p-3 bg-light-bg flex flex-col dark:bg-dark-bg items-center text-center">
								<div className="flex flex-col py-2 w-full items-center">
									<Image
										alt={item?.icon?.fileName || "credential icon"}
										src={ensureBase64HasPrefix(item?.icon?.content) || ""}
										width={56}
										height={56}
										className="w-14 h-14 rounded-full shadow mb-4 object-cover"
									/>
									<span className="text-md font-semibold">
										{item.name as string}
									</span>
									<span className="text-sm mt-1 text-foreground/50">
										Version {item.version}
									</span>
									<div className="flex flex-row gap-4 justify-center mt-1">
										{item.credentialSchema &&
										item.credentialSchema.attributes &&
										Array.isArray(item.credentialSchema.attributes) &&
										item.credentialSchema.attributes.length > 0 ? (
											<div className="mt-2 text-xs">
												<div className="flex flex-wrap gap-2">
													{item.credentialSchema.attributes.map((attr: any) => (
														<span
															key={attr.id}
															className="bg-gray-200 dark:bg-dark-border px-2 py-1 rounded"
														>
															{attr.name}
														</span>
													))}
												</div>
											</div>
										) : (
											<p className="text-sm text-foreground/50 mt-2">
												Schema not available
											</p>
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
									<div className="flex items-center gap-3">
										<img
											src={ensureBase64HasPrefix(item?.icon?.content) || ""}
											className="w-10 h-10 rounded-full shadow object-cover"
										/>
									</div>
									<div>
										<p className="text-xs text-black text-foreground font-bold">
											{item.name}
										</p>
										<p className="text-xs text-foreground/50">{item.version}</p>
									</div>
								</div>

								<div>
									<p className="text-xs text-black dark:text-gray-200 font-bold">
										{t('credentials.attributes_label')}
									</p>
									<p className="text-xs text-foreground/50">
										{item.credentialSchema &&
										Array.isArray(item.credentialSchema.attributes)
											? item.credentialSchema.attributes.length
											: 0}
									</p>
								</div>
							</div>
						)}
					</div>
				))}

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
