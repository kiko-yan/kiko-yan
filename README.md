# Kiki · 严钟毓 — Personal Homepage

A bilingual (English / 中文) single-page personal website for Kiki (严钟毓),
an AI Agent and LLM application engineer. The page presents a professional
profile based on the résumé, covering education, experience, selected
projects, skills, and contact details.

**Live site:** https://kiko-yan.github.io/kiko-yan/

## Overview

- **Bilingual.** Visitors can switch between English and Chinese, and the
  preferred language is remembered on return visits.
- **Single page.** Education, experience, projects, skills, and contact
  information are presented in one continuous layout.
- **Responsive.** The design adapts to desktop and mobile screens.
- **Self-contained.** The site consists of static files only, with no build
  step or installation required.

## Deployment

The site is published with GitHub Pages from the `main` branch of the
`kiko-yan/kiko-yan` repository and is available at the live link above.

To publish an update, commit the changes and push to the `main` branch.
GitHub Pages redeploys automatically, typically within a few minutes.

## Local preview

To review the site before publishing, open `index.html` in a browser, or
serve the folder locally and visit http://localhost:8080:

```bash
python3 -m http.server 8080
```

## Customization

- **Content** is contained in `index.html`; visual styling is in `style.css`.
- **Contact links.** The LinkedIn link in the Contact section is currently a
  placeholder and should be updated before sharing the site widely.
