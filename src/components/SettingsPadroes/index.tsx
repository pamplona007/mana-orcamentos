import { IconUsers } from '@tabler/icons-react'
import { useConfig } from '@/hooks/useConfig'
import { SettingsSection } from '@/components/SettingsSection'
import { SettingsGrid } from '@/components/SettingsGrid'
import { SettingsField } from '@/components/SettingsField'
import { SettingsCheckbox } from '@/components/SettingsCheckbox'

export function SettingsPadroes() {
  const { config, setEditor } = useConfig()
  const convidados = config.editor.convidadosPadrao
  const deslocamento = config.editor.deslocamentoPadrao

  return (
    <SettingsSection
      icon={<IconUsers size={18} aria-hidden="true" />}
      title="Padrões do editor"
      helper={
        <>
          Esses valores preenchem o editor toda vez que ele é aberto (ou quando o atendente clica em
          &quot;limpar&quot;).
        </>
      }
    >
      <SettingsGrid>
        <SettingsField id="ed-adultos" label="Adultos">
          <input
            id="ed-adultos"
            type="number"
            min={0}
            step={1}
            value={convidados.adultos}
            onChange={(e) =>
              setEditor({
                convidadosPadrao: {
                  ...convidados,
                  adultos: Math.max(0, Number(e.target.value) || 0),
                },
              })
            }
          />
        </SettingsField>
        <SettingsField id="ed-c0a4" label="Crianças 0–4">
          <input
            id="ed-c0a4"
            type="number"
            min={0}
            step={1}
            value={convidados.criancas0a4}
            onChange={(e) =>
              setEditor({
                convidadosPadrao: {
                  ...convidados,
                  criancas0a4: Math.max(0, Number(e.target.value) || 0),
                },
              })
            }
          />
        </SettingsField>
        <SettingsField id="ed-c5a9" label="Crianças 5–9">
          <input
            id="ed-c5a9"
            type="number"
            min={0}
            step={1}
            value={convidados.criancas5a9}
            onChange={(e) =>
              setEditor({
                convidadosPadrao: {
                  ...convidados,
                  criancas5a9: Math.max(0, Number(e.target.value) || 0),
                },
              })
            }
          />
        </SettingsField>
        <SettingsField id="ed-pag" label="Pagamento padrão">
          <select
            id="ed-pag"
            value={config.editor.pagamentoPadrao}
            onChange={(e) =>
              setEditor({ pagamentoPadrao: e.target.value as 'pix' | 'parcelado' })
            }
          >
            <option value="parcelado">Parcelado em 10x</option>
            <option value="pix">À vista no Pix</option>
          </select>
        </SettingsField>
        <SettingsCheckbox
          id="ed-desloc-check"
          label="Deslocamento por padrão"
          text="Ativar por padrão"
          checked={deslocamento.ativo}
          onChange={(ativo) => setEditor({ deslocamentoPadrao: { ...deslocamento, ativo } })}
        />
        <SettingsField id="ed-desloc-valor" label="Valor do deslocamento (R$)">
          <input
            id="ed-desloc-valor"
            type="number"
            min={0}
            step={1}
            value={deslocamento.valor}
            onChange={(e) =>
              setEditor({
                deslocamentoPadrao: {
                  ...deslocamento,
                  valor: Math.max(0, Number(e.target.value) || 0),
                },
              })
            }
          />
        </SettingsField>
      </SettingsGrid>
    </SettingsSection>
  )
}
