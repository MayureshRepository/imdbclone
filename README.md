# AMDb — A Modern IMDb Clone

AMDb is a fast, responsive movie & TV show explorer built with **Angular 18**, **Tailwind CSS** and **Angular Material**. It uses the free [OMDb API](https://www.omdbapi.com/) to search titles, show detailed information and ratings, and lets you keep a personal list of favorites, all stored in your browser.

## Features

- **Instant search**: debounced live search in the header with poster previews and skeleton loaders.
- **Home page**: "Most Searched" titles plus a **Recently Viewed** row for the current session.
- **Title details**: poster backdrop, genre chips, IMDb score, cast, awards, and ratings from IMDb / Rotten Tomatoes / Metacritic.
- **Favorites**: add or remove with one tap. They're saved to `localStorage`, and the count shows live in the header.
- **Dark / light mode**: dark by default, with a sun/moon toggle in the header. Your choice is saved in `localStorage` and applied before first paint, so the page never flashes the wrong theme.
- **Premium UI**: Bento-grid home and details pages, soft glassmorphism tiles with a cursor-following spotlight, animated gradient headlines, and a deep slate, electric indigo and IMDb gold palette. Fully responsive from phone to desktop.
- **Dialogs**: About, Contact, Privacy Policy, and a confirmation prompt before clearing favorites.

## Tech stack

| Layer      | Technology                                     |
| ---------- | ---------------------------------------------- |
| Framework  | Angular 18 (NgModule-based, new control flow)  |
| Styling    | Tailwind CSS 3.4 + custom design tokens        |
| Components | Angular Material 18 (dialogs, snackbar, tooltips) |
| Icons      | Material Icons Round                           |
| Data       | [OMDb API](https://www.omdbapi.com/)           |
| Tests      | Karma + Jasmine                                |

## Prerequisites

- **Node.js** 18.19+ or 20.x / 22.x (LTS recommended). Check with `node -v`.
- **npm** 9+ (bundled with Node). Check with `npm -v`.
- Optional: the Angular CLI installed globally (`npm i -g @angular/cli@18`). Every command below also works through `npx ng ...` or the npm scripts, so a global install isn't required.

## Getting started

```bash
# 1. Clone the repository
git clone <your-repo-url> imdbclone
cd imdbclone

# 2. Install dependencies
npm install

# 3. Start the dev server
npm start            # same as: ng serve
```

Open **http://localhost:4200/**. The app reloads automatically when you change a source file.

> To open the dev server to other devices on your network, run `npx ng serve --host 0.0.0.0`.

## Build for production

```bash
npm run build        # same as: ng build (production configuration by default)
```

The optimized output is written to `dist/imdbclone/browser/`. Serve that folder with any static host (Nginx, Netlify, Vercel, GitHub Pages, Firebase Hosting, …).

To preview the production build locally:

```bash
npx http-server dist/imdbclone/browser -p 8080 -c-1
# then open http://localhost:8080
```

> **Single-page app routing:** the app uses client-side routes (`/home`, `/details/:id`, `/favorites`). Configure your host to fall back to `index.html` for unknown paths, or deep links will return 404.

### Other useful scripts

| Command          | Description                                              |
| ---------------- | -------------------------------------------------------- |
| `npm start`      | Run the dev server at `http://localhost:4200`            |
| `npm run build`  | Production build into `dist/imdbclone`                   |
| `npm run watch`  | Development build that rebuilds on file changes         |
| `npm test`       | Run unit tests with Karma (opens Chrome)                |

## Deploy to GitHub Pages

The live site is at **https://mayureshrepository.github.io/imdbclone/**.

GitHub Pages serves the pre-built files on the **`gh-pages`** branch and doesn't build anything itself. You build locally, then push the output to that branch.

**One-time setup** (already done for this repo): under **Settings → Pages**, set **Source** to *Deploy from a branch*, **Branch** to `gh-pages`, and the folder to `/ (root)`.

### Steps

```bash
# 1. Commit and push source changes to master
#    (this alone does NOT update the live site)
git add -A
git commit -m "Describe your change"
git push origin master

# 2. Production build, using the sub-path the site is served from
npx ng build --base-href /imdbclone/

# 3. Copy index.html to 404.html so deep links (e.g. /imdbclone/details/tt0848228) work
cp dist/imdbclone/browser/index.html dist/imdbclone/browser/404.html

# 4. Publish the build output to the gh-pages branch
npx angular-cli-ghpages --dir=dist/imdbclone/browser
```

On **Windows PowerShell**, use this for step 3:

```powershell
Copy-Item dist/imdbclone/browser/index.html dist/imdbclone/browser/404.html
```

GitHub redeploys automatically within 1–2 minutes. Track it in the repo's **Actions** tab under *pages build and deployment*, then open the site. If you still see the old version, hard-refresh with `Ctrl+Shift+R`.

### Notes

- **Keep `--base-href /imdbclone/`.** Without it the deployed page is blank: the site lives under `/imdbclone/`, so scripts and styles fail to load from the domain root.
- **Why `404.html`?** GitHub Pages has no SPA fallback. Serving a copy of `index.html` as the 404 page lets Angular's router handle routes like `/favorites` on refresh.
- **Authentication:** `angular-cli-ghpages` pushes with your local git credentials, the same ones `git push` uses.

## OMDb API key

The services in `src/app/service/` call `https://www.omdbapi.com/` with an API key embedded in the URL. The free tier allows **1,000 requests/day**. If you hit the limit or want your own key:

1. Get a free key at <https://www.omdbapi.com/apikey.aspx>.
2. Replace the `apikey=` value in:
   - `src/app/service/search.service.ts`
   - `src/app/service/getmoviedata.service.ts`
   - `src/app/service/gettvshowdata.service.ts`

## Project structure

```
src/
├── index.html                 # Fonts, icon fonts, meta tags
├── styles.css                 # Tailwind layers, design system classes, Material overrides
└── app/
    ├── header/                # Sticky header, live search, favorites badge
    ├── main/                  # Home page: hero, recently viewed, most searched
    ├── details/               # Title details page
    ├── favorite/              # Favorites page
    ├── confirm-dialog/        # "Clear all favorites" confirmation
    ├── footer/                # Footer + About / Contact / Privacy dialogs
    └── service/               # OMDb API, favorites (localStorage) and theme services
tailwind.config.js             # Theme tokens: ink/brand colors, fonts, animations
```

### Design system

Reusable classes are defined in `src/styles.css` under `@layer components`:

- `page`: centered, responsive content container
- `btn-primary`, `btn-ghost`, `btn-danger`: button variants
- `poster-card`, `poster-grid`, `fav-toggle`: movie card building blocks
- `bento`, `bento-tile`, `bento-tile-link`: Bento grid and glass tiles (add `appSpotlight` for the cursor glow)
- `glass`, `text-gradient`, `btn-accent`, `eyebrow`, `icon-badge`: surfaces, headline gradient and accents
- `chip`, `section-title`, `skeleton`: small UI primitives

**Palette ("Midnight Premiere"):** each color has one job, which keeps the UI calm and consistent.

| Role | Color | Used for |
| ---- | ----- | -------- |
| Brand | Gold `#f5c518` | Logo, primary buttons, ratings, rank badges, headline shimmer |
| Accent | Indigo `#6d5efc` | Secondary buttons, chips, focus rings, hover glows |
| Favorites | Rose `#f43f5e` | Hearts and the favorites burst only |
| Neutrals | Cool slate | Backgrounds, cards and text, tinted toward the indigo background |

All text colors meet WCAG AA contrast (4.5:1) in both themes.

Colors are defined in `tailwind.config.js` (`ink-*` for surfaces, `brand-*` for the IMDb-style yellow). The theme-aware tokens (`ink-*`, `zinc-*`, `white`, `brand-300/400`) read CSS variables declared in `src/styles.css`: `:root` holds the dark palette (the default) and `html.light` overrides it. `ThemeService` (`src/app/service/theme.service.ts`) toggles the `light` class. Use `onbrand` or `snow` for text that must stay the same color in both themes, such as text on yellow or red buttons.

## Troubleshooting

- **`npm ci` fails with "package.json and package-lock.json are not in sync"**: run `npm install` once to refresh the lockfile.
- **Posters show "No Image"**: OMDb doesn't have a poster for that title, or the image host blocked the request. The app falls back to a placeholder automatically.
- **No search results / "Request limit reached"**: the shared OMDb key hit its daily quota. Use your own key (see above).
- **Bundle budget warning on build**: the warning is expected (most of the size is Angular Material) and doesn't affect the output.

## Disclaimer

This is a fan-made project for educational and personal use. It is not affiliated with IMDb or any official movie database. Movie data and posters are provided by the OMDb API.
