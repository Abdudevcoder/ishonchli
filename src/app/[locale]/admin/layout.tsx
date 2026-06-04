import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const session = await auth();
  const { locale } = await params;

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect(`/${locale}`);
  }

  const t = await getTranslations("admin");

  return (
    <div className="flex min-h-screen">
      <aside className="w-56 bg-gray-900 text-gray-100 flex flex-col py-6 px-3 flex-shrink-0">
        <div className="px-3 mb-6">
          <span className="font-bold text-lg text-white">{t("title")}</span>
          <p className="text-xs text-gray-400 mt-0.5">Ishonchli.uz</p>
        </div>
        <nav className="space-y-1 flex-1">
          {[
            { href: `/${locale}/admin`, label: t("title"), icon: "📊" },
            { href: `/${locale}/admin/reports`, label: t("reports"), icon: "📋" },
            { href: `/${locale}/admin/users`, label: t("users"), icon: "👥" },
            { href: `/${locale}/admin/statistics`, label: t("statistics"), icon: "📈" },
            { href: `/${locale}/admin/settings`, label: t("settings"), icon: "⚙️" },
            { href: `/${locale}/admin/guide`, label: "Guide", icon: "📖" },
          ].map((item) => (
            <Link key={item.href} href={item.href} className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition">
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="px-3 pt-4 border-t border-gray-800">
          <Link href={`/${locale}`} className="text-xs text-gray-400 hover:text-gray-200">← {t("back_to_site")}</Link>
        </div>
      </aside>
      <main className="flex-1 bg-gray-50 overflow-auto">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
