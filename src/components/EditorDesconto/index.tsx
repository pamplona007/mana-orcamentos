import { useOrcamento } from '@/hooks/useOrcamento'
import { EditorField } from '@/components/EditorField'
import { formatBRL } from '@/utils/money'
import styles from './styles.module.scss'

export function EditorDesconto() {
  const { state, setDesconto } = useOrcamento()
  const desconto = state.desconto

  return (
    <div className={styles.block}>
      <p className={styles.helperText}>
        Aplique um desconto manual quando o cliente pedir negociação no WhatsApp. O desconto é
        aplicado sobre o total do plano Premium (referência) e aparece no PDF.
      </p>
      <div className={styles.fieldGrid}>
        <EditorField id="desconto-tipo" label="Tipo">
          <select
            id="desconto-tipo"
            value={desconto.tipo}
            onChange={(e) =>
              setDesconto({ tipo: e.target.value as 'nenhum' | 'percentual' | 'absoluto' })
            }
          >
            <option value="nenhum">Sem desconto</option>
            <option value="percentual">Percentual (%)</option>
            <option value="absoluto">Valor absoluto (R$)</option>
          </select>
        </EditorField>
        {desconto.tipo !== 'nenhum' && (
          <EditorField
            id="desconto-valor"
            label={desconto.tipo === 'percentual' ? 'Percentual' : 'Valor em R$'}
          >
            <input
              id="desconto-valor"
              type="number"
              min={0}
              step={desconto.tipo === 'percentual' ? 0.5 : 1}
              max={desconto.tipo === 'percentual' ? 100 : undefined}
              value={desconto.valor}
              onChange={(e) => setDesconto({ valor: Math.max(0, Number(e.target.value) || 0) })}
            />
          </EditorField>
        )}
      </div>
      {desconto.tipo !== 'nenhum' && desconto.valor > 0 && (
        <div className={styles.descontoPreview}>
          <span className={styles.descontoPreviewLabel}>Desconto aplicado</span>
          <span className={styles.descontoPreviewValor}>
            {desconto.tipo === 'percentual' ? `${desconto.valor}%` : formatBRL(desconto.valor)}
          </span>
        </div>
      )}
    </div>
  )
}
