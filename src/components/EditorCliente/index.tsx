import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useOrcamento } from '@/hooks/useOrcamento'
import { EditorField } from '@/components/EditorField'
import { clienteSchema } from '@/schemas/editorSchema'
import type { Cliente } from '@/types/orcamento'
import styles from './styles.module.scss'

export function EditorCliente() {
  const { state, setCliente } = useOrcamento()
  const { control } = useForm<Cliente>({
    resolver: zodResolver(clienteSchema),
    values: state.cliente,
    mode: 'onChange',
  })

  const update = (patch: Partial<Cliente>) => {
    const parsed = clienteSchema.safeParse({ ...state.cliente, ...patch })
    if (parsed.success) setCliente(parsed.data)
  }

  return (
    <div className={styles.block}>
      <Controller
        control={control}
        name="nome"
        render={({ field, fieldState }) => (
          <EditorField id="cliente-nome" label="Nome do cliente" error={fieldState.error?.message}>
            <input
              id="cliente-nome"
              name={field.name}
              value={field.value}
              onBlur={field.onBlur}
              onChange={(e) => {
                field.onChange(e.target.value)
                update({ nome: e.target.value })
              }}
              placeholder="Ex: Maria Silva"
            />
          </EditorField>
        )}
      />
      <Controller
        control={control}
        name="whatsapp"
        render={({ field, fieldState }) => (
          <EditorField id="cliente-whats" label="WhatsApp" error={fieldState.error?.message}>
            <input
              id="cliente-whats"
              name={field.name}
              value={field.value}
              onBlur={field.onBlur}
              onChange={(e) => {
                field.onChange(e.target.value)
                update({ whatsapp: e.target.value })
              }}
              placeholder="(85) 9 9999-9999"
            />
          </EditorField>
        )}
      />
    </div>
  )
}
