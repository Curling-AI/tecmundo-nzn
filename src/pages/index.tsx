import { useState } from 'react'
import { Search, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
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
import { StarRating } from '@/components/StarRating'
import { Article } from '@/types'
import { cn } from '@/lib/utils'
import { RegionFilter } from '@/components/RegionFilter'
import { ArticleCard, getScoreColor } from '@/components/ArticleCard'
import { useDateFilter } from '@/store/dateFilter'
import { useIntelligentPagination } from '@/hooks/useIntelligentPagination'
import { useArticleUpdates } from '@/hooks/useArticleUpdates'
import { saveArticleRating } from '@/services/articles'
import { toast } from '@/hooks/use-toast'

const ITEMS_PER_PAGE = 10

const Index = () => {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRegion, setSelectedRegion] = useState('all')
  const [articleRatings, setArticleRatings] = useState<Record<string, number>>({})
  const { date } = useDateFilter()

  const {
    articles: paginatedArticles,
    isLoading,
    isLoadingMore,
    hasMore,
    currentPage,
    totalPages,
    totalCount,
    sortConfig,
    setCurrentPage,
    handleSort,
    updateArticles,
  } = useIntelligentPagination({
    startDate: date?.from?.toISOString() ?? '',
    endDate: date?.to?.toISOString() ?? '',
    searchTerm,
    selectedRegion,
    itemsPerPage: ITEMS_PER_PAGE,
    loadMoreThreshold: 3, // Carrega mais quando restam 3 páginas
  })

  // Hook para gerenciar atualizações de artigos relacionados
  const { updateRelatedArticles } = useArticleUpdates({ updateArticles })

  const handleArticleClick = (article: Article) => {
    setSelectedArticle(article)
  }

  const handleRatingChange = async (articleId: string, rating: number) => {
    setArticleRatings((prev) => ({
      ...prev,
      [articleId]: rating,
    }))

    // Salvar automaticamente o rating
    await handleSaveRating(articleId, rating)
  }

  const handleSaveRating = async (articleId: string, rating: number) => {
    try {
      await saveArticleRating(articleId, rating)

      // Notificar que os artigos relacionados devem ser atualizados
      await updateRelatedArticles(articleId, date?.from?.toISOString(), date?.to?.toISOString())

      toast({
        title: 'Avaliação salva!',
        description: 'Obrigado pelo seu feedback.',
        variant: 'default',
      })
    } catch (error) {
      console.error('Error saving article rating:', error)
      toast({
        title: 'Erro ao salvar avaliação',
        description: 'Ocorreu um erro ao salvar a avaliação. Por favor, tente novamente.',
        variant: 'destructive',
      })
    }
  }

  const getSortIcon = (field: string) => {
    if (sortConfig.field !== field) {
      return <ArrowUpDown className="text-muted-foreground h-4 w-4" />
    }
    return sortConfig.direction === 'asc' ? (
      <ArrowUp className="text-primary h-4 w-4" />
    ) : (
      <ArrowDown className="text-primary h-4 w-4" />
    )
  }

  const handleHeaderClick = (field: string) => {
    handleSort(field)
  }

  const renderSkeletons = () =>
    Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
      <TableRow key={i}>
        <TableCell className="w-2/6">
          <Skeleton className="h-5 w-full" />
        </TableCell>
        <TableCell className="hidden w-1/6 md:table-cell">
          <Skeleton className="h-5 w-full" />
        </TableCell>
        <TableCell className="w-1/6 text-center">
          <Skeleton className="mx-auto h-6 w-10 rounded-full" />
        </TableCell>
        <TableCell className="w-1/6 text-right">
          <Skeleton className="ml-auto h-5 w-20" />
        </TableCell>
        <TableCell className="w-1/6 text-center">
          <Skeleton className="mx-auto h-6 w-20" />
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
                  <TableHead
                    className="hover:bg-muted/50 w-60/100 cursor-pointer transition-colors select-none"
                    onClick={() => handleHeaderClick('title')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Título</span>
                      {getSortIcon('title')}
                    </div>
                  </TableHead>
                  <TableHead
                    className="hover:bg-muted/50 hidden w-15/100 cursor-pointer transition-colors select-none md:table-cell"
                    onClick={() => handleHeaderClick('source')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Fonte</span>
                      {getSortIcon('source')}
                    </div>
                  </TableHead>
                  <TableHead
                    className="hover:bg-muted/50 w-10/100 cursor-pointer text-center transition-colors select-none"
                    onClick={() => handleHeaderClick('averageScore')}
                  >
                    <div className="flex items-center justify-center space-x-1">
                      <span>Pontuação</span>
                      {getSortIcon('averageScore')}
                    </div>
                  </TableHead>
                  <TableHead
                    className="hover:bg-muted/50 w-15/100 cursor-pointer text-right transition-colors select-none"
                    onClick={() => handleHeaderClick('publishedAt')}
                  >
                    <div className="flex items-center justify-end space-x-1">
                      <span>Data</span>
                      {getSortIcon('publishedAt')}
                    </div>
                  </TableHead>
                  <TableHead className="w-20/100 text-center">
                    <span>Avaliação de Impacto</span>
                  </TableHead>
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
                      <TableCell className="w-60/100 truncate font-medium text-ellipsis">
                        {article.title}
                      </TableCell>
                      <TableCell className="text-muted-foreground hidden w-15/100 md:table-cell">
                        {article.source}
                      </TableCell>
                      <TableCell className="w-10/100 text-center">
                        <Badge className={cn('font-bold', getScoreColor(article.averageScore))}>
                          {article.averageScore.toFixed(2)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground w-15/100 text-right">
                        {formatDistanceToNow(new Date(article.publishedAt), {
                          addSuffix: true,
                          locale: ptBR,
                        })}
                      </TableCell>
                      <TableCell
                        className="w-20/100 text-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex justify-center">
                          <StarRating
                            initialRating={articleRatings[article.id] || 0}
                            onRatingChange={(rating) => void handleRatingChange(article.id, rating)}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-muted-foreground py-8 text-center">
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

      <div className="space-y-4">
        <AppPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />

        {/* Indicador de carregamento inteligente */}
        {isLoadingMore && (
          <div className="text-muted-foreground flex items-center justify-center space-x-2 text-sm">
            <div className="border-primary h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
            <span>Carregando mais artigos...</span>
          </div>
        )}

        {/* Informações sobre o carregamento inteligente */}
        {hasMore && !isLoadingMore && (
          <div className="text-muted-foreground text-center text-xs">
            {totalCount > 0 && (
              <p>
                Mostrando {totalCount} artigos.
                {currentPage >= totalPages - 2 && (
                  <span className="text-primary ml-1">Carregando mais automaticamente...</span>
                )}
              </p>
            )}
          </div>
        )}

        {!hasMore && totalCount > 0 && (
          <div className="text-muted-foreground text-center text-xs">
            <p>Todos os {totalCount} artigos foram carregados.</p>
          </div>
        )}
      </div>

      <ArticleDetails
        article={selectedArticle}
        isOpen={!!selectedArticle}
        onClose={() => setSelectedArticle(null)}
      />
    </div>
  )
}

export default Index
