# From Kerala to Canterbury

Personal portfolio for **Akash Thattanparambil Raju** — Case Manager at the Ministry of Social Development (Kaikōura, NZ), and Health and Safety Representative for the Kaikōura Work and Income office.

**Theme:** simple cinematic three-page site — dark atmosphere, large typography (Cormorant + Inter), slim sticky nav, generous whitespace, scroll reveals. No contact form, no photos.

**Live domain:** [www.akashconnect.com](https://www.akashconnect.com)

## Pages

| Page | File | Content |
|------|------|---------|
| **Home** | `index.html` | Hero, short intro, “Today in Kaikōura” snapshot, links to Journey and Contact |
| **Journey** | `journey.html` | Five typographic chapters / career timeline |
| **Contact** | `contact.html` | Email and phone only (no form) |

Nav on every page: **Home · Journey · Contact** (active page marked).

## Shared assets

| File | Purpose |
|------|---------|
| `styles.css` | Shared cinematic styles |
| `main.js` | Scroll-reveal animations |
| `CNAME` | Custom domain for GitHub Pages (`www.akashconnect.com`) |
| `README.md` | This file |

## GitHub Pages

- Source: `main` branch, site root (`/`)
- Custom domain via `CNAME`: `www.akashconnect.com`
- Fallback URL: `https://j7524rdvdb-eng.github.io/Akashconnect/`

No build step — plain HTML/CSS/JS with relative links (GitHub Pages friendly).

## Design notes

- Full-bleed near-black with restrained blue/amber accents
- Slim sticky top nav with active-page highlight
- Typographic five-chapter timeline on Journey; scroll fade-ins
- Email and phone only — no form, no photos
- Security meta + CSP on each HTML page (Google Fonts + unsafe-inline as needed)
- NZ English throughout

## DNS (for www.akashconnect.com)

- **www** — CNAME to `j7524rdvdb-eng.github.io`
- Apex (`akashconnect.com`) — A records to GitHub Pages IPs (`185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`), or ALIAS/ANAME to `j7524rdvdb-eng.github.io`

After DNS propagates, enable “Enforce HTTPS” in the repo’s Pages settings.
