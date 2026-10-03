import { Document } from '@react-pdf/renderer'
import './fonts'
import type { Orcamento, TotaisPorPlano } from '@/types/orcamento'
import { PageCapa } from './pages/PageCapa'
import { PageCardapio } from './pages/PageCardapio'
import { PageComparativo } from './pages/PageComparativo'
import { PageUnidade } from './pages/PageUnidade'
import { PageCondicoes } from './pages/PageCondicoes'

export type OrcamentoPDFProps = {
  orcamento: Orcamento
  totais: TotaisPorPlano
  validadeISO: string
}

export function OrcamentoPDF({ orcamento, totais, validadeISO }: OrcamentoPDFProps) {
  return (
    <Document title="Orçamento Maná Pizzas" author="Maná Pizzas & Eventos">
      <PageCapa orcamento={orcamento} totais={totais} validadeISO={validadeISO} />
      <PageCardapio orcamento={orcamento} totais={totais} validadeISO={validadeISO} />
      <PageComparativo orcamento={orcamento} totais={totais} validadeISO={validadeISO} />
      <PageUnidade orcamento={orcamento} totais={totais} validadeISO={validadeISO} />
      <PageCondicoes orcamento={orcamento} totais={totais} validadeISO={validadeISO} />
    </Document>
  )
}
