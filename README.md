# Akash Thattanparambil Raju — Portfolio

Personal portfolio site for **Akash Thattanparambil Raju**, Case Manager at the Ministry of Social Development (Kaikōura, NZ).

**Live domain:** [www.akashconnect.com](https://www.akashconnect.com)

## GitHub Pages

- Source: `main` branch, site root (`/`)
- Custom domain via `CNAME`: `www.akashconnect.com`
- Fallback URL: `https://j7524rdvdb-eng.github.io/Akashconnect/`

No build step — single self-contained `index.html` with embedded CSS and JavaScript.

## Files

| File | Purpose |
|------|---------|
| `index.html` | Complete portfolio page |
| `CNAME` | Custom domain for GitHub Pages |
| `README.md` | This file |

## DNS (for www.akashconnect.com)

Point your domain at GitHub Pages:

- **www** — CNAME to `j7524rdvdb-eng.github.io`
- Apex (`akashconnect.com`) — A records to GitHub Pages IPs (`185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`), or ALIAS/ANAME to `j7524rdvdb-eng.github.io` if your DNS host supports it

After DNS propagates, enable “Enforce HTTPS” in the repo’s Pages settings.
