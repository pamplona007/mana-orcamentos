import { IconBook2 } from '@tabler/icons-react'
import { useConfig } from '@/hooks/useConfig'
import { SettingsSection } from '@/components/SettingsSection'
import { SettingsGrid } from '@/components/SettingsGrid'
import { SettingsField } from '@/components/SettingsField'
import styles from './styles.module.scss'

export function SettingsCapa() {
  const { config, setPdf } = useConfig()
  const capa = config.pdf.capa

  const setPromessa = (index: number, patch: { titulo?: string; corpo?: string }) => {
    const promessas: { titulo: string; corpo: string }[] = [...capa.promessas]
    const atual = promessas[index] ?? { titulo: '', corpo: '' }
    promessas[index] = {
      titulo: patch.titulo ?? atual.titulo,
      corpo: patch.corpo ?? atual.corpo,
    }
    setPdf({ capa: { ...capa, promessas } })
  }

  return (
    <SettingsSection
      icon={<IconBook2 size={18} aria-hidden="true" />}
      title="Textos da Capa"
      helper={
        <>
          O bloco &quot;Sobre a Maná&quot; e as 3 promessas exibidas no rodapé da primeira página do
          PDF. Use 3 promessas no máximo.
        </>
      }
    >
      <SettingsGrid>
        <SettingsField id="capa-kicker" label="Kicker do sobre">
          <input
            id="capa-kicker"
            type="text"
            value={capa.sobreKicker}
            onChange={(e) => setPdf({ capa: { ...capa, sobreKicker: e.target.value } })}
          />
        </SettingsField>
        <SettingsField id="capa-titulo" label="Título do sobre">
          <input
            id="capa-titulo"
            type="text"
            value={capa.sobreTitulo}
            onChange={(e) => setPdf({ capa: { ...capa, sobreTitulo: e.target.value } })}
          />
        </SettingsField>
        <SettingsField id="capa-corpo" label="Corpo do sobre" full>
          <textarea
            id="capa-corpo"
            style={{ minHeight: 80 }}
            value={capa.sobreCorpo}
            onChange={(e) => setPdf({ capa: { ...capa, sobreCorpo: e.target.value } })}
          />
        </SettingsField>
        <SettingsField id="capa-rodape" label="Texto do rodapé">
          <input
            id="capa-rodape"
            type="text"
            value={capa.contatoRodape}
            onChange={(e) => setPdf({ capa: { ...capa, contatoRodape: e.target.value } })}
          />
        </SettingsField>
      </SettingsGrid>

      <div className={styles.promessas}>
        <span className={styles.promessasLabel}>Promessas (até 3)</span>
        {capa.promessas.slice(0, 3).map((p, i) => (
          <div key={i} className={styles.promessaRow}>
            <SettingsField id={`promessa-${i}-titulo`}>
              <input
                id={`promessa-${i}-titulo`}
                type="text"
                placeholder={`Título da promessa ${i + 1}`}
                value={p.titulo}
                onChange={(e) => setPromessa(i, { titulo: e.target.value })}
              />
            </SettingsField>
            <SettingsField id={`promessa-${i}-corpo`}>
              <textarea
                id={`promessa-${i}-corpo`}
                placeholder={`Corpo da promessa ${i + 1}`}
                style={{ minHeight: 50 }}
                value={p.corpo}
                onChange={(e) => setPromessa(i, { corpo: e.target.value })}
              />
            </SettingsField>
          </div>
        ))}
      </div>
    </SettingsSection>
  )
}
