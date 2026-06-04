"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useTranslations } from "next-intl";

export default function RegisterPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const t = useTranslations("auth");

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  function set(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();

    if (!res.ok) {
      if (typeof data.error === "object") {
        const flat: Record<string, string> = {};
        for (const [k, v] of Object.entries(data.error)) {
          flat[k] = Array.isArray(v) ? v[0] : String(v);
        }
        setErrors(flat);
      } else {
        setErrors({ general: data.error ?? "Registration failed" });
      }
    } else {
      router.push(`/${locale}/auth/login`);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3">
            <span className="text-white font-bold text-xl">I</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{t("register_title")}</h1>
          <p className="text-gray-500 text-sm mt-1">{t("register_desc")}</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label={t("name")} type="text" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder={t("name_placeholder")} error={errors.name} required />
            <Input label={t("email")} type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder={t("email_placeholder")} error={errors.email} required />
            <Input label={t("password")} type="password" value={form.password} onChange={(e) => set("password", e.target.value)} placeholder={t("password_placeholder")} error={errors.password} required />

            {errors.general && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">{errors.general}</div>
            )}

            <Button type="submit" className="w-full" loading={loading} size="lg">
              {t("register_btn")}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            {t("has_account")}{" "}
            <Link href={`/${locale}/auth/login`} className="text-blue-600 hover:underline font-medium">
              {t("login_link")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
