/**
 * YouTube Widget Type Definitions
 */

import type { WidgetConfig } from '../../types/widget'

/**
 * YouTube Widget Configuration
 */
export interface YouTubeWidgetConfig extends WidgetConfig {
  type: 'youtube'
  channels: string[] // Array of YouTube channel IDs
  limit?: number // Maximum number of total videos to display (default: 8)
}

/**
 * YouTube Video Item
 */
export interface YouTubeVideo {
  title: string
  videoId: string
  channelTitle: string
  thumbnail: string
  publishedAt: string
}

/**
 * YouTube Widget Data Structure
 */
export interface YouTubeData {
  videos: YouTubeVideo[]
}
