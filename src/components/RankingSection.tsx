"use client";

import { useCallback, useEffect, useState } from "react";
import { Card } from "./Card";
import { useI18n } from "@/lib/i18n";
import { supabase, type TopScanned } from "@/lib/supabaseClient";

type Period = "day" | "week" | "month";

const PERIOD_MS: Record<Period, number> = {
  day: 24 * 60 * 60 * 1000,
  week: 7 * 24 * 60 * 60 * 1000,
  month: 30 * 24 * 60 * 60 * 1000,
};

export function RankingSection() {
  const { t } = useI18n();
  const [period, setPeriod] = useState<Period>("day");
  const [rows, setRows] = useState<TopScanned[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const since = new Date(Date.now() - PERIOD_MS[period]).toISOString();
    const { data } = await supabase.rpc("top_scanned", { since });
    setRows((data as TopScanned[]) ?? []);
    setLoading(false);
  }, [period]);

  useEffect(() => {
    load();
  }, [load]);

  const max = rows.length ? Math.max(...rows.map((r) => r.scans)) : 0;

  return (
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
        <ol className="space-y-2.5 font-mono text-sm">
          {rows.map((r, i) => (
            <li key={`${r.product_id ?? r.barcode}-${i}`} className="flex items-center gap-3">
              <span
                className={`w-5 shrink-0 text-right text-xs font-bold ${
                  i === 0 ? "text-gold" : "text-muted-2"
                }`}
              >
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-baseline justify-between gap-2">
                  <span className="truncate text-gray-100">{r.name}</span>
                  <span className="shrink-0 text-xs text-neon">
                    {r.scans} <span className="text-muted">{t("rank.scans")}</span>
                  </span>
                </div>
                {/* Barra proporcional */}
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-panel-2">
                  <div
                    className="h-full rounded-full bg-neon/70"
                    style={{ width: `${max ? (r.scans / max) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </li>
          ))}
        </ol>
      )}
    </Card>
  );
}

function ChartIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" strokeLinecap="round" />
    </svg>
  );
}
