import { useState, useMemo } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { MOCK_COMPETITORS } from '@/lib/mock-data'
import { AppPagination } from '@/components/AppPagination'
import { CompetitorRankingCard } from '@/components/CompetitorRankingCard'

const ITEMS_PER_PAGE = 10

const Ranking = () => {
  const [currentPage, setCurrentPage] = useState(1)

  const sortedCompetitors = useMemo(() => {
    return [...MOCK_COMPETITORS].sort(
      (a, b) => a.avgKeywordPosition - b.avgKeywordPosition,
    )
  }, [])

  const paginatedCompetitors = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    return sortedCompetitors.slice(startIndex, endIndex)
  }, [sortedCompetitors, currentPage])

  const totalPages = Math.ceil(sortedCompetitors.length / ITEMS_PER_PAGE)

  return (
    <div className="space-y-6">
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle>Ranking de Concorrentes por Keywords</CardTitle>
          <CardDescription>
            Posição média e volume de keywords ranqueadas para o período
            selecionado.
          </CardDescription>
        </CardHeader>
        {/* Desktop View */}
        <div className="hidden md:block">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">Rank</TableHead>
                  <TableHead>Concorrente</TableHead>
                  <TableHead className="text-center">Posição Média</TableHead>
                  <TableHead className="text-center">
                    Keywords Rankeadas
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedCompetitors.map((c, index) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-bold text-muted-foreground">
                      {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                    </TableCell>
                    <TableCell className="font-medium">{c.name}</TableCell>
                    <TableCell className="text-center">
                      {c.avgKeywordPosition.toFixed(1)}
                    </TableCell>
                    <TableCell className="text-center">
                      {c.rankedKeywordsCount}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </div>
        {/* Mobile View */}
        <div className="md:hidden">
          <CardContent className="p-4 space-y-4">
            {paginatedCompetitors.map((c, index) => (
              <CompetitorRankingCard
                key={c.id}
                competitor={c}
                rank={(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
              />
            ))}
          </CardContent>
        </div>
      </Card>
      <AppPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  )
}

export default Ranking
