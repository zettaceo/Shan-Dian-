-- ============================================================================
--  SHAN DIAN (闪电) — Esquema do banco de dados / 数据库架构
--  Execute este script no Supabase: Dashboard > SQL Editor > New query
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Tabela de produtos
-- ----------------------------------------------------------------------------
create table if not exists public.products (
  id            uuid primary key default gen_random_uuid(),
  barcode       text not null,
  name          text not null,
  description   text,
  sale_price    numeric(12, 2) not null default 0,
  cost_price    numeric(12, 2) not null default 0,
  stock         integer not null default 0,
  owner_id      uuid not null default auth.uid() references auth.users (id) on delete cascade,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Cada dono (loja) so pode ter um codigo de barras cadastrado uma vez.
create unique index if not exists products_owner_barcode_key
  on public.products (owner_id, barcode);

-- Consulta rapida dos ultimos cadastros por dono.
create index if not exists products_owner_created_idx
  on public.products (owner_id, created_at desc);

-- ----------------------------------------------------------------------------
-- 2. Gatilho para manter "updated_at" sempre atualizado
-- ----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_products_updated_at on public.products;
create trigger trg_products_updated_at
  before update on public.products
  for each row
  execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- 3. Row Level Security (RLS)
--    Cada usuario autenticado enxerga e altera apenas os seus proprios produtos.
-- ----------------------------------------------------------------------------
alter table public.products enable row level security;

drop policy if exists "products_select_own" on public.products;
create policy "products_select_own"
  on public.products
  for select
  to authenticated
  using (owner_id = auth.uid());

drop policy if exists "products_insert_own" on public.products;
create policy "products_insert_own"
  on public.products
  for insert
  to authenticated
  with check (owner_id = auth.uid());

drop policy if exists "products_update_own" on public.products;
create policy "products_update_own"
  on public.products
  for update
  to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

drop policy if exists "products_delete_own" on public.products;
create policy "products_delete_own"
  on public.products
  for delete
  to authenticated
  using (owner_id = auth.uid());

-- ============================================================================
--  Fim do script. Cadastre a dona da loja em Authentication > Users
--  (ou deixe-a se registrar pela tela de login do proprio app).
-- ============================================================================
