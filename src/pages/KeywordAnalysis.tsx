import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, ArrowUpDown, ArrowUp, ArrowDown, ArrowLeft } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Article } from '@/types'
import { KeywordArticleList } from '@/components/KeywordArticleList'
import { KeywordTable } from '@/components/KeywordTable'
import { AppPagination } from '@/components/AppPagination'
import { KeywordCard } from '@/components/KeywordCard'
import { Skeleton } from '@/components/ui/skeleton'
import { useDateFilter } from '@/store/dateFilter'
import { useIntelligentKeywordPagination } from '@/hooks/useIntelligentKeywordPagination'
import { getArticlesByKeyword } from '@/services/articles'

const ITEMS_PER_PAGE = 10

const KeywordAnalysis = () => {
  const [searchParams] = useSearchParams()
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') ?? '')
  const [selectedKeyword, setSelectedKeyword] = useState<string | null>(null)
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([])
  const [isLoadingArticles, setIsLoadingArticles] = useState(false)
  const { date } = useDateFilter()

  const {
    keywords: paginatedKeywords,
    isLoading,
    isLoadingMore,
    hasMore,
    currentPage,
    totalPages,
    totalCount,
    sortConfig,
    setCurrentPage,
    handleSort,
  } = useIntelligentKeywordPagination({
    startDate: date?.from?.toISOString() ?? '',
    endDate: date?.to?.toISOString() ?? '',
    searchTerm,
    selectedRegion: 'all',
    itemsPerPage: ITEMS_PER_PAGE,
    loadMoreThreshold: 3, // Carrega mais quando restam 3 páginas
  })

  useEffect(() => {
    if (searchParams.get('k')) {
      void handleKeywordClick(searchParams.get('k')!)
    }
  }, [])

  // Função para obter ícone de ordenação
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

  const handleKeywordClick = async (keywordName: string) => {
    setIsLoadingArticles(true)
    setSelectedKeyword(keywordName)

    try {
      const keywordArticles = await getArticlesByKeyword(keywordName)
      setRelatedArticles(keywordArticles)
    } catch (error) {
      console.error('Erro ao carregar artigos:', error)
      setRelatedArticles([])
    } finally {
      setIsLoadingArticles(false)
    }
  }

  const handleBackToKeywords = () => {
    setSelectedKeyword(null)
    setRelatedArticles([])
    setIsLoadingArticles(false)
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
    if (isLoadingArticles) {
      return (
        <Card className="animate-fade-in">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">
                  Carregando artigos para &quot;{selectedKeyword}&quot;
                </CardTitle>
                <CardDescription>
                  Buscando artigos relacionados à keyword selecionada...
                </CardDescription>
              </div>
              <Button variant="outline" onClick={handleBackToKeywords}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-4 w-4 rounded" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )
    }

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
      </div>
      <div className="hidden md:block">
        <Card>
          <CardContent className="p-0">
            <KeywordTable
              keywords={paginatedKeywords}
              isLoading={isLoading}
              onKeywordClick={handleKeywordClick}
              onSort={handleSort}
              getSortIcon={getSortIcon}
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
            <span>Carregando mais keywords...</span>
          </div>
        )}

        {/* Informações sobre o carregamento inteligente */}
        {hasMore && !isLoadingMore && (
          <div className="text-muted-foreground text-center text-xs">
            {totalCount > 0 && (
              <p>
                Mostrando {totalCount} keywords.
                {currentPage >= totalPages - 2 && (
                  <span className="text-primary ml-1">Carregando mais automaticamente...</span>
                )}
              </p>
            )}
          </div>
        )}

        {!hasMore && totalCount > 0 && (
          <div className="text-muted-foreground text-center text-xs">
            <p>Todas as {totalCount} keywords foram carregadas.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default KeywordAnalysis
