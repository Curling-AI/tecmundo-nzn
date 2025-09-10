import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Keyword } from '@/types'
import { cn } from '@/lib/utils'

interface KeywordCardProps {
  keyword: Keyword
  onClick: (keywordName: string) => void
}

const getScoreColor = (score: number) => {
  if (score > 90) return 'bg-secondary text-secondary-foreground'
  if (score > 80) return 'bg-primary text-primary-foreground'
  return 'bg-muted text-muted-foreground'
}

export const KeywordCard = ({ keyword, onClick }: KeywordCardProps) => {
  return (
    <Card onClick={() => onClick(keyword.name)} className="cursor-pointer">
      <CardContent className="flex items-center justify-between gap-4 p-4">
        <h3 className="flex-1 leading-tight font-semibold">{keyword.name}</h3>
        <div className="text-muted-foreground flex flex-col items-end gap-1 text-xs">
          <Badge className={cn('text-base font-bold', getScoreColor(keyword.overallScore))}>
            {keyword.overallScore}
          </Badge>
          <span>Score Geral</span>
        </div>
      </CardContent>
    </Card>
  )
}
