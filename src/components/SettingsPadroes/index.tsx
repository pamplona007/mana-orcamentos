import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { IconUsers } from '@tabler/icons-react'
import { useConfig } from '@/hooks/useConfig'
import { editorConfigSchema } from '@/schemas/configSchema'
import type { ConfigEditor } from '@/types/config'
import { SettingsSection } from '@/components/SettingsSection'
import { SettingsGrid } from '@/components/SettingsGrid'
import { SettingsField } from '@/components/SettingsField'
import { SettingsCheckbox } from '@/components/SettingsCheckbox'

export function SettingsPadroes() {
  const { config, setEditor } = useConfig()
  const { control } = useForm<ConfigEditor>({
    resolver: zodResolver(editorConfigSchema),
    values: config.editor,
    mode: 'onChange',
  })

  const update = (patch: Partial<ConfigEditor>) => {
    const parsed = editorConfigSchema.safeParse({ ...config.editor, ...patch })
    if (parsed.success) setEditor(parsed.data)
  }

  const updateConvidados = (patch: Partial<ConfigEditor['convidadosPadrao']>) => {
    update({ convidadosPadrao: { ...config.editor.convidadosPadrao, ...patch } })
  }

  const updateDeslocamento = (patch: Partial<ConfigEditor['deslocamentoPadrao']>) => {
    update({ deslocamentoPadrao: { ...config.editor.deslocamentoPadrao, ...patch } })
  }

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
        <Controller
          control={control}
          name="convidadosPadrao.adultos"
          render={({ field, fieldState }) => (
            <SettingsField id="ed-adultos" label="Adultos" error={fieldState.error?.message}>
              <input
                id="ed-adultos"
                name={field.name}
                type="number"
                min={0}
                step={1}
                value={field.value}
                onBlur={field.onBlur}
                onChange={(e) => {
                  const adultos = Number(e.target.value)
                  field.onChange(adultos)
                  updateConvidados({ adultos })
                }}
              />
            </SettingsField>
          )}
        />
        <Controller
          control={control}
          name="convidadosPadrao.criancas0a4"
          render={({ field, fieldState }) => (
            <SettingsField id="ed-c0a4" label="Crianças 0–4" error={fieldState.error?.message}>
              <input
                id="ed-c0a4"
                name={field.name}
                type="number"
                min={0}
                step={1}
                value={field.value}
                onBlur={field.onBlur}
                onChange={(e) => {
                  const criancas0a4 = Number(e.target.value)
                  field.onChange(criancas0a4)
                  updateConvidados({ criancas0a4 })
                }}
              />
            </SettingsField>
          )}
        />
        <Controller
          control={control}
          name="convidadosPadrao.criancas5a9"
          render={({ field, fieldState }) => (
            <SettingsField id="ed-c5a9" label="Crianças 5–9" error={fieldState.error?.message}>
              <input
                id="ed-c5a9"
                name={field.name}
                type="number"
                min={0}
                step={1}
                value={field.value}
                onBlur={field.onBlur}
                onChange={(e) => {
                  const criancas5a9 = Number(e.target.value)
                  field.onChange(criancas5a9)
                  updateConvidados({ criancas5a9 })
                }}
              />
            </SettingsField>
          )}
        />
        <Controller
          control={control}
          name="pagamentoPadrao"
          render={({ field, fieldState }) => (
            <SettingsField
              id="ed-pag"
              label="Pagamento padrão"
              error={fieldState.error?.message}
            >
              <select
                id="ed-pag"
                name={field.name}
                value={field.value}
                onBlur={field.onBlur}
                onChange={(e) => {
                  const pagamentoPadrao = e.target.value as ConfigEditor['pagamentoPadrao']
                  field.onChange(pagamentoPadrao)
                  update({ pagamentoPadrao })
                }}
              >
                <option value="parcelado">Parcelado em 10x</option>
                <option value="pix">À vista no Pix</option>
              </select>
            </SettingsField>
          )}
        />
        <Controller
          control={control}
          name="deslocamentoPadrao.ativo"
          render={({ field }) => (
            <SettingsCheckbox
              id="ed-desloc-check"
              label="Deslocamento por padrão"
              text="Ativar por padrão"
              checked={field.value}
              onChange={(ativo) => {
                field.onChange(ativo)
                updateDeslocamento({ ativo })
              }}
            />
          )}
        />
        <Controller
          control={control}
          name="deslocamentoPadrao.valor"
          render={({ field, fieldState }) => (
            <SettingsField
              id="ed-desloc-valor"
              label="Valor do deslocamento (R$)"
              error={fieldState.error?.message}
            >
              <input
                id="ed-desloc-valor"
                name={field.name}
                type="number"
                min={0}
                step={1}
                value={field.value}
                onBlur={field.onBlur}
                onChange={(e) => {
                  const valor = Number(e.target.value)
                  field.onChange(valor)
                  updateDeslocamento({ valor })
                }}
              />
            </SettingsField>
          )}
        />
      </SettingsGrid>
    </SettingsSection>
  )
}
