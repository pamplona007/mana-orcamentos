import { Page, View, Text, StyleSheet } from '@react-pdf/renderer'
import { PDF_COLORS } from '../styles'
import { pdfData } from '../utils'
import type { Orcamento, TotaisPorPlano } from '@/types/orcamento'

const styles = StyleSheet.create({
  page: {
    backgroundColor: PDF_COLORS.ink,
    paddingHorizontal: 48,
    paddingVertical: 56,
    fontFamily: 'Inter',
    fontSize: 10,
    color: PDF_COLORS.cream,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: PDF_COLORS.coal3,
    paddingBottom: 12,
    marginBottom: 40,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  brandName: {
    fontFamily: 'Fraunces',
    fontSize: 18,
    fontWeight: 700,
    color: PDF_COLORS.cream,
    letterSpacing: -0.2,
  },
  brandTag: {
    fontFamily: 'Inter',
    fontSize: 7.5,
    fontWeight: 600,
    color: PDF_COLORS.ochre,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  validade: {
    fontFamily: 'Inter',
    fontSize: 8,
    color: PDF_COLORS.creamFaint,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  validadeStrong: {
    fontFamily: 'Inter',
    fontSize: 8,
    fontWeight: 700,
    color: PDF_COLORS.cream,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  heroBlock: {
    marginTop: 80,
  },
  kicker: {
    fontFamily: 'Inter',
    fontSize: 9,
    fontWeight: 700,
    color: PDF_COLORS.ochre,
    textTransform: 'uppercase',
    letterSpacing: 2.5,
    marginBottom: 16,
  },
  title: {
    fontFamily: 'Fraunces',
    fontSize: 64,
    fontWeight: 500,
    color: PDF_COLORS.cream,
    letterSpacing: -1.5,
    lineHeight: 1.05,
    marginBottom: 24,
  },
  cliente: {
    fontFamily: 'Fraunces',
    fontSize: 22,
    fontStyle: 'italic',
    fontWeight: 400,
    color: PDF_COLORS.creamDim,
    marginBottom: 32,
  },
  meta: {
    flexDirection: 'row',
    gap: 32,
    borderTopWidth: 0.5,
    borderTopColor: PDF_COLORS.coal3,
    paddingTop: 18,
  },
  metaItem: {
    flexDirection: 'column',
  },
  metaLabel: {
    fontFamily: 'Inter',
    fontSize: 7.5,
    fontWeight: 600,
    color: PDF_COLORS.creamFaint,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  metaValue: {
    fontFamily: 'Fraunces',
    fontSize: 14,
    color: PDF_COLORS.cream,
  },
  footer: {
    position: 'absolute',
    bottom: 56,
    left: 48,
    right: 48,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 0.5,
    borderTopColor: PDF_COLORS.coal3,
    paddingTop: 12,
  },
  footerText: {
    fontFamily: 'Inter',
    fontSize: 7.5,
    color: PDF_COLORS.creamFaint,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  promiseBlock: {
    position: 'absolute',
    bottom: 200,
    left: 48,
    right: 48,
    borderTopWidth: 0.5,
    borderTopColor: PDF_COLORS.coal3,
    paddingTop: 18,
  },
  promiseKicker: {
    fontFamily: 'Inter',
    fontSize: 8,
    fontWeight: 700,
    color: PDF_COLORS.ochre,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 12,
  },
  promiseRow: {
    flexDirection: 'row',
    gap: 18,
  },
  promiseThumb: {
    width: 80,
    height: 80,
    borderRadius: 4,
  },
  promiseItems: {
    flex: 1,
    flexDirection: 'row',
    gap: 18,
  },
  promiseItem: {
    flexDirection: 'column',
    flex: 1,
  },
  promiseItemTitle: {
    fontFamily: 'Fraunces',
    fontSize: 13,
    fontWeight: 600,
    color: PDF_COLORS.cream,
    marginBottom: 4,
  },
  promiseItemBody: {
    fontFamily: 'Inter',
    fontSize: 9,
    color: PDF_COLORS.creamDim,
    lineHeight: 1.45,
  },
})

export type PageCapaProps = {
  orcamento: Orcamento
  totais: TotaisPorPlano
  validadeISO: string
}

export function PageCapa({ orcamento, validadeISO }: PageCapaProps) {
  const clienteNome = orcamento.cliente.nome || 'Cliente'
  const totalPessoas =
    orcamento.convidados.adultos +
    orcamento.convidados.criancas0a4 +
    orcamento.convidados.criancas5a9
  const dataEvento = pdfData(orcamento.evento.data)
  const validade = pdfData(validadeISO)

  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.topBar}>
        <View style={styles.brand}>
          <Text style={styles.brandName}>Maná</Text>
          <Text style={styles.brandTag}>Rodízio em casa</Text>
        </View>
        <Text style={styles.validade}>
          Válido até <Text style={styles.validadeStrong}>{validade}</Text>
        </Text>
      </View>

      <View style={styles.heroBlock}>
        <Text style={styles.kicker}>Orçamento · Edição {orcamento.criadoEm.slice(0, 7)}</Text>
        <Text style={styles.title}>Para o evento da família</Text>
        <Text style={styles.cliente}>{clienteNome}</Text>

        <View style={styles.meta}>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Data</Text>
            <Text style={styles.metaValue}>{dataEvento}</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Local</Text>
            <Text style={styles.metaValue}>
              {orcamento.evento.cidadeBairro || 'A definir'}
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Convidados</Text>
            <Text style={styles.metaValue}>{totalPessoas} pessoas</Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Maná Pizzas & Eventos · (42) 99999-0000</Text>
        <Text style={styles.footerText}>manarodizio.com.br</Text>
      </View>

      <View style={styles.promiseBlock}>
        <Text style={styles.promiseKicker}>A Maná cuida de tudo</Text>
        <View style={styles.promiseRow}>
          <View style={styles.promiseItems}>
            <View style={styles.promiseItem}>
              <Text style={styles.promiseItemTitle}>Massa de 12h</Text>
              <Text style={styles.promiseItemBody}>
                Fermentação natural lenta, digestiva e crocante na medida.
              </Text>
            </View>
            <View style={styles.promiseItem}>
              <Text style={styles.promiseItemTitle}>Chega 30 min antes</Text>
              <Text style={styles.promiseItemBody}>
                Você encontra tudo pronto e quente — só curtir.
              </Text>
            </View>
            <View style={styles.promiseItem}>
              <Text style={styles.promiseItemTitle}>Sem bagunça</Text>
              <Text style={styles.promiseItemBody}>
                A gente monta, serve e deixa a cozinha limpa no final.
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Page>
  )
}