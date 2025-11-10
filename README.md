# Inditex Technical Test

Technical Test for Inditex - Music Podcast Mini-Application

## 📋 Project Description

A Single Page Application (SPA) for browsing and listening to music podcasts, built with React 19, TypeScript, and Webpack from scratch.

## 🙌 Project Author

- Francisco Jiménez García

## 🚦 Current Status

- ✅ npm project initialised
- ✅ React 19 + TypeScript configured
- ✅ Webpack dev & prod build ready
- ✅ Base React entry point rendering
- ✅ ESLint 9 + Prettier configured with project scripts
- ✅ Husky pre-commit hook running lint and format checks
- ✅ Commitlint commit-msg hook enforcing Conventional Commits
- ✅ Initial feature-based architecture scaffold with shared header shell
- ✅ Jest + React Testing Library configured for unit tests

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation

```bash
# Install dependencies
npm install

# (First time after cloning) install Husky hooks
npm run prepare
```

### Development Mode

```bash
npm run dev
```

The application will be available at `http://localhost:5173` with hot module replacement enabled.

### Production Build

```bash
npm run build
```

The output bundle will be generated in the `dist/` directory.

## 📦 Available Commands

| Command                 | Description                                 |
| ----------------------- | ------------------------------------------- |
| `npm install`           | Install project dependencies                |
| `npm run dev`           | Start development server (Webpack HMR)      |
| `npm run build`         | Build production bundle                     |
| `npm run lint`          | Run ESLint over the TypeScript/React source |
| `npm run lint:fix`      | Fix lint issues automatically               |
| `npm run format`        | Format code with Prettier                   |
| `npm run format:check`  | Check formatting without writing changes    |
| `npm run prepare`       | Install Husky git hooks                     |
| `npm run test`          | Run Jest test suite                         |
| `npm run test:watch`    | Run Jest in watch mode                      |
| `npm run test:coverage` | Run Jest with coverage reports              |
| `npm run test:e2e`      | Run Cypress end-to-end tests headlessly     |

## 📚 Documentation

- CHANGELOG.md – Version history and release notes
- Commit message convention – Conventional Commits enforced via Commitlint

## 🏷️ Release Tags

| Tag                      | Summary                                                                                                |
| ------------------------ | ------------------------------------------------------------------------------------------------------ |
| `v0.5.0-cache`           | SWR data layer with persistent localStorage cache and 24h expiration.                                  |
| `v0.4.2-feed-resilience` | Feed summary fallbacks, direct RSS retry logic, navigation refinements, and centralized error logging. |
| `v0.4.1-network`         | HTTP client fallback improvements, loading state hook coverage, and consolidated styles entry.         |
| `v0.4.0-podcast-detail`  | Podcast detail and episode views, episode mapper refactor, and feature tests.                          |
| `v0.3.1-loading-spinner` | Global loading provider with header spinner and supporting tests.                                      |
| `v0.3.0-main-view`       | Podcasts main catalogue flow with routing and testing.                                                 |
| `v0.2.1-routing`         | Client-side routing shell with placeholder pages.                                                      |
| `v0.2.0-architecture`    | Feature-based hexagonal scaffold with documented proposal.                                             |
| `v0.1.1-tooling-update`  | Jest, RTL, and documentation for project tooling.                                                      |
| `v0.1.0-setup`           | Initial setup with Webpack, TypeScript, and Husky.                                                     |

## 🏗️ Technical Stack

- **React 19** - UI library
- **TypeScript** - Static type checking
- **Webpack 5** - Module bundler and dev server
- **ESLint 9** - Linting (TypeScript + React + Prettier)
- **Prettier** - Code formatting
- **SWR 2** - Declarative data fetching with revalidation control
- **Jest + React Testing Library** - Unit testing framework with ts-jest and jsdom
- **Cypress** - End-to-end testing (specs in `src/tests/__e2e__/`)
- **CSS (native)** - Styling (no frameworks)

## 🔄 Data Fetching & Cache Strategy

- **SWR hooks:** `useTopPodcasts` and `usePodcastDetail` consume application use cases through SWR, exposing loading states while benefiting from request deduplication.
- **Cache adapters:** `PodcastCache` serialises podcasts and episode details via the shared `LocalStorageCache`, storing timestamps and TTL metadata.
- **24-hour expiry:** Cached entries persist between sessions but are invalidated automatically once the 24-hour window elapses, triggering a fresh SWR revalidation.
- **Persistent provider:** `SWRProvider` initialises a shared cache map, syncs it with `localStorage` on unload, and disables focus/reconnect revalidations to honour the custom TTL policy.
- **Hexagonal compliance:** Domain entities remain pure TypeScript models; infrastructure adapters encapsulate persistence and fetching details, and presentation hooks only orchestrate use cases.

## 🏗️ Project Folder Scaffold

```
src/
├─ app/       # Minimal React shell (App.tsx, future router/providers)
├─ core/      # Domain-level interfaces and abstractions (ports)
├─ shared/    # Reusable implementations and UI components (adapters)
├─ features/  # Business modules following hexagonal layers
└─ styles/    # Global CSS assets (reset, variables, layout)
```

- `app/` mounts the application and wires global providers.
- `core/` defines contracts that domain/application code depend on.
- `shared/` holds infrastructure adapters and shared presentation building blocks.
- `features/` encapsulates each feature with domain/application/infrastructure/presentation slices.
- `styles/` centralises global styling applied at bootstrap.
