# Jehan Sadik Portfolio

A responsive portfolio built with Next.js, React, TypeScript, Tailwind CSS, and Supabase.

## Supabase setup

1. Create a Supabase project.
2. Open its SQL Editor and run the SQL scripts in filename order from [supabase/migrations](./supabase/migrations): first `202611070001_initial_portfolio.sql`, then `202611070002_linkable_portfolio_content.sql`.
3. Copy `.env.example` to `.env`, then add the project URL and publishable anon key from **Project Settings → API**. Never put a service-role key in a `NEXT_PUBLIC_` variable.
4. Run `npm install`, then `npm run dev`.

The page displays its built-in content until the Supabase variables are configured. Once connected, public content and its links load from Supabase; the contact form securely submits through the `submit_contact_message` database function. Add URLs in Supabase Table Editor to `education.link_url`, `experience.link_url`, `certificates.link_url`, `awards.link_url`, `projects.project_url`, and the `linkedin_url`, `github_url`, and `resume_url` fields in `portfolio_profile`.
