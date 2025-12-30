/**
 * YouTube Widget Export
 * Combines component and fetcher into a widget definition
 */

import type { WidgetDefinition } from '../../types/widget'
import YouTubeWidget from './YouTubeWidget.astro'
import { youtubeFetcher } from './fetcher'
import type { YouTubeData, YouTubeWidgetConfig } from './types'

export const youtubeWidget: WidgetDefinition<YouTubeWidgetConfig, YouTubeData> = {
  component: YouTubeWidget,
  fetcher: youtubeFetcher,
}

export type { YouTubeWidgetConfig, YouTubeData, YouTubeVideo } from './types'
