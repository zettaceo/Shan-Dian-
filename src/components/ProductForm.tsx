"use client";

import { useState, type FormEvent } from "react";
import { Card } from "./Card";
import { useI18n, type TranslationKey } from "@/lib/i18n";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/lib/auth";

type Props = {
  /** Codigo vindo do scanner (controla o campo "barcode"). */
  barcode: string;
  onBarcodeChange: (value: string) => void;
  /** Disparado apos salvar com sucesso (recarrega o dashboard). */
  onSaved: () => void;
};

type FieldProps = {
  label: string;
  children: React.ReactNode;
};

function Field({ label, children }: FieldProps) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-md border border-line bg-panel-2 px-3 py-2.5 font-mono text-sm text-gray-100 outline-none transition-colors placeholder:text-muted-2 focus:border-neon/50 focus:ring-1 focus:ring-neon/30";

export function ProductForm({ barcode, onBarcodeChange, onSaved }: Props) {
  const { t } = useI18n();
  const { user } = useAuth();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [pricePuxador, setPricePuxador] = useState("");
  const [stock, setStock] = useState("");

  const [status, setStatus] = useState<"idle" | "saving" | "ok" | "error">(
    "idle"
  );
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!barcode.trim() || !name.trim()) {
      setStatus("error");
      setMessage(t("form.required"));
      return;
    }

    setStatus("saving");
    setMessage(null);

    const { error } = await supabase.from("products").insert({
      barcode: barcode.trim(),
      name: name.trim(),
      description: description.trim() || null,
      sale_price: Number(salePrice) || 0,
      price_puxador: Number(pricePuxador) || 0,
      stock: Number(stock) || 0,
      owner_id: user?.id,
    });

    if (error) {
      setStatus("error");
      setMessage(error.message);
      return;
    }

    // Limpa o formulario para o proximo cadastro.
    setStatus("ok");
    setMessage(t("form.saved"));
    onBarcodeChange("");
    setName("");
    setDescription("");
    setSalePrice("");
    setPricePuxador("");
    setStock("");
    onSaved();

    window.setTimeout(() => setStatus("idle"), 2500);
  }

  return (
    <Card title={t("form.title")} badge={t("form.badge")} icon={<BoxIcon />}>
      <form onSubmit={handleSubmit} className="space-y-3.5">
        <Field label={t("form.barcode")}>
          <input
            value={barcode}
            onChange={(e) => onBarcodeChange(e.target.value)}
            placeholder={t("form.placeholder.barcode")}
            className={`${inputClass} text-cyan`}
            inputMode="numeric"
          />
        </Field>

        <Field label={t("form.name")}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("form.placeholder.name")}
            className={inputClass}
          />
        </Field>

        <Field label={t("form.description")}>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t("form.placeholder.description")}
            rows={2}
            className={`${inputClass} resize-none`}
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label={t("form.sale_price")}>
            <PriceInput value={salePrice} onChange={setSalePrice} tKey="misc.currency" tFn={t} />
          </Field>
          <Field label={t("form.cost_price")}>
            <PriceInput value={pricePuxador} onChange={setPricePuxador} tKey="misc.currency" tFn={t} />
          </Field>
        </div>

        <Field label={t("form.stock")}>
          <input
            type="number"
            min={0}
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            placeholder="0"
            className={inputClass}
          />
        </Field>

        {message ? (
          <div
            className={`rounded-md border px-3 py-2 font-mono text-xs ${
              status === "ok"
                ? "border-neon/40 bg-neon/5 text-neon"
                : "border-danger/40 bg-danger/5 text-danger"
            }`}
          >
            {status === "ok" ? "✓ " : "⚠ "}
            {message}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={status === "saving"}
          className="w-full rounded-md border border-neon/50 bg-neon/10 px-4 py-3 font-mono text-sm font-bold uppercase tracking-widest text-neon transition-all hover:bg-neon/20 hover:shadow-neon disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status === "saving" ? t("form.saving") : `▸ ${t("form.save")}`}
        </button>
      </form>
    </Card>
  );
}

function PriceInput({
  value,
  onChange,
  tKey,
  tFn,
}: {
  value: string;
  onChange: (v: string) => void;
  tKey: TranslationKey;
  tFn: (k: TranslationKey) => string;
}) {
  return (
    <div className="flex items-center rounded-md border border-line bg-panel-2 focus-within:border-neon/50 focus-within:ring-1 focus-within:ring-neon/30">
      <span className="pl-3 pr-1 font-mono text-xs text-gold">{tFn(tKey)}</span>
      <input
        type="number"
        min={0}
        step="0.01"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="0.00"
        className="w-full bg-transparent px-1 py-2.5 font-mono text-sm text-gray-100 outline-none placeholder:text-muted-2"
      />
    </div>
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
