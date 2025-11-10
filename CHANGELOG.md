# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- _No entries._

### Changed

- _No entries._

## [v0.5.0-cache] - 2025-11-10

### Added

- `SWRProvider` wrapping the application to persist the SWR cache across sessions.
- Shared `LocalStorageCache` adapter and `PodcastCache` infrastructure module with 24h TTL constants.
- SWR-powered `useTopPodcasts` and `usePodcastDetail` hooks, including their updated test harnesses.

### Changed

- Documentation describing the SWR + localStorage caching strategy and new release tag.

## [v0.4.1-network] - 2025-11-10

### Added

- Unit tests for the shared loading state hook including initial-loading scenarios.
- Aggregated stylesheet entry point (`styles/index.css`) simplifying global imports.

### Changed

- HTTP client now retries via AllOrigins only when the direct request fails, with a unified timeout helper.
- Development server port aligned with iTunes CORS headers (`5173`).

## [v0.4.0-podcast-detail] - 2025-11-09

### Added

- Podcast detail and episode views with shared sidebar navigation and audio playback.
- Episode mapper extracted with dedicated tests ensuring consistent IDs and metadata.

### Changed

- iTunes client/http client interactions refactored to support detail lookups and proxy fallback.

## [v0.3.0-main-view] - 2025-11-09

### Added

- Centralised configuration layer (`@config`) and relocation of `AppRouter` to `src/core/router`.
- Podcast catalogue domain building blocks: `Podcast` entity, repository port, `GetTopPodcasts` use case, HTTP client, and iTunes repository adapter.
- Presentation flow for the podcasts feature, including `PodcastCard`, `PodcastList`, `EpisodeList`, and feature pages with data fetching hook.
- React Testing Library coverage for the podcasts presentation components and shared `Header`.

### Changed

- Global and reset CSS normalised to match project formatting conventions.
- `CHANGELOG.md` expanded with the podcasts release notes.

## [v0.2.1-routing] - 2025-11-08

### Added

- React Router shell (`AppRouter`) wiring the header and placeholder feature pages.
- Placeholder podcast pages co-located with their tests, including episode and podcast detail views.
- Jest setup polyfills (`TextEncoder`/`TextDecoder`) enabling React Router testing.

### Changed

- Layout container renamed to `app-container` with updated global styling.
- Webpack/TypeScript/Jest aliases consolidated under `@podcasts`, `@app`, and shared paths.

### Removed

- Legacy scaffolding files and obsolete test locations replaced by the new structure.

## [v0.2.0-architecture] - 2025-11-08

### Added

- Feature-based folder structure aligned with the hexagonal/DDD proposal for podcasts.
- Documentation in `docs/ESTRUCTURA_FINAL.md` outlining the selected architecture.
- `.gitignore` updates preventing accidental commits of AI-related assets.

### Changed

- Refined project tree to group `app`, `core`, `shared`, `features`, and `styles` at the same depth.
- Updated README with architecture overview and evolution plan.

### Removed

- `.keep` placeholders within feature directories after scaffolding.

## [v0.1.3-commitlint] - 2025-11-07

### Added

- Commitlint configuration enforcing Conventional Commits via Husky `commit-msg` hook.
- Documentation updates describing the commit message policy.

### Changed

- Husky pipeline extended to run Commitlint during commit workflow.

## [v0.1.2-docs-update] - 2025-11-07

### Added

- Documentation refresh covering setup steps, project goals, and reviewer roadmap in `docs/`.
- README updates reflecting project status and author information.

### Changed

- Consolidated documentation to ensure English README and Spanish docs, per project rules.

## [v0.1.1-tooling-update] - 2025-11-08

### Added

- Documented linting, formatting, and testing commands in `README.md`.
- Jest configuration (`jest.config.ts`, `jest.setup.ts`) and sample test using React Testing Library.

### Changed

- `package.json`: Added Jest scripts, linting, and formatting tooling.
- `tsconfig.json`: Included Jest and Testing Library type definitions.

## [v0.1.0-setup] - 2025-11-08

### Added

- Initial Webpack configuration (development and production).
- TypeScript configuration with strict settings.
- React 19 entry point rendering a base application shell.
- ESLint + Prettier tooling and Husky pre-commit hook.
