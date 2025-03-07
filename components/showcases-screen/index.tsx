"use client";

import { useShowcaseStore } from "@/hooks/use-showcase-store";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  CircleAlert,
  CirclePlus,
  Delete,
  Download,
  EllipsisVertical,
  Eye,
  FileWarning,
  Monitor,
  Pencil,
  RefreshCcw,
  RotateCw,
  Search,
  Trash,
  Trash2,
  User,
} from "lucide-react";
// import { useRouter } from "next/router";
import { useLocale } from "next-intl";
import { useEffect, useState } from "react";
import { Locale, usePathname, useRouter, Link } from "@/i18n/routing";
import { FileUploadFull } from "../file-upload";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormTextInput, FormTextArea } from "../text-input";
import { characterSchema } from "@/schemas/character";
import { useTranslations } from "next-intl";
import Onboarding from "@/app/[locale]/onboarding/page";
import { PageParams } from "@/types";
import Scenario from "@/app/[locale]/scenarios/page";
import Credentials from "@/app/[locale]/credentials/page";
import { P } from "pino";
import { OnboardingScreen } from "../onboarding-screen/onboarding-screen";
import { ScenarioScreen } from "../scenario-screen/scenario-screen";
import { CredentialsDisplay } from "../credentials/credentials-display";
import { OnboardingMain } from "../onboarding-screen";
import NewCharacterPage from "./new-character";
import ScenarioMain from "../scenario-screen";
import PublishPage from "@/app/[locale]/publish/page";

const characters = [
  {
    id: 1,
    name: "Ana",
    type: "Student",
    description:
      "Meet ABC Ana is a student at BestBC College. To help make student life easier, BestBC College is going to offer Ana a digital Student Card to put in her BC Wallet.",
    headshot: "../../public/assets/NavBar/Joyce.png",
    bodyImage: "../../public/assets/NavBar/Joyce.png",
    selected: false,
    isHidden: false,
  },
  {
    id: 2,
    name: "Joyce",
    type: "Teacher",
    description:
      "Meet Joyce. Joyce is a Teacher at BestBC College. To help make teacher life easier, BestBC College is going to offer Joyce a digital Teacher Card to put in her BC Wallet.",
    headshot: "../../public/assets/NavBar/Joyce.png",
    bodyImage: "../../public/assets/NavBar/Joyce.png",
    selected: false,
    isHidden: false,
  },
  {
    id: 3,
    name: "Bob",
    type: "Director",
    description: "Director at BestBC College.",
    headshot: "../../public/assets/NavBar/Joyce.png",
    bodyImage: "../../public/assets/NavBar/Joyce.png",
    selected: false,
    isHidden: false,
  },
];

type CharacterFormData = z.infer<typeof characterSchema>;

