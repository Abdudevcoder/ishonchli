"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { ReportCard } from "@/components/report/ReportCard";
import { ReportCategory, ReportStatus, ReportType } from "@prisma/client";
import Link from "next/link";
import { useTranslations } from "next-intl";

interface MyReport {
  id: string;
  category: ReportCategory;
  description: string;
  status: ReportStatus;
  type: ReportType;
  rating?: number | null;
  createdAt: string;
  seller: { id: string; phone?: string | null; telegramUsername?: string | null; marketplaceUsername?: string | null };
  user: { id: string; name: string };
  _count?: { comments: number; votes: number };
}

export default function MyReportsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const t = useTranslations("my_reports");
  const [reports, setReports] = useState<MyReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") { router.push(`/${locale}/auth/login`); return; }
    if (status === "authenticated") {
      fetch("/api/reports/mine").then((r) => r.json()).then(setReports).finally(() => setLoading(false));
    }
  }, [status, router, locale]);

  if (loading || !session) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="animate-pulse space-y-4">
          {[0,1,2].map((i) => <div key={i} className="h-32 bg-gray-200 rounded-xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>
          <p className="text-sm text-gray-500 mt-1">{t("desc")}</p>
        </div>
        <Link href={`/${locale}/submit-report`} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition">
          {t("new")}
        </Link>
      </div>

      {reports.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <div className="text-5xl mb-3">📋</div>
          <h3 className="font-semibold text-gray-700 mb-2">{t("empty_title")}</h3>
          <p className="text-sm text-gray-400 mb-4">{t("empty_desc")}</p>
          <Link href={`/${locale}/submit-report`} className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition">
            {t("submit_btn")}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reports.map((r) => <ReportCard key={r.id} report={r} />)}
        </div>
      )}
    </div>
  );
}
