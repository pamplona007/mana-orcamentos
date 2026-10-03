import { Page, Text } from '@react-pdf/renderer'
import type { Orcamento, TotaisPorPlano } from '@/types/orcamento'

export type PageCondicoesProps = {
  orcamento: Orcamento
  totais: TotaisPorPlano
  validadeISO: string
}

export function PageCondicoes(_props: PageCondicoesProps) {
  return (
    <Page size="A4">
      <Text style={{ fontFamily: 'Fraunces', fontSize: 32, color: '#F5E9D7' }}>
        Condições gerais
      </Text>
    </Page>
  )
}