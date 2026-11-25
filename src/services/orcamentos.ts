import type { Orcamento, TotaisPorPlano } from '@/types/orcamento'

export type OrcamentoSalvo = Orcamento & {
  totais: TotaisPorPlano
}

const STORAGE_KEY = 'mana-orcamentos:v1'

function readAll(): OrcamentoSalvo[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(isOrcamentoSalvo)
  } catch {
    return []
  }
}

function writeAll(list: OrcamentoSalvo[]): void {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

function isOrcamentoSalvo(value: unknown): value is OrcamentoSalvo {
  if (typeof value !== 'object' || value === null) return false
  const o = value as Record<string, unknown>
  return (
    typeof o.id === 'string' &&
    typeof o.criadoEm === 'string' &&
    typeof o.cliente === 'object' &&
    typeof o.totais === 'object'
  )
}

export function listarOrcamentos(): OrcamentoSalvo[] {
  return readAll().sort(
    (a, b) => new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime(),
  )
}

export function obterOrcamento(id: string): OrcamentoSalvo | null {
  return readAll().find((o) => o.id === id) ?? null
}

export function salvarOrcamento(orcamento: Orcamento, totais: TotaisPorPlano): OrcamentoSalvo {
  const all = readAll()
  const novo: OrcamentoSalvo = { ...orcamento, totais }
  const idx = all.findIndex((o) => o.id === novo.id)
  if (idx >= 0) {
    all[idx] = novo
  } else {
    all.push(novo)
  }
  writeAll(all)
  return novo
}

export function removerOrcamento(id: string): void {
  writeAll(readAll().filter((o) => o.id !== id))
}

export function duplicarOrcamento(id: string): OrcamentoSalvo | null {
  const original = obterOrcamento(id)
  if (!original) return null
  const copia: OrcamentoSalvo = {
    ...original,
    id: crypto.randomUUID(),
    criadoEm: new Date().toISOString(),
    cliente: { ...original.cliente, nome: `${original.cliente.nome} (cópia)` },
  }
  const all = readAll()
  all.push(copia)
  writeAll(all)
  return copia
}
