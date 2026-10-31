# FASTDEALGH Website — Cloudflare Pages version (preview first)

This is a separate FASTDEALGH project. It does not modify your existing website by itself. It is adapted for Cloudflare Pages; the original Netlify package should be kept separately.

## Included
- Responsive React + TypeScript website with bundle filters and supplied prices.
- Optional phone number field, initially `0559363548`.
- Main and alternative checkout choices.
- `/admin` dashboard for independent manual checkout switches.
- Cloudflare Pages Functions for server-side status checks, protected admin login/status updates, and checkout redirects.
- Cloudflare KV-backed persistent checkout status.
- SEO basics, sitemap, robots.txt, and PWA manifest.

## Before deployment
This package has been adapted but has **not yet been built, deployed, or security-tested in your Cloudflare account**. Do not use it for live customer orders until you test the website, admin login, persistence, and checkout redirects.

## Cloudflare Pages settings
- Framework preset: **Vite**
- Build command: `npm run build`
- Build output directory: `dist`
- Root directory: `/`
- Functions directory: `functions` (Cloudflare Pages detects this directory automatically when deployed from the repository)

## Required Cloudflare configuration
1. In Cloudflare Dashboard, create a **KV namespace** named `FASTDEALGH_SETTINGS` (the namespace's display name can be the same).
2. Open the Pages project settings and add a KV binding with variable name exactly `FASTDEALGH_SETTINGS`, connected to that namespace.
3. Add `CHECKOUT_ADMIN_PASSWORD` as a secret/environment variable for the Pages project. Use a unique, strong password. Do not put the password in the source code.
4. Redeploy after adding the binding and secret.
5. Open `/admin` and test login, each ON/OFF toggle, persistence after refresh, and checkout behavior while each option is off.

## Important
- Do not assume the intended Netlify URL `https://fastdealgh.netlify.app/` will work on Cloudflare. Cloudflare Pages assigns a `pages.dev` address unless you connect a domain.
- The two checkout destinations are external. A customer can still visit those external URLs directly; these site controls only control links routed through this website.
- KV changes can take a short time to propagate globally. Test before using for live operations.
- The included PWA manifest has no supplied icon assets, so full installability has not been verified.
- The contact form does not pretend to send messages; use the supplied contact links.
