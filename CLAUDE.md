# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Nuxt Dashboard Template — a multi-page admin dashboard built with Nuxt 4, Nuxt UI v4, Tailwind CSS v4, and Vue 3. Uses pnpm as the package manager.

## Commands

- **Dev server:** `pnpm dev` (http://localhost:3000)
- **Build:** `pnpm build`
- **Preview production:** `pnpm preview`
- **Lint:** `pnpm lint`
- **Typecheck:** `pnpm typecheck`
- **Prepare types:** `pnpm postinstall` (runs `nuxt prepare` automatically)

## Architecture

### Stack
- **Nuxt 4** with `app/` directory structure (not root `pages/`/`components/`)
- **Nuxt UI v4** — provides all dashboard layout primitives (`UDashboardGroup`, `UDashboardSidebar`, `UDashboardPanel`, `UDashboardNavbar`, etc.)
- **Tailwind CSS v4** — uses `@theme static` in `app/assets/css/main.css` for custom design tokens
- **Pinia** via `@pinia/nuxt` for state management (no stores defined yet)
- **TanStack Table** for the customers data table
- **Unovis** (`@unovis/vue`) for charting (revenue line/area chart)
- **date-fns** for date manipulation
- **Zod** for schema validation
- **VueUse** (`@vueuse/core`, `@vueuse/nuxt`) for composable utilities

### Key Modules (nuxt.config.ts)
`@nuxt/eslint`, `@nuxt/ui`, `@vueuse/nuxt`, `@pinia/nuxt`

### Directory Layout
- `app/pages/` — file-based routing. Settings uses nested routes under `settings.vue` (layout wrapper) with `settings/index.vue`, `settings/members.vue`, etc.
- `app/components/` — organized by page domain: `home/`, `inbox/`, `customers/`, `settings/`
- `app/components/home/HomeChart.client.vue` / `HomeChart.server.vue` — dual-component pattern for SSR/client hydration of charts
- `app/composables/useDashboard.ts` — shared composable (via `createSharedComposable`) managing global dashboard state (notifications slideover, keyboard shortcuts)
- `app/types/index.d.ts` — shared TypeScript types (`User`, `Mail`, `Member`, `Sale`, `Notification`, `Period`, `Range`)
- `app/utils/index.ts` — utility functions
- `app/layouts/default.vue` — main dashboard layout with collapsible sidebar, search, and navigation
- `app/app.config.ts` — Nuxt UI theme config (primary: green, neutral: zinc)
- `server/api/` — mock API endpoints returning hardcoded data (`customers.ts`, `mails.ts`, `notifications.ts`, `members.ts`)

### Styling
Custom green color palette defined in `app/assets/css/main.css` using Tailwind v4's `@theme static` syntax. The font is Public Sans.

### Keyboard Shortcuts
Defined in `useDashboard.ts`: `g+h` (Home), `g+i` (Inbox), `g+c` (Customers), `g+s` (Settings), `n` (toggle notifications).

## Code Style

- ESLint with Nuxt preset + stylistic rules: no trailing commas (`commaDangle: 'never'`), 1tbs brace style
- Vue template max 3 attributes per line on single line, unlimited on multiline
- `vue/no-multiple-template-root` is off (Nuxt handles this)
