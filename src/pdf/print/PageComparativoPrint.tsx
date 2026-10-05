import { Page, View, Text, StyleSheet } from '@react-pdf/renderer'
import { PLANO_POR_ID } from '../../data/plans'
import { pdfFormatBRL } from '../utils'
import type { Orcamento, TotaisPorPlano, PlanoId } from '../../types/orcamento'
import type { Config } from '../../types/config'

const PLANO_IDS: PlanoId[] = ['premium', 'livre-bebida', 'livre-sem-bebida']

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 40,
    paddingVertical: 52,
    fontFamily: 'Inter',
    fontSize: 9,
    color: '#000000',
  },
  header: {
    marginBottom: 24,
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
    fontSize: 38,
    fontWeight: 500,
    color: '#000000',
    letterSpacing: -0.8,
    lineHeight: 1.05,
    marginBottom: 8,
  },
  sub: {
    fontFamily: 'Fraunces',
    fontSize: 12,
    fontStyle: 'italic',
    color: '#333333',
    maxWidth: '85%',
  },
  displacementNote: {
    fontFamily: 'Inter',
    fontSize: 8.5,
    color: '#000000',
    marginTop: 8,
  },
  cards: {
    flexDirection: 'row',
    gap: 14,
  },
  card: {
    flex: 1,
    borderWidth: 0.5,
    borderColor: '#000000',
    borderRadius: 6,
    overflow: 'hidden',
  },
  cardDestaque: {
    flex: 1.4,
    borderWidth: 1.5,
    borderColor: '#000000',
    borderRadius: 6,
    overflow: 'hidden',
  },
  cardImageWrap: {
    height: 100,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 0.5,
    borderBottomColor: '#000000',
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardImagePlaceholder: {
    fontFamily: 'Inter',
    fontSize: 11,
    fontWeight: 700,
    color: '#999999',
    letterSpacing: 2.5,
  },
  cardImage: {
    display: 'none',
  },
  cardBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#000000',
    color: '#FFFFFF',
    fontFamily: 'Inter',
    fontSize: 7,
    fontWeight: 700,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 2,
  },
  cardBody: {
    padding: 14,
  },
  cardNumber: {
    fontFamily: 'Inter',
    fontSize: 8,
    fontWeight: 600,
    color: '#666666',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  cardNome: {
    fontFamily: 'Fraunces',
    fontSize: 20,
    fontWeight: 600,
    color: '#000000',
    letterSpacing: -0.3,
    marginBottom: 3,
  },
  cardTagline: {
    fontFamily: 'Fraunces',
    fontSize: 9.5,
    fontStyle: 'italic',
    color: '#333333',
    marginBottom: 10,
    lineHeight: 1.3,
  },
  cardPrice: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    marginBottom: 1,
  },
  cardCifrao: {
    fontFamily: 'Inter',
    fontSize: 10,
    fontWeight: 500,
    color: '#333333',
  },
  cardInteiro: {
    fontFamily: 'Fraunces',
    fontSize: 28,
    fontWeight: 500,
    color: '#000000',
    fontVariantNumeric: 'tabular-nums',
    letterSpacing: -0.5,
  },
  cardCentavos: {
    fontFamily: 'Inter',
    fontSize: 12,
    color: '#333333',
  },
  cardParcela: {
    fontFamily: 'Inter',
    fontSize: 8.5,
    color: '#333333',
    marginBottom: 10,
  },
  cardPixLabel: {
    fontFamily: 'Inter',
    fontSize: 7.5,
    fontWeight: 700,
    color: '#000000',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 2,
  },
  cardDivider: {
    height: 0.5,
    backgroundColor: '#000000',
    marginVertical: 8,
  },
  cardFeature: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 5,
    marginBottom: 4,
  },
  cardFeatureDot: {
    fontFamily: 'Inter',
    fontSize: 8,
    color: '#000000',
    marginTop: 1,
  },
  cardFeatureText: {
    flex: 1,
    fontFamily: 'Inter',
    fontSize: 8.5,
    color: '#333333',
    lineHeight: 1.35,
  },
  cardDuration: {
    fontFamily: 'Inter',
    fontSize: 8,
    fontWeight: 600,
    color: '#666666',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginTop: 8,
  },
  destaqueBox: {
    borderWidth: 0.5,
    borderColor: '#000000',
    borderStyle: 'dashed',
    borderRadius: 4,
    padding: 10,
    marginTop: 4,
  },
  destaqueKicker: {
    fontFamily: 'Inter',
    fontSize: 7,
    fontWeight: 700,
    color: '#000000',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  destaqueItem: {
    marginBottom: 5,
  },
  destaqueTitulo: {
    fontFamily: 'Fraunces',
    fontSize: 9.5,
    fontWeight: 600,
    color: '#000000',
    marginBottom: 1,
  },
  destaqueCorpo: {
    fontFamily: 'Inter',
    fontSize: 7.5,
    color: '#333333',
    lineHeight: 1.35,
  },
})

