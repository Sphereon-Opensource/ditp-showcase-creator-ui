"use client";

import { CirclePlus, Search, Share2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Link } from "@/i18n/routing";
import { Input } from "@/components/ui/input";
import ButtonOutline from "@/components/ui/button-outline";
import { Card } from "@/components/ui/card";
import { ensureBase64HasPrefix } from "@/lib/utils";
import { useCreateShowcase, useShowcases } from "@/hooks/use-showcases";
import { Persona, Showcase } from "@/openapi-types";
import Image from "next/image";
import ShowcaseCard from "./showcase-card";
import Header from "../header";

export const ShowcaseList = () => {
  const t = useTranslations();
  const { data, isLoading } = useShowcases();
  const { mutateAsync } = useCreateShowcase();

  const tabs = [
    { label: t("showcases.header_tab_overview"), status: "ALL" },
    { label: t("showcases.header_tab_draft"), status: "PENDING" },
    { label: t("showcases.header_tab_under_review"), status: "UNDER_REVIEW" },
    { label: t("showcases.header_tab_published"), status: "ACTIVE" },
  ];

  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [searchTerm, setSearchTerm] = useState("");

  const searchFilter = (showcase: Showcase) => {
    if (searchTerm === "") {
      return true;
    }
    return showcase.name.toLowerCase().includes(searchTerm.toLowerCase());
  };

  const createShowcase = async () => {
    const response = await mutateAsync(
      {
        name: "BC Gov Showcase",
        description: "Collection of credential usage scenarios",
        status: "ACTIVE",
        hidden: false,
        scenarios: [
          "8a9d9619-7522-453c-b068-3408ef4eca62",
          "fee9c14d-b39b-460e-b4c7-20fb5ddc5c46",
        ],
        credentialDefinitions: ["c9178012-725b-4f61-b1e8-8b51da517128"],
        personas: ["b3f83345-4448-4d21-a3d3-5d7b719c45d8"],
      },
      {
        onSuccess: (data: unknown) => {
          console.log("Showcase Created:", data);
        },
      }
    );

    return response;
  };

  return (
    <>
      <main
        className={`flex-1 bg-light-bg dark:bg-dark-bg dark:text-dark-text text-light-text `}
      >
        <Header
          title={t("showcases.header_title")}
          showSearch={true}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          buttonLabel={t("showcases.create_new_showcase_label")}
          buttonLink="/showcases/create"
        />

        {!isLoading && (
          <div className="mx-auto px-5 mt-2">
            <div className="flex gap-4 text-sm font-medium">
              {tabs.map((tab, index) => {
                const showcaseCount =
                  tab.status === tabs[0].status
                    ? data?.showcases?.length || 0
                    : data?.showcases?.filter(
                        (showcase) => showcase.status === tab.status
                      ).length || 0;

                return (
                  <button
                    key={index}
                    className={`flex items-center gap-1 px-2 py-1 ${
                      activeTab.status === tab.status
                        ? "border-b-2 border-light-blue dark:border-white dark:text-dark-text text-light-blue font-bold cursor-pointer"
                        : "text-gray-800/50 dark:text-gray-200/50"
                    }`}
                    onClick={() => setActiveTab(tab)}
                  >
                    <div className="font-bold text-base">{tab.label}</div>
                    <span className="bg-light-bg-secondary dark:dark-bg-secondary text-gray-600 text-xs px-2 py-0.5 rounded-full">
                      {showcaseCount}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {isLoading && (
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
            {t("showcases.loading_label")}
          </div>
        )}

        <section className="mx-auto p-4">
          <div className="grid md:grid-cols-3 gap-6 my-4">
            {data?.showcases
              ?.filter(searchFilter)
              .filter(
                (showcase) =>
                  activeTab.status === tabs[0].status ||
                  showcase.status === activeTab.status
              )
              .reverse()
              .map((showcase: Showcase) => (
                <div key={showcase.id}>
                  <ShowcaseCard showcase={showcase} variant="internal" />
                </div>
              ))}
          </div>
        </section>

        {/* <DeleteModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onDelete={() => {
            setIsModalOpen(false);
          }}
          header="Edit Published Showcase?"
          description="You are about to edit a published showcase. If you instead wish to make a copy, click <b>Cancel</b> below and then select <b>Create A Copy</b> under the showcase card"
          subDescription="If you proceed with editing, a <b>Draft version</b> will be created. This Draft will remain unpublished until an Admin approves your changes. <b>Until then, the current published showcase will stay active.</b>"
          cancelText="CANCEL"
          deleteText="PROCEED WITH EDITING"
        /> */}
      </main>
    </>
  );
};

