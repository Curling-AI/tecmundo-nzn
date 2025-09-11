import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Article } from '@/types'
import { cn } from '@/lib/utils'

interface ArticleCardProps {
  article: Article
  onClick: (article: Article) => void
}

export const getScoreColor = (score: number) => {
  if (score > 7) return 'bg-secondary text-secondary-foreground'
  if (score > 5) return 'bg-primary text-primary-foreground'
  return 'bg-muted text-muted-foreground'
}

export const ArticleCard = ({ article, onClick }: ArticleCardProps) => {
  return (
    <Card onClick={() => onClick(article)} className="cursor-pointer">
      <CardContent className="flex flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-4">
          <h3 className="flex-1 leading-tight font-semibold">{article.title}</h3>
          <Badge className={cn('text-lg font-bold', getScoreColor(article.averageScore))}>
            {article.averageScore.toFixed(2)}
          </Badge>
        </div>
        <div className="text-muted-foreground flex items-center justify-between text-sm">
          <span>{article.source}</span>
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
