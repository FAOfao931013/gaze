import type { GazeConfig } from '../types/gaze'

/**
 * Gaze Dashboard Configuration
 * This is the main configuration file that defines all pages, layouts, and widgets
 */
export const gazeConfig = {
  pages: [
    {
      // First page is the homepage (/)
      name: 'Home',
      width: 'default',
      columns: [
        {
          size: 'small',
          widgets: [
            {
              type: 'rss',
              title: 'YC News',
              feedUrl: 'https://news.ycombinator.com/rss',
              limit: 10,
              style: 'vertical-list',
              collapseAfter: 5,
            },
            {
              type: 'rss',
              title: 'GitHub Trending',
              feedUrl: 'https://mshibanami.github.io/GitHubTrendingRSS/daily/all.xml',
              limit: 10,
              style: 'vertical-list',
              collapseAfter: 5,
            },
          ],
        },
        {
          size: 'full',
          widgets: [
            {
              type: 'lobsters',
              limit: 15,
              sortBy: 'hot',
              collapseAfter: 7,
            },
            {
              type: 'youtube',
              title: 'Recent Videos',
              channels: [
                'UCXuqSBlHAE6Xw-yeJA0Tunw',
                'UCBJycsmduvYEL83R_U4JriQ',
                'UCHnyfMqiRRG1u-2MsSQLbXA',
              ],
              limit: 8,
            },
          ],
        },
        {
          size: 'small',
          widgets: [
            {
              type: 'weather',
              title: 'Weather',
              location: 'Shanghai',
            },
          ]
        }
      ],
    },
  ],
} satisfies GazeConfig
