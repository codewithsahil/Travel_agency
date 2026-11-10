# How to run Onceagain (for humans and for Claude)

> **Claude: read this file top to bottom, then execute the steps.** It works for a **fresh device** (nothing installed) and for a **restart on a used device** (old servers, old ports, stale builds). Use `docs/context.md` for background on the project.
> Project: Next.js 16.4.5 · React 19 · Tailwind 4 · TypeScript. Repo: https://github.com/codewithsahil/Travel_agency (branch `main`).

---

## 0. Decide which case you are in

| Situation | Go to |
|---|---|
| No project folder / no `node_modules` / new machine | **§2 Fresh device** |
| Folder + `node_modules` already exist | **§3 Restart on a used device** |
| Something is broken | **§6 Troubleshooting** |

Always finish with **§5 Verify it is really running**.

## 1. Requirements

| Tool | Needed | Known-good |
|---|---|---|
| Node.js | **≥ 20.9** (Next 16 requirement). Newer is fine. | 24.21.0 |
| npm | ≥ 10 | 11.19.0 |
| Git | any recent | — |
| Browser | any (Chrome/Edge) | Chrome |
| Python 3 | **optional**, only for the `ui-ux-pro-max` design-search CLI | 3.12 |

Check: `node -v && npm -v && git --version`. If Node is missing or too old, install the LTS from https://nodejs.org (or `winget install OpenJS.NodeJS.LTS` on Windows) and reopen the terminal.

No database, no API keys and no `.env` file are required. Optional: `NEXT_PUBLIC_SITE_URL` (public site URL for sitemap/canonical/OG; defaults to `https://onceagain.example`).

## 2. Fresh device

Run these in the folder where the project should live. The folder name must not matter to the app (the original is `D:\O11\p3- project trv`, which contains spaces. **Always quote paths**).

```bash
# 1. get the code
git clone https://github.com/codewithsahil/Travel_agency.git
cd Travel_agency

# 2. install dependencies (about 1-3 minutes; creates node_modules)
npm install

# 3. quality gate (should print nothing / exit 0)
npx tsc --noEmit
npx eslint .

# 4. pick a FREE port (see §4), then start the dev server
npm run dev -- -p 3200
```

Open `http://localhost:3200`. The first request compiles pages and can take several seconds. Skip to **§5**.

Production-style run (what to use for visual testing and demos):

```bash
npm run build
npx next start -p 3200
```

## 3. Restart on a used device

Do these in order. **Do not skip the port check.**

```bash
cd "<project folder>"

# 1. see what changed upstream and locally
git status -sb
git pull --ff-only          # only if the tree is clean; otherwise ask the user

# 2. refresh dependencies only if package.json / package-lock.json changed
npm install

# 3. find old servers (see §4). Free a port or choose another one.

# 4. clear stale build output if you saw weird errors (safe, it is regenerated)
rm -rf .next                # PowerShell: Remove-Item -Recurse -Force .next

# 5. start
npm run dev -- -p 3200      # development (hot reload)
# or
npm run build && npx next start -p 3200   # production build
```

Rules for a used device:
- A second `next dev` in the **same project folder** will refuse to start while another is running (lock in `.next/dev`). Find and reuse or stop the old one.
- Never run `next build` while a `next start` is serving the same `.next` folder. Restart the server after rebuilding.
- If `git pull` conflicts or the tree is dirty, **stop and ask the user**. Do not discard changes.

## 4. Ports: check before you start

Default Next port is 3000, but on the original machine **`localhost:3000` is occupied by another project**, so requests to `localhost:3000` hit the wrong app (JSON 404 with `access-control-allow-origin: http://localhost:5173`). Use another port (3200 is the convention here).

Check what is listening:

```powershell
# PowerShell
netstat -ano | findstr ":3000 :3100 :3200"
Get-CimInstance Win32_Process -Filter "ProcessId=<PID>" | Select ProcessId,Name,CommandLine
```

```bash
# Git Bash
netstat -ano | grep -E ":(3000|3100|3200) "
```

- Look at the command line of each PID. If it contains this project's path (`...\node_modules\next\...`), it is **this app's old server**: either reuse it or ask the user before stopping it.
- If it belongs to another project, **leave it alone** and pick a different port.
- Stopping a process: `taskkill /PID <pid> /F` (Windows). In earlier sessions an automated permission check **denied** this. If that happens, do not look for a workaround: pick another free port or ask the user to close it.

