import Link from "next/link";
import { getTranslations, getLocale } from "next-intl/server";

export default async function NotFound() {
  const t = await getTranslations("notfound");
  const locale = await getLocale();

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-8xl font-bold text-gray-200 mb-4">404</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{t("title")}</h1>
        <p className="text-gray-500 mb-6">{t("desc")}</p>
        <Link href={`/${locale}`} className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-medium">
          {t("home_btn")}
        </Link>
      </div>
    </div>
  );
}