const PLANO_TOTAL_KEY: Record<PlanoId, keyof TotaisPorPlano> = {
  premium: 'premium',
  'livre-bebida': 'livreBebida',
  'livre-sem-bebida': 'livreSemBebida',
  unidade: 'premium',
}

export type PageComparativoPrintProps = {
  orcamento: Orcamento
  totais: TotaisPorPlano
  validadeISO: string
  config: Config
}

export function PageComparativoPrint(props: PageComparativoPrintProps) {
  const numParcelas = props.config.pdf.adicionais.parcelas
  const pctDesconto = Math.round(props.config.pdf.adicionais.descontoAvista * 100)
  const deslocamentoAtivo = props.orcamento.deslocamento?.ativo
  const deslocamento = pdfFormatBRL(props.totais.premium.deslocamento)
  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.kicker}>3 planos de serviço · mesma pizza</Text>
        <Text style={styles.title}>Compare e escolha como prefere pagar</Text>
        <Text style={styles.sub}>
          Você não escolhe a pizza. Escolhe como prefere o serviço rodar.
        </Text>
        {deslocamentoAtivo && (
          <Text style={styles.displacementNote}>
            Deslocamento adicional: {deslocamento.cifrao} {deslocamento.inteiro},{deslocamento.centavos} já incluído nos valores abaixo.
          </Text>
        )}
      </View>

      <View style={styles.cards}>
        {PLANO_IDS.map((id) => {
          const plano = PLANO_POR_ID[id]
          const totaisPlano = props.totais[PLANO_TOTAL_KEY[id]]
          const isDestaque = plano.badge === 'RECOMENDADO'
          const cardStyle = isDestaque ? styles.cardDestaque : styles.card
          const totalPix = pdfFormatBRL(totaisPlano.totalAvista)
          const parcela = pdfFormatBRL(totaisPlano.parcela10x)
          const features = isDestaque ? plano.inclusos.slice(0, 4) : plano.inclusos
          const destaqueItems = plano.destaquesPremium ?? []

          return (
            <View key={plano.id} style={cardStyle}>
              <View style={styles.cardBody}>
                <Text style={styles.cardNumber}>Plano {plano.numero}</Text>
                <Text style={styles.cardNome}>{plano.nome}</Text>
                <Text style={styles.cardTagline}>{plano.tagline}</Text>

                <View style={styles.cardPrice}>
                  <Text style={styles.cardCifrao}>{totalPix.cifrao}</Text>
                  <Text style={styles.cardInteiro}>{totalPix.inteiro}</Text>
                  <Text style={styles.cardCentavos}>,{totalPix.centavos}</Text>
                </View>
                <Text style={styles.cardPixLabel}>À vista, com {pctDesconto}% de desconto</Text>
                <Text style={styles.cardParcela}>
                  ou {numParcelas}x de {parcela.cifrao} {parcela.inteiro},{parcela.centavos}
                </Text>

                <View style={styles.cardDivider} />

                {features.map((item) => (
                  <View key={item} style={styles.cardFeature}>
                    <Text style={styles.cardFeatureDot}>•</Text>
                    <Text style={styles.cardFeatureText}>{item}</Text>
                  </View>
                ))}

                {isDestaque && destaqueItems.length > 0 && (
                  <View style={styles.destaqueBox}>
                    <Text style={styles.destaqueKicker}>O que muda no Premium</Text>
                    {destaqueItems.map((d) => (
                      <View key={d.titulo} style={styles.destaqueItem}>
                        <Text style={styles.destaqueTitulo}>{d.titulo}</Text>
                        <Text style={styles.destaqueCorpo}>{d.corpo}</Text>
                      </View>
                    ))}
                  </View>
                )}

                <Text style={styles.cardDuration}>{plano.duracao}</Text>
              </View>
            </View>
          )
        })}
      </View>

    </Page>
  )
}
