import { supabase } from '@/lib/supabase'
import { Keyword } from '@/types'

interface dbKeyword {
  id: string
  keyword_text: string
  keyword_scores: {
    overall_score: number
    quantity_score: number
    recency_score: number
    relevance_score: number
    trending_score: number
    calculated_at: string
  }
}

export const getKeywords = async (
  start_date: string,
  end_date: string,
  order_by = 'overall_score',
  order_direction: 'asc' | 'desc' = 'desc',
  offset = 0,
  limit = 1000,
): Promise<Keyword[]> => {
  const { data, error } = await supabase
    .from('keywords')
    .select(
      'id, keyword_text, keyword_scores (overall_score, quantity_score, recency_score, relevance_score, trending_score, calculated_at)',
    )
    .order(order_by, {
      ascending: order_direction === 'asc',
      nullsFirst: false,
      referencedTable: 'keyword_scores',
    })
    .gte('keyword_scores.calculated_at', start_date)
    .lte('keyword_scores.calculated_at', end_date)
    .range(offset, offset + limit - 1)

  if (error || !data) {
    console.error('Error fetching keywords:', error)
    throw error
  }

  return (data as unknown as dbKeyword[]).map((keyword) => ({
    ...keyword,
    name: keyword.keyword_text,
    overallScore: keyword.keyword_scores?.overall_score || 0,
    quantityScore: keyword.keyword_scores?.quantity_score || 0,
    recencyScore: keyword.keyword_scores?.recency_score || 0,
    relevanceScore: keyword.keyword_scores?.relevance_score || 0,
    trendScore: keyword.keyword_scores?.trending_score || 0,
    calculatedAt: keyword.keyword_scores?.calculated_at || '',
  }))
}
