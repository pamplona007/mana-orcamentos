import { z } from 'zod'
import { CONFIG_DEFAULT, type Config } from '@/types/config'
import { numeroDecimal, numeroInteiro } from './editorSchema'

export const empresaSchema = z.object({
  nomeFantasia: z.string(),
  telefone: z.string(),
  whatsapp: z.string(),
  email: z
    .string()
    .refine(
      (valor) => valor === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor),
      'Informe um e-mail válido',
    ),
  instagram: z.string(),
  site: z.string(),
  endereco: z.string(),
  cnpj: z.string(),
  cidade: z.string(),
  estado: z.string().max(2, 'Use a sigla com 2 letras'),
})

export const validadeSchema = z.object({
  horas: numeroInteiro(1),
})

export const convidadosPadraoSchema = z.object({
  adultos: numeroInteiro(0),
  criancas0a4: numeroInteiro(0),
  criancas5a9: numeroInteiro(0),
})

export const editorConfigSchema = z.object({
  convidadosPadrao: convidadosPadraoSchema,
  pagamentoPadrao: z.enum(['pix', 'parcelado'], { error: 'Escolha uma forma de pagamento' }),
  deslocamentoPadrao: z.object({
    ativo: z.boolean(),
    valor: numeroDecimal(0),
  }),
})

export const whatsappConfigSchema = z.object({
  template: z.string(),
})

const precoSchema = z.object({
  parcelado: numeroDecimal(0),
  avista: numeroDecimal(0),
})

export const precosSchema = z.object({
  premium: precoSchema,
  livreBebida: precoSchema,
  livreSemBebida: precoSchema,
  unidade: precoSchema,
})

export const adicionaisSchema = z.object({
  entrada: numeroDecimal(0),
  salgadoExtra: numeroDecimal(0),
  descontoAvista: numeroDecimal(0, 1),
  parcelas: numeroInteiro(1),
  limiteKmDeslocamento: numeroDecimal(0),
})

export const promessaSchema = z.object({
  titulo: z.string(),
  corpo: z.string(),
})

export const capaSchema = z.object({
  sobreKicker: z.string(),
  sobreTitulo: z.string(),
  sobreCorpo: z.string(),
  promessas: z.array(promessaSchema),
  contatoRodape: z.string(),
})

export const cardapioSchema = z.object({
  salgadosCustomizados: z.array(z.string()),
  docesCustomizados: z.array(z.string()),
})

export const pdfConfigSchema = z.object({
  precos: precosSchema,
  adicionais: adicionaisSchema,
  capa: capaSchema,
  cardapio: cardapioSchema,
})

export const configSchema = z.object({
  empresa: empresaSchema,
  validade: validadeSchema,
  editor: editorConfigSchema,
  whatsapp: whatsappConfigSchema,
  pdf: pdfConfigSchema,
})

type ObjetoComShape = { shape: Record<string, z.ZodType> }

function ehObjeto(valor: unknown): valor is Record<string, unknown> {
  return typeof valor === 'object' && valor !== null && !Array.isArray(valor)
}

function temShape(schema: z.ZodType): schema is z.ZodType & ObjetoComShape {
  return ehObjeto((schema as { shape?: unknown }).shape)
}

function lerCampo(schema: z.ZodType, bruto: unknown, padrao: unknown): unknown {
  const direto = schema.safeParse(bruto)
  if (direto.success) return direto.data

  if (ehObjeto(padrao) && ehObjeto(bruto) && temShape(schema)) {
    const base: Record<string, unknown> = { ...padrao }
    for (const chave of Object.keys(padrao)) {
      const filho = schema.shape[chave]
      if (!filho) continue
      base[chave] = lerCampo(filho, bruto[chave], padrao[chave])
    }
    const tentativa = schema.safeParse(base)
    return tentativa.success ? tentativa.data : structuredClone(padrao)
  }

  return structuredClone(padrao)
}

/**
 * Valida a config persistida campo a campo: todo valor inválido (tipo errado,
 * fora de faixa, versão antiga) cai para o default sem derrubar a tela.
 */
export function sanitizarConfig(bruto: unknown): Config {
  if (!ehObjeto(bruto)) return structuredClone(CONFIG_DEFAULT)

  return {
    empresa: lerCampo(empresaSchema, bruto.empresa, CONFIG_DEFAULT.empresa) as Config['empresa'],
    validade: lerCampo(
      validadeSchema,
      bruto.validade,
      CONFIG_DEFAULT.validade,
    ) as Config['validade'],
    editor: lerCampo(editorConfigSchema, bruto.editor, CONFIG_DEFAULT.editor) as Config['editor'],
    whatsapp: lerCampo(
      whatsappConfigSchema,
      bruto.whatsapp,
      CONFIG_DEFAULT.whatsapp,
    ) as Config['whatsapp'],
    pdf: lerCampo(pdfConfigSchema, bruto.pdf, CONFIG_DEFAULT.pdf) as Config['pdf'],
  }
}

export function configValida(bruto: unknown): boolean {
  return configSchema.safeParse(bruto).success
}
