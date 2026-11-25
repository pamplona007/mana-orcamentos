import { IconClock } from '@tabler/icons-react'
import { useConfig } from '@/hooks/useConfig'
import { SettingsSection } from '@/components/SettingsSection'
import { SettingsGrid } from '@/components/SettingsGrid'
import { SettingsField } from '@/components/SettingsField'

export function SettingsValidade() {
  const { config, setValidade } = useConfig()

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
        <SettingsField id="val-horas" label="Validade (em horas)">
          <input
            id="val-horas"
            type="number"
            min={1}
            step={1}
            value={config.validade.horas}
            onChange={(e) => setValidade({ horas: Math.max(1, Number(e.target.value) || 1) })}
          />
        </SettingsField>
      </SettingsGrid>
    </SettingsSection>
  )
}
