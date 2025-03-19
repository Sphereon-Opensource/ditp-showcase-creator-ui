"use client";

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { DarkModeToggle } from "./dark-mode-toggle";
import { LanguageSelector } from "./language-selector";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { Link, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

export function NavUser() {
  const { state } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="flex flex-row gap-2">
          {state !== "collapsed" && <LanguageSelector />}
          <DarkModeToggle />
        </div>
        <Separator className="my-2" />
        <SidebarMenuButton asChild>
          <p>
            <LogOut />
            <span>Log Out</span>
          </p>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
