import type { Config } from '@/types/config'
import type {
  Cliente,
  Convidado,
  Desconto,
  Deslocamento,
  Evento,
  LoadableState,
  Pagamento,
  State,
} from '@/types/orcamento'

export type Action =
  | { type: 'setCliente'; cliente: Cliente }
  | { type: 'setEvento'; evento: Partial<Evento> }
  | { type: 'setConvidados'; convidados: Convidado }
  | { type: 'setPagamento'; pagamento: Pagamento }
  | { type: 'setDesconto'; desconto: Partial<Desconto> }
  | { type: 'setDeslocamento'; deslocamento: Partial<Deslocamento> }
  | { type: 'reset'; config: Config }
  | { type: 'load'; state: LoadableState }

export function buildInitialState(config: Config): State {
  return {
    cliente: { nome: '', whatsapp: '' },
    evento: { data: '', cidadeBairro: '', observacoes: '' },
    convidados: {
      adultos: config.editor.convidadosPadrao.adultos,
      criancas0a4: config.editor.convidadosPadrao.criancas0a4,
      criancas5a9: config.editor.convidadosPadrao.criancas5a9,
    },
    pagamento: config.editor.pagamentoPadrao,
    desconto: { tipo: 'nenhum', valor: 0 },
    deslocamento: {
      ativo: config.editor.deslocamentoPadrao.ativo,
      valor: config.editor.deslocamentoPadrao.valor,
    },
  }
}

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'setCliente':
      return { ...state, cliente: action.cliente }
    case 'setEvento':
      return { ...state, evento: { ...state.evento, ...action.evento } }
    case 'setConvidados':
      return { ...state, convidados: action.convidados }
    case 'setPagamento':
      return { ...state, pagamento: action.pagamento }
    case 'setDesconto':
      return { ...state, desconto: { ...state.desconto, ...action.desconto } }
    case 'setDeslocamento':
      return { ...state, deslocamento: { ...state.deslocamento, ...action.deslocamento } }
    case 'reset':
      return buildInitialState(action.config)

    case 'load':
      return action.state
  }
}
