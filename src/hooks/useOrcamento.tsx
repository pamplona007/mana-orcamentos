import { createContext, useContext, useMemo, useReducer, type ReactNode } from 'react'
import type {
  Convidado,
  Desconto,
  Evento,
  Orcamento,
  Pagamento,
  TotaisPorPlano,
  Cliente,
  Deslocamento,
} from '@/types/orcamento'
import { calcularTotais } from '@/utils/calculo'

export type LoadableState = {
  cliente: Cliente
  evento: Evento
  convidados: Convidado
  pagamento: Pagamento
  desconto: Desconto
  deslocamento: Deslocamento
}

export type State = LoadableState

type Action =
  | { type: 'setCliente'; cliente: Cliente }
  | { type: 'setEvento'; evento: Partial<Evento> }
  | { type: 'setConvidados'; convidados: Convidado }
  | { type: 'setDesconto'; desconto: Partial<Desconto> }
  | { type: 'setDeslocamento'; deslocamento: Partial<Deslocamento> }
  | { type: 'reset' }
  | { type: 'load'; state: LoadableState }

const initialState: State = {
  cliente: { nome: '', whatsapp: '' },
  evento: { data: '', cidadeBairro: '', observacoes: '' },
  convidados: { adultos: 25, criancas0a4: 0, criancas5a9: 0 },
  pagamento: 'parcelado',
  desconto: { tipo: 'nenhum', valor: 0 },
  deslocamento: { ativo: false, valor: 150 },
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'setCliente':
      return { ...state, cliente: action.cliente }
    case 'setEvento':
      return { ...state, evento: { ...state.evento, ...action.evento } }
    case 'setConvidados':
      return { ...state, convidados: action.convidados }
    case 'setDesconto':
      return { ...state, desconto: { ...state.desconto, ...action.desconto } }
    case 'setDeslocamento':
      return { ...state, deslocamento: { ...state.deslocamento, ...action.deslocamento } }
    case 'reset':
      return initialState

    case 'load':
      return action.state
  }
}

type Ctx = {
  state: State
  setCliente: (cliente: Cliente) => void
  setEvento: (evento: Partial<Evento>) => void
  setConvidados: (convidados: Convidado) => void
  setDesconto: (desconto: Partial<Desconto>) => void
  setDeslocamento: (deslocamento: Partial<Deslocamento>) => void
  reset: () => void
  load: (state: LoadableState) => void
  totais: TotaisPorPlano
  toOrcamento: (id?: string) => Orcamento
}

const OrcamentoContext = createContext<Ctx | null>(null)

export function OrcamentoProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const totais = useMemo<TotaisPorPlano>(() => {
    return {
      premium: calcularTotais('premium', state),
      livreBebida: calcularTotais('livre-bebida', state),
      livreSemBebida: calcularTotais('livre-sem-bebida', state),
      unidade: calcularTotais('unidade', state),
    }
  }, [state])

  const toOrcamento = (id?: string): Orcamento => ({
    id: id ?? crypto.randomUUID(),
    criadoEm: new Date().toISOString(),
    cliente: state.cliente,
    evento: state.evento,
    convidados: state.convidados,
    deslocamento: state.deslocamento,
    pagamento: state.pagamento,
    desconto: state.desconto,
  })

  const value: Ctx = {
    state,
    setCliente: (cliente) => dispatch({ type: 'setCliente', cliente }),
    setEvento: (evento) => dispatch({ type: 'setEvento', evento }),
    setConvidados: (convidados) => dispatch({ type: 'setConvidados', convidados }),
    setDesconto: (desconto) => dispatch({ type: 'setDesconto', desconto }),
    setDeslocamento: (deslocamento) => dispatch({ type: 'setDeslocamento', deslocamento }),
    reset: () => dispatch({ type: 'reset' }),
    load: (s) => dispatch({ type: 'load', state: s }),
    totais,
    toOrcamento,
  }

  return <OrcamentoContext.Provider value={value}>{children}</OrcamentoContext.Provider>
}

export function useOrcamento(): Ctx {
  const ctx = useContext(OrcamentoContext)
  if (!ctx) throw new Error('useOrcamento must be used within OrcamentoProvider')
  return ctx
}
