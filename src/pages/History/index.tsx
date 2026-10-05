import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  IconSearch,
  IconUser,
  IconCalendarEvent,
  IconUsers,
  IconCopy,
  IconTrash,
  IconEye,
  IconBrandWhatsapp,
  IconChevronRight,
} from '@tabler/icons-react'
import { listarOrcamentos, duplicarOrcamento, removerOrcamento, type OrcamentoSalvo } from '@/storage/orcamentos'
import { useOrcamento } from '@/hooks/useOrcamento'
import { useConfig } from '@/hooks/useConfig'
import { formatBRL } from '@/utils/money'
import { pdfData } from '@/pdf/utils'
import styles from './styles.module.scss'

const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

function formatarMes(iso: string): string {
  const d = new Date(iso)
  return `${MESES[d.getMonth()]} ${d.getFullYear()}`
}

function statusDoOrcamento(o: OrcamentoSalvo, validadeISO: string): {
  label: string
  tone: 'fresh' | 'ok' | 'expired'
} {
  if (o.criadoEm > new Date(Date.now() - 5 * 60 * 1000).toISOString()) {
    return { label: 'Rascunho', tone: 'fresh' }
  }
  if (new Date(validadeISO) < new Date()) {
    return { label: 'Expirado', tone: 'expired' }
  }
  return { label: 'Válido', tone: 'ok' }
}

