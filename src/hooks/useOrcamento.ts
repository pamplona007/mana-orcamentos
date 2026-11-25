import { useContext } from 'react'
import { OrcamentoContext, type OrcamentoCtx } from '@/contexts/orcamentoContext'

export type { LoadableState, State } from '@/types/orcamento'

export function useOrcamento(): OrcamentoCtx {
  const ctx = useContext(OrcamentoContext)
  if (!ctx) throw new Error('useOrcamento must be used within OrcamentoProvider')
  return ctx
}
