import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { IconBook2 } from '@tabler/icons-react'
import { useConfig } from '@/hooks/useConfig'
import { capaSchema } from '@/schemas/configSchema'
import type { ConfigPdfCapa } from '@/types/config'
import { SettingsSection } from '@/components/SettingsSection'
import { SettingsGrid } from '@/components/SettingsGrid'
import { SettingsField } from '@/components/SettingsField'
import styles from './styles.module.scss'

export function SettingsCapa() {
  const { config, setPdf } = useConfig()
  const capa = config.pdf.capa
  const { control } = useForm<ConfigPdfCapa>({
    resolver: zodResolver(capaSchema),
    values: capa,
    mode: 'onChange',
  })

  const update = (proxima: ConfigPdfCapa) => {
    const parsed = capaSchema.safeParse(proxima)
    if (parsed.success) setPdf({ capa: parsed.data })
  }

  const setPromessa = (index: number, patch: { titulo?: string; corpo?: string }) => {
    const promessas: { titulo: string; corpo: string }[] = [...capa.promessas]
    const atual = promessas[index] ?? { titulo: '', corpo: '' }
    promessas[index] = {
      titulo: patch.titulo ?? atual.titulo,
      corpo: patch.corpo ?? atual.corpo,
    }
    update({ ...capa, promessas })
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
        <Controller
          control={control}
          name="sobreKicker"
          render={({ field, fieldState }) => (
            <SettingsField
              id="capa-kicker"
              label="Kicker do sobre"
              error={fieldState.error?.message}
            >
              <input
                id="capa-kicker"
                name={field.name}
                type="text"
                value={field.value}
                onBlur={field.onBlur}
                onChange={(e) => {
                  field.onChange(e.target.value)
                  update({ ...capa, sobreKicker: e.target.value })
                }}
              />
            </SettingsField>
          )}
        />
        <Controller
          control={control}
          name="sobreTitulo"
          render={({ field, fieldState }) => (
            <SettingsField
              id="capa-titulo"
              label="Título do sobre"
              error={fieldState.error?.message}
            >
              <input
                id="capa-titulo"
                name={field.name}
                type="text"
                value={field.value}
                onBlur={field.onBlur}
                onChange={(e) => {
                  field.onChange(e.target.value)
                  update({ ...capa, sobreTitulo: e.target.value })
                }}
              />
            </SettingsField>
          )}
        />
        <Controller
          control={control}
          name="sobreCorpo"
          render={({ field, fieldState }) => (
            <SettingsField
              id="capa-corpo"
              label="Corpo do sobre"
              full
              error={fieldState.error?.message}
            >
              <textarea
                id="capa-corpo"
                name={field.name}
                style={{ minHeight: 80 }}
                value={field.value}
                onBlur={field.onBlur}
                onChange={(e) => {
                  field.onChange(e.target.value)
                  update({ ...capa, sobreCorpo: e.target.value })
                }}
              />
            </SettingsField>
          )}
        />
        <Controller
          control={control}
          name="contatoRodape"
          render={({ field, fieldState }) => (
            <SettingsField
              id="capa-rodape"
              label="Texto do rodapé"
              error={fieldState.error?.message}
            >
              <input
                id="capa-rodape"
                name={field.name}
                type="text"
                value={field.value}
                onBlur={field.onBlur}
                onChange={(e) => {
                  field.onChange(e.target.value)
                  update({ ...capa, contatoRodape: e.target.value })
                }}
              />
            </SettingsField>
          )}
        />
      </SettingsGrid>

      <div className={styles.promessas}>
        <span className={styles.promessasLabel}>Promessas (até 3)</span>
        {capa.promessas.slice(0, 3).map((_, i) => (
          <div key={i} className={styles.promessaRow}>
            <Controller
              control={control}
              name={`promessas.${i}.titulo`}
              render={({ field }) => (
                <SettingsField id={`promessa-${i}-titulo`}>
                  <input
                    id={`promessa-${i}-titulo`}
                    name={field.name}
                    type="text"
                    placeholder={`Título da promessa ${i + 1}`}
                    value={field.value}
                    onBlur={field.onBlur}
                    onChange={(e) => {
                      field.onChange(e.target.value)
                      setPromessa(i, { titulo: e.target.value })
                    }}
                  />
                </SettingsField>
              )}
            />
            <Controller
              control={control}
              name={`promessas.${i}.corpo`}
              render={({ field }) => (
                <SettingsField id={`promessa-${i}-corpo`}>
                  <textarea
                    id={`promessa-${i}-corpo`}
                    name={field.name}
                    placeholder={`Corpo da promessa ${i + 1}`}
                    style={{ minHeight: 50 }}
                    value={field.value}
                    onBlur={field.onBlur}
                    onChange={(e) => {
                      field.onChange(e.target.value)
                      setPromessa(i, { corpo: e.target.value })
                    }}
                  />
                </SettingsField>
              )}
            />
          </div>
        ))}
      </div>
    </SettingsSection>
  )
}
