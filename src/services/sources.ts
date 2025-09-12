import { supabase } from '@/lib/supabase'
import { Source } from '@/types'

interface dbSource {
  id: string
  url: string
  last_crawled_at: string
  country?: {
    name: string
    continent?: {
      name: string
    }
  }
}

export const getSources = async (): Promise<Source[]> => {
  const { data, error } = await supabase.from('feed_sources').select(`
      id, 
      url, 
      last_crawled_at,
      country:countries(
        name,
        continent:continents(name)
      )
    `)

  if (error) {
    console.error('Error fetching sources:', error)
    throw error
  }

  if (!data) {
    console.warn('No data returned from sources query')
    return []
  }

  return (data as unknown as dbSource[]).map(
    (source): Source => ({
      id: source.id,
      url: source.url,
      name: (() => {
        const regex = /^https?:\/\/(?:www\.)?([^/]+)/i
        const match = regex.exec(source.url)
        if (!match) return source.url
        const domain = match[1]
        // Remove .com.br and other common TLDs, but keep .com for .com.br domains
        const domainWithoutTld = domain.replace(/\.com\.br$/, '.com').replace(/\.[^.]+$/, '')
        return domainWithoutTld
      })(),
      country: source.country?.name ?? 'Unknown',
      continent: source.country?.continent?.name ?? 'Unknown',
      lastRead: source.last_crawled_at,
    }),
  )
}
