import { ArrowLeft, ExternalLink } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Article } from '@/types'

interface KeywordArticleListProps {
  keyword: string
  articles: Article[]
  onBack: () => void
}

export const KeywordArticleList = ({ keyword, articles, onBack }: KeywordArticleListProps) => {
  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Artigos para &quot;{keyword}&quot;</CardTitle>
            <CardDescription>Lista de artigos relacionados à keyword selecionada.</CardDescription>
          </div>
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead className="hidden md:table-cell">Fonte</TableHead>
              <TableHead className="text-right">Data</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {articles.length > 0 ? (
              articles.map((article) => (
                <TableRow key={article.id}>
                  <TableCell className="max-w-sm truncate font-medium">
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary flex items-center gap-2 hover:underline"
                    >
                      {article.title}
                      <ExternalLink className="h-4 w-4 flex-shrink-0" />
                    </a>
                  </TableCell>
                  <TableCell className="text-muted-foreground hidden md:table-cell">
                    {article.source}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-right">
                    {formatDistanceToNow(new Date(article.publishedAt), {
                      addSuffix: true,
                      locale: ptBR,
                    })}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-muted-foreground py-8 text-center">
                  Nenhum artigo encontrado para esta keyword.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
