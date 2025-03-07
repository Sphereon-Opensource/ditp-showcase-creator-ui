import { NoSelection } from "../credentials/no-selection";
import { Trash2 } from "lucide-react";
import { ShowcaseJSON } from "@/types";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";
import { useOnboarding } from "@/hooks/use-onboarding";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import ButtonOutline from "../ui/button-outline";

interface DisplayAddedCredentialsProps {
  selectedCharacter: number;
  showcaseJSON: ShowcaseJSON;
  localJSON: {
    credentials?: string[];
  };
  removeCredential: (credential: string) => void;
}

export const DisplayAddedCredentials = ({
  selectedCharacter,
  showcaseJSON,
  localJSON,
  removeCredential,
}: DisplayAddedCredentialsProps) => {
  const t = useTranslations();
  const { selectedStep, stepState, screens, setStepState } = useOnboarding();
  const credentials = localJSON.credentials || [];
  const hasCredentials = credentials.length > 0;
  const [isEditing, setIsEditing] = useState(false);

  if (!hasCredentials) {
    return (
      <div className="m-5 p-5 w-full h-full">
        <NoSelection text={t("onboarding.no_credentials_added_message")} />
      </div>
    );
  }

  return (
    <div className="">
      <p className="text-md font-bold mt-2">
        {t("credentials.credential_added_label")} {credentials.length}
      </p>

      {credentials.map((credential: string, index: number) => {
        const credentialData =
          showcaseJSON.personas[selectedCharacter].credentials[credential];
        console.log("credentialData: ", credentialData);

        if (!credentialData) return null;
        console.log("cred", credential);
        return (
          <div key={credential} className="flex flex-col pt-2">
            <div className="w-full border border-dark-border dark:border-light-border rounded-t-lg">
              {/* Credential Header */}
              <div
                className={cn(
                  "px-4 py-3 rounded-t-lg flex items-center justify-between",
                  "bg-light-bg dark:bg-dark-bg"
                )}
              >
                {/* Left Section - Image and User Info */}
                <div className="flex items-center flex-1">
                  <Image
                    src={require(`../../public/assets/NavBar/${"Joyce"}.png`)}
                    alt={"Bob"}
                    width={50}
                    height={50}
                    className="rounded-full"
                  />
                  <div className="space-y-1 ml-4">
                    <p className="font-semibold">{credentialData.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {credentialData.issuer_name}
                    </p>
                  </div>
                </div>

                {/* Center Section - Attributes */}
                <div className=" flex flex-col justify-center items-start">
                  <p className="font-semibold">Attributes</p>
                  <p className="">{credentialData.attributes.length}</p>
                </div>

                {/* Right Section - Delete Button */}
                <div className="flex-1 flex justify-end items-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.preventDefault();
                      removeCredential(credential);
                    }}
                    className="hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="p-2">
                <Button
                  variant="ghost"
                  className="text-xs font-semibold hover:bg-transparent hover:underline p-1"
                  onClick={(e) => {
                    setIsEditing(true);
                    e.preventDefault();
                    // setEditingCredentials([...editingCredentials, index]);
                  }}
                >
                  ADD ATTRIBUTE VALUES
                </Button>
              </div>
              {/* Proof Request Section */}
              {isEditing && (
                <>
                  <div
                    className={cn(
                      "p-3 rounded-b-lg",
                      "bg-white dark:bg-dark-bg"
                    )}
                  >
                    {credentialData.attributes.map((attr) => (
                      <div className="grid grid-cols-2 gap-4">
                        {/* Attribute Column */}
                        <div className="space-y-2 flex flex-col justify-center p-4">
                          <label className="text-sm font-bold">
                            Attribute
                          </label>
                          <Input
                            className="text-light-text dark:text-dark-text border border-dark-border dark:border-light-border"
                            value={attr.name}
                            disabled
                          />
                        </div>

                        {/* Attribute Value Column */}
                        <div className="space-y-2 flex flex-col justify-center p-4">
                          <label className="text-sm font-bold">
                            Attribute Value
                          </label>
                          <Input
                            className="border border-dark-border dark:border-light-border"
                            value={attr.value}
                            onChange={() => {}}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="justify-self-center mb-2">
                    <ButtonOutline onClick={() => setIsEditing(false)}>
                      {t("action.save_label")}
                    </ButtonOutline>
                  </div>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
