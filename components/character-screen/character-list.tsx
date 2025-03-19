"use client";

import { useShowcaseStore } from "@/hooks/use-showcases-store";
import Image from "next/image";
import { EyeOff, Monitor, CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";
import StepHeader from "@/components/step-header";
import ButtonOutline from "@/components/ui/button-outline";
import { ensureBase64HasPrefix } from "@/lib/utils";
import { usePersonas } from "@/hooks/use-personas";
import { toast } from "sonner";
import { Link, useRouter } from "@/i18n/routing";

export default function CreateCharacterList() {
  const t = useTranslations();
  const router = useRouter();
  const { data: personasData, isLoading } = usePersonas();

  const {
    selectedPersonaIds,
    toggleSelectedPersona,
    clearSelectedPersonas,
    setPersonaIds,
    setDisplayPersonas,
  } = useShowcaseStore();

  const handleToggleSelect = (personaId: string) => {
    toggleSelectedPersona(personaId);
  };

  const handleProceed = () => {
    if (selectedPersonaIds.length === 0) {
      toast.error("Please select at least one character to proceed");
      return;
    }

    // Save selected personas to both showcase and displayShowcase
    setPersonaIds(selectedPersonaIds);
    setDisplayPersonas(
      personasData?.personas.filter((persona) =>
        selectedPersonaIds.includes(persona.id)
      ) || []
    );
    toast.success("Characters selected successfully");
    router.push("/showcases/create/onboarding");
  };

  return (
    <div className="flex flex-col h-full w-full bg-light-bg dark:bg-dark-bg dark:text-dark-text text-light-text p-4">
      <div className="bg-white dark:bg-dark-bg-secondary border shadow-md rounded-md flex flex-col h-full w-full">
        <div className="p-4 border-b flex-shrink-0">
          <StepHeader
            icon={<Monitor strokeWidth={3} />}
            showDropdown={false}
            title={t("character.select_your_character_title")}
          />
          <p className="text-sm mt-2">
            {t("character.select_your_character_subtitle")}
          </p>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center flex-grow p-8">
            <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
            <p className="mt-4">Loading characters...</p>
          </div>
        ) : (
          <div className="flex-grow overflow-y-auto p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {personasData?.personas &&
                personasData.personas.map((persona: any) => {
                  const isSelected = selectedPersonaIds.includes(persona.id);

                  return (
                    <div
                      key={persona.id}
                      className={`relative p-4 border rounded-lg cursor-pointer transition-all ${
                        isSelected
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                          : "border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600"
                      }`}
                      onClick={() => handleToggleSelect(persona.id)}
                    >
                      {isSelected && (
                        <div className="absolute top-2 right-2 text-blue-500">
                          <CheckCircle2 size={24} />
                        </div>
                      )}

                      {persona.hidden && (
                        <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded-md text-xs">
                          <EyeOff size={14} />
                          <span>{t("character.hidden_label")}</span>
                        </div>
                      )}

                      <div className="flex flex-col items-center mt-4">
                        <div className="w-24 h-24 overflow-hidden rounded-full mb-3">
                          <Image
                            src={
                              persona.headshotImage?.content
                                ? ensureBase64HasPrefix(
                                    persona.headshotImage.content
                                  )
                                : "/assets/NavBar/Joyce.png"
                            }
                            alt={persona.name}
                            width={96}
                            height={96}
                            className="object-cover w-full h-full"
                          />
                        </div>

                        <h3 className="text-lg font-semibold text-center">
                          {persona.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                          {persona.role}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 line-clamp-3 text-center">
                          {persona.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        <div className="p-4 border-t flex-shrink-0 flex justify-between items-center">
          <div>
            <span className="text-sm font-medium">
              {selectedPersonaIds.length}{" "}
              {selectedPersonaIds.length === 1 ? "character" : "characters"}{" "}
              selected
            </span>
          </div>
          <div className="flex gap-3">
            <ButtonOutline onClick={clearSelectedPersonas}>
              {t("action.clear_selection_label")}
            </ButtonOutline>
            <ButtonOutline
              onClick={handleProceed}
              disabled={selectedPersonaIds.length === 0}
              className={
                selectedPersonaIds.length === 0
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }
            >
              {t("action.proceed_label")}
            </ButtonOutline>
          </div>
        </div>
      </div>
    </div>
  );
}
