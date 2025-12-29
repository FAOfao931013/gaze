/**
 * RSS Widget Fetcher
 * Fetches and parses RSS feeds at build time using rss-parser
 */

import Parser from 'rss-parser'
import type { WidgetFetcher } from '../../types/widget'
import type { RSSData, RSSItem, RSSWidgetConfig } from './types'

/**
 * RSS Widget Fetcher
 * Fetches RSS feed data at build time using rss-parser library
 */
export const rssFetcher: WidgetFetcher<RSSWidgetConfig, RSSData> = async (config) => {
  console.log(`[RSS Fetcher] Fetching feed: ${config.feedUrl}`)

  try {
    const parser = new Parser({
      headers: {
        'User-Agent': 'Gaze-Dashboard/1.0',
      },
    })

    const feed = await parser.parseURL(config.feedUrl)

    // Convert parsed feed to our data structure
    const items: RSSItem[] = feed.items.map((item) => {
      // Extract image from various RSS formats
      let imageUrl: string | undefined

      // Try enclosure (common in podcasts and media feeds)
      if (item.enclosure?.url && item.enclosure.type?.startsWith('image/')) {
        imageUrl = item.enclosure.url
      }

      // Try itunes:image (common in podcast feeds)
      if (!imageUrl && (item as any)['itunes:image']?.href) {
        imageUrl = (item as any)['itunes:image'].href
      }

      // Try media:content (common in YouTube and media RSS)
      if (!imageUrl && (item as any)['media:content']?.url) {
        imageUrl = (item as any)['media:content'].url
      }

      // Try media:thumbnail
      if (!imageUrl && (item as any)['media:thumbnail']?.url) {
        imageUrl = (item as any)['media:thumbnail'].url
      }

      return {
        title: item.title || 'Untitled',
        link: item.link || '#',
        pubDate: item.pubDate || item.isoDate || new Date().toISOString(),
        description: item.contentSnippet || item.content || undefined,
        image: imageUrl,
      }
    })

    // Apply limit if specified
    const limit = config.limit || 10
    const limitedItems = items.slice(0, limit)

    console.log(`[RSS Fetcher] Successfully fetched ${limitedItems.length} items`)

    return {
      feedTitle: feed.title || config.title || 'RSS Feed',
      items: limitedItems,
    }
  } catch (error) {
    console.error(`[RSS Fetcher] Failed to fetch ${config.feedUrl}:`, error)

    // Return fallback data
    return {
      feedTitle: config.title || 'RSS Feed',
      items: [],
    }
  }
}
