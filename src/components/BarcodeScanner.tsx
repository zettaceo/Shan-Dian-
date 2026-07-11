"use client";

import { useEffect, useRef, useState } from "react";
import { Card } from "./Card";
import { useI18n } from "@/lib/i18n";

type Props = {
  /** Chamado quando um codigo de barras e lido com sucesso. */
  onDetected: (code: string) => void;
};

const REGION_ID = "reader";

export function BarcodeScanner({ onDetected }: Props) {
  const { t } = useI18n();
  const [active, setActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastCode, setLastCode] = useState<string | null>(null);
  const scannerRef = useRef<import("html5-qrcode").Html5Qrcode | null>(null);

  // Inicia / encerra o scanner de acordo com o estado "active".
  useEffect(() => {
    let cancelled = false;

    async function start() {
      setError(null);
      try {
        const { Html5Qrcode, Html5QrcodeSupportedFormats } = await import(
          "html5-qrcode"
        );
        if (cancelled) return;

        const scanner = new Html5Qrcode(REGION_ID, {
          verbose: false,
          // Formatos comuns de codigo de barras de produtos + QR.
          formatsToSupport: [
            Html5QrcodeSupportedFormats.EAN_13,
            Html5QrcodeSupportedFormats.EAN_8,
            Html5QrcodeSupportedFormats.UPC_A,
            Html5QrcodeSupportedFormats.UPC_E,
            Html5QrcodeSupportedFormats.CODE_128,
            Html5QrcodeSupportedFormats.CODE_39,
            Html5QrcodeSupportedFormats.ITF,
            Html5QrcodeSupportedFormats.QR_CODE,
          ],
        });
        scannerRef.current = scanner;

        await scanner.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 260, height: 150 },
            aspectRatio: 1.6,
          },
          (decodedText) => {
            setLastCode(decodedText);
            onDetected(decodedText);
            // Fecha a camera automaticamente ao ler.
            setActive(false);
            if (navigator.vibrate) navigator.vibrate(60);
          },
          () => {
            /* leitura em andamento — ignoramos falhas por frame */
          }
        );
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          setError(t("scanner.error"));
          setActive(false);
        }
      }
    }

    async function stop() {
      const scanner = scannerRef.current;
      if (!scanner) return;
      try {
        if (scanner.isScanning) await scanner.stop();
        await scanner.clear();
      } catch {
        /* ignora erros de encerramento */
      }
      scannerRef.current = null;
    }

    if (active) start();
    else stop();

    return () => {
      cancelled = true;
      stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  return (
    <Card
      title={t("scanner.title")}
      badge={t("scanner.badge")}
      icon={<CameraIcon />}
    >
      <p className="mb-3 font-mono text-xs leading-relaxed text-muted">
        {t("scanner.hint")}
      </p>

      {/* Area de video (so ocupa espaco quando ativo) */}
      <div
        className={`overflow-hidden rounded-md border border-line bg-black transition-all ${
          active ? "mb-3 max-h-[320px]" : "max-h-0 border-transparent"
        }`}
      >
        <div id={REGION_ID} className="w-full" />
      </div>

      {lastCode && !active ? (
        <div className="mb-3 flex items-center gap-2 rounded-md border border-neon/30 bg-neon/5 px-3 py-2">
          <span className="h-2 w-2 rounded-full bg-neon" />
          <span className="font-mono text-[10px] uppercase tracking-wider text-neon">
            {t("scanner.detected")}
          </span>
          <span className="ml-auto font-mono text-sm text-cyan">{lastCode}</span>
        </div>
      ) : null}

      {error ? (
        <div className="mb-3 rounded-md border border-danger/40 bg-danger/5 px-3 py-2 font-mono text-xs text-danger">
          ⚠ {error}
        </div>
      ) : null}

      <button
        onClick={() => setActive((v) => !v)}
        className={`w-full rounded-md border px-4 py-3 font-mono text-sm font-bold uppercase tracking-widest transition-all ${
          active
            ? "border-danger/50 bg-danger/10 text-danger hover:bg-danger/20"
            : "border-neon/50 bg-neon/10 text-neon hover:bg-neon/20 hover:shadow-neon"
        }`}
      >
        {active ? (
          <span className="inline-flex items-center gap-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-danger" />
            {t("scanner.close")}
          </span>
        ) : (
          `▸ ${t("scanner.open")}`
        )}
      </button>
    </Card>
  );
}

function CameraIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M3 8.5A2.5 2.5 0 0 1 5.5 6h1l1-1.5h9L17.5 6h1A2.5 2.5 0 0 1 21 8.5v8A2.5 2.5 0 0 1 18.5 19h-13A2.5 2.5 0 0 1 3 16.5v-8Z" />
      <circle cx="12" cy="12.5" r="3.2" />
    </svg>
  );
}
