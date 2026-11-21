# robert-stewart.dev

Personal portfolio for **Robert Stewart** — full-stack software engineer. Single-page site with projects, experience, tutoring themes, and contact.

**Live:** [https://robert-stewart.dev](https://robert-stewart.dev)  
**Repo:** deploys from `main` to GitHub Pages (`rs691/rs691.github.io`).

## Stack

Next.js 16 (static export) · React 19 · Tailwind CSS 4 · shadcn/ui · Motion · Lenis

## Local development

```bash
npm install
npm run dev
```

```bash
npm run build      # static export → out/
npm run typecheck
npm run lint
```

## Deploy

Pushes to `main` run `.github/workflows/deploy-pages.yml` (lint + typecheck + build, then Pages). Custom domain is set via `public/CNAME` → `robert-stewart.dev`.
