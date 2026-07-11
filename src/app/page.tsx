"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { LoginScreen } from "@/components/LoginScreen";
import { BarcodeScanner } from "@/components/BarcodeScanner";
import { ProductForm } from "@/components/ProductForm";
import { Dashboard } from "@/components/Dashboard";
import { ConsultaSection } from "@/components/ConsultaSection";
import { RankingSection } from "@/components/RankingSection";
import { useAuth, emailToUsername } from "@/lib/auth";
import { useI18n, type TranslationKey } from "@/lib/i18n";

type Tab = "register" | "lookup" | "ranking";

export default function Home() {
  const { user, loading } = useAuth();
  const { t } = useI18n();

  const [tab, setTab] = useState<Tab>("register");
  // Codigo de barras compartilhado entre o scanner e o formulario (cadastro).
  const [barcode, setBarcode] = useState("");
  // Contador para forcar o recarregamento do dashboard apos salvar.
  const [refreshKey, setRefreshKey] = useState(0);

  const tabs: { id: Tab; label: TranslationKey }[] = [
    { id: "register", label: "tab.register" },
    { id: "lookup", label: "tab.lookup" },
    { id: "ranking", label: "tab.ranking" },
  ];

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
        <main className="mx-auto max-w-2xl px-4 py-5">
          {/* Navegacao por abas */}
          <nav className="mb-4 flex overflow-hidden rounded-lg border border-line font-mono text-xs">
            {tabs.map((item) => (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className={`flex-1 px-3 py-2.5 uppercase tracking-widest transition-colors ${
                  tab === item.id
                    ? "bg-neon text-black font-bold"
                    : "bg-panel-2 text-muted hover:text-gray-200"
                }`}
              >
                {t(item.label)}
              </button>
            ))}
          </nav>

          {tab === "register" ? (
            <div className="space-y-4">
              <BarcodeScanner onDetected={(code) => setBarcode(code)} />
              <ProductForm
                barcode={barcode}
                onBarcodeChange={setBarcode}
                onSaved={() => setRefreshKey((k) => k + 1)}
              />
              <Dashboard refreshKey={refreshKey} />
            </div>
          ) : null}

          {tab === "lookup" ? <ConsultaSection /> : null}

          {tab === "ranking" ? <RankingSection /> : null}

          <footer className="pb-8 pt-6 text-center font-mono text-[10px] uppercase tracking-widest text-muted-2">
            {t("app.name")} · {t("header.online")} ● {emailToUsername(user.email)}
          </footer>
        </main>
      )}
    </div>
  );
}
