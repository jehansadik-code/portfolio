# Jehan Sadik Portfolio

A responsive, single-page portfolio built with Next.js, React, TypeScript, Tailwind CSS, and Prisma/MySQL.

## Run locally

1. Copy `.env.example` to `.env` and set a local MySQL `DATABASE_URL`.
2. Install dependencies with `npm install`.
3. Run `npm run db:generate` and `npm run db:push` to create the database tables.
4. Start the app with `npm run dev`.

The current page uses local typed portfolio data so it renders before the database is connected. The Prisma schema and seed script are included to make projects and contact messages database-backed as the next step.
