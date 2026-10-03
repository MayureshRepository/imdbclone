# AMDb — A Modern IMDb Clone

AMDb is a fast, responsive movie & TV show explorer built with **Angular 18**, **Tailwind CSS** and **Angular Material**. It uses the free [OMDb API](https://www.omdbapi.com/) to search titles, show detailed information and ratings, and lets you keep a personal list of favorites, all stored in your browser.

## Features

- **Instant search**: debounced live search in the header with poster previews and skeleton loaders.
- **Home page**: "Most Searched" titles plus a **Recently Viewed** row for the current session.
- **Title details**: poster backdrop, genre chips, IMDb score, cast, awards, and ratings from IMDb / Rotten Tomatoes / Metacritic.
- **Favorites**: add or remove with one tap. They're saved to `localStorage`, and the count shows live in the header.
- **Dark / light mode**: dark by default, with a sun/moon toggle in the header. Your choice is saved in `localStorage` and applied before first paint, so the page never flashes the wrong theme.
- **Modern UI**: glassmorphism header, gradient hero, animated poster cards, and a responsive grid from phone to desktop.
- **Dialogs**: About, Contact, Privacy Policy, and a confirmation prompt before clearing favorites.

## Tech stack

| Layer      | Technology                                     |
| ---------- | ---------------------------------------------- |
| Framework  | Angular 18 (NgModule-based, new control flow)  |
| Styling    | Tailwind CSS 3.4 + custom design tokens        |
| Components | Angular Material 18 (dialogs, snackbar, tooltips) |
| Icons      | Material Icons Round, Font Awesome 6           |
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
- `chip`, `section-title`, `skeleton`: small UI primitives

Colors are defined in `tailwind.config.js` (`ink-*` for surfaces, `brand-*` for the IMDb-style yellow). The theme-aware tokens (`ink-*`, `zinc-*`, `white`, `brand-300/400`) read CSS variables declared in `src/styles.css`: `:root` holds the dark palette (the default) and `html.light` overrides it. `ThemeService` (`src/app/service/theme.service.ts`) toggles the `light` class. Use `onbrand` or `snow` for text that must stay the same color in both themes, such as text on yellow or red buttons.

## Troubleshooting

- **`npm ci` fails with "package.json and package-lock.json are not in sync"**: run `npm install` once to refresh the lockfile.
- **Posters show "No Image"**: OMDb doesn't have a poster for that title, or the image host blocked the request. The app falls back to a placeholder automatically.
- **No search results / "Request limit reached"**: the shared OMDb key hit its daily quota. Use your own key (see above).
- **Bundle budget warning on build**: the warning is expected (most of the size is Angular Material) and doesn't affect the output.

## Disclaimer

This is a fan-made project for educational and personal use. It is not affiliated with IMDb or any official movie database. Movie data and posters are provided by the OMDb API.
