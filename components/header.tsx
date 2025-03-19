import { Search, CirclePlus } from "lucide-react";
import { Input } from "../components/ui/input";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface HeaderProps {
  title: string;
  showSearch?: boolean;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  buttonLabel?: string;
  buttonLink?: string | ((event: React.MouseEvent<HTMLButtonElement>) => void);
  buttonBgColor?: string;
  buttonTextColor?: string;
  showIcon?: boolean;
  buttonClasses?: string;
}

const Header: React.FC<HeaderProps> = ({
  title,
  showSearch = true,
  searchTerm = "",
  setSearchTerm,
  buttonLabel,
  buttonLink,
  buttonBgColor = "bg-yellow-500 hover:bg-yellow-600",
  buttonTextColor = "text-black",
  showIcon = true,
  buttonClasses = "",
}) => {
  const t = useTranslations();

  return (
    <section className="w-full px-0 pt-2 bg-cover bg-center dark:bg-dark-bg">
      <div className="mx-auto px-4 mt-6 mb-4">
        <h1 className="text-3xl font-bold">{title}</h1>
      </div>
      <div className="mx-auto px-4 mb-6 flex items-center justify-between">
        <div className="relative w-full max-w-lg sm:max-w-lg">
          {showSearch && (
            <>
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={22}
              />
              <Input
                type="text"
                placeholder={t("action.search_label")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-4 border border-foreground/50 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-100"
              />
            </>
          )}
        </div>

        {buttonLabel && buttonLink && (
          typeof buttonLink === "string" ? (
            <Link href={buttonLink}>
              <button
                className={cn(
                  "font-bold py-2 px-4 h-12 flex items-center gap-4 shadow-md",
                  buttonBgColor,
                  buttonTextColor,
                  buttonClasses
                )}
              >
                {buttonLabel} {showIcon && <CirclePlus size={22} />}
              </button>
            </Link>
          ) : (
            <button
              onClick={buttonLink}
              className={cn(
                "font-bold py-2 px-4 h-12 flex items-center gap-4 shadow-md",
                buttonBgColor,
                buttonTextColor,
                buttonClasses
              )}
            >
              {buttonLabel} {showIcon && <CirclePlus size={22} />}
            </button>
          )
        )}
      </div>
    </section>
  );
};

export default Header;
