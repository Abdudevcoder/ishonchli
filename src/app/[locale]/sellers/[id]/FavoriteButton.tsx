"use client";

import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { useTranslations } from "next-intl";

export function FavoriteButton({ sellerId }: { sellerId: string }) {
  const { data: session } = useSession();
  const params = useParams();
  const locale = params.locale as string;
  const t = useTranslations("seller");
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!session?.user) return;
    fetch("/api/favorites")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setIsFavorite(data.some((f: { sellerId: string }) => f.sellerId === sellerId));
        }
      })
      .catch(() => {});
  }, [session, sellerId]);

  if (!session?.user) {
    return (
      <a href={`/${locale}/auth/login`} className="block w-full text-center text-sm text-blue-600 hover:underline">
        {t("login_to_save")}
      </a>
    );
  }

  async function toggle() {
    setLoading(true);
    const method = isFavorite ? "DELETE" : "POST";
    await fetch("/api/favorites", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sellerId }),
    });
    setIsFavorite(!isFavorite);
    setLoading(false);
  }

  return (
    <Button variant={isFavorite ? "secondary" : "ghost"} className="w-full" onClick={toggle} loading={loading}>
      {isFavorite ? `★ ${t("saved")}` : `☆ ${t("save_seller")}`}
    </Button>
  );
}
