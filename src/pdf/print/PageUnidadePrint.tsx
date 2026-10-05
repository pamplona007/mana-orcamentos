import { Page, View, Text, StyleSheet } from '@react-pdf/renderer'
import { pdfFormatBRL } from '../utils'
import { PLANO_POR_ID } from '../../data/plans'
import type { Orcamento, TotaisPorPlano } from '../../types/orcamento'
import type { Config } from '../../types/config'

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 48,
    paddingVertical: 56,
    fontFamily: 'Inter',
    fontSize: 10,
    color: '#000000',
  },
  hero: {
    marginBottom: 28,
  },
  kicker: {
    fontFamily: 'Inter',
    fontSize: 9,
    fontWeight: 700,
    color: '#000000',
    textTransform: 'uppercase',
    letterSpacing: 2.5,
    marginBottom: 10,
  },
  title: {
    fontFamily: 'Fraunces',
    fontSize: 36,
    fontWeight: 500,
    color: '#000000',
    letterSpacing: -0.8,
    lineHeight: 1.05,
    marginBottom: 16,
  },
  sub: {
    fontFamily: 'Fraunces',
    fontSize: 14,
    fontStyle: 'italic',
    color: '#333333',
    marginBottom: 22,
    maxWidth: '85%',
    lineHeight: 1.4,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 36,
    borderTopWidth: 0.5,
    borderTopColor: '#000000',
    paddingTop: 16,
  },
  metaItem: {
    flexDirection: 'column',
  },
  metaLabel: {
    fontFamily: 'Inter',
    fontSize: 7.5,
    fontWeight: 600,
    color: '#666666',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  metaValue: {
    fontFamily: 'Fraunces',
    fontSize: 14,
    color: '#000000',
  },
  metaPixValue: {
    fontFamily: 'Fraunces',
    fontSize: 14,
    color: '#000000',
    fontWeight: 700,
    marginBottom: 2,
  },
  metaCardValue: {
    fontFamily: 'Inter',
    fontSize: 8,
    color: '#333333',
  },
  storyBlock: {
    marginTop: 20,
    marginBottom: 20,
  },
  sectionKicker: {
    fontFamily: 'Inter',
    fontSize: 9,
    fontWeight: 700,
    color: '#000000',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 12,
  },
  paragraph: {
    fontFamily: 'Fraunces',
    fontSize: 12,
    color: '#333333',
    lineHeight: 1.55,
    marginBottom: 12,
  },
  paragraphBold: {
    fontWeight: 700,
    color: '#000000',
  },
  callout: {
    borderWidth: 1,
    borderColor: '#000000',
    padding: 22,
    borderRadius: 4,
  },
  calloutKicker: {
    fontFamily: 'Inter',
    fontSize: 8,
    fontWeight: 700,
    color: '#000000',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 10,
  },
  calloutPrice: {
    fontFamily: 'Fraunces',
    fontSize: 38,
    fontWeight: 500,
    color: '#000000',
    fontVariantNumeric: 'tabular-nums',
    letterSpacing: -0.6,
    marginBottom: 4,
  },
  calloutPriceLabel: {
    fontFamily: 'Inter',
    fontSize: 9.5,
    color: '#333333',
    marginBottom: 14,
  },
  calloutDiscount: {
    fontFamily: 'Inter',
    fontSize: 8,
    fontWeight: 700,
    color: '#000000',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  calloutBody: {
    fontFamily: 'Inter',
    fontSize: 9.5,
    color: '#333333',
    lineHeight: 1.5,
    borderTopWidth: 0.5,
    borderTopColor: '#000000',
    paddingTop: 12,
  },
})

export type PageUnidadePrintProps = {
  orcamento: Orcamento
  totais: TotaisPorPlano
  validadeISO: string
  config: Config
}

