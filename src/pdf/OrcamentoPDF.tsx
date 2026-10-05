import { Document } from '@react-pdf/renderer'
import './fonts'
import type { Orcamento, TotaisPorPlano } from '@/types/orcamento'
import type { Config } from '@/types/config'
import { PageCapa } from './pages/PageCapa'
import { PageCardapio } from './pages/PageCardapio'
import { PageComparativo } from './pages/PageComparativo'
import { PageUnidade } from './pages/PageUnidade'
import { PageCondicoes } from './pages/PageCondicoes'

export type OrcamentoPDFProps = {
  orcamento: Orcamento
  totais: TotaisPorPlano
  validadeISO: string
  config: Config
}

export function OrcamentoPDF({ orcamento, totais, validadeISO, config }: OrcamentoPDFProps) {
  return (
    <Document title="Orçamento Maná Pizzas" author="Maná Pizzas & Eventos">
      <PageCapa orcamento={orcamento} totais={totais} validadeISO={validadeISO} config={config} />
      <PageCardapio orcamento={orcamento} totais={totais} validadeISO={validadeISO} config={config} />
      <PageComparativo orcamento={orcamento} totais={totais} validadeISO={validadeISO} config={config} />
      <PageUnidade orcamento={orcamento} totais={totais} validadeISO={validadeISO} config={config} />
      <PageCondicoes orcamento={orcamento} totais={totais} validadeISO={validadeISO} config={config} />
    </Document>
  )
}
