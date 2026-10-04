import { Page, View, Text, StyleSheet } from '@react-pdf/renderer'
import { PDF_COLORS } from '../styles'
import { pdfData } from '../utils'
import type { Orcamento, TotaisPorPlano } from '@/types/orcamento'

const styles = StyleSheet.create({
  page: {
    backgroundColor: PDF_COLORS.ink,
    paddingHorizontal: 48,
    paddingVertical: 52,
    fontFamily: 'Inter',
    fontSize: 10,
    color: PDF_COLORS.cream,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    borderBottomWidth: 0.5,
    borderBottomColor: PDF_COLORS.coal3,
    paddingBottom: 12,
    marginBottom: 36,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  brandName: {
    fontFamily: 'Fraunces',
    fontSize: 22,
    fontWeight: 700,
    color: PDF_COLORS.cream,
    letterSpacing: -0.3,
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
  },
  edition: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  },
  editionLine: {
    width: 28,
    height: 0.5,
    backgroundColor: PDF_COLORS.ochre,
  },
  editionLabel: {
    fontFamily: 'Inter',
    fontSize: 8.5,
    fontWeight: 700,
    color: PDF_COLORS.ochre,
    textTransform: 'uppercase',
    letterSpacing: 2.5,
  },
  title: {
    fontFamily: 'Fraunces',
    fontSize: 68,
    fontWeight: 400,
    color: PDF_COLORS.cream,
    letterSpacing: -1.6,
    lineHeight: 1.0,
    marginBottom: 8,
  },
  titleItalic: {
    fontStyle: 'italic',
    color: PDF_COLORS.creamDim,
  },
  cliente: {
    fontFamily: 'Fraunces',
    fontSize: 26,
    fontStyle: 'italic',
    fontWeight: 400,
    color: PDF_COLORS.ochre,
    marginBottom: 48,
    letterSpacing: -0.3,
  },
  meta: {
    flexDirection: 'row',
    gap: 28,
    borderTopWidth: 0.5,
    borderTopColor: PDF_COLORS.coal3,
    borderBottomWidth: 0.5,
    borderBottomColor: PDF_COLORS.coal3,
    paddingTop: 18,
    paddingBottom: 18,
  },
  metaItem: {
    flexDirection: 'column',
    flex: 1,
  },
  metaLabel: {
    fontFamily: 'Inter',
    fontSize: 7,
    fontWeight: 600,
    color: PDF_COLORS.creamFaint,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 5,
  },
  metaValue: {
    fontFamily: 'Fraunces',
    fontSize: 13,
    color: PDF_COLORS.cream,
  },
  metaValueAccent: {
    color: PDF_COLORS.ochre,
  },
  metaSubvalue: {
    fontFamily: 'Inter',
    fontSize: 7.5,
    color: PDF_COLORS.creamFaint,
    marginTop: 1,
  },
  storyBlock: {
    marginTop: 36,
    flexDirection: 'row',
    gap: 28,
  },
  storyCol: {
    flex: 1,
  },
  storyColWide: {
    flex: 1.4,
  },
  storyKicker: {
    fontFamily: 'Inter',
    fontSize: 7.5,
    fontWeight: 700,
    color: PDF_COLORS.ochre,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 8,
  },
  storyTitle: {
    fontFamily: 'Fraunces',
    fontSize: 15,
    fontWeight: 600,
    color: PDF_COLORS.cream,
    marginBottom: 6,
  },
  storyBody: {
    fontFamily: 'Inter',
    fontSize: 9,
    color: PDF_COLORS.creamDim,
    lineHeight: 1.5,
  },
  promiseBlock: {
    position: 'absolute',
    bottom: 96,
    left: 48,
    right: 48,
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
  promiseItem: {
    flexDirection: 'column',
    flex: 1,
  },
  promiseItemTitle: {
    fontFamily: 'Fraunces',
    fontSize: 13,
    fontWeight: 600,
    color: PDF_COLORS.cream,
    marginBottom: 3,
  },
  promiseItemBody: {
    fontFamily: 'Inter',
    fontSize: 8.5,
    color: PDF_COLORS.creamDim,
    lineHeight: 1.45,
  },
  footer: {
    position: 'absolute',
    bottom: 36,
    left: 48,
    right: 48,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  footerText: {
    fontFamily: 'Inter',
    fontSize: 7.5,
    color: PDF_COLORS.creamFaint,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  footerPhone: {
    fontFamily: 'Fraunces',
    fontSize: 12,
    color: PDF_COLORS.cream,
    fontVariantNumeric: 'tabular-nums',
  },
})

export type PageCapaProps = {
  orcamento: Orcamento
  totais: TotaisPorPlano
  validadeISO: string
}

export function PageCapa({ orcamento, validadeISO, totais }: PageCapaProps) {
  const clienteNome = orcamento.cliente.nome || 'Cliente'
  const totalPessoas =
    orcamento.convidados.adultos +
    orcamento.convidados.criancas0a4 +
    orcamento.convidados.criancas5a9
  const criancas =
    orcamento.convidados.criancas0a4 + orcamento.convidados.criancas5a9
  const dataEvento = orcamento.evento.data ? pdfData(orcamento.evento.data) : 'A agendar'
  const validade = pdfData(validadeISO)
  const localEvento = orcamento.evento.cidadeBairro || 'Local a combinar'
  const totalMaisBarato = totais.livreSemBebida.totalAvista
  const totalFmt = totalMaisBarato.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  })
  const precoPorConvidado =
    totalPessoas > 0 ? totalMaisBarato / totalPessoas : 0
  const precoPorConvidadoFmt = precoPorConvidado.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  })

  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.topBar}>
        <View style={styles.brand}>
          <Text style={styles.brandName}>Maná</Text>
          <Text style={styles.brandTag}>Pizzas & Eventos</Text>
        </View>
        <Text style={styles.validade}>
          Válido até <Text style={styles.validadeStrong}>{validade}</Text>
        </Text>
      </View>

      <View style={styles.edition}>
        <View style={styles.editionLine} />
        <Text style={styles.editionLabel}>
          Orçamento · Edição {orcamento.criadoEm.slice(0, 7)}
        </Text>
      </View>

      <Text style={styles.title}>
        Proposta <Text style={styles.titleItalic}>para</Text>
      </Text>
      <Text style={styles.cliente}>{clienteNome}</Text>

      <View style={styles.meta}>
        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>Data</Text>
          <Text style={styles.metaValue}>{dataEvento}</Text>
        </View>
        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>Local</Text>
          <Text style={styles.metaValue}>{localEvento}</Text>
        </View>
        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>Convidados</Text>
          <Text style={styles.metaValue}>
            {totalPessoas} pessoas
            {criancas > 0 && (
              <Text>
                <Text style={styles.metaValueAccent}> · </Text>
                <Text style={styles.metaValueAccent}>{criancas} crianças</Text>
              </Text>
            )}
          </Text>
        </View>
        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>A partir de</Text>
          <Text style={styles.metaValueAccent}>{totalFmt}</Text>
          <Text style={styles.metaSubvalue}>{precoPorConvidadoFmt} por convidado</Text>
        </View>
      </View>

      <View style={styles.storyBlock}>
        <View style={styles.storyColWide}>
          <Text style={styles.storyKicker}>Sobre a Maná</Text>
          <Text style={styles.storyTitle}>Pizzaria napolitana de bairro</Text>
          <Text style={styles.storyBody}>
            Massa maturada por 12 horas em fermentação natural, ingredientes selecionados e
            o cuidado de quem entende que pizza boa começa muito antes do forno.
          </Text>
        </View>
        <View style={styles.storyCol}>
          <Text style={styles.storyKicker}>Como funciona</Text>
          <Text style={styles.storyTitle}>3 planos de serviço</Text>
          <Text style={styles.storyBody}>
            A pizza é a mesma nos três. O que muda é o que vem com ela: garçom,
            pizzaiolo exclusivo, bebidas liberadas, ou self service por unidade.
          </Text>
        </View>
      </View>

      <View style={styles.promiseBlock}>
        <Text style={styles.promiseKicker}>O que está incluso em qualquer plano</Text>
        <View style={styles.promiseRow}>
          <View style={styles.promiseItem}>
            <Text style={styles.promiseItemTitle}>Massa maturada 12h</Text>
            <Text style={styles.promiseItemBody}>
              Fermentação natural lenta, digestiva e crocante na medida.
            </Text>
          </View>
          <View style={styles.promiseItem}>
            <Text style={styles.promiseItemTitle}>Chega 30 min antes</Text>
            <Text style={styles.promiseItemBody}>
              Tudo pronto e quente na sua casa quando o primeiro convidado chegar.
            </Text>
          </View>
          <View style={styles.promiseItem}>
            <Text style={styles.promiseItemTitle}>Cozinha limpa no final</Text>
            <Text style={styles.promiseItemBody}>
              A gente monta, serve, desmonta e deixa a cozinha como encontrou.
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <View>
          <Text style={styles.footerText}>manarodizio.com.br</Text>
        </View>
        <Text style={styles.footerPhone}>(85) 99280-3884</Text>
      </View>
    </Page>
  )
}
