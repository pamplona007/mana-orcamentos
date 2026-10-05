import { Page, View, Text, StyleSheet } from '@react-pdf/renderer'
import { PDF_COLORS } from '../styles'
import type { Orcamento, TotaisPorPlano } from '@/types/orcamento'
import type { Config } from '@/types/config'
import { formatBRL } from '@/utils/money'

const SABORES_SALGADOS: readonly string[] = [
  'Calabresa', 'Marguerita', 'Mussarela', 'Dois queijos', 'Três queijos',
  'Portuguesa', 'Carne de sol', 'Frango', 'Frango c/ catupiry', 'Frango c/ bacon',
  'Bacon c/ alho frito', 'Bacon c/ alho poró', 'Bacon c/ catupiry', 'Lombinho canadense',
  'Lombo c/ catupiry', 'Lombo c/ geleia de pimenta', 'Carne seca c/ catupiry',
  'Pepperoni c/ catupiry', 'Pepperoni', 'Hot pepperoni', 'Napolitana',
]

const SABORES_DOCES: readonly string[] = [
  'Chocolate c/ avelã', 'Chocolate c/ M&Ms', 'Banana c/ canela',
  'Banana caramelizada', 'Banoffe', 'Dueto',
]

const SABORES_PREMIUM: string[] = [
  'Marguerita premium (búfala)',
  'Pepperoni premium (búfala)',
  '4 queijos c/ melaço',
  'Brie c/ geleia de pimenta',
  'Mortadela italiana c/ burrata',
  'Rúcula c/ Parma',
  'Caprese c/ azeitonas pretas',
  'Copa lombo c/ Brie',
]

