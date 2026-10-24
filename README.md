# AutoSchool CRM — Vercel Demo (Frontend Only)

This is an isolated presentation/demo version of AutoSchool CRM using React + Vite. It does **not** connect to the old YECHIM CRM, Render, Neon, or any backend. Every browser/origin has its own data in localStorage. Never store real student or personal information in this public demo.

## Run locally

- Node.js 20.19+ or 22.x recommended.
- In this folder run:

```sh
npm install
npm run dev
```

Open http://127.0.0.1:5173

Demo login: `admin` / `Admin12345!`. This is visible client-side and provides **no actual authentication/security**.

## Deploy to Vercel using GitHub

1. Create a **new** GitHub repository (not the existing YECHIM CRM repository).
2. Upload **the contents of this folder to the repository root** (`package.json`, `src`, `vercel.json`, etc).
3. In Vercel > Add New > Project, import this new repository.
4. Framework preset: **Vite**. Root Directory: **./**.
5. Build command: `npm run build`. Output Directory: `dist`.
6. Deploy. `vercel.json` provides a fallback for SPA paths, including `/dashboard`.
7. Do not set `VITE_API_URL`, `DATABASE_URL`, any Telegram/OpenAI tokens, or other backend secrets.

Alternatively, run `npx vercel` in this folder after connecting your Vercel account, then `npx vercel --prod` to publish.

## Important limits

- Demo data stays in each visitor's **own browser** and doesn't sync across computers/phones. Different browsers start from independent sample data. Incognito/clearing site data loses changes.
- Admin demo login is cosmetic, **not secure**. Do not enter personal details, genuine payment data, or passports.
- Settings > Data backup exports JSON and can restore it locally, and reset to sample records.
- Real multi-user deployment requires a proper backend, PostgreSQL/hosted database, authentication, and permissions. A file-based SQLite backend is **not suitable** as permanent Vercel Function storage.
- Never deploy over the existing YECHIM CRM project or connect its database.

## Implementation details

The same AutoSchool UI, forms and calculations are retained. `src/api.js` provides a localStorage-backed demo transport for the existing `/api/auth/login`, `/api/auth/me`, `/api/state` operations, so there is no failed network request for `/api/auth/login` on a static Vercel website. Mutations are debounced and saved in this origin's storage, with optimistic revision checks in the same browser.
