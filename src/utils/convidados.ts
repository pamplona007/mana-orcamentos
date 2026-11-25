import { PIZZAS_POR_CONVIDADO } from '@/services/precos'
import type { Convidado } from '@/types/orcamento'

export const MULTIPLICADOR_CRIANCA_5A9 = 0.5
export const MULTIPLICADOR_CRIANCA_0A4 = 0

export function calcularConvidados(c: Convidado): number {
  const adultos = Math.max(0, c.adultos)
  const c0a4 = Math.max(0, c.criancas0a4) * MULTIPLICADOR_CRIANCA_0A4
  const c5a9 = Math.max(0, c.criancas5a9) * MULTIPLICADOR_CRIANCA_5A9
  return adultos + c0a4 + c5a9
}

export function calcularPizzasSugeridas(c: Convidado): number {
  return Math.ceil(calcularConvidados(c) * PIZZAS_POR_CONVIDADO)
}
