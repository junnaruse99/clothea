-- Esquema de Clothea para Supabase (SQL Editor → New query → pegar y ejecutar)

create table if not exists categories (
  id text primary key,
  name text not null,
  slug text not null unique
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  description text not null default '',
  category_id text not null references categories (id),
  color text not null default '',
  price numeric(10, 2) not null check (price > 0),
  sale_price numeric(10, 2) check (sale_price is null or sale_price > 0),
  photos jsonb not null default '[]'::jsonb,
  -- [{ "size": "M", "quantity": 10 }] — mover a tabla propia al crecer
  variants jsonb not null default '[]'::jsonb,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists products_category_idx on products (category_id);
create index if not exists products_active_idx on products (active);

create table if not exists districts (
  id text primary key,
  name text not null,
  lat double precision not null,
  lng double precision not null,
  surcharge numeric(10, 2) not null default 0
);

-- Configuración clave/valor (delivery_config guarda el algoritmo de envío)
create table if not exists settings (
  key text primary key,
  value jsonb not null
);

create table if not exists orders (
  id uuid primary key,
  items jsonb not null,
  subtotal numeric(10, 2) not null,
  delivery_fee numeric(10, 2) not null,
  total numeric(10, 2) not null,
  status text not null default 'pending_payment'
    check (status in ('pending_payment', 'paid', 'cancelled')),
  customer jsonb not null,
  created_at timestamptz not null default now()
);

-- El API usa la service role key (bypassa RLS). Se activa RLS para que la
-- anon key no exponga nada si alguien la usa directo contra la base.
alter table categories enable row level security;
alter table products enable row level security;
alter table districts enable row level security;
alter table settings enable row level security;
alter table orders enable row level security;

-- Lectura pública del catálogo (opcional, útil si el front consulta directo)
create policy "categorias publicas" on categories for select using (true);
create policy "productos activos publicos" on products for select using (active);
create policy "distritos publicos" on districts for select using (true);
