import React from "react";
import { PageParams } from "@/types";
import { setRequestLocale } from "next-intl/server";
import { ShowcaseList } from "@/components/showcases-screen/showcase-list";

export default async function Showcases({ params }: { params: PageParams }) {
  const { locale } = await params
  setRequestLocale(locale);

  return (
    <div className="flex bg-light-bg  text-light-text dark:bg-dark-bg dark:text-dark-text">
      <ShowcaseList />
    </div>
  );
}