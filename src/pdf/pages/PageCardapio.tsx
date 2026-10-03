import { Page, View, Text, StyleSheet, Image } from '@react-pdf/renderer'
import { PDF_COLORS } from '../styles'
import type { Orcamento, TotaisPorPlano } from '@/types/orcamento'

type Sabor = {
  nome: string
  categoria: 'clássica' | 'especial' | 'doce'
}

const SABORES: Sabor[] = [
  { nome: 'Calabresa', categoria: 'clássica' },
  { nome: 'Marguerita', categoria: 'clássica' },
  { nome: 'Mussarela', categoria: 'clássica' },
  { nome: 'Dois queijos', categoria: 'clássica' },
  { nome: 'Três queijos', categoria: 'clássica' },
  { nome: 'Portuguesa', categoria: 'clássica' },
  { nome: 'Carne de sol', categoria: 'clássica' },
  { nome: 'Frango', categoria: 'clássica' },
  { nome: 'Frango c/ catupiry', categoria: 'clássica' },
  { nome: 'Frango c/ bacon', categoria: 'clássica' },
  { nome: 'Bacon c/ alho frito', categoria: 'clássica' },
  { nome: 'Bacon c/ alho poró', categoria: 'clássica' },
  { nome: 'Bacon c/ catupiry', categoria: 'clássica' },
  { nome: 'Lombinho canadense', categoria: 'clássica' },
  { nome: 'Lombo c/ catupiry', categoria: 'clássica' },
  { nome: 'Lombo c/ geleia de pimenta', categoria: 'clássica' },
  { nome: 'Carne seca c/ catupiry', categoria: 'clássica' },
  { nome: 'Pepperoni c/ catupiry', categoria: 'clássica' },
  { nome: 'Pepperoni', categoria: 'clássica' },
  { nome: 'Hot pepperoni', categoria: 'clássica' },
  { nome: 'Napolitana', categoria: 'clássica' },
  { nome: 'Chocolate c/ avelã', categoria: 'doce' },
  { nome: 'Chocolate c/ M&Ms', categoria: 'doce' },
  { nome: 'Banana c/ canela', categoria: 'doce' },
  { nome: 'Banana caramelizada', categoria: 'doce' },
  { nome: 'Banoffe', categoria: 'doce' },
  { nome: 'Dueto', categoria: 'doce' },
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
    paddingVertical: 52,
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
    borderTopWidth: 0.5,
    borderTopColor: PDF_COLORS.wineGlow,
    flexDirection: 'row',
    gap: 10,
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
})

export type PageCardapioProps = {
  orcamento: Orcamento
  totais: TotaisPorPlano
  validadeISO: string
}

export function PageCardapio(_props: PageCardapioProps) {
  const salgados = SABORES.filter((s) => s.categoria === 'clássica')
  const doces = SABORES.filter((s) => s.categoria === 'doce')

  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.kicker}>O que sai do forno · todos os planos</Text>
          <Text style={styles.title}>26 sabores no forno, massa maturada 12h</Text>
          <Text style={styles.sub}>
            O mesmo cardápio roda em qualquer plano — você muda o serviço, não a pizza.
          </Text>
        </View>
        <Image src="/images/pizza-hero.jpg" style={styles.headerImage} />
      </View>

      <View style={styles.columns}>
        <View style={styles.columnWide}>
          <Text style={styles.columnKicker}>Salgados</Text>
          <Text style={styles.columnTitle}>20 sabores</Text>
          <Text style={styles.columnLinha}>Os clássicos da casa.</Text>
          <View style={styles.columnDivider} />
          <View style={styles.salgadosList}>
            {salgados.map((s) => (
              <Text key={s.nome} style={styles.salgadoItem}>
                <Text style={styles.saborDot}>•</Text>
                {s.nome}
              </Text>
            ))}
          </View>
        </View>

        <View style={styles.columnNarrow}>
          <Text style={styles.columnKicker}>Doces</Text>
          <Text style={styles.columnTitle}>6 sabores</Text>
          <Text style={styles.columnLinha}>Pra fechar o rodízio.</Text>
          <View style={styles.columnDivider} />
          {doces.map((s) => (
            <Text key={s.nome} style={styles.saborItem}>
              <Text style={styles.saborDot}>•</Text>
              {s.nome}
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
        <View style={styles.glutenRow}>
          <Text style={styles.glutenLabel}>Sem glúten</Text>
          <Text style={styles.glutenBody}>
            Disponível em todos os planos sob pedido. Informe restrições alimentares ao
            atendente antes do evento.
          </Text>
        </View>
      </View>
    </Page>
  )
}