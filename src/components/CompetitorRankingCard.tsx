import { Card, CardContent } from '@/components/ui/card'
import { Competitor } from '@/types'

interface CompetitorRankingCardProps {
  competitor: Competitor
  rank: number
}

export const CompetitorRankingCard = ({ competitor, rank }: CompetitorRankingCardProps) => {
  return (
    <Card>
      <CardContent className="flex items-center justify-between gap-4 p-4">
        <div className="flex items-center gap-4">
          <span className="text-muted-foreground w-6 text-center text-lg font-bold">{rank}</span>
          <h3 className="flex-1 leading-tight font-semibold">{competitor.name}</h3>
        </div>
        <div className="flex flex-col items-end gap-2 text-sm">
          <div className="text-right">
            <p className="font-bold">{competitor.avgKeywordPosition.toFixed(1)}</p>
            <p className="text-muted-foreground text-xs">Pos. Média</p>
          </div>
          <div className="text-right">
            <p className="font-bold">{competitor.rankedKeywordsCount}</p>
            <p className="text-muted-foreground text-xs">Keywords</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
