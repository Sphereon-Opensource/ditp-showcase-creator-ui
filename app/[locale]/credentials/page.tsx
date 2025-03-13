import { PageParams } from "@/types";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { CredentialsPage } from "@/components/credentials/credentials-page";

export default async function Credentials({ params }: { params: PageParams }) {
	const { locale } = await params;
	setRequestLocale(locale);
	const t = await getTranslations();

	return (
		<div className="flex text-light-text dark:bg-dark-bg dark:text-dark-text flex-col h-full w-full">
			<CredentialsPage />
		</div>
	);
}
