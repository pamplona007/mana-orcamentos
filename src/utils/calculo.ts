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
import type { ConfigPdfAdicionais, ConfigPdfPrecos } from '@/types/config'
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

type PrecoEntry = { parcelado: number; avista: number }

function precoPlano(planoId: PlanoId, precos?: ConfigPdfPrecos): PrecoEntry {
  if (precos) {
    if (planoId === 'premium') return precos.premium
    if (planoId === 'livre-bebida') return precos.livreBebida
    if (planoId === 'livre-sem-bebida') return precos.livreSemBebida
    if (planoId === 'unidade') return precos.unidade
  }
  const plano = PLANO_POR_ID[planoId]
  return {
    parcelado: plano.precoPessoaParcelado,
    avista: plano.precoPessoaAvista,
  }
}

function descontoAvista(adicionais?: ConfigPdfAdicionais): number {
  return adicionais?.descontoAvista ?? DESCONTO_AVISTA
}

function parcelas(adicionais?: ConfigPdfAdicionais): number {
  return adicionais?.parcelas ?? PARCELAS
}

export function calcularSubtotal(
  planoId: PlanoId,
  convidados: Convidado,
  precos?: ConfigPdfPrecos,
): { subtotal: number; unidades: number; tipoUnidade: 'pessoas' | 'pizzas' } {
  const { parcelado } = precoPlano(planoId, precos)

  if (planoId === 'unidade') {
    const pizzas = calcularPizzasSugeridas(convidados)
    return {
      subtotal: pizzas * parcelado,
      unidades: pizzas,
      tipoUnidade: 'pizzas',
    }
  }

  const pessoas = calcularConvidados(convidados)
  return {
    subtotal: pessoas * parcelado,
    unidades: pessoas,
    tipoUnidade: 'pessoas',
  }
}

export function calcularTotais(
  planoId: PlanoId,
  state: State,
  opts?: { precos?: ConfigPdfPrecos; adicionais?: ConfigPdfAdicionais },
): Totais {
  const { convidados, desconto, deslocamento } = state
  const precos = opts?.precos
  const adicionais = opts?.adicionais
  const { subtotal, unidades, tipoUnidade } = calcularSubtotal(planoId, convidados, precos)
  const valorDeslocamento = deslocamento.ativo ? Math.max(0, deslocamento.valor) : 0
  const baseComDeslocamento = subtotal + valorDeslocamento

  const descontoAplicado = calcularDesconto(baseComDeslocamento, desconto)
  const total = Math.max(0, baseComDeslocamento - descontoAplicado)
  const totalParcelado = total
  const totalAvista = applyDescontoAvista(total, descontoAvista(adicionais))
  const numParcelas = parcelas(adicionais)
  const parcela10x = roundParcela(totalParcelado, numParcelas)
  const { parcelado } = precoPlano(planoId, precos)

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
    precoPessoaUsado: parcelado,
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
