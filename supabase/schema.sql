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
  price_puxador numeric(12, 2) not null default 0,
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

-- ----------------------------------------------------------------------------
-- 4. Registro de consultas (scan_events) para o ranking de mais escaneados
-- ----------------------------------------------------------------------------
create table if not exists public.scan_events (
  id          uuid primary key default gen_random_uuid(),
  product_id  uuid references public.products (id) on delete set null,
  barcode     text not null,
  scanned_by  uuid default auth.uid() references auth.users (id) on delete set null,
  scanned_at  timestamptz not null default now()
);

create index if not exists scan_events_scanned_at_idx on public.scan_events (scanned_at desc);
create index if not exists scan_events_product_idx on public.scan_events (product_id);

alter table public.scan_events enable row level security;

drop policy if exists "scan_events_select_all" on public.scan_events;
create policy "scan_events_select_all" on public.scan_events
  for select to authenticated using (true);

drop policy if exists "scan_events_insert_all" on public.scan_events;
create policy "scan_events_insert_all" on public.scan_events
  for insert to authenticated with check (true);

-- ----------------------------------------------------------------------------
-- 5. Ranking dos produtos mais escaneados a partir de uma data (dia/semana/mes)
--    Uso no app: supabase.rpc('top_scanned', { since: <ISO date> })
-- ----------------------------------------------------------------------------
create or replace function public.top_scanned(since timestamptz)
returns table (product_id uuid, barcode text, name text, scans bigint)
language sql
stable
security invoker
set search_path = public
as $$
  select
    se.product_id,
    se.barcode,
    coalesce(p.name, se.barcode) as name,
    count(*) as scans
  from public.scan_events se
  left join public.products p on p.id = se.product_id
  where se.scanned_at >= since
  group by se.product_id, se.barcode, p.name
  order by count(*) desc
  limit 10;
$$;

-- ============================================================================
--  Fim do script. Os funcionarios sao criados pela tela de login do app
--  (login por USUARIO + senha; o app converte o usuario em um e-mail interno).
--  IMPORTANTE: em Authentication > Providers > Email, desative "Confirm email".
-- ============================================================================
