import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useOrcamento } from '@/hooks/useOrcamento'
import { EditorField } from '@/components/EditorField'
import { eventoSchema } from '@/schemas/editorSchema'
import type { Evento } from '@/types/orcamento'
import styles from './styles.module.scss'

export function EditorEvento() {
  const { state, setEvento } = useOrcamento()
  const { control } = useForm<Evento>({
    resolver: zodResolver(eventoSchema),
    values: state.evento,
    mode: 'onChange',
  })

  const update = (patch: Partial<Evento>) => {
    const parsed = eventoSchema.safeParse({ ...state.evento, ...patch })
    if (parsed.success) setEvento(parsed.data)
  }

  return (
    <div className={styles.block}>
      <Controller
        control={control}
        name="data"
        render={({ field, fieldState }) => (
          <EditorField id="evento-data" label="Data do evento" error={fieldState.error?.message}>
            <input
              id="evento-data"
              name={field.name}
              type="date"
              value={field.value}
              onBlur={field.onBlur}
              onChange={(e) => {
                field.onChange(e.target.value)
                update({ data: e.target.value })
              }}
            />
          </EditorField>
        )}
      />
      <Controller
        control={control}
        name="cidadeBairro"
        render={({ field, fieldState }) => (
          <EditorField
            id="evento-local"
            label="Cidade e bairro"
            error={fieldState.error?.message}
          >
            <input
              id="evento-local"
              name={field.name}
              value={field.value}
              onBlur={field.onBlur}
              onChange={(e) => {
                field.onChange(e.target.value)
                update({ cidadeBairro: e.target.value })
              }}
              placeholder="Ex: Fortaleza, Aldeota"
            />
          </EditorField>
        )}
      />
      <Controller
        control={control}
        name="observacoes"
        render={({ field, fieldState }) => (
          <EditorField id="evento-obs" label="Observações" full error={fieldState.error?.message}>
            <textarea
              id="evento-obs"
              name={field.name}
              value={field.value}
              onBlur={field.onBlur}
              onChange={(e) => {
                field.onChange(e.target.value)
                update({ observacoes: e.target.value })
              }}
              placeholder="Ex: 2 vegetarianos, restrição a lactose, levar pimentas frescas"
              rows={3}
            />
          </EditorField>
        )}
      />
    </div>
  )
}
