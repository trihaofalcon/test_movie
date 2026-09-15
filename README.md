# MovieDB Explorer

A modern, full-featured movie and TV show discovery app built with **Next.js 16**, **React 19**, **TypeScript**, **Tailwind CSS v4**, and **Zustand**. Browse popular titles, search across movies & TV, manage your favourites and custom lists, all saved locally in your browser.

## Features

- 🎬 **Browse** popular movies and TV shows (paginated)
- 🔍 **Search** across both media types simultaneously
- 📄 **Detail pages** for individual movies and TV shows
- ⭐ **Favourites** – save and organise titles you love
- 📋 **Custom Lists** – create named lists and add any title to them
- 🎛️ **Modal system** – reusable `<Modal>` UI component shared across the app
- 💾 **Persistent state** – everything stored in `localStorage` via Zustand
- 📱 **Responsive** – mobile-first design, works great on all screen sizes
- ♿ **Accessible** – ARIA roles, keyboard navigation, Escape to close modals

## Getting Started

```bash
npm install
cp .env.example .env.local   # then add your TMDB API key
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server (Turbopack) |
| `npm run build` | Build the optimised production bundle |
| `npm start` | Run the production server |
| `npm run lint` | Run ESLint |
| `npm test` | Run the Jest test suite |
| `npm test -- --verbose` | Run tests with detailed output |
| `npm test -- --coverage` | Run tests with coverage report |

## Project Structure

```
src/
├── app/                   # Next.js App Router pages
│   ├── page.tsx           # Home (popular movies & TV)
│   ├── layout.tsx         # Root layout with Header
│   ├── favourites/        # Favourites page
│   ├── lists/             # Custom Lists page
│   ├── movie/[id]/        # Movie detail page
│   └── tv/[id]/           # TV show detail page
├── components/
│   ├── ui/                # Reusable design-system components
│   │   ├── Modal.tsx      # Shared modal component
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   └── Badge.tsx
│   ├── Header.tsx
│   ├── MovieCard.tsx
│   ├── MovieCardDropdown.tsx
│   ├── AddToListModal.tsx
│   ├── FavouriteButton.tsx
│   └── StoreHydration.tsx
├── services/
│   ├── tmdb.ts            # TMDB REST API integration
│   └── storage.ts         # localStorage persistence layer
├── store/
│   └── useMovieStore.ts   # Zustand global store
├── lib/
│   └── media.ts           # Media item conversion helpers
├── types/
│   └── movie.ts           # Shared TypeScript types
├── constants/
│   └── common.ts          # Shared constants
└── __tests__/
    ├── components.test.tsx       # MovieCardDropdown & AddToListModal
    ├── lists.test.ts             # StorageService lists & store list actions
    └── storage_and_modal.test.tsx # Favourites, groups, helpers, Modal UI
```

## Tech Stack

- **[Next.js 16](https://nextjs.org/)** – App Router, Server & Client components
- **[React 19](https://react.dev/)** – UI library
- **[TypeScript 5](https://www.typescriptlang.org/)** – Type safety
- **[Tailwind CSS v4](https://tailwindcss.com/)** – Utility-first styling
- **[Zustand 5](https://zustand-demo.pmnd.rs/)** – Lightweight state management
- **[Sonner](https://sonner.emilkowal.ski/)** – Toast notifications
- **[Jest 30](https://jestjs.io/) + [Testing Library](https://testing-library.com/)** – Unit tests

## Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_TMDB_API_KEY` | Your TMDB API key (required) |

Get a free key at [themoviedb.org/settings/api](https://www.themoviedb.org/settings/api).
