"use client";

import { JSX, useState } from "react";
import { useTheme } from "next-themes";
import {
  Home,
  Library,
  LogOut,
  Wallet,
  ChevronLeft,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { LanguageSelector } from "./language-selector";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import { DarkModeToggle } from "./dark-mode-toggle";

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(true);
  const { theme, setTheme } = useTheme();
  const t = useTranslations("sidebar");
  const router = useRouter();
  const pathname = usePathname();


  return (
    <aside
      className={`min-h-screen flex flex-col bg-white dark:bg-dark-bg-secondary text-light-text dark:text-dark-text shadow-lg transition-all ${
        isExpanded ? "w-72" : "w-20"
      }`}
    >
      <div className="flex items-center py-6 px-5">
        <Image
          src={require("../public/assets/NavBar/character.svg")}
          alt="College Logo"
          width={44}
          height={44}
          className="rounded-full"
        />
        {isExpanded && (
          <div className="ml-4 flex flex-col">
            <h2 className="text-lg font-semibold">Test College</h2>
            <p className="text-sm text-gray-500">John Doe</p>
          </div>
        )}
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          className="ml-auto cursor-pointer transition-transform transform"
        >
          <ChevronLeft size={22} className={isExpanded ? "" : "rotate-180"} />
        </div>
      </div>

      <div className="border-t border-b border-gray-200 dark:border-gray-700 mx-3" />
      <nav className="mt-6 flex-1 px-4 space-y-2">
        <Link href="/">
          <SidebarItem
            // icon={<Home size={22}/>}
            icon="/assets/NavBar/Home_light.svg"
            text={t("home_label")}
            expanded={isExpanded}
            isActive={pathname === "/"}
          />
        </Link>

        <Link href="/showcases">
          <SidebarItem
            // icon={<Library size={22}/>}
            icon="/assets/NavBar/showcases.svg"
            text={t("showcases_label")}
            expanded={isExpanded}
            isActive={pathname.startsWith("/showcases")}
          />
        </Link>

        <Link href="/credentials">
          <SidebarItem
            // icon={<Wallet size={22}/>}
            icon="/assets/NavBar/credentials_library.svg"
            text={t("credential_library_label")}
            expanded={isExpanded}
            isActive={pathname.startsWith("/credentials")}
          />
        </Link>
      </nav>
      {isExpanded && (
        <div className="mx-6">
          <LanguageSelector />
        </div>
      )}
      <div className="p-4 px-3 mt-auto flex flex-col gap-4 mb-5 pt-6">
        <div className="flex items-center justify-between w-full px-2">
          <DarkModeToggle isExpanded={isExpanded}/>
        </div>

        <button className="w-full flex items-center text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 p-3 rounded-md">
          <Image
            src={require("../public/assets/NavBar/exit.svg")}
            alt={"Logout"}
            width={20}
            height={20}
          />
          {/* <LogOut size={22} /> */}
          {isExpanded && (
            <span className="ml-3 text-light-text dark:text-dark-text font-medium text-base">
              {t("logout_label")}
            </span>
          )}
        </button>
      </div>
    </aside>
  );
}

// Sidebar Item Component
function SidebarItem({
  icon,
  text,
  expanded,
  isActive,
}: {
  icon: JSX.Element | string;
  text: string;
  expanded: boolean;
  isActive: boolean;
}) {
  return (
    <div
      className={`flex items-center p-3 rounded-md transition-all mb-2 ${
        isActive
          ? "bg-gray-200 dark:bg-gray-700"
          : "hover:bg-light-btn-hover dark:hover:bg-dark-btn-hover"
      }`}
    >
      {typeof icon === "string" ? (
        <Image
          src={icon}
          alt={text}
          width={20}
          height={20}
        />
      ) : (
        icon
      )}
      {expanded && (
        <span className="ml-3 mt-1 text-light-text dark:text-dark-text font-medium text-base">
          {text}
        </span>
      )}
    </div>
  );
}
