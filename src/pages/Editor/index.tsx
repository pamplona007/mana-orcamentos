import { useState } from 'react'
import { PLANOS } from '@/data/plans'
import { PlanCard } from '@/components/PlanCard'
import { GuestBreakdown } from '@/components/GuestBreakdown'
import { AddonToggle } from '@/components/AddonToggle'
import { OPCIONAIS } from '@/data/plans'
import type { Adicional, Convidado, Pagamento, PlanoId } from '@/types/orcamento'
import styles from './styles.module.scss'

const emptyConvidado: Convidado = { adultos: 25, criancas0a4: 0, criancas5a9: 0 }
const emptyAdicional: Adicional = { entrada: false, salgadosExtras: 0 }

export function Editor() {
  const [plano, setPlano] = useState<PlanoId>('premium')
  const [convidados, setConvidados] = useState<Convidado>(emptyConvidado)
  const [adicionais, setAdicionais] = useState<Adicional>(emptyAdicional)
  const [pagamento, setPagamento] = useState<Pagamento>('parcelado')
  const [cliente, setCliente] = useState({ nome: '', whatsapp: '' })
  const [evento, setEvento] = useState({ data: '', cidadeBairro: '', observacoes: '' })

  return (
    <div className={styles.editor}>
      <div className={styles.main}>
        <section className={styles.hero}>
          <span className={styles.heroLabel}>Orçamento</span>
          <h1 className={styles.heroTitle}>Maná no seu evento.</h1>
          <p className={styles.heroSub}>
            Pizzaria artesanal italiana servida na sua casa. Massa maturada por 48h,
            ingredientes selecionados, atendimento completo.
          </p>
        </section>

        <section className={styles.section} aria-label="Dados do cliente">
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>Cliente e evento</h2>
            <span className={styles.sectionStep}>Etapa 1 de 3</span>
          </div>
          <div className={styles.fieldGrid}>
            <div className={styles.field}>
              <label className={styles.fieldLabel} htmlFor="cliente-nome">Nome do cliente</label>
              <input
                id="cliente-nome"
                className={styles.fieldInput}
                value={cliente.nome}
                onChange={(e) => setCliente({ ...cliente, nome: e.target.value })}
                placeholder="Ex: Maria Silva"
              />
            </div>
            <div className={styles.field}>
              <label className={styles.fieldLabel} htmlFor="cliente-whats">WhatsApp</label>
              <input
                id="cliente-whats"
                className={styles.fieldInput}
                value={cliente.whatsapp}
                onChange={(e) => setCliente({ ...cliente, whatsapp: e.target.value })}
                placeholder="(85) 9 9999-9999"
              />
            </div>
            <div className={styles.field}>
              <label className={styles.fieldLabel} htmlFor="evento-data">Data do evento</label>
              <input
                id="evento-data"
                type="date"
                className={styles.fieldInput}
                value={evento.data}
                onChange={(e) => setEvento({ ...evento, data: e.target.value })}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.fieldLabel} htmlFor="evento-local">Cidade e bairro</label>
              <input
                id="evento-local"
                className={styles.fieldInput}
                value={evento.cidadeBairro}
                onChange={(e) => setEvento({ ...evento, cidadeBairro: e.target.value })}
                placeholder="Ex: Fortaleza — Aldeota"
              />
            </div>
          </div>
        </section>

        <section className={styles.section} aria-label="Convidados">
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>Convidados</h2>
            <span className={styles.sectionStep}>Etapa 2 de 3</span>
          </div>
          <GuestBreakdown value={convidados} onChange={setConvidados} />
        </section>

        <section className={styles.section} aria-label="Plano">
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>Escolha o plano</h2>
            <span className={styles.sectionStep}>Etapa 3 de 3</span>
          </div>
          <div className={styles.comparativoGrid}>
            {PLANOS.map((p) => (
              <PlanCard
                key={p.id}
                plano={p}
                selected={plano === p.id}
                onSelect={setPlano}
                mode="editor"
                pagamento={pagamento}
              />
            ))}
          </div>

          <div className={styles.fieldGrid} style={{ marginTop: 'var(--space-3)' }}>
            <button
              type="button"
              onClick={() => setPagamento('parcelado')}
              aria-pressed={pagamento === 'parcelado'}
              className={styles.fieldInput}
              style={{
                cursor: 'pointer',
                textAlign: 'left',
                borderColor: pagamento === 'parcelado' ? 'var(--rust)' : 'var(--coal-3)',
                background: pagamento === 'parcelado' ? 'rgba(181, 71, 27, 0.08)' : 'var(--coal)',
              }}
            >
              <div style={{ fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--cream-faint)', marginBottom: 4 }}>Parcelado</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--cream)' }}>10x no cartão</div>
            </button>
            <button
              type="button"
              onClick={() => setPagamento('pix')}
              aria-pressed={pagamento === 'pix'}
              className={styles.fieldInput}
              style={{
                cursor: 'pointer',
                textAlign: 'left',
                borderColor: pagamento === 'pix' ? 'var(--rust)' : 'var(--coal-3)',
                background: pagamento === 'pix' ? 'rgba(181, 71, 27, 0.08)' : 'var(--coal)',
              }}
            >
              <div style={{ fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--cream-faint)', marginBottom: 4 }}>À vista no Pix</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--cream)' }}>15% de desconto</div>
            </button>
          </div>
        </section>

        <section className={styles.section} aria-label="Adicionais">
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>Adicionais</h2>
          </div>
          <AddonToggle
            label={OPCIONAIS.entrada.label}
            descricao={OPCIONAIS.entrada.descricao}
            valor={OPCIONAIS.entrada.valor}
            checked={adicionais.entrada}
            onChange={(entrada) => setAdicionais({ ...adicionais, entrada })}
          />
          {adicionais.entrada && (
            <div className={styles.field}>
              <label className={styles.fieldLabel}>Cento de salgados adicional (R$ 75 cada)</label>
              <input
                type="number"
                min={0}
                max={20}
                value={adicionais.salgadosExtras}
                onChange={(e) => setAdicionais({ ...adicionais, salgadosExtras: Math.max(0, Number(e.target.value) || 0) })}
                className={styles.fieldInput}
              />
            </div>
          )}
        </section>
      </div>

      <aside style={{ position: 'sticky', top: 88, alignSelf: 'flex-start' }} aria-label="Resumo">
        <div style={{ padding: 'var(--space-5)', background: 'var(--coal)', border: '1px solid var(--coal-3)', borderRadius: 'var(--radius-lg)' }}>
          <h2 style={{ fontFamily: 'var(--font-body)', fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ochre)', marginBottom: 'var(--space-3)' }}>
            Resumo
          </h2>
          <p style={{ color: 'var(--cream-dim)', fontSize: 14, lineHeight: 1.5 }}>
            Escolha o plano acima para ver o total calculado em tempo real.
          </p>
        </div>
      </aside>
    </div>
  )
}
