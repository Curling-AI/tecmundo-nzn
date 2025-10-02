import { supabase } from '@/lib/supabase'
import { Keyword } from '@/types'

interface dbKeyword {
  id: string
  keyword_text: string
  overall_score: number
  weighted_score: number
  quantity_score: number
  recency_score: number
  relevance_score: number
  trending_score: number
  average_article_rating: number
  calculated_at: string
}

export const getKeywords = async (
  start_date: string,
  end_date: string,
  order_by = 'overall_score',
  order_direction: 'asc' | 'desc' = 'desc',
  offset = 0,
  limit = 1000,
): Promise<Keyword[]> => {
  const { data, error } = (await supabase.rpc('get_weighted_keywords', {
    p_start_date: start_date,
    p_end_date: end_date,
    p_order_by: order_by,
    p_order_direction: order_direction,
    p_offset: offset,
    p_limit: limit,
  })) as unknown as { data: dbKeyword[]; error: Error | null }

  if (error || !data) {
    console.error('Error fetching keywords:', error)
    throw error!
  }

  return (data as unknown as dbKeyword[]).map((keyword) => ({
    ...keyword,
    name: keyword.keyword_text,
    overallScore: keyword.weighted_score || 0,
    quantityScore: keyword.quantity_score || 0,
    recencyScore: keyword.recency_score || 0,
    relevanceScore: keyword.relevance_score || 0,
    trendScore: keyword.trending_score || 0,
    calculatedAt: keyword.calculated_at || '',
    averageArticleRating: keyword.average_article_rating || 0,
  }))
}
