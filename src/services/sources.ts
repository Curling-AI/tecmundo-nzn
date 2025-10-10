import { supabase } from '@/lib/supabase'
import { Source } from '@/types'

interface CreateSourceData {
  url: string
  countryId?: number
  type: 'concorrente' | 'externa' | 'empresa'
}

interface UpdateSourceData {
  url: string
  countryId?: number
  type: 'concorrente' | 'externa' | 'empresa'
}

interface dbSource {
  id: string
  url: string
  last_crawled_at: string
  created_at: string
  type: 'externa' | 'concorrente' | 'empresa'
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
      created_at,
      type,
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
      createdAt: source.created_at,
      name: (() => {
        const regex = /^https?:\/\/(?:www\.)?([^/]+)/i
        const match = regex.exec(source.url)
        if (!match) return source.url
        const domain = match[1]
        const domainWithoutTld = domain.replace(/\.com\.br$/, '.com').replace(/\.[^.]+$/, '')
        return domainWithoutTld
      })(),
      country: source.country?.name ?? 'Unknown',
      continent: source.country?.continent?.name ?? 'Unknown',
      lastRead: source.last_crawled_at,
      type: source.type,
    }),
  )
}

export const createSource = async (data: CreateSourceData): Promise<Source> => {
  const { data: newSource, error } = await supabase
    .from('feed_sources')
    .insert({
      url: data.url,
      country_id: data.countryId,
      type: data.type,
    })
    .select(
      `
      id, 
      url, 
      last_crawled_at,
      created_at,
      type,
      country:countries(
        name,
        continent:continents(name)
      )
    `,
    )
    .single()

  if (error) {
    console.error('Error creating source:', error)
    throw error
  }

  if (!newSource) {
    throw new Error('No data returned from create query')
  }

  const source = newSource as unknown as dbSource
  return {
    id: source.id,
    url: source.url,
    createdAt: source.created_at,
    name: (() => {
      const regex = /^https?:\/\/(?:www\.)?([^/]+)/i
      const match = regex.exec(source.url)
      if (!match) return source.url
      const domain = match[1]
      const domainWithoutTld = domain.replace(/\.com\.br$/, '.com').replace(/\.[^.]+$/, '')
      return domainWithoutTld
    })(),
    country: source.country?.name ?? 'Unknown',
    continent: source.country?.continent?.name ?? 'Unknown',
    lastRead: source.last_crawled_at,
    type: source.type,
  }
}

export const updateSource = async (id: string, data: UpdateSourceData): Promise<Source> => {
  const { data: updatedSource, error } = await supabase
    .from('feed_sources')
    .update({
      url: data.url,
      country_id: data.countryId,
      type: data.type,
    })
    .eq('id', id)
    .select(
      `
      id, 
      url, 
      last_crawled_at,
      created_at,
      type,
      country:countries(
        name,
        continent:continents(name)
      )
    `,
    )
    .single()

  if (error) {
    console.error('Error updating source:', error)
    throw error
  }

  if (!updatedSource) {
    throw new Error('No data returned from update query')
  }

  const source = updatedSource as unknown as dbSource
  return {
    id: source.id,
    url: source.url,
    createdAt: source.created_at,
    name: (() => {
      const regex = /^https?:\/\/(?:www\.)?([^/]+)/i
      const match = regex.exec(source.url)
      if (!match) return source.url
      const domain = match[1]
      const domainWithoutTld = domain.replace(/\.com\.br$/, '.com').replace(/\.[^.]+$/, '')
      return domainWithoutTld
    })(),
    country: source.country?.name ?? 'Unknown',
    continent: source.country?.continent?.name ?? 'Unknown',
    lastRead: source.last_crawled_at,
    type: source.type,
  }
}
