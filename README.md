# From Kerala to Canterbury

Personal portfolio for **Akash Thattanparambil Raju** — Case Manager at the Ministry of Social Development (Kaikōura, NZ), and Health and Safety Representative for the Kaikōura Work and Income office.

**Theme:** simple cinematic single-page — dark atmosphere, large typography, slim top nav, typographic journey timeline. No contact form, no floating dock, no image assets.

**Live domain:** [www.akashconnect.com](https://www.akashconnect.com)

## GitHub Pages

- Source: `main` branch, site root (`/`)
- Custom domain via `CNAME`: `www.akashconnect.com`
- Fallback URL: `https://j7524rdvdb-eng.github.io/Akashconnect/`

No build step — self-contained `index.html` with embedded CSS/JS.

## Files

| File | Purpose |
|------|---------|
| `index.html` | Cinematic portfolio (hero, journey timeline, today, contact) |
| `CNAME` | Custom domain for GitHub Pages |
| `README.md` | This file |

## Design notes

- Full-bleed near-black with restrained blue/amber accents
- Slim sticky top nav (Journey, Today, Contact)
- Typographic five-chapter timeline; scroll fade-ins
- Email and phone only — no form, no photos

## DNS (for www.akashconnect.com)

- **www** — CNAME to `j7524rdvdb-eng.github.io`
- Apex (`akashconnect.com`) — A records to GitHub Pages IPs (`185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`), or ALIAS/ANAME to `j7524rdvdb-eng.github.io`

After DNS propagates, enable “Enforce HTTPS” in the repo’s Pages settings.
