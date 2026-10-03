import { createContext, useContext, useMemo, useReducer, type ReactNode } from 'react'
import type {
  Adicional,
  Convidado,
  Desconto,
  Evento,
  Orcamento,
  Pagamento,
  TotaisPorPlano,
  Cliente,
} from '@/types/orcamento'
import { calcularTotais } from '@/utils/calculo'

type State = {
  cliente: Cliente
  evento: Evento
  convidados: Convidado
  adicionais: Adicional
  pagamento: Pagamento
  desconto: Desconto
}

type Action =
  | { type: 'setCliente'; cliente: Cliente }
  | { type: 'setEvento'; evento: Partial<Evento> }
  | { type: 'setConvidados'; convidados: Convidado }
  | { type: 'setAdicionais'; adicionais: Partial<Adicional> }
  | { type: 'setPagamento'; pagamento: Pagamento }
  | { type: 'setDesconto'; desconto: Partial<Desconto> }
  | { type: 'reset' }
  | { type: 'load'; state: State }

const initialState: State = {
  cliente: { nome: '', whatsapp: '' },
  evento: { data: '', cidadeBairro: '', observacoes: '' },
  convidados: { adultos: 25, criancas0a4: 0, criancas5a9: 0 },
  adicionais: { entrada: false, salgadosExtras: 0 },
  pagamento: 'parcelado',
  desconto: { tipo: 'nenhum', valor: 0 },
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'setCliente':
      return { ...state, cliente: action.cliente }
    case 'setEvento':
      return { ...state, evento: { ...state.evento, ...action.evento } }
    case 'setConvidados':
      return { ...state, convidados: action.convidados }
    case 'setAdicionais':
      return { ...state, adicionais: { ...state.adicionais, ...action.adicionais } }
    case 'setPagamento':
      return { ...state, pagamento: action.pagamento }
    case 'setDesconto':
      return { ...state, desconto: { ...state.desconto, ...action.desconto } }
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
  setAdicionais: (adicionais: Partial<Adicional>) => void
  setPagamento: (pagamento: Pagamento) => void
  setDesconto: (desconto: Partial<Desconto>) => void
  reset: () => void
  load: (state: State) => void
  totais: TotaisPorPlano
  toOrcamento: () => Orcamento
}

const OrcamentoContext = createContext<Ctx | null>(null)

export function OrcamentoProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const totais = useMemo<TotaisPorPlano>(() => {
    const c = state.convidados
    const a = state.adicionais
    const p = state.pagamento
    const d = state.desconto
    return {
      premium: calcularTotais('premium', c, a, p, d),
      livreBebida: calcularTotais('livre-bebida', c, a, p, d),
      livreSemBebida: calcularTotais('livre-sem-bebida', c, a, p, d),
      unidade: calcularTotais('unidade', c, a, p, d),
    }
  }, [state.convidados, state.adicionais, state.pagamento, state.desconto])

  const toOrcamento = (): Orcamento => ({
    id: crypto.randomUUID(),
    criadoEm: new Date().toISOString(),
    cliente: state.cliente,
    evento: state.evento,
    convidados: state.convidados,
    adicionais: state.adicionais,
    pagamento: state.pagamento,
    desconto: state.desconto,
  })

  const value: Ctx = {
    state,
    setCliente: (cliente) => dispatch({ type: 'setCliente', cliente }),
    setEvento: (evento) => dispatch({ type: 'setEvento', evento }),
    setConvidados: (convidados) => dispatch({ type: 'setConvidados', convidados }),
    setAdicionais: (adicionais) => dispatch({ type: 'setAdicionais', adicionais }),
    setPagamento: (pagamento) => dispatch({ type: 'setPagamento', pagamento }),
    setDesconto: (desconto) => dispatch({ type: 'setDesconto', desconto }),
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
