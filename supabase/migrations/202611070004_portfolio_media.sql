-- Run after migration 003. Enables no-code image uploads in /admin.
begin;

alter table public.education add column if not exists image_url text;
alter table public.experience add column if not exists image_url text;
alter table public.certificates add column if not exists image_url text;
alter table public.awards add column if not exists image_url text;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('portfolio-media', 'portfolio-media', true, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
on conflict (id) do update set public = true, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Portfolio media public read" on storage.objects;
create policy "Portfolio media public read" on storage.objects for select to public using (bucket_id = 'portfolio-media');
drop policy if exists "Portfolio admins upload media" on storage.objects;
create policy "Portfolio admins upload media" on storage.objects for insert to authenticated with check (bucket_id = 'portfolio-media' and public.is_portfolio_admin());
drop policy if exists "Portfolio admins update media" on storage.objects;
create policy "Portfolio admins update media" on storage.objects for update to authenticated using (bucket_id = 'portfolio-media' and public.is_portfolio_admin()) with check (bucket_id = 'portfolio-media' and public.is_portfolio_admin());
drop policy if exists "Portfolio admins delete media" on storage.objects;
create policy "Portfolio admins delete media" on storage.objects for delete to authenticated using (bucket_id = 'portfolio-media' and public.is_portfolio_admin());

commit;
