# Kiki · 严钟毓 — Personal Homepage 🐰

A cute-but-academic, bilingual (EN / 中文) single-page personal site for **Kiki (严钟毓)**,
AI Agent / LLM Application Engineer. Liquid-glass aesthetic with a pastel sky hero,
inspired by the [PanoWorld](https://lihaoy-ux.github.io/panoworld-page/) landing page.

## ✨ Features
- **Bilingual toggle** (EN / 中) in the top-right — remembers your choice via `localStorage`.
- **Animated hero**: floating particle/ripple canvas, drifting gradient blobs, an orbiting avatar.
- **Liquid-glass** cards, buttons and nav pill with cursor glow.
- **Scroll-reveal** animations, sticky active-section nav, responsive + reduced-motion friendly.
- Content pulled straight from the résumé: NUS · UCL · MSRA (AI Interview Platform +
  Knowledge Fabric) · FinGeneral Agent · skills.
- **Zero build step** — pure HTML/CSS/JS. Just static files.

## 📁 Files
```
kiki-homepage/
├── index.html   # all content (bilingual via data-en / data-zh attributes)
├── style.css    # styling / animations
├── script.js    # language toggle, canvas, scroll reveal, nav
├── .nojekyll     # tells GitHub Pages to serve files as-is
└── README.md
```

## 🚀 Deploy to GitHub Pages

### Option A — user/organization site (recommended, gives you `username.github.io`)
1. Create a repo named exactly `your-username.github.io`.
2. Copy the **contents** of this `kiki-homepage/` folder into the repo root.
3. Commit & push:
   ```bash
   git init
   git add .
   git commit -m "Kiki personal homepage"
   git branch -M main
   git remote add origin https://github.com/your-username/your-username.github.io.git
   git push -u origin main
   ```
4. Visit `https://your-username.github.io` (may take a minute to go live).

### Option B — project site (any repo name)
1. Push these files to any repo (e.g. `homepage`).
2. Repo **Settings → Pages → Build and deployment → Source: Deploy from a branch**.
3. Choose branch `main` and folder `/ (root)` → Save.
4. Visit `https://your-username.github.io/homepage/`.

## ✏️ Things to personalize before publishing
Search `index.html` for `TODO` and fill in:
- **GitHub URL** — currently `https://github.com/` in the Contact section (and nav).
- **LinkedIn URL** — currently `https://www.linkedin.com/`.
- Email is set to `e1351368@nus.edu`. Phone number is intentionally **not** shown for privacy.

Optional tweaks:
- Change the mascot emoji 🐰 (favicon + nav + avatar) in `index.html`.
- Adjust the palette via the CSS custom properties at the top of `style.css`
  (`--accent`, `--accent-2`, `--lilac`, `--pink`, `--mint` …).
- Add real numbers where the résumé had placeholders (e.g. number of interviews handled).

## 🔍 Preview locally
```bash
cd kiki-homepage
python3 -m http.server 8080
# open http://localhost:8080
```
