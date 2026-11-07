-- Run after 202611070001_initial_portfolio.sql.
-- Every public content record gets an optional URL editable in Supabase Table Editor.
begin;

alter table public.portfolio_profile
  add column if not exists linkedin_url text,
  add column if not exists github_url text,
  add column if not exists resume_url text;

alter table public.projects add column if not exists project_url text;

create table if not exists public.education (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9-]{3,100}$'),
  title text not null check (char_length(title) between 2 and 160),
  organization text not null check (char_length(organization) between 2 and 200),
  date_label text not null default '' check (char_length(date_label) <= 100),
  description text,
  link_url text,
  published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.experience (like public.education including all);
create table if not exists public.certificates (like public.education including all);
create table if not exists public.awards (like public.education including all);

drop trigger if exists education_set_updated_at on public.education;
create trigger education_set_updated_at before update on public.education for each row execute function public.set_updated_at();
drop trigger if exists experience_set_updated_at on public.experience;
create trigger experience_set_updated_at before update on public.experience for each row execute function public.set_updated_at();
drop trigger if exists certificates_set_updated_at on public.certificates;
create trigger certificates_set_updated_at before update on public.certificates for each row execute function public.set_updated_at();
drop trigger if exists awards_set_updated_at on public.awards;
create trigger awards_set_updated_at before update on public.awards for each row execute function public.set_updated_at();

alter table public.education enable row level security;
alter table public.experience enable row level security;
alter table public.certificates enable row level security;
alter table public.awards enable row level security;

drop policy if exists "Public education is readable" on public.education;
create policy "Public education is readable" on public.education for select to anon, authenticated using (published = true);
drop policy if exists "Public experience is readable" on public.experience;
create policy "Public experience is readable" on public.experience for select to anon, authenticated using (published = true);
drop policy if exists "Public certificates are readable" on public.certificates;
create policy "Public certificates are readable" on public.certificates for select to anon, authenticated using (published = true);
drop policy if exists "Public awards are readable" on public.awards;
create policy "Public awards are readable" on public.awards for select to anon, authenticated using (published = true);

grant select on public.education, public.experience, public.certificates, public.awards to anon, authenticated;

insert into public.education (slug, title, organization, date_label, sort_order) values
  ('bsc-cse', 'BSc in Computer Science', 'Notre Dame University Bangladesh', '2021 — Ongoing', 1),
  ('hsc-science', 'HSC (Science), GPA 5.00', 'Notre Dame College', '2018 — 2020', 2),
  ('ssc-science', 'SSC (Science), GPA 5.00', 'St. Gregory’s High School & College', '2018', 3)
on conflict (slug) do update set title = excluded.title, organization = excluded.organization, date_label = excluded.date_label, sort_order = excluded.sort_order;

insert into public.experience (slug, title, organization, date_label, description, sort_order) values
  ('aurelius-ceo', 'Chief Executive Officer', 'Aurelius E-sports, Dhaka', '2019 — 2021', 'Led operations, coordination, and team activities in an esports organization.', 1),
  ('nducc-assistant-secretary', 'Assistant Secretary in Technology', 'Notre Dame University Computer Club', '2023 — 2024', 'Supported technology initiatives, student collaboration, and club activities.', 2)
on conflict (slug) do update set title = excluded.title, organization = excluded.organization, date_label = excluded.date_label, description = excluded.description, sort_order = excluded.sort_order;

insert into public.certificates (slug, title, organization, date_label, sort_order) values
  ('nasa-space-apps', 'NASA Space Apps Challenge', 'ExoSky project showcase', '', 1),
  ('blockchain-theory', 'Blockchain Theory and Applications II', 'POSTECH / Coursera', '', 2)
on conflict (slug) do update set title = excluded.title, organization = excluded.organization, sort_order = excluded.sort_order;

insert into public.awards (slug, title, organization, date_label, sort_order) values
  ('aurelius-ceo-award', 'Former CEO of Aurelius E-sports', 'Leadership', '', 1),
  ('nducc-leadership', 'Assistant Secretary in Technology, Notre Dame University Computer Club', 'Leadership', '', 2),
  ('nasa-participant', 'NASA Space Apps Challenge participant with ExoSky', 'Competition', '', 3),
  ('academic-award', 'Strong academic performance with GPA 5.00 in SSC and HSC', 'Academic', '', 4)
on conflict (slug) do update set title = excluded.title, organization = excluded.organization, sort_order = excluded.sort_order;

-- Add each real URL in the Table Editor, or use updates like these:
-- update public.education set link_url = 'https://university.example/...' where slug = 'bsc-cse';
-- update public.projects set project_url = 'https://github.com/...' where slug = 'exosky';
-- update public.portfolio_profile set linkedin_url = 'https://linkedin.com/in/...', github_url = 'https://github.com/...' where handle = 'jehan-sadik';

commit;
