/**
 * Split Column Widget Fetcher
 * Fetches data for all child widgets during build time
 */

import pLimit from 'p-limit'
import { fetchWidgetData } from '../../lib/widgetData'
import type { WidgetFetcher } from '../../types/widget'
import type { SplitColumnData, SplitColumnWidgetConfigBase } from './types'

// Concurrency limit for child widget fetching
const CONCURRENCY = 10

export const splitColumnFetcher: WidgetFetcher<
  SplitColumnWidgetConfigBase,
  SplitColumnData
> = async (config) => {
  const childWidgets = config.widgets || []

  if (childWidgets.length === 0) {
    console.warn('[SplitColumn Fetcher] No child widgets configured')
    return { childWidgets: [] }
  }

  console.log(`[SplitColumn Fetcher] Fetching data for ${childWidgets.length} child widgets...`)

  const limit = pLimit(CONCURRENCY)

  // Fetch all child widgets in parallel with concurrency control
  const fetchPromises = childWidgets.map((childConfig, index) =>
    limit(async () => {
      try {
        const props = await fetchWidgetData(childConfig)
        return { index, props }
      } catch (error) {
        console.error(`[SplitColumn Fetcher] Failed to fetch child widget ${index}:`, error)
        return {
          index,
          props: {
            config: childConfig,
            error: true,
          },
        }
      }
    }),
  )

  const results = await Promise.all(fetchPromises)

  // Sort by original index to maintain order
  results.sort((a, b) => a.index - b.index)

  console.log(`[SplitColumn Fetcher] Fetched ${results.length} child widgets`)

  return {
    childWidgets: results.map((r) => r.props),
  }
}
