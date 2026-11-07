# Jehan Sadik Portfolio

A responsive portfolio built with Next.js, React, TypeScript, Tailwind CSS, and Supabase.

## Supabase setup

1. Create a Supabase project.
2. Open its SQL Editor and run the SQL scripts in filename order from [supabase/migrations](./supabase/migrations): `202611070001_initial_portfolio.sql`, `202611070002_linkable_portfolio_content.sql`, `202611070003_admin_studio.sql`, then `202611070004_portfolio_media.sql`.
3. Copy `.env.example` to `.env`, then add the project URL and publishable anon key from **Project Settings → API**. Never put a service-role key in a `NEXT_PUBLIC_` variable.
4. Run `npm install`, then `npm run dev`.

The page displays its built-in content until the Supabase variables are configured. Once connected, public content and its links load from Supabase; the contact form securely submits through the `submit_contact_message` database function. Add URLs in Supabase Table Editor to `education.link_url`, `experience.link_url`, `certificates.link_url`, `awards.link_url`, `projects.project_url`, and the `linkedin_url`, `github_url`, and `resume_url` fields in `portfolio_profile`.

## No-code admin studio

1. In **Supabase Dashboard → Authentication → Users**, add your admin email and password. If email confirmation is enabled, complete it first.
2. In SQL Editor, grant that user access once (replace the email only):

   ```sql
   insert into public.portfolio_admins (user_id)
   select id from auth.users where email = 'YOUR_ADMIN_EMAIL@example.com';
   ```

3. Visit `/admin` on the deployed site and sign in with that same Supabase Auth email and password.

The studio lets authorized admins update profile/hero content, display picture, social links, skills, tools, projects, education, experience, certificates, awards, contact messages, and images. It accepts an image URL or uploads JPG, PNG, WebP, or GIF files up to 5 MB to the `portfolio-media` Supabase Storage bucket. Authentication happens in Supabase; only the public URL and anon key belong in Vercel environment variables.
