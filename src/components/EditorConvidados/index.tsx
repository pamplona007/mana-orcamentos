import { useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useOrcamento } from '@/hooks/useOrcamento'
import { GuestBreakdown } from '@/components/GuestBreakdown'
import { convidadosFormSchema, convidadosSchema } from '@/schemas/editorSchema'
import type { Convidado } from '@/types/orcamento'
import styles from './styles.module.scss'

type ConvidadosForm = { convidados: Convidado }

export function EditorConvidados() {
  const { state, setConvidados } = useOrcamento()
  const values = useMemo<ConvidadosForm>(
    () => ({ convidados: state.convidados }),
    [state.convidados],
  )
  const { control } = useForm<ConvidadosForm>({
    resolver: zodResolver(convidadosFormSchema),
    values,
    mode: 'onChange',
  })

  const update = (next: Convidado) => {
    const parsed = convidadosSchema.safeParse(next)
    if (parsed.success) setConvidados(parsed.data)
  }

  return (
    <div className={styles.block}>
      <Controller
        control={control}
        name="convidados"
        render={({ field, fieldState }) => (
          <>
            <GuestBreakdown
              value={field.value}
              onChange={(next) => {
                field.onChange(next)
                update(next)
              }}
            />
            {fieldState.error?.message && (
              <p className={styles.feedback} role="alert">
                {fieldState.error.message}
              </p>
            )}
          </>
        )}
      />
    </div>
  )
}
