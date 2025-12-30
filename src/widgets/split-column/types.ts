/**
 * Split Column Widget Type Definitions
 * Allows placing widgets side by side horizontally
 */

import type { WidgetConfig, WidgetProps } from '../../types/widget'

/**
 * Base Split Column Widget Configuration
 * The `widgets` property uses generic WidgetConfig here.
 * For full type safety with all widget types, use SplitColumnWidgetConfig from widgets/index.ts
 */
export interface SplitColumnWidgetConfigBase extends WidgetConfig {
  type: 'split-column'
  /** Array of child widget configurations to display side by side */
  widgets: WidgetConfig[]
  /** Maximum number of columns (default: 2, max: 5) */
  maxColumns?: number
}

/**
 * Split Column Data Structure
 * Contains fetched data for all child widgets
 */
export interface SplitColumnData {
  /** Array of widget props with fetched data, in same order as config.widgets */
  childWidgets: WidgetProps[]
}
