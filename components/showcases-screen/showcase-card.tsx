import React from "react";
import { Share2, Edit3 } from "lucide-react";
import { Button } from "../ui/button";
import Image from "next/image";
import { ensureBase64HasPrefix } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { Persona, Showcase } from "@/openapi-types";

interface ShowcaseCardProps {
  showcase: Showcase;
  variant?: "internal" | "public";
}

const ShowcaseCard: React.FC<ShowcaseCardProps> = ({
  showcase,
  variant = "public",
}) => {
  const t = useTranslations();
  const isInternal = variant === "internal";

  return (
    <div className="bg-white dark:bg-dark-bg rounded-lg overflow-hidden border border-light-border dark:border-dark-border flex flex-col h-full">
      <div
        className="relative min-h-[15rem] flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage: `url('${
            showcase?.bannerImage?.content || "/assets/NavBar/Showcase.jpeg"
          }')`,
        }}
      >
        {isInternal && (
          <div
            className={`absolute left-0 right-0 top-4 py-2 mx-5 rounded w-1/4 ${
              showcase.status === "ACTIVE" ? "bg-yellow-500" : "bg-dark-grey"
            }`}
          >
            <p
              className={`text-center  ${
                showcase.status === "ACTIVE" ? "text-black" : "text-white"
              }`}
            >
              {showcase.status || "Unknown"}
            </p>
          </div>
        )}
        <div className="absolute bg-black bottom-0 left-0 right-0 bg-opacity-70 py-3 px-5">
          <p className="text-xs text-gray-300">
            {t("showcases.created_by_label", { name: "Test college" })}
          </p>
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-white">{showcase?.name}</h2>
            <button className="border dark:border-white rounded px-3 py-1 hover:bg-gray-400 dark:hover:bg-gray-700">
              <Share2 size={18} className="text-white" />
            </button>
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

        <div className="mt-4 flex-grow mb-4">
          <h4 className="text-sm font-semibold text-light-text dark:text-dark-text">
            {t("showcases.character_label")}
          </h4>
          <div className="mt-2 space-y-3">
            {showcase?.personas?.map((persona: Persona) => (
              <div
                key={persona.id}
                className="border p-3 rounded-md flex items-center gap-3"
              >
                <Image
                  src={
                    ensureBase64HasPrefix(persona.headshotImage?.content) ||
                    "/assets/NavBar/Joyce.png"
                  }
                  alt={persona.name}
                  width={44}
                  height={44}
                  className="rounded-full w-[44px] h-[44px]"
                />
                <div>
                  <p className="text-base font-semibold">{persona.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {persona.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-4 mt-auto">
          {isInternal ? (
            <>
              <Button
                variant="outlineAction"
                size="lg"
                className="w-1/2 upperCase"
              >
                <Edit3 size={16} className="mr-2" />
                {t("action.edit_label")}
              </Button>
              <Button
                variant="outlineAction"
                size="lg"
                className="w-1/2 upperCase"
              >
                {t("action.create_copy_label")}
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outlineAction"
                size="lg"
                className="w-1/2 upperCase"
              >
                {t("action.preview_label")}
              </Button>
              <Button
                variant="outlineAction"
                size="lg"
                className="w-1/2 upperCase"
              >
                {t("action.create_copy_label")}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShowcaseCard;

