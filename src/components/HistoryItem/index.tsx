import {
  IconUser,
  IconCalendarEvent,
  IconUsers,
  IconCopy,
  IconTrash,
  IconEye,
  IconBrandWhatsapp,
  IconChevronRight,
} from '@tabler/icons-react'
import type { OrcamentoSalvo } from '@/services/orcamentos'
import { formatBRL } from '@/utils/money'
import { formatarData } from '@/utils/datas'
import { statusDoOrcamento } from '@/utils/orcamento'
import styles from './styles.module.scss'

type HistoryItemProps = {
  orcamento: OrcamentoSalvo
  validadeHoras: number
  onAbrir: (orcamento: OrcamentoSalvo) => void
  onEnviarWhatsApp: (orcamento: OrcamentoSalvo) => void
  onDuplicar: (id: string) => void
  onRemover: (id: string, nome: string) => void
}

export function HistoryItem({
  orcamento,
  validadeHoras,
  onAbrir,
  onEnviarWhatsApp,
  onDuplicar,
  onRemover,
}: HistoryItemProps) {
  const totalPessoas =
    orcamento.convidados.adultos +
    orcamento.convidados.criancas0a4 +
    orcamento.convidados.criancas5a9
  const totalAvista = orcamento.totais.livreSemBebida.totalAvista
  const validadeISO = new Date(
    new Date(orcamento.criadoEm).getTime() + validadeHoras * 60 * 60 * 1000,
  ).toISOString()
  const status = statusDoOrcamento(orcamento, validadeISO)

  return (
    <li className={styles.item}>
      <div className={styles.itemMain}>
        <div className={styles.itemHeader}>
          <span className={`${styles.status} ${styles[`status_${status.tone}`]}`}>
            {status.label}
          </span>
          <h3 className={styles.itemTitle}>
            <IconUser size={16} aria-hidden="true" />
            {orcamento.cliente.nome || 'Sem nome'}
          </h3>
        </div>
        <div className={styles.itemMeta}>
          <span>
            <IconCalendarEvent size={14} aria-hidden="true" />
            {orcamento.evento.data ? formatarData(orcamento.evento.data) : 'Sem data'}
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
          onClick={() => onAbrir(orcamento)}
          className={styles.itemBtn}
          aria-label={`Abrir orçamento de ${orcamento.cliente.nome}`}
          title="Abrir no Preview"
        >
          <IconEye size={16} aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => onEnviarWhatsApp(orcamento)}
          className={styles.itemBtn}
          aria-label={`Reenviar para ${orcamento.cliente.nome} no WhatsApp`}
          title="Reenviar no WhatsApp"
        >
          <IconBrandWhatsapp size={16} aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => onDuplicar(orcamento.id)}
          className={styles.itemBtn}
          aria-label={`Duplicar orçamento de ${orcamento.cliente.nome}`}
          title="Duplicar"
        >
          <IconCopy size={16} aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => onRemover(orcamento.id, orcamento.cliente.nome)}
          className={`${styles.itemBtn} ${styles.itemBtnDanger}`}
          aria-label={`Excluir orçamento de ${orcamento.cliente.nome}`}
          title="Excluir"
        >
          <IconTrash size={16} aria-hidden="true" />
        </button>
        <button type="button" onClick={() => onAbrir(orcamento)} className={styles.itemBtnPrimary}>
          Abrir
          <IconChevronRight size={14} aria-hidden="true" />
        </button>
      </div>
    </li>
  )
}
