#!/usr/bin/env bun

/**
 * Data Harvest Script
 *
 * This script fetches data from various APIs during CI/CD build process,
 * validates it using Valibot, and saves it as JSON to src/content/dashboard
 * for Astro Content Collections to ingest.
 *
 * Architecture: Pure SSG (Zero Runtime Fetch)
 * - All data fetching happens at build time
 * - No client-side API calls
 * - Data is validated and stored as static JSON files
 */

import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import * as v from 'valibot'

// Base schema for dashboard data
const DashboardDataSchema = v.object({
  timestamp: v.string(),
  data: v.record(v.string(), v.unknown()),
})

type DashboardData = v.InferOutput<typeof DashboardDataSchema>

interface DataSourceConfig {
  url: string
  headers?: Record<string, string>
}

/**
 * Example API data source configuration
 * Add your API endpoints here
 */
const DATA_SOURCES: Record<string, DataSourceConfig> = {
  // Example: GitHub API
  // github: {
  //   url: 'https://api.github.com/repos/owner/repo',
  //   headers: {
  //     'Accept': 'application/vnd.github.v3+json',
  //     'Authorization': `token ${process.env.GITHUB_TOKEN}`,
  //   },
  // },
  // Example: Custom API
  // weather: {
  //   url: 'https://api.example.com/weather',
  //   headers: {
  //     'Authorization': `Bearer ${process.env.API_TOKEN}`,
  //   },
  // },
}

/**
 * Fetches data from a single source
 */
async function fetchDataSource(name: string, config: DataSourceConfig): Promise<unknown> {
  console.log(`📡 Fetching data from ${name}...`)

  try {
    const response = await fetch(config.url, {
      headers: config.headers || {},
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    console.log(`✅ Successfully fetched ${name}`)
    return data
  } catch (error) {
    console.error(`❌ Failed to fetch ${name}:`, error)
    throw error
  }
}

/**
 * Validates and saves dashboard data
 */
async function saveDashboardData(data: DashboardData): Promise<void> {
  const outputDir = join(process.cwd(), 'src', 'content', 'dashboard')
  const outputFile = join(outputDir, 'data.json')

  try {
    // Validate data with Valibot
    const validatedData = v.parse(DashboardDataSchema, data)
    console.log('✅ Data validation passed')

    // Ensure directory exists
    await mkdir(outputDir, { recursive: true })

    // Write JSON file
    await writeFile(outputFile, JSON.stringify(validatedData, null, 2), 'utf-8')
    console.log(`✅ Data saved to ${outputFile}`)
  } catch (error) {
    if (error instanceof v.ValiError) {
      console.error('❌ Validation error:', error.issues)
    } else {
      console.error('❌ Failed to save data:', error)
    }
    throw error
  }
}

/**
 * Main harvest function
 */
async function harvest(): Promise<void> {
  console.log('🌾 Starting data harvest...\n')

  const timestamp = new Date().toISOString()
  const collectedData: Record<string, unknown> = {}

  // Fetch all data sources
  for (const [name, config] of Object.entries(DATA_SOURCES)) {
    try {
      const data = await fetchDataSource(name, config)
      collectedData[name] = data
    } catch (error) {
      console.warn(`⚠️  Skipping ${name} due to error`)
      // Continue with other sources even if one fails
    }
  }

  // If no data sources are configured, create a placeholder
  if (Object.keys(collectedData).length === 0) {
    console.log('ℹ️  No data sources configured. Creating placeholder data...')
    collectedData.placeholder = {
      message: 'Add your API endpoints in scripts/harvest.ts',
      timestamp,
    }
  }

  // Prepare dashboard data
  const dashboardData: DashboardData = {
    timestamp,
    data: collectedData,
  }

  // Save data
  await saveDashboardData(dashboardData)

  console.log('\n✨ Data harvest complete!')
}

// Run harvest
harvest().catch((error) => {
  console.error('💥 Harvest failed:', error)
  process.exit(1)
})
