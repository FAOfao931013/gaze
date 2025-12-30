/**
 * Split Column Widget
 * Exports widget definition for registration
 */

import type { WidgetDefinition } from '../../types/widget'
import SplitColumnWidget from './SplitColumnWidget.astro'
import { splitColumnFetcher } from './fetcher'
import type { SplitColumnData, SplitColumnWidgetConfigBase } from './types'

export const splitColumnWidget: WidgetDefinition<SplitColumnWidgetConfigBase, SplitColumnData> = {
  component: SplitColumnWidget,
  fetcher: splitColumnFetcher,
  frameless: true,
}

export type { SplitColumnData, SplitColumnWidgetConfigBase }
