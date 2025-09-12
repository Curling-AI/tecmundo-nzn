import { supabase } from '@/lib/supabase'
import { Article } from '@/types'

interface dbArticle {
  id: string
  title: string
  total_score: number
  average_score: number
  url: string
  published_at: string
  keywords: string[]
  country: string
  continent: string
  source: string
}

export const getArticles = async (
  start_date: string,
  end_date: string,
  order_by = 'total_score',
  order_direction: 'asc' | 'desc' = 'desc',
  offset = 0,
  limit = 1000,
): Promise<Article[]> => {
  if (!start_date || !end_date) {
    start_date = new Date().toISOString()
    end_date = new Date().toISOString()
  }

  const { data, error } = await supabase
    .from('vw_feed_item_scores')
    .select('*')
    .order(order_by, { ascending: order_direction === 'asc' })
    .gte('published_at', start_date)
    .lte('published_at', end_date)
    .range(offset, offset + limit - 1)

  if (error || !data) {
    console.error('Error fetching articles:', error)
    throw error
  }

  return (data as dbArticle[]).map((article) => ({
    ...article,
    totalScore: article.total_score,
    averageScore: article.average_score,
    source: (() => {
      const regex = /^https?:\/\/(?:www\.)?([^/]+)/i
      const match = regex.exec(article.url)
      if (!match) return article.url
      const domain = match[1]
      const domainWithoutTld = domain.replace(/\.com\.br$/, '').replace(/\.[^.]+$/, '')
      return domainWithoutTld
    })(),
    publishedAt: article.published_at,
    keywords: article.keywords,
  })) as Article[]
}

export const getArticlesByKeyword = async (
  keyword: string,
  offset = 0,
  limit = 1000,
): Promise<Article[]> => {
  const { data, error } = await supabase
    .from('vw_feed_item_scores')
    .select('*')
    .contains('keywords', [keyword])
    .range(offset, offset + limit - 1)

  if (error || !data) {
    console.error('Error fetching articles by keyword:', error)
    throw error
  }

  return (data as dbArticle[]).map(
    (article): Article => ({
      ...article,
      totalScore: article.total_score,
      averageScore: article.average_score,
      source: (() => {
        const regex = /^https?:\/\/(?:www\.)?([^/]+)/i
        const match = regex.exec(article.url)
        if (!match) return article.url
        const domain = match[1]
        const domainWithoutTld = domain.replace(/\.com\.br$/, '').replace(/\.[^.]+$/, '')
        return domainWithoutTld
      })(),
      publishedAt: article.published_at,
      keywords: article.keywords,
    }),
  )
}
