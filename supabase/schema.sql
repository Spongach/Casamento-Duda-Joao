-- Rode no Supabase: SQL Editor > New query > Run
-- Antes: troque os dois e-mails abaixo pelos de vocês (os mesmos usados no login).

-- ============ ADMINS ============
create table if not exists admins (email text primary key);
insert into admins (email) values
  ('EMAIL_DO_JOAO'),
  ('EMAIL_DA_NOIVA')
on conflict do nothing;

alter table admins enable row level security; -- sem policies: ninguém lê direto

create or replace function is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from admins where lower(email) = lower(auth.jwt() ->> 'email'));
$$;

-- ============ IDEIAS (privado) ============
create table if not exists ideias (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  descricao text,
  autor text,
  created_at timestamptz not null default now()
);
alter table ideias enable row level security;
create policy "admins gerenciam ideias" on ideias
  for all using (is_admin()) with check (is_admin());

-- ============ PRESENTES (rascunho até publicado = true) ============
create table if not exists presentes (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  descricao text,
  motivo text,
  imagem_url text,
  link_url text,
  publicado boolean not null default false,
  ordem int not null default 0,
  created_at timestamptz not null default now()
);
alter table presentes enable row level security;
create policy "ver presentes publicados" on presentes
  for select using (publicado = true or is_admin());
create policy "admins inserem presentes" on presentes
  for insert with check (is_admin());
create policy "admins editam presentes" on presentes
  for update using (is_admin()) with check (is_admin());
create policy "admins excluem presentes" on presentes
  for delete using (is_admin());

-- ============ RSVP (qualquer um envia, só admins leem) ============
create table if not exists rsvps (
  id uuid primary key default gen_random_uuid(),
  nome text not null check (char_length(nome) between 1 and 100),
  vai boolean not null,
  acompanhantes jsonb not null default '[]'::jsonb check (jsonb_typeof(acompanhantes) = 'array' and jsonb_array_length(acompanhantes) <= 10),
  restricao text check (char_length(restricao) <= 200),
  recado text check (char_length(recado) <= 500),
  created_at timestamptz not null default now()
);
alter table rsvps enable row level security;
create policy "qualquer um envia rsvp" on rsvps
  for insert with check (true);
create policy "admins leem rsvp" on rsvps
  for select using (is_admin());
create policy "admins excluem rsvp" on rsvps
  for delete using (is_admin());

-- ============ RECADOS (entram pendentes; só aprovados aparecem) ============
create table if not exists recados (
  id uuid primary key default gen_random_uuid(),
  nome text not null check (char_length(nome) between 1 and 80),
  mensagem text not null check (char_length(mensagem) between 1 and 500),
  aprovado boolean not null default false,
  created_at timestamptz not null default now()
);
alter table recados enable row level security;
create policy "ver recados aprovados" on recados
  for select using (aprovado = true or is_admin());
create policy "qualquer um envia recado pendente" on recados
  for insert with check (aprovado = false);
create policy "admins aprovam recados" on recados
  for update using (is_admin()) with check (is_admin());
create policy "admins excluem recados" on recados
  for delete using (is_admin());

-- ============ ACHADOS E PERDIDOS ============
create table if not exists achados (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  descricao text,
  imagem_url text,
  entregue boolean not null default false,
  created_at timestamptz not null default now()
);
alter table achados enable row level security;
create policy "ver achados nao entregues" on achados
  for select using (entregue = false or is_admin());
create policy "admins inserem achados" on achados
  for insert with check (is_admin());
create policy "admins editam achados" on achados
  for update using (is_admin()) with check (is_admin());
create policy "admins excluem achados" on achados
  for delete using (is_admin());
