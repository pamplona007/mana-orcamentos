/* The WhatsApp message uses short sentences and a conversational tone so it reads like a real attendant message. */
import { useEffect, useMemo, useState } from 'react'
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer'
import {
  IconDownload,
  IconBrandWhatsapp,
  IconArrowLeft,
  IconUser,
  IconCalendarEvent,
  IconUsers,
  IconPrinter,
  IconDeviceFloppy,
} from '@tabler/icons-react'
import { Link, useOutletContext } from 'react-router-dom'
import { OrcamentoPDF } from '@/pdf/OrcamentoPDF'
import { OrcamentoPDFPrint } from '@/pdf/OrcamentoPDFPrint'
import { useOrcamento } from '@/hooks/useOrcamento'
import { useConfig } from '@/hooks/useConfig'
import { pdfData } from '@/pdf/utils'
import { salvarOrcamento, type OrcamentoSalvo } from '@/storage/orcamentos'
import type { AppShellCtx } from '@/components/AppShell'
import styles from './styles.module.scss'

const mensagemWhatsApp = ({
  template,
  nome,
  data,
  cidade,
  condicao,
  empresa,
  validadeHoras,
}: {
  template: string
  nome: string
  data: string
  cidade: string
  condicao: string
  empresa: string
  validadeHoras: number
}) => {
  return template
    .replace(/\{nome\}/g, nome ? `, ${nome}` : '')
    .replace(/\{empresa\}/g, empresa)
    .replace(/\{deData\}/g, data ? ` de ${data}` : '')
    .replace(/\{emCidade\}/g, cidade ? ` (${cidade})` : '')
    .replace(/\{condicao\}/g, condicao)
    .replace(/\{validadeHoras\}/g, String(validadeHoras))
}

export function Preview() {
  const { state, totais, toOrcamento } = useOrcamento()
  const { config } = useConfig()
  const shellCtx = useOutletContext<AppShellCtx | null>()
  const [salvo, setSalvo] = useState<OrcamentoSalvo | null>(null)

  const validadeISO = useMemo(
    () => new Date(Date.now() + config.validade.horas * 60 * 60 * 1000).toISOString(),
    [config.validade.horas],
  )

  const orcamento = useMemo(
    () => toOrcamento(salvo?.id),
    [toOrcamento, salvo?.id],
  )

  useEffect(() => {
    if (!salvo) return
    const mesmoCliente = salvo.cliente.nome === state.cliente.nome
    const mesmaData = salvo.evento.data === state.evento.data
    if (!mesmoCliente || !mesmaData) setSalvo(null)
  }, [state.cliente.nome, state.evento.data, salvo])

  const totaisPorPlano = {
    premium: totais.premium,
    livreBebida: totais.livreBebida,
    livreSemBebida: totais.livreSemBebida,
    unidade: totais.unidade,
  }

  const condicaoPagamento = state.pagamento === 'pix'
    ? 'à vista no Pix com 15% de desconto'
    : 'parcelado em 10x no cartão'

  const whatsappText = useMemo(
    () =>
      mensagemWhatsApp({
        template: config.whatsapp.template,
        nome: state.cliente.nome,
        data: pdfData(state.evento.data),
        cidade: state.evento.cidadeBairro,
        condicao: condicaoPagamento,
        empresa: config.empresa.nomeFantasia,
        validadeHoras: config.validade.horas,
      }),
    [
      config.whatsapp.template,
      config.empresa.nomeFantasia,
      config.validade.horas,
      state.cliente.nome,
      state.evento.data,
      state.evento.cidadeBairro,
      condicaoPagamento,
    ],
  )

  const whatsappLink = useMemo(() => {
    const phone = state.cliente.whatsapp.replace(/\D/g, '')
    const params = new URLSearchParams({ text: whatsappText })
    if (phone) params.set('phone', `55${phone}`)
    return `https://wa.me/?${params.toString()}`
  }, [state.cliente.whatsapp, whatsappText])

  const fileName = `orcamento-mana-${(state.cliente.nome || 'sem-nome').toLowerCase().replace(/\s+/g, '-')}.pdf`

  const handleSalvar = () => {
    const novo = salvarOrcamento(toOrcamento(salvo?.id), totaisPorPlano)
    setSalvo(novo)
    shellCtx?.showSavedBadge()
  }

  const adultos = state.convidados.adultos
  const criancas = state.convidados.criancas0a4 + state.convidados.criancas5a9
  const totalPessoas = adultos + criancas
  const dataFormatada = state.evento.data ? pdfData(state.evento.data) : '-'

  return (
    <div className={styles.wrap}>
      <header className={styles.headerBar}>
        <Link to="/" className={styles.backLink} aria-label="Voltar ao editor">
          <IconArrowLeft size={16} aria-hidden="true" />
          Voltar e ajustar
        </Link>

        <div className={styles.actions}>
          <button
            type="button"
            onClick={handleSalvar}
            className={styles.btnSave}
            aria-label="Salvar orçamento no histórico"
          >
            <IconDeviceFloppy size={16} aria-hidden="true" />
            {salvo ? 'Salvo' : 'Salvar'}
          </button>
          <PDFDownloadLink
            document={<OrcamentoPDF orcamento={orcamento} totais={totaisPorPlano} validadeISO={validadeISO} />}
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
          <PDFDownloadLink
            document={<OrcamentoPDFPrint orcamento={orcamento} totais={totaisPorPlano} validadeISO={validadeISO} />}
            fileName={fileName.replace('.pdf', '-pb.pdf')}
            className={styles.btnPrint}
          >
            {({ loading }) =>
              loading ? (
                <>
                  <IconPrinter size={16} aria-hidden="true" />
                  Gerando…
                </>
              ) : (
                <>
                  <IconPrinter size={16} aria-hidden="true" />
                  PDF preto e branco
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
            <OrcamentoPDF orcamento={orcamento} totais={totaisPorPlano} validadeISO={validadeISO} />
          </PDFViewer>
        </section>
      </main>
    </div>
  )
}
