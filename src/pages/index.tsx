import { useState, useEffect, useMemo } from 'react'
import { Search } from 'lucide-react'
import { formatDistanceToNow, isWithinInterval, endOfDay } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { ArticleDetails } from '@/components/ArticleDetails'
import { AppPagination } from '@/components/AppPagination'
import { MOCK_ARTICLES } from '@/lib/mock-data'
import { Article } from '@/types'
import { cn } from '@/lib/utils'
import { RegionFilter } from '@/components/RegionFilter'
import { ArticleCard } from '@/components/ArticleCard'
import { useDateFilter } from '@/store/dateFilter'

const ITEMS_PER_PAGE = 10

const getScoreColor = (score: number) => {
  if (score > 90) return 'bg-secondary text-secondary-foreground'
  if (score > 80) return 'bg-primary text-primary-foreground'
  return 'bg-muted text-muted-foreground'
}

const Index = () => {
  const [allArticles, setAllArticles] = useState<Article[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedRegion, setSelectedRegion] = useState('all')
  const { date } = useDateFilter()

  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => {
      let filtered = MOCK_ARTICLES

      // Date filter
      if (date?.from) {
        filtered = filtered.filter((article) => {
          const articleDate = new Date(article.publishedAt)
          const toDate = date.to ? endOfDay(date.to) : endOfDay(date.from!)
          return isWithinInterval(articleDate, {
            start: date.from!,
            end: toDate,
          })
        })
      }

      // Search filter
      filtered = filtered.filter(
        (article) =>
          article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.keywords.some((k) => k.toLowerCase().includes(searchTerm.toLowerCase())),
      )

      // Region filter
      if (selectedRegion !== 'all') {
        filtered = filtered.filter((article) => {
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

      setAllArticles(filtered.sort((a, b) => b.totalScore - a.totalScore))
      setCurrentPage(1)
      setIsLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [searchTerm, selectedRegion, date])

  const paginatedArticles = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    return allArticles.slice(startIndex, endIndex)
  }, [allArticles, currentPage])

  const totalPages = Math.ceil(allArticles.length / ITEMS_PER_PAGE)

  const handleArticleClick = (article: Article) => {
    setSelectedArticle(article)
  }

  const renderSkeletons = () =>
    Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
      <TableRow key={i}>
        <TableCell>
          <Skeleton className="h-5 w-3/4" />
        </TableCell>
        <TableCell className="hidden md:table-cell">
          <Skeleton className="h-5 w-24" />
        </TableCell>
        <TableCell className="text-center">
          <Skeleton className="mx-auto h-6 w-10 rounded-full" />
        </TableCell>
        <TableCell className="text-right">
          <Skeleton className="ml-auto h-5 w-28" />
        </TableCell>
      </TableRow>
    ))

  const renderMobileSkeletons = () =>
    Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
      <Card key={i}>
        <CardContent className="p-4">
          <Skeleton className="mb-2 h-5 w-3/4" />
          <div className="flex justify-between">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        </CardContent>
      </Card>
    ))

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
          <Input
            placeholder="Buscar artigos por título ou keywords..."
            className="bg-card pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <RegionFilter selectedRegion={selectedRegion} onRegionChange={setSelectedRegion} />
      </div>

      {/* Desktop View */}
      <div className="hidden md:block">
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead className="hidden md:table-cell">Fonte</TableHead>
                  <TableHead className="text-center">Pontuação</TableHead>
                  <TableHead className="text-right">Data</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  renderSkeletons()
                ) : paginatedArticles.length > 0 ? (
                  paginatedArticles.map((article) => (
                    <TableRow
                      key={article.id}
                      onClick={() => handleArticleClick(article)}
                      className="cursor-pointer"
                    >
                      <TableCell className="max-w-sm truncate font-medium">
                        {article.title}
                      </TableCell>
                      <TableCell className="text-muted-foreground hidden md:table-cell">
                        {article.source}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className={cn('font-bold', getScoreColor(article.totalScore))}>
                          {article.totalScore}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-right">
                        {formatDistanceToNow(new Date(article.publishedAt), {
                          addSuffix: true,
                          locale: ptBR,
                        })}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-muted-foreground py-8 text-center">
                      Nenhum artigo encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Mobile View */}
      <div className="space-y-4 md:hidden">
        {isLoading ? (
          renderMobileSkeletons()
        ) : paginatedArticles.length > 0 ? (
          paginatedArticles.map((article) => (
            <ArticleCard key={article.id} article={article} onClick={handleArticleClick} />
          ))
        ) : (
          <Card>
            <CardContent className="text-muted-foreground p-8 text-center">
              Nenhum artigo encontrado.
            </CardContent>
          </Card>
        )}
      </div>

      <AppPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <ArticleDetails
        article={selectedArticle}
        isOpen={!!selectedArticle}
        onClose={() => setSelectedArticle(null)}
      />
    </div>
  )
}

export default Index
