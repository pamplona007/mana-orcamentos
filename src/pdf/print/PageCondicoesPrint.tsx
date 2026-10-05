import { Page, View, Text, StyleSheet } from '@react-pdf/renderer'
import { pdfData } from '../utils'
import type { Orcamento, TotaisPorPlano } from '../../types/orcamento'
import type { Config } from '../../types/config'

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 48,
    paddingVertical: 52,
    fontFamily: 'Inter',
    color: '#000000',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    borderBottomWidth: 0.5,
    borderBottomColor: '#000000',
    paddingBottom: 12,
    marginBottom: 54,
  },
  brand: {
    fontFamily: 'Fraunces',
    fontSize: 18,
    fontWeight: 700,
    color: '#000000',
  },
  pageLabel: {
    fontFamily: 'Inter',
    fontSize: 8,
    fontWeight: 700,
    color: '#000000',
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
    color: '#000000',
    textTransform: 'uppercase',
    letterSpacing: 2.5,
    marginBottom: 12,
  },
  title: {
    fontFamily: 'Fraunces',
    fontSize: 42,
    fontWeight: 500,
    color: '#000000',
    letterSpacing: -0.8,
    lineHeight: 1.05,
    marginBottom: 12,
  },
  intro: {
    fontFamily: 'Fraunces',
    fontSize: 13,
    fontStyle: 'italic',
    color: '#333333',
    lineHeight: 1.45,
    maxWidth: '82%',
  },
  reservation: {
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 5,
    padding: 20,
    marginBottom: 28,
  },
  reservationKicker: {
    fontFamily: 'Inter',
    fontSize: 8,
    fontWeight: 700,
    color: '#000000',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 8,
  },
  reservationTitle: {
    fontFamily: 'Fraunces',
    fontSize: 23,
    fontWeight: 600,
    color: '#000000',
    marginBottom: 18,
  },
  paymentRow: {
    flexDirection: 'row',
    gap: 20,
  },
  paymentItem: {
    flex: 1,
    borderTopWidth: 0.5,
    borderTopColor: '#000000',
    paddingTop: 10,
  },
  paymentNumber: {
    fontFamily: 'Fraunces',
    fontSize: 20,
    color: '#000000',
    fontWeight: 700,
    marginBottom: 4,
  },
  paymentText: {
    fontFamily: 'Inter',
    fontSize: 9.5,
    color: '#000000',
    lineHeight: 1.45,
  },
  details: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 28,
  },
  detail: {
    flex: 1,
    borderWidth: 0.5,
    borderColor: '#000000',
    borderRadius: 4,
    padding: 16,
  },
  detailKicker: {
    fontFamily: 'Inter',
    fontSize: 7.5,
    fontWeight: 700,
    color: '#000000',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  detailTitle: {
    fontFamily: 'Fraunces',
    fontSize: 17,
    fontWeight: 600,
    color: '#000000',
    marginBottom: 6,
  },
  detailText: {
    fontFamily: 'Inter',
    fontSize: 9,
    color: '#333333',
    lineHeight: 1.5,
  },
  confirmation: {
    borderTopWidth: 0.5,
    borderTopColor: '#000000',
    paddingTop: 16,
  },
  confirmationLabel: {
    fontFamily: 'Inter',
    fontSize: 8,
    fontWeight: 700,
    color: '#000000',
    textTransform: 'uppercase',
    letterSpacing: 1.8,
    marginBottom: 7,
  },
  confirmationText: {
    fontFamily: 'Fraunces',
    fontSize: 13,
    fontStyle: 'italic',
    color: '#333333',
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
    borderTopColor: '#000000',
    paddingTop: 10,
  },
  footerText: {
    fontFamily: 'Inter',
    fontSize: 7.5,
    color: '#666666',
    textTransform: 'uppercase',
    letterSpacing: 1.1,
  },
})

export type PageCondicoesPrintProps = {
  orcamento: Orcamento
  totais: TotaisPorPlano
  validadeISO: string
  config: Config
}

export function PageCondicoesPrint({ orcamento, validadeISO, config }: PageCondicoesPrintProps) {
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
        <Text style={styles.footerText}>
          WhatsApp: {config.empresa.whatsapp} · Válido com reserva confirmada
        </Text>
      </View>
    </Page>
  )
}
