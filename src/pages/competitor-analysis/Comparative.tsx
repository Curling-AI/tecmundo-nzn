import { useState, useEffect } from 'react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  ChartContainer,
  ChartPayload,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { getSources, getSEOComparative } from '@/services/sources'
import { KeywordComparison, Source, SEOComparative } from '@/types'
import { useDateFilter } from '@/store/dateFilter'

// Helper function to extract domain name from URL
const extractDomainName = (url: string): string => {
  try {
    const regex = /^https?:\/\/(?:www\.)?([^/]+)/i
    const match = regex.exec(url)
    if (!match) return url
    const domain = match[1]
    const domainWithoutTld = domain.replace(/\.com\.br$/, '.com').replace(/\.[^.]+$/, '')
    return domainWithoutTld
  } catch {
    return url
  }
}

// Helper function to transform SEO data into KeywordComparison format
const transformSEODataToComparison = (
  seoData: SEOComparative[],
  selectedCompetitor: string,
): KeywordComparison[] => {
  const tecmundoData = seoData.find((item) => item.sourceType === 'empresa')

  // Find competitor data by matching domain name
  const competitorData = seoData.find((item) => {
    const domainName = extractDomainName(item.source)
    return domainName === selectedCompetitor
  })

  if (!tecmundoData || !competitorData) {
    return []
  }

  // Create comparison data based on SEO metrics
  return [
    {
      keyword: 'Score Geral',
      tecmundoScore: tecmundoData.score,
      competitorScore: competitorData.score,
    },
    {
      keyword: 'Erros',
      tecmundoScore: tecmundoData.errors,
      competitorScore: competitorData.errors,
    },
    {
      keyword: 'Avisos',
      tecmundoScore: tecmundoData.warnings,
      competitorScore: competitorData.warnings,
    },
    {
      keyword: 'Contagem de Palavras',
      tecmundoScore: tecmundoData.textWordCount,
      competitorScore: competitorData.textWordCount,
    },
    {
      keyword: 'Taxa de Texto',
      tecmundoScore: tecmundoData.textRate * 100,
      competitorScore: competitorData.textRate * 100,
    },
    {
      keyword: 'ARI (Automated Readability)',
      tecmundoScore: tecmundoData.ari,
      competitorScore: competitorData.ari,
    },
    {
      keyword: 'Coleman-Liau',
      tecmundoScore: tecmundoData.colemanLiau,
      competitorScore: competitorData.colemanLiau,
    },
    {
      keyword: 'Dale-Chall',
      tecmundoScore: tecmundoData.daleChall,
      competitorScore: competitorData.daleChall,
    },
    {
      keyword: 'Flesch-Kincaid',
      tecmundoScore: tecmundoData.fleschKincaid,
      competitorScore: competitorData.fleschKincaid,
    },
    {
      keyword: 'SMOG',
      tecmundoScore: tecmundoData.smog,
      competitorScore: competitorData.smog,
    },
    {
      keyword: 'Consistência de Descrição',
      tecmundoScore: tecmundoData.descConsistency * 100,
      competitorScore: competitorData.descConsistency * 100,
    },
    {
      keyword: 'Consistência de Título',
      tecmundoScore: tecmundoData.titleConsistency * 100,
      competitorScore: competitorData.titleConsistency * 100,
    },
  ]
}

const ComparisonChart = ({ title, data }: { title: string; data: KeywordComparison[] }) => (
  <div>
    <h3 className="mb-4 font-semibold">{title}</h3>
    <div className="space-y-4">
      {data.map((item) => (
        <div key={item.keyword} className="h-[120px]">
          <ResponsiveContainer width="100%" height="100%">
            <ChartContainer config={{}} className="h-full w-full">
              <BarChart data={[item]} layout="vertical" margin={{ left: 20, right: 20 }}>
                <CartesianGrid horizontal={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="keyword" type="category" tickLine={false} axisLine={false} />
                <ChartTooltip
                  content={
                    <ChartTooltipContent payload={[{ payload: item }] as unknown as ChartPayload} />
                  }
                />
                <Bar dataKey="tecmundoScore" name="TecMundo" fill="var(--primary)" radius={4} />
                <Bar
                  dataKey="competitorScore"
                  name="Concorrente"
                  fill="var(--secondary)"
                  radius={4}
                />
              </BarChart>
            </ChartContainer>
          </ResponsiveContainer>
        </div>
      ))}
    </div>
  </div>
)

const Comparative = () => {
  const [sources, setSources] = useState<Source[]>([])
  const [seoData, setSeoData] = useState<SEOComparative[]>([])
  const [selectedCompetitor, setSelectedCompetitor] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { date } = useDateFilter()

  // Load sources on component mount
  useEffect(() => {
    const loadSources = async () => {
      try {
        const sourcesData = await getSources()
        setSources(sourcesData)
        // Set first competitor as default
        const competitors = sourcesData.filter((source) => source.type === 'concorrente')
        if (competitors.length > 0) {
          setSelectedCompetitor(competitors[0].name)
        }
      } catch (err) {
        setError('Erro ao carregar fontes de dados')
        console.error('Error loading sources:', err)
      }
    }
    loadSources()
      .then(() => {
        setIsLoading(false)
      })
      .catch((err) => {
        setError('Erro ao carregar fontes de dados')
        console.error('Error loading sources:', err)
      })
  }, [])

  // Load SEO data when dates change (not when competitor changes)
  useEffect(() => {
    if (!date?.from || !date?.to) return

    const loadSEOData = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const fromDate = date.from
        const toDate = date.to
        if (!fromDate || !toDate) return

        const seoDataResult = await getSEOComparative(fromDate.toISOString(), toDate.toISOString())
        setSeoData(seoDataResult)
      } catch (err) {
        setError('Erro ao carregar dados de SEO')
        console.error('Error loading SEO data:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadSEOData()
      .then(() => {
        setIsLoading(false)
      })
      .catch((err) => {
        setError('Erro ao carregar dados de SEO')
        console.error('Error loading SEO data:', err)
      })
  }, [date])

  const competitors = sources.filter((source) => source.type === 'concorrente')
  const comparisonData = transformSEODataToComparison(seoData, selectedCompetitor)

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle>Comparativo de SEO</CardTitle>
        <CardDescription>
          Compare a performance de SEO entre o TecMundo e concorrentes para o período selecionado.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-end">
          <Select value={selectedCompetitor} onValueChange={setSelectedCompetitor}>
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Selecione um concorrente" />
            </SelectTrigger>
            <SelectContent>
              {competitors.map((competitor) => (
                <SelectItem key={competitor.id} value={competitor.name}>
                  {competitor.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {error && (
          <div className="bg-destructive/15 text-destructive rounded-md p-3 text-sm">{error}</div>
        )}

        {isLoading ? (
          <div className="flex h-[600px] items-center justify-center">
            <div className="text-muted-foreground">Carregando dados...</div>
          </div>
        ) : !selectedCompetitor ? (
          <div className="flex h-[600px] items-center justify-center">
            <div className="text-muted-foreground">
              Selecione um concorrente para visualizar a comparação
            </div>
          </div>
        ) : comparisonData.length > 0 ? (
          <ComparisonChart title="TecMundo vs Concorrentes" data={comparisonData} />
        ) : (
          <div className="flex h-[600px] items-center justify-center">
            <div className="text-muted-foreground">
              Nenhum dado disponível para o período selecionado
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default Comparative
