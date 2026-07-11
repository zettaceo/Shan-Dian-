"use client";

import { useState, type FormEvent } from "react";
import { Card } from "./Card";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabaseClient";

export function LoginScreen() {
  const { t } = useI18n();
  const { signIn, signUp } = useAuth();

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setBusy(true);

    const fn = mode === "signin" ? signIn : signUp;
    const { error } = await fn(username.trim(), password);

    setBusy(false);
    if (error) {
      setError(error);
      return;
    }
    if (mode === "signup") {
      setNotice(t("auth.signup_ok"));
      setMode("signin");
    }
  }

  const inputClass =
    "w-full rounded-md border border-line bg-panel-2 px-3 py-2.5 font-mono text-sm text-gray-100 outline-none transition-colors placeholder:text-muted-2 focus:border-neon/50 focus:ring-1 focus:ring-neon/30";

  return (
    <div className="mx-auto flex min-h-[70dvh] max-w-md flex-col justify-center px-4">
      {!isSupabaseConfigured ? (
        <div className="mb-4 rounded-md border border-gold/40 bg-gold/5 px-4 py-3 font-mono text-xs text-gold">
          <div className="mb-1 font-bold uppercase tracking-wider">
            ⚠ {t("config.missing_title")}
          </div>
          {t("config.missing")}
        </div>
      ) : null}

      <Card title={t("auth.title")} badge={t("auth.badge")} icon={<LockIcon />}>
        <p className="mb-4 font-mono text-xs leading-relaxed text-muted">
          {t("auth.subtitle")}
        </p>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <label className="block">
            <span className="mb-1.5 block font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
              {t("auth.email")}
            </span>
            <input
              type="text"
              required
              autoCapitalize="none"
              autoCorrect="off"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={t("auth.username_placeholder")}
              className={inputClass}
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
              {t("auth.password")}
            </span>
            <input
              type="password"
              required
              minLength={6}
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={inputClass}
            />
          </label>

          {error ? (
            <div className="rounded-md border border-danger/40 bg-danger/5 px-3 py-2 font-mono text-xs text-danger">
              ⚠ {error}
            </div>
          ) : null}
          {notice ? (
            <div className="rounded-md border border-neon/40 bg-neon/5 px-3 py-2 font-mono text-xs text-neon">
              ✓ {notice}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-md border border-neon/50 bg-neon/10 px-4 py-3 font-mono text-sm font-bold uppercase tracking-widest text-neon transition-all hover:bg-neon/20 hover:shadow-neon disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy
              ? t("auth.loading")
              : `▸ ${mode === "signin" ? t("auth.signin") : t("auth.signup")}`}
          </button>
        </form>

        <button
          onClick={() => {
            setMode((m) => (m === "signin" ? "signup" : "signin"));
            setError(null);
            setNotice(null);
          }}
          className="mt-4 w-full text-center font-mono text-xs text-muted transition-colors hover:text-gold"
        >
          {mode === "signin"
            ? t("auth.toggle_to_signup")
            : t("auth.toggle_to_signin")}
        </button>
      </Card>
    </div>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="4.5" y="10.5" width="15" height="10" rx="2" />
      <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
    </svg>
  );
}
