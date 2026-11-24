export type PrecoPlano = {
  parcelado: number
  avista: number
}

export const PRECOS_PLANOS = {
  premium: { parcelado: 117.6, avista: 99.9 },
  livreBebida: { parcelado: 66, avista: 55.92 },
  livreSemBebida: { parcelado: 58.8, avista: 49.92 },
  unidade: { parcelado: 78.5, avista: 66.67 },
} as const satisfies Record<string, PrecoPlano>

export const ADICIONAL_ENTRADA = 350
export const ADICIONAL_SALGADO_EXTRA = 75
export const DESCONTO_AVISTA = 0.15
export const PARCELAS = 10
export const LIMITE_KM_DESLOCAMENTO = 25
export const BATE_LIMITE_HORAS = 22
