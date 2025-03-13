"use client";

import { CirclePlus, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Link } from "@/i18n/routing";
import { Input } from "@/components/ui/input";
import ButtonOutline from "@/components/ui/button-outline";
import { Card } from "@/components/ui/card";
import { ensureBase64HasPrefix } from "@/lib/utils";
import { useCreateShowcase, useShowcases } from "@/hooks/use-showcases";
import { Showcase } from "@/openapi-types";

export const ShowcaseList = () => {
  const t = useTranslations();
  const { data, isLoading } = useShowcases();
  const { mutateAsync } = useCreateShowcase();

  const [activeTab, setActiveTab] = useState(
    t("showcases.header_tab_overview")
  );

  const [Showcases, setShowcases] = useState<any>([]);
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
        onSuccess: (data) => {
          console.log("Showcase Created:", data);
        },
      }
    );

    return response;
  };

  const tabs = [
    t("showcases.header_tab_overview"),
    t("showcases.header_tab_draft"),
    t("showcases.header_tab_under_review"),
    t("showcases.header_tab_published"),
  ];

  return (
    <>
      <main
        className={`flex-1 bg-light-bg dark:bg-dark-bg dark:text-dark-text text-light-text `}
      >
        <section
          className="w-full px-0 py-2 bg-cover bg-center dark:bg-dark-bg"
        >
          <div className="container mx-auto px-4 mt-6 mb-6">
            <h1 className="text-3xl font-bold">
              {t("showcases.header_title")}
            </h1>
          </div>
          <div className="container mx-auto px-4 mb-8 mt-2 flex items-center justify-between">
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

            <Link href={"/showcases/create"}>
              <button className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 h-12 flex items-center gap-4 shadow-md">
                {t("showcases.create_new_showcase_label")}
                <CirclePlus size={22} />
              </button>
            </Link>
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
                    {index === 0
                      ? Showcases.length
                      : index === 1
                      ? Showcases.length
                      : 0}
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
            {data?.showcases?.filter(searchFilter).reverse().map((showcase: Showcase) => (
              <Card key={showcase.id}>
                <div
                  key={showcase.id}
                  className="bg-white dark:bg-dark-bg shadow-md rounded-lg overflow-hidden border border-light-border dark:border-dark-border flex flex-col h-full"
                >
                  {/* <div
                    className="relative min-h-[15rem] h-auto flex items-center justify-center bg-cover bg-center"
                    style={{
                      backgroundImage: `url('${
                        showcase?.bannerImage?.content ||
                        "https://picsum.photos/400"
                      }')`,
                    }}
                  >
                    <div
                      className={`${
                        showcase.status == "Published"
                          ? "bg-light-yellow"
                          : "bg-dark-grey"
                      } left-0 right-0 top-4 py-2 rounded w-1/4 absolute`}
                    >
                      <p
                        className={`text-center ${
                          showcase.status == "Published"
                            ? "text-black"
                            : "text-white"
                        }`}
                      >
                        {showcase.status}
                      </p>
                    </div>
                    <div className="absolute bg-black bottom-0 left-0 right-0 bg-opacity-70 p-3">
                      <div className="flex justify-between">
                        <div className="flex-1">
                          {" "}
                          <p className="text-xs text-gray-300 break-words">
                            {t("showcases.created_by_label", {
                              name: "Test college",
                            })}
                          </p>
                          <h2 className="text-lg font-bold text-white break-words">
                            {showcase.name}
                          </h2>
                        </div>
                        <div className="flex-shrink-0 self-center">
                          {" "}
                          <button className="border rounded px-3 py-1 hover:bg-gray-400 dark:hover:bg-gray-700">
                            <Share2
                              size={18}
                              className="cursor-pointer text-white"
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div> */}

                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className="text-sm font-semibold text-light-text dark:text-dark-text">
                      {t("showcases.description_label")}
                    </h3>
                    <p className="text-light-text dark:text-dark-text text-xs">
                      {showcase.description}
                    </p>
                    <h3 className="text-sm font-semibold text-light-text dark:text-dark-text mt-2">
                      {t("showcases.description_version")}
                    </h3>
                    <p className="text-light-text dark:text-dark-text text-xs">
                      1.0
                    </p>

                    <div className="mt-4 flex-grow mb-4">
                      <h4 className="text-sm font-semibold text-light-text dark:text-dark-text">
                        {t("showcases.character_label")}
                      </h4>
                      <div className="mt-2 space-y-3">
                        {showcase?.personas?.map(
                          (persona: any, charIndex: any) => (
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
                                alt={persona.name || "Persona"}
                                className="w-[44px] h-[44px] rounded-full"
                              />
                              <div>
                                <p className="text-base font-medium text-light-text dark:text-dark-text font-semibold">
                                  {persona.name}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {persona.role}
                                </p>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    <div className="flex gap-4 mt-auto">
                      <Link
                        className="w-1/2"
                        // onClick={() => setIsModalOpen(true)}
                        href={`/showcases/${showcase.slug}`}
                      >
                        {t("action.edit_label")}
                      </Link>
                      <ButtonOutline
                        onClick={() => createShowcase()}
                        className="w-1/2"
                      >
                        {t("action.create_copy_label")}
                      </ButtonOutline>
                      {/* {item.buttons.map((button, btnIndex) => ( */}
                      {/* <button
                      // key={btnIndex}
                      className={`w-full font-bold py-2 rounded-md transition ${
                        showcase.status === "PUBLISHED"
                          ? "border-2 border-dark-border dark:border-light-border text-light-text dark:text-dark-text hover:bg-gray-100 dark:hover:bg-gray-700"
                          : showcase.status === "DRAFT"
                          ? "border-2 border-dark-border dark:border-light-border text-light-text dark:text-dark-text hover:bg-gray-100 dark:hover:bg-gray-700"
                          : "bg-gray-300 text-gray-600 cursor-not-allowed"
                      }`}
                      // disabled={button.type === "disabled"}
                      onClick={() =>
                        button.label == t("action.edit_label") &&
                        setIsModalOpen(true)
                      }
                    >
                      {button.label}
                    </button> */}
                      {/* ))} */}
                    </div>
                  </div>
                </div>
              </Card>
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
