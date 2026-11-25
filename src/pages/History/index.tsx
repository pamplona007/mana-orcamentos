import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  listarOrcamentos,
  duplicarOrcamento,
  removerOrcamento,
  type OrcamentoSalvo,
} from '@/services/orcamentos'
import { useOrcamento } from '@/hooks/useOrcamento'
import { useConfig } from '@/hooks/useConfig'
import { formatBRL } from '@/utils/money'
import { formatarData, formatarMes } from '@/utils/datas'
import { mensagemWhatsApp, linkWhatsApp } from '@/utils/whatsapp'
import { HistoryHeader } from '@/components/HistoryHeader'
import { HistoryItem } from '@/components/HistoryItem'
import { HistoryEmpty } from '@/components/HistoryEmpty'
import styles from './styles.module.scss'

export function History() {
  const navigate = useNavigate()
  const { load } = useOrcamento()
  const { config } = useConfig()
  const [busca, setBusca] = useState('')
  const [lista, setLista] = useState<OrcamentoSalvo[]>(() => listarOrcamentos())

  const grupos = useMemo(() => {
    const filtrado = busca.trim()
      ? lista.filter((o) => o.cliente.nome.toLowerCase().includes(busca.toLowerCase()))
      : lista
    const porMes = new Map<string, OrcamentoSalvo[]>()
    for (const o of filtrado) {
      const chave = formatarMes(o.criadoEm)
      const grupo = porMes.get(chave)
      if (grupo) grupo.push(o)
      else porMes.set(chave, [o])
    }
    return Array.from(porMes.entries())
  }, [lista, busca])

  const handleAbrir = (o: OrcamentoSalvo) => {
    load({
      cliente: o.cliente,
      evento: o.evento,
      convidados: o.convidados,
      pagamento: o.pagamento,
      desconto: o.desconto,
      deslocamento: o.deslocamento,
    })
    navigate('/preview')
  }

  const handleDuplicar = (id: string) => {
    if (duplicarOrcamento(id)) setLista(listarOrcamentos())
  }

  const handleRemover = (id: string, nome: string) => {
    if (window.confirm(`Excluir o orçamento de ${nome}? Essa ação não pode ser desfeita.`)) {
      removerOrcamento(id)
      setLista(listarOrcamentos())
    }
  }

  const handleEnviarWhatsApp = (o: OrcamentoSalvo) => {
    const total = o.totais.livreSemBebida.totalAvista
    const condicao =
      o.pagamento === 'pix'
        ? 'à vista no Pix com 15% de desconto'
        : 'parcelado em 10x no cartão'
    const texto = mensagemWhatsApp({
      template: config.whatsapp.template,
      nome: o.cliente.nome,
      empresa: config.empresa.nomeFantasia,
      data: o.evento.data ? formatarData(o.evento.data) : '',
      cidade: o.evento.cidadeBairro,
      condicao: `${condicao} · total a partir de ${formatBRL(total)}`,
      validadeHoras: config.validade.horas,
    })
    window.open(linkWhatsApp(texto, o.cliente.whatsapp), '_blank', 'noopener,noreferrer')
  }

  if (lista.length === 0) return <HistoryEmpty />

  return (
    <div className={styles.wrap}>
      <HistoryHeader total={lista.length} busca={busca} onBuscaChange={setBusca} />

      {grupos.length === 0 && (
        <p className={styles.noResults}>Nenhum resultado para &quot;{busca}&quot;.</p>
      )}

      {grupos.map(([mes, items]) => (
        <section key={mes} className={styles.group}>
          <h2 className={styles.groupTitle}>{mes}</h2>
          <ul className={styles.list}>
            {items.map((o) => (
              <HistoryItem
                key={o.id}
                orcamento={o}
                validadeHoras={config.validade.horas}
                onAbrir={handleAbrir}
                onEnviarWhatsApp={handleEnviarWhatsApp}
                onDuplicar={handleDuplicar}
                onRemover={handleRemover}
              />
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