const styles = StyleSheet.create({
  page: {
    backgroundColor: PDF_COLORS.ink,
    paddingHorizontal: 48,
    paddingVertical: 48,
    fontFamily: 'Inter',
    fontSize: 10,
    color: PDF_COLORS.cream,
  },
  header: {
    flexDirection: 'row',
    gap: 28,
    marginBottom: 18,
    alignItems: 'center',
  },
  headerText: {
    flex: 1.2,
  },
  headerImage: {
    flex: 1,
    height: 130,
    borderRadius: 4,
  },
  kicker: {
    fontFamily: 'Inter',
    fontSize: 9,
    fontWeight: 700,
    color: PDF_COLORS.ochre,
    textTransform: 'uppercase',
    letterSpacing: 2.5,
    marginBottom: 8,
  },
  title: {
    fontFamily: 'Fraunces',
    fontSize: 32,
    fontWeight: 500,
    color: PDF_COLORS.cream,
    letterSpacing: -0.6,
    lineHeight: 1.05,
    marginBottom: 8,
  },
  sub: {
    fontFamily: 'Fraunces',
    fontSize: 11.5,
    fontStyle: 'italic',
    color: PDF_COLORS.creamDim,
    lineHeight: 1.4,
  },
  columns: {
    flexDirection: 'row',
    gap: 12,
  },
  column: {
    flex: 1,
  },
  columnWide: {
    flex: 1.7,
  },
  columnNarrow: {
    flex: 1,
  },
  salgadosList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  salgadoItem: {
    width: '48%',
    fontFamily: 'Fraunces',
    fontSize: 10,
    color: PDF_COLORS.cream,
    marginBottom: 4,
    paddingLeft: 8,
  },
  saborItem: {
    fontFamily: 'Fraunces',
    fontSize: 10.5,
    color: PDF_COLORS.cream,
    marginBottom: 4,
    paddingLeft: 8,
  },
  columnKicker: {
    fontFamily: 'Inter',
    fontSize: 8,
    fontWeight: 700,
    color: PDF_COLORS.ochre,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 2,
  },
  columnTitle: {
    fontFamily: 'Fraunces',
    fontSize: 18,
    fontWeight: 600,
    color: PDF_COLORS.cream,
    marginBottom: 2,
  },
  columnLinha: {
    fontFamily: 'Inter',
    fontSize: 8,
    color: PDF_COLORS.creamFaint,
    marginBottom: 10,
  },
  columnDivider: {
    height: 0.5,
    backgroundColor: PDF_COLORS.coal3,
    marginBottom: 8,
  },
  sabor: {
    fontFamily: 'Fraunces',
    fontSize: 10.5,
    color: PDF_COLORS.cream,
    marginBottom: 4,
    paddingLeft: 8,
  },
  saborDot: {
    color: PDF_COLORS.ochre,
    marginRight: 4,
  },
  premiumRow: {
    backgroundColor: PDF_COLORS.wine,
    borderRadius: 4,
    padding: 14,
    marginTop: 16,
  },
  premiumTop: {
    marginBottom: 10,
  },
  premiumKicker: {
    fontFamily: 'Inter',
    fontSize: 8,
    fontWeight: 700,
    color: PDF_COLORS.ochre,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 4,
  },
  premiumTitle: {
    fontFamily: 'Fraunces',
    fontSize: 14,
    fontWeight: 600,
    color: PDF_COLORS.cream,
    marginBottom: 2,
  },
  premiumLimit: {
    fontFamily: 'Inter',
    fontSize: 8,
    color: PDF_COLORS.creamDim,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  premiumList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  premiumItem: {
    fontFamily: 'Fraunces',
    fontSize: 9,
    color: PDF_COLORS.cream,
    backgroundColor: PDF_COLORS.wineGlow,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 2,
    flexBasis: '48%',
  },
  premiumNote: {
    fontFamily: 'Inter',
    fontSize: 8,
    color: PDF_COLORS.creamDim,
    marginTop: 8,
    lineHeight: 1.45,
  },
  glutenRow: {
    marginTop: 10,
    paddingTop: 8,
    paddingBottom: 8,
    borderTopWidth: 0.5,
    borderTopColor: PDF_COLORS.coal3,
    gap: 4,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  glutenLabel: {
    fontFamily: 'Inter',
    fontSize: 7.5,
    fontWeight: 700,
    color: PDF_COLORS.ochre,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    minWidth: 70,
  },
  glutenBody: {
    flex: 1,
    fontFamily: 'Inter',
    fontSize: 8.5,
    color: PDF_COLORS.creamDim,
    lineHeight: 1.45,
  },
  optionalSection: {
    backgroundColor: PDF_COLORS.coal,
    borderRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginTop: 18,
  },
  optionalTitle: {
    fontFamily: 'Fraunces',
    fontSize: 20,
    fontWeight: 600,
    color: PDF_COLORS.cream,
  },
  optionalHeroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  optionalDescription: {
    fontFamily: 'Inter',
    fontSize: 9,
    color: PDF_COLORS.creamDim,
    marginBottom: 6,
  },
  optionalHeroPrice: {
    fontFamily: 'Fraunces',
    fontSize: 20,
    fontWeight: 600,
    color: PDF_COLORS.success,
    textAlign: 'right',
  },
  optionalAfterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  optionalAfterDescription: {
    fontFamily: 'Inter',
    fontSize: 8,
    color: PDF_COLORS.creamDim,
  },
  optionalAfterPrice: {
    fontFamily: 'Fraunces',
    fontSize: 16,
    fontWeight: 600,
    color: PDF_COLORS.cream,
  },
})

export type PageCardapioProps = {
  orcamento: Orcamento
  totais: TotaisPorPlano
  validadeISO: string
  config: Config
}

export function PageCardapio({ config }: PageCardapioProps) {
  const salgadosCustom = config.pdf.cardapio.salgadosCustomizados.filter(Boolean)
  const docesCustom = config.pdf.cardapio.docesCustomizados.filter(Boolean)
  const salgados = salgadosCustom.length > 0 ? salgadosCustom : SABORES_SALGADOS
  const doces = docesCustom.length > 0 ? docesCustom : SABORES_DOCES
  const entrada = config.pdf.adicionais.entrada
  const salgadoExtra = config.pdf.adicionais.salgadoExtra

  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.kicker}>O que sai do forno · todos os planos</Text>
          <Text style={styles.title}>26 sabores no forno, massa maturada 12h</Text>
          <Text style={styles.sub}>
            O mesmo cardápio roda em qualquer plano. Você muda o serviço, não a pizza.
          </Text>
        </View>
      </View>

      <View style={styles.columns}>
        <View style={styles.columnWide}>
          <Text style={styles.columnKicker}>Salgados</Text>
          <Text style={styles.columnTitle}>{salgados.length} sabores</Text>
          <Text style={styles.columnLinha}>Os clássicos da casa.</Text>
          <View style={styles.columnDivider} />
          <View style={styles.salgadosList}>
            {salgados.map((nome) => (
              <Text key={nome} style={styles.salgadoItem}>
                <Text style={styles.saborDot}>•</Text>
                {nome}
              </Text>
            ))}
          </View>
        </View>

        <View style={styles.columnNarrow}>
          <Text style={styles.columnKicker}>Doces</Text>
          <Text style={styles.columnTitle}>{doces.length} sabores</Text>
          <Text style={styles.columnLinha}>Pra fechar o rodízio.</Text>
          <View style={styles.columnDivider} />
          {doces.map((nome) => (
            <Text key={nome} style={styles.saborItem}>
              <Text style={styles.saborDot}>•</Text>
              {nome}
            </Text>
          ))}
        </View>
      </View>

      <View style={styles.premiumRow}>
        <View style={styles.premiumTop}>
          <Text style={styles.premiumKicker}>Premium · sabores exclusivos</Text>
          <Text style={styles.premiumTitle}>Escolha 3 sabores preparados com muçarela de búfala</Text>
        </View>
        <View style={styles.premiumList}>
          {SABORES_PREMIUM.map((p) => (
            <Text key={p} style={styles.premiumItem}>{p}</Text>
          ))}
        </View>
      </View>

      <View style={styles.optionalSection}>
        <View style={styles.optionalHeroRow}>
          <Text style={styles.optionalTitle}>Entrada</Text>
          <Text style={styles.optionalHeroPrice}>R$ {entrada.toFixed(2).replace('.', ',')}</Text>
        </View>
        <Text style={styles.optionalDescription}>2 centos de salgados + 2 kg de batata</Text>
        <View style={styles.optionalAfterRow}>
          <Text style={styles.optionalAfterDescription}>Cada cento de salgados adicional: {formatBRL(salgadoExtra)}</Text>
        </View>
      </View>

      <View style={styles.glutenRow}>
        <Text style={styles.glutenLabel}>Sem glúten</Text>
        <Text style={styles.glutenBody}>
          Disponível em todos os planos sob pedido. Informe restrições alimentares ao
          atendente antes do evento.
        </Text>
      </View>
    </Page>
  )
}
