import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { IconReceipt } from '@tabler/icons-react'
import { useConfig } from '@/hooks/useConfig'
import { precosSchema } from '@/schemas/configSchema'
import type { ConfigPdfPrecos } from '@/types/config'
import { SettingsSection } from '@/components/SettingsSection'
import { SettingsGrid } from '@/components/SettingsGrid'
import { PriceField } from '@/components/PriceField'

type PlanoKey = keyof ConfigPdfPrecos
type Modo = 'parcelado' | 'avista'

const CAMPOS: { plano: PlanoKey; modo: Modo; label: string }[] = [
  { plano: 'premium', modo: 'parcelado', label: 'Premium · parcelado' },
  { plano: 'premium', modo: 'avista', label: 'Premium · à vista' },
  { plano: 'livreBebida', modo: 'parcelado', label: 'Rodízio livre · parcelado' },
  { plano: 'livreBebida', modo: 'avista', label: 'Rodízio livre · à vista' },
  { plano: 'livreSemBebida', modo: 'parcelado', label: 'Sem bebida · parcelado' },
  { plano: 'livreSemBebida', modo: 'avista', label: 'Sem bebida · à vista' },
  { plano: 'unidade', modo: 'parcelado', label: 'Por unidade · parcelado' },
  { plano: 'unidade', modo: 'avista', label: 'Por unidade · à vista' },
]

export function SettingsPrecos() {
  const { config, setPdf } = useConfig()
  const { control } = useForm<ConfigPdfPrecos>({
    resolver: zodResolver(precosSchema),
    values: config.pdf.precos,
    mode: 'onChange',
  })

  const update = (plano: PlanoKey, modo: Modo, valor: number) => {
    const next: ConfigPdfPrecos = {
      ...config.pdf.precos,
      [plano]: { ...config.pdf.precos[plano], [modo]: valor },
    }
    const parsed = precosSchema.safeParse(next)
    if (parsed.success) setPdf({ precos: parsed.data })
  }

  return (
    <SettingsSection
      icon={<IconReceipt size={18} aria-hidden="true" />}
      title="Preços dos planos"
      helper={
        <>
          Valor por pessoa (ou por pizza no plano por unidade). Parcelado é o preço cheio no cartão;
          à vista é o valor com o desconto Pix aplicado.
        </>
      }
    >
      <SettingsGrid>
        {CAMPOS.map((campo) => (
          <Controller
            key={`${campo.plano}-${campo.modo}`}
            control={control}
            name={`${campo.plano}.${campo.modo}`}
            render={({ field, fieldState }) => (
              <PriceField
                label={campo.label}
                value={field.value}
                onChange={(valor) => {
                  field.onChange(valor)
                  update(campo.plano, campo.modo, valor)
                }}
                error={fieldState.error?.message}
              />
            )}
          />
        ))}
      </SettingsGrid>
    </SettingsSection>
  )
}
