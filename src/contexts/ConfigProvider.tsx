import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  CONFIG_DEFAULT,
  type Config,
  type ConfigEditor,
  type ConfigEmpresa,
  type ConfigPdf,
  type ConfigValidade,
  type ConfigWhatsApp,
} from '@/types/config'
import {
  exportarConfig as exportar,
  importarConfig as importar,
  obterConfig,
  restaurarConfig,
  salvarConfig,
} from '@/services/config'
import { ConfigContext, CONFIG_STORAGE_KEY, type ConfigCtx } from './configContext'

export function ConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<Config>(() => obterConfig())

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === CONFIG_STORAGE_KEY) setConfig(obterConfig())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const setEmpresa = useCallback((empresa: Partial<ConfigEmpresa>) => {
    setConfig((prev) => {
      const next: Config = { ...prev, empresa: { ...prev.empresa, ...empresa } }
      salvarConfig(next)
      return next
    })
  }, [])

  const setValidade = useCallback((validade: Partial<ConfigValidade>) => {
    setConfig((prev) => {
      const next: Config = { ...prev, validade: { ...prev.validade, ...validade } }
      salvarConfig(next)
      return next
    })
  }, [])

  const setEditor = useCallback((editor: Partial<ConfigEditor>) => {
    setConfig((prev) => {
      const next: Config = { ...prev, editor: { ...prev.editor, ...editor } }
      salvarConfig(next)
      return next
    })
  }, [])

  const setWhatsApp = useCallback((whatsapp: Partial<ConfigWhatsApp>) => {
    setConfig((prev) => {
      const next: Config = { ...prev, whatsapp: { ...prev.whatsapp, ...whatsapp } }
      salvarConfig(next)
      return next
    })
  }, [])

  const setPdf = useCallback((pdf: Partial<ConfigPdf>) => {
    setConfig((prev) => {
      const next: Config = { ...prev, pdf: { ...prev.pdf, ...pdf } }
      salvarConfig(next)
      return next
    })
  }, [])

  const reset = useCallback(() => {
    restaurarConfig()
    setConfig(structuredClone(CONFIG_DEFAULT))
  }, [])

  const importarFn = useCallback((json: string): Config => {
    const next = importar(json)
    setConfig(next)
    return next
  }, [])

  const exportarFn = useCallback(() => exportar(), [config])

  const value = useMemo<ConfigCtx>(
    () => ({ config, setEmpresa, setValidade, setEditor, setWhatsApp, setPdf, reset, importar: importarFn, exportar: exportarFn }),
    [config, setEmpresa, setValidade, setEditor, setWhatsApp, setPdf, reset, importarFn, exportarFn],
  )

  return <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>
}
