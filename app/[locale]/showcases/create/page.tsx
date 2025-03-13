import CreateCharacterList from "@/components/character-screen/character-list";
import TabsComponent from "@/components/Tabs-component";
import { Pencil } from "lucide-react";
import { useTranslations } from "next-intl";

export default function CharacterPageMain() {
  const t = useTranslations();
  
  return (
    <div className="flex bg-light-bg dark:bg-dark-bg flex-col h-full w-full">
    <div className="flex flex-col">
      <div className="flex justify-between items-center px-6 py-2 mt-4">
        <div className="flex items-center space-x-4"></div>
        <div className="flex space-x-1 text-lg font-semibold justify-start">
          <TabsComponent slug={'create'} />
        </div>
      </div>

      <CreateCharacterList />
    </div>
  </div>
  );
}
