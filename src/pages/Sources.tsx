import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { RegionFilter } from '@/components/RegionFilter'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Source } from '@/types'
import { getSources } from '@/services/sources'

export default function Sources() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRegion, setSelectedRegion] = useState('all')
  const [sources, setSources] = useState<Source[]>([])

  useEffect(() => {
    getSources().then(setSources).catch(console.error)
  }, [])

  const filteredSources = sources.filter((source) => {
    const matchesSearch =
      source.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      source.url.toLowerCase().includes(searchTerm.toLowerCase())

    // Region filter - mesma lógica do useIntelligentPagination
    if (selectedRegion !== 'all') {
      const country = source.country || ''
      const continent = source.continent || ''

      const countryLower = country.toLowerCase()
      const continentLower = continent.toLowerCase()

      switch (selectedRegion) {
        case 'brasil':
          return countryLower === 'brazil' || countryLower === 'brasil'
        case 'internacional':
          return countryLower !== 'brazil' && countryLower !== 'brasil'
        case 'america-do-sul':
          return continentLower === 'south america' || continentLower === 'américa do sul'
        case 'america-do-norte':
          return continentLower === 'north america' || continentLower === 'américa do norte'
        case 'africa':
          return continentLower === 'africa' || continentLower === 'áfrica'
        case 'europa':
          return continentLower === 'europe' || continentLower === 'europa'
        case 'asia':
          return continentLower === 'asia' || continentLower === 'ásia'
        case 'oceania':
          return continentLower === 'oceania'
        default:
          return true
      }
    }

    return matchesSearch
  })

  return (
    <div className="container mx-auto space-y-6 py-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Fontes dos Artigos</h1>
        <p className="text-muted-foreground">
          Gerencie e monitore as fontes de notícias de tecnologia utilizadas no sistema.
        </p>
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
          <Input
            placeholder="Buscar fontes por nome ou URL..."
            className="bg-card pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <RegionFilter selectedRegion={selectedRegion} onRegionChange={setSelectedRegion} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Fontes</CardTitle>
          <CardDescription>{filteredSources.length} fonte(s) encontrada(s)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-60/100">Fonte</TableHead>
                  <TableHead className="w-20/100 text-center">País</TableHead>
                  <TableHead className="w-20/100 text-right">Última Leitura</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSources.map((source) => (
                  <TableRow key={source.id}>
                    <TableCell className="w-60/100 truncate font-medium text-ellipsis">
                      <div className="space-y-1">
                        <div className="font-semibold">{source.name}</div>
                        <div className="text-muted-foreground font-mono text-sm">
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            {source.url}
                          </a>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="w-20/100 text-center">{source.country}</TableCell>
                    <TableCell className="w-20/100 text-right">
                      {source.lastRead
                        ? formatDistanceToNow(new Date(source.lastRead), {
                            addSuffix: true,
                            locale: ptBR,
                          })
                        : '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
