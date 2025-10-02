import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import QuantityScoreFormula from '@/assets/quantity_score_formula.svg'
import RecencyScoreFormula from '@/assets/recency_score_formula.svg'
import RelevanceScoreFormula from '@/assets/relevance_score_formula.svg'
import TrendScoreFormula from '@/assets/trend_score_formula.svg'

export default function About() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-foreground mb-4 text-4xl font-bold">Sobre</h1>
          <p className="text-muted-foreground text-lg">
            Entenda como funcionam as pontuações de keywords e artigos em nosso sistema
          </p>
        </div>

        <Separator />

        <section className="space-y-6">
          <h2 className="text-foreground text-3xl font-semibold">Pontuação das Keywords</h2>

          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-primary text-xl">Pontuação de Quantidade</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  A pontuação de quantidade reflete o número de artigos e notícias encontrados cujo
                  conteúdo se encaixa na keyword.
                </p>
                <p className="font-medium">A fórmula para calcular tal pontuação será:</p>
                <div className="bg-muted flex items-center justify-center rounded-lg p-4">
                  <img src={QuantityScoreFormula} alt="∑ᵢ 1,25⁻ᵈⁱ" />
                </div>
                <p className="text-muted-foreground text-sm">
                  Sendo <span className="font-mono">dᵢ</span> igual a diferença em dias da data
                  atual e da data de publicação do i-ésimo artigo que se encaixa na keyword.
                </p>
                <p className="text-sm">
                  Utilizando tal método os artigos publicados mais recentemente terão peso maior na
                  pontuação de quantidade da keyword.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-primary text-xl">Pontuação de Recência</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  A pontuação de recência representa o quão recentemente surgiram notícias que se
                  encaixam nessa keyword. Assim haverá um ganho de pontuação para assuntos novos.
                </p>
                <p className="font-medium">A fórmula para o cálculo de tal pontuação é:</p>
                <div className="bg-muted flex items-center justify-center rounded-lg p-4">
                  <img src={RecencyScoreFormula} alt="10 / 1,25ᵈ" />
                </div>
                <p className="text-muted-foreground text-sm">
                  Sendo <span className="font-mono">d</span> igual a diferença em dias da data atual
                  e da data em que foi cadastrada a primeira notícia que apresenta essa keyword.
                </p>
                <p className="text-sm">
                  Quanto mais dias se passarem desde o surgimento da keyword, menor será sua
                  pontuação de recência.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-primary text-xl">Pontuação de Relevância</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  A pontuação de relevância representa a ordem de grandeza do volume médio de
                  pesquisas no Google da keyword.
                </p>
                <p className="text-sm">
                  Para obtenção dessa métrica utiliza-se da API (Interface de Programação de
                  Aplicações) do DataForSEO.
                </p>
                <p className="text-sm">
                  Obtém-se com a chamada da API o volume médio de pesquisas da keyword (
                  <span className="font-mono">V̄</span>). Por fim, a pontuação de relevância é
                  calculada por:
                </p>
                <div className="bg-muted flex items-center justify-center rounded-lg p-4">
                  <img src={RelevanceScoreFormula} alt="log₁₀ V̄" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-primary text-xl">Pontuação de Tendência</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  A pontuação de tendência é utilizada para refletir se há um aumento percentual no
                  volume de buscas de uma keyword nas últimas horas.
                </p>
                <p className="text-sm">
                  Utilizando-se a mesma API mencionada anteriormente obtém-se o valor percentual do
                  número de pesquisas a cada hora em relação ao valor máximo na última semana.
                </p>
                <p className="text-sm">
                  Então, com o valor percentual médio (<span className="font-mono">M̄</span>) e o
                  valor percentual de pesquisas na última hora (
                  <span className="font-mono">M₀</span>) calcula-se a pontuação de tendência por
                  meio de:
                </p>
                <div className="bg-muted flex items-center justify-center rounded-lg p-4">
                  <img src={TrendScoreFormula} alt="(M₀ - M̄) / 10" />
                </div>
                <p className="text-sm">
                  Esta pontuação pode ser negativa, indicando uma diminuição da busca por essa
                  keyword nas últimas horas.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-primary text-xl">Pontuação Geral</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  A pontuação geral é calculada por meio da média ponderada das outras pontuações.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-primary text-xl">Avaliação de Impacto</CardTitle>
              </CardHeader>
              <CardContent className="displ space-y-4">
                <p className="text-muted-foreground">
                  A avaliação de impacto é um fator multiplicador aplicado à pontuação geral da
                  keyword baseado no impacto dos artigos publicados baseados nela.
                </p>
                <p className="text-sm">
                  Dependendo do valor médio da avaliação para artigos com aquela keyword, a
                  pontuação geral é multiplicada por um fator específico:
                </p>
                <div className="bg-muted rounded-lg p-4">
                  <div className="grid grid-cols-1 gap-2 text-sm">
                    <div>
                      <span className="font-mono">5:</span>
                      <span className="font-semibold">x1.5</span>
                    </div>
                    <div>
                      <span className="font-mono">4:</span>
                      <span className="font-semibold">x1.25</span>
                    </div>
                    <div>
                      <span className="font-mono">3:</span>
                      <span className="font-semibold">x1.0</span>
                    </div>
                    <div>
                      <span className="font-mono">2:</span>
                      <span className="font-semibold">x0.75</span>
                    </div>
                    <div>
                      <span className="font-mono">1:</span>
                      <span className="font-semibold">x0.5</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm">
                  Keywords com artigos de maior qualidade recebem um boost na pontuação, enquanto
                  aquelas com conteúdo de menor qualidade têm sua pontuação reduzida.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        <section className="space-y-6">
          <h2 className="text-foreground text-3xl font-semibold">Pontuação dos Artigos</h2>
          <p className="text-muted-foreground">
            As pontuações dos artigos são baseadas nas pontuações das keywords em que o artigo se
            encaixa.
          </p>

          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-primary text-xl">Pontuação Total</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  É a soma das pontuações de todas as keywords em que o artigo se encaixa
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-primary text-xl">
                  Pontuação Média, ou Apenas Pontuação
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Média das pontuações de todas as keywords em que o artigo se encaixa.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  )
}
