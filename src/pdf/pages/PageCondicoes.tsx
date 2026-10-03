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
    color: PDF_COLORS.cream,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    borderBottomWidth: 0.5,
    borderBottomColor: PDF_COLORS.coal3,
    paddingBottom: 12,
    marginBottom: 54,
  },
  brand: {
    fontFamily: 'Fraunces',
    fontSize: 18,
    fontWeight: 700,
    color: PDF_COLORS.cream,
  },
  pageLabel: {
    fontFamily: 'Inter',
    fontSize: 8,
    fontWeight: 700,
    color: PDF_COLORS.ochre,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  header: {
    marginBottom: 34,
  },
  kicker: {
    fontFamily: 'Inter',
    fontSize: 9,
    fontWeight: 700,
    color: PDF_COLORS.ochre,
    textTransform: 'uppercase',
    letterSpacing: 2.5,
    marginBottom: 12,
  },
  title: {
    fontFamily: 'Fraunces',
    fontSize: 42,
    fontWeight: 500,
    color: PDF_COLORS.cream,
    letterSpacing: -0.8,
    lineHeight: 1.05,
    marginBottom: 12,
  },
  intro: {
    fontFamily: 'Fraunces',
    fontSize: 13,
    fontStyle: 'italic',
    color: PDF_COLORS.creamDim,
    lineHeight: 1.45,
    maxWidth: '82%',
  },
  reservation: {
    backgroundColor: PDF_COLORS.wine,
    borderRadius: 5,
    padding: 20,
    marginBottom: 28,
  },
  reservationKicker: {
    fontFamily: 'Inter',
    fontSize: 8,
    fontWeight: 700,
    color: PDF_COLORS.ochre,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 8,
  },
  reservationTitle: {
    fontFamily: 'Fraunces',
    fontSize: 23,
    fontWeight: 600,
    color: PDF_COLORS.cream,
    marginBottom: 18,
  },
  paymentRow: {
    flexDirection: 'row',
    gap: 20,
  },
  paymentItem: {
    flex: 1,
    borderTopWidth: 0.5,
    borderTopColor: PDF_COLORS.wineGlow,
    paddingTop: 10,
  },
  paymentNumber: {
    fontFamily: 'Fraunces',
    fontSize: 20,
    color: PDF_COLORS.ochre,
    marginBottom: 4,
  },
  paymentText: {
    fontFamily: 'Inter',
    fontSize: 9.5,
    color: PDF_COLORS.cream,
    lineHeight: 1.45,
  },
  details: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 28,
  },
  detail: {
    flex: 1,
    backgroundColor: PDF_COLORS.coal,
    borderRadius: 4,
    padding: 16,
  },
  detailKicker: {
    fontFamily: 'Inter',
    fontSize: 7.5,
    fontWeight: 700,
    color: PDF_COLORS.ochre,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  detailTitle: {
    fontFamily: 'Fraunces',
    fontSize: 17,
    fontWeight: 600,
    color: PDF_COLORS.cream,
    marginBottom: 6,
  },
  detailText: {
    fontFamily: 'Inter',
    fontSize: 9,
    color: PDF_COLORS.creamDim,
    lineHeight: 1.5,
  },
  confirmation: {
    borderTopWidth: 0.5,
    borderTopColor: PDF_COLORS.coal3,
    paddingTop: 16,
  },
  confirmationLabel: {
    fontFamily: 'Inter',
    fontSize: 8,
    fontWeight: 700,
    color: PDF_COLORS.ochre,
    textTransform: 'uppercase',
    letterSpacing: 1.8,
    marginBottom: 7,
  },
  confirmationText: {
    fontFamily: 'Fraunces',
    fontSize: 13,
    fontStyle: 'italic',
    color: PDF_COLORS.creamDim,
    lineHeight: 1.45,
  },
  footer: {
    position: 'absolute',
    bottom: 52,
    left: 48,
    right: 48,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 0.5,
    borderTopColor: PDF_COLORS.coal3,
    paddingTop: 10,
  },
  footerText: {
    fontFamily: 'Inter',
    fontSize: 7.5,
    color: PDF_COLORS.creamFaint,
    textTransform: 'uppercase',
    letterSpacing: 1.1,
  },
})

export type PageCondicoesProps = {
  orcamento: Orcamento
  totais: TotaisPorPlano
  validadeISO: string
}

export function PageCondicoes({ orcamento, validadeISO }: PageCondicoesProps) {
  const dataEvento = pdfData(orcamento.evento.data)
  const validade = pdfData(validadeISO)

  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.topBar}>
        <Text style={styles.brand}>Maná</Text>
        <Text style={styles.pageLabel}>Reserva e condições</Text>
      </View>

      <View style={styles.header}>
        <Text style={styles.kicker}>Para confirmar a data</Text>
        <Text style={styles.title}>Condições gerais</Text>
        <Text style={styles.intro}>
          Tudo certo para o evento? Estes são os próximos passos para deixar a sua data reservada.
        </Text>
      </View>

      <View style={styles.reservation}>
        <Text style={styles.reservationKicker}>Para reservar a data, precisamos de:</Text>
        <Text style={styles.reservationTitle}>Contrato e primeira condição de pagamento</Text>
        <View style={styles.paymentRow}>
          <View style={styles.paymentItem}>
            <Text style={styles.paymentNumber}>01</Text>
            <Text style={styles.paymentText}>
              Dados do contratante para confecção do contrato.
            </Text>
          </View>
          <View style={styles.paymentItem}>
            <Text style={styles.paymentNumber}>02</Text>
            <Text style={styles.paymentText}>
              Pagamento parcelado ou 30% do valor no Pix.
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.details}>
        <View style={styles.detail}>
          <Text style={styles.detailKicker}>Antes do evento</Text>
          <Text style={styles.detailTitle}>Quitação</Text>
          <Text style={styles.detailText}>
            A quitação do serviço deverá ser realizada 1 dia antes da data do evento.
          </Text>
        </View>
        <View style={styles.detail}>
          <Text style={styles.detailKicker}>Durante o evento</Text>
          <Text style={styles.detailTitle}>Horário máximo</Text>
          <Text style={styles.detailText}>
            A finalização do evento acontece até 22h. Após esse horário, o valor poderá sofrer alteração.
          </Text>
        </View>
      </View>

      <View style={styles.confirmation}>
        <Text style={styles.confirmationLabel}>Resumo do orçamento</Text>
        <Text style={styles.confirmationText}>
          Evento em {dataEvento}. Este orçamento é válido até {validade}.
        </Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Maná Pizzas & Eventos</Text>
        <Text style={styles.footerText}>Condições válidas com a reserva confirmada</Text>
      </View>
    </Page>
  )
}
