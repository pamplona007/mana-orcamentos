import { NumberStepper } from '@/components/NumberStepper'
import { calcularConvidados } from '@/utils/calculo'
import type { Convidado } from '@/types/orcamento'
import styles from './styles.module.scss'

type GuestBreakdownProps = {
  value: Convidado
  onChange: (next: Convidado) => void
}

export function GuestBreakdown({ value, onChange }: GuestBreakdownProps) {
  const total = calcularConvidados(value)
  const pizzas = Math.ceil(total * 0.6)

  return (
    <div className={styles.breakdown}>
      <div className={styles.row}>
        <div className={styles.info}>
          <span className={styles.label}>Adultos</span>
          <span className={styles.helper}>10+ anos contam como adulto</span>
        </div>
        <NumberStepper
          value={value.adultos}
          onChange={(adultos) => onChange({ ...value, adultos })}
          min={0}
          max={500}
          size="lg"
          ariaLabel="adultos"
        />
      </div>

      <div className={styles.row}>
        <div className={styles.info}>
          <span className={styles.label}>0 a 4 anos</span>
          <span className={styles.helper}>Não contam no total</span>
        </div>
        <NumberStepper
          value={value.criancas0a4}
          onChange={(criancas0a4) => onChange({ ...value, criancas0a4 })}
          min={0}
          max={500}
          size="lg"
          ariaLabel="crianças de 0 a 4 anos"
        />
      </div>

      <div className={styles.row}>
        <div className={styles.info}>
          <span className={styles.label}>5 a 9 anos</span>
          <span className={styles.helper}>Contam como meia entrada — confirme com o cliente</span>
        </div>
        <NumberStepper
          value={value.criancas5a9}
          onChange={(criancas5a9) => onChange({ ...value, criancas5a9 })}
          min={0}
          max={500}
          size="lg"
          ariaLabel="crianças de 5 a 9 anos"
        />
      </div>

      <div className={styles.total}>
        <div>
          <div className={styles.totalLabel}>Total de adultos equivalentes</div>
          <div className={styles.detail}>
            {value.criancas0a4 > 0 && `${value.criancas0a4} criança(s) 0-4 grátis · `}
            {value.criancas5a9 > 0 && `${value.criancas5a9} criança(s) 5-9 como meia · `}
            ~{pizzas} pizzas se for por unidade
          </div>
        </div>
        <span className={styles.totalValue}>{total}</span>
      </div>
    </div>
  )
}
