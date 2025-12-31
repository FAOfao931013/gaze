# Gaze Configuration Guide

Complete guide to configuring your Gaze Dashboard, including page layouts, column structures, and all available widgets with their parameters.

## Table of Contents

- [Quick Start](#quick-start)
- [Configuration File](#configuration-file)
- [Configuration Structure](#configuration-structure)
  - [Root Config (GazeConfig)](#root-config-gazeconfig)
  - [Page Configuration](#page-configuration)
  - [Column Configuration](#column-configuration)
- [Widget System](#widget-system)
  - [Common Widget Properties](#common-widget-properties)
  - [Layout Widgets](#layout-widgets)
  - [Content Widgets](#content-widgets)
- [Complete Examples](#complete-examples)
- [Best Practices](#best-practices)

---

## Quick Start

The main configuration file is located at **[src/config/gaze.ts](src/config/gaze.ts)**.

```typescript
import type { GazeConfig } from '../types/gaze'

export const gazeConfig = {
  pages: [
    {
      name: 'Home',
      width: 'wide',
      columns: [
        {
          size: 'small',
          widgets: [
            { type: 'weather', location: 'Shanghai' }
          ]
        },
        {
          size: 'full',
          widgets: [
            { type: 'hacker-news', limit: 15 }
          ]
        }
      ]
    }
  ]
} satisfies GazeConfig
```

---

## Configuration File

### Location

**File**: `src/config/gaze.ts`

This file defines your entire dashboard structure using a declarative configuration approach.

### Architecture Principles

- **Pure SSG**: All data fetched during build time (`bun run build` or `bun run dev`)
- **Zero Runtime Fetch**: No client-side API calls, fully static output
- **Type-Safe**: Full TypeScript support with IntelliSense
- **Concurrent Data Fetching**: Widgets fetch data in parallel (max 10 simultaneous requests)
- **Graceful Error Handling**: Failed widgets show error state without breaking the build

---

## Configuration Structure

### Hierarchy

```
GazeConfig
└── pages[]                    # Multiple pages
    ├── name                   # Page name (for navigation)
    ├── width                  # Desktop width preset
    ├── headWidgets[]          # Optional: Widgets spanning all columns
    └── columns[]              # Column layout
        ├── size               # Column width ('small' | 'full')
        └── widgets[]          # Widgets in this column
            ├── type           # Widget type
            ├── title          # Widget title
            └── ...            # Widget-specific parameters
```

---

## Root Config (GazeConfig)

### Type Definition

```typescript
interface GazeConfig {
  pages: Page[]  // Array of pages, first page is the homepage
}
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `pages` | `Page[]` | ✅ | Array of page configurations. First page becomes the homepage (`/`) |

### Example

```typescript
export const gazeConfig = {
  pages: [
    {
      name: 'Home',        // Homepage (/)
      columns: [...]
    },
    {
      name: 'Tech News',   // Second page (/tech-news)
      columns: [...]
    }
  ]
} satisfies GazeConfig
```

---

## Page Configuration

Each page represents a standalone dashboard view with its own layout and widgets.

### Type Definition

```typescript
interface Page {
  name: string           // Page display name
  slug?: string          // URL path (auto-generated from name if omitted)
  width?: WidthPreset    // Desktop max-width preset
  headWidgets?: Widget[] // Optional: Widgets at the top spanning all columns
  columns: Column[]      // Column layout (required)
}

type WidthPreset = 'slim' | 'default' | 'wide'
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `name` | `string` | ✅ | - | Page display name (used in navigation) |
| `slug` | `string` | ❌ | Generated from `name` | URL-friendly identifier (e.g., `tech-news`) |
| `width` | `'slim' \| 'default' \| 'wide'` | ❌ | `'default'` | Desktop maximum width preset |
| `headWidgets` | `Widget[]` | ❌ | - | Widgets displayed at page top, spanning all columns |
| `columns` | `Column[]` | ✅ | - | Column layout configuration (minimum 1 column) |

### Width Presets

| Preset | Width | Use Case |
|--------|-------|----------|
| `'slim'` | 1100px | Focused content, single or double column |
| `'default'` | 1600px | Standard layout, suitable for most cases |
| `'wide'` | 1920px | Widescreen, three-column or complex layouts |

### Column Layout Rules

- **Minimum**: 1 column
- **Maximum**: 3 columns
- **Required**: 1-2 `'full'` columns per page (takes remaining space)
- **Fixed width**: `'small'` columns are 300px
- **Recommended layouts**:
  - Single: `[{ size: 'full' }]`
  - Double: `[{ size: 'small' }, { size: 'full' }]`
  - Triple: `[{ size: 'small' }, { size: 'full' }, { size: 'small' }]`

### Example

```typescript
{
  name: 'Home',
  width: 'wide',           // 1920px widescreen
  headWidgets: [           // Top widgets spanning all columns
    {
      type: 'weather',
      location: 'Tokyo',
      hideHeader: true
    }
  ],
  columns: [
    {
      size: 'small',       // Left sidebar: 300px fixed
      widgets: [...]
    },
    {
      size: 'full',        // Main content: flex-1
      widgets: [...]
    },
    {
      size: 'small',       // Right sidebar: 300px fixed
      widgets: [...]
    }
  ]
}
```

---

## Column Configuration

Columns are vertical sections that organize widgets within a page.

### Type Definition

```typescript
interface Column {
  size: ColumnSize    // Column width type
  widgets?: Widget[]  // Widgets in this column
}

type ColumnSize = 'small' | 'full'
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `size` | `'small' \| 'full'` | ✅ | Column width type |
| `widgets` | `Widget[]` | ❌ | Array of widget configurations |

### Column Sizes

| Size | Width | Behavior | Use Case |
|------|-------|----------|----------|
| `'small'` | 300px (fixed) | Fixed width, does not scale | Sidebars, small widgets (weather, compact lists) |
| `'full'` | Flexible | `flex: 1`, takes remaining space | Main content area, large widgets |

### Responsive Behavior

- **Desktop (≥1024px)**: Displays as configured
- **Tablet (768px-1023px)**: Automatically merges to single column
- **Mobile (<768px)**: All columns stack vertically

### Example

```typescript
{
  columns: [
    // Left sidebar: 300px fixed
    {
      size: 'small',
      widgets: [
        { type: 'weather', location: 'London' },
        { type: 'rss', feedUrl: 'https://example.com/feed.xml', limit: 5 }
      ]
    },

    // Main content: takes remaining space
    {
      size: 'full',
      widgets: [
        { type: 'hacker-news', limit: 20 },
        { type: 'youtube', channels: ['...'], style: 'grid-cards' }
      ]
    }
  ]
}
```

---

## Widget System

All widgets in Gaze are configured using a unified interface. Each widget is a self-contained module with:
- **Component** (Astro): Renders the UI
- **Fetcher** (TypeScript): Fetches data during build
- **Types** (TypeScript): Configuration and data interfaces

### Architecture

**Registration** ([src/widgets/index.ts](src/widgets/index.ts)):
```typescript
registerWidget('weather', weatherWidget)
registerWidget('rss', rssWidget)
registerWidget('youtube', youtubeWidget)
registerWidget('hacker-news', hackerNewsWidget)
registerWidget('lobsters', lobstersWidget)
registerWidget('group', groupWidget)
registerWidget('split-column', splitColumnWidget)
```

**Data Flow**:
1. Build starts → `fetchPageWidgetData()` called
2. Widget fetchers run in parallel (max 10 concurrent)
3. Data returned as `Map<slug, WidgetProps>`
4. Widget components render with fetched data
5. Static HTML generated with embedded data

---

## Common Widget Properties

All widgets share these base properties:

```typescript
interface BaseWidget {
  type: string           // Widget type identifier (required)
  title?: string         // Widget title (displayed in header)
  slug?: string          // Unique identifier (auto-generated from title if omitted)
  hideHeader?: boolean   // Hide widget header bar (default: false)
}
```

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `type` | `string` | ✅ | - | Widget type identifier |
| `title` | `string` | ❌ | - | Display title in widget header |
| `slug` | `string` | ❌ | Generated from `title` | Unique identifier for the widget |
| `hideHeader` | `boolean` | ❌ | `false` | Whether to hide the widget header |

---

## Layout Widgets

Layout widgets are containers that organize other widgets. They don't fetch data themselves but orchestrate child widgets.

### Group Widget

Display multiple widgets with tab navigation.

**Type**: `'group'`
**Location**: [src/widgets/group/](src/widgets/group/)
**Frameless**: ✅ Yes (renders without glass container)

#### Configuration

```typescript
{
  type: 'group',
  widgets: BaseWidgetConfigUnion[], // Required: Child widget configs
  title?: string,                    // Optional: Widget title
  slug?: string,                     // Optional: Unique identifier
  hideHeader?: boolean               // Optional: Hide header
}
```

#### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `type` | `'group'` | ✅ | - | Widget type |
| `widgets` | `BaseWidgetConfigUnion[]` | ✅ | - | Array of child widgets (**no nested groups/split-columns**) |
| `title` | `string` | ❌ | - | Display title |
| `slug` | `string` | ❌ | Auto-generated | Unique identifier |
| `hideHeader` | `boolean` | ❌ | `false` | Hide header |

#### Features

- ✅ Tab-based navigation between widgets
- ✅ Parallel data fetching for all children
- ⚠️ **Restriction**: Only allows base widgets (weather, RSS, YouTube, Hacker News, Lobsters)
- ❌ **No nesting**: Cannot contain other group or split-column widgets

#### Data Structure

```typescript
interface GroupData {
  childWidgets: WidgetProps[]  // Fetched data for all child widgets
}
```

#### Example

```typescript
{
  type: 'group',
  title: 'Tech News',
  widgets: [
    {
      type: 'hacker-news',
      title: 'Hacker News',
      limit: 15,
      sortBy: 'top'
    },
    {
      type: 'lobsters',
      title: 'Lobsters',
      limit: 15,
      sortBy: 'hot'
    },
    {
      type: 'rss',
      title: 'Dev.to',
      feedUrl: 'https://dev.to/feed'
    }
  ]
}
```

---

### Split Column Widget

Place widgets side-by-side horizontally.

**Type**: `'split-column'`
**Location**: [src/widgets/split-column/](src/widgets/split-column/)
**Frameless**: ✅ Yes (renders without glass container)

#### Configuration

```typescript
{
  type: 'split-column',
  widgets: WidgetConfigUnion[],  // Required: Child widget configs
  maxColumns?: number,            // Optional: Max columns (default: 2, max: 5)
  title?: string,                 // Optional: Widget title
  slug?: string,                  // Optional: Unique identifier
  hideHeader?: boolean            // Optional: Hide header
}
```

#### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `type` | `'split-column'` | ✅ | - | Widget type |
| `widgets` | `WidgetConfigUnion[]` | ✅ | - | Array of child widgets (**supports nesting**) |
| `maxColumns` | `number` | ❌ | `2` | Maximum columns (1-5) |
| `title` | `string` | ❌ | - | Display title |
| `slug` | `string` | ❌ | Auto-generated | Unique identifier |
| `hideHeader` | `boolean` | ❌ | `false` | Hide header |

#### Features

- ✅ Responsive CSS Grid layout
- ✅ **Supports nesting**: Can contain other split-column and group widgets
- 📱 Automatically responsive: horizontal on desktop, stacked on mobile

#### Data Structure

```typescript
interface SplitColumnData {
  childWidgets: WidgetProps[]  // Fetched data for all child widgets
}
```

#### Example

```typescript
{
  type: 'split-column',
  maxColumns: 2,
  widgets: [
    {
      type: 'weather',
      location: 'London'
    },
    {
      type: 'hacker-news',
      limit: 10,
      collapseAfter: 5
    }
  ]
}
```

#### Nested Example

```typescript
{
  type: 'split-column',
  maxColumns: 3,
  widgets: [
    // Left: Weather
    { type: 'weather', location: 'Tokyo' },

    // Center: Nested split-column
    {
      type: 'split-column',
      maxColumns: 1,
      widgets: [
        { type: 'hacker-news', limit: 5 },
        { type: 'lobsters', limit: 5 }
      ]
    },

    // Right: Nested group
    {
      type: 'group',
      widgets: [
        { type: 'rss', feedUrl: 'https://feed1.com/rss' },
        { type: 'rss', feedUrl: 'https://feed2.com/rss' }
      ]
    }
  ]
}
```

---

## Content Widgets

Content widgets fetch and display external data during the build process.

### Weather Widget

Display current weather conditions and 24-hour forecast.

**Type**: `'weather'`
**Location**: [src/widgets/weather/](src/widgets/weather/)
**Data Source**: [Open-Meteo API](https://open-meteo.com/) (free, no API key required)

#### Configuration

```typescript
{
  type: 'weather',
  location: string,             // Required: Location name
  showAreaName?: boolean,       // Optional: Show administrative area
  hideLocation?: boolean,       // Optional: Hide location in footer
  hourFormat?: '12h' | '24h',   // Optional: Time format
  units?: 'metric' | 'imperial' // Optional: Temperature units
}
```

#### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `type` | `'weather'` | ✅ | - | Widget type |
| `location` | `string` | ✅ | - | Location name (e.g., "London", "New York, US", "Tokyo, Japan") |
| `showAreaName` | `boolean` | ❌ | `false` | Display administrative area name |
| `hideLocation` | `boolean` | ❌ | `false` | Hide location in footer |
| `hourFormat` | `'12h' \| '24h'` | ❌ | `'12h'` | Time label format |
| `units` | `'metric' \| 'imperial'` | ❌ | `'metric'` | Temperature units (°C or °F) |

#### Data Structure

```typescript
interface WeatherData {
  location: string               // Display name
  areaName?: string             // Administrative area (e.g., "California")
  temperature: number           // Current temperature
  apparentTemperature: number   // Feels-like temperature
  weatherCode: number           // WMO weather code
  condition: string             // Human-readable condition
  currentColumn: number         // Current 2-hour column index (0-11)
  sunriseColumn: number         // Sunrise column index
  sunsetColumn: number          // Sunset column index
  columns: WeatherColumn[]      // 12 columns for 24 hours (2-hour periods)
  timeLabels: string[]          // 12 time labels
}

interface WeatherColumn {
  temperature: number           // Average temperature for this period
  scale: number                 // Normalized scale 0-1 for bar height
  hasPrecipitation: boolean     // Precipitation probability > 75%
}
```

#### Example

```typescript
{
  type: 'weather',
  title: 'Tokyo Weather',
  location: 'Tokyo, Japan',
  hourFormat: '24h',
  units: 'metric',
  showAreaName: true
}
```

---

### RSS Widget

Fetch and display RSS/Atom feed content.

**Type**: `'rss'`
**Location**: [src/widgets/rss/](src/widgets/rss/)
**Data Source**: Any RSS or Atom feed URL

#### Configuration

```typescript
{
  type: 'rss',
  feedUrl: string,                                   // Required: RSS feed URL
  limit?: number,                                    // Optional: Max items
  collapseAfter?: number,                            // Optional: Items before "SHOW MORE"
  preserveOrder?: boolean,                           // Optional: Keep feed order
  singleLineTitles?: boolean,                        // Optional: Truncate titles
  style?: 'vertical-list' | 'detailed-list',         // Optional: Display style
  hideDate?: boolean,                                // Optional: Hide date
  descriptionField?: 'contentSnippet' | 'content' | 'summary' // Optional: Description source
}
```

#### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `type` | `'rss'` | ✅ | - | Widget type |
| `feedUrl` | `string` | ✅ | - | RSS/Atom feed URL |
| `limit` | `number` | ❌ | `10` | Maximum items to fetch |
| `collapseAfter` | `number` | ❌ | `5` | Items visible before "SHOW MORE" (-1 = never collapse) |
| `preserveOrder` | `boolean` | ❌ | `false` | Keep feed order instead of sorting by date |
| `singleLineTitles` | `boolean` | ❌ | `false` | Truncate titles to one line (vertical-list only) |
| `style` | `'vertical-list' \| 'detailed-list'` | ❌ | `'vertical-list'` | Display layout style |
| `hideDate` | `boolean` | ❌ | `false` | Hide date display |
| `descriptionField` | `'contentSnippet' \| 'content' \| 'summary'` | ❌ | `'contentSnippet'` | Field to use for description |

#### Styles

| Style | Description | Use Case |
|-------|-------------|----------|
| `'vertical-list'` | Compact list with clickable titles | Sidebars, small columns |
| `'detailed-list'` | Rich view with thumbnails, descriptions, metadata | Main content, large columns |

#### Data Structure

```typescript
interface RSSData {
  feedTitle: string
  items: RSSItem[]
}

interface RSSItem {
  title: string
  link: string
  pubDate: string
  description?: string
  image?: string       // Cover image URL
  author?: string
  categories?: string[]
}
```

#### Example

**Basic Configuration**:
```typescript
{
  type: 'rss',
  title: 'Rust Blog',
  feedUrl: 'https://blog.rust-lang.org/feed.xml',
  limit: 15,
  collapseAfter: 5,
  style: 'detailed-list'
}
```

**Advanced Configuration** (GitHub Trending):
```typescript
{
  type: 'rss',
  title: 'GitHub Trending',
  feedUrl: 'https://mshibanami.github.io/GitHubTrendingRSS/daily/all.xml',
  limit: 15,
  style: 'detailed-list',
  collapseAfter: 5,
  hideDate: true,              // Trending feeds don't have meaningful dates
  descriptionField: 'content'  // Use full content field
}
```

---

### YouTube Widget

Display recent videos from YouTube channels.

**Type**: `'youtube'`
**Location**: [src/widgets/youtube/](src/widgets/youtube/)
**Data Source**: YouTube RSS feeds (no API key required)

#### Configuration

```typescript
{
  type: 'youtube',
  channels: string[],                                          // Required: Channel IDs
  limit?: number,                                              // Optional: Max videos
  style?: 'horizontal-cards' | 'vertical-list' | 'grid-cards', // Optional: Display style
  collapseAfter?: number                                       // Optional: Videos before "SHOW MORE"
}
```

#### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `type` | `'youtube'` | ✅ | - | Widget type |
| `channels` | `string[]` | ✅ | - | Array of YouTube channel IDs |
| `limit` | `number` | ❌ | `8` | Maximum total videos (across all channels) |
| `style` | `'horizontal-cards' \| 'vertical-list' \| 'grid-cards'` | ❌ | `'horizontal-cards'` | Display layout |
| `collapseAfter` | `number` | ❌ | - | Videos before "SHOW MORE" (vertical-list & grid-cards only) |

#### Styles

| Style | Description | Use Case |
|-------|-------------|----------|
| `'horizontal-cards'` | Horizontal scrollable card layout | Full-width columns, horizontal browsing |
| `'vertical-list'` | Compact vertical list | Sidebars, small columns |
| `'grid-cards'` | Responsive grid of cards | Main content, large columns |

#### Finding Channel IDs

1. Visit the YouTube channel page
2. Click on the channel name or "About" tab
3. Look for URL: `youtube.com/channel/CHANNEL_ID` or `youtube.com/@username`
4. For `@username` URLs, view page source and search for `"channelId"`

#### Data Structure

```typescript
interface YouTubeData {
  videos: YouTubeVideo[]
}

interface YouTubeVideo {
  title: string
  videoId: string
  channelTitle: string
  thumbnail: string
  publishedAt: string
}
```

#### Example

```typescript
{
  type: 'youtube',
  title: 'Tech Videos',
  channels: [
    'UCXuqSBlHAE6Xw-yeJA0Tunw',  // Linus Tech Tips
    'UC0vBXGSyV14uvJ4hECDOl0Q',  // Fireship
    'UCbRP3c757lWg9M-U7TyEkXA'   // Theo - t3.gg
  ],
  limit: 12,
  style: 'grid-cards',
  collapseAfter: 6
}
```

---

### Hacker News Widget

Display top stories from Hacker News.

**Type**: `'hacker-news'`
**Location**: [src/widgets/hacker-news/](src/widgets/hacker-news/)
**Data Source**: [Hacker News Firebase API](https://github.com/HackerNews/API) (free, no API key required)

#### Configuration

```typescript
{
  type: 'hacker-news',
  limit?: number,               // Optional: Max posts
  collapseAfter?: number,       // Optional: Posts before "SHOW MORE"
  sortBy?: 'top' | 'new' | 'best',      // Optional: Sort order
  extraSortBy?: 'engagement',   // Optional: Extra sort by engagement
  commentsUrlTemplate?: string  // Optional: Custom comments URL
}
```

#### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `type` | `'hacker-news'` | ✅ | - | Widget type |
| `limit` | `number` | ❌ | `15` | Maximum posts to fetch |
| `collapseAfter` | `number` | ❌ | `5` | Posts before "SHOW MORE" (-1 = never collapse) |
| `sortBy` | `'top' \| 'new' \| 'best'` | ❌ | `'top'` | Primary sort order from HN API |
| `extraSortBy` | `'engagement'` | ❌ | - | Apply engagement sort (score + comments) after primary sort |
| `commentsUrlTemplate` | `string` | ❌ | `https://news.ycombinator.com/item?id={POST-ID}` | Comments URL template (use `{POST-ID}` placeholder) |

#### Data Structure

```typescript
interface HackerNewsData {
  stories: HackerNewsStory[]
}

interface HackerNewsStory {
  id: number
  title: string
  url: string
  commentsUrl: string
  domain: string
  score: number
  commentCount: number
  timePosted: string  // ISO date string
}
```

#### Example

**Basic Configuration**:
```typescript
{
  type: 'hacker-news',
  title: 'Hacker News',
  limit: 20,
  collapseAfter: 10,
  sortBy: 'top',
  extraSortBy: 'engagement'
}
```

**Custom Comments URL** (using third-party client):
```typescript
{
  type: 'hacker-news',
  limit: 15,
  commentsUrlTemplate: 'https://hckrnews.com/stories/{POST-ID}'
}
```

---

### Lobsters Widget

Display posts from Lobsters tech community.

**Type**: `'lobsters'`
**Location**: [src/widgets/lobsters/](src/widgets/lobsters/)
**Data Source**: [Lobsters API](https://lobste.rs/) (free, no API key required)

#### Configuration

```typescript
{
  type: 'lobsters',
  instanceUrl?: string,         // Optional: Lobsters instance URL
  customUrl?: string,           // Optional: Custom API URL
  limit?: number,               // Optional: Max posts
  collapseAfter?: number,       // Optional: Posts before "SHOW MORE"
  sortBy?: 'hot' | 'new',       // Optional: Sort order
  tags?: string[]               // Optional: Tag filter
}
```

#### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `type` | `'lobsters'` | ✅ | - | Widget type |
| `instanceUrl` | `string` | ❌ | `'https://lobste.rs/'` | Lobsters instance base URL |
| `customUrl` | `string` | ❌ | - | Custom API URL (overrides instanceUrl, sortBy, tags) |
| `limit` | `number` | ❌ | `15` | Maximum posts to fetch |
| `collapseAfter` | `number` | ❌ | `5` | Posts before "SHOW MORE" (-1 = never collapse) |
| `sortBy` | `'hot' \| 'new'` | ❌ | `'hot'` | Sort order |
| `tags` | `string[]` | ❌ | - | Filter by tags (e.g., `['rust', 'programming']`) |

#### Data Structure

```typescript
interface LobstersData {
  stories: LobstersStory[]
}

interface LobstersStory {
  title: string
  url: string
  commentsUrl: string
  domain: string
  score: number
  commentCount: number
  timePosted: string
  tags: string[]
}
```

#### Example

**Basic Configuration**:
```typescript
{
  type: 'lobsters',
  title: 'Lobsters',
  limit: 20,
  sortBy: 'hot',
  tags: ['rust', 'programming']
}
```

**Custom Instance**:
```typescript
{
  type: 'lobsters',
  instanceUrl: 'https://your-lobsters-instance.com/',
  sortBy: 'new'
}
```

**Advanced Custom URL**:
```typescript
{
  type: 'lobsters',
  customUrl: 'https://lobste.rs/t/security.json',
  limit: 10
}
```

---

## Complete Examples

### Example 1: Three-Column Layout

```typescript
import type { GazeConfig } from '../types/gaze'

export const gazeConfig = {
  pages: [
    {
      name: 'Home',
      width: 'wide',  // 1920px widescreen
      columns: [
        // Left sidebar: 300px fixed
        {
          size: 'small',
          widgets: [
            {
              type: 'rss',
              title: 'GitHub Trending',
              feedUrl: 'https://mshibanami.github.io/GitHubTrendingRSS/daily/all.xml',
              limit: 15,
              style: 'detailed-list',
              collapseAfter: 5,
              hideDate: true,
              descriptionField: 'content'
            },
            {
              type: 'rss',
              title: 'Product Hunt',
              feedUrl: 'https://www.producthunt.com/feed',
              limit: 10,
              style: 'detailed-list',
              collapseAfter: 5
            }
          ]
        },

        // Main content: takes remaining space
        {
          size: 'full',
          widgets: [
            // Group: Hacker News & Lobsters
            {
              type: 'group',
              widgets: [
                {
                  type: 'hacker-news',
                  title: 'Hacker News',
                  limit: 15,
                  collapseAfter: 5,
                  sortBy: 'top',
                  extraSortBy: 'engagement'
                },
                {
                  type: 'lobsters',
                  title: 'Lobsters',
                  limit: 15,
                  sortBy: 'hot',
                  collapseAfter: 5
                }
              ]
            },

            // YouTube horizontal scroll
            {
              type: 'youtube',
              title: 'Tech Videos',
              channels: [
                'UCXuqSBlHAE6Xw-yeJA0Tunw',
                'UC0vBXGSyV14uvJ4hECDOl0Q'
              ],
              limit: 20,
              style: 'horizontal-cards'
            },

            // Group: Tech blogs
            {
              type: 'group',
              widgets: [
                {
                  type: 'rss',
                  title: 'Rust Blog',
                  feedUrl: 'https://blog.rust-lang.org/feed.xml',
                  limit: 10,
                  style: 'detailed-list'
                },
                {
                  type: 'rss',
                  title: 'Go Blog',
                  feedUrl: 'https://go.dev/blog/feed.atom',
                  limit: 10,
                  style: 'detailed-list'
                }
              ]
            }
          ]
        },

        // Right sidebar: 300px fixed
        {
          size: 'small',
          widgets: [
            {
              type: 'weather',
              title: 'Weather',
              location: 'Shanghai',
              hourFormat: '24h',
              units: 'metric'
            },
            {
              type: 'rss',
              title: 'Podcasts',
              feedUrl: 'https://changelog.com/podcast/feed',
              limit: 10,
              style: 'vertical-list',
              collapseAfter: 5
            }
          ]
        }
      ]
    }
  ]
} satisfies GazeConfig
```

---

### Example 2: Multi-Page Configuration

```typescript
export const gazeConfig = {
  pages: [
    // Homepage: Mixed content
    {
      name: 'Home',
      width: 'default',
      columns: [
        {
          size: 'full',
          widgets: [
            {
              type: 'split-column',
              maxColumns: 2,
              widgets: [
                { type: 'weather', location: 'Tokyo' },
                { type: 'hacker-news', limit: 10 }
              ]
            }
          ]
        }
      ]
    },

    // Videos page
    {
      name: 'Videos',
      slug: 'videos',
      width: 'wide',
      columns: [
        {
          size: 'full',
          widgets: [
            {
              type: 'youtube',
              title: 'Tech Channels',
              channels: ['UCXuqSBlHAE6Xw-yeJA0Tunw'],
              limit: 24,
              style: 'grid-cards',
              collapseAfter: 12
            }
          ]
        }
      ]
    },

    // RSS feeds page
    {
      name: 'Feeds',
      slug: 'feeds',
      width: 'slim',
      columns: [
        {
          size: 'full',
          widgets: [
            {
              type: 'group',
              widgets: [
                { type: 'rss', title: 'Feed 1', feedUrl: 'https://feed1.com/rss' },
                { type: 'rss', title: 'Feed 2', feedUrl: 'https://feed2.com/rss' },
                { type: 'rss', title: 'Feed 3', feedUrl: 'https://feed3.com/rss' }
              ]
            }
          ]
        }
      ]
    }
  ]
} satisfies GazeConfig
```

---

### Example 3: Complex Nested Layout

```typescript
{
  name: 'Complex Layout',
  width: 'wide',
  headWidgets: [
    // Top widget spanning all columns
    {
      type: 'weather',
      location: 'San Francisco',
      hideHeader: true
    }
  ],
  columns: [
    {
      size: 'full',
      widgets: [
        {
          type: 'split-column',
          maxColumns: 3,
          widgets: [
            // Left: Hacker News
            {
              type: 'hacker-news',
              limit: 10,
              collapseAfter: 5
            },

            // Center: Nested split-column
            {
              type: 'split-column',
              maxColumns: 1,
              widgets: [
                { type: 'lobsters', limit: 5 },
                { type: 'rss', feedUrl: 'https://example.com/feed.xml', limit: 5 }
              ]
            },

            // Right: Nested group
            {
              type: 'group',
              widgets: [
                {
                  type: 'youtube',
                  channels: ['UCXuqSBlHAE6Xw-yeJA0Tunw'],
                  limit: 6
                },
                {
                  type: 'rss',
                  feedUrl: 'https://blog.rust-lang.org/feed.xml'
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

---

## Best Practices

### Performance Optimization

1. **Set reasonable limits**: Use `limit` based on actual needs to avoid fetching excessive data
2. **Use `collapseAfter`**: Reduce initial render size for faster page loads
3. **Concurrent fetching**: System automatically limits to 10 parallel requests

### Data Freshness

- **Auto-rebuild schedule**: Configure in [.github/workflows/deploy.yml](.github/workflows/deploy.yml)
- **Default**: Rebuilds every 6 hours
- **Customize**: Adjust `cron` expression based on your data update frequency needs

Common schedules:
- Every hour: `'0 * * * *'`
- Every 3 hours: `'0 */3 * * *'`
- Every 12 hours: `'0 */12 * * *'`
- Daily at midnight UTC: `'0 0 * * *'`

Learn more at [crontab.guru](https://crontab.guru/).

### Responsive Design

- Use `'small'` columns for sidebars (weather, compact lists)
- Use `'full'` columns for main content (news, videos)
- Mobile automatically stacks columns vertically
- Test on desktop, tablet, and mobile viewports

### Error Handling

- Failed widget fetches display error state
- Build process continues even if some widgets fail
- Check build logs for detailed error messages
- Verify feed URLs and API endpoints are accessible

### Type Safety

- Always use `satisfies GazeConfig` for type checking
- Enable TypeScript strict mode for better error detection
- Leverage IntelliSense for widget parameter autocomplete

---

## Related Documentation

- **[Widget Development Guide](src/widgets/README.md)** - How to create custom widgets
- **[Project Setup](README.md)** - Installation, development, and deployment
- **[Architecture Details](CLAUDE.md)** - Technical architecture and design patterns

---

## Need Help?

- **Report Issues**: [GitHub Issues](https://github.com/anthropics/claude-code/issues)
- **Configuration Reference**: [src/config/gaze.ts](src/config/gaze.ts)
- **Type Definitions**: [src/types/gaze.ts](src/types/gaze.ts)
