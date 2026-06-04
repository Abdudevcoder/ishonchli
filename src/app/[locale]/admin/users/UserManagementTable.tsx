"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Role } from "@prisma/client";
import { useTranslations } from "next-intl";

interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: Date | string;
  _count: { reports: number };
}

export function UserManagementTable({ users: initial, total, page, limit }: { users: User[]; total: number; page: number; limit: number }) {
  const t = useTranslations("admin");
  const [users, setUsers] = useState(initial);
  const [updating, setUpdating] = useState<string | null>(null);
  const totalPages = Math.ceil(total / limit);

  async function toggleRole(id: string, currentRole: Role) {
    const newRole = currentRole === "ADMIN" ? "USER" : "ADMIN";
    setUpdating(id);
    const res = await fetch(`/api/admin/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole }),
    });
    if (res.ok) setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role: newRole as Role } : u)));
    setUpdating(null);
  }

  async function deleteUser(id: string) {
    if (!confirm("Delete this user permanently?")) return;
    setUpdating(id);
    const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    if (res.ok) setUsers((prev) => prev.filter((u) => u.id !== id));
    setUpdating(null);
  }

  return (
    <div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">{t("user_col")}</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">{t("role_col")}</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">{t("reports_col")}</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">{t("joined_col")}</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">{t("actions_col")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{u.name}</div>
                    <div className="text-xs text-gray-400">{u.email}</div>
                  </td>
                  <td className="px-4 py-3"><Badge variant={u.role === "ADMIN" ? "danger" : "info"}>{u.role}</Badge></td>
                  <td className="px-4 py-3 text-gray-600">{u._count.reports}</td>
                  <td className="px-4 py-3 text-xs text-gray-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Button size="sm" variant="ghost" loading={updating === u.id} onClick={() => toggleRole(u.id, u.role)} className="text-xs px-2 py-1">
                        {u.role === "ADMIN" ? t("revoke_admin") : t("make_admin")}
                      </Button>
                      <Button size="sm" variant="danger" loading={updating === u.id} onClick={() => deleteUser(u.id)} className="text-xs px-2 py-1">
                        {t("delete")}
                      </Button>
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
          {page > 1 && <a href={`?page=${page - 1}`} className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50 bg-white">Previous</a>}
          <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
          {page < totalPages && <a href={`?page=${page + 1}`} className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50 bg-white">Next</a>}
        </div>
      )}
    </div>
  );
}
