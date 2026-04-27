# BabySimulation — JavaScript spike (Phase 0)

Browser-only **π Estimation** demo: **Vite + React + TypeScript + Plotly.js**, Georgia Tech–style colors aligned with `R/gt-theme.R`.

## Prereqs

- **Node.js** 20+ (includes `npm`).

## Commands

```bash
cd baby-sim-js
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`). Click **Go** after changing `n` or seed.

```bash
npm run build    # output in dist/
npm run preview  # serve dist locally
```

## Ship it so it “just works” in a browser

The built app is **only static files** in `dist/`. Browsers usually **will not** run it correctly from a **double‑clicked** `index.html` (`file://…`) because ES modules (and Plotly) expect a normal **http(s)://** origin.

**Option A — Recipient has Node (one command, no project copy)**  
Zip the **`dist/`** folder only and send it. They install Node once, then in a terminal:

```bash
cd path/to/dist
npx --yes serve .
```

They open the URL it prints (e.g. `http://localhost:3000`). `npx serve` downloads nothing permanent beyond npm’s cache.

**Option B — Recipient has Python 3**  
From the folder **containing** `dist/`:

```bash
cd path/to/parent-of-dist
python -m http.server 8080
```

Then open **`http://localhost:8080/dist/`** (note the `/dist/` path).

**Option C — No install for them (you host static files)**  
Upload the contents of **`dist/`** to any static host: **GitHub Pages**, **Netlify**, **Cloudflare Pages**, **Azure Static Web Apps**, course LMS “static site”, etc. You give them a **https://…** link; they only use the browser.

**What you zip:** after `npm run build`, ship **`dist/`** as-is (keep `index.html` and `assets/` together). Do not ship `node_modules/` unless they will run `npm run dev` from source.

## GitHub Pages (this repo as its own GitHub project)

This folder includes **`.github/workflows/deploy-github-pages.yml`**. It builds with `VITE_BASE=/<repo-name>/` so assets load on a **project site** at:

`https://<your-github-username>.github.io/<repo-name>/`

### One-time setup (you do this locally or on github.com)

1. **Create a new empty repository** on GitHub (e.g. `baby-sim-js`), **public**, **without** README / `.gitignore` / license (avoids merge conflicts). Note the exact **repo name** — it must match the URL path (the workflow uses it automatically).

2. **Push only this folder** as the root of that new repo (from `baby-sim-js/`):

   ```bash
   cd baby-sim-js
   git init
   git add .
   git commit -m "chore: baby-sim-js Phase 0 + GitHub Pages workflow"
   git branch -M main
   git remote add origin https://github.com/<YOUR_USER>/<REPO_NAME>.git
   git push -u origin main
   ```

   If `baby-sim-js` is already inside another git repo, use a **clone** of the new empty repo, copy these files in, commit, and push — or use `git subtree split` from the monorepo (more advanced).

3. **Turn on Pages for Actions:** on GitHub open **Settings → Pages → Build and deployment → Source** and choose **GitHub Actions** (not “Deploy from a branch”).

4. **Wait for the workflow:** **Actions** tab → **Deploy to GitHub Pages** → let it finish (green). First run can take a few minutes.

5. **Open the site:** after success, the run shows **`page_url`**, or use:

   `https://<YOUR_USER>.github.io/<REPO_NAME>/`

   (Trailing slash is fine.)

### If `gh` is installed (optional)

```bash
cd baby-sim-js
gh auth login
gh repo create <REPO_NAME> --public --source=. --remote=origin --push
```

Then still complete **step 3** (Pages source = GitHub Actions) in the browser.

### Note for Cursor / agents

Linking GitHub in Cursor does **not** let the agent create a remote repository without **your** credentials (e.g. **GitHub CLI** `gh` or a browser + `git push`). The workflow and `VITE_BASE` wiring are ready; you create the repo and push once.

## Parity notes

- **Geometry** matches `simulate_mc_pi()` in `R/monte-carlo-sim-pi.R` (unit square, inscribed disk, `<=` boundary).
- **RNG** is **Mulberry32**, not R’s `runif` — same numeric seed **does not** reproduce the R Shiny dart cloud.
- **Plotly** bundle is code-split (`manualChunks.plotly` in `vite.config.ts`).

## Next steps

See `../docs/js_wasm_plotly_migration_plan.md` (Phase 1+).
