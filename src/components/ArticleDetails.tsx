import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ExternalLink, Tag } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { StarRating } from '@/components/StarRating'
import { toast } from '@/hooks/use-toast'
import { Article } from '@/types'
import { saveArticleRating } from '@/services/articles'

interface ArticleDetailsProps {
  article: Article | null
  isOpen: boolean
  onClose: () => void
}

export const ArticleDetails = ({ article, isOpen, onClose }: ArticleDetailsProps) => {
  const navigate = useNavigate()
  const [rating, setRating] = useState(0)

  if (!article) return null

  const handleKeywordClick = (keyword: string) => {
    onClose()
    void navigate(`/analise-de-keywords?k=${encodeURIComponent(keyword)}`)
  }

  const handleSaveRating = async () => {
    // Mock saving rating
    try {
      await saveArticleRating(article.id, rating)
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

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-2xl">{article.title}</SheetTitle>
          <SheetDescription>
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary flex items-center gap-2 hover:underline"
            >
              Ver artigo original <ExternalLink className="h-4 w-4" />
            </a>
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-6">
          <div>
            <h3 className="mb-2 font-semibold">Detalhes</h3>
            <div className="text-muted-foreground space-y-1 text-sm">
              <p>
                <strong>Data:</strong> {new Date(article.publishedAt).toLocaleString('pt-BR')}
              </p>
              <p>
                <strong>País:</strong> {article.country}
              </p>
              <p>
                <strong>Continente:</strong> {article.continent}
              </p>
            </div>
          </div>
          <div>
            <h3 className="mb-2 font-semibold">Pontuação</h3>
            <div className="flex items-center gap-4">
              <div>
                <p className="text-muted-foreground text-sm">Total</p>
                <p className="text-primary text-3xl font-bold">{article.totalScore.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Média</p>
                <p className="text-3xl font-bold">{article.averageScore.toFixed(2)}</p>
              </div>
            </div>
          </div>
          <div>
            <h3 className="mb-2 flex items-center gap-2 font-semibold">
              <Tag className="h-4 w-4" /> Keywords
            </h3>
            <div className="flex flex-wrap gap-2">
              {article.keywords.map((keyword) => (
                <Badge
                  key={keyword}
                  variant="outline"
                  className="hover:bg-accent cursor-pointer"
                  onClick={() => handleKeywordClick(keyword)}
                >
                  {keyword}
                </Badge>
              ))}
            </div>
          </div>
          <div className="border-t pt-6">
            <h3 className="mb-2 font-semibold">
              Avalie a qualidade desta pauta para treinamento de IA:
            </h3>
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <StarRating onRatingChange={setRating} />
              <Button
                onClick={() => void handleSaveRating()}
                disabled={rating === 0}
                className="w-full sm:w-auto"
              >
                Salvar Avaliação
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
