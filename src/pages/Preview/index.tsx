import { useEffect, useMemo, useState } from 'react'
import { IconArrowLeft } from '@tabler/icons-react'
import { Link, useOutletContext } from 'react-router-dom'
import { OrcamentoPDF } from '@/pdf/OrcamentoPDF'
import { OrcamentoPDFPrint } from '@/pdf/OrcamentoPDFPrint'
import { useOrcamento } from '@/hooks/useOrcamento'
import { useConfig } from '@/hooks/useConfig'
import { formatarData } from '@/utils/datas'
import { mensagemWhatsApp, linkWhatsApp } from '@/utils/whatsapp'
import { salvarOrcamento, type OrcamentoSalvo } from '@/services/orcamentos'
import type { AppShellCtx } from '@/components/AppShell'
import { PreviewActions } from '@/components/PreviewActions'
import { PreviewSummary } from '@/components/PreviewSummary'
import { PreviewPdfViewer } from '@/components/PreviewPdfViewer'
import styles from './styles.module.scss'

export function Preview() {
  const { state, totais, toOrcamento } = useOrcamento()
  const { config } = useConfig()
  const shellCtx = useOutletContext<AppShellCtx | null>()
  const [salvo, setSalvo] = useState<OrcamentoSalvo | null>(null)

  const validadeISO = useMemo(
    () => new Date(Date.now() + config.validade.horas * 60 * 60 * 1000).toISOString(),
    [config.validade.horas],
  )

  const orcamento = useMemo(() => toOrcamento(salvo?.id), [toOrcamento, salvo?.id])

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

  const condicaoPagamento =
    state.pagamento === 'pix'
      ? 'à vista no Pix com 15% de desconto'
      : 'parcelado em 10x no cartão'

  const whatsappText = useMemo(
    () =>
      mensagemWhatsApp({
        template: config.whatsapp.template,
        nome: state.cliente.nome,
        data: formatarData(state.evento.data),
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

  const whatsappLink = useMemo(
    () => linkWhatsApp(whatsappText, state.cliente.whatsapp),
    [state.cliente.whatsapp, whatsappText],
  )

  const fileName = `orcamento-mana-${(state.cliente.nome || 'sem-nome').toLowerCase().replace(/\s+/g, '-')}.pdf`

  const handleSalvar = () => {
    const novo = salvarOrcamento(toOrcamento(salvo?.id), totaisPorPlano)
    setSalvo(novo)
    shellCtx?.showSavedBadge()
  }

  return (
    <div className={styles.wrap}>
      <header className={styles.headerBar}>
        <Link to="/" className={styles.backLink} aria-label="Voltar ao editor">
          <IconArrowLeft size={16} aria-hidden="true" />
          Voltar e ajustar
        </Link>

        <PreviewActions
          salvo={Boolean(salvo)}
          onSalvar={handleSalvar}
          fileName={fileName}
          whatsappLink={whatsappLink}
          documentoColor={
            <OrcamentoPDF
              orcamento={orcamento}
              totais={totaisPorPlano}
              validadeISO={validadeISO}
              config={config}
            />
          }
          documentoPrint={
            <OrcamentoPDFPrint
              orcamento={orcamento}
              totais={totaisPorPlano}
              validadeISO={validadeISO}
              config={config}
            />
          }
        />
      </header>

      <main className={styles.main}>
        <PreviewSummary />
        <PreviewPdfViewer
          orcamento={orcamento}
          totais={totaisPorPlano}
          validadeISO={validadeISO}
          config={config}
        />
      </main>
    </div>
  )
}
