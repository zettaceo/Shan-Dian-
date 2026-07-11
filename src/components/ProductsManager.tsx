"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Card } from "./Card";
import { useI18n } from "@/lib/i18n";
import { supabase, type Product } from "@/lib/supabaseClient";
import {
  categorize,
  categoryLabel,
  CATEGORY_META,
  CATEGORY_ORDER,
  type CategoryKey,
} from "@/lib/categories";

export function ProductsManager() {
  const { t, lang } = useI18n();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<string | null>(null);

  const locale = lang === "zh" ? "zh-CN" : "pt-BR";
  const currency = t("misc.currency");
  const money = (v: number) =>
    v.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    setProducts((data as Product[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // KPIs premium
  const stats = useMemo(() => {
    const units = products.reduce((s, p) => s + p.stock, 0);
    const value = products.reduce((s, p) => s + p.sale_price * p.stock, 0);
    return { count: products.length, units, value };
  }, [products]);

  // Filtro de busca + agrupamento por categoria
  const grouped = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q
      ? products.filter(
          (p) =>
            p.name.toLowerCase().includes(q) || p.barcode.toLowerCase().includes(q)
        )
      : products;

    const map = new Map<CategoryKey, Product[]>();
    for (const p of filtered) {
      const key = categorize(p.name, p.description);
      const arr = map.get(key) ?? [];
      arr.push(p);
      map.set(key, arr);
    }
    return CATEGORY_ORDER.filter((k) => map.has(k)).map((k) => ({
      key: k,
      items: map.get(k)!,
    }));
  }, [products, query]);

  return (
    <div className="space-y-4">
      {/* KPIs */}
      <div className="grid grid-cols-3 gap-3">
        <Kpi label={t("mgr.stock_value")} value={`${currency} ${money(stats.value)}`} accent="neon" />
        <Kpi label={t("mgr.total_products")} value={String(stats.count)} accent="gold" />
        <Kpi label={t("mgr.total_units")} value={String(stats.units)} accent="cyan" />
      </div>

      <Card title={t("mgr.title")} badge={t("mgr.badge")} icon={<BoxIcon />}>
        {/* Busca */}
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("mgr.search")}
          className="mb-4 w-full rounded-md border border-line bg-panel-2 px-3 py-2.5 font-mono text-sm text-gray-100 outline-none transition-colors placeholder:text-muted-2 focus:border-neon/50 focus:ring-1 focus:ring-neon/30"
        />

        {loading ? (
          <p className="font-mono text-xs text-muted cursor-blink">{t("mgr.loading")}</p>
        ) : products.length === 0 ? (
          <p className="font-mono text-xs text-muted">{t("mgr.empty")}</p>
        ) : grouped.length === 0 ? (
          <p className="font-mono text-xs text-muted">{t("mgr.no_results")}</p>
        ) : (
          <div className="space-y-5">
            {grouped.map(({ key, items }) => (
              <section key={key}>
                {/* Cabecalho da categoria */}
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-sm">{CATEGORY_META[key].emoji}</span>
                  <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-gold">
                    {categoryLabel(key, lang)}
                  </h3>
                  <span className="font-mono text-[10px] text-muted-2">
                    {items.length} {t("mgr.items")}
                  </span>
                  <div className="ml-2 h-px flex-1 bg-line-soft" />
                </div>

                <ul className="space-y-2">
                  {items.map((p) =>
                    editing === p.id ? (
                      <EditRow
                        key={p.id}
                        product={p}
                        onCancel={() => setEditing(null)}
                        onSaved={() => {
                          setEditing(null);
                          load();
                        }}
                        onDeleted={() => {
                          setEditing(null);
                          load();
                        }}
                      />
                    ) : (
                      <li
                        key={p.id}
                        className="flex items-center gap-3 rounded-md border border-line bg-panel-2 px-3 py-2.5"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-baseline gap-2">
                            <span className="truncate font-mono text-sm text-gray-100">
                              {p.name}
                            </span>
                            <span className="shrink-0 font-mono text-[10px] text-cyan">
                              {p.barcode}
                            </span>
                          </div>
                          <div className="mt-0.5 font-mono text-[10px] text-muted">
                            <span className="text-neon">{currency} {money(p.sale_price)}</span>
                            {"  ·  "}
                            <span className="text-gold">{t("mgr.puxador")}: {currency} {money(p.price_puxador)}</span>
                            {"  ·  "}
                            <span>{t("mgr.stock")}: {p.stock}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => setEditing(p.id)}
                          className="shrink-0 rounded border border-line px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-muted transition-colors hover:border-neon/50 hover:text-neon"
                        >
                          {t("mgr.edit")}
                        </button>
                      </li>
                    )
                  )}
                </ul>
              </section>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

function Kpi({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: "neon" | "gold" | "cyan";
}) {
  const color = accent === "neon" ? "text-neon" : accent === "gold" ? "text-gold" : "text-cyan";
  return (
    <div className="rounded-lg border border-line bg-panel/80 px-3 py-3 text-center">
      <div className="mb-1 font-mono text-[9px] uppercase tracking-wider text-muted">{label}</div>
      <div className={`font-mono text-sm font-bold ${color}`}>{value}</div>
    </div>
  );
}

function EditRow({
  product,
  onCancel,
  onSaved,
  onDeleted,
}: {
  product: Product;
  onCancel: () => void;
  onSaved: () => void;
  onDeleted: () => void;
}) {
  const { t } = useI18n();
  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description ?? "");
  const [salePrice, setSalePrice] = useState(String(product.sale_price));
  const [pricePuxador, setPricePuxador] = useState(String(product.price_puxador));
  const [stock, setStock] = useState(String(product.stock));
  const [busy, setBusy] = useState(false);

  const input =
    "w-full rounded-md border border-line bg-base px-2.5 py-2 font-mono text-sm text-gray-100 outline-none focus:border-neon/50 focus:ring-1 focus:ring-neon/30";

  async function save() {
    setBusy(true);
    await supabase
      .from("products")
      .update({
        name: name.trim(),
        description: description.trim() || null,
        sale_price: Number(salePrice) || 0,
        price_puxador: Number(pricePuxador) || 0,
        stock: Number(stock) || 0,
      })
      .eq("id", product.id);
    setBusy(false);
    onSaved();
  }

  async function remove() {
    if (!window.confirm(t("mgr.confirm_delete"))) return;
    setBusy(true);
    await supabase.from("products").delete().eq("id", product.id);
    setBusy(false);
    onDeleted();
  }

  return (
    <li className="rounded-md border border-neon/30 bg-neon/5 p-3">
      <div className="space-y-2">
        <input value={name} onChange={(e) => setName(e.target.value)} className={input} placeholder={t("form.name")} />
        <input value={description} onChange={(e) => setDescription(e.target.value)} className={input} placeholder={t("form.description")} />
        <div className="grid grid-cols-3 gap-2">
          <LabeledNum label={t("mgr.sale")} value={salePrice} onChange={setSalePrice} />
          <LabeledNum label={t("mgr.puxador")} value={pricePuxador} onChange={setPricePuxador} />
          <LabeledNum label={t("mgr.stock")} value={stock} onChange={setStock} step="1" />
        </div>
      </div>

      <div className="mt-3 flex gap-2">
        <button
          onClick={save}
          disabled={busy}
          className="flex-1 rounded-md border border-neon/50 bg-neon/10 px-3 py-2 font-mono text-[11px] font-bold uppercase tracking-widest text-neon transition-all hover:bg-neon/20 disabled:opacity-50"
        >
          {t("mgr.save")}
        </button>
        <button
          onClick={onCancel}
          disabled={busy}
          className="rounded-md border border-line px-3 py-2 font-mono text-[11px] uppercase tracking-widest text-muted transition-colors hover:text-gray-200"
        >
          {t("mgr.cancel")}
        </button>
        <button
          onClick={remove}
          disabled={busy}
          className="rounded-md border border-danger/40 px-3 py-2 font-mono text-[11px] uppercase tracking-widest text-danger transition-colors hover:bg-danger/10 disabled:opacity-50"
        >
          {t("mgr.delete")}
        </button>
      </div>
    </li>
  );
}

function LabeledNum({
  label,
  value,
  onChange,
  step = "0.01",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  step?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block font-mono text-[9px] uppercase tracking-wider text-muted">{label}</span>
      <input
        type="number"
        min={0}
        step={step}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-line bg-base px-2 py-1.5 font-mono text-sm text-gray-100 outline-none focus:border-neon/50"
      />
    </label>
  );
}

function BoxIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5v-9Z" />
      <path d="m3 7.5 9 4.5 9-4.5M12 12v9" />
    </svg>
  );
}
