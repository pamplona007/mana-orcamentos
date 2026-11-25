import { useMemo } from 'react'
import { IconMessageDots } from '@tabler/icons-react'
import { useConfig } from '@/hooks/useConfig'
import { mensagemWhatsApp } from '@/utils/whatsapp'
import { SettingsSection } from '@/components/SettingsSection'
import styles from './styles.module.scss'

const VARIAVEIS = ['{nome}', '{empresa}', '{deData}', '{emCidade}', '{condicao}', '{validadeHoras}']

export function SettingsMensagem() {
  const { config, setWhatsApp } = useConfig()
  const percentualDesconto = Math.round(config.pdf.adicionais.descontoAvista * 100)

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
        <div className={styles.whatsappField}>
          <label className={styles.fieldLabel} htmlFor="wa-template">
            Template
          </label>
          <textarea
            id="wa-template"
            className={styles.templateTextarea}
            rows={12}
            value={config.whatsapp.template}
            onChange={(e) => setWhatsApp({ template: e.target.value })}
          />
          <div className={styles.variaveis}>
            <span className={styles.variaveisLabel}>Variáveis:</span>
            {VARIAVEIS.map((v) => (
              <code key={v}>{v}</code>
            ))}
          </div>
        </div>
        <div className={styles.whatsappPreview}>
          <span className={styles.whatsappPreviewLabel}>Preview</span>
          <pre className={styles.whatsappPreviewText}>{preview}</pre>
        </div>
      </div>
    </SettingsSection>
  )
}
