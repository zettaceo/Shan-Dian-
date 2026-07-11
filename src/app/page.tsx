"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { LoginScreen } from "@/components/LoginScreen";
import { BarcodeScanner } from "@/components/BarcodeScanner";
import { ProductForm } from "@/components/ProductForm";
import { Dashboard } from "@/components/Dashboard";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";

export default function Home() {
  const { user, loading } = useAuth();
  const { t } = useI18n();

  // Codigo de barras compartilhado entre o scanner e o formulario.
  const [barcode, setBarcode] = useState("");
  // Contador para forcar o recarregamento do dashboard apos salvar.
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="min-h-dvh">
      <Header />

      {loading ? (
        <div className="flex min-h-[70dvh] items-center justify-center">
          <span className="font-mono text-sm text-muted cursor-blink">
            {t("app.name")}
          </span>
        </div>
      ) : !user ? (
        <LoginScreen />
      ) : (
        <main className="mx-auto max-w-2xl space-y-4 px-4 py-5">
          <BarcodeScanner onDetected={(code) => setBarcode(code)} />
          <ProductForm
            barcode={barcode}
            onBarcodeChange={setBarcode}
            onSaved={() => setRefreshKey((k) => k + 1)}
          />
          <Dashboard refreshKey={refreshKey} />

          <footer className="pb-8 pt-2 text-center font-mono text-[10px] uppercase tracking-widest text-muted-2">
            {t("app.name")} · {t("header.online")} ● {user.email}
          </footer>
        </main>
      )}
    </div>
  );
}
