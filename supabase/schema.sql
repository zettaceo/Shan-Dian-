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

-- Estoque compartilhado: o codigo de barras e unico na LOJA inteira.
create unique index if not exists products_barcode_key
  on public.products (barcode);

-- Consulta rapida dos ultimos cadastros (dashboard).
create index if not exists products_created_idx
  on public.products (created_at desc);

-- ----------------------------------------------------------------------------
-- 2. Gatilho para manter "updated_at" sempre atualizado
-- ----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
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
--    ESTOQUE COMPARTILHADO: qualquer usuario autenticado (dona ou funcionario)
--    enxerga e altera TODOS os produtos. O owner_id fica apenas como registro
--    de quem cadastrou cada item (auditoria).
-- ----------------------------------------------------------------------------
alter table public.products enable row level security;

drop policy if exists "products_select_own" on public.products;
drop policy if exists "products_select_all" on public.products;
create policy "products_select_all"
  on public.products for select to authenticated
  using (true);

drop policy if exists "products_insert_own" on public.products;
drop policy if exists "products_insert_all" on public.products;
create policy "products_insert_all"
  on public.products for insert to authenticated
  with check (true);

drop policy if exists "products_update_own" on public.products;
drop policy if exists "products_update_all" on public.products;
create policy "products_update_all"
  on public.products for update to authenticated
  using (true) with check (true);

drop policy if exists "products_delete_own" on public.products;
drop policy if exists "products_delete_all" on public.products;
create policy "products_delete_all"
  on public.products for delete to authenticated
  using (true);

-- ============================================================================
--  Fim do script. Os funcionarios sao criados pela tela de login do app
--  (login por USUARIO + senha; o app converte o usuario em um e-mail interno).
--  IMPORTANTE: em Authentication > Providers > Email, desative "Confirm email".
-- ============================================================================
