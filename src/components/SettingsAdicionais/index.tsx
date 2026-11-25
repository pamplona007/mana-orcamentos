import { IconClock } from '@tabler/icons-react'
import { useConfig } from '@/hooks/useConfig'
import { SettingsSection } from '@/components/SettingsSection'
import { SettingsGrid } from '@/components/SettingsGrid'
import { SettingsField } from '@/components/SettingsField'
import { PriceField } from '@/components/PriceField'

export function SettingsAdicionais() {
  const { config, setPdf } = useConfig()
  const adicionais = config.pdf.adicionais

  return (
    <SettingsSection
      icon={<IconClock size={18} aria-hidden="true" />}
      title="Adicionais e pagamento"
      helper="Adicionais do cardápio, percentual de desconto à vista no Pix e número de parcelas."
    >
      <SettingsGrid>
        <PriceField
          label="Entrada (R$)"
          value={adicionais.entrada}
          onChange={(v) => setPdf({ adicionais: { ...adicionais, entrada: v } })}
          step={1}
        />
        <PriceField
          label="Cento extra (R$)"
          value={adicionais.salgadoExtra}
          onChange={(v) => setPdf({ adicionais: { ...adicionais, salgadoExtra: v } })}
          step={1}
        />
        <SettingsField id="adi-desc" label="Desconto à vista (0–1)">
          <input
            id="adi-desc"
            type="number"
            min={0}
            max={1}
            step={0.01}
            value={adicionais.descontoAvista}
            onChange={(e) =>
              setPdf({
                adicionais: {
                  ...adicionais,
                  descontoAvista: Math.min(1, Math.max(0, Number(e.target.value) || 0)),
                },
              })
            }
          />
        </SettingsField>
        <SettingsField id="adi-parc" label="Parcelas">
          <input
            id="adi-parc"
            type="number"
            min={1}
            max={24}
            step={1}
            value={adicionais.parcelas}
            onChange={(e) =>
              setPdf({
                adicionais: {
                  ...adicionais,
                  parcelas: Math.max(1, Number(e.target.value) || 1),
                },
              })
            }
          />
        </SettingsField>
        <SettingsField id="adi-km" label="Limite de km (deslocamento)">
          <input
            id="adi-km"
            type="number"
            min={0}
            step={1}
            value={adicionais.limiteKmDeslocamento}
            onChange={(e) =>
              setPdf({
                adicionais: {
                  ...adicionais,
                  limiteKmDeslocamento: Math.max(0, Number(e.target.value) || 0),
                },
              })
            }
          />
        </SettingsField>
      </SettingsGrid>
    </SettingsSection>
  )
}
