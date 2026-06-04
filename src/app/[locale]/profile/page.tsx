"use client";

import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { useEffect } from "react";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const t = useTranslations("profile");

  useEffect(() => {
    if (status === "unauthenticated") router.push(`/${locale}/auth/login`);
  }, [status, router, locale]);

  if (!session?.user) {
    return <div className="max-w-2xl mx-auto px-4 py-10"><div className="animate-pulse h-48 bg-gray-200 rounded-xl" /></div>;
  }

  const { user } = session;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{t("title")}</h1>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-2xl font-bold text-blue-600">
            {user.name[0].toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
            <p className="text-sm text-gray-500">{user.email}</p>
            <div className="mt-1">
              <Badge variant={user.role === "ADMIN" ? "danger" : "info"}>{user.role}</Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Link href={`/${locale}/my-reports`} className="p-4 rounded-xl bg-blue-50 border border-blue-100 hover:bg-blue-100 transition">
            <div className="text-2xl mb-1">📋</div>
            <div className="font-semibold text-gray-800">{t("my_reports")}</div>
            <div className="text-xs text-gray-500">{t("my_reports_desc")}</div>
          </Link>
          <Link href={`/${locale}/favorites`} className="p-4 rounded-xl bg-yellow-50 border border-yellow-100 hover:bg-yellow-100 transition">
            <div className="text-2xl mb-1">⭐</div>
            <div className="font-semibold text-gray-800">{t("saved")}</div>
            <div className="text-xs text-gray-500">{t("saved_desc")}</div>
          </Link>
          <Link href={`/${locale}/submit-report`} className="p-4 rounded-xl bg-red-50 border border-red-100 hover:bg-red-100 transition">
            <div className="text-2xl mb-1">⚠️</div>
            <div className="font-semibold text-gray-800">{t("report_fraud")}</div>
            <div className="text-xs text-gray-500">{t("report_fraud_desc")}</div>
          </Link>
          <Link href={`/${locale}/submit-report`} className="p-4 rounded-xl bg-green-50 border border-green-100 hover:bg-green-100 transition">
            <div className="text-2xl mb-1">✅</div>
            <div className="font-semibold text-gray-800">{t("write_review")}</div>
            <div className="text-xs text-gray-500">{t("write_review_desc")}</div>
          </Link>
        </div>
      </div>
    </div>
  );
}