export default function MyShowcaseMain({ params }: { params: PageParams }) {
  const t = useTranslations();
  //   const [selectedCharacters, setSelectedCharacters] = useState(characters);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [hiddenIds, setHiddenIds] = useState<number[]>([]);
  const [isHidden, setIsHidden] = useState(false);
  const [activeTab, setActiveTab] = useState<string>(t("navigation.character_label"));
  // const { activeTab, setActiveTab } = useShowcaseStore();
  const [isOpen, setIsOpen] = useState(false);
  const router:any = useRouter();

  const {
    updateCharacterImage,
    showcaseJSON,
    selectedCharacter,
    setEditMode,
    updateCharacterDetails,
    setSelectedCharacter,
  } = useShowcaseStore();
  

  const form = useForm<CharacterFormData>({
    resolver: zodResolver(characterSchema),
    defaultValues: {
      name: "",
      type: "",
      description: "",
    },
    values: {
      name: selectedIds.length > 0 ? characters[selectedCharacter].name : "",
      type: selectedIds.length > 0 ? characters[selectedCharacter].type : "",
      description:
        selectedIds.length > 0 ? characters[selectedCharacter].description : "",
    },
    mode: "onChange",
    shouldFocusError: true,
  });

  // console.log("showcaseJSON.personas", showcaseJSON.personas);

  // const form = useForm<CharacterFormData>({
  //   resolver: zodResolver(characterSchema),
  //   defaultValues: {
  //     name: showcaseJSON.personas[selectedCharacter].name,
  //     type: showcaseJSON.personas[selectedCharacter].type,
  //     description: showcaseJSON.personas[selectedCharacter].description,
  //   },
  //   mode: "onChange",
  //   shouldFocusError: true,
  // });

  const handleFormSubmit = (data: CharacterFormData) => {
    updateCharacterDetails(data);
    setEditMode(false);
  };

  const handleCancel = () => {
    form.reset({
      name: showcaseJSON.personas[selectedCharacter].name,
      type: showcaseJSON.personas[selectedCharacter].type,
      description: showcaseJSON.personas[selectedCharacter].description,
    });
    setEditMode(false);
  };

  const toggleSelect = (id: any) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((charId) => charId !== id) : [...prev, id]
    );
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setSelectedCharacter(Number(e.currentTarget.value));
    setEditMode(false);
  };

  //   const [activeTab, setActiveTab] = useState('Character');
  const [hideCharacter, setHideCharacter] = useState(false);
  type Tab = "Character" | "Onboarding" | "Scenario" | "Publish";

  let tabs:any = [
    t("navigation.character_label"),
    t("navigation.onboarding_label"),
    t("navigation.scenario_label"),
    t("navigation.publish_label")
]

useEffect(() => {
  if (!router.isReady) return; // Prevent accessing undefined query
  const { tab } = router.query;

  if (tab && tabs.includes(tab)) {
    setActiveTab(tab);
  }
}, [router.isReady, router.query]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as any);
    // router.push({ query: { tab } }, undefined, { shallow: true });
  };

  return (
    <div className="flex bg-light-bg dark:bg-dark-bg flex-col h-full w-full bg-gray-100">
      {/* Main Container with Header & Content in One Row */}
      <div className="flex flex-col">
        {/* Header Section - Integrated into Left & Right Containers */}
        <div className="flex justify-between items-center px-6 py-2 mt-4">
          {/* Left Header Section */}
          <div className="flex items-center space-x-4">
            <span className="text-light-text dark:text-dark-text font-medium text-sm">
              Showcase1{" "}
            </span>
            <Pencil size={16} />
            <span className="rounded-[5px] bg-gray-500 px-3 py-1 min-w-24 text-center min-h-4 text-sm text-white">
              {t('showcases.header_tab_draft')}
            </span>
          </div>

          {/* Tabs Section */}
          <div className="flex space-x-1 text-lg font-semibold justify-start mr-[305px]">
            {tabs.map((tab:any) => (
              <button
                key={tab}
                // onClick={() => setActiveTab(tab)}
                onClick={() => handleTabChange(tab)}
                className={`py-1 px-2 inline-block w-fit ${
                  activeTab === tab
                    ? "border-b-2 border-light-blue dark:border-white dark:text-dark-text text-light-text font-bold cursor-pointer"
                    : "text-gray-400"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <button className="text-gray-500 hover:text-gray-700"></button>
        </div>

        {/* {activeTab === "Character" && <NewCharacterPage />}
        {activeTab === "Onboarding" && <OnboardingMain />}
        {activeTab === "Scenario" && <ScenarioMain params={params} />}
        {activeTab === "Publish" && <CredentialsDisplay />} */}

        {activeTab === t("navigation.character_label") && <NewCharacterPage />}
        {activeTab === t("navigation.onboarding_label") && <OnboardingMain />}
        {activeTab === t("navigation.scenario_label") && <ScenarioMain params={params} />}
        {activeTab === t("navigation.publish_label") && <PublishPage params={params} />}

      </div>
    </div>
  );
}
