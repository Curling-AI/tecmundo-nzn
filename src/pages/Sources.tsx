import { useEffect, useState } from 'react'
import { Search, Plus } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
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
import { SourceDetails } from '@/components/SourceDetails'
import { SourceCard } from '@/components/SourceCard'
import { Skeleton } from '@/components/ui/skeleton'

export default function Sources() {
  const [selectedSource, setSelectedSource] = useState<Source | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRegion, setSelectedRegion] = useState('all')
  const [sources, setSources] = useState<Source[]>([])
  const [isCreateMode, setIsCreateMode] = useState(false)

  useEffect(() => {
    getSources().then(setSources).catch(console.error)
  }, [])

  const renderDesktopSkeletons = () =>
    Array.from({ length: 5 }).map((_, i) => (
      <TableRow key={i}>
        <TableCell className="w-50/100">
          <Skeleton className="h-5 w-full" />
        </TableCell>
        <TableCell className="w-15/100">
          <Skeleton className="h-5 w-full" />
        </TableCell>
        <TableCell className="w-15/100">
          <Skeleton className="h-5 w-full" />
        </TableCell>
        <TableCell className="w-20/100">
          <Skeleton className="h-5 w-full" />
        </TableCell>
      </TableRow>
    ))

  const renderMobileSkeletons = () =>
    Array.from({ length: 5 }).map((_, i) => (
      <Card key={i}>
        <CardContent className="p-4">
          <div className="mb-3 flex items-start justify-between gap-4">
            <div className="flex-1">
              <Skeleton className="mb-2 h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
            </div>
            <Skeleton className="h-6 w-16" />
          </div>
          <div className="flex justify-between">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        </CardContent>
      </Card>
    ))

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
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Fontes dos Artigos</h1>
            <p className="text-muted-foreground">
              Gerencie e monitore as fontes de notícias de tecnologia utilizadas no sistema.
            </p>
          </div>
          <Button onClick={() => setIsCreateMode(true)} className="w-full md:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Fonte
          </Button>
        </div>
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

      {/* Desktop View */}
      <div className="hidden md:block">
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
                    <TableHead className="w-50/100">Fonte</TableHead>
                    <TableHead className="w-15/100 text-center">Tipo</TableHead>
                    <TableHead className="w-15/100 text-center">País</TableHead>
                    <TableHead className="w-20/100 text-right">Última Leitura</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sources.length === 0 ? (
                    renderDesktopSkeletons()
                  ) : filteredSources.length > 0 ? (
                    filteredSources.map((source) => (
                      <TableRow
                        className="cursor-pointer"
                        key={source.id}
                        onClick={() => setSelectedSource(source)}
                      >
                        <TableCell className="w-50/100 truncate font-medium text-ellipsis">
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
                        <TableCell className="w-15/100 text-center">
                          <Badge
                            className="capitalize"
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
                        </TableCell>
                        <TableCell className="w-15/100 text-center">{source.country}</TableCell>
                        <TableCell className="w-20/100 text-right">
                          {source.lastRead
                            ? formatDistanceToNow(new Date(source.lastRead), {
                                addSuffix: true,
                                locale: ptBR,
                              })
                            : '-'}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-muted-foreground py-8 text-center">
                        Nenhuma fonte encontrada.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mobile View */}
      <div className="space-y-4 md:hidden">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Fontes</h2>
          <span className="text-muted-foreground text-sm">{filteredSources.length} fonte(s)</span>
        </div>

        {sources.length === 0 ? (
          renderMobileSkeletons()
        ) : filteredSources.length > 0 ? (
          filteredSources.map((source) => (
            <SourceCard key={source.id} source={source} onClick={setSelectedSource} />
          ))
        ) : (
          <Card>
            <CardContent className="text-muted-foreground p-8 text-center">
              Nenhuma fonte encontrada.
            </CardContent>
          </Card>
        )}
      </div>
      <SourceDetails
        source={selectedSource}
        isOpen={!!selectedSource || isCreateMode}
        onClose={() => {
          setSelectedSource(null)
          setIsCreateMode(false)
        }}
        mode={isCreateMode ? 'create' : selectedSource ? 'view' : 'view'}
        onSourceUpdated={(updatedSource) => {
          setSources((prev) =>
            prev.map((source) => (source.id === updatedSource.id ? updatedSource : source)),
          )
          setSelectedSource(updatedSource)
        }}
        onSourceCreated={(newSource) => {
          setSources((prev) => [newSource, ...prev])
          setSelectedSource(newSource)
          setIsCreateMode(false)
        }}
      />
    </div>
  )
}
