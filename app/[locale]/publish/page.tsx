import React from "react";
import { PageParams } from "@/types";
import PublishMain from "@/components/publish-screen";

export default function PublishPage({ params }: { params: PageParams }) {

  return (
    <div
      className={`flex bg-light-bg text-light-text dark:bg-dark-bg dark:text-dark-text`}
    >
      <PublishMain params={params} />
    </div>
  );
}
