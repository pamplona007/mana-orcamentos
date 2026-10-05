import { Document } from '@react-pdf/renderer'
import './fonts'
import type { Orcamento, TotaisPorPlano } from '../types/orcamento'
import type { Config } from '../types/config'
import { PageCapaPrint } from './print/PageCapaPrint'
import { PageCardapioPrint } from './print/PageCardapioPrint'
import { PageComparativoPrint } from './print/PageComparativoPrint'
import { PageUnidadePrint } from './print/PageUnidadePrint'
import { PageCondicoesPrint } from './print/PageCondicoesPrint'

export type OrcamentoPDFPrintProps = {
  orcamento: Orcamento
  totais: TotaisPorPlano
  validadeISO: string
  config: Config
}

export function OrcamentoPDFPrint({ orcamento, totais, validadeISO, config }: OrcamentoPDFPrintProps) {
  return (
    <Document title="Orçamento Maná Pizzas (P&B)" author="Maná Pizzas & Eventos">
      <PageCapaPrint orcamento={orcamento} totais={totais} validadeISO={validadeISO} config={config} />
      <PageCardapioPrint orcamento={orcamento} totais={totais} validadeISO={validadeISO} config={config} />
      <PageComparativoPrint orcamento={orcamento} totais={totais} validadeISO={validadeISO} config={config} />
      <PageUnidadePrint orcamento={orcamento} totais={totais} validadeISO={validadeISO} config={config} />
      <PageCondicoesPrint orcamento={orcamento} totais={totais} validadeISO={validadeISO} config={config} />
    </Document>
  )
}
