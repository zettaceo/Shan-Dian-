"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "./supabaseClient";

// O Supabase Auth exige um e-mail. Como o login e por NOME DE USUARIO,
// convertemos o usuario em um e-mail sintetico interno (nunca exibido).
const USERNAME_DOMAIN = "shandian.local";

/** "João Silva" -> "joao_silva@shandian.local" (deterministico). */
export function usernameToEmail(username: string) {
  const clean = username
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // remove acentos
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9._-]/g, "");
  return `${clean}@${USERNAME_DOMAIN}`;
}

/** Extrai o usuario de volta a partir do e-mail sintetico, para exibicao. */
export function emailToUsername(email: string | null | undefined) {
  if (!email) return "";
  return email.replace(new RegExp(`@${USERNAME_DOMAIN}$`), "");
}

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (username: string, password: string) => Promise<{ error: string | null }>;
  signUp: (username: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Sessao existente (login persistido).
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    // Reage a login / logout / refresh de token.
    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      loading,
      signIn: async (username, password) => {
        const { error } = await supabase.auth.signInWithPassword({
          email: usernameToEmail(username),
          password,
        });
        return { error: error?.message ?? null };
      },
      signUp: async (username, password) => {
        const { error } = await supabase.auth.signUp({
          email: usernameToEmail(username),
          password,
        });
        return { error: error?.message ?? null };
      },
      signOut: async () => {
        await supabase.auth.signOut();
      },
    }),
    [session, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de <AuthProvider>");
  return ctx;
}
