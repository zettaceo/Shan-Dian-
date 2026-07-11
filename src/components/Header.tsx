"use client";

import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";

/** Marca do Shan Dian (闪店) — bode neon com circuitos. */
function BoltLogo() {
  return (
    <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-md border border-line bg-black shadow-neon">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/mark.png" alt="Shan Dian" className="h-full w-full object-cover" />
    </div>
  );
}

export function Header() {
  const { lang, setLang, t } = useI18n();
  const { user, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-base/85 backdrop-blur">
      <div className="mx-auto flex max-w-2xl items-center justify-between gap-3 px-4 py-3">
        {/* Marca */}
        <div className="flex items-center gap-2.5 min-w-0">
          <BoltLogo />
          <div className="min-w-0">
            <div className="truncate font-mono text-base font-bold tracking-[0.25em] text-gray-100">
              {t("app.name")}
            </div>
            <div className="truncate font-mono text-[10px] uppercase tracking-widest text-muted">
              {t("app.tagline")}
            </div>
          </div>
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
