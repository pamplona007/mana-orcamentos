import {
  DESCONTO_AVISTA,
  PARCELAS,
  PLANO_POR_ID,
} from '@/data/plans'
import type {
  Convidado,
  Desconto,
  PlanoId,
  Totais,
} from '@/types/orcamento'
import { applyDescontoAvista, roundParcela } from './money'
import type { State } from '@/hooks/useOrcamento'

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
  state: State
): Totais {
  const {
    convidados,
    desconto,
    deslocamento
  } = state
  const { subtotal, unidades, tipoUnidade } = calcularSubtotal(planoId, convidados)
  const valorDeslocamento = deslocamento.ativo ? Math.max(0, deslocamento.valor) : 0
  const baseComDeslocamento = subtotal + valorDeslocamento

  const descontoAplicado = calcularDesconto(baseComDeslocamento, desconto)
  const total = Math.max(0, baseComDeslocamento - descontoAplicado)
  const totalParcelado = total
  const totalAvista = applyDescontoAvista(total, DESCONTO_AVISTA)
  const parcela10x = roundParcela(totalParcelado, PARCELAS)
  const plano = PLANO_POR_ID[planoId]
  const precoPessoaUsado =
    planoId === 'unidade' && plano.precoPizzaParcelado !== undefined
      ? plano.precoPizzaParcelado
      : plano.precoPessoaParcelado

  return {
    adultosEquivalentes: tipoUnidade === 'pessoas' ? unidades : 0,
    pizzas: tipoUnidade === 'pizzas' ? unidades : 0,
    subtotal,
    deslocamento: valorDeslocamento,
    descontoAplicado,
    total,
    totalParcelado,
    totalAvista,
    parcela10x,
    precoPessoaUsado,
  }
}

function calcularDesconto(base: number, desconto: Desconto): number {
  if (desconto.tipo === 'nenhum' || desconto.valor <= 0) return 0
  if (desconto.tipo === 'percentual') {
    const pct = Math.min(100, Math.max(0, desconto.valor))
    return Math.round(base * (pct / 100) * 100) / 100
  }
  return Math.min(base, Math.max(0, desconto.valor))
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
