import {
  ADICIONAL_ENTRADA,
  ADICIONAL_SALGADO_EXTRA,
  DESCONTO_AVISTA,
  PARCELAS,
  PLANO_POR_ID,
} from '@/data/plans'
import type {
  Adicional,
  Convidado,
  Pagamento,
  PlanoId,
  Totais,
} from '@/types/orcamento'
import { applyDescontoAvista, roundParcela } from './money'

const MULTIPLICADOR_CRIANCA_5A9 = 0.5
const MULTIPLICADOR_CRIANCA_0A4 = 0

export function calcularConvidados(c: Convidado): number {
  const adultos = Math.max(0, c.adultos)
  const c0a4 = Math.max(0, c.criancas0a4) * MULTIPLICADOR_CRIANCA_0A4
  const c5a9 = Math.max(0, c.criancas5a9) * MULTIPLICADOR_CRIANCA_5A9
  return adultos + c0a4 + c5a9
}

export function calcularPizzasSugeridas(c: Convidado): number {
  return Math.ceil(calcularConvidados(c) * 0.6)
}

export function calcularAdicionais(a: Adicional): number {
  return (
    (a.entrada ? ADICIONAL_ENTRADA : 0) +
    Math.max(0, a.salgadosExtras) * ADICIONAL_SALGADO_EXTRA
  )
}

export function calcularSubtotal(
  planoId: PlanoId,
  convidados: Convidado,
): { subtotal: number; unidades: number; tipoUnidade: 'pessoas' | 'pizzas' } {
  const plano = PLANO_POR_ID[planoId]

  if (plano.id === 'unidade' && plano.precoPizzaParcelado !== undefined) {
    const pizzas = calcularPizzasSugeridas(convidados)
    return {
      subtotal: pizzas * plano.precoPizzaParcelado,
      unidades: pizzas,
      tipoUnidade: 'pizzas',
    }
  }

  const pessoas = calcularConvidados(convidados)
  return {
    subtotal: pessoas * plano.precoPessoaParcelado,
    unidades: pessoas,
    tipoUnidade: 'pessoas',
  }
}

export function calcularTotais(
  planoId: PlanoId,
  convidados: Convidado,
  adicionais: Adicional,
  pagamento: Pagamento,
): Totais {
  void pagamento
  const { subtotal, unidades, tipoUnidade } = calcularSubtotal(planoId, convidados)
  const valorAdicionais = calcularAdicionais(adicionais)
  const total = subtotal + valorAdicionais
  const totalParcelado = total
  const totalAvista = applyDescontoAvista(total, DESCONTO_AVISTA)
  const parcela10x = roundParcela(totalParcelado, PARCELAS)

  return {
    adultosEquivalentes: tipoUnidade === 'pessoas' ? unidades : 0,
    pizzas: tipoUnidade === 'pizzas' ? unidades : 0,
    subtotal,
    adicionais: valorAdicionais,
    total,
    totalParcelado,
    totalAvista,
    parcela10x,
  }
}

export function validarDeslocamento(cidadeBairro: string): boolean {
  if (!cidadeBairro.trim()) return true
  const lower = cidadeBairro.toLowerCase()
  const termosDentro = [
    'fortaleza',
    'caucaia',
    'maracanaú',
    'maracanau',
    'eusebio',
    'euzébio',
    'aquiraz',
    'pacatuba',
    'itaitinga',
  ]
  return termosDentro.some((t) => lower.includes(t))
}

export function dataValidade(criadoEm: string, horas: number): string {
  const data = new Date(criadoEm)
  data.setHours(data.getHours() + horas)
  return data.toISOString()
}
