import { Link } from 'react-router-dom'
import { IconArrowRight, IconUsers, IconPizza } from '@tabler/icons-react'
import { useOrcamento } from '@/hooks/useOrcamento'
import { PriceDisplay } from '@/components/PriceDisplay'
import { formatBRL } from '@/utils/money'
import { ADICIONAL_ENTRADA, ADICIONAL_SALGADO_EXTRA } from '@/data/plans'
import styles from './styles.module.scss'

export function OrcamentoSummary() {
  const { state, totais, planoSelecionado } = useOrcamento()
  const isPremium = state.plano === 'premium'
  const isPix = state.pagamento === 'pix'

  const pessoas = totais.adultosEquivalentes
  const pizzas = totais.pizzas

  const summaryClass = [
    styles['summary'],
    isPremium ? styles['summaryWine'] : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={summaryClass} aria-label="Resumo do orçamento">
      <div>
        <div className={styles.label}>Plano escolhido</div>
        <div className={styles.planoNome}>{planoSelecionado.nome}</div>
        {isPremium && (
          <div className={styles.planoBadge}>
            <span aria-hidden="true">★</span> Premium · Recomendado
          </div>
        )}
      </div>

      <div className={styles.total}>
        <div className={styles.totalLabel}>{isPix ? 'Total à vista' : 'Total parcelado'}</div>
        <PriceDisplay
          value={isPix ? totais.totalAvista : totais.total}
          size="hero"
          variant={isPremium ? 'wine' : 'cream'}
        />
        {pessoas > 0 && (
          <div className={styles.unidades} style={{ marginTop: 'var(--space-2)' }}>
            <IconUsers size={14} aria-hidden="true" />
            {pessoas} {pessoas === 1 ? 'pessoa' : 'pessoas'}
            <span aria-hidden="true">·</span>
            <span style={{ color: 'var(--cream-faint)' }}>
              {formatBRL(planoSelecionado.precoPessoaAvista)}/pessoa
            </span>
            {pizzas > 0 && (
              <>
                <span aria-hidden="true">·</span>
                <IconPizza size={14} aria-hidden="true" />
                {pizzas} {pizzas === 1 ? 'pizza' : 'pizzas'}
              </>
            )}
          </div>
        )}
      </div>

      <div className={styles.breakdown}>
        <div className={styles.breakdownRow}>
          <span className={styles.breakdownLabel}>
            {pizzas > 0 ? `${pizzas} pizzas` : `${pessoas} ${pessoas === 1 ? 'pessoa' : 'pessoas'}`}
          </span>
          <span className={styles.breakdownValue}>
            {formatBRL(totais.subtotal)}
          </span>
        </div>

        {totais.adicionais > 0 && (
          <div className={styles.breakdownRow}>
            <span className={styles.breakdownLabel}>Adicionais</span>
            <span className={styles.breakdownValue}>+ {formatBRL(totais.adicionais)}</span>
          </div>
        )}

        <div className={styles.breakdownDivider} />

        <div className={styles.breakdownRow}>
          <span className={styles.breakdownLabel}>
            <strong>10x de</strong>
            <div className={styles.breakdownMeta}>no cartão</div>
          </span>
          <span
            className={`${styles.breakdownValue} ${!isPix ? styles.breakdownValueWine : ''}`}
          >
            {formatBRL(totais.parcela10x)}
          </span>
        </div>

        <div className={styles.breakdownRow}>
          <span className={styles.breakdownLabel}>
            <strong>À vista no Pix</strong>
            <div className={styles.breakdownMeta}>
              15% de desconto · economize {formatBRL(totais.total - totais.totalAvista)}
            </div>
          </span>
          <span
            className={`${styles.breakdownValue} ${isPix ? styles.breakdownValueWine : ''}`}
          >
            {formatBRL(totais.totalAvista)}
          </span>
        </div>
      </div>

      {(state.adicionais.entrada || state.adicionais.salgadosExtras > 0) && (
        <div className={styles.composition}>
          {state.adicionais.entrada && (
            <div className={styles.compositionRow}>
              <span>Entrada (salgados + batata)</span>
              <strong>{formatBRL(ADICIONAL_ENTRADA)}</strong>
            </div>
          )}
          {state.adicionais.salgadosExtras > 0 && (
            <div className={styles.compositionRow}>
              <span>
                {state.adicionais.salgadosExtras} cento(s) extra
              </span>
              <strong>
                {formatBRL(state.adicionais.salgadosExtras * ADICIONAL_SALGADO_EXTRA)}
              </strong>
            </div>
          )}
        </div>
      )}

      <Link
        to="/preview"
        className={`${styles.cta} ${isPremium ? styles.ctaWine : ''}`}
      >
        Gerar PDF
        <IconArrowRight size={16} aria-hidden="true" />
      </Link>
    </div>
  )
}
