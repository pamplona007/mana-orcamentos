/* The WhatsApp message uses short sentences and a conversational tone so it reads like a real attendant message. */
import { useMemo } from 'react'
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer'
import {
  IconDownload,
  IconBrandWhatsapp,
  IconArrowLeft,
  IconUser,
  IconCalendarEvent,
  IconUsers,
  IconReceipt,
} from '@tabler/icons-react'
import { Link } from 'react-router-dom'
import { OrcamentoPDF } from '@/pdf/OrcamentoPDF'
import { useOrcamento } from '@/hooks/useOrcamento'
import { PLANOS } from '@/data/plans'
import { formatBRL } from '@/utils/money'
import { pdfData } from '@/pdf/utils'
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
    `Oi${nome ? `, ${nome}` : ''}!`,
    '',
    `Segue o orçamento da Maná Pizzas para o evento${data ? ` de ${data}` : ''}${cidade ? ` (${cidade})` : ''}.`,
    '',
    'O PDF traz os 3 planos lado a lado. Escolhe o que combina mais com o seu evento.',
    `Condição: ${condicao}`,
    '',
    'Válido por 48h. Qualquer dúvida, me chama aqui!',
  ]
  return linhas.join('\n')
}

export function Preview() {
  const { state, totais } = useOrcamento()

  const orcamento = useMemo(
    () => ({
      id: crypto.randomUUID(),
      criadoEm: new Date().toISOString(),
      cliente: state.cliente,
      evento: state.evento,
      convidados: state.convidados,
      deslocamento: state.deslocamento,
      pagamento: state.pagamento,
      desconto: state.desconto,
    }),
    [state],
  )

  // Build TotaisPorPlano from useOrcamento
  const totaisPorPlano = {
    premium: totais.premium,
    livreBebida: totais.livreBebida,
    livreSemBebida: totais.livreSemBebida,
    unidade: totais.unidade,
  }
  void totaisPorPlano

  const condicaoPagamento = state.pagamento === 'pix'
    ? 'à vista no Pix com 15% de desconto'
    : 'parcelado em 10x no cartão'

  const whatsappText = useMemo(
    () =>
      mensagemWhatsApp({
        nome: state.cliente.nome,
        data: pdfData(state.evento.data),
        cidade: state.evento.cidadeBairro,
        condicao: condicaoPagamento,
      }),
    [state.cliente.nome, state.evento.data, state.evento.cidadeBairro, condicaoPagamento],
  )

  const whatsappLink = useMemo(() => {
    const phone = state.cliente.whatsapp.replace(/\D/g, '')
    const params = new URLSearchParams({ text: whatsappText })
    if (phone) params.set('phone', `55${phone}`)
    return `https://wa.me/?${params.toString()}`
  }, [state.cliente.whatsapp, whatsappText])

  const fileName = `orcamento-mana-${(state.cliente.nome || 'sem-nome').toLowerCase().replace(/\s+/g, '-')}.pdf`

  const adultos = state.convidados.adultos
  const criancas = state.convidados.criancas0a4 + state.convidados.criancas5a9
  const totalPessoas = adultos + criancas
  const dataFormatada = state.evento.data ? pdfData(state.evento.data) : '-'

  const planosResumo = (['premium', 'livre-bebida', 'livre-sem-bebida', 'unidade'] as const).map(id => ({
    id,
    plano: PLANOS.find(p => p.id === id)!,
    total: totais[id === 'livre-bebida' ? 'livreBebida' : id === 'livre-sem-bebida' ? 'livreSemBebida' : id],
  }))

  return (
    <div className={styles.wrap}>
      <header className={styles.headerBar}>
        <Link to="/" className={styles.backLink} aria-label="Voltar ao editor">
          <IconArrowLeft size={16} aria-hidden="true" />
          Voltar e ajustar
        </Link>

        <div className={styles.actions}>
          <PDFDownloadLink
            document={<OrcamentoPDF orcamento={orcamento} totais={totaisPorPlano} validadeISO={new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString()} />}
            fileName={fileName}
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

      <main className={styles.main}>
        <section className={styles.card}>
          <span className={styles.cardEyebrow}>Cliente</span>
          <h2 className={styles.cardTitle}>
            <IconUser size={20} aria-hidden="true" />
            {state.cliente.nome || '-'}
          </h2>
          <p className={styles.cardMeta}>{state.cliente.whatsapp || '-'}</p>
        </section>

        <section className={styles.card}>
          <span className={styles.cardEyebrow}>Evento</span>
          <h2 className={styles.cardTitle}>
            <IconCalendarEvent size={20} aria-hidden="true" />
            {dataFormatada}
          </h2>
          <p className={styles.cardMeta}>{state.evento.cidadeBairro || '-'}</p>
          {state.evento.observacoes && (
            <p className={styles.cardNote}>{state.evento.observacoes}</p>
          )}
        </section>

        <section className={styles.card}>
          <span className={styles.cardEyebrow}>Convidados</span>
          <h2 className={styles.cardTitle}>
            <IconUsers size={20} aria-hidden="true" />
            {totalPessoas} {totalPessoas === 1 ? 'pessoa' : 'pessoas'}
          </h2>
          <p className={styles.cardMeta}>
            {adultos} adultos
            {state.convidados.criancas0a4 > 0 && ` · ${state.convidados.criancas0a4} crianças (0–4) grátis`}
            {state.convidados.criancas5a9 > 0 && ` · ${state.convidados.criancas5a9} crianças (5–9) meia`}
          </p>
        </section>

        <section className={styles.cardWide}>
          <span className={styles.cardEyebrow}>Pré-visualização do PDF</span>
          <PDFViewer style={{ width: '100%', height: '70vh', border: 'none' }} showToolbar={false}>
            <OrcamentoPDF orcamento={orcamento} totais={totaisPorPlano} validadeISO={new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString()} />
          </PDFViewer>
        </section>

        <section className={styles.cardWide}>
          <span className={styles.cardEyebrow}>Planos no PDF</span>
          <div className={styles.planosGrid}>
            {planosResumo.map(({ id, plano, total }) => (
              <div
                key={id}
                className={`${styles.planoMini} ${id === 'premium' ? styles.planoMiniPremium : ''}`}
              >
                <span className={styles.planoMiniLabel}>
                  {id === 'premium' && '★ '}
                  {plano.nome}
                </span>
                <span className={styles.planoMiniPreco}>{formatBRL(total.total)}</span>
                <span className={styles.planoMiniParcela}>
                  ou 10x de {formatBRL(total.parcela10x)}
                </span>
              </div>
            ))}
          </div>
          {state.desconto.tipo !== 'nenhum' && (
            <p className={styles.descontoAplicado}>
              Desconto aplicado:{' '}
              {state.desconto.tipo === 'percentual'
                ? `${state.desconto.valor}%`
                : formatBRL(state.desconto.valor)}
            </p>
          )}
        </section>

        <section className={styles.card}>
          <span className={styles.cardEyebrow}>Pagamento</span>
          <h2 className={styles.cardTitle}>
            <IconReceipt size={20} aria-hidden="true" />
            {state.pagamento === 'pix' ? 'À vista no Pix' : 'Parcelado em 10x'}
          </h2>
          <p className={styles.cardMeta}>
            Adicionais opcionais disponíveis no PDF
          </p>
        </section>

        <p className={styles.finalHint}>
          O PDF gerado traz os 3 planos lado a lado. O cliente escolhe o que preferir.
        </p>
      </main>
    </div>
  )
}
