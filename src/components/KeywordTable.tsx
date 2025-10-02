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
import { Star } from 'lucide-react'

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

const renderStarRating = (rating: number) => {
  const stars = []
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5

  // Estrelas preenchidas
  for (let i = 0; i < fullStars; i++) {
    stars.push(<Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)
  }

  // Meia estrela se necessário
  if (hasHalfStar) {
    stars.push(
      <Star
        key="half"
        className="h-4 w-4 fill-yellow-400 text-yellow-400"
        style={{
          clipPath: 'polygon(50% 0%, 50% 100%, 0% 100%, 0% 0%)',
        }}
      />,
    )
  }

  // Estrelas vazias para completar 5
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)
  for (let i = 0; i < emptyStars; i++) {
    stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />)
  }

  return (
    <div className="flex items-center gap-0.5">
      {stars}
      <span className="text-muted-foreground ml-1 text-xs">{rating.toFixed(1)}</span>
    </div>
  )
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
            onClick={() => onSort('averageArticleRating')}
          >
            <div className="flex items-center justify-center space-x-1">
              <span>Impacto</span>
              {getSortIcon('averageArticleRating')}
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
        {isLoading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <TableRow key={i}>
              <TableCell>
                <Skeleton className="h-5 w-32" />
              </TableCell>
              <TableCell className="text-center">
                <div className="flex items-center justify-center gap-0.5">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="ml-1 h-3 w-6" />
                </div>
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
        ) : keywords.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} className="py-8 text-center">
              <div className="flex flex-col items-center space-y-2">
                <p className="text-muted-foreground text-sm">Nenhuma keyword encontrada</p>
                <p className="text-muted-foreground text-xs">
                  Tente ajustar os filtros ou checar os créditos na api de keywords
                </p>
              </div>
            </TableCell>
          </TableRow>
        ) : (
          keywords.map((keyword) => (
            <TableRow
              key={keyword.id}
              onClick={() => void onKeywordClick(keyword.name)}
              className="hover:bg-muted/50 cursor-pointer"
            >
              <TableCell className="font-medium">{keyword.name}</TableCell>
              <TableCell className="text-center">
                {renderStarRating(keyword.averageArticleRating)}
              </TableCell>
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
          ))
        )}
      </TableBody>
    </Table>
  )
}
