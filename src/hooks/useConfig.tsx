import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { CONFIG_DEFAULT, type Config, type ConfigEmpresa, type ConfigValidade } from '@/types/config'
import {
  exportarConfig as exportar,
  importarConfig as importar,
  obterConfig,
  restaurarConfig,
  salvarConfig,
} from '@/storage/config'

type Ctx = {
  config: Config
  setEmpresa: (empresa: Partial<ConfigEmpresa>) => void
  setValidade: (validade: Partial<ConfigValidade>) => void
  reset: () => void
  importar: (json: string) => Config
  exportar: () => string
}

const ConfigContext = createContext<Ctx | null>(null)
const STORAGE_KEY = 'mana-config:v1'

export function ConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<Config>(() => obterConfig())

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setConfig(obterConfig())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const setEmpresa = useCallback((empresa: Partial<ConfigEmpresa>) => {
    setConfig((prev) => {
      const next: Config = {
        ...prev,
        empresa: { ...prev.empresa, ...empresa },
      }
      salvarConfig(next)
      return next
    })
  }, [])

  const setValidade = useCallback((validade: Partial<ConfigValidade>) => {
    setConfig((prev) => {
      const next: Config = {
        ...prev,
        validade: { ...prev.validade, ...validade },
      }
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

  const value = useMemo<Ctx>(
    () => ({ config, setEmpresa, setValidade, reset, importar: importarFn, exportar: exportarFn }),
    [config, setEmpresa, setValidade, reset, importarFn, exportarFn],
  )

  return <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>
}

export function useConfig(): Ctx {
  const ctx = useContext(ConfigContext)
  if (!ctx) throw new Error('useConfig must be used within ConfigProvider')
  return ctx
}
