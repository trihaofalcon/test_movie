# MovieDB Explorer – Setup Guide

## Prerequisites

| Requirement | Version |
|---|---|
| Node.js | 18 or above |
| npm | bundled with Node |
| TMDB API Key | free at [themoviedb.org](https://www.themoviedb.org/settings/api) |

---

## Installation

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd movie-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.example .env
```

Open `.env` and set your TMDB API key:

```
NEXT_PUBLIC_TMDB_API_KEY=your_api_key_here
```

> **Note:** Next.js loads env files in priority order: `.env.$(NODE_ENV).local` → `.env.local` → `.env.$(NODE_ENV)` → `.env`. The project uses `.env` by default — it is already listed in `.gitignore` so your API key won't be committed.

### 4. Start the development server

```bash
npm run dev
```

Navigate to [http://localhost:3000](http://localhost:3000).

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server (Turbopack) |
| `npm run build` | Build optimised production bundle |
| `npm start` | Run production server |
| `npm run lint` | Run ESLint across the project |
| `npm test` | Run the full Jest test suite |
| `npm test -- --verbose` | Run tests with per-test output |
| `npm test -- --coverage` | Run tests with coverage report |

---

## Project Structure

```
src/
├── app/                   # Next.js App Router pages
│   ├── page.tsx           # Home – popular movies & TV
│   ├── layout.tsx         # Root layout (Header + StoreHydration)
│   ├── favourites/        # Favourites management page
│   ├── lists/             # Custom Lists management page
│   ├── movie/[id]/        # Movie detail page
│   └── tv/[id]/           # TV show detail page
│
├── components/
│   ├── ui/                # Reusable design-system components
│   │   ├── Modal.tsx      # Shared, accessible modal wrapper
│   │   ├── Button.tsx     # Primary / secondary / ghost / danger button
│   │   ├── Input.tsx      # Styled text input
│   │   ├── Card.tsx       # Card container
│   │   ├── Badge.tsx      # Pill badge
│   │   └── index.ts       # Barrel export
│   ├── Header.tsx         # Top navigation bar
│   ├── MovieCard.tsx      # Poster card with favourite button
│   ├── MovieCardDropdown.tsx  # Context menu (favourite / add-to-list)
│   ├── MediaGrid.tsx      # Responsive grid of MovieCards
│   ├── AddToListModal.tsx # "Add to list" modal (uses Modal component)
│   ├── FavouriteButton.tsx
│   ├── StoreHydration.tsx # Hydrates Zustand store from localStorage on mount
│   └── AddToGroupSelect.tsx
│
├── services/
│   ├── tmdb.ts            # TMDB REST API client
│   └── storage.ts         # localStorage persistence (favourites, groups, lists)
│
├── store/
│   └── useMovieStore.ts   # Zustand global store
│
├── lib/
│   └── media.ts           # Conversion helpers (MediaItem ↔ ListItem ↔ Favourite)
│
├── types/
│   └── movie.ts           # Shared TypeScript interfaces
│
├── constants/
│   └── common.ts
│
└── __tests__/
    ├── components.test.tsx        # MovieCardDropdown & AddToListModal
    ├── lists.test.ts              # StorageService lists & Zustand list actions
    └── storage_and_modal.test.tsx # Favourites, groups, helpers, Modal UI
```

---

## Getting a TMDB API Key

1. Go to [https://www.themoviedb.org/settings/api](https://www.themoviedb.org/settings/api)
2. Sign up (free) or log in
3. Click **Request an API key** → choose **Developer**
4. Fill in the short form
5. Copy the **API Key (v3 auth)** value
6. Paste it into `.env.local` as `NEXT_PUBLIC_TMDB_API_KEY`

---

## Running Tests

```bash
npm test                   # run all test suites
npm test -- --verbose      # verbose output with each test name
npm test -- --coverage     # generate HTML coverage report in /coverage
npm test -- lists          # run only lists.test.ts
npm test -- modal          # run only storage_and_modal.test.tsx
```

Test suites:

| File | What it covers |
|---|---|
| `components.test.tsx` | `MovieCardDropdown`, `AddToListModal` rendering and interactions |
| `lists.test.ts` | `StorageService` list CRUD, media helpers, Zustand list actions |
| `storage_and_modal.test.tsx` | Favourites, groups, `getMediaTitle`, `favouriteToMediaItem`, Zustand favourite actions, `Modal` UI component |

---

## Features

- 🎬 Browse popular movies & TV shows (paginated)
- 🔍 Search across both media types
- 📄 Detailed view per movie / TV show
- ⭐ Favourites – save titles with persistent storage
- 📋 Custom Lists – create and manage named collections
- 🎛️ Reusable `<Modal>` component (Escape to close, scroll-lock, overlay click)
- 💾 All data persisted in `localStorage` via Zustand
- 📱 Responsive mobile-first design
- ♿ Accessible – ARIA roles, keyboard navigation

---

## Troubleshooting

**API key not working:**
- Ensure `NEXT_PUBLIC_TMDB_API_KEY` is set in `.env` (or `.env.local` — both work)
- Restart the dev server after adding or changing the key: `npm run dev`
- Check that your key is active on the TMDB dashboard
- Variable must be prefixed with `NEXT_PUBLIC_` to be accessible in the browser

**`npm run build` fails:**
- Make sure all dependencies are installed: `npm install`
- Check your Node.js version: `node --version` (must be ≥ 18)
- Run `npm run lint` to identify any ESLint errors first

**Tests fail:**
- Run `npm install` to ensure `jest-environment-jsdom` is present
- Verify `jest.setup.js` imports `@testing-library/jest-dom`
- The `src/__tests__` directory is **not** excluded from the TypeScript config

**Images not loading:**
- Verify TMDB API connectivity
- Confirm your API key has read access
