import { z } from 'zod'

export const MENSAGEM_NUMERO = 'Informe um número válido'

function limitar(valor: number, min: number, max: number): number {
  if (!Number.isFinite(valor)) return min
  return Math.min(max, Math.max(min, valor))
}

/**
 * Número inteiro com clamp embutido: reproduz os limites que os handlers
 * aplicavam à mão (Math.max/Math.min) sem rejeitar o valor digitado.
 */
export function numeroInteiro(min: number, max = Number.MAX_SAFE_INTEGER) {
  return z
    .number({ error: MENSAGEM_NUMERO })
    .transform((valor) => Math.trunc(limitar(valor, min, max)))
}

/** Número decimal (dinheiro, percentual) com clamp embutido. */
export function numeroDecimal(min: number, max = Number.MAX_SAFE_INTEGER) {
  return z.number({ error: MENSAGEM_NUMERO }).transform((valor) => limitar(valor, min, max))
}

const DATA_ISO = /^\d{4}-\d{2}-\d{2}$/

export const clienteSchema = z.object({
  nome: z.string(),
  whatsapp: z.string(),
})

export const eventoSchema = z.object({
  data: z
    .string()
    .refine((valor) => valor === '' || DATA_ISO.test(valor), 'Informe uma data válida'),
  cidadeBairro: z.string(),
  observacoes: z.string(),
})

export const convidadosSchema = z.object({
  adultos: numeroInteiro(0, 500),
  criancas0a4: numeroInteiro(0, 500),
  criancas5a9: numeroInteiro(0, 500),
})

export const deslocamentoSchema = z.object({
  ativo: z.boolean(),
  valor: numeroDecimal(0),
})

export const TIPOS_DESCONTO = ['nenhum', 'percentual', 'absoluto'] as const

export const descontoSchema = z
  .object({
    tipo: z.enum(TIPOS_DESCONTO, { error: 'Escolha um tipo de desconto' }),
    valor: z.number({ error: MENSAGEM_NUMERO }),
  })
  .transform((desconto) => ({
    tipo: desconto.tipo,
    valor:
      desconto.tipo === 'percentual'
        ? limitar(desconto.valor, 0, 100)
        : limitar(desconto.valor, 0, Number.MAX_SAFE_INTEGER),
  }))

export const pagamentoSchema = z.enum(['pix', 'parcelado'], {
  error: 'Escolha uma forma de pagamento',
})

export const editorSchema = z.object({
  cliente: clienteSchema,
  evento: eventoSchema,
  convidados: convidadosSchema,
  pagamento: pagamentoSchema,
  desconto: descontoSchema,
  deslocamento: deslocamentoSchema,
})

/** Wrapper para os campos de convidados do Editor (o GuestBreakdown recebe o objeto inteiro). */
export const convidadosFormSchema = z.object({
  convidados: convidadosSchema,
})

export type EditorSchema = z.output<typeof editorSchema>
