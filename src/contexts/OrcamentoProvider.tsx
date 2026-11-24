import { useContext, useMemo, useReducer, type ReactNode } from 'react'
import type { Config } from '@/types/config'
import { CONFIG_DEFAULT } from '@/types/config'
import type { TotaisPorPlano } from '@/types/orcamento'
import { calcularTotais } from '@/utils/calculo'
import { ConfigContext } from './configContext'
import { buildInitialState, reducer } from './orcamentoReducer'
import { OrcamentoContext, type OrcamentoCtx } from './orcamentoContext'

function useConfigOrDefault(): Config {
  const ctx = useContext(ConfigContext)
  return ctx?.config ?? CONFIG_DEFAULT
}

export function OrcamentoProvider({ children }: { children: ReactNode }) {
  const config = useConfigOrDefault()
  const [state, dispatch] = useReducer(reducer, null, () => buildInitialState(config))

  const totais = useMemo<TotaisPorPlano>(() => {
    const opts = { precos: config.pdf.precos, adicionais: config.pdf.adicionais }
    return {
      premium: calcularTotais('premium', state, opts),
      livreBebida: calcularTotais('livre-bebida', state, opts),
      livreSemBebida: calcularTotais('livre-sem-bebida', state, opts),
      unidade: calcularTotais('unidade', state, opts),
    }
  }, [state, config.pdf.precos, config.pdf.adicionais])

  const toOrcamento = (id?: string) => ({
    id: id ?? crypto.randomUUID(),
    criadoEm: new Date().toISOString(),
    cliente: state.cliente,
    evento: state.evento,
    convidados: state.convidados,
    deslocamento: state.deslocamento,
    pagamento: state.pagamento,
    desconto: state.desconto,
  })

  const value: OrcamentoCtx = {
    state,
    setCliente: (cliente) => dispatch({ type: 'setCliente', cliente }),
    setEvento: (evento) => dispatch({ type: 'setEvento', evento }),
    setConvidados: (convidados) => dispatch({ type: 'setConvidados', convidados }),
    setPagamento: (pagamento) => dispatch({ type: 'setPagamento', pagamento }),
    setDesconto: (desconto) => dispatch({ type: 'setDesconto', desconto }),
    setDeslocamento: (deslocamento) => dispatch({ type: 'setDeslocamento', deslocamento }),
    reset: () => dispatch({ type: 'reset', config }),
    load: (s) => dispatch({ type: 'load', state: s }),
    totais,
    toOrcamento,
  }

  return <OrcamentoContext.Provider value={value}>{children}</OrcamentoContext.Provider>
}
