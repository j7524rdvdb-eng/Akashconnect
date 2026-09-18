# From Kerala to Canterbury

Personal portfolio for **Akash Thattanparambil Raju** — Case Manager at the Ministry of Social Development (Kaikōura, NZ), and Health and Safety Representative for the Kaikōura Work and Income office.

**Theme:** a cinematic journey narrative from Kerala to Canterbury, told in immersive chapters.

**Live domain:** [www.akashconnect.com](https://www.akashconnect.com)

## GitHub Pages

- Source: `main` branch, site root (`/`)
- Custom domain via `CNAME`: `www.akashconnect.com`
- Fallback URL: `https://j7524rdvdb-eng.github.io/Akashconnect/`

No build step — self-contained `index.html` with embedded CSS/JS and `akash.jpg`.

## Files

| File | Purpose |
|------|---------|
| `index.html` | Cinematic portfolio (“From Kerala to Canterbury”) |
| `akash.jpg` | Portrait photo |
| `CNAME` | Custom domain for GitHub Pages |
| `README.md` | This file |

## DNS (for www.akashconnect.com)

- **www** — CNAME to `j7524rdvdb-eng.github.io`
- Apex (`akashconnect.com`) — A records to GitHub Pages IPs (`185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`), or ALIAS/ANAME to `j7524rdvdb-eng.github.io`

After DNS propagates, enable “Enforce HTTPS” in the repo’s Pages settings.
