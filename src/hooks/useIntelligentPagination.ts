import { useState, useEffect, useCallback, useRef } from 'react'
import { Article } from '@/types'
import { getArticles } from '@/services/articles'

interface UseIntelligentPaginationProps {
  startDate: string
  endDate: string
  searchTerm: string
  selectedRegion: string
  itemsPerPage?: number
  loadMoreThreshold?: number // Quantos itens antes do final para carregar mais
}

interface SortConfig {
  field: string
  direction: 'asc' | 'desc'
}

interface PaginationState {
  articles: Article[]
  allArticles: Article[]
  isLoading: boolean
  isLoadingMore: boolean
  hasMore: boolean
  currentPage: number
  totalPages: number
  totalCount: number
  sortConfig: SortConfig
}

export function useIntelligentPagination({
  startDate,
  endDate,
  searchTerm,
  selectedRegion,
  itemsPerPage = 10,
  loadMoreThreshold = 3, // Carrega mais quando restam 3 páginas
}: UseIntelligentPaginationProps) {
  const [state, setState] = useState<PaginationState>({
    articles: [],
    allArticles: [],
    isLoading: true,
    isLoadingMore: false,
    hasMore: true,
    currentPage: 1,
    totalPages: 0,
    totalCount: 0,
    sortConfig: { field: 'averageScore', direction: 'desc' },
  })

  const [offset, setOffset] = useState(0)
  const [hasReachedEnd, setHasReachedEnd] = useState(false)
  const lastFetchParams = useRef<string>('')

  const SUPABASE_LIMIT = 500

  // Função para buscar artigos com paginação
  const fetchArticles = useCallback(
    async (currentOffset: number, isLoadMore = false) => {
      try {
        if (isLoadMore) {
          setState((prev) => ({ ...prev, isLoadingMore: true }))
        } else {
          setState((prev) => ({ ...prev, isLoading: true }))
        }

        // Mapear campos de ordenação para os campos do Supabase
        const fieldMapping: Record<string, string> = {
          totalScore: 'total_score',
          averageScore: 'average_score',
          publishedAt: 'published_at',
          title: 'title',
          source: 'source',
        }

        const supabaseField = fieldMapping[state.sortConfig.field] || 'total_score'
        const data = await getArticles(
          startDate,
          endDate,
          supabaseField,
          state.sortConfig.direction,
          currentOffset,
        )

        // Se retornou menos que o limite, chegamos ao final
        if (data.length < SUPABASE_LIMIT) {
          setHasReachedEnd(true)
        }

        return data
      } catch (error) {
        console.error('Error fetching articles:', error)
        return []
      } finally {
        if (isLoadMore) {
          setState((prev) => ({ ...prev, isLoadingMore: false }))
        } else {
          setState((prev) => ({ ...prev, isLoading: false }))
        }
      }
    },
    [startDate, endDate, state.sortConfig],
  )

  // Função para carregar mais artigos
  const loadMoreArticles = useCallback(async () => {
    if (state.isLoadingMore || hasReachedEnd) return

    const newOffset = offset + SUPABASE_LIMIT
    const newData = await fetchArticles(newOffset, true)

    if (newData.length > 0) {
      setState((prev) => ({
        ...prev,
        allArticles: [...prev.allArticles, ...newData],
        totalCount: prev.totalCount + newData.length,
      }))
      setOffset(newOffset)
    }
  }, [offset, state.isLoadingMore, hasReachedEnd, fetchArticles])

  // Função para aplicar filtros e ordenação
  const applyFilters = useCallback(
    (articles: Article[]) => {
      let filtered = [...articles]

      // Search filter
      if (searchTerm?.trim()) {
        const searchLower = searchTerm.toLowerCase().trim()
        filtered = filtered.filter((article) => {
          // Verificar se os campos existem antes de usar toLowerCase
          const title = article.title || ''
          const keywords = article.keywords || []

          return (
            title.toLowerCase().includes(searchLower) ||
            keywords.some((k) => k?.toLowerCase().includes(searchLower))
          )
        })
      }

      // Region filter
      if (selectedRegion !== 'all') {
        filtered = filtered.filter((article) => {
          // Verificar se os campos existem antes de usar toLowerCase
          const country = article.country || ''
          const continent = article.continent || ''

          const countryLower = country.toLowerCase()
          const continentLower = continent.toLowerCase()

          switch (selectedRegion) {
            case 'brasil':
              return countryLower === 'brazil' || countryLower === 'brasil'
            case 'internacional':
              return countryLower !== 'brazil' && countryLower !== 'brasil'
            case 'america-do-sul':
              return continentLower === 'south america' || continentLower === 'américa do sul'
            case 'america-do-norte':
              return continentLower === 'north america' || continentLower === 'américa do norte'
            case 'africa':
              return continentLower === 'africa' || continentLower === 'áfrica'
            case 'europa':
              return continentLower === 'europe' || continentLower === 'europa'
            case 'asia':
              return continentLower === 'asia' || continentLower === 'ásia'
            case 'oceania':
              return continentLower === 'oceania'
            default:
              return true
          }
        })
      }

      // Aplicar ordenação local
      return filtered.sort((a, b) => {
        const { field, direction } = state.sortConfig
        let aValue = a[field as keyof Article]
        let bValue = b[field as keyof Article]

        // Tratar valores undefined/null
        aValue ??= ''
        bValue ??= ''

        // Tratamento especial para campos de data
        if (field === 'publishedAt') {
          aValue = new Date(aValue as string).getTime()
          bValue = new Date(bValue as string).getTime()
        }

        // Tratamento especial para strings
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          aValue = aValue.toLowerCase()
          bValue = bValue.toLowerCase()
        }

        // Tratamento para arrays (keywords)
        if (Array.isArray(aValue)) aValue = aValue.length
        if (Array.isArray(bValue)) bValue = bValue.length

        if (direction === 'asc') {
          return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
        } else {
          return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
        }
      })
    },
    [searchTerm, selectedRegion, state.sortConfig],
  )

  // Função para verificar se precisa carregar mais dados
  const checkIfNeedMoreData = useCallback(() => {
    const currentDataParams = `${startDate}-${endDate}`

    // Se os parâmetros de DATA mudaram, resetar (isso requer nova busca)
    if (lastFetchParams.current !== currentDataParams) {
      lastFetchParams.current = currentDataParams
      setOffset(0)
      setHasReachedEnd(false)
      setState((prev) => ({
        ...prev,
        allArticles: [],
        totalCount: 0,
        currentPage: 1,
      }))
      return
    }

    // Se não há mais dados para carregar, não fazer nada
    if (hasReachedEnd) return

    // Se ainda está carregando, não fazer nada
    if (state.isLoading || state.isLoadingMore) return

    // Aplicar filtros para verificar se precisa carregar mais
    const filteredArticles = applyFilters(state.allArticles)
    const totalPages = Math.ceil(filteredArticles.length / itemsPerPage)

    // Se o usuário está próximo do final e ainda há mais dados no Supabase
    if (state.currentPage >= totalPages - loadMoreThreshold && !hasReachedEnd) {
      void loadMoreArticles()
    }
  }, [
    startDate,
    endDate,
    state.allArticles,
    state.currentPage,
    state.isLoading,
    state.isLoadingMore,
    hasReachedEnd,
    loadMoreThreshold,
    itemsPerPage,
    applyFilters,
    loadMoreArticles,
  ])

  // Effect para carregar dados iniciais (apenas quando data muda)
  useEffect(() => {
    const loadInitialData = async () => {
      const currentDataParams = `${startDate}-${endDate}`

      if (lastFetchParams.current !== currentDataParams) {
        lastFetchParams.current = currentDataParams
        setOffset(0)
        setHasReachedEnd(false)
        setState((prev) => ({
          ...prev,
          allArticles: [],
          totalCount: 0,
          currentPage: 1,
        }))

        const data = await fetchArticles(0, false)

        if (data.length > 0) {
          setState((prev) => ({
            ...prev,
            allArticles: data,
            totalCount: data.length,
          }))
          setOffset(0)
        }
      }
    }

    void loadInitialData()
  }, [startDate, endDate, fetchArticles])

  // Effect para aplicar filtros e verificar se precisa carregar mais
  useEffect(() => {
    // Aplicar filtros apenas se há artigos carregados
    if (state.allArticles.length > 0) {
      const filteredArticles = applyFilters(state.allArticles)
      const totalPages = Math.ceil(filteredArticles.length / itemsPerPage)

      setState((prev) => ({
        ...prev,
        articles: filteredArticles,
        totalPages,
      }))
    }

    // Verificar se precisa carregar mais dados
    checkIfNeedMoreData()
  }, [
    state.allArticles,
    searchTerm,
    selectedRegion,
    applyFilters,
    itemsPerPage,
    checkIfNeedMoreData,
  ])

  // Calcular artigos paginados
  const paginatedArticles = state.articles.slice(
    (state.currentPage - 1) * itemsPerPage,
    state.currentPage * itemsPerPage,
  )

  // Função para mudar página
  const setCurrentPage = useCallback((page: number) => {
    setState((prev) => ({ ...prev, currentPage: page }))
  }, [])

  // Função para resetar paginação
  const resetPagination = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentPage: 1,
      allArticles: [],
      totalCount: 0,
    }))
    setOffset(0)
    setHasReachedEnd(false)
    lastFetchParams.current = ''
  }, [])

  // Função para alterar ordenação
  const handleSort = useCallback((field: string) => {
    setState((prev) => {
      const newDirection =
        prev.sortConfig.field === field && prev.sortConfig.direction === 'desc' ? 'asc' : 'desc'

      return {
        ...prev,
        sortConfig: { field, direction: newDirection },
        currentPage: 1, // Reset para primeira página
      }
    })
  }, [])

  // Função para atualizar artigos específicos (usado quando artigos relacionados são recalculados)
  const updateArticles = useCallback((updatedArticles: Article[]) => {
    setState((prev) => {
      const updatedAllArticles = [...prev.allArticles]

      // Atualizar cada artigo que foi recalculado
      updatedArticles.forEach((updatedArticle) => {
        const index = updatedAllArticles.findIndex((article) => article.id === updatedArticle.id)
        if (index !== -1) {
          // Atualizar o artigo existente com os novos dados
          updatedAllArticles[index] = {
            ...updatedAllArticles[index],
            totalScore: updatedArticle.totalScore,
            averageScore: updatedArticle.averageScore,
            // Manter outros campos inalterados
          }
        } else {
          // Se o artigo não estiver na lista atual, adicionar (caso raro)
          updatedAllArticles.push(updatedArticle)
        }
      })

      return {
        ...prev,
        allArticles: updatedAllArticles,
      }
    })
  }, [])

  return {
    articles: paginatedArticles,
    allArticles: state.articles,
    isLoading: state.isLoading,
    isLoadingMore: state.isLoadingMore,
    hasMore: !hasReachedEnd,
    currentPage: state.currentPage,
    totalPages: state.totalPages,
    totalCount: state.totalCount,
    sortConfig: state.sortConfig,
    setCurrentPage,
    resetPagination,
    loadMoreArticles,
    handleSort,
    updateArticles, // Nova função para atualizar artigos
  }
}
