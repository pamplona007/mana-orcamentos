import { View, Text, StyleSheet } from '@react-pdf/renderer'
import { PDF_COLORS } from '../styles'
import { pdfFormatBRL } from '../utils'
import { PLANOS } from '@/data/plans'
import type { TotaisPorPlano } from '@/types/orcamento'

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  brandLogo: {
    width: 44,
    height: 28,
    objectFit: 'contain',
  },
  brandText: {
    fontFamily: 'Fraunces',
    fontSize: 11,
    color: PDF_COLORS.cream,
    fontWeight: 500,
  },
  validade: {
    fontFamily: 'Inter',
    fontSize: 7,
    color: PDF_COLORS.creamFaint,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  kicker: {
    fontFamily: 'Inter',
    fontSize: 9,
    color: PDF_COLORS.ochre,
    letterSpacing: 3,
    textTransform: 'uppercase',
    fontWeight: 700,
    marginBottom: 8,
  },
  title: {
    fontFamily: 'Fraunces',
    fontSize: 36,
    fontWeight: 500,
    color: PDF_COLORS.cream,
    letterSpacing: -0.8,
    marginBottom: 6,
  },
  sub: {
    fontFamily: 'Inter',
    fontSize: 10,
    color: PDF_COLORS.creamDim,
    lineHeight: 1.5,
    marginBottom: 24,
  },
  grid: {
    flexDirection: 'row',
    gap: 10,
  },
  card: {
    flex: 1,
    backgroundColor: PDF_COLORS.coal,
    borderRadius: 6,
    padding: 14,
    borderWidth: 1,
    borderColor: PDF_COLORS.coal3,
    position: 'relative',
  },
  cardPremium: {
    backgroundColor: PDF_COLORS.espresso,
    borderWidth: 1.5,
    borderColor: PDF_COLORS.wine,
    flex: 1.3,
  },
  cardSelected: {
    borderWidth: 1.5,
    borderColor: PDF_COLORS.rust,
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: 10,
    backgroundColor: PDF_COLORS.wine,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 9,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  badgeText: {
    fontFamily: 'Inter',
    fontSize: 7,
    fontWeight: 700,
    color: PDF_COLORS.cream,
    letterSpacing: 1.3,
    textTransform: 'uppercase',
  },
  badgeIcon: {
    fontFamily: 'Fraunces',
    fontSize: 8,
    color: PDF_COLORS.ochre,
  },
  cardNumero: {
    fontFamily: 'Inter',
    fontSize: 7.5,
    color: PDF_COLORS.creamFaint,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  cardNome: {
    fontFamily: 'Fraunces',
    fontSize: 18,
    color: PDF_COLORS.cream,
    fontWeight: 500,
    marginBottom: 4,
  },
  cardTagline: {
    fontFamily: 'Fraunces',
    fontSize: 9.5,
    fontStyle: 'italic',
    color: PDF_COLORS.creamDim,
    lineHeight: 1.3,
    marginBottom: 12,
  },
  cardPriceLabel: {
    fontFamily: 'Inter',
    fontSize: 7,
    color: PDF_COLORS.creamFaint,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  cardPriceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 2,
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: PDF_COLORS.coal3,
  },
  cardCifrao: {
    fontFamily: 'Inter',
    fontSize: 8,
    color: PDF_COLORS.creamDim,
    fontWeight: 500,
  },
  cardPrecoInteiro: {
    fontFamily: 'Fraunces',
    fontSize: 22,
    color: PDF_COLORS.cream,
    fontWeight: 500,
    fontVariantNumeric: 'tabular-nums',
    letterSpacing: -0.4,
  },
  cardPrecoCentavos: {
    fontFamily: 'Inter',
    fontSize: 10,
    color: PDF_COLORS.creamDim,
  },
  cardPrecoWine: {
    color: PDF_COLORS.wine,
  },
  cardPagamento: {
    fontFamily: 'Inter',
    fontSize: 7.5,
    color: PDF_COLORS.creamDim,
    marginBottom: 10,
  },
  inclusos: {
    gap: 5,
  },
  incluso: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 5,
  },
  check: {
    fontFamily: 'Inter',
    fontSize: 9,
    color: PDF_COLORS.ochre,
    fontWeight: 700,
    marginTop: 0.5,
  },
  inclusoTexto: {
    fontFamily: 'Inter',
    fontSize: 8,
    color: PDF_COLORS.creamDim,
    lineHeight: 1.4,
    flex: 1,
  },
  bonus: {
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 0.5,
    borderTopColor: PDF_COLORS.coal3,
  },
  bonusLabel: {
    fontFamily: 'Inter',
    fontSize: 7,
    color: PDF_COLORS.creamFaint,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  bonusTexto: {
    fontFamily: 'Inter',
    fontSize: 8,
    fontStyle: 'italic',
    color: PDF_COLORS.ochre,
  },
  footer: {
    position: 'absolute',
    bottom: 24,
    left: 48,
    right: 48,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerText: {
    fontFamily: 'Inter',
    fontSize: 7,
    color: PDF_COLORS.creamFaint,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
})

type Props = {
  totais: TotaisPorPlano
  pagamento: 'pix' | 'parcelado'
  pagamentoLabel: string
}

export function PageComparativo({ totais, pagamento, pagamentoLabel }: Props) {
  return (
    <View style={{ flex: 1, backgroundColor: PDF_COLORS.ink, padding: 48 }}>
      <View style={styles.header}>
        <View style={styles.brand}>
          <Text style={styles.brandText}>Maná Pizzas</Text>
        </View>
        <Text style={styles.validade}>Rodízio em casa</Text>
      </View>

      <Text style={styles.kicker}>Comparativo de planos</Text>
      <Text style={styles.title}>Escolha o que combina com seu evento</Text>
      <Text style={styles.sub}>
        Todos os planos incluem 3 horas de evento, 1 pizzaiolo, garçons, copos e guardanapos.
        O Premium se diferencia pelos ingredientes importados e sabores com búfala.
      </Text>

      <View style={styles.grid}>
        {PLANOS.map((p) => {
          const isPremium = p.id === 'premium'
          const totaisPlano =
            p.id === 'premium' ? totais.premium :
            p.id === 'livre-bebida' ? totais.livreBebida :
            p.id === 'livre-sem-bebida' ? totais.livreSemBebida :
            totais.unidade
          const preco = pagamento === 'pix' && p.precoPessoaAvista
            ? p.precoPessoaAvista
            : totaisPlano.precoPessoaUsado
          const isUnidade = p.id === 'unidade'
          const fmt = pdfFormatBRL(preco)
          const cardStyle = [
            styles.card,
            isPremium ? styles.cardPremium : null,
          ].filter((s): s is NonNullable<typeof s> => s !== null)

          return (
            <View key={p.id} style={cardStyle} wrap={false}>
              {isPremium && (
                <View style={styles.badge}>
                  <Text style={styles.badgeIcon}>★</Text>
                  <Text style={styles.badgeText}>Recomendado</Text>
                </View>
              )}

              <Text style={styles.cardNumero}>Opção {p.numero}</Text>
              <Text style={styles.cardNome}>{p.nome}</Text>
              <Text style={styles.cardTagline}>{p.tagline}</Text>

              <Text style={styles.cardPriceLabel}>
                {isUnidade ? 'por pizza' : 'por pessoa'}
              </Text>
              <View style={styles.cardPriceRow}>
                <Text
                  style={[styles.cardCifrao, isPremium ? styles.cardPrecoWine : null].filter((s): s is NonNullable<typeof s> => s !== null)}
                >
                  {fmt.cifrao}
                </Text>
                <Text
                  style={[styles.cardPrecoInteiro, isPremium ? styles.cardPrecoWine : null].filter((s): s is NonNullable<typeof s> => s !== null)}
                >
                  {fmt.inteiro}
                </Text>
                <Text
                  style={[styles.cardPrecoCentavos, isPremium ? styles.cardPrecoWine : null].filter((s): s is NonNullable<typeof s> => s !== null)}
                >
                  ,{fmt.centavos}
                </Text>
              </View>
              <Text style={styles.cardPagamento}>{pagamentoLabel}</Text>

              <View style={styles.inclusos}>
                {p.inclusos.slice(0, 5).map((item) => (
                  <View key={item} style={styles.incluso}>
                    <Text style={styles.check}>✓</Text>
                    <Text style={styles.inclusoTexto}>{item}</Text>
                  </View>
                ))}
              </View>

              {p.bonus.length > 0 && (
                <View style={styles.bonus}>
                  <Text style={styles.bonusLabel}>Bônus</Text>
                  <Text style={styles.bonusTexto}>{p.bonus.join(' · ')}</Text>
                </View>
              )}
            </View>
          )
        })}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>manarodizio · @manarodizio</Text>
        <Text style={styles.footerText}>Página 2 de 3</Text>
      </View>
    </View>
  )
}
