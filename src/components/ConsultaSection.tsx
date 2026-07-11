"use client";

import { useState } from "react";
import { Card } from "./Card";
import { BarcodeScanner } from "./BarcodeScanner";
import { useI18n } from "@/lib/i18n";
import { supabase, type Product } from "@/lib/supabaseClient";

type Result =
  | { status: "idle" }
  | { status: "searching" }
  | { status: "found"; product: Product }
  | { status: "not_found"; barcode: string };

export function ConsultaSection() {
  const { t, lang } = useI18n();
  const [barcode, setBarcode] = useState("");
  const [result, setResult] = useState<Result>({ status: "idle" });

  const currency = t("misc.currency");
  const locale = lang === "zh" ? "zh-CN" : "pt-BR";
  const money = (v: number) =>
    v.toLocaleString(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  async function lookup(code: string) {
    const clean = code.trim();
    if (!clean) return;
    setBarcode(clean);
    setResult({ status: "searching" });

    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("barcode", clean)
      .limit(1)
      .maybeSingle();

    // Registra a consulta para alimentar o ranking.
    await supabase.from("scan_events").insert({
      barcode: clean,
      product_id: data?.id ?? null,
    });

    setResult(
      data
        ? { status: "found", product: data as Product }
        : { status: "not_found", barcode: clean }
    );
  }

  return (
    <div className="space-y-4">
      <BarcodeScanner onDetected={(code) => lookup(code)} />

      <Card title={t("lookup.title")} badge={t("lookup.badge")} icon={<SearchIcon />}>
        <p className="mb-3 font-mono text-xs leading-relaxed text-muted">
          {t("lookup.hint")}
        </p>

        <div className="flex gap-2">
          <input
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && lookup(barcode)}
            placeholder={t("form.placeholder.barcode")}
            inputMode="numeric"
            className="w-full rounded-md border border-line bg-panel-2 px-3 py-2.5 font-mono text-sm text-cyan outline-none transition-colors placeholder:text-muted-2 focus:border-neon/50 focus:ring-1 focus:ring-neon/30"
          />
          <button
            onClick={() => lookup(barcode)}
            disabled={result.status === "searching"}
            className="shrink-0 rounded-md border border-neon/50 bg-neon/10 px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-widest text-neon transition-all hover:bg-neon/20 hover:shadow-neon disabled:opacity-50"
          >
            {result.status === "searching" ? t("lookup.searching") : t("lookup.search")}
          </button>
        </div>

        {/* Resultado */}
        {result.status === "not_found" ? (
          <div className="mt-4 rounded-md border border-danger/40 bg-danger/5 px-3 py-3 font-mono text-xs text-danger">
            ⚠ {t("lookup.not_found")}
            <span className="ml-2 text-cyan">{result.barcode}</span>
          </div>
        ) : null}

        {result.status === "found" ? (
          <div className="mt-4 rounded-md border border-neon/30 bg-neon/5 p-4">
            <div className="mb-3 flex items-baseline justify-between gap-2">
              <span className="font-mono text-base font-bold text-gray-100">
                {result.product.name}
              </span>
              <span className="font-mono text-[10px] text-cyan">
                {result.product.barcode}
              </span>
            </div>

            {result.product.description ? (
              <p className="mb-3 font-mono text-xs text-muted">
                {result.product.description}
              </p>
            ) : null}

            <dl className="grid grid-cols-3 gap-2 text-center">
              <Stat label={t("lookup.sale_price")} value={`${currency} ${money(result.product.sale_price)}`} accent="neon" />
              <Stat label={t("lookup.puxador")} value={`${currency} ${money(result.product.price_puxador)}`} accent="gold" />
              <Stat label={t("lookup.stock")} value={String(result.product.stock)} accent="cyan" />
            </dl>
          </div>
        ) : null}
      </Card>
    </div>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: "neon" | "gold" | "cyan";
}) {
  const color =
    accent === "neon" ? "text-neon" : accent === "gold" ? "text-gold" : "text-cyan";
  return (
    <div className="rounded-md border border-line bg-panel-2 px-2 py-2.5">
      <div className="mb-1 font-mono text-[9px] uppercase tracking-wider text-muted">
        {label}
      </div>
      <div className={`font-mono text-sm font-bold ${color}`}>{value}</div>
    </div>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="11" cy="11" r="6.5" />
      <path d="m20 20-3.6-3.6" strokeLinecap="round" />
    </svg>
  );
}
