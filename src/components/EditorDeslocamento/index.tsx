import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useOrcamento } from '@/hooks/useOrcamento'
import { AddonToggle } from '@/components/AddonToggle'
import { EditorField } from '@/components/EditorField'
import { deslocamentoSchema } from '@/schemas/editorSchema'
import { OPCIONAIS } from '@/services/planos'
import type { Deslocamento } from '@/types/orcamento'
import styles from './styles.module.scss'

export function EditorDeslocamento() {
  const { state, setDeslocamento } = useOrcamento()
  const { control } = useForm<Deslocamento>({
    resolver: zodResolver(deslocamentoSchema),
    values: state.deslocamento,
    mode: 'onChange',
  })
  const ativo = state.deslocamento.ativo

  const update = (patch: Partial<Deslocamento>) => {
    const parsed = deslocamentoSchema.safeParse({ ...state.deslocamento, ...patch })
    if (parsed.success) setDeslocamento(parsed.data)
  }

  return (
    <div className={styles.block}>
      <Controller
        control={control}
        name="ativo"
        render={({ field }) => (
          <AddonToggle
            label={OPCIONAIS.deslocamento.label}
            descricao={OPCIONAIS.deslocamento.descricao}
            valor={OPCIONAIS.deslocamento.valor}
            checked={field.value}
            onChange={(next) => {
              field.onChange(next)
              update({ ativo: next })
            }}
          />
        )}
      />
      {ativo && (
        <Controller
          control={control}
          name="valor"
          render={({ field, fieldState }) => (
            <EditorField
              id="deslocamento-valor"
              label="Valor do deslocamento (R$)"
              error={fieldState.error?.message}
            >
              <input
                id="deslocamento-valor"
                name={field.name}
                type="number"
                min={0}
                step={1}
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
  )
}
