# Gaze Dashboard

A Glance-like SSG (Static Site Generator) Dashboard built with Astro, React, and Tailwind CSS v4.

## Architecture

**Pure SSG (Snapshot Model)** - Zero runtime fetch architecture:
- All data is fetched during CI/CD build process
- No client-side API calls
- Data is validated via Valibot and stored as static JSON files
- Astro Content Collections ingest the data for build

## Tech Stack

- **Core**: Astro (latest), React (Islands), TypeScript
- **Styling**: Tailwind CSS v4 (Oxide engine), Framer Motion
- **UI**: shadcn/ui, Magic UI, Lucide React icons
- **Layout**: CSS Grid-based Bento Grid (responsive)
- **Tooling**: Biome (Lint/Format), Bun (Runtime & Scripting)

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) (latest version)

### Installation

```bash
# Install dependencies
bun install

# Run data harvest script
bun run harvest

# Start development server
bun run dev

# Build for production
bun run build

# Preview production build
bun run preview
```

### Deployment

See the [Deployment Guide](docs/DEPLOYMENT.md) for instructions on deploying to GitHub Pages.

## Data Harvesting

The project uses a **data harvest script** (`scripts/harvest.ts`) to fetch data from APIs:

1. Configure your data sources in `scripts/harvest.ts`
2. Add environment variables for API tokens (if needed)
3. Run `bun run harvest` to fetch and validate data
4. Data is saved to `src/content/dashboard/data.json`
5. Astro Content Collections automatically ingest the data during build

### Example Data Source Configuration

```typescript
// In scripts/harvest.ts
const DATA_SOURCES = {
  github: {
    url: 'https://api.github.com/repos/owner/repo',
    headers: {
      'Authorization': `token ${process.env.GITHUB_TOKEN}`,
    },
  },
};
```

## Project Structure

```
gaze/
├── src/
│   ├── components/     # React components
│   ├── content/        # Data files (Content Collections)
│   │   └── dashboard/  # Dashboard data JSON files
│   ├── layouts/        # Astro layouts
│   ├── pages/          # Astro pages
│   └── styles/         # Global styles
├── scripts/
│   └── harvest.ts      # Data fetching script
├── public/             # Static assets
└── astro.config.mjs    # Astro configuration
```

## Design Theme

- **Dark Mode** by default
- **Glassmorphism** effect (blur, subtle borders)
- **Instant load** (static HTML)
- **Animated transitions** via Framer Motion

## Development

### Linting & Formatting

```bash
# Check code quality
bun run lint

# Format code
bun run format

# Check and fix
bun run check
```

## CI/CD Integration

Set up GitHub Actions to run the harvest script on a schedule:

```yaml
# .github/workflows/build.yml
name: Build Dashboard

on:
  schedule:
    - cron: '0 */6 * * *'  # Every 6 hours
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v1
      - run: bun install
      - run: bun run harvest
        env:
          # Add your API tokens here
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      - run: bun run build
      - # Deploy step here
```

## License

MIT
