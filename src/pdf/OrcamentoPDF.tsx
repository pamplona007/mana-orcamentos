import { Document } from '@react-pdf/renderer'
import type { Orcamento } from '@/types/orcamento'
import { PageCapa } from './pages/PageCapa'
import { PageComparativo } from './pages/PageComparativo'
import { PageCondicoes } from './pages/PageCondicoes'
import { VALIDADE_HORAS } from '@/data/plans'
import { dataValidade, calcularTotais } from '@/utils/calculo'

type OrcamentoPDFProps = {
  orcamento: Omit<Orcamento, 'plano'>
  validadeHoras?: number
}

export function OrcamentoPDF({ orcamento, validadeHoras = VALIDADE_HORAS }: OrcamentoPDFProps) {
  const validadeISO = dataValidade(orcamento.criadoEm, validadeHoras)

  const totais = {
    premium: calcularTotais('premium', orcamento.convidados, orcamento.adicionais, orcamento.pagamento, orcamento.desconto),
    livreBebida: calcularTotais('livre-bebida', orcamento.convidados, orcamento.adicionais, orcamento.pagamento, orcamento.desconto),
    livreSemBebida: calcularTotais('livre-sem-bebida', orcamento.convidados, orcamento.adicionais, orcamento.pagamento, orcamento.desconto),
    unidade: calcularTotais('unidade', orcamento.convidados, orcamento.adicionais, orcamento.pagamento, orcamento.desconto),
  }

  const pagamentoLabel = orcamento.pagamento === 'pix' ? 'à vista no Pix' : 'parcelado em 10x'

  return (
    <Document
      title={`Orçamento Maná Pizzas — ${orcamento.cliente.nome || 'sem nome'}`}
      author="Maná Pizzas & Eventos"
      subject="Orçamento de rodízio de pizzas para evento"
      keywords="orçamento, pizza, rodízio, evento, Maná"
    >
      <PageCapa
        clienteNome={orcamento.cliente.nome}
        dataISO={orcamento.evento.data}
        cidadeBairro={orcamento.evento.cidadeBairro}
        totais={totais}
        validadeISO={validadeISO}
      />
      <PageComparativo
        totais={totais}
        pagamento={orcamento.pagamento}
        pagamentoLabel={pagamentoLabel}
      />
      <PageCondicoes
        validadeISO={validadeISO}
        clienteNome={orcamento.cliente.nome}
      />
    </Document>
  )
}
