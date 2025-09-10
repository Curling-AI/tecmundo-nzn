import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Keyword } from '@/types'
import { cn } from '@/lib/utils'

interface KeywordTableProps {
  keywords: Keyword[]
  isLoading: boolean
  onKeywordClick: (keywordName: string) => void
}

const getScoreColor = (score: number) => {
  if (score > 90) return 'bg-secondary text-secondary-foreground'
  if (score > 80) return 'bg-primary text-primary-foreground'
  return 'bg-muted text-muted-foreground'
}

export const KeywordTable = ({ keywords, isLoading, onKeywordClick }: KeywordTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Keyword</TableHead>
          <TableHead className="text-center">Score Geral</TableHead>
          <TableHead className="hidden text-center md:table-cell">Quantidade</TableHead>
          <TableHead className="hidden text-center md:table-cell">Recência</TableHead>
          <TableHead className="hidden text-center lg:table-cell">Relevância</TableHead>
          <TableHead className="hidden text-center lg:table-cell">Tendência</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className="h-5 w-32" />
                </TableCell>
                <TableCell className="text-center">
                  <Skeleton className="mx-auto h-6 w-10 rounded-full" />
                </TableCell>
                <TableCell className="hidden text-center md:table-cell">
                  <Skeleton className="mx-auto h-5 w-10" />
                </TableCell>
                <TableCell className="hidden text-center md:table-cell">
                  <Skeleton className="mx-auto h-5 w-10" />
                </TableCell>
                <TableCell className="hidden text-center lg:table-cell">
                  <Skeleton className="mx-auto h-5 w-10" />
                </TableCell>
                <TableCell className="hidden text-center lg:table-cell">
                  <Skeleton className="mx-auto h-5 w-10" />
                </TableCell>
              </TableRow>
            ))
          : keywords.map((keyword) => (
              <TableRow
                key={keyword.id}
                onClick={() => onKeywordClick(keyword.name)}
                className="hover:bg-muted/50 cursor-pointer"
              >
                <TableCell className="font-medium">{keyword.name}</TableCell>
                <TableCell className="text-center">
                  <Badge className={cn('font-bold', getScoreColor(keyword.overallScore))}>
                    {keyword.overallScore}
                  </Badge>
                </TableCell>
                <TableCell className="hidden text-center md:table-cell">
                  {keyword.quantityScore}
                </TableCell>
                <TableCell className="hidden text-center md:table-cell">
                  {keyword.recencyScore}
                </TableCell>
                <TableCell className="hidden text-center lg:table-cell">
                  {keyword.relevanceScore}
                </TableCell>
                <TableCell className="hidden text-center lg:table-cell">
                  {keyword.trendScore}
                </TableCell>
              </TableRow>
            ))}
      </TableBody>
    </Table>
  )
}
