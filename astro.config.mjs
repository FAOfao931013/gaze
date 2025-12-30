import react from '@astrojs/react'
import { defineConfig } from 'astro/config'

const isProduction = process.env.NODE_ENV === 'production'
const githubUsername = process.env.GITHUB_USERNAME

// https://astro.build/config
export default defineConfig({
  ...(isProduction &&
    githubUsername && {
      site: `https://${githubUsername}.github.io`,
      base: '/gaze',
    }),
  integrations: [react()],
  vite: {
    css: {
      transformer: 'postcss',
    },
    ssr: {
      noExternal: ['framer-motion'],
    },
  },
})
