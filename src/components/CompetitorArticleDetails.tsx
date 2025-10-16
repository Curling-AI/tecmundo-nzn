import { useNavigate } from 'react-router-dom'
import { ExternalLink, Tag, CheckCircle, XCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { CompetitorArticle } from '@/types'

interface CompetitorArticleDetailsProps {
  article: CompetitorArticle | null
  isOpen: boolean
  onClose: () => void
}

export const CompetitorArticleDetails = ({
  article,
  isOpen,
  onClose,
}: CompetitorArticleDetailsProps) => {
  const navigate = useNavigate()

  if (!article) return null

  const handleKeywordClick = (keyword: string) => {
    onClose()
    void navigate(`/analise-de-keywords?k=${encodeURIComponent(keyword)}`)
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
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
                <strong>Fonte:</strong> {article.source}
              </p>
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
            <h3 className="mb-2 font-semibold">Pontuação SEO</h3>
            <div className="flex items-center gap-4">
              <div>
                <p className="text-muted-foreground text-sm">Score SEO</p>
                <p className="text-primary text-3xl font-bold">{article.seoScore}</p>
              </div>
            </div>
          </div>

          {Object.keys(article.metrics).length > 0 && (
            <div>
              <h3 className="mb-2 font-semibold">Métricas SEO</h3>
              <div className="space-y-2">
                {Object.entries(article.metrics).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-muted-foreground text-sm capitalize">
                      {key
                        .replace(/_/g, ' ')
                        .replace(/([A-Z])/g, ' $1')
                        .trim()}
                    </span>
                    <Badge variant="outline">{value}</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {Object.keys(article.checks).length > 0 && (
            <div>
              <h3 className="mb-2 font-semibold">Verificações SEO</h3>
              <div className="space-y-2">
                {Object.entries(article.checks).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-muted-foreground text-sm capitalize">
                      {key
                        .replace(/_/g, ' ')
                        .replace(/([A-Z])/g, ' $1')
                        .trim()}
                    </span>
                    <div className="flex items-center gap-2">
                      {value ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

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
        </div>
      </SheetContent>
    </Sheet>
  )
}
