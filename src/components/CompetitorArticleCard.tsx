import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CompetitorArticle } from '@/types'

interface CompetitorArticleCardProps {
  article: CompetitorArticle
  onClick: (article: CompetitorArticle) => void
}

export const CompetitorArticleCard = ({ article, onClick }: CompetitorArticleCardProps) => {
  return (
    <Card onClick={() => onClick(article)} className="cursor-pointer">
      <CardContent className="flex flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-4">
          <h3 className="flex-1 leading-tight font-semibold">{article.title}</h3>
          <Badge variant="secondary" className="text-base">
            {article.seoScore}
          </Badge>
        </div>
        <div className="text-muted-foreground flex items-center justify-between text-sm">
          <span>{article.competitorName}</span>
          <span>
            {formatDistanceToNow(new Date(article.publishedAt), {
              addSuffix: true,
              locale: ptBR,
            })}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
