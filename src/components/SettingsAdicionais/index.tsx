import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { IconClock } from '@tabler/icons-react'
import { useConfig } from '@/hooks/useConfig'
import { adicionaisSchema } from '@/schemas/configSchema'
import type { ConfigPdfAdicionais } from '@/types/config'
import { SettingsSection } from '@/components/SettingsSection'
import { SettingsGrid } from '@/components/SettingsGrid'
import { SettingsField } from '@/components/SettingsField'
import { PriceField } from '@/components/PriceField'

export function SettingsAdicionais() {
  const { config, setPdf } = useConfig()
  const { control } = useForm<ConfigPdfAdicionais>({
    resolver: zodResolver(adicionaisSchema),
    values: config.pdf.adicionais,
    mode: 'onChange',
  })

  const update = (patch: Partial<ConfigPdfAdicionais>) => {
    const parsed = adicionaisSchema.safeParse({ ...config.pdf.adicionais, ...patch })
    if (parsed.success) setPdf({ adicionais: parsed.data })
  }

  return (
    <SettingsSection
      icon={<IconClock size={18} aria-hidden="true" />}
      title="Adicionais e pagamento"
      helper="Adicionais do cardápio, percentual de desconto à vista no Pix e número de parcelas."
    >
      <SettingsGrid>
        <Controller
          control={control}
          name="entrada"
          render={({ field, fieldState }) => (
            <PriceField
              label="Entrada (R$)"
              value={field.value}
              onChange={(valor) => {
                field.onChange(valor)
                update({ entrada: valor })
              }}
              step={1}
              error={fieldState.error?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="salgadoExtra"
          render={({ field, fieldState }) => (
            <PriceField
              label="Cento extra (R$)"
              value={field.value}
              onChange={(valor) => {
                field.onChange(valor)
                update({ salgadoExtra: valor })
              }}
              step={1}
              error={fieldState.error?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="descontoAvista"
          render={({ field, fieldState }) => (
            <SettingsField
              id="adi-desc"
              label="Desconto à vista (0–1)"
              error={fieldState.error?.message}
            >
              <input
                id="adi-desc"
                name={field.name}
                type="number"
                min={0}
                max={1}
                step={0.01}
                value={field.value}
                onBlur={field.onBlur}
                onChange={(e) => {
                  const valor = Number(e.target.value)
                  field.onChange(valor)
                  update({ descontoAvista: valor })
                }}
              />
            </SettingsField>
          )}
        />
        <Controller
          control={control}
          name="parcelas"
          render={({ field, fieldState }) => (
            <SettingsField id="adi-parc" label="Parcelas" error={fieldState.error?.message}>
              <input
                id="adi-parc"
                name={field.name}
                type="number"
                min={1}
                max={24}
                step={1}
                value={field.value}
                onBlur={field.onBlur}
                onChange={(e) => {
                  const valor = Number(e.target.value)
                  field.onChange(valor)
                  update({ parcelas: valor })
                }}
              />
            </SettingsField>
          )}
        />
        <Controller
          control={control}
          name="limiteKmDeslocamento"
          render={({ field, fieldState }) => (
            <SettingsField
              id="adi-km"
              label="Limite de km (deslocamento)"
              error={fieldState.error?.message}
            >
              <input
                id="adi-km"
                name={field.name}
                type="number"
                min={0}
                step={1}
                value={field.value}
                onBlur={field.onBlur}
                onChange={(e) => {
                  const valor = Number(e.target.value)
                  field.onChange(valor)
                  update({ limiteKmDeslocamento: valor })
                }}
              />
            </SettingsField>
          )}
        />
      </SettingsGrid>
    </SettingsSection>
  )
}
