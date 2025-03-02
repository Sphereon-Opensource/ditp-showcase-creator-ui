"use client";

import { CredentialsList } from "./components/credentials-list";
import { useShowcaseStore } from "@/hooks/use-showcase-store";
import { useCredentials } from "@/hooks/use-credentials";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Input } from "../ui/input";
import ButtonOutline from "../ui/button-outline";

export const CredentialsDisplay = () => {
  const t = useTranslations();
  const { showcaseJSON, selectedCharacter } = useShowcaseStore();
  const { isCreating, startCreating } = useCredentials();

  const [activeTab, setActiveTab] = useState("credentials");
  const [openId, setOpenId] = useState<number | null>(null);

  const toggleDetails = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  const data: any = {
    credentials: [
      {
        id: 1,
        name: "Credential Definition Name",
        version: "1.0",
        type: "ANONCRED",
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
        attributes: [{ id: "2", name: "slot_number", value: "A12" }],
        icon: "🅿️",
      },
      {
        id: 3,
        name: "Teacher Card",
        version: "1.0",
        attributes: [{ id: "3", name: "subject", value: "Math" }],
        icon: "🏫",
      },
    ],
    schemas: [
      {
        id: 1,
        name: "Student Schema",
        version: "1.0",
        attributes: 5,
        icon: "📄",
      },
      {
        id: 2,
        name: "Parking Schema",
        version: "1.0",
        attributes: 4,
        icon: "🅿️",
      },
      {
        id: 3,
        name: "Teacher Schema",
        version: "1.0",
        attributes: 6,
        icon: "🏫",
      },
      {
        id: 4,
        name: "Library Schema",
        version: "1.0",
        attributes: 3,
        icon: "📚",
      },
    ],
  };

  return (
    <div className="w-full h-full mx-auto bg-white shadow-lg rounded-lg">
      {/* Tabs */}
      <div className="flex border-b">
        <button
          className={`flex-1 py-6 text-center  ${
            activeTab === "credentials"
              ? "border-t-2 border-black bg-light-blue text-white font-bold"
              : "text-light-blue"
          }`}
          onClick={() => setActiveTab("credentials")}
        >
          Credentials ({data.credentials.length})
        </button>
        <button
          className={`flex-1 py-6 text-center  ${
            activeTab === "schemas"
              ? "border-t-2 border-black bg-light-blue text-white font-bold"
              : "text-light-blue"
          }`}
          onClick={() => setActiveTab("schemas")}
        >
          Schemas ({data.schemas.length})
        </button>
      </div>
      <div className="">
        <div className="p-4 bg-light-bg">
          <p className="text-xl font-semibold">
            {activeTab === "credentials"
              ? "What are Credentials?"
              : "What are Schemas?"}
          </p>
          <p className="text-[#474543] mt-2">
            {activeTab === "credentials"
              ? "Credentials are issued based on schemas and used in the scenarios."
              : "Schemas define the structure of credentials, specifying attributes like names, dates, and IDs."}
          </p>
        </div>
        <div>
        <div className="container mx-auto px-4 mb-4 mt-2">
            <div className="relative max-w-[550px] w-full">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={22}
              />
              <Input 
                type="text"
                 placeholder={t("action.search_label")}
                 className="bg-white dark:dark-bg w-full pl-10 pr-3 py-6 border rounded-md text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-gray-300"
              />
            </div>
          </div>
          <hr />
        </div>
        {data[activeTab].map((item: any) => (
          <div key={item.id} className="border-b">
            {activeTab === "credentials" && openId === item.id ? (
              <div className="p-3 bg-light-bg flex flex-col border-b items-center text-center">
                <div
                  key={item.id}
                  className="flex flex-col py-2 w-full items-center"
                >
                  <span className="text-sm font-semibold">{item.name}</span>
                  <span className="text-sm mt-1">Version {item.version}</span>
                  <div className="flex flex-row gap-4 justify-center mt-1">
                    {item.attributes.map((attr: any) => (
                      <span key={attr.id} className="text-sm">
                        {attr.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div
                className="flex justify-between items-center p-3 cursor-pointer"
                onClick={() =>
                  activeTab === "credentials" && toggleDetails(item.id)
                }
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{item.icon}</span>
                  <div>
                    <p className="font-bold">{item.name}</p>
                    <p className="text-sm text-gray-500">{item.version}</p>
                  </div>
                </div>
                <p className="text-sm font-bold">
                  Attributes {item.attributes.length}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
      <ButtonOutline className="w-full mt-4 border py-2 rounded-md font-bold">
        {activeTab === "schemas"
          ? "CREATE NEW SCHEMA"
          : "CREATE NEW CREDENTIAL"}
      </ButtonOutline>
    </div>
  );
};
