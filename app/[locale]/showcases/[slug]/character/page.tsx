import MyShowcaseMain from "@/components/showcases-screen";
import { PageParams } from "@/types";

export default function CharacterPageMain({ params }: { params: PageParams }) {
  return (
    <div>
      <MyShowcaseMain slug="example-name" />
    </div>
  );
}
