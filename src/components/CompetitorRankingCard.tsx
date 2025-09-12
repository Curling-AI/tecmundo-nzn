import { Card, CardContent } from '@/components/ui/card'
import { Competitor } from '@/types'

interface CompetitorRankingCardProps {
  competitor: Competitor
  rank: number
}

export const CompetitorRankingCard = ({
  competitor,
  rank,
}: CompetitorRankingCardProps) => {
  return (
    <Card>
      <CardContent className="p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="text-lg font-bold text-muted-foreground w-6 text-center">
            {rank}
          </span>
          <h3 className="font-semibold leading-tight flex-1">
            {competitor.name}
          </h3>
        </div>
        <div className="flex flex-col items-end gap-2 text-sm">
          <div className="text-right">
            <p className="font-bold">
              {competitor.avgKeywordPosition.toFixed(1)}
            </p>
            <p className="text-xs text-muted-foreground">Pos. Média</p>
          </div>
          <div className="text-right">
            <p className="font-bold">{competitor.rankedKeywordsCount}</p>
            <p className="text-xs text-muted-foreground">Keywords</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
