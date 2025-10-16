import { useState, useMemo, useEffect } from 'react'
import { formatDistanceToNow, isWithinInterval, endOfDay } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { CompetitorArticleDetails } from '@/components/CompetitorArticleDetails'
import { CompetitorArticle } from '@/types'
import { useDateFilter } from '@/store/dateFilter'
import { AppPagination } from '@/components/AppPagination'
import { CompetitorArticleCard } from '@/components/CompetitorArticleCard'
import { getSEOArticles } from '@/services/articles'

const ITEMS_PER_PAGE = 10

const Traffic = () => {
  const [selectedArticle, setSelectedArticle] = useState<CompetitorArticle | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [articles, setArticles] = useState<CompetitorArticle[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { date } = useDateFilter()

  const filteredArticles = useMemo(() => {
    let filteredArticles = articles
    if (date?.from) {
      filteredArticles = articles.filter((article) => {
        const articleDate = new Date(article.publishedAt)
        const toDate = date.to ? endOfDay(date.to) : endOfDay(date.from!)
        return isWithinInterval(articleDate, {
          start: date.from!,
          end: toDate,
        })
      })
    }
    return filteredArticles.sort((a, b) => b.seoScore - a.seoScore)
  }, [articles, date])

  const paginatedArticles = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    return filteredArticles.slice(startIndex, endIndex)
  }, [filteredArticles, currentPage])

  const totalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE)

  useEffect(() => {
    const fetchArticles = async () => {
      setIsLoading(true)
      try {
        const fromDate = date?.from?.toISOString() ?? ''
        const toDate = date?.to?.toISOString() ?? ''
        const fetchedArticles = await getSEOArticles(fromDate, toDate)
        setArticles(fetchedArticles)
      } catch (error) {
        console.error('Error fetching SEO articles:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchArticles()
      .then(() => {
        setIsLoading(false)
      })
      .catch((error) => {
        console.error('Error fetching SEO articles:', error)
        setIsLoading(false)
      })
  }, [date])

  return (
    <>
      <div className="space-y-6">
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle>Artigos de Maior Tráfego dos Concorrentes</CardTitle>
            <CardDescription>
              Artigos com maior pontuação de SEO dos concorrentes para o período selecionado.
            </CardDescription>
          </CardHeader>
          {isLoading ? (
            <CardContent className="p-6">
              <div className="text-muted-foreground text-center">Carregando artigos...</div>
            </CardContent>
          ) : filteredArticles.length === 0 ? (
            <CardContent className="p-6">
              <div className="text-muted-foreground text-center">
                Nenhum artigo encontrado para o período selecionado.
              </div>
            </CardContent>
          ) : (
            <>
              {/* Desktop View */}
              <div className="hidden md:block">
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Título do Artigo</TableHead>
                        <TableHead>Fonte</TableHead>
                        <TableHead className="text-center">Pontuação SEO</TableHead>
                        <TableHead>Data</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedArticles.map((a) => (
                        <TableRow
                          key={a.id}
                          className="hover:bg-muted/50 cursor-pointer"
                          onClick={() => setSelectedArticle(a)}
                        >
                          <TableCell className="max-w-xs truncate font-medium">{a.title}</TableCell>
                          <TableCell>{a.source}</TableCell>
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
                <CardContent className="space-y-4 p-4">
                  {paginatedArticles.map((a) => (
                    <CompetitorArticleCard key={a.id} article={a} onClick={setSelectedArticle} />
                  ))}
                </CardContent>
              </div>
            </>
          )}
        </Card>
        {!isLoading && filteredArticles.length > 0 && (
          <AppPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
      <CompetitorArticleDetails
        article={selectedArticle}
        isOpen={!!selectedArticle}
        onClose={() => setSelectedArticle(null)}
      />
    </>
  )
}

export default Traffic
