import { IconUser, IconCalendarEvent, IconUsers } from '@tabler/icons-react'
import { useOrcamento } from '@/hooks/useOrcamento'
import { formatarData } from '@/utils/datas'
import styles from './styles.module.scss'

export function PreviewSummary() {
  const { state } = useOrcamento()
  const totalPessoas =
    state.convidados.adultos + state.convidados.criancas0a4 + state.convidados.criancas5a9
  const dataFormatada = state.evento.data ? formatarData(state.evento.data) : '-'

  return (
    <>
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
          {state.convidados.adultos} adultos
          {state.convidados.criancas0a4 > 0 &&
            ` · ${state.convidados.criancas0a4} crianças (0–4) grátis`}
          {state.convidados.criancas5a9 > 0 &&
            ` · ${state.convidados.criancas5a9} crianças (5–9) meia`}
        </p>
      </section>
    </>
  )
}
