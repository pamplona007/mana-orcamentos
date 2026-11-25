import { IconReceipt } from '@tabler/icons-react'
import { useConfig } from '@/hooks/useConfig'
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

  const setPreco = (plano: PlanoKey, modo: Modo, valor: number) => {
    setPdf({
      precos: {
        ...config.pdf.precos,
        [plano]: { ...config.pdf.precos[plano], [modo]: valor },
      },
    })
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
          <PriceField
            key={`${campo.plano}-${campo.modo}`}
            label={campo.label}
            value={config.pdf.precos[campo.plano][campo.modo]}
            onChange={(v) => setPreco(campo.plano, campo.modo, v)}
          />
        ))}
      </SettingsGrid>
    </SettingsSection>
  )
}
