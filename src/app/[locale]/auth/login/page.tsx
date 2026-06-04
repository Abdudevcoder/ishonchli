"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useTranslations } from "next-intl";

export default function LoginPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const t = useTranslations("auth");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await signIn("credentials", { email, password, redirect: false });
    if (result?.error) {
      setError(t("invalid_creds"));
    } else {
      router.push(`/${locale}`);
      router.refresh();
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
          <h1 className="text-2xl font-bold text-gray-900">{t("login_title")}</h1>
          <p className="text-gray-500 text-sm mt-1">{t("login_desc")}</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label={t("email")} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t("email_placeholder")} required autoComplete="email" />
            <Input label={t("password")} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required autoComplete="current-password" />
            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">{error}</div>
            )}
            <Button type="submit" className="w-full" loading={loading} size="lg">
              {t("login_btn")}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            {t("no_account")}{" "}
            <Link href={`/${locale}/auth/register`} className="text-blue-600 hover:underline font-medium">
              {t("register_link")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
