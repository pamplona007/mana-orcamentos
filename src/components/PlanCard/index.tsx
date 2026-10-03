import { IconCheck, IconSparkles } from '@tabler/icons-react'
import type { Plano } from '@/data/plans'
import { PriceDisplay } from '@/components/PriceDisplay'
import { RecommendedBadge } from '@/components/RecommendedBadge'
import styles from './styles.module.scss'

type Mode = 'editor' | 'comparativo'

type PlanCardProps = {
  plano: Plano
  selected: boolean
  onSelect: (id: Plano['id']) => void
  mode?: Mode
  pagamento: 'pix' | 'parcelado'
}

const ICON_BG: Record<Plano['cor'], string> = {
  wine: 'iconBoxWine',
  ochre: 'iconBoxOchre',
  rust: 'iconBoxRust',
  cream: 'iconBoxCream',
}

const ICON_SIZE = 28

export function PlanCard({ plano, selected, onSelect, mode = 'editor', pagamento }: PlanCardProps) {
  const isPremium = plano.id === 'premium'
  const isUnidade = plano.id === 'unidade'
  const cardClasses = [
    styles['card'],
    isPremium ? styles['cardPremium'] : '',
    selected ? styles['cardSelected'] : '',
    isPremium ? styles['cardRecommended'] : '',
  ]
    .filter(Boolean)
    .join(' ')

  const Icon = plano.icone

  const precoBase = pagamento === 'pix' ? plano.precoPessoaAvista : plano.precoPessoaParcelado
  const labelUnidade = isUnidade ? 'por pizza' : 'por pessoa'
  const labelPagamento = pagamento === 'pix' ? 'à vista no Pix' : 'parcelado em 10x'

  return (
    <button
      type="button"
      className={cardClasses}
      onClick={() => onSelect(plano.id)}
      aria-pressed={selected}
      aria-label={`Plano ${plano.nome}, ${labelUnidade} R$ ${precoBase.toFixed(2)} ${labelPagamento}`}
    >
      {isPremium && (
        <div className={styles.badgeSlot}>
          <RecommendedBadge />
        </div>
      )}

      <div className={styles.head}>
        <div>
          <div className={styles.numero}>Opção {plano.numero}</div>
          <h3 className={`${styles.title} ${isPremium ? styles.titleWine : ''}`}>{plano.nome}</h3>
          <p className={styles.tagline}>{plano.tagline}</p>
        </div>
        <div className={`${styles.iconBox} ${styles[ICON_BG[plano.cor]]}`}>
          <Icon size={ICON_SIZE} aria-label={plano.iconeLabel} stroke={1.5} />
        </div>
      </div>

      <div className={styles.price}>
        <div className={styles.priceLabel}>{labelUnidade}</div>
        <div className={styles.priceRow}>
          <PriceDisplay value={precoBase} size={isPremium ? 'md' : 'sm'} variant={isPremium ? 'wine' : 'cream'} />
          <span className={styles.priceUnit}>{labelPagamento}</span>
        </div>
      </div>

      {isPremium && plano.destaquesPremium && (
        <div className={styles.destaques} aria-label="Por que escolher o Premium">
          {plano.destaquesPremium.map((d) => (
            <div key={d.titulo} className={styles.destaqueItem}>
              <div className={styles.destaqueTitulo}>
                <IconSparkles size={12} aria-hidden="true" style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
                {d.titulo}
              </div>
              <div className={styles.destaqueCorpo}>{d.corpo}</div>
            </div>
          ))}
        </div>
      )}

      <ul className={styles.inclusos} aria-label="Itens inclusos">
        {plano.inclusos.map((item) => (
          <li key={item} className={styles.incluso}>
            <IconCheck className={styles.check} aria-hidden="true" stroke={2} />
            <span>{item}</span>
          </li>
        ))}
      </ul>

      {plano.bonus.length > 0 && (
        <p className={styles.bonus}>
          Bônus: <strong>{plano.bonus.join(' · ')}</strong>
        </p>
      )}

      <div className={`${styles.cta} ${selected ? styles.ctaSelected : ''}`}>
        {selected ? 'Selecionado ✓' : mode === 'comparativo' ? 'Ver detalhes' : 'Selecionar plano'}
      </div>
    </button>
  )
}
