import { createContext } from 'react'
import type {
  Cliente,
  Convidado,
  Desconto,
  Deslocamento,
  Evento,
  LoadableState,
  Orcamento,
  Pagamento,
  State,
  TotaisPorPlano,
} from '@/types/orcamento'

export type OrcamentoCtx = {
  state: State
  setCliente: (cliente: Cliente) => void
  setEvento: (evento: Partial<Evento>) => void
  setConvidados: (convidados: Convidado) => void
  setPagamento: (pagamento: Pagamento) => void
  setDesconto: (desconto: Partial<Desconto>) => void
  setDeslocamento: (deslocamento: Partial<Deslocamento>) => void
  reset: () => void
  load: (state: LoadableState) => void
  totais: TotaisPorPlano
  toOrcamento: (id?: string) => Orcamento
}

export const OrcamentoContext = createContext<OrcamentoCtx | null>(null)
