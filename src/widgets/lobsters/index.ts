/**
 * Lobsters Widget
 * Exports widget definition for registration
 */

import type { WidgetDefinition } from '../../types/widget'
import LobstersWidget from './LobstersWidget.astro'
import { lobstersFetcher } from './fetcher'
import type { LobstersData, LobstersStory, LobstersWidgetConfig } from './types'

export const lobstersWidget: WidgetDefinition<LobstersWidgetConfig, LobstersData> = {
  component: LobstersWidget,
  fetcher: lobstersFetcher,
}

export type { LobstersData, LobstersStory, LobstersWidgetConfig }
