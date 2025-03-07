"use client";
import { useState } from "react";
import ButtonOutline from "../ui/button-outline";
import { CredentialsDisplay } from "./credentials-display";
import { CredentialsEditor } from "./credentials-editor";
import { CredentialsImport } from "./credentials-import";
import { useTranslations } from "next-intl";

// Parent component managing the state for selected credentials and modes (view/edit/import)
export const CredentialsPage = () => {
  const [selectedCredential, setSelectedCredential] = useState<any | null>(null); // Handles null or credential
  const [isImporting, setIsImporting] = useState(false); // State to manage import mode

  const handleOpenEditor = (credential: any | null) => {
    setSelectedCredential(credential); // Update the state with selected credential
    setIsImporting(false); // Close import mode if a credential is selected
  };

  const handleImport = () => {
    setIsImporting(true); // Open import mode
    setSelectedCredential(null); // Close any previously selected credential
  };

  return (
    <div className="flex flex-col ">
      <div className="flex justify-between items-center px-6 py-2 mt-4">
        <p className="font-bold text-3xl">Credential Library</p>

        <ButtonOutline
          className="mt-4 border py-2 rounded-md font-bold"
          onClick={handleImport} // When clicked, set import mode to true
        >
          IMPORT CREDENTIAL
        </ButtonOutline>
      </div>

      <div className="flex gap-4 p-4 ">
        <div className="w-1/3 bg-[white] dark:bg-dark-bg-secondary border shadow-md rounded-md flex flex-col">
          <CredentialsDisplay openEditor={handleOpenEditor} />
        </div>

        <div className="w-2/3 bg-white dark:bg-dark-bg-secondary border shadow-md rounded-md flex flex-col">
          {isImporting ? (
            <CredentialsImport /> // Show import screen
          ) : (
            <CredentialsEditor credential={selectedCredential} /> // Pass selected credential to CredentialsEditor
          )}
        </div>
      </div>
    </div>
  );
};
