import { useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { IconMessageDots } from '@tabler/icons-react'
import { useConfig } from '@/hooks/useConfig'
import { whatsappConfigSchema } from '@/schemas/configSchema'
import { mensagemWhatsApp } from '@/utils/whatsapp'
import type { ConfigWhatsApp } from '@/types/config'
import { SettingsSection } from '@/components/SettingsSection'
import styles from './styles.module.scss'

const VARIAVEIS = ['{nome}', '{empresa}', '{deData}', '{emCidade}', '{condicao}', '{validadeHoras}']

export function SettingsMensagem() {
  const { config, setWhatsApp } = useConfig()
  const percentualDesconto = Math.round(config.pdf.adicionais.descontoAvista * 100)
  const { control } = useForm<ConfigWhatsApp>({
    resolver: zodResolver(whatsappConfigSchema),
    values: config.whatsapp,
    mode: 'onChange',
  })

  const update = (template: string) => {
    const parsed = whatsappConfigSchema.safeParse({ template })
    if (parsed.success) setWhatsApp(parsed.data)
  }

  const preview = useMemo(
    () =>
      mensagemWhatsApp({
        template: config.whatsapp.template,
        nome: 'Maria Silva',
        empresa: config.empresa.nomeFantasia,
        data: '15/11/2026',
        cidade: 'Fortaleza, Aldeota',
        condicao: `à vista no Pix com ${percentualDesconto}% de desconto`,
        validadeHoras: config.validade.horas,
      }),
    [
      config.whatsapp.template,
      config.empresa.nomeFantasia,
      config.validade.horas,
      percentualDesconto,
    ],
  )

  return (
    <SettingsSection
      icon={<IconMessageDots size={18} aria-hidden="true" />}
      title="Mensagem do WhatsApp"
      helper={
        <>
          Template enviado junto com o PDF. Use as variáveis abaixo. O preview à direita mostra como
          a mensagem fica com os dados atuais do editor.
        </>
      }
    >
      <div className={styles.whatsappLayout}>
        <Controller
          control={control}
          name="template"
          render={({ field, fieldState }) => (
            <div className={styles.whatsappField}>
              <label className={styles.fieldLabel} htmlFor="wa-template">
                Template
              </label>
              <textarea
                id="wa-template"
                name={field.name}
                className={styles.templateTextarea}
                rows={12}
                value={field.value}
                onBlur={field.onBlur}
                onChange={(e) => {
                  field.onChange(e.target.value)
                  update(e.target.value)
                }}
              />
              {fieldState.error?.message && (
                <span className={styles.fieldError} role="alert">
                  {fieldState.error.message}
                </span>
              )}
              <div className={styles.variaveis}>
                <span className={styles.variaveisLabel}>Variáveis:</span>
                {VARIAVEIS.map((v) => (
                  <code key={v}>{v}</code>
                ))}
              </div>
            </div>
          )}
        />
        <div className={styles.whatsappPreview}>
          <span className={styles.whatsappPreviewLabel}>Preview</span>
          <pre className={styles.whatsappPreviewText}>{preview}</pre>
        </div>
      </div>
    </SettingsSection>
  )
}
