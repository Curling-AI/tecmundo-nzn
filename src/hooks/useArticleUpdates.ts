import { useCallback } from 'react'
import { Article } from '@/types'
import { recalculateArticleScores } from '@/services/articles'

interface UseArticleUpdatesProps {
  updateArticles: (updatedArticles: Article[]) => void
}

/**
 * Hook para gerenciar atualizações de artigos relacionados
 * quando um rating é salvo
 */
export function useArticleUpdates({ updateArticles }: UseArticleUpdatesProps) {
  /**
   * Atualiza artigos relacionados baseado no ID do artigo avaliado
   */
  const updateRelatedArticles = useCallback(
    async (articleId: string, start_date?: string, end_date?: string) => {
      try {        
        // Buscar artigos relacionados que precisam ser atualizados
        const relatedArticles = await recalculateArticleScores(articleId, start_date, end_date)
        
        if (relatedArticles.length > 0) {          
          // Atualizar os artigos no estado
          updateArticles(relatedArticles)  
        } else {
        }
      } catch (error) {
        console.error('❌ Erro ao atualizar artigos relacionados:', error)
        throw error
      }
    },
    [updateArticles]
  )

  return {
    updateRelatedArticles,
  }
}