export function PageUnidadePrint(props: PageUnidadePrintProps) {
  const total = props.totais.unidade
  const numParcelas = props.config.pdf.adicionais.parcelas
  const totalPessoas =
    props.orcamento.convidados.adultos +
    props.orcamento.convidados.criancas0a4 +
    props.orcamento.convidados.criancas5a9
  const pizzasSugeridas = Math.ceil(totalPessoas * 0.6)
  const fmt = pdfFormatBRL(total.totalAvista)
  const fmtPizza = pdfFormatBRL(PLANO_POR_ID.unidade.precoPizzaAvista ?? total.precoPessoaUsado)
  const fmtPizzaCard = pdfFormatBRL(total.precoPessoaUsado)
  const fmtParcela = pdfFormatBRL(total.parcela10x)

  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.hero}>
        <Text style={styles.kicker}>Plano 4 · Por unidade</Text>
        <Text style={styles.title}>
          Você controla a quantidade, a gente mantém o forno aceso
        </Text>
        <Text style={styles.sub}>
          Mesa fixa de self service, ideal pra listas abertas,
          eventos com outras comidas ou quando você quer pagar só pelo que sai do forno.
        </Text>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Preço por pizza</Text>
            <Text style={styles.metaPixValue}>
              Pix: {fmtPizza.cifrao} {fmtPizza.inteiro},{fmtPizza.centavos}
            </Text>
            <Text style={styles.metaCardValue}>
              Cartão: {fmtPizzaCard.cifrao} {fmtPizzaCard.inteiro},{fmtPizzaCard.centavos}
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Pizzas sugeridas</Text>
            <Text style={styles.metaValue}>
              {pizzasSugeridas} pizzas p/ {totalPessoas} pessoas
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Duração</Text>
            <Text style={styles.metaValue}>3 horas</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Equipe</Text>
            <Text style={styles.metaValue}>1 pizzaiolo + garçons</Text>
          </View>
        </View>
      </View>

      <View style={styles.storyBlock}>
        <Text style={styles.sectionKicker}>Como funciona</Text>
        <Text style={styles.paragraph}>
          A gente monta uma mesa de self service na sua casa ou evento, mantém o forno aceso e
          repõe os sabores conforme a galera consome. Você e seus convidados se servem à vontade,
          sem fila, sem pressa.
        </Text>
        <Text style={styles.paragraph}>
          Cobramos por pizza que sai do forno, não por convidado. A regra é simples:
          <Text style={styles.paragraphBold}> uma pizza a cada 1,6 pessoa </Text>
          garante fartura sem desperdício. Para {totalPessoas} pessoas, sugerimos
          <Text style={styles.paragraphBold}> {pizzasSugeridas} pizzas</Text>, mas você
          paga só o que sair do forno.
        </Text>
        <Text style={styles.paragraph}>
          Os 30 sabores do cardápio (veja na página anterior) ficam expostos com nome e
          ingredientes. Quem tem restrição vê antes de pegar. Reposição contínua durante
          as 3 horas de serviço.
        </Text>
      </View>

      <View style={styles.callout}>
        <Text style={styles.calloutKicker}>
          Total estimado · {totalPessoas} pessoas · {pizzasSugeridas} pizzas
        </Text>
        <Text style={styles.calloutPrice}>
          {fmt.cifrao} {fmt.inteiro},{fmt.centavos}
        </Text>
        <Text style={styles.calloutDiscount}>À vista no Pix, com 15% de desconto</Text>
        <Text style={styles.calloutPriceLabel}>
          ou {numParcelas}x de {fmtParcela.cifrao} {fmtParcela.inteiro},{fmtParcela.centavos} no cartão
        </Text>
        <Text style={styles.calloutBody}>
          Calculado com {pizzasSugeridas} pizzas × {fmtPizza.cifrao} {fmtPizza.inteiro},
          {fmtPizza.centavos}. Adicionais opcionais não estão incluídos neste total.
        </Text>
      </View>
    </Page>
  )
}
