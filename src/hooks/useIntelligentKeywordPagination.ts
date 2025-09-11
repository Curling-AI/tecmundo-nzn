import { useState, useEffect, useCallback, useRef } from 'react'
import { Keyword } from '@/types'
import { getKeywords } from '@/services/keywords'

interface UseIntelligentKeywordPaginationProps {
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
  keywords: Keyword[]
  allKeywords: Keyword[]
  isLoading: boolean
  isLoadingMore: boolean
  hasMore: boolean
  currentPage: number
  totalPages: number
  totalCount: number
  sortConfig: SortConfig
}

export function useIntelligentKeywordPagination({
  startDate,
  endDate,
  searchTerm,
  selectedRegion,
  itemsPerPage = 10,
  loadMoreThreshold = 3, // Carrega mais quando restam 3 páginas
}: UseIntelligentKeywordPaginationProps) {
  const [state, setState] = useState<PaginationState>({
    keywords: [],
    allKeywords: [],
    isLoading: true,
    isLoadingMore: false,
    hasMore: true,
    currentPage: 1,
    totalPages: 0,
    totalCount: 0,
    sortConfig: { field: 'overallScore', direction: 'desc' },
  })

  const [offset, setOffset] = useState(0)
  const [hasReachedEnd, setHasReachedEnd] = useState(false)
  const lastFetchParams = useRef<string>('')

  const SUPABASE_LIMIT = 1000

  // Função para buscar keywords com paginação
  const fetchKeywords = useCallback(
    async (currentOffset: number, isLoadMore = false) => {
      try {
        if (isLoadMore) {
          setState((prev) => ({ ...prev, isLoadingMore: true }))
        } else {
          setState((prev) => ({ ...prev, isLoading: true }))
        }

        // Mapear campos de ordenação para os campos do Supabase
        const fieldMapping: Record<string, string> = {
          overallScore: 'overall_score',
          quantityScore: 'quantity_score',
          recencyScore: 'recency_score',
          relevanceScore: 'relevance_score',
          trendScore: 'trending_score',
          calculatedAt: 'calculated_at',
          name: 'keyword_text',
        }

        const supabaseField = fieldMapping[state.sortConfig.field] || 'overall_score'
        const data = await getKeywords(
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
        console.error('Error fetching keywords:', error)
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

  // Função para carregar mais keywords
  const loadMoreKeywords = useCallback(async () => {
    if (state.isLoadingMore || hasReachedEnd) return

    const newOffset = offset + SUPABASE_LIMIT
    const newData = await fetchKeywords(newOffset, true)

    if (newData.length > 0) {
      setState((prev) => ({
        ...prev,
        allKeywords: [...prev.allKeywords, ...newData],
        totalCount: prev.totalCount + newData.length,
      }))
      setOffset(newOffset)
    }
  }, [offset, state.isLoadingMore, hasReachedEnd, fetchKeywords])

  // Função para aplicar filtros e ordenação
  const applyFilters = useCallback(
    (keywords: Keyword[]) => {
      let filtered = [...keywords]

      // Search filter
      if (searchTerm?.trim()) {
        const searchLower = searchTerm.toLowerCase().trim()
        filtered = filtered.filter((keyword) => {
          // Verificar se o campo existe antes de usar toLowerCase
          const name = keyword.name || ''
          return name.toLowerCase().includes(searchLower)
        })
      }

      // Region filter - para keywords, vamos filtrar baseado nos artigos relacionados
      // Por enquanto, vamos manter todas as keywords e filtrar apenas na exibição dos artigos
      // Isso pode ser otimizado no futuro com uma query mais específica

      // Aplicar ordenação local
      return filtered.sort((a, b) => {
        const { field, direction } = state.sortConfig
        let aValue = a[field as keyof Keyword]
        let bValue = b[field as keyof Keyword]

        // Tratar valores undefined/null
        aValue ??= ''
        bValue ??= ''

        // Tratamento especial para campos de data
        if (field === 'calculatedAt') {
          aValue = new Date(aValue).getTime()
          bValue = new Date(bValue).getTime()
        }

        // Tratamento especial para strings
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          aValue = aValue.toLowerCase()
          bValue = bValue.toLowerCase()
        }

        // Tratamento para números
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          // Manter valores numéricos como estão
        }

        if (direction === 'asc') {
          return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
        } else {
          return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
        }
      })
    },
    [searchTerm, state.sortConfig],
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
        allKeywords: [],
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
    const filteredKeywords = applyFilters(state.allKeywords)
    const totalPages = Math.ceil(filteredKeywords.length / itemsPerPage)

    // Se o usuário está próximo do final e ainda há mais dados no Supabase
    if (state.currentPage >= totalPages - loadMoreThreshold && !hasReachedEnd) {
      void loadMoreKeywords()
    }
  }, [
    startDate,
    endDate,
    state.allKeywords,
    state.currentPage,
    state.isLoading,
    state.isLoadingMore,
    hasReachedEnd,
    loadMoreThreshold,
    itemsPerPage,
    applyFilters,
    loadMoreKeywords,
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
          allKeywords: [],
          totalCount: 0,
          currentPage: 1,
        }))

        const data = await fetchKeywords(0, false)

        if (data.length > 0) {
          setState((prev) => ({
            ...prev,
            allKeywords: data,
            totalCount: data.length,
          }))
          setOffset(0)
        }
      }
    }

    void loadInitialData()
  }, [startDate, endDate, fetchKeywords])

  // Effect para aplicar filtros e verificar se precisa carregar mais
  useEffect(() => {
    // Aplicar filtros apenas se há keywords carregadas
    if (state.allKeywords.length > 0) {
      const filteredKeywords = applyFilters(state.allKeywords)
      const totalPages = Math.ceil(filteredKeywords.length / itemsPerPage)

      setState((prev) => ({
        ...prev,
        keywords: filteredKeywords,
        totalPages,
      }))
    }

    // Verificar se precisa carregar mais dados
    checkIfNeedMoreData()
  }, [
    state.allKeywords,
    searchTerm,
    selectedRegion,
    applyFilters,
    itemsPerPage,
    checkIfNeedMoreData,
  ])

  // Calcular keywords paginadas
  const paginatedKeywords = state.keywords.slice(
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
      allKeywords: [],
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

  return {
    keywords: paginatedKeywords,
    allKeywords: state.keywords,
    isLoading: state.isLoading,
    isLoadingMore: state.isLoadingMore,
    hasMore: !hasReachedEnd,
    currentPage: state.currentPage,
    totalPages: state.totalPages,
    totalCount: state.totalCount,
    sortConfig: state.sortConfig,
    setCurrentPage,
    resetPagination,
    loadMoreKeywords,
    handleSort,
  }
}
