import { CONFIG_DEFAULT, type Config } from '@/types/config'

const STORAGE_KEY = 'mana-config:v1'

function readRaw(): unknown {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function writeRaw(config: Config): void {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
}

function mergeComDefault(raw: unknown): Config {
  if (typeof raw !== 'object' || raw === null) return structuredClone(CONFIG_DEFAULT)
  const r = raw as Record<string, unknown>
  const e = (r.empresa && typeof r.empresa === 'object' ? r.empresa : {}) as Record<string, unknown>
  const v = (r.validade && typeof r.validade === 'object' ? r.validade : {}) as Record<string, unknown>
  const ed = (r.editor && typeof r.editor === 'object' ? r.editor : {}) as Record<string, unknown>
  const w = (r.whatsapp && typeof r.whatsapp === 'object' ? r.whatsapp : {}) as Record<string, unknown>
  const pdf = (r.pdf && typeof r.pdf === 'object' ? r.pdf : {}) as Record<string, unknown>
  const convidados = (ed.convidadosPadrao && typeof ed.convidadosPadrao === 'object'
    ? ed.convidadosPadrao
    : {}) as Record<string, unknown>
  const desloc = (ed.deslocamentoPadrao && typeof ed.deslocamentoPadrao === 'object'
    ? ed.deslocamentoPadrao
    : {}) as Record<string, unknown>
  const precos = (pdf.precos && typeof pdf.precos === 'object' ? pdf.precos : {}) as Record<string, unknown>
  const adicionais = (pdf.adicionais && typeof pdf.adicionais === 'object' ? pdf.adicionais : {}) as Record<string, unknown>
  const capa = (pdf.capa && typeof pdf.capa === 'object' ? pdf.capa : {}) as Record<string, unknown>
  const cardapio = (pdf.cardapio && typeof pdf.cardapio === 'object' ? pdf.cardapio : {}) as Record<string, unknown>
  return {
    empresa: { ...CONFIG_DEFAULT.empresa, ...e },
    validade: { ...CONFIG_DEFAULT.validade, ...v },
    editor: {
      convidadosPadrao: { ...CONFIG_DEFAULT.editor.convidadosPadrao, ...convidados },
      pagamentoPadrao: (ed.pagamentoPadrao as Config['editor']['pagamentoPadrao']) ?? CONFIG_DEFAULT.editor.pagamentoPadrao,
      deslocamentoPadrao: { ...CONFIG_DEFAULT.editor.deslocamentoPadrao, ...desloc },
    },
    whatsapp: { ...CONFIG_DEFAULT.whatsapp, ...w },
    pdf: {
      precos: {
        premium: { ...CONFIG_DEFAULT.pdf.precos.premium, ...(precos.premium as object ?? {}) },
        livreBebida: { ...CONFIG_DEFAULT.pdf.precos.livreBebida, ...(precos.livreBebida as object ?? {}) },
        livreSemBebida: { ...CONFIG_DEFAULT.pdf.precos.livreSemBebida, ...(precos.livreSemBebida as object ?? {}) },
        unidade: { ...CONFIG_DEFAULT.pdf.precos.unidade, ...(precos.unidade as object ?? {}) },
      },
      adicionais: { ...CONFIG_DEFAULT.pdf.adicionais, ...(adicionais as object ?? {}) },
      capa: {
        ...CONFIG_DEFAULT.pdf.capa,
        ...capa,
        promessas: Array.isArray(capa.promessas) && capa.promessas.length > 0
          ? capa.promessas as Config['pdf']['capa']['promessas']
          : CONFIG_DEFAULT.pdf.capa.promessas,
      },
      cardapio: {
        salgadosCustomizados: Array.isArray(cardapio.salgadosCustomizados)
          ? cardapio.salgadosCustomizados as string[]
          : CONFIG_DEFAULT.pdf.cardapio.salgadosCustomizados,
        docesCustomizados: Array.isArray(cardapio.docesCustomizados)
          ? cardapio.docesCustomizados as string[]
          : CONFIG_DEFAULT.pdf.cardapio.docesCustomizados,
      },
    },
  }
}

export function obterConfig(): Config {
  return mergeComDefault(readRaw())
}

export function salvarConfig(config: Config): void {
  writeRaw(config)
}

export function restaurarConfig(): void {
  writeRaw(structuredClone(CONFIG_DEFAULT))
}

export function exportarConfig(): string {
  return JSON.stringify(obterConfig(), null, 2)
}

export function importarConfig(json: string): Config {
  const parsed: unknown = JSON.parse(json)
  const config = mergeComDefault(parsed)
  writeRaw(config)
  return config
}
