import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { IconClock } from '@tabler/icons-react'
import { useConfig } from '@/hooks/useConfig'
import { validadeSchema } from '@/schemas/configSchema'
import type { ConfigValidade } from '@/types/config'
import { SettingsSection } from '@/components/SettingsSection'
import { SettingsGrid } from '@/components/SettingsGrid'
import { SettingsField } from '@/components/SettingsField'

export function SettingsValidade() {
  const { config, setValidade } = useConfig()
  const { control } = useForm<ConfigValidade>({
    resolver: zodResolver(validadeSchema),
    values: config.validade,
    mode: 'onChange',
  })

  const update = (horas: number) => {
    const parsed = validadeSchema.safeParse({ horas })
    if (parsed.success) setValidade(parsed.data)
  }

  return (
    <SettingsSection
      icon={<IconClock size={18} aria-hidden="true" />}
      title="Validade do orçamento"
      helper={
        <>
          Após esse tempo, o orçamento aparece como &quot;Expirado&quot; no histórico e o atendente
          precisa gerar um novo.
        </>
      }
    >
      <SettingsGrid>
        <Controller
          control={control}
          name="horas"
          render={({ field, fieldState }) => (
            <SettingsField
              id="val-horas"
              label="Validade (em horas)"
              error={fieldState.error?.message}
            >
              <input
                id="val-horas"
                name={field.name}
                type="number"
                min={1}
                step={1}
                value={field.value}
                onBlur={field.onBlur}
                onChange={(e) => {
                  const horas = Number(e.target.value)
                  field.onChange(horas)
                  update(horas)
                }}
              />
            </SettingsField>
          )}
        />
      </SettingsGrid>
    </SettingsSection>
  )
}