## 5. Verify it is really running

Claude: start long-running servers with `run_in_background` (or `&`), then poll until ready instead of sleeping blindly.

```bash
# wait until the server answers (max ~60 s), then check every route
for i in $(seq 1 30); do curl -s -o /dev/null http://localhost:3200/ && break; sleep 2; done
for p in / /destinations /packages /about /contact /sitemap.xml /robots.txt; do
  printf "%s " "$p"; curl -s -o /dev/null -w "%{http_code}\n" "http://localhost:3200$p"
done
```

Expected: **200** for every line. (`/nope` should return 404.) Then tell the user the URL.

Also useful: `curl -s http://localhost:3200/ | head -c 300` should contain `<title>Onceagain` and not a JSON error.

## 6. Troubleshooting

| Symptom | Cause / fix |
|---|---|
| `localhost:3000` shows JSON `404 Not Found` or a different app | Another project owns that port. Use `-p 3200`. |
| Page loads but is blank / sections invisible, no interaction | JS not hydrating. In **dev**, Next blocks `/_next` when the site is opened from a non-localhost origin (e.g. LAN IP). Open via `localhost`, or add the host to `allowedDevOrigins` in `next.config.ts` (do not commit machine IPs). Or test with the production build. |
| **No photos, only dark-blue gradient placeholders / initials** | Expected on a network that TLS-inspects Unsplash (Sophos). Server logs show `UNABLE_TO_VERIFY_LEAF_SIGNATURE` on `/_next/image`. Fix: `set NODE_EXTRA_CA_CERTS=C:\path\to\root-ca.pem` (PowerShell: `$env:NODE_EXTRA_CA_CERTS="..."`) **before** starting, or use another network. **Never disable TLS verification.** |
| `Another next dev server is already running` | An old dev server for this folder is alive. Find it (§4), reuse or stop it. |
| `EADDRINUSE: address already in use` | Port taken. Choose another `-p`. |
| `Cannot find module 'cn'` / `from "cn"` | After a shadcn CLI add: `grep -rl 'from "cn"' src \| xargs sed -i 's#from "cn"#from "@/lib/utils"#'` then `npm rm cn`. |
| Type or lint errors after pulling | `npm install` then `npx tsc --noEmit && npx eslint .`. |
| Strange stale behaviour / chunk errors | Stop servers, `rm -rf .next`, restart. |
| Build fails on `useSearchParams` | Components using it must stay inside `<Suspense>` (already the case on destinations, packages, contact). |
| `npm run dev` is slow the first time | Normal (Turbopack compiles on first request). |
| Git Bash: argument like `/` turns into `C:/Program Files/Git/` | MSYS path conversion. Avoid passing bare `/` in env vars or args; quote or use PowerShell. |
| Embedded Google Map blank | Likely blocked by the network. Not a code bug. |

## 7. Useful commands

```bash
npm run dev -- -p 3200       # dev server with hot reload
npm run build                # production build (also type-checks)
npx next start -p 3200       # serve the production build
npm run lint                 # eslint (flat config)
npx tsc --noEmit             # type check only
```

Optional visual testing (kept **outside** the repo): `npm i playwright-core` in a temp folder and drive the system Chrome (`C:\Program Files\Google\Chrome\Application\chrome.exe`) with `chromium.launch({ executablePath, headless: true })`. Test against a **production build** or localhost.

## 8. Claude's checklist (summary)

1. Read this file and `docs/context.md`. Read `AGENTS.md` and relevant `node_modules/next/dist/docs/` pages before changing Next code.
2. `node -v` (≥ 20.9), then fresh → §2, used → §3.
3. Check ports (§4). Never kill a process you do not own; ask the user if a kill is needed or denied.
4. Start the server in the background on a free port (default 3200).
5. Verify all routes return 200 (§5). Report the URL.
6. If photos are missing, explain the Sophos/certificate cause (§6). Do not bypass TLS.
7. After any code change: `npx tsc --noEmit && npx eslint .`; rebuild and restart before visual checks.
8. Do not commit or push unless the user asks.
