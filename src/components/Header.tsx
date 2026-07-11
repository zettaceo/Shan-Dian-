"use client";

import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";

export function Header() {
  const { lang, setLang, t } = useI18n();
  const { user, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-base/85 backdrop-blur">
      <div className="mx-auto flex max-w-2xl items-center justify-between gap-3 px-4 py-3">
        {/* Marca — logo completo (bode neon + SHAN DIAN 闪店) */}
        <div className="flex min-w-0 items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="Shan Dian 闪店"
            className="h-11 w-auto object-contain drop-shadow-[0_0_12px_rgba(34,197,94,0.2)]"
          />
        </div>

        {/* Controles */}
        <div className="flex items-center gap-2">
          {/* Toggle de idioma PT / 中文 */}
          <div className="flex overflow-hidden rounded-md border border-line font-mono text-xs">
            <button
              onClick={() => setLang("pt")}
              className={`px-2.5 py-1.5 transition-colors ${
                lang === "pt"
                  ? "bg-neon text-black font-bold"
                  : "bg-panel-2 text-muted hover:text-gray-200"
              }`}
              aria-pressed={lang === "pt"}
            >
              PT
            </button>
            <button
              onClick={() => setLang("zh")}
              className={`px-2.5 py-1.5 transition-colors ${
                lang === "zh"
                  ? "bg-neon text-black font-bold"
                  : "bg-panel-2 text-muted hover:text-gray-200"
              }`}
              aria-pressed={lang === "zh"}
            >
              中文
            </button>
          </div>

          {user ? (
            <button
              onClick={() => signOut()}
              className="rounded-md border border-line bg-panel-2 px-2.5 py-1.5 font-mono text-xs uppercase tracking-wider text-muted transition-colors hover:border-danger/50 hover:text-danger"
            >
              {t("header.logout")}
            </button>
          ) : null}
        </div>
      </div>
    </header>
  );
}
