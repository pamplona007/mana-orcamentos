import { useOrcamento } from '@/hooks/useOrcamento'
import { GuestBreakdown } from '@/components/GuestBreakdown'
import { AddonToggle } from '@/components/AddonToggle'
import { OPCIONAIS } from '@/data/plans'
import { formatBRL } from '@/utils/money'
import styles from './styles.module.scss'

export function Editor() {
  const {
    state,
    setCliente,
    setEvento,
    setConvidados,
    setDesconto,
    setDeslocamento,
  } = useOrcamento()

  return (
    <div className={styles.editor}>
      <div className={styles.main}>
        <section className={styles.section} aria-label="Dados do cliente">
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>Cliente e evento</h2>
          </div>
          <div className={styles.fieldGrid}>
            <div className={styles.field}>
              <label className={styles.fieldLabel} htmlFor="cliente-nome">Nome do cliente</label>
              <input
                id="cliente-nome"
                className={styles.fieldInput}
                value={state.cliente.nome}
                onChange={(e) => setCliente({ ...state.cliente, nome: e.target.value })}
                placeholder="Ex: Maria Silva"
              />
            </div>
            <div className={styles.field}>
              <label className={styles.fieldLabel} htmlFor="cliente-whats">WhatsApp</label>
              <input
                id="cliente-whats"
                className={styles.fieldInput}
                value={state.cliente.whatsapp}
                onChange={(e) => setCliente({ ...state.cliente, whatsapp: e.target.value })}
                placeholder="(85) 9 9999-9999"
              />
            </div>
            <div className={styles.field}>
              <label className={styles.fieldLabel} htmlFor="evento-data">Data do evento</label>
              <input
                id="evento-data"
                type="date"
                className={styles.fieldInput}
                value={state.evento.data}
                onChange={(e) => setEvento({ data: e.target.value })}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.fieldLabel} htmlFor="evento-local">Cidade e bairro</label>
              <input
                id="evento-local"
                className={styles.fieldInput}
                value={state.evento.cidadeBairro}
                onChange={(e) => setEvento({ cidadeBairro: e.target.value })}
                placeholder="Ex: Fortaleza, Aldeota"
              />
            </div>
            <div className={`${styles.field} ${styles.fieldFull}`}>
              <label className={styles.fieldLabel} htmlFor="evento-obs">Observações</label>
              <textarea
                id="evento-obs"
                className={styles.fieldTextarea}
                value={state.evento.observacoes}
                onChange={(e) => setEvento({ observacoes: e.target.value })}
                placeholder="Ex: 2 vegetarianos, restrição a lactose, levar pimentas frescas"
                rows={3}
              />
            </div>
          </div>
        </section>

        <section className={styles.section} aria-label="Convidados">
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>Convidados</h2>
          </div>
          <GuestBreakdown value={state.convidados} onChange={setConvidados} />
        </section>

        <section className={styles.section} aria-label="Deslocamento">
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>Deslocamento</h2>
          </div>
          <AddonToggle
            label={OPCIONAIS.deslocamento.label}
            descricao={OPCIONAIS.deslocamento.descricao}
            valor={OPCIONAIS.deslocamento.valor}
            checked={state.deslocamento.ativo}
            onChange={(ativo) => setDeslocamento({ ativo })}
          />
          {state.deslocamento.ativo && (
            <div className={styles.field}>
              <label className={styles.fieldLabel} htmlFor="deslocamento-valor">Valor do deslocamento (R$)</label>
              <input
                id="deslocamento-valor"
                type="number"
                min={0}
                step={1}
                value={state.deslocamento.valor}
                onChange={(e) =>
                  setDeslocamento({ valor: Math.max(0, Number(e.target.value) || 0) })
                }
                className={styles.fieldInput}
              />
            </div>
          )}
        </section>

        <section className={styles.section} aria-label="Desconto">
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>Desconto</h2>
          </div>
          <p className={styles.helperText}>
            Aplique um desconto manual quando o cliente pedir negociação no WhatsApp.
            O desconto é aplicado sobre o total do plano Premium (referência) e aparece
            no PDF.
          </p>
          <div className={styles.fieldGrid}>
            <div className={styles.field}>
              <label className={styles.fieldLabel} htmlFor="desconto-tipo">Tipo</label>
              <select
                id="desconto-tipo"
                className={styles.fieldInput}
                value={state.desconto.tipo}
                onChange={(e) => setDesconto({ tipo: e.target.value as 'nenhum' | 'percentual' | 'absoluto' })}
              >
                <option value="nenhum">Sem desconto</option>
                <option value="percentual">Percentual (%)</option>
                <option value="absoluto">Valor absoluto (R$)</option>
              </select>
            </div>
            {state.desconto.tipo !== 'nenhum' && (
              <div className={styles.field}>
                <label className={styles.fieldLabel} htmlFor="desconto-valor">
                  {state.desconto.tipo === 'percentual' ? 'Percentual' : 'Valor em R$'}
                </label>
                <input
                  id="desconto-valor"
                  type="number"
                  min={0}
                  step={state.desconto.tipo === 'percentual' ? 0.5 : 1}
                  max={state.desconto.tipo === 'percentual' ? 100 : undefined}
                  value={state.desconto.valor}
                  onChange={(e) => setDesconto({ valor: Math.max(0, Number(e.target.value) || 0) })}
                  className={styles.fieldInput}
                />
              </div>
            )}
          </div>
          {state.desconto.tipo !== 'nenhum' && state.desconto.valor > 0 && (
            <div className={styles.descontoPreview}>
              <span className={styles.descontoPreviewLabel}>Desconto aplicado</span>
              <span className={styles.descontoPreviewValor}>
                {state.desconto.tipo === 'percentual'
                  ? `${state.desconto.valor}%`
                  : formatBRL(state.desconto.valor)}
              </span>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
