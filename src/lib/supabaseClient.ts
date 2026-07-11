import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Indica se as credenciais do Supabase foram configuradas.
 * Usado para exibir um aviso amigavel caso o .env.local esteja vazio.
 */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

/**
 * Cliente unico do Supabase para o navegador.
 * A sessao (login) e persistida automaticamente no localStorage.
 */
export const supabase = createClient(
  supabaseUrl ?? "https://placeholder.supabase.co",
  supabaseAnonKey ?? "public-anon-key-placeholder",
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);

export type Product = {
  id: string;
  barcode: string;
  name: string;
  description: string | null;
  sale_price: number;
  price_puxador: number;
  stock: number;
  owner_id: string;
  created_at: string;
  updated_at: string;
};

/** Linha do ranking de produtos mais escaneados (RPC public.top_scanned). */
export type TopScanned = {
  product_id: string | null;
  barcode: string;
  name: string;
  scans: number;
};
