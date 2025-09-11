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
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface KeywordTableProps {
  keywords: Keyword[]
  isLoading: boolean
  onKeywordClick: (keywordName: string) => void | Promise<void>
  onSort: (field: string) => void
  getSortIcon: (field: string) => React.ReactNode
}

const getScoreColor = (score: number) => {
  if (score > 90) return 'bg-secondary text-secondary-foreground'
  if (score > 80) return 'bg-primary text-primary-foreground'
  return 'bg-muted text-muted-foreground'
}

export const KeywordTable = ({
  keywords,
  isLoading,
  onKeywordClick,
  onSort,
  getSortIcon,
}: KeywordTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead
            className="hover:bg-muted/50 w-35/100 cursor-pointer transition-colors select-none"
            onClick={() => onSort('name')}
          >
            <div className="flex items-center space-x-1">
              <span>Keyword</span>
              {getSortIcon('name')}
            </div>
          </TableHead>
          <TableHead
            className="hover:bg-muted/50 w-10/100 cursor-pointer text-center transition-colors select-none"
            onClick={() => onSort('overallScore')}
          >
            <div className="flex items-center justify-center space-x-1">
              <span>Score Geral</span>
              {getSortIcon('overallScore')}
            </div>
          </TableHead>
          <TableHead
            className="hover:bg-muted/50 hidden w-10/100 cursor-pointer text-center transition-colors select-none md:table-cell"
            onClick={() => onSort('quantityScore')}
          >
            <div className="flex items-center justify-center space-x-1">
              <span>Quantidade</span>
              {getSortIcon('quantityScore')}
            </div>
          </TableHead>
          <TableHead
            className="hover:bg-muted/50 hidden w-10/100 cursor-pointer text-center transition-colors select-none md:table-cell"
            onClick={() => onSort('recencyScore')}
          >
            <div className="flex items-center justify-center space-x-1">
              <span>Recência</span>
              {getSortIcon('recencyScore')}
            </div>
          </TableHead>
          <TableHead
            className="hover:bg-muted/50 hidden w-10/100 cursor-pointer text-center transition-colors select-none lg:table-cell"
            onClick={() => onSort('relevanceScore')}
          >
            <div className="flex items-center justify-center space-x-1">
              <span>Relevância</span>
              {getSortIcon('relevanceScore')}
            </div>
          </TableHead>
          <TableHead
            className="hover:bg-muted/50 hidden w-10/100 cursor-pointer text-center transition-colors select-none lg:table-cell"
            onClick={() => onSort('trendScore')}
          >
            <div className="flex items-center justify-center space-x-1">
              <span>Tendência</span>
              {getSortIcon('trendScore')}
            </div>
          </TableHead>
          <TableHead
            className="hover:bg-muted/50 hidden w-15/100 cursor-pointer text-center transition-colors select-none lg:table-cell"
            onClick={() => onSort('calculatedAt')}
          >
            <div className="flex items-center justify-center space-x-1">
              <span>Calculado em</span>
              {getSortIcon('calculatedAt')}
            </div>
          </TableHead>
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
                <TableCell className="hidden text-center lg:table-cell">
                  <Skeleton className="mx-auto h-5 w-10" />
                </TableCell>
              </TableRow>
            ))
          : keywords.map((keyword) => (
              <TableRow
                key={keyword.id}
                onClick={() => void onKeywordClick(keyword.name)}
                className="hover:bg-muted/50 cursor-pointer"
              >
                <TableCell className="font-medium">{keyword.name}</TableCell>
                <TableCell className="text-center">
                  <Badge className={cn('font-bold', getScoreColor(keyword.overallScore))}>
                    {keyword.overallScore.toFixed(2)}
                  </Badge>
                </TableCell>
                <TableCell className="hidden text-center md:table-cell">
                  {keyword.quantityScore.toFixed(2)}
                </TableCell>
                <TableCell className="hidden text-center md:table-cell">
                  {keyword.recencyScore.toFixed(2)}
                </TableCell>
                <TableCell className="hidden text-center lg:table-cell">
                  {keyword.relevanceScore.toFixed(2)}
                </TableCell>
                <TableCell className="hidden text-center lg:table-cell">
                  {keyword.trendScore.toFixed(2)}
                </TableCell>
                <TableCell className="hidden text-center lg:table-cell">
                  {keyword.calculatedAt
                    ? formatDistanceToNow(new Date(keyword.calculatedAt), {
                        addSuffix: true,
                        locale: ptBR,
                      })
                    : '-'}
                </TableCell>
              </TableRow>
            ))}
      </TableBody>
    </Table>
  )
}
