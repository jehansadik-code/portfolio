-- Run after the first two portfolio migrations.
-- Creates a protected no-code content studio. Do not place a service-role key in Vercel.
begin;

alter table public.portfolio_profile
  add column if not exists headline text not null default 'Full-stack developer focused on delightful, real-world systems.',
  add column if not exists about_text text not null default 'I build thoughtful digital products at the intersection of software, AI, and design.',
  add column if not exists skills text[] not null default array['Software Development', 'AI & Computer Vision', 'Blockchain', 'IoT & Embedded', 'Research'],
  add column if not exists tools text[] not null default array['Power BI, SQL, DAX', 'OpenCV, Python, YOLO', 'React, Next.js, Express, REST API', 'Hyperledger Fabric, Docker, Node.js'];

create table if not exists public.portfolio_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.portfolio_admins enable row level security;

create or replace function public.is_portfolio_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$ select exists (select 1 from public.portfolio_admins where user_id = auth.uid()) $$;

revoke all on function public.is_portfolio_admin() from public;
grant execute on function public.is_portfolio_admin() to authenticated;

drop policy if exists "Admin can verify own access" on public.portfolio_admins;
create policy "Admin can verify own access" on public.portfolio_admins for select to authenticated using (user_id = auth.uid());

-- These write policies are in addition to existing public read policies.
drop policy if exists "Admins manage profile" on public.portfolio_profile;
create policy "Admins manage profile" on public.portfolio_profile for all to authenticated using (public.is_portfolio_admin()) with check (public.is_portfolio_admin());
drop policy if exists "Admins manage projects" on public.projects;
create policy "Admins manage projects" on public.projects for all to authenticated using (public.is_portfolio_admin()) with check (public.is_portfolio_admin());
drop policy if exists "Admins manage education" on public.education;
create policy "Admins manage education" on public.education for all to authenticated using (public.is_portfolio_admin()) with check (public.is_portfolio_admin());
drop policy if exists "Admins manage experience" on public.experience;
create policy "Admins manage experience" on public.experience for all to authenticated using (public.is_portfolio_admin()) with check (public.is_portfolio_admin());
drop policy if exists "Admins manage certificates" on public.certificates;
create policy "Admins manage certificates" on public.certificates for all to authenticated using (public.is_portfolio_admin()) with check (public.is_portfolio_admin());
drop policy if exists "Admins manage awards" on public.awards;
create policy "Admins manage awards" on public.awards for all to authenticated using (public.is_portfolio_admin()) with check (public.is_portfolio_admin());
drop policy if exists "Admins read and manage messages" on public.contact_messages;
create policy "Admins read and manage messages" on public.contact_messages for all to authenticated using (public.is_portfolio_admin()) with check (public.is_portfolio_admin());

-- Bootstrap exactly one owner after creating their Auth user in Supabase Dashboard > Authentication > Users:
-- insert into public.portfolio_admins (user_id)
-- select id from auth.users where email = 'YOUR_ADMIN_EMAIL@example.com';

commit;
