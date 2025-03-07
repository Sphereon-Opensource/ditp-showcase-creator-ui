"use client";

import { CredentialsForm } from "./credentials-form";
import { NoSelection } from "./no-selection";
import { useCredentials } from "@/hooks/use-credentials";
import { useTranslations } from 'next-intl';

interface CredentialsEditorProps {
  credential: any | null;  // It should accept the credential prop
}

export const CredentialsEditor = ({ credential }: CredentialsEditorProps) => {
  const t = useTranslations();
  
  if (!credential) {
    return (
      <div className="">
        <NoSelection text={t('credentials.no_credential_selected_message')} />
      </div>
    );
  }

  return <CredentialsForm selectedCredential={credential} />;
};
