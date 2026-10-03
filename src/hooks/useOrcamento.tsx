import { createContext, useContext, useReducer, useMemo, type ReactNode } from 'react'
import type {
  Adicional,
  Convidado,
  Evento,
  Orcamento,
  Pagamento,
  PlanoId,
  Totais,
  Cliente,
} from '@/types/orcamento'
import { PLANOS } from '@/data/plans'
import { calcularTotais } from '@/utils/calculo'

type State = {
  cliente: Cliente
  evento: Evento
  convidados: Convidado
  plano: PlanoId
  adicionais: Adicional
  pagamento: Pagamento
}

type Action =
  | { type: 'setCliente'; cliente: Cliente }
  | { type: 'setEvento'; evento: Partial<Evento> }
  | { type: 'setConvidados'; convidados: Convidado }
  | { type: 'setPlano'; plano: PlanoId }
  | { type: 'setAdicionais'; adicionais: Partial<Adicional> }
  | { type: 'setPagamento'; pagamento: Pagamento }
  | { type: 'reset' }
  | { type: 'load'; state: State }

const initialState: State = {
  cliente: { nome: '', whatsapp: '' },
  evento: { data: '', cidadeBairro: '', observacoes: '' },
  convidados: { adultos: 25, criancas0a4: 0, criancas5a9: 0 },
  plano: 'premium',
  adicionais: { entrada: false, salgadosExtras: 0 },
  pagamento: 'parcelado',
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'setCliente':
      return { ...state, cliente: action.cliente }
    case 'setEvento':
      return { ...state, evento: { ...state.evento, ...action.evento } }
    case 'setConvidados':
      return { ...state, convidados: action.convidados }
    case 'setPlano':
      return { ...state, plano: action.plano }
    case 'setAdicionais':
      return { ...state, adicionais: { ...state.adicionais, ...action.adicionais } }
    case 'setPagamento':
      return { ...state, pagamento: action.pagamento }
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
  setPlano: (plano: PlanoId) => void
  setAdicionais: (adicionais: Partial<Adicional>) => void
  setPagamento: (pagamento: Pagamento) => void
  reset: () => void
  load: (state: State) => void
  totais: Totais
  planoSelecionado: (typeof PLANOS)[number]
  toOrcamento: () => Orcamento
}

const OrcamentoContext = createContext<Ctx | null>(null)

export function OrcamentoProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const totais = useMemo(
    () => calcularTotais(state.plano, state.convidados, state.adicionais, state.pagamento),
    [state.plano, state.convidados, state.adicionais, state.pagamento],
  )

  const planoSelecionado = useMemo(
    () => PLANOS.find((p) => p.id === state.plano) ?? PLANOS[0]!,
    [state.plano],
  )

  const toOrcamento = (): Orcamento => ({
    id: crypto.randomUUID(),
    criadoEm: new Date().toISOString(),
    cliente: state.cliente,
    evento: state.evento,
    convidados: state.convidados,
    plano: state.plano,
    adicionais: state.adicionais,
    pagamento: state.pagamento,
  })

  const value: Ctx = {
    state,
    setCliente: (cliente) => dispatch({ type: 'setCliente', cliente }),
    setEvento: (evento) => dispatch({ type: 'setEvento', evento }),
    setConvidados: (convidados) => dispatch({ type: 'setConvidados', convidados }),
    setPlano: (plano) => dispatch({ type: 'setPlano', plano }),
    setAdicionais: (adicionais) => dispatch({ type: 'setAdicionais', adicionais }),
    setPagamento: (pagamento) => dispatch({ type: 'setPagamento', pagamento }),
    reset: () => dispatch({ type: 'reset' }),
    load: (s) => dispatch({ type: 'load', state: s }),
    totais,
    planoSelecionado,
    toOrcamento,
  }

  return <OrcamentoContext.Provider value={value}>{children}</OrcamentoContext.Provider>
}

export function useOrcamento(): Ctx {
  const ctx = useContext(OrcamentoContext)
  if (!ctx) throw new Error('useOrcamento must be used within OrcamentoProvider')
  return ctx
}
