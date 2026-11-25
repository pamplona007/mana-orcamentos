import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useOrcamento } from '@/hooks/useOrcamento'
import { EditorField } from '@/components/EditorField'
import { descontoSchema, TIPOS_DESCONTO } from '@/schemas/editorSchema'
import { formatBRL } from '@/utils/money'
import type { Desconto } from '@/types/orcamento'
import styles from './styles.module.scss'

export function EditorDesconto() {
  const { state, setDesconto } = useOrcamento()
  const { control } = useForm<Desconto>({
    resolver: zodResolver(descontoSchema),
    values: state.desconto,
    mode: 'onChange',
  })
  const desconto = state.desconto
  const tipo = desconto.tipo

  const update = (patch: Partial<Desconto>) => {
    const parsed = descontoSchema.safeParse({ ...state.desconto, ...patch })
    if (parsed.success) setDesconto(parsed.data)
  }

  return (
    <div className={styles.block}>
      <p className={styles.helperText}>
        Aplique um desconto manual quando o cliente pedir negociação no WhatsApp. O desconto é
        aplicado sobre o total do plano Premium (referência) e aparece no PDF.
      </p>
      <div className={styles.fieldGrid}>
        <Controller
          control={control}
          name="tipo"
          render={({ field, fieldState }) => (
            <EditorField id="desconto-tipo" label="Tipo" error={fieldState.error?.message}>
              <select
                id="desconto-tipo"
                name={field.name}
                value={field.value}
                onBlur={field.onBlur}
                onChange={(e) => {
                  const next = e.target.value as Desconto['tipo']
                  field.onChange(next)
                  update({ tipo: next })
                }}
              >
                <option value={TIPOS_DESCONTO[0]}>Sem desconto</option>
                <option value={TIPOS_DESCONTO[1]}>Percentual (%)</option>
                <option value={TIPOS_DESCONTO[2]}>Valor absoluto (R$)</option>
              </select>
            </EditorField>
          )}
        />
        {tipo !== 'nenhum' && (
          <Controller
            control={control}
            name="valor"
            render={({ field, fieldState }) => (
              <EditorField
                id="desconto-valor"
                label={tipo === 'percentual' ? 'Percentual' : 'Valor em R$'}
                error={fieldState.error?.message}
              >
                <input
                  id="desconto-valor"
                  name={field.name}
                  type="number"
                  min={0}
                  step={tipo === 'percentual' ? 0.5 : 1}
                  max={tipo === 'percentual' ? 100 : undefined}
                  value={field.value}
                  onBlur={field.onBlur}
                  onChange={(e) => {
                    const valor = Number(e.target.value)
                    field.onChange(valor)
                    update({ valor })
                  }}
                />
              </EditorField>
            )}
          />
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
