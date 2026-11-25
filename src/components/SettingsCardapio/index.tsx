import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { IconPalette } from '@tabler/icons-react'
import { useConfig } from '@/hooks/useConfig'
import { cardapioSchema } from '@/schemas/configSchema'
import type { ConfigPdfCardapio } from '@/types/config'
import { SettingsSection } from '@/components/SettingsSection'
import { SettingsGrid } from '@/components/SettingsGrid'
import { SettingsField } from '@/components/SettingsField'

function parseLinhas(valor: string): string[] {
  return valor
    .split('\n')
    .map((linha) => linha.trim())
    .filter(Boolean)
}

export function SettingsCardapio() {
  const { config, setPdf } = useConfig()
  const { control } = useForm<ConfigPdfCardapio>({
    resolver: zodResolver(cardapioSchema),
    values: config.pdf.cardapio,
    mode: 'onChange',
  })

  const update = (patch: Partial<ConfigPdfCardapio>) => {
    const parsed = cardapioSchema.safeParse({ ...config.pdf.cardapio, ...patch })
    if (parsed.success) setPdf({ cardapio: parsed.data })
  }

  return (
    <SettingsSection
      icon={<IconPalette size={18} aria-hidden="true" />}
      title="Cardápio do PDF"
      helper={
        <>
          Deixe em branco para usar a lista padrão. Se preencher, sua lista substitui a padrão. Um
          sabor por linha.
        </>
      }
    >
      <SettingsGrid>
        <Controller
          control={control}
          name="salgadosCustomizados"
          render={({ field, fieldState }) => (
            <SettingsField
              id="card-salgados"
              label="Salgados customizados"
              full
              error={fieldState.error?.message}
            >
              <textarea
                id="card-salgados"
                name={field.name}
                placeholder="Um por linha. Vazio = lista padrão (21 sabores)."
                value={field.value.join('\n')}
                onBlur={field.onBlur}
                onChange={(e) => {
                  const salgadosCustomizados = parseLinhas(e.target.value)
                  field.onChange(salgadosCustomizados)
                  update({ salgadosCustomizados })
                }}
              />
            </SettingsField>
          )}
        />
        <Controller
          control={control}
          name="docesCustomizados"
          render={({ field, fieldState }) => (
            <SettingsField
              id="card-doces"
              label="Doces customizados"
              full
              error={fieldState.error?.message}
            >
              <textarea
                id="card-doces"
                name={field.name}
                placeholder="Um por linha. Vazio = lista padrão (6 sabores)."
                value={field.value.join('\n')}
                onBlur={field.onBlur}
                onChange={(e) => {
                  const docesCustomizados = parseLinhas(e.target.value)
                  field.onChange(docesCustomizados)
                  update({ docesCustomizados })
                }}
              />
            </SettingsField>
          )}
        />
      </SettingsGrid>
    </SettingsSection>
  )
}
