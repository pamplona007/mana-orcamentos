import { Document } from '@react-pdf/renderer'
import './fonts'
import type { Orcamento, TotaisPorPlano } from '../types/orcamento'
import { PageCapaPrint } from './print/PageCapaPrint'
import { PageCardapioPrint } from './print/PageCardapioPrint'
import { PageComparativoPrint } from './print/PageComparativoPrint'
import { PageUnidadePrint } from './print/PageUnidadePrint'
import { PageCondicoesPrint } from './print/PageCondicoesPrint'

export type OrcamentoPDFPrintProps = {
  orcamento: Orcamento
  totais: TotaisPorPlano
  validadeISO: string
}

export function OrcamentoPDFPrint({ orcamento, totais, validadeISO }: OrcamentoPDFPrintProps) {
  return (
    <Document title="Orçamento Maná Pizzas (P&B)" author="Maná Pizzas & Eventos">
      <PageCapaPrint orcamento={orcamento} totais={totais} validadeISO={validadeISO} />
      <PageCardapioPrint orcamento={orcamento} totais={totais} validadeISO={validadeISO} />
      <PageComparativoPrint orcamento={orcamento} totais={totais} validadeISO={validadeISO} />
      <PageUnidadePrint orcamento={orcamento} totais={totais} validadeISO={validadeISO} />
      <PageCondicoesPrint orcamento={orcamento} totais={totais} validadeISO={validadeISO} />
    </Document>
  )
}
