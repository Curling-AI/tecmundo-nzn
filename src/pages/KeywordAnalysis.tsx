import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search } from 'lucide-react'
import { isWithinInterval, endOfDay } from 'date-fns'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { MOCK_KEYWORDS, MOCK_ARTICLES } from '@/lib/mock-data'
import { Keyword, Article } from '@/types'
import { KeywordArticleList } from '@/components/KeywordArticleList'
import { KeywordTable } from '@/components/KeywordTable'
import { AppPagination } from '@/components/AppPagination'
import { RegionFilter } from '@/components/RegionFilter'
import { KeywordCard } from '@/components/KeywordCard'
import { Skeleton } from '@/components/ui/skeleton'
import { useDateFilter } from '@/store/dateFilter'

const ITEMS_PER_PAGE = 10

const KeywordAnalysis = () => {
  const [searchParams] = useSearchParams()
  const [allKeywords, setAllKeywords] = useState<Keyword[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') ?? '')
  const [selectedKeyword, setSelectedKeyword] = useState<string | null>(null)
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedRegion, setSelectedRegion] = useState('all')
  const { date } = useDateFilter()

  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => {
      let dateFilteredArticles = MOCK_ARTICLES
      if (date?.from) {
        dateFilteredArticles = MOCK_ARTICLES.filter((article) => {
          const articleDate = new Date(article.publishedAt)
          const toDate = date.to ? endOfDay(date.to) : endOfDay(date.from!)
          return isWithinInterval(articleDate, {
            start: date.from!,
            end: toDate,
          })
        })
      }

      let regionFilteredArticles = dateFilteredArticles
      if (selectedRegion !== 'all') {
        regionFilteredArticles = dateFilteredArticles.filter((article) => {
          const continent = article.continent.toLowerCase()
          switch (selectedRegion) {
            case 'brasil':
              return article.country.toLowerCase() === 'brasil'
            case 'internacional':
              return article.country.toLowerCase() !== 'brasil'
            case 'america-do-sul':
              return continent === 'américa do sul'
            case 'america-do-norte':
              return continent === 'américa do norte'
            case 'africa':
              return continent === 'africa'
            case 'europa':
              return continent === 'europa'
            case 'asia':
              return continent === 'ásia'
            case 'oceania':
              return continent === 'oceania'
            default:
              return true
          }
        })
      }

      const keywordsFromRegion = new Set<string>(
        regionFilteredArticles.flatMap((article) => article.keywords.map((k) => k.toLowerCase())),
      )

      const filteredKeywords = MOCK_KEYWORDS.filter(
        (k) =>
          k.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          (selectedRegion === 'all' || keywordsFromRegion.has(k.name.toLowerCase())),
      )

      setAllKeywords(filteredKeywords.sort((a, b) => b.overallScore - a.overallScore))
      setCurrentPage(1)
      setIsLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [searchTerm, selectedRegion, date])

  const paginatedKeywords = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    return allKeywords.slice(startIndex, endIndex)
  }, [allKeywords, currentPage])

  const totalPages = Math.ceil(allKeywords.length / ITEMS_PER_PAGE)

  const handleKeywordClick = (keywordName: string) => {
    const articles = MOCK_ARTICLES.filter((article) =>
      article.keywords.map((k) => k.toLowerCase()).includes(keywordName.toLowerCase()),
    )

    setRelatedArticles(articles)
    setSelectedKeyword(keywordName)
  }

  const handleBackToKeywords = () => {
    setSelectedKeyword(null)
    setRelatedArticles([])
  }

  const renderMobileSkeletons = () =>
    Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
      <Card key={i}>
        <CardContent className="flex justify-between p-4">
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="h-6 w-12 rounded-md" />
        </CardContent>
      </Card>
    ))

  if (selectedKeyword) {
    return (
      <KeywordArticleList
        keyword={selectedKeyword}
        articles={relatedArticles}
        onBack={handleBackToKeywords}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
          <Input
            placeholder="Buscar keywords..."
            className="bg-card pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <RegionFilter selectedRegion={selectedRegion} onRegionChange={setSelectedRegion} />
      </div>
      <div className="hidden md:block">
        <Card>
          <CardContent className="p-0">
            <KeywordTable
              keywords={paginatedKeywords}
              isLoading={isLoading}
              onKeywordClick={handleKeywordClick}
            />
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4 md:hidden">
        {isLoading
          ? renderMobileSkeletons()
          : paginatedKeywords.map((keyword) => (
              <KeywordCard key={keyword.id} keyword={keyword} onClick={handleKeywordClick} />
            ))}
      </div>

      <AppPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  )
}

export default KeywordAnalysis
