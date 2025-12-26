# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Gaze is a **Pure SSG Dashboard** (Static Site Generator) following the Glance-like architecture. The critical architectural constraint is **zero runtime fetch** - all data must be fetched during the CI/CD build process, not at runtime.

## Core Architecture: Build-Time Data Pipeline

The application follows a strict build-time data flow:

1. **Data Harvest** (`scripts/harvest.ts`) - Bun script fetches from APIs
2. **Validation** - Valibot validates the fetched data
3. **Storage** - Data saved as JSON to `src/content/dashboard/`
4. **Ingestion** - Astro Content Collections reads JSON during build
5. **Static Output** - Pure HTML/CSS/JS with no runtime API calls

This means:
- Never add `fetch()` calls in React components or Astro pages
- All dynamic data must go through the harvest script
- The build process depends on running `bun run harvest` first

## Development Commands

### Essential Workflow
```bash
# Install dependencies (requires Bun runtime)
bun install

# Fetch data from APIs (required before build)
bun run harvest

# Development server
bun run dev

# Production build (includes TypeScript checking)
bun run build

# Preview production build
bun run preview
```

### Code Quality
```bash
# Check only (no fixes)
bun run lint

# Format files
bun run format

# Check and auto-fix
bun run check
```

## Tech Stack Configuration

### Tailwind CSS v4 (Oxide Engine)
- **NO** `@astrojs/tailwind` integration (removed due to v4 incompatibility)
- Uses `@tailwindcss/postcss` directly via PostCSS
- Configuration: `postcss.config.cjs` + `tailwind.config.ts`
- **Important**: Do not use `@apply` with custom CSS variables in v4 - use inline styles or regular CSS instead
- Global styles use CSS variables defined in `:root` without `@layer` directives

### Astro + React Islands
- React components use `client:load` directive for interactivity
- Framer Motion must be in `vite.ssr.noExternal` (already configured)
- Vite CSS transformer set to `postcss` (required for Tailwind v4)

### Code Quality with Biome
- Biome handles both linting and formatting (no ESLint/Prettier)
- Config: `biome.json`
- Enforces single quotes, trailing commas, 2-space indentation

## Adding New Data Sources

To add a new API data source, edit `scripts/harvest.ts`:

```typescript
// 1. Add to DATA_SOURCES configuration
const DATA_SOURCES: Record<string, DataSourceConfig> = {
  myNewSource: {
    url: 'https://api.example.com/endpoint',
    headers: {
      'Authorization': `Bearer ${process.env.MY_API_TOKEN}`,
    },
  },
};

// 2. Add environment variable to .env
// MY_API_TOKEN=your_token_here

// 3. The script automatically fetches, validates, and saves to:
// src/content/dashboard/data.json
```

The harvest script:
- Handles multiple data sources in parallel
- Uses Valibot for schema validation
- Continues on individual source failures
- Creates placeholder data if no sources configured

## Content Collections Schema

Located in `src/content/config.ts`:
- Collection name: `dashboard`
- Type: `data` (JSON files, not markdown)
- Schema: `{ timestamp: string, data: Record<string, unknown> }`

To access in Astro pages:
```typescript
import { getCollection } from 'astro:content';
const dashboardEntries = await getCollection('dashboard');
const data = dashboardEntries[0]?.data;
```

## Design System

### Theme
- Dark mode only (no light mode toggle)
- Glassmorphism effects via `.glass` and `.glass-dark` utility classes
- CSS variables for colors in `src/styles/globals.css`

### Layout Pattern: Bento Grid
- Component: `src/components/BentoGrid.tsx`
- Responsive CSS Grid (1 col mobile → 2 col tablet → 4 col desktop)
- Cards support span props: `sm` (1 col), `md` (2 col), `lg` (3 col), `full` (4 col)
- All cards have Framer Motion entrance animations

### Styling Guidelines
- Use Tailwind utilities for spacing, typography, colors
- Use `.glass` for glassmorphism cards
- Color palette via CSS variables (e.g., `hsl(var(--background))`)
- Animations via Framer Motion, not CSS transitions

## Common Pitfalls

1. **Don't use @astrojs/tailwind** - The integration is incompatible with Tailwind v4. PostCSS is configured directly.

2. **Always run harvest before build** - The build will fail if `src/content/dashboard/data.json` is missing or stale.

3. **TypeScript in harvest script** - Use `DataSourceConfig` interface for type safety when adding sources.

4. **React component hydration** - Interactive components need `client:load` directive in Astro files.

5. **Environment variables** - Use `.env` for local development (copy from `.env.example`). CI/CD needs secrets configured.

## CI/CD Considerations

GitHub Actions workflow should:
1. Install Bun
2. Run `bun install`
3. Run `bun run harvest` with environment secrets
4. Run `bun run build`
5. Deploy `dist/` directory

The harvest script should run on a cron schedule (e.g., every 6 hours) to refresh data.
