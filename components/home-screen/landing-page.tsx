"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { useTranslations } from "next-intl";
import ButtonOutline from "../ui/button-outline";
import { Card } from "../ui/card";
import { Share2 } from "lucide-react";

export const LandingPage = () => {
	const t = useTranslations();
	const [activeTab, setActiveTab] = useState(t("home.header_tab_all"));

	let tabs = [
		t("home.header_tab_all"),
		t("home.header_tab_mine"),
		t("home.header_tab_others"),
	];

	return (
		<div
			className={`flex flex-col min-h-screen shadow-md rounded-lg bg-light-bg text-light-text dark:bg-dark-bg dark:text-dark-text overflow-hidden`}
		>
			<main className={`flex-1 h-full overflow-auto mb-14`}>
				<section
					className="w-full px-0 py-2 bg-cover bg-center bg:light-bg dark:bg-dark-bg "
					style={{
						backgroundImage:
							"url('https://s3-alpha-sig.figma.com/img/84d2/7817/695f4b324b28bca3dafeea1ce4e868b0?Expires=1740960000&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=W03Hk36YdEAmq3EuDffGTsV24WmDhdE3KNHJu6-oIwgqDPrSWZp-tJliZHBU3UDcJ1-m6l6WDumpSy~17VaZZqGsRrMnImTmIWvEFPmBH8NHs31qTecPEobw6UKkIfiMW9lAYCaYSAp-2Z3Eslk~ZA4VcgTNOqifQJc4CEnQdm~G1BA6R-9v8odvfAopWHRTM04EcOSO1u9Qk89jnxb-RfNcwvAoamvTD9ZRl5xHWMX-MAyr7TWGZTgkbW~K5YogtrYpzQYd5eYF4WbbNBtUe3BVtxX7suh6Jwrf9-3js~sq1dmFpTAHXMfrOCFxeFwQSmWfcZiVcS89D9RfrhFjQg__')",
					}}
				>
					<div className="container mx-auto px-4 mt-12 mb-6">
						<h1 className="text-4xl font-bold">{t("home.header_title")}</h1>
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

				</div>
				</section>

				<div className="container mx-auto px-5 mt-2">
					<div className="flex gap-4 text-sm font-medium">
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
				<section className="container mx-auto px-4 mt-6">
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
						{[1, 2, 3].map((index) => (
							<Card key={index}>
								<div className="bg-white dark:bg-dark-bg-tertiary  rounded-lg overflow-hidden border border-light-border dark:border-dark-border flex flex-col">
									<div
										className="relative min-h-[12rem] flex items-center justify-center bg-cover bg-center"
										style={{
											backgroundImage: "url('https://picsum.photos/400')",
										}}
									>
										<div className="absolute bg-black bottom-0 left-0 right-0 bg-opacity-70 p-3">
											<div className="flex justify-between">
												<div className="flex-1">
													{" "}
													{/* Allow the text container to grow */}
													<p className="text-xs text-gray-300 break-words">
														{t("showcases.created_by_label", {
															name: "Test college",
														})}
													</p>
													<h2 className="text-lg font-bold text-white break-words">
														Campus Access
													</h2>
												</div>
												{/* Updated Share Button */}
												<div className="flex-shrink-0">
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

									<div className="p-4 flex flex-col flex-grow">
										<h3 className="text-sm font-semibold text-light-text dark:text-dark-text break-words">
											{t("showcases.description_label")}
										</h3>

										<p className="text-light-text dark:text-dark-text text-xs mt-2 break-words">
											In this showcase, follow the journey of a student and a
											teacher at Test College as they navigate the process of
											obtaining a digital parking credential.
										</p>
										<div className="mt-4 flex-grow mb-4">
											<h4 className="text-sm font-semibold text-light-text dark:text-dark-text">
												{t("showcases.character_label")}
											</h4>
											<div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-3">
												{index !== 2 && (
													<div													className="border-[1px] bg-light-bg dark:bg-dark-bg-tertiary border-gray-200 dark:border-dark-border flex items-center gap-3 p-2 rounded-md"
>
														<img
															src="https://picsum.photos/200"
															alt="Joyce"
															className="w-10 h-10 md:w-8 md:h-8 rounded-full object-cover"
														/>
														<div className="flex-1">
															<p className="text-xs text-gray-700 font-semibold dark:text-gray-400 break-words">
																Joyce
															</p>
															<p className="text-xs text-gray-500 dark:text-gray-400 break-words">
																Teacher
															</p>
														</div>
													</div>
												)}

												<div 													className="border-[1px] bg-light-bg dark:bg-dark-bg-tertiary border-gray-200 dark:border-dark-border flex items-center gap-3 p-2 rounded-md"
                        >
													<img
														src="https://picsum.photos/200"
														alt="Ana"
														className="w-10 h-10 md:w-8 md:h-8 rounded-full object-cover"
													/>
													<div className="flex-1">
														<p className="text-xs text-gray-700 font-semibold dark:text-gray-400 break-words">
															Ana
														</p>
														<p className="text-xs text-gray-500 dark:text-gray-400 break-words">
															Student
														</p>
													</div>
												</div>
											</div>
										</div>

										<div className="border-t-2 border-gray-200 dark:border-dark-border mt-6 pt-4 ">
											<div className="flex gap-4">
												<ButtonOutline className="w-1/2">
													{t("action.preview_label")}
												</ButtonOutline>
												<ButtonOutline className="w-1/2">
													{t("action.create_copy_label")}
												</ButtonOutline>
											</div>
										</div>
									</div>
								</div>
							</Card>
						))}
					</div>
				</section>
			</main>
		</div>
	);
};

export default LandingPage;
