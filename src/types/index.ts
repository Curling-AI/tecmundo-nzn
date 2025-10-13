export interface Article {
  id: string
  title: string
  totalScore: number
  averageScore: number
  source: string
  publishedAt: string
  country: string
  continent: string
  url: string
  keywords: string[]
}

export interface Keyword {
  id: string
  name: string
  overallScore: number
  quantityScore: number
  recencyScore: number
  relevanceScore: number
  trendScore: number
  calculatedAt: string
  averageArticleRating: number
}

export interface Competitor {
  id: string
  name: string
  avgKeywordPosition: number
  rankedKeywordsCount: number
}

export interface CompetitorArticle {
  id: string
  title: string
  competitorName: string
  seoScore: number
  publishedAt: string
  mainKeywords: string[]
  // Includes all fields from Article for the details view
  source: string
  country: string
  continent: string
  url: string
  keywords: string[]
  totalScore: number
  averageScore: number
}

export interface KeywordComparison {
  keyword: string
  tecmundoScore: number
  competitorScore: number
}

export interface Source {
  id: string
  url: string
  name: string
  country: string
  continent: string
  lastRead: string
  createdAt: string
  type: 'concorrente' | 'externa' | 'empresa'
}

export interface ArticleRating {
  id: string
  articleId: string
  rating: number
}

export interface Country {
  id: number
  name: string
  continent: string
}