export function History() {
  const navigate = useNavigate()
  const { load } = useOrcamento()
  const { config } = useConfig()
  const [busca, setBusca] = useState('')
  const [lista, setLista] = useState<OrcamentoSalvo[]>(() => listarOrcamentos())

  const grupos = useMemo(() => {
    const filtrado = busca.trim()
      ? lista.filter((o) =>
          o.cliente.nome.toLowerCase().includes(busca.toLowerCase()),
        )
      : lista
    const porMes = new Map<string, OrcamentoSalvo[]>()
    for (const o of filtrado) {
      const chave = formatarMes(o.criadoEm)
      if (!porMes.has(chave)) porMes.set(chave, [])
      porMes.get(chave)!.push(o)
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
    const novo = duplicarOrcamento(id)
    if (novo) setLista(listarOrcamentos())
  }

  const handleRemover = (id: string, nome: string) => {
    if (window.confirm(`Excluir o orçamento de ${nome}? Essa ação não pode ser desfeita.`)) {
      removerOrcamento(id)
      setLista(listarOrcamentos())
    }
  }

  const handleEnviarWhatsApp = (o: OrcamentoSalvo) => {
    const phone = o.cliente.whatsapp.replace(/\D/g, '')
    const total = o.totais.livreSemBebida.totalAvista
    const condicao = o.pagamento === 'pix'
      ? 'à vista no Pix com 15% de desconto'
      : 'parcelado em 10x no cartão'
    const texto = config.whatsapp.template
      .replace(/\{nome\}/g, o.cliente.nome ? `, ${o.cliente.nome}` : '')
      .replace(/\{empresa\}/g, config.empresa.nomeFantasia)
      .replace(/\{deData\}/g, o.evento.data ? ` de ${pdfData(o.evento.data)}` : '')
      .replace(/\{emCidade\}/g, o.evento.cidadeBairro ? ` (${o.evento.cidadeBairro})` : '')
      .replace(/\{condicao\}/g, `${condicao} · total a partir de ${formatBRL(total)}`)
      .replace(/\{validadeHoras\}/g, String(config.validade.horas))
    const params = new URLSearchParams({ text: texto })
    if (phone) params.set('phone', `55${phone}`)
    window.open(`https://wa.me/?${params.toString()}`, '_blank', 'noopener,noreferrer')
  }

  if (lista.length === 0) {
    return (
      <div className={styles.empty}>
        <h1 className={styles.emptyTitle}>Histórico vazio</h1>
        <p className={styles.emptyText}>
          Orçamentos salvos aparecem aqui. Vá para a aba <strong>Preview</strong> e
          clique em <strong>Salvar</strong> para arquivar o orçamento atual.
        </p>
        <Link to="/preview" className={styles.emptyLink}>
          Ir para o Preview
        </Link>
      </div>
    )
  }

  return (
    <div className={styles.wrap}>
      <header className={styles.header}>
        <div>
          <span className={styles.eyebrow}>Histórico</span>
          <h1 className={styles.title}>{lista.length} {lista.length === 1 ? 'orçamento salvo' : 'orçamentos salvos'}</h1>
        </div>
        <label className={styles.search}>
          <IconSearch size={16} aria-hidden="true" />
          <input
            type="search"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por cliente"
            aria-label="Buscar por cliente"
          />
        </label>
      </header>

      {grupos.length === 0 && (
        <p className={styles.noResults}>Nenhum resultado para "{busca}".</p>
      )}

      {grupos.map(([mes, items]) => (
        <section key={mes} className={styles.group}>
          <h2 className={styles.groupTitle}>{mes}</h2>
          <ul className={styles.list}>
            {items.map((o) => {
              const adultos = o.convidados.adultos
              const criancas = o.convidados.criancas0a4 + o.convidados.criancas5a9
              const totalPessoas = adultos + criancas
              const totalAvista = o.totais.livreSemBebida.totalAvista
              const validadeISO = new Date(
                new Date(o.criadoEm).getTime() + config.validade.horas * 60 * 60 * 1000,
              ).toISOString()
              const status = statusDoOrcamento(o, validadeISO)

              return (
                <li key={o.id} className={styles.item}>
                  <div className={styles.itemMain}>
                    <div className={styles.itemHeader}>
                      <span className={`${styles.status} ${styles[`status_${status.tone}`]}`}>
                        {status.label}
                      </span>
                      <h3 className={styles.itemTitle}>
                        <IconUser size={16} aria-hidden="true" />
                        {o.cliente.nome || 'Sem nome'}
                      </h3>
                    </div>
                    <div className={styles.itemMeta}>
                      <span>
                        <IconCalendarEvent size={14} aria-hidden="true" />
                        {o.evento.data ? pdfData(o.evento.data) : 'Sem data'}
                      </span>
                      <span>
                        <IconUsers size={14} aria-hidden="true" />
                        {totalPessoas} {totalPessoas === 1 ? 'pessoa' : 'pessoas'}
                      </span>
                    </div>
                  </div>
                  <div className={styles.itemPreco}>
                    <span className={styles.itemPrecoValor}>{formatBRL(totalAvista)}</span>
                    <span className={styles.itemPrecoLabel}>a partir de · Pix à vista</span>
                  </div>
                  <div className={styles.itemActions}>
                    <button
                      type="button"
                      onClick={() => handleAbrir(o)}
                      className={styles.itemBtn}
                      aria-label={`Abrir orçamento de ${o.cliente.nome}`}
                      title="Abrir no Preview"
                    >
                      <IconEye size={16} aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleEnviarWhatsApp(o)}
                      className={styles.itemBtn}
                      aria-label={`Reenviar para ${o.cliente.nome} no WhatsApp`}
                      title="Reenviar no WhatsApp"
                    >
                      <IconBrandWhatsapp size={16} aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDuplicar(o.id)}
                      className={styles.itemBtn}
                      aria-label={`Duplicar orçamento de ${o.cliente.nome}`}
                      title="Duplicar"
                    >
                      <IconCopy size={16} aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemover(o.id, o.cliente.nome)}
                      className={`${styles.itemBtn} ${styles.itemBtnDanger}`}
                      aria-label={`Excluir orçamento de ${o.cliente.nome}`}
                      title="Excluir"
                    >
                      <IconTrash size={16} aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAbrir(o)}
                      className={styles.itemBtnPrimary}
                    >
                      Abrir
                      <IconChevronRight size={14} aria-hidden="true" />
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>
        </section>
      ))}
    </div>
  )
}
