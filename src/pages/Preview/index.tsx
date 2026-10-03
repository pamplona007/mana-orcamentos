import { useMemo } from 'react'
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer'
import { IconDownload, IconBrandWhatsapp, IconArrowLeft } from '@tabler/icons-react'
import { Link } from 'react-router-dom'
import { OrcamentoPDF } from '@/pdf/OrcamentoPDF'
import '@/pdf/fonts'
import { useOrcamento } from '@/hooks/useOrcamento'
import styles from './styles.module.scss'

const mensagemWhatsApp = ({
  nome,
  data,
  cidade,
  condicao,
}: {
  nome: string
  data: string
  cidade: string
  condicao: string
}) => {
  const linhas = [
    `Oi${nome ? `, ${nome}` : ''}! 👋`,
    '',
    `Segue o orçamento da Maná Pizzas para o evento${data ? ` de ${data}` : ''}${cidade ? ` (${cidade})` : ''}.`,
    '',
    '🍕 O PDF traz os 3 planos lado a lado — escolhe o que combina mais com o seu evento.',
    `💰 ${condicao}`,
    '',
    'Válido por 48h. Qualquer dúvida, me chama aqui!',
  ]
  return linhas.join('\n')
}

export function Preview() {
  const { state, toOrcamento } = useOrcamento()

  const orcamento = useMemo(() => toOrcamento(), [state, toOrcamento])

  const condicaoPagamento = useMemo(
    () =>
      state.pagamento === 'pix'
        ? 'À vista no Pix com 15% de desconto.'
        : 'Parcelado em 10x no cartão.',
    [state.pagamento],
  )

  const whatsappText = useMemo(
    () =>
      mensagemWhatsApp({
        nome: state.cliente.nome,
        data: state.evento.data,
        cidade: state.evento.cidadeBairro,
        condicao: condicaoPagamento,
      }),
    [state, condicaoPagamento],
  )

  const whatsappLink = useMemo(() => {
    const phone = state.cliente.whatsapp.replace(/\D/g, '')
    const params = new URLSearchParams({ text: whatsappText })
    if (phone) params.set('phone', `55${phone}`)
    return `https://wa.me/?${params.toString()}`
  }, [state.cliente.whatsapp, whatsappText])

  return (
    <div className={styles.wrap}>
      <header className={styles.headerBar}>
        <Link to="/" className={styles.backLink} aria-label="Voltar ao editor">
          <IconArrowLeft size={16} aria-hidden="true" />
          Voltar e ajustar
        </Link>

        <div className={styles.actions}>
          <PDFDownloadLink
            document={<OrcamentoPDF orcamento={orcamento} />}
            fileName={`orcamento-mana-${(state.cliente.nome || 'sem-nome').toLowerCase().replace(/\s+/g, '-')}.pdf`}
            className={styles.btnDownload}
          >
            {({ loading }) =>
              loading ? (
                <>
                  <IconDownload size={16} aria-hidden="true" />
                  Gerando…
                </>
              ) : (
                <>
                  <IconDownload size={16} aria-hidden="true" />
                  Baixar PDF
                </>
              )
            }
          </PDFDownloadLink>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.btnWhatsapp}
          >
            <IconBrandWhatsapp size={16} aria-hidden="true" />
            Enviar no WhatsApp
          </a>
        </div>
      </header>

      <div className={styles.viewer}>
        <PDFViewer
          width="100%"
          height="100%"
          showToolbar
          style={{ border: 'none' }}
        >
          <OrcamentoPDF orcamento={orcamento} />
        </PDFViewer>
      </div>
    </div>
  )
}
