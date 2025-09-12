import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CompetitorArticle } from '@/types'

interface CompetitorArticleCardProps {
  article: CompetitorArticle
  onClick: (article: CompetitorArticle) => void
}

export const CompetitorArticleCard = ({
  article,
  onClick,
}: CompetitorArticleCardProps) => {
  return (
    <Card onClick={() => onClick(article)} className="cursor-pointer">
      <CardContent className="p-4 flex flex-col gap-2">
        <div className="flex justify-between items-start gap-4">
          <h3 className="font-semibold leading-tight flex-1">
            {article.title}
          </h3>
          <Badge variant="secondary" className="text-base">
            {article.seoScore}
          </Badge>
        </div>
        <div className="flex justify-between items-center text-sm text-muted-foreground">
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
