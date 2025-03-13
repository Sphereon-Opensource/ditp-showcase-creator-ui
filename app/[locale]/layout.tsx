import React, { PropsWithChildren } from "react";
import { Montserrat } from "next/font/google";
import { ThemeProvider } from "@/providers/theme-provider";
import { Footer } from "@/components/footer";
import i18nConfig from "@/i18n.config";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { Locale, PageParams } from "@/types";
import { Toaster } from "@/components/ui/sonner"

import "./globals.css";
import Sidebar from "@/components/sidebar";
import { QueryProviders } from "@/providers/query-provider";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const locale = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export function generateStaticParams() {
  return i18nConfig.locales.map((locale) => ({ locale }));
}

type Params = PropsWithChildren<{
  params: PageParams;
}>;

export default async function RootLayout({
  children,
  params,
}: Params) {
  const { locale } = await params;
  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale)) {
    notFound();
  }

  // Providing all messages to the client
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${montserrat.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProviders>
            <NextIntlClientProvider messages={messages}>
              <div className="flex flex-col h-screen bg-light-bg dark:bg-dark-bg text-light-text">
                <div className="flex flex-grow">
                <Sidebar />
                <main className="flex-1 overflow-auto">{children}</main>
                <Toaster />
              </div>
              <Footer />
              </div>
            </NextIntlClientProvider>
          </QueryProviders>
        </ThemeProvider>
      </body>
    </html>
  );
}
