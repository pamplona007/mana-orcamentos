import { View, Text, Image, StyleSheet } from '@react-pdf/renderer'
import { PDF_COLORS, pdfStyles } from '../styles'
import { pdfData, pdfFormatBRL } from '../utils'
import type { Totais } from '@/types/orcamento'
import type { Plano } from '@/data/plans'

const styles = StyleSheet.create({
  hero: {
    flex: 1,
    backgroundColor: PDF_COLORS.ink,
    position: 'relative',
  },
  imageBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 360,
    objectFit: 'cover',
    opacity: 0.55,
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 360,
    backgroundColor: PDF_COLORS.ink,
    opacity: 0.4,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 200,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  brandLogo: {
    width: 56,
    height: 36,
    objectFit: 'contain',
  },
  brandText: {
    fontFamily: 'Fraunces',
    fontSize: 14,
    color: PDF_COLORS.cream,
    fontWeight: 500,
  },
  brandTag: {
    fontFamily: 'Inter',
    fontSize: 7,
    color: PDF_COLORS.creamDim,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginTop: 1,
  },
  validade: {
    fontFamily: 'Inter',
    fontSize: 7.5,
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
    marginBottom: 16,
    fontWeight: 700,
  },
  title: {
    fontFamily: 'Fraunces',
    fontSize: 72,
    fontStyle: 'italic',
    color: PDF_COLORS.cream,
    fontWeight: 500,
    letterSpacing: -2,
    lineHeight: 1,
    marginBottom: 12,
  },
  cliente: {
    fontFamily: 'Fraunces',
    fontSize: 28,
    color: PDF_COLORS.cream,
    marginBottom: 32,
    fontWeight: 400,
  },
  meta: {
    flexDirection: 'row',
    gap: 32,
    marginBottom: 32,
  },
  metaItem: {
    flexDirection: 'column',
  },
  metaLabel: {
    fontFamily: 'Inter',
    fontSize: 7.5,
    color: PDF_COLORS.creamFaint,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  metaValue: {
    fontFamily: 'Fraunces',
    fontSize: 16,
    color: PDF_COLORS.cream,
    fontWeight: 500,
  },
  totalBox: {
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: PDF_COLORS.coal3,
  },
  totalLabel: {
    fontFamily: 'Inter',
    fontSize: 9,
    color: PDF_COLORS.ochre,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 6,
    fontWeight: 700,
  },
  totalPriceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  totalCifrao: {
    fontFamily: 'Inter',
    fontSize: 14,
    color: PDF_COLORS.creamDim,
    fontWeight: 500,
  },
  totalInteiro: {
    fontFamily: 'Fraunces',
    fontSize: 56,
    color: PDF_COLORS.cream,
    fontWeight: 500,
    letterSpacing: -1.5,
    fontVariantNumeric: 'tabular-nums',
  },
  totalCentavos: {
    fontFamily: 'Fraunces',
    fontSize: 24,
    color: PDF_COLORS.creamDim,
    fontWeight: 400,
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
    fontSize: 7.5,
    color: PDF_COLORS.creamFaint,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  decorLine: {
    position: 'absolute',
    top: 56,
    left: 48,
    right: 48,
    height: 1,
    backgroundColor: PDF_COLORS.wine,
  },
})

type Props = {
  clienteNome: string
  dataISO: string
  cidadeBairro: string
  plano: Plano
  totais: Totais
  pagamento: 'pix' | 'parcelado'
  validadeISO: string
}

export function PageCapa({
  clienteNome,
  dataISO,
  cidadeBairro,
  plano,
  totais,
  pagamento,
  validadeISO,
}: Props) {
  const total = pagamento === 'pix' ? totais.totalAvista : totais.total
  const totalFmt = pdfFormatBRL(total)
  const dataFmt = pdfData(dataISO)
  const validadeFmt = pdfData(validadeISO)

  return (
    <View style={styles.hero}>
      <Image src="/images/pizza-hero.jpg" style={styles.imageBg} />
      <View style={styles.gradient} />
      <View style={pdfStyles.page}>
        <View style={styles.decorLine} />
        <View style={styles.topBar}>
          <View style={styles.brand}>
            <Image src="/logo-mana.png" style={styles.brandLogo} />
            <View>
              <Text style={styles.brandText}>Maná Pizzas</Text>
              <Text style={styles.brandTag}>Rodízio em casa</Text>
            </View>
          </View>
          <Text style={styles.validade}>Válido até {validadeFmt}</Text>
        </View>

        <Text style={styles.kicker}>Orçamento {new Date().getFullYear()}</Text>
        <Text style={styles.title}>Maná no seu evento.</Text>
        <Text style={styles.cliente}>{clienteNome || 'Cliente'}</Text>

        <View style={styles.meta}>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Data</Text>
            <Text style={styles.metaValue}>{dataFmt}</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Local</Text>
            <Text style={styles.metaValue}>{cidadeBairro || 'A definir'}</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Plano</Text>
            <Text style={styles.metaValue}>{plano.nome}</Text>
          </View>
        </View>

        <View style={styles.totalBox}>
          <Text style={styles.totalLabel}>
            {pagamento === 'pix' ? 'Total à vista' : 'Total · 10x de R$ ' + totais.parcela10x.toFixed(2)}
          </Text>
          <View style={styles.totalPriceRow}>
            <Text style={styles.totalCifrao}>{totalFmt.cifrao}</Text>
            <Text style={styles.totalInteiro}>{totalFmt.inteiro}</Text>
            <Text style={styles.totalCentavos}>,{totalFmt.centavos}</Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>manarodizio · @manarodizio</Text>
        <Text style={styles.footerText}>Página 1 de 4</Text>
      </View>
    </View>
  )
}
