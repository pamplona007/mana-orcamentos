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
  return {
    empresa: { ...CONFIG_DEFAULT.empresa, ...e },
    validade: { ...CONFIG_DEFAULT.validade, ...v },
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
