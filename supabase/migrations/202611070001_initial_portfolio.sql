-- Run once in Supabase SQL Editor. This file is safe to re-run for the seeded profile/projects.
begin;

create extension if not exists pgcrypto;

create table if not exists public.portfolio_profile (
  id uuid primary key default gen_random_uuid(),
  handle text not null unique check (handle ~ '^[a-z0-9-]{3,48}$'),
  full_name text not null check (char_length(full_name) between 2 and 120),
  role text not null check (char_length(role) between 2 and 160),
  bio text not null check (char_length(bio) between 10 and 1500),
  location text not null check (char_length(location) between 2 and 160),
  email text not null check (email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'),
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9-]{3,100}$'),
  title text not null check (char_length(title) between 2 and 120),
  subtitle text not null default '' check (char_length(subtitle) <= 160),
  description text not null check (char_length(description) between 10 and 2000),
  tags text[] not null default '{}' check (cardinality(tags) <= 8),
  visual_type text not null default 'home' check (visual_type in ('home', 'space')),
  image_url text,
  featured boolean not null default false,
  published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 100),
  email text not null check (email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'),
  message text not null check (char_length(message) between 10 and 4000),
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$ begin new.updated_at = now(); return new; end; $$;

drop trigger if exists portfolio_profile_set_updated_at on public.portfolio_profile;
create trigger portfolio_profile_set_updated_at before update on public.portfolio_profile for each row execute function public.set_updated_at();
drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at before update on public.projects for each row execute function public.set_updated_at();

alter table public.portfolio_profile enable row level security;
alter table public.projects enable row level security;
alter table public.contact_messages enable row level security;

drop policy if exists "Public portfolio profile is readable" on public.portfolio_profile;
create policy "Public portfolio profile is readable" on public.portfolio_profile for select to anon, authenticated using (true);
drop policy if exists "Public published projects are readable" on public.projects;
create policy "Public published projects are readable" on public.projects for select to anon, authenticated using (published = true);

-- Contact records are private: there is deliberately no client table policy for this table.
create or replace function public.submit_contact_message(p_name text, p_email text, p_message text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  new_id uuid;
  clean_name text := btrim(coalesce(p_name, ''));
  clean_email text := lower(btrim(coalesce(p_email, '')));
  clean_message text := btrim(coalesce(p_message, ''));
begin
  if auth.role() not in ('anon', 'authenticated') then
    raise exception 'Not allowed';
  end if;
  if char_length(clean_name) not between 2 and 100 then raise exception 'Name must be between 2 and 100 characters'; end if;
  if clean_email !~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' then raise exception 'Enter a valid email address'; end if;
  if char_length(clean_message) not between 10 and 4000 then raise exception 'Message must be between 10 and 4000 characters'; end if;
  insert into public.contact_messages (name, email, message) values (clean_name, clean_email, clean_message) returning id into new_id;
  return new_id;
end;
$$;

revoke all on function public.submit_contact_message(text, text, text) from public;
grant usage on schema public to anon, authenticated;
grant select on public.portfolio_profile, public.projects to anon, authenticated;
grant execute on function public.submit_contact_message(text, text, text) to anon, authenticated;

insert into public.portfolio_profile (handle, full_name, role, bio, location, email)
values ('jehan-sadik', 'Jehan Sadik', 'Computer Science Undergraduate', 'I build thoughtful digital products at the intersection of software, AI, and design.', 'Dhaka, Bangladesh', 'jehan.sadik@example.com')
on conflict (handle) do update set full_name = excluded.full_name, role = excluded.role, bio = excluded.bio, location = excluded.location, email = excluded.email;

insert into public.projects (slug, title, subtitle, description, tags, visual_type, featured, sort_order)
values
  ('gesture-controlled-home', 'Gesture-controlled Home', 'Automation System', 'Touchless home automation using Arduino, relay modules, OpenCV, and MediaPipe for real-time hand gesture recognition.', array['Arduino', 'OpenCV', 'MediaPipe'], 'home', true, 1),
  ('exosky', 'ExoSky', 'Explore the unknown', 'An app concept that lets users view the night sky from exoplanets and create custom constellations using NASA data.', array['Astronomy', 'Exoplanets', 'NASA API'], 'space', true, 2)
on conflict (slug) do update set title = excluded.title, subtitle = excluded.subtitle, description = excluded.description, tags = excluded.tags, visual_type = excluded.visual_type, featured = excluded.featured, sort_order = excluded.sort_order;

commit;
