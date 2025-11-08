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

The application will be available at `http://localhost:3000` with hot module replacement enabled.

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

## 📚 Documentation

- `docs/arquitectura.md` – Architecture guidelines (Spanish)
- `docs/plan-de-proyecto.md` – Project roadmap (Spanish)
- `CHANGELOG.md` – Version history and release notes

## 🏗️ Technical Stack

- **React 19** - UI library
- **TypeScript** - Static type checking
- **Webpack 5** - Module bundler and dev server
- **ESLint 9** - Linting (TypeScript + React + Prettier)
- **Prettier** - Code formatting
- **Jest + React Testing Library** - Unit testing framework with ts-jest and jsdom
- **CSS (native)** - Styling (no frameworks)
