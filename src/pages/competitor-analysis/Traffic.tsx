import { useState, useMemo } from 'react'
import { formatDistanceToNow, isWithinInterval, endOfDay } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { ArticleDetails } from '@/components/ArticleDetails'
import { MOCK_COMPETITOR_ARTICLES } from '@/lib/mock-data'
import { CompetitorArticle } from '@/types'
import { useDateFilter } from '@/store/dateFilter'
import { AppPagination } from '@/components/AppPagination'
import { CompetitorArticleCard } from '@/components/CompetitorArticleCard'

const ITEMS_PER_PAGE = 10

const Traffic = () => {
  const [selectedArticle, setSelectedArticle] =
    useState<CompetitorArticle | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const { date } = useDateFilter()

  const filteredArticles = useMemo(() => {
    let articles = MOCK_COMPETITOR_ARTICLES
    if (date?.from) {
      articles = articles.filter((article) => {
        const articleDate = new Date(article.publishedAt)
        const toDate = date.to ? endOfDay(date.to) : endOfDay(date.from!)
        return isWithinInterval(articleDate, {
          start: date.from!,
          end: toDate,
        })
      })
    }
    return articles.sort((a, b) => b.seoScore - a.seoScore)
  }, [date])

  const paginatedArticles = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    return filteredArticles.slice(startIndex, endIndex)
  }, [filteredArticles, currentPage])

  const totalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE)

  return (
    <>
      <div className="space-y-6">
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle>Artigos de Maior Tráfego dos Concorrentes</CardTitle>
            <CardDescription>
              Artigos com maior pontuação de SEO dos concorrentes para o período
              selecionado.
            </CardDescription>
          </CardHeader>
          {/* Desktop View */}
          <div className="hidden md:block">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título do Artigo</TableHead>
                    <TableHead>Concorrente</TableHead>
                    <TableHead className="text-center">Pontuação SEO</TableHead>
                    <TableHead>Data</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedArticles.map((a) => (
                    <TableRow
                      key={a.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => setSelectedArticle(a)}
                    >
                      <TableCell className="font-medium max-w-xs truncate">
                        {a.title}
                      </TableCell>
                      <TableCell>{a.competitorName}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary">{a.seoScore}</Badge>
                      </TableCell>
                      <TableCell>
                        {formatDistanceToNow(new Date(a.publishedAt), {
                          addSuffix: true,
                          locale: ptBR,
                        })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </div>
          {/* Mobile View */}
          <div className="md:hidden">
            <CardContent className="p-4 space-y-4">
              {paginatedArticles.map((a) => (
                <CompetitorArticleCard
                  key={a.id}
                  article={a}
                  onClick={setSelectedArticle}
                />
              ))}
            </CardContent>
          </div>
        </Card>
        <AppPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
      <ArticleDetails
        article={selectedArticle}
        isOpen={!!selectedArticle}
        onClose={() => setSelectedArticle(null)}
      />
    </>
  )
}

export default Traffic
