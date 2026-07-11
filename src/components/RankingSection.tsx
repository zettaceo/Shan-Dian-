"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Card } from "./Card";
import { useI18n } from "@/lib/i18n";
import { supabase, type TopScanned } from "@/lib/supabaseClient";
import { categorize, categoryLabel, CATEGORY_META, type CategoryKey } from "@/lib/categories";
import { CategoryDonut, type DonutSlice } from "./CategoryDonut";

type Period = "day" | "week" | "month";

const PERIOD_MS: Record<Period, number> = {
  day: 24 * 60 * 60 * 1000,
  week: 7 * 24 * 60 * 60 * 1000,
  month: 30 * 24 * 60 * 60 * 1000,
};

export function RankingSection() {
  const { t, lang } = useI18n();
  const [period, setPeriod] = useState<Period>("day");
  const [rows, setRows] = useState<TopScanned[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const since = new Date(Date.now() - PERIOD_MS[period]).toISOString();
    const [top, count] = await Promise.all([
      supabase.rpc("top_scanned", { since }),
      supabase
        .from("scan_events")
        .select("id", { count: "exact", head: true })
        .gte("scanned_at", since),
    ]);
    setRows((top.data as TopScanned[]) ?? []);
    setTotal(count.count ?? 0);
    setLoading(false);
  }, [period]);

  useEffect(() => {
    load();
  }, [load]);

  const max = rows.length ? Math.max(...rows.map((r) => r.scans)) : 0;

  // Distribuicao de consultas por categoria (para o grafico de rosca + KPI)
  const { slices, topCategory } = useMemo(() => {
    const acc = new Map<CategoryKey, number>();
    for (const r of rows) {
      const key = categorize(r.name);
      acc.set(key, (acc.get(key) ?? 0) + r.scans);
    }
    const sl: DonutSlice[] = [...acc.entries()].map(([key, value]) => ({ key, value }));
    const best = [...acc.entries()].sort((a, b) => b[1] - a[1])[0];
    return { slices: sl, topCategory: best ? best[0] : null };
  }, [rows]);

  return (
    <div className="space-y-4">
      {/* KPIs */}
      <div className="grid grid-cols-3 gap-3">
        <Kpi label={t("rank.total_scans")} value={String(total)} accent="neon" />
        <Kpi label={t("rank.unique")} value={String(rows.length)} accent="cyan" />
        <Kpi
          label={t("rank.top_category")}
          value={
            topCategory
              ? `${CATEGORY_META[topCategory].emoji} ${categoryLabel(topCategory, lang)}`
              : "—"
          }
          accent="gold"
          small
        />
      </div>

      <Card title={t("rank.title")} badge={t("rank.badge")} icon={<ChartIcon />}>
        {/* Toggle de periodo */}
        <div className="mb-4 flex overflow-hidden rounded-md border border-line font-mono text-xs">
          {(["day", "week", "month"] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`flex-1 px-3 py-2 uppercase tracking-widest transition-colors ${
                period === p
                  ? "bg-gold text-black font-bold"
                  : "bg-panel-2 text-muted hover:text-gray-200"
              }`}
            >
              {t(`rank.${p}` as "rank.day")}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="font-mono text-xs text-muted cursor-blink">{t("rank.loading")}</p>
        ) : rows.length === 0 ? (
          <p className="font-mono text-xs text-muted">{t("rank.empty")}</p>
        ) : (
          <>
            {/* Grafico de rosca por categoria */}
            <div className="mb-5 rounded-md border border-line-soft bg-panel-2/40 p-4">
              <CategoryDonut slices={slices} unit={t("rank.scans")} />
            </div>

          <ol className="space-y-3 font-mono text-sm">
            {rows.map((r, i) => {
              const cat = categorize(r.name);
              return (
                <li key={`${r.product_id ?? r.barcode}-${i}`} className="flex items-center gap-3">
                  {/* Posicao */}
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[11px] font-bold ${
                      i === 0
                        ? "border-gold/60 bg-gold/10 text-gold"
                        : "border-line text-muted-2"
                    }`}
                  >
                    {i + 1}
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-baseline justify-between gap-2">
                      <span className="flex min-w-0 items-center gap-1.5">
                        <span className="shrink-0">{CATEGORY_META[cat].emoji}</span>
                        <span className="truncate text-gray-100">{r.name}</span>
                      </span>
                      <span className="shrink-0 text-xs text-neon">
                        {r.scans} <span className="text-muted">{t("rank.scans")}</span>
                      </span>
                    </div>
                    {/* Barra proporcional com gradiente */}
                    <div className="h-2 w-full overflow-hidden rounded-full bg-panel-2">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-neon-dim to-neon"
                        style={{ width: `${max ? (r.scans / max) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
          </>
        )}
      </Card>
    </div>
  );
}

function Kpi({
  label,
  value,
  accent,
  small,
}: {
  label: string;
  value: string;
  accent: "neon" | "gold" | "cyan";
  small?: boolean;
}) {
  const color = accent === "neon" ? "text-neon" : accent === "gold" ? "text-gold" : "text-cyan";
  return (
    <div className="rounded-lg border border-line bg-panel/80 px-2 py-3 text-center">
      <div className="mb-1 font-mono text-[9px] uppercase tracking-wider text-muted">{label}</div>
      <div className={`font-mono font-bold ${color} ${small ? "text-[11px] leading-tight" : "text-lg"}`}>
        {value}
      </div>
    </div>
  );
}

function ChartIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" strokeLinecap="round" />
    </svg>
  );
}
