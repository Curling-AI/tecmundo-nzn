import { supabase } from '@/lib/supabase'
import { Article, ArticleRating, CompetitorArticle } from '@/types'

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

interface dbSEOArticle {
  id: string
  title: string
  feed_sources: {
    url: string
    countries?: {
      name: string
      continents?: {
        name: string
      }
    }
  }
  article_keywords: {
    keywords: {
      keyword_text: string
    }
  }[]
  url: string
  published_at: string
  seo_data: {
    score: number
    errors_count: number
    warnings_count: number
    metrics: Record<string, number>
    checks: Record<string, boolean>
  }[]
}

export const getArticles = async (
  start_date: string,
  end_date: string,
  order_by = 'total_score',
  order_direction: 'asc' | 'desc' = 'desc',
  offset = 0,
  limit = 500,
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

export const getArticlesByKeywords = async (
  keywords: string[],
  excludeArticleId?: string,
  start_date?: string,
  end_date?: string,
): Promise<Article[]> => {
  if (keywords.length === 0) return []

  let query = supabase.from('vw_feed_item_scores').select('*').overlaps('keywords', keywords)

  // Só adicionar a condição de exclusão se um ID for fornecido
  if (excludeArticleId) {
    query = query.neq('id', excludeArticleId)
  }

  if (start_date && end_date) {
    query = query.gte('published_at', start_date).lte('published_at', end_date)
  }

  const { data, error } = await query

  if (error || !data) {
    console.error('Error fetching articles by keywords:', error)
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

export const recalculateArticleScores = async (
  articleId: string,
  start_date?: string,
  end_date?: string,
): Promise<Article[]> => {
  // Buscar o artigo completo para obter suas keywords e dados
  const { data: articleData, error: articleError } = (await supabase
    .from('vw_feed_item_scores')
    .select('*')
    .eq('id', articleId)
    .single()) as unknown as { data: dbArticle; error: Error | null }

  if (articleError || !articleData) {
    console.error('Error fetching article for recalculation:', articleError)
    throw articleError!
  }

  const articleKeywords = articleData.keywords

  if (!articleKeywords || articleKeywords.length === 0) {
    console.log('No keywords found for article, skipping recalculation')
    return []
  }

  // Buscar todos os artigos que compartilham pelo menos uma keyword (incluindo o próprio artigo)
  const relatedArticles = await getArticlesByKeywords(
    articleKeywords,
    articleId,
    start_date,
    end_date,
  )

  // Adicionar o próprio artigo à lista de artigos para atualização
  const currentArticle: Article = {
    id: articleData.id,
    title: articleData.title,
    totalScore: articleData.total_score,
    averageScore: articleData.average_score,
    source: (() => {
      const regex = /^https?:\/\/(?:www\.)?([^/]+)/i
      const match = regex.exec(articleData.url)
      if (!match) return articleData.url
      const domain = match[1]
      const domainWithoutTld = domain.replace(/\.com\.br$/, '').replace(/\.[^.]+$/, '')
      return domainWithoutTld
    })(),
    publishedAt: articleData.published_at,
    keywords: articleData.keywords,
    country: articleData.country,
    continent: articleData.continent,
    url: articleData.url,
  }

  // Incluir o próprio artigo na lista de artigos para atualização
  const allArticlesToUpdate = [currentArticle, ...relatedArticles]

  // Simular recálculo das pontuações baseado no rating
  const updatedArticles = allArticlesToUpdate.map((article: Article) => {
    // Para o artigo principal, aplicar um boost baseado no rating
    if (article.id === articleId) {
      // Simular um boost de 5-15% baseado no rating (1-5 estrelas)
      const ratingBoost = Math.random() * 0.1 + 0.05 // 5-15%
      const newTotalScore = article.totalScore * (1 + ratingBoost)
      const newAverageScore = article.averageScore * (1 + ratingBoost)

      return {
        ...article,
        totalScore: newTotalScore,
        averageScore: newAverageScore,
      }
    } else {
      // Para artigos relacionados, aplicar um boost menor baseado no overlap de keywords
      const sharedKeywords = article.keywords.filter((keyword: string) =>
        articleKeywords.includes(keyword),
      )
      const keywordOverlapRatio = sharedKeywords.length / article.keywords.length
      const relatedBoost = Math.min(keywordOverlapRatio * 0.05, 0.1) // Máximo de 10% de boost

      const newTotalScore = article.totalScore * (1 + relatedBoost)
      const newAverageScore = article.averageScore * (1 + relatedBoost)

      return {
        ...article,
        totalScore: newTotalScore,
        averageScore: newAverageScore,
      }
    }
  })

  return updatedArticles
}

export const getRelatedArticles = async (
  articleId: string,
  start_date?: string,
  end_date?: string,
  limit = 10,
): Promise<Article[]> => {
  // Buscar o artigo para obter suas keywords
  const { data: articleData, error: articleError } = await supabase
    .from('vw_feed_item_scores')
    .select('keywords')
    .eq('id', articleId)
    .single()

  if (articleError || !articleData) {
    console.error('Error fetching article for related articles:', articleError)
    throw articleError
  }

  const articleKeywords = articleData.keywords as string[]

  if (!articleKeywords || articleKeywords.length === 0) {
    return []
  }

  // Buscar artigos relacionados limitando a quantidade
  const relatedArticles = await getArticlesByKeywords(
    articleKeywords,
    articleId,
    start_date,
    end_date,
  )

  // Ordenar por relevância (quantidade de keywords compartilhadas)
  const sortedArticles = relatedArticles
    .map((article) => {
      const sharedKeywords = article.keywords.filter((keyword) => articleKeywords.includes(keyword))
      return {
        ...article,
        sharedKeywordsCount: sharedKeywords.length,
        sharedKeywords: sharedKeywords,
      }
    })
    .sort((a, b) => b.sharedKeywordsCount - a.sharedKeywordsCount)
    .slice(0, limit)

  return sortedArticles
}

export const saveArticleRating = async (
  articleId: string,
  rating: number,
  start_date?: string,
  end_date?: string,
): Promise<ArticleRating> => {
  const { data, error } = (await supabase
    .from('article_ratings')
    .insert({ article_id: articleId, rating: rating })
    .select()
    .single()) as unknown as { data: ArticleRating; error: Error | null }

  if (error) {
    console.error('Error saving article rating:', error)
    throw error
  }

  // Após salvar o rating, buscar e recalcular pontuações dos artigos relacionados
  try {
    await recalculateArticleScores(articleId, start_date, end_date)
  } catch (recalcError) {
    console.error('Error recalculating related article scores:', recalcError)
    // Não falhar a operação principal se o recálculo falhar
  }

  return {
    id: data.id,
    articleId,
    rating: rating,
  }
}

export const getSEOArticles = async (
  from_date: string,
  to_date: string,
): Promise<CompetitorArticle[]> => {
  const { data, error } = await supabase
    .from('feed_items')
    .select(
      '*, seo_data(*), feed_sources(url, countries(name, continents(name))), article_keywords(keywords(keyword_text))',
    )
    .not('feed_sources', 'is', null)
    .in('feed_sources.type', ['concorrente', 'empresa'])
    .gte('published_at', from_date)
    .lte('published_at', to_date)
    .order('published_at', { ascending: false })

  if (error || !data) {
    console.error('Error fetching SEO articles:', error)
    throw error
  }

  const filteredData = data.filter(
    (article: dbSEOArticle) => article.seo_data && article.seo_data.length > 0,
  ) as dbSEOArticle[]

  return filteredData.map((article) => ({
    id: article.id,
    title: article.title,
    source: (() => {
      const regex = /^https?:\/\/(?:www\.)?([^/]+)/i
      const match = regex.exec(article.feed_sources.url)
      if (!match) return article.feed_sources.url
      const domain = match[1]
      const domainWithoutTld = domain.replace(/\.com\.br$/, '.com').replace(/\.[^.]+$/, '')
      return domainWithoutTld
    })(),
    url: article.url,
    seoScore: article.seo_data[0].score,
    publishedAt: article.published_at,
    country: article.feed_sources.countries?.name,
    continent: article.feed_sources.countries?.continents?.name,
    keywords: article.article_keywords.map((keyword) => keyword.keywords.keyword_text),
    metrics: {
      ...article.seo_data[0].metrics,
      errors_count: article.seo_data[0].errors_count,
      warnings_count: article.seo_data[0].warnings_count,
    },
    checks: article.seo_data[0].checks,
  })) as CompetitorArticle[]
}
