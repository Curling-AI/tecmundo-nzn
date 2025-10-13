import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Source } from '@/types'

interface SourceCardProps {
  source: Source
  onClick: (source: Source) => void
}

export const SourceCard = ({ source, onClick }: SourceCardProps) => {
  return (
    <Card onClick={() => onClick(source)} className="cursor-pointer">
      <CardContent className="flex flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h3 className="truncate leading-tight font-semibold">{source.name}</h3>
            <p className="text-muted-foreground mt-1 truncate font-mono text-sm">{source.url}</p>
          </div>
          <Badge
            className="shrink-0 capitalize"
            variant={
              source.type === 'empresa'
                ? 'default'
                : source.type === 'concorrente'
                  ? 'destructive'
                  : 'secondary'
            }
          >
            {source.type || 'externa'}
          </Badge>
        </div>
        <div className="text-muted-foreground flex items-center justify-between text-sm">
          <span>{source.country}</span>
          <span>
            {source.lastRead
              ? formatDistanceToNow(new Date(source.lastRead), {
                  addSuffix: true,
                  locale: ptBR,
                })
              : '-'}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
