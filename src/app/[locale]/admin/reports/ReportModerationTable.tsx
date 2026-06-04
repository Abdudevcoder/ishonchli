"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ReportCategory, ReportStatus, ReportType } from "@prisma/client";
import { useTranslations } from "next-intl";

interface Report {
  id: string;
  type: ReportType;
  category: ReportCategory;
  description: string;
  status: ReportStatus;
  createdAt: Date | string;
  seller: { id: string; phone: string | null; telegramUsername: string | null; marketplaceUsername: string | null };
  user: { name: string; email: string };
}

export function ReportModerationTable({
  reports: initial, total, page, limit, status,
}: {
  reports: Report[];
  total: number;
  page: number;
  limit: number;
  status?: string;
}) {
  const t = useTranslations("admin");
  const tCat = useTranslations("categories");
  const [reports, setReports] = useState(initial);
  const [updating, setUpdating] = useState<string | null>(null);
  const totalPages = Math.ceil(total / limit);

  async function updateStatus(id: string, newStatus: ReportStatus) {
    setUpdating(id);
    const res = await fetch(`/api/reports/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) setReports((prev) => prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r)));
    setUpdating(null);
  }

  async function deleteReport(id: string) {
    if (!confirm("Delete this report permanently?")) return;
    setUpdating(id);
    const res = await fetch(`/api/reports/${id}`, { method: "DELETE" });
    if (res.ok) setReports((prev) => prev.filter((r) => r.id !== id));
    setUpdating(null);
  }

  return (
    <div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">{t("report_col")}</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">{t("seller_col")}</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">{t("reporter_col")}</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">{t("status_col")}</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">{t("date_col")}</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">{t("actions_col")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {reports.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${r.type === "FRAUD" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                        {r.type === "FRAUD" ? "Fraud" : "Positive"}
                      </span>
                      {r.type === "FRAUD" && <span className="text-xs text-gray-500">{tCat(r.category)}</span>}
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-2 max-w-xs">{r.description}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600">
                    {r.seller.telegramUsername ? `@${r.seller.telegramUsername}` : r.seller.marketplaceUsername ?? r.seller.phone ?? "Unknown"}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600">
                    <div>{r.user.name}</div>
                    <div className="text-gray-400">{r.user.email}</div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={r.status === "APPROVED" ? "success" : r.status === "REJECTED" ? "danger" : "warning"}>{r.status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      {r.status !== "APPROVED" && (
                        <Button size="sm" variant="success" loading={updating === r.id} onClick={() => updateStatus(r.id, "APPROVED")} className="text-xs px-2 py-1">{t("approve")}</Button>
                      )}
                      {r.status !== "REJECTED" && (
                        <Button size="sm" variant="danger" loading={updating === r.id} onClick={() => updateStatus(r.id, "REJECTED")} className="text-xs px-2 py-1">{t("reject")}</Button>
                      )}
                      <Button size="sm" variant="ghost" loading={updating === r.id} onClick={() => deleteReport(r.id)} className="text-xs px-2 py-1 text-red-500 border-red-200">{t("delete")}</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          {page > 1 && <a href={`?${status ? `status=${status}&` : ""}page=${page - 1}`} className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50 bg-white">Previous</a>}
          <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
          {page < totalPages && <a href={`?${status ? `status=${status}&` : ""}page=${page + 1}`} className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50 bg-white">Next</a>}
        </div>
      )}
    </div>
  );
}
