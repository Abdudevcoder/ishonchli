import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Providers } from "./providers";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: "Ishonchli.uz – Fraud Prevention for Online Markets",
  description: "Search sellers, check trust scores, and report fraud in Uzbekistan's online marketplaces.",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "uz" | "ru" | "en")) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={`${inter.className} bg-gray-50 min-h-screen flex flex-col`}>
        <NextIntlClientProvider messages={messages}>
          <Providers>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
