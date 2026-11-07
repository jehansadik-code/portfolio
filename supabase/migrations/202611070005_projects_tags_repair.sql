-- Run after migration 004. Repairs the project tag contract used by the admin editor.
begin;

update public.projects set tags = '{}'::text[] where tags is null;
alter table public.projects alter column tags set default '{}'::text[];
alter table public.projects alter column tags set not null;
alter table public.projects drop constraint if exists projects_tags_check;
alter table public.projects add constraint projects_tags_check check (cardinality(tags) <= 8);

commit;
