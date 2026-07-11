"use client";

import { useCallback, useEffect, useState } from "react";
import { Card } from "./Card";
import { useI18n } from "@/lib/i18n";
import { supabase, type Product } from "@/lib/supabaseClient";
import { useAuth } from "@/lib/auth";

type Props = {
  /** Alterado externamente para forcar recarga apos um novo cadastro. */
  refreshKey: number;
};

export function Dashboard({ refreshKey }: Props) {
  const { t, lang } = useI18n();
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(12);
    setProducts(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (user) load();
  }, [user, refreshKey, load]);

  const currency = t("misc.currency");
  const locale = lang === "zh" ? "zh-CN" : "pt-BR";

  return (
    <Card title={t("dash.title")} badge={t("dash.badge")} icon={<ListIcon />}>
      {loading ? (
        <p className="font-mono text-xs text-muted cursor-blink">
          {t("dash.loading")}
        </p>
      ) : products.length === 0 ? (
        <p className="font-mono text-xs text-muted">{t("dash.empty")}</p>
      ) : (
        <ul className="divide-y divide-line-soft font-mono text-sm">
          {products.map((p) => (
            <li
              key={p.id}
              className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0"
            >
              <span className="h-2 w-2 shrink-0 rounded-full bg-neon" />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="truncate text-gray-100">{p.name}</span>
                  <span className="shrink-0 text-[10px] text-cyan">
                    {p.barcode}
                  </span>
                </div>
                <div className="text-[10px] uppercase tracking-wider text-muted-2">
                  {new Date(p.created_at).toLocaleString(locale, {
                    day: "2-digit",
                    month: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
              <div className="shrink-0 text-right">
                <div className="text-neon">
                  {currency}{" "}
                  {p.sale_price.toLocaleString(locale, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
                <div className="text-[10px] uppercase tracking-wider text-gold">
                  {p.stock} {t("dash.stock")}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

function ListIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01" strokeLinecap="round" />
    </svg>
  );
}
