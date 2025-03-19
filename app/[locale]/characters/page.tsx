import CharactersPage from "@/components/character-screen/characters";
import { PageParams } from "@/types";
import { setRequestLocale } from "next-intl/server";

export default async function CharacterPageMain({ params }: { params: PageParams }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div>
      <CharactersPage />
    </div>
  );
}
