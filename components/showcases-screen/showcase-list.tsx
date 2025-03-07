"use client";

import { CirclePlus, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Link } from "@/i18n/routing";
import { Input } from "../ui/input";
import ButtonOutline from "../ui/button-outline";
import DeleteModal from "../delete-modal";
import { Card } from "../ui/card";
import { Share2 } from "lucide-react";

export const ShowcaseList = () => {
	const t = useTranslations();

	const [activeTab, setActiveTab] = useState(
		t("showcases.header_tab_overview")
	);
	const [isModalOpen, setIsModalOpen] = useState(false);

	let data = [
		{
			id: 1,
			title: "Campus Access",
			createdBy: "Test College",
			published: "Published",
			version: "1.0",
			description:
				"In this showcase, follow the journey of a student and a teacher at Test College as they navigate the process of obtaining a digital parking credential.",
			characters: [
				{
					name: "Joyce",
					role: "Teacher",
					image: "https://yavuzceliker.github.io/sample-images/image-1.jpg",
				},
				{
					name: "Ana",
					role: "Student",
					image: "https://yavuzceliker.github.io/sample-images/image-1.jpg",
				},
			],
			buttons: [
				{ label: t("action.preview_label"), type: "primary" },
				{ label: t("action.edit_label"), type: "secondary" },
			],
		},
		{
			id: 3,
			title: "Campus Access Copy",
			createdBy: "Test College",
			published: "Draft",
			version: "1.0",
			description:
				"In this showcase, follow the journey of a student and a teacher at Test College as they navigate the process of obtaining a digital parking credential.",
			characters: [
				{
					name: "Ana",
					role: "Student",
					image: "https://yavuzceliker.github.io/sample-images/image-1.jpg",
				},
			],
			buttons: [{ label: t("action.edit_label"), type: "primary" }],
		},
	];

	let tabs = [
		t("showcases.header_tab_overview"),
		t("showcases.header_tab_draft"),
		t("showcases.header_tab_under_review"),
		t("showcases.header_tab_published"),
	];

	return (
		<main className={`flex-1  bg dark:text-dark-text text-light-text mb-6`}>
			<section
				className="w-full px-0 py-2 bg-cover bg-center  dark:bg-dark-bg"
				style={{
					backgroundImage:
						"url('https://s3-alpha-sig.figma.com/img/84d2/7817/695f4b324b28bca3dafeea1ce4e868b0?Expires=1740960000&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=W03Hk36YdEAmq3EuDffGTsV24WmDhdE3KNHJu6-oIwgqDPrSWZp-tJliZHBU3UDcJ1-m6l6WDumpSy~17VaZZqGsRrMnImTmIWvEFPmBH8NHs31qTecPEobw6UKkIfiMW9lAYCaYSAp-2Z3Eslk~ZA4VcgTNOqifQJc4CEnQdm~G1BA6R-9v8odvfAopWHRTM04EcOSO1u9Qk89jnxb-RfNcwvAoamvTD9ZRl5xHWMX-MAyr7TWGZTgkbW~K5YogtrYpzQYd5eYF4WbbNBtUe3BVtxX7suh6Jwrf9-3js~sq1dmFpTAHXMfrOCFxeFwQSmWfcZiVcS89D9RfrhFjQg__')",
				}}
			>
				<div className="container mx-auto px-4 mt-12 mb-6">
					<h1 className="text-4xl font-bold">{t("showcases.header_title")}</h1>
				</div>
				<div className="container mx-auto px-4 mb-8 mt-2 flex items-center justify-between">
					<div className="relative max-w-[550px] w-full">
						<Search
							className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 "
							size={22}
						/>
						<Input
							type="text"
							placeholder={t("action.search_label")}
							className="bg-light-bg-input dark:dark-bg-input w-full pl-10 pr-3 py-6 border rounded-md text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-gray-300"
						/>
					</div>

					<Link href={"/showcases/character"}>
						<button className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 h-12 flex items-center gap-4 shadow-md">
							{t("showcases.create_new_showcase_label")}
							<CirclePlus size={22} />
						</button>
					</Link>
				</div>
			</section>

			<div className="container mx-auto px-5 mt-2">
				<div className="flex gap-4 ">
					{tabs.map((tab, index) => (
						<button
							key={index}
							className={`flex items-center gap-1 px-2 py-1 ${
								activeTab === tab
									? "border-b-2 border-light-blue dark:border-white dark:text-dark-text text-light-blue font-bold cursor-pointer"
									: "text-light-text dark:text-dark-text cursor-pointer"
							}`}
							onClick={() => setActiveTab(tab)}
						>
							<div className="font-bold text-base">{tab}</div>
							<span className="bg-light-bg-secondary dark:dark-bg-secondary text-gray-600 text-xs px-2 py-0.5 rounded-full">
								{index === 0 ? 3 : index === 1 ? 1 : 2}
							</span>
						</button>
					))}
				</div>
			</div>
			<section className="container mx-auto px-4 ">
				<div className="grid  md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6 mt-6">
					{data.map((item) => (
						<Card key={item.id}>
							<div
								key={item.id}
								className="bg-white dark:bg-dark-bg-tertiary  rounded-lg overflow-hidden border border-light-border dark:border-dark-border flex flex-col"
							>
								<div
									className="relative min-h-[12rem] flex items-center justify-center bg-cover bg-center"
									style={{
										backgroundImage: "url('https://picsum.photos/400')",
									}}
								>
									<div
										className={`${
											item.published == "Published"
												? "bg-light-yellow"
												: "bg-dark-grey border border-gray-700 dark:border-dark-border"
										} left-0 right-0 top-4 py-2 w-1/4 absolute rounded-tr-lg rounded-br-lg`}
									>
										<p
											className={`text-center ${
												item.published == "Published"
													? "text-black"
													: "text-white"
											}`}
										>
											{item.published}
										</p>
									</div>

									<div className="absolute bg-black bottom-0 left-0 right-0 bg-opacity-70 p-3">
										<div className="flex justify-between">
											<div className="flex-1">
												{" "}
												{/* Allow the text container to grow */}
												<p className="text-xs text-gray-300 break-words">
													{t("showcases.created_by_label", {
														name: item.createdBy,
													})}
												</p>
												<h2 className="text-lg font-bold text-white break-words">
													{item.title}
												</h2>
											</div>
											{/* Updated Share Button */}
											<div className="flex-shrink-0 ">
												{" "}
												{/* Prevent button from shrinking */}
												<button className="border rounded px-3 py-1 hover:bg-gray-400 dark:hover:bg-gray-700">
													<Share2
														size={18}
														className="cursor-pointer text-white"
													/>
												</button>
											</div>
										</div>
									</div>
								</div>

								<div className="p-5 flex flex-col flex-grow">
									<h3 className="text-sm font-semibold text-light-text dark:text-dark-text">
										{t("showcases.description_label")}
									</h3>
									<p className="text-light-text dark:text-dark-text text-xs mt-2">
										{item.description}
									</p>
									<h3 className="text-sm font-semibold text-light-text dark:text-dark-text mt-2">
										{t("showcases.description_version")}
									</h3>
									<p className="text-light-text dark:text-dark-text text-xs mt-2">
										{item.version}
									</p>

									<div className="mt-4 flex-grow mb-4">
										<h4 className="text-sm font-semibold text-light-text dark:text-dark-text">
											{t("showcases.character_label")}
										</h4>
										<div className="mt-2 grid grid-cols-2 gap-3">
											{item.characters.map((character, charIndex) => (
												<div
													key={charIndex}
													className="border-[1px] bg-light-bg dark:bg-dark-bg-tertiary border-gray-200 dark:border-dark-border flex items-center gap-3 p-2 rounded-md"
												>
													<img
														src={character.image}
														alt={character.name}
														className="w-[28px] h-[28px] rounded-full"
													/>
													<div className="flex-1 min-w-0">
														<p className="text-xs text-gray-700 font-semibold dark:text-gray-400 break-words">
															{character.name}
														</p>
														<p className="text-xs text-gray-500 dark:text-gray-400 break-words">
															{character.role}
														</p>
													</div>
												</div>
											))}
										</div>
									</div>
									<div className="border-t-2 border-gray-200 dark:border-dark-border mt-6 pt-4">
										<div className="flex gap-4 mt-auto">
											{item.buttons.map((button, btnIndex) => (
												<button
													key={btnIndex}
													className={`w-full font-bold py-2 rounded-md transition ${
														button.type === "primary"
															? "border-2 border-dark-border dark:border-none dark:bg-dark-btn text-light-text dark:text-dark-text hover:bg-gray-100 dark:hover:bg-dark-btn-hover"
															: button.type === "secondary"
															? "border-2 border-dark-border dark:border-none dark:bg-dark-btn text-light-text dark:text-dark-text hover:bg-gray-100 dark:hover:bg-dark-btn-hover"
															: "bg-gray-300 text-gray-600 cursor-not-allowed"
													}`}
													disabled={button.type === "disabled"}
													onClick={() =>
														button.label == t("action.edit_label") &&
														setIsModalOpen(true)
													}
												>
													{button.label}
												</button>
											))}
										</div>
									</div>
								</div>
							</div>
						</Card>
					))}
				</div>
			</section>
			<DeleteModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onDelete={() => {
					console.log("Item Deleted");
					setIsModalOpen(false);
				}}
				header="Edit Published Showcase?"
				description="You are about to edit a published showcase. If you instead wish to make a copy, click <b>Cancel</b> below and then select <b>Create A Copy</b> under the showcase card"
				subDescription="If you proceed with editing, a <b>Draft version</b> will be created. This Draft will remain unpublished until an Admin approves your changes. <b>Until then, the current published showcase will stay active.</b>"
				cancelText="CANCEL"
				deleteText="PROCEED WITH EDITING"
			/>
		</main>
	);
};
