"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ImageUpload } from "@/components/report/ImageUpload";
import { useTranslations } from "next-intl";

type ReportType = "fraud" | "positive";

export default function SubmitReportPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const t = useTranslations("submit");
  const tCat = useTranslations("categories");

  const [reportType, setReportType] = useState<ReportType>("fraud");
  const [form, setForm] = useState({
    phone: "", telegramUsername: "", marketplaceUsername: "",
    marketplaceUrl: "", category: "SCAM", description: "", rating: 5, evidenceUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (status === "unauthenticated") {
    router.push(`/${locale}/auth/login`);
    return null;
  }

  function set(field: string, value: string | number) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const endpoint = reportType === "fraud" ? "/api/reports" : "/api/reports/positive";
    const body = reportType === "fraud"
      ? { phone: form.phone || undefined, telegramUsername: form.telegramUsername || undefined, marketplaceUsername: form.marketplaceUsername || undefined, marketplaceUrl: form.marketplaceUrl || undefined, category: form.category, description: form.description, evidenceUrl: form.evidenceUrl || undefined }
      : { phone: form.phone || undefined, telegramUsername: form.telegramUsername || undefined, marketplaceUsername: form.marketplaceUsername || undefined, description: form.description, rating: form.rating, evidenceUrl: form.evidenceUrl || undefined };

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(typeof data.error === "string" ? data.error : "Submission failed. Check fields.");
    } else {
      router.push(`/${locale}/my-reports`);
    }
    setLoading(false);
  }

  const CATEGORIES = ["SCAM", "FAKE_PRODUCT", "NON_DELIVERY", "PAYMENT_FRAUD", "ACCOUNT_THEFT", "OTHER"] as const;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">{t("title")}</h1>
      <p className="text-sm text-gray-500 mb-6">{t("desc")}</p>

      <div className="flex gap-3 mb-6">
        {[
          { value: "fraud" as ReportType, label: t("fraud_tab"), icon: "⚠️" },
          { value: "positive" as ReportType, label: t("positive_tab"), icon: "✅" },
        ].map((tp) => (
          <button
            key={tp.value}
            type="button"
            onClick={() => setReportType(tp.value)}
            className={`flex-1 py-3 px-4 rounded-xl border-2 text-sm font-medium transition ${
              reportType === tp.value
                ? tp.value === "fraud" ? "border-red-400 bg-red-50 text-red-700" : "border-green-400 bg-green-50 text-green-700"
                : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            {tp.icon} {tp.label}
          </button>
        ))}
      </div>

      <form onSubmit={submit} className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-3">{t("seller_section")}</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input label={t("phone_label")} value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder={t("phone_placeholder")} />
            <Input label={t("telegram_label")} value={form.telegramUsername} onChange={(e) => set("telegramUsername", e.target.value)} placeholder={t("telegram_placeholder")} />
            <Input label={t("marketplace_label")} value={form.marketplaceUsername} onChange={(e) => set("marketplaceUsername", e.target.value)} placeholder={t("marketplace_placeholder")} />
          </div>
          {reportType === "fraud" && (
            <Input label={t("url_label")} value={form.marketplaceUrl} onChange={(e) => set("marketplaceUrl", e.target.value)} placeholder={t("url_placeholder")} className="mt-3" />
          )}
        </div>

        {reportType === "fraud" && (
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">{t("category_label")}</label>
            <select
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {CATEGORIES.map((c) => <option key={c} value={c}>{tCat(c)}</option>)}
            </select>
          </div>
        )}

        {reportType === "positive" && (
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">{t("rating_label")}</label>
            <div className="flex gap-2">
              {[1,2,3,4,5].map((r) => (
                <button key={r} type="button" onClick={() => set("rating", r)} className={`text-2xl transition ${r <= form.rating ? "text-yellow-400" : "text-gray-200"}`}>★</button>
              ))}
            </div>
          </div>
        )}

        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">
            {t("desc_label")} {reportType === "fraud" ? t("desc_min_fraud") : t("desc_min_positive")}
          </label>
          <textarea
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            rows={5}
            placeholder={reportType === "fraud" ? t("desc_placeholder_fraud") : t("desc_placeholder_positive")}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            required
            minLength={reportType === "fraud" ? 20 : 10}
          />
        </div>

        <ImageUpload onUpload={(url) => set("evidenceUrl", url)} current={form.evidenceUrl} />

        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">{error}</div>
        )}

        <div className="pt-2">
          <Button type="submit" loading={loading} variant={reportType === "fraud" ? "danger" : "success"} size="lg" className="w-full">
            {reportType === "fraud" ? t("submit_fraud") : t("submit_positive")}
          </Button>
        </div>
      </form>
    </div>
  );
}
