# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Centralised configuration layer (`@config`) and relocated `AppRouter` under `src/core`.
- Podcast catalogue domain building blocks: `Podcast` entity, repository port, `GetTopPodcasts` use case, HTTP client, and iTunes repository adapter.
- Presentation flow for the podcasts feature, including `PodcastCard`, `PodcastList`, `EpisodeList`, and routing pages.
- React Testing Library coverage for the podcasts presentation layer and shared header component.

### Changed

- Global and reset styles reformatted for consistency with project formatting rules.

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
