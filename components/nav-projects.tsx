"use client"

import {
  CreditCard,
  Home,
  Map,
  User,
} from "lucide-react"

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Link, usePathname } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"

const projects = [
  {
    name: "home_label",
    url: "/",
    icon: Home,
  },
  {
    name: "showcases_label",
    url: "/showcases",
    icon: Map,
  },
  {
    name: "credential_library_label",
    url: "/credentials",
    icon: CreditCard,
  },
  {
    name: "character_library_label",
    url: "/characters",
    icon: User,
  },
]

export function NavProjects() {
  const t = useTranslations("sidebar");
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarMenu>
        {projects.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild>
              <Link href={item.url} className={cn(pathname === item.url && "bg-light-bg dark:bg-dark-bg-secondary")}>
                <item.icon />
                <span>{t(item.name)}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
