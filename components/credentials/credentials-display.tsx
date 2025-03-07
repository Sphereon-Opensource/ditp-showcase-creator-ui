// "use client";
import { useState, useEffect } from "react";
import ButtonOutline from "../ui/button-outline";
import { Plus, Search } from "lucide-react";
import { Input } from "../ui/input";
import { useTranslations } from "next-intl";

// Updated CredentialsDisplay with openEditor prop accepting a function that can handle credential selection or creation
export const CredentialsDisplay = ({
	openEditor,
}: {
	openEditor: (credential: any | null) => void;
}) => {
	const t = useTranslations();
	const [activeTab, setActiveTab] = useState("credentials");
	const [openId, setOpenId] = useState<number | null>(null);
	const [selectedCredential, setSelectedCredential] = useState<any | null>(
		null
	); // Stores the selected credential

	// Dummy data for credentials
	const data: any = {
		credentials: [
			{
				id: 1,
				name: "Credential Definition Name",
				version: "1.0",
				type: "ANONCRED",
				imported: "Created",
				attributes: [
					{ id: "1", name: "name", value: "John Doe", type: "STRING" },
					{ id: "2", name: "Number", value: "2", type: "STRING" },
				],
				icon: "🅿️",
			},
			{
				id: 2,
				name: "Parking Card",
				version: "1.0",
				imported: "Created",
				attributes: [{ id: "2", name: "slot_number", value: "A12" }],
				icon: "🅿️",
			},
			{
				id: 3,
				name: "Teacher Card",
				version: "1.0",
				imported: "Imported",
				attributes: [{ id: "3", name: "subject", value: "Math" }],
				icon: "🏫",
			},
		],
	};

	// Set the first credential as the default selected and expanded
	useEffect(() => {
		if (data.credentials.length > 0) {
			setOpenId(data.credentials[0].id); // Expand the first credential on load
			setSelectedCredential(data.credentials[0]); // Set the first credential as selected
		}
	}, []);

	const toggleDetails = (id: number) => {
		setOpenId(openId === id ? null : id);
		const selected = data.credentials.find((item: any) => item.id === id);
		setSelectedCredential(selected);
		openEditor(selected); // Pass selected credential to parent
	};

	return (
		<div className="w-full h-full mx-auto bg-white dark:bg-dark-bg-secondary dark:border dark:border-dark-bg shadow-lg rounded-lg">
			{/* Tabs */}
			<div className="flex border-b dark:border-dark-border">
				<div className="p-4">
					<h2 className="text-lg font-bold">
						{t("credentials.credential_title")}
					</h2>
					<p className="text-sm text-gray-400">
						{t("credentials.credential_subtitle")}
					</p>
				</div>
			</div>

			{/* Content */}
			<div>
				<div className=" mx-auto px-4 mb-4 mt-2">
					<div className="relative max-w-[550px] w-full">
						<Search
							className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
							size={22}
						/>
						<Input
							type="text"
							placeholder={t("action.search_label")}
							className="bg-white dark:bg-dark-bg w-full pl-10 pr-3 py-6 border rounded-md text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-gray-300"
						/>
					</div>
				</div>
				<hr className="border-gray-200 dark:border-dark-border" />
			</div>

			{/* Display Credentials */}
			{data[activeTab].map((item: any) => (
				<div key={item.id} className="border-b dark:border-dark-border">
					{/* Show details if clicked, otherwise show the credential */}
					{activeTab === "credentials" && openId === item.id ? (
						<div className="p-3 bg-light-bg flex flex-col border-b dark:border-dark-border dark:bg-dark-bg items-center text-center">
							<div className="flex flex-col py-2 w-full items-center">
								<span className="text-sm font-semibold">{item.icon}</span>
								<span className="text-lg font-semibold">{item.name}</span>
								<span className="text-sm mt-1 text-black  dark:text-gray-400">
									Version {item.version}
								</span>
								<span className="text-sm mt-1 text-black  dark:text-gray-400">
								{item.imported}
								</span>
								<div className="flex flex-row gap-4 justify-center mt-1">
									{item.attributes.map((attr: any) => (
										<div className="bg-light-bg dark:bg-dark-border border dark:border-gray-500 rounded-md px-2">
											{" "}
											<span key={attr.id} className="text-sm dark:text-gray-200">  
												{attr.name}
											</span>
										</div>
									))}
								</div>
							</div>
						</div>
					) : (
						<div
							className="flex justify-between items-center p-3 cursor-pointer"
							onClick={() => toggleDetails(item.id)}
						>
							<div className="flex items-center gap-3">
								<span className="text-xl">{item.icon}</span>
								<div>
									<p className="font-bold text-black dark:text-gray-200">
										{item.name}
									</p>
									<p className="text-sm text-gray-500 dark:text-gray-400">
										{item.version}
									</p>
								</div>
							</div>
							<div>
								<p className="text-sm text-black dark:text-gray-200 font-bold">
									Type
								</p>
								<p className="text-sm text-gray-500 dark:text-gray-400">
									{item.imported}
								</p>
							</div>
							<div>
								<p className="text-sm text-black dark:text-gray-200 font-bold">
									Attributes
								</p>
								<p className="text-sm text-gray-500 dark:text-gray-400 ">
									{item.attributes.length}
								</p>
							</div>
						</div>
					)}
				</div>
			))}

			{/* Right Panel - Show the selected credential or the create button */}
			<div className="flex justify-center mx-4 my-4">
				<ButtonOutline
					onClick={() => openEditor(true)}
					className="w-full mt-4  py-2 rounded-md font-bold"
				>
					CREATE NEW CREDENTIAL
				</ButtonOutline>
			</div>
		</div>
	);
};
