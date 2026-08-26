import { createClient } from 'next-sanity'
import { createImageUrlBuilder } from '@sanity/image-url'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '3vxa65y6',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
})

const builder = createImageUrlBuilder(client)

export function urlFor(source) {
  return builder.image(source)
}

/**
 * Query wrapper that degrades instead of failing the render.
 * A CMS outage or DNS blip should drop the logo wall, not 500 the page.
 */
export async function safeFetch(query, fallback = []) {
  try {
    const data = await client.fetch(query)
    return data ?? fallback
  } catch (error) {
    console.error('[sanity] query failed:', error?.message || error)
    return fallback
  }
}
