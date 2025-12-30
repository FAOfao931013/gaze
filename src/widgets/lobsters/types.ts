/**
 * Lobsters Widget Type Definitions
 */

import type { WidgetConfig } from '../../types/widget'

/**
 * Lobsters Widget Configuration
 */
export interface LobstersWidgetConfig extends WidgetConfig {
  type: 'lobsters'
  instanceUrl?: string // Base URL for lobsters instance (default: https://lobste.rs/)
  customUrl?: string // Custom URL to retrieve posts from (overrides instanceUrl, sortBy, tags)
  limit?: number // Maximum number of posts to show (default: 15)
  collapseAfter?: number // How many posts visible before "SHOW MORE" button (default: 5, -1 to never collapse)
  sortBy?: 'hot' | 'new' // Sort order for posts (default: hot)
  tags?: string[] // Filter posts by tags
}

/**
 * Lobsters Post/Story
 */
export interface LobstersStory {
  title: string
  url: string
  commentsUrl: string
  domain: string
  score: number
  commentCount: number
  timePosted: string
  tags: string[]
}

/**
 * Lobsters Data Structure
 */
export interface LobstersData {
  stories: LobstersStory[]
}
