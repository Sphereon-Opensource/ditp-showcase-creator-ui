"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { useTranslations } from "next-intl";
import ButtonOutline from "../ui/button-outline";
import { Card } from "../ui/card";
import { Share2 } from "lucide-react";
import { ensureBase64HasPrefix } from "@/lib/utils";
import { useShowcases } from "@/hooks/use-showcases";
import { Showcase } from "@/openapi-types";
import { SidebarTrigger } from "../ui/sidebar";

export const LandingPage = () => {
  const t = useTranslations();
  const [activeTab, setActiveTab] = useState(t("home.header_tab_all"));
  const [searchTerm, setSearchTerm] = useState("");
  const { data, isLoading } = useShowcases();

  const tabs = [
    t("home.header_tab_all"),
    t("home.header_tab_mine"),
    t("home.header_tab_others"),
  ];

  const searchFilter = (showcase: Showcase) => {
    if (searchTerm === "") {
      return true;
    }
    return showcase.name.toLowerCase().includes(searchTerm.toLowerCase());
  };

  return (
    <>
      <section className="w-full px-0 py-2 bg-cover bg-center dark:bg-dark-bg">
        <div className="container mx-auto px-4 mt-4 mb-4 flex flex-row gap-2">
        <SidebarTrigger className="-ml-1" />
        <h1 className="text-3xl font-bold">{t("home.header_title")}</h1>
        </div>

        <div className="container mx-auto px-4 mb-8 mt-2">
          <div className="relative max-w-[550px] w-full">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={22}
            />
            <Input
              type="text"
              placeholder={t("action.search_label")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-4 border border-foreground/50 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-100"
            />
          </div>
        </div>
      </section>

      {!isLoading && (
        <div className="container mx-auto px-5 mt-2">
          <div className="flex gap-4 text-sm font-medium">
            {tabs.map((tab, index) => (
              <button
                key={index}
                className={`flex items-center gap-1 px-2 py-1 ${
                  activeTab === tab
                    ? "border-b-2 border-light-blue dark:border-white dark:text-dark-text text-light-blue font-bold cursor-pointer"
                    : "text-gray-800/50 dark:text-gray-200/50"
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
      )}

      {isLoading && (
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
          Loading Showcases
        </div>
      )}
      <section className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-6 mt-6">
          {data?.showcases
          .filter(searchFilter)
          .map((showcase: Showcase) => (
            <Card key={showcase.id}>
              <div
                key={showcase.id}
                className="bg-white dark:bg-dark-bg shadow-md rounded-lg overflow-hidden border border-light-border dark:border-dark-border flex flex-col h-full"
              >
                <div
                  className="relative min-h-[15rem] h-auto flex items-center justify-center bg-cover bg-center"
                  style={{
                    backgroundImage: `url('${
                      showcase?.bannerImage?.content ||
                      "https://fastly.picsum.photos/id/506/400/400.jpg?hmac=YUuTQH9RPqWbrpNVNTOj4Yicxuv0Eu62QUy3T11KgJA"
                    }')`,
                  }}
                >
                  <div className="absolute bg-black bottom-0 left-0 right-0 bg-opacity-70 p-3">
                    <p className="text-xs text-gray-300 break-words">
                      {t("showcases.created_by_label", {
                        name: "Test college",
                      })}
                    </p>
                    <div className="flex justify-between">
                      <h2 className="text-lg font-bold text-white break-words">
                        {showcase?.name}
                      </h2>
                      <div className="flex-shrink-0">
                        {" "}
                        {/* Prevent button from shrinking */}
                        <button className="border border rounded px-3 py-1 hover:bg-gray-400 dark:hover:bg-gray-700">
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
                  <p className="text-light-text dark:text-dark-text text-xs">
                    {showcase?.description}
                  </p>
                  <h3 className="text-sm font-semibold text-light-text dark:text-dark-text mt-2">
                    {t("showcases.description_version")}
                  </h3>
                  <p className="text-light-text dark:text-dark-text text-xs">
                    {"1.0"}
                  </p>
                  <div className="mt-4 flex-grow mb-4">
                    <h4 className="text-sm font-semibold text-light-text dark:text-dark-text">
                      {t("showcases.character_label")}
                    </h4>
                    <div className="mt-2 space-y-3">
                      {showcase?.personas?.map((persona: any) => (
                        <div
                          key={persona.id}
                          className="border-[1px] border-dark-border dark:border-light-border flex items-center gap-3 p-3 rounded-md"
                        >
                          <img
                            src={
                              ensureBase64HasPrefix(
                                persona.headshotImage?.content
                              ) || "https://picsum.photos/200"
                            }
                            alt={persona.name}
                            className="w-[44px] h-[44px] rounded-full"
                          />
                          <div>
                            <p className="text-base font-medium text-light-text dark:text-dark-text">
                              {persona.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {persona.role}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4 mt-auto">
                    <ButtonOutline className="w-1/2">
                      {t("action.preview_label")}
                    </ButtonOutline>
                    <ButtonOutline className="w-1/2">
                      {t("action.create_copy_label")}
                    </ButtonOutline>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
};

export default LandingPage;
