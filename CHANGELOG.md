# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Commitlint configuration with Husky `commit-msg` hook enforcing Conventional Commits.
- _Pending entries_

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
