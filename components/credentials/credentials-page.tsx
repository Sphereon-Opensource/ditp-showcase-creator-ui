"use client";

import { useState, useEffect } from "react";
import ButtonOutline from "../ui/button-outline";
import { useCredentials } from "@/hooks/use-credentials";
import { CredentialsDisplay } from "./credentials-display";
import { CredentialsForm } from "./credentials-form";
import { CredentialsImport } from "./credentials-import";
import { useTranslations } from "next-intl";
import { CredentialFormData } from "@/schemas/credential"; // Import the type

export const CredentialsPage = () => {
  const {

    startImporting,

  } = useCredentials();  // Get the store's state and actions

  const [isImporting, setIsImporting] = useState(false); // State to manage import mode
  


  // Handle import mode separately
  const handleImport = () => {
    console.log("Starting import...");
    startImporting();
    setIsImporting(true);
  };

 

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center px-6 py-2 mt-4">
        <p className="font-bold text-3xl">Credential Library</p>

     
        <ButtonOutline
          className="mt-4 border py-2 rounded-md font-bold"
          onClick={handleImport} // Switch to import mode
        >
          IMPORT CREDENTIAL
        </ButtonOutline>
      </div>

      <div className="flex gap-4 p-4">
        {/* Left Panel: Credentials Display */}
        <div className="w-1/3 bg-[white] dark:bg-dark-bg-secondary border shadow-md rounded-md flex flex-col">
          <CredentialsDisplay
       
          />
        </div>

        {/* Right Panel: Show Details or Form */}
        <div className="w-2/3 bg-white dark:bg-dark-bg-secondary border shadow-md rounded-md flex flex-col">
          {/* Conditionally render based on import or create mode */}
          {isImporting ? (
            <CredentialsImport /> // Show import form if importing
          ) : (
            <CredentialsForm
         
          />
          )}
        </div>
      </div>
    </div>
  );
};
