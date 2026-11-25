import { createContext } from 'react'
import type {
  Config,
  ConfigEditor,
  ConfigEmpresa,
  ConfigPdf,
  ConfigValidade,
  ConfigWhatsApp,
} from '@/types/config'

export type ConfigCtx = {
  config: Config
  setEmpresa: (empresa: Partial<ConfigEmpresa>) => void
  setValidade: (validade: Partial<ConfigValidade>) => void
  setEditor: (editor: Partial<ConfigEditor>) => void
  setWhatsApp: (whatsapp: Partial<ConfigWhatsApp>) => void
  setPdf: (pdf: Partial<ConfigPdf>) => void
  reset: () => void
  importar: (json: string) => Config
  exportar: () => string
}

export const ConfigContext = createContext<ConfigCtx | null>(null)

export const CONFIG_STORAGE_KEY = 'mana-config:v1'
