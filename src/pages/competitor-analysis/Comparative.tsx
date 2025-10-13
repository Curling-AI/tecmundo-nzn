import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartPayloadItem } from '@/components/ui/chart'
import {
  MOCK_COMPETITORS,
  MOCK_KEYWORD_COMPARISON_STRONG,
  MOCK_KEYWORD_COMPARISON_WEAK,
} from '@/lib/mock-data'
import { KeywordComparison } from '@/types'

const ComparisonChart = ({ title, data }: { title: string; data: KeywordComparison[] }) => (
  <div>
    <h3 className="mb-4 font-semibold">{title}</h3>
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <ChartContainer config={{}} className="h-full w-full">
          <BarChart data={data} layout="vertical" margin={{ left: 20, right: 20 }}>
            <CartesianGrid horizontal={false} />
            <XAxis type="number" hide />
            <YAxis
              dataKey="keyword"
              type="category"
              tickLine={false}
              axisLine={false}
              width={120}
            />
            <ChartTooltip content={<ChartTooltipContent payload={data as ChartPayloadItem[]} />} />
            <Bar dataKey="tecmundoScore" name="TecMundo" fill="var(--primary)" radius={4} />
            <Bar dataKey="competitorScore" name="Concorrente" fill="var(--secondary)" radius={4} />
          </BarChart>
        </ChartContainer>
      </ResponsiveContainer>
    </div>
  </div>
)

const Comparative = () => {
  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle>Comparativo de Keywords</CardTitle>
        <CardDescription>
          Compare a performance de keywords entre o TecMundo e concorrentes para o período
          selecionado.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-end">
          <Select defaultValue="canaltech">
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Selecione um concorrente" />
            </SelectTrigger>
            <SelectContent>
              {MOCK_COMPETITORS.map((c) => (
                <SelectItem key={c.id} value={c.name.toLowerCase()}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <ComparisonChart title="TecMundo > Concorrentes" data={MOCK_KEYWORD_COMPARISON_STRONG} />
          <ComparisonChart title="Concorrentes > TecMundo" data={MOCK_KEYWORD_COMPARISON_WEAK} />
        </div>
      </CardContent>
    </Card>
  )
}

export default Comparative
