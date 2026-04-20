-- =====================================================================
-- GlobeNest — Supabase schema. Paste into Supabase SQL Editor and run.
-- Project: https://afmtnuhhwgnqnoytqetv.supabase.co
-- Idempotent: safe to re-run.
-- =====================================================================

-- ----- Enums -----
do $$ begin
  create type public.app_role as enum ('admin', 'user');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.checklist_category as enum ('tax', 'payments', 'shipping', 'legal');
exception when duplicate_object then null; end $$;

-- ----- Profiles -----
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ----- Businesses -----
create table if not exists public.businesses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  country text not null,
  industry text,
  website text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_businesses_user on public.businesses(user_id);

-- ----- Expansion Plans -----
create table if not exists public.expansion_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  country text not null,
  created_at timestamptz not null default now()
);
create index if not exists idx_plans_user on public.expansion_plans(user_id);

-- ----- Checklist items -----
create table if not exists public.checklist_items (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references public.expansion_plans(id) on delete cascade,
  label text not null,
  category public.checklist_category not null,
  done boolean not null default false,
  position int not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists idx_items_plan on public.checklist_items(plan_id);

-- ----- Payment providers -----
create table if not exists public.payment_providers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  provider text not null,
  display_name text not null,
  description text,
  connected boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists idx_providers_user on public.payment_providers(user_id);

-- ----- Fulfillment carriers -----
create table if not exists public.fulfillment_carriers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  country text not null,
  name text not null,
  cost numeric(10,2) not null default 0,
  delivery_days int not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists idx_carriers_user on public.fulfillment_carriers(user_id);

-- ----- User roles (separate table — never store on profiles) -----
create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  unique (user_id, role)
);

-- Security definer fn — avoids RLS recursion when checking roles
create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;

-- ----- Trigger: auto-create profile + default role on signup -----
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    new.email
  )
  on conflict (id) do nothing;

  insert into public.user_roles (user_id, role)
  values (new.id, 'user')
  on conflict do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ----- updated_at helper -----
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

drop trigger if exists trg_profiles_touch on public.profiles;
create trigger trg_profiles_touch before update on public.profiles
  for each row execute function public.touch_updated_at();

drop trigger if exists trg_businesses_touch on public.businesses;
create trigger trg_businesses_touch before update on public.businesses
  for each row execute function public.touch_updated_at();

-- =====================================================================
-- Row-Level Security
-- =====================================================================
alter table public.profiles enable row level security;
alter table public.businesses enable row level security;
alter table public.expansion_plans enable row level security;
alter table public.checklist_items enable row level security;
alter table public.payment_providers enable row level security;
alter table public.fulfillment_carriers enable row level security;
alter table public.user_roles enable row level security;

-- profiles
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);
drop policy if exists "profiles_insert_self" on public.profiles;
create policy "profiles_insert_self" on public.profiles
  for insert with check (auth.uid() = id);

-- businesses
drop policy if exists "businesses_owner_all" on public.businesses;
create policy "businesses_owner_all" on public.businesses
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- expansion_plans
drop policy if exists "plans_owner_all" on public.expansion_plans;
create policy "plans_owner_all" on public.expansion_plans
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- checklist_items — ownership via parent plan
drop policy if exists "items_owner_select" on public.checklist_items;
create policy "items_owner_select" on public.checklist_items
  for select using (
    exists (select 1 from public.expansion_plans p
            where p.id = plan_id and p.user_id = auth.uid())
  );
drop policy if exists "items_owner_modify" on public.checklist_items;
create policy "items_owner_modify" on public.checklist_items
  for all using (
    exists (select 1 from public.expansion_plans p
            where p.id = plan_id and p.user_id = auth.uid())
  ) with check (
    exists (select 1 from public.expansion_plans p
            where p.id = plan_id and p.user_id = auth.uid())
  );

-- payment_providers
drop policy if exists "providers_owner_all" on public.payment_providers;
create policy "providers_owner_all" on public.payment_providers
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- fulfillment_carriers
drop policy if exists "carriers_owner_all" on public.fulfillment_carriers;
create policy "carriers_owner_all" on public.fulfillment_carriers
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- user_roles — read own; only admins may write
drop policy if exists "roles_select_own" on public.user_roles;
create policy "roles_select_own" on public.user_roles
  for select using (auth.uid() = user_id or public.has_role(auth.uid(), 'admin'));
drop policy if exists "roles_admin_write" on public.user_roles;
create policy "roles_admin_write" on public.user_roles
  for all using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));
