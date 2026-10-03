import { View, Text, StyleSheet } from '@react-pdf/renderer'
import { PDF_COLORS } from '../styles'
import { pdfData } from '../utils'
import { BATE_LIMITE_HORAS, VALIDADE_HORAS } from '@/data/plans'

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28,
  },
  brand: {
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
    fontSize: 32,
    color: PDF_COLORS.cream,
    fontWeight: 500,
    letterSpacing: -0.5,
    marginBottom: 24,
  },
  condicoes: {
    gap: 14,
    marginBottom: 24,
  },
  condicao: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  numero: {
    fontFamily: 'Fraunces',
    fontSize: 18,
    color: PDF_COLORS.wine,
    fontWeight: 500,
    width: 28,
  },
  condicaoBody: {
    flex: 1,
  },
  condicaoTitulo: {
    fontFamily: 'Fraunces',
    fontSize: 13,
    color: PDF_COLORS.cream,
    fontWeight: 500,
    marginBottom: 2,
  },
  condicaoTexto: {
    fontFamily: 'Inter',
    fontSize: 9.5,
    color: PDF_COLORS.creamDim,
    lineHeight: 1.5,
  },
  boxReserva: {
    marginTop: 24,
    padding: 16,
    backgroundColor: PDF_COLORS.espresso,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: PDF_COLORS.coal3,
  },
  boxReservaLabel: {
    fontFamily: 'Inter',
    fontSize: 8,
    color: PDF_COLORS.ochre,
    letterSpacing: 2,
    textTransform: 'uppercase',
    fontWeight: 700,
    marginBottom: 6,
  },
  boxReservaTexto: {
    fontFamily: 'Fraunces',
    fontSize: 16,
    color: PDF_COLORS.cream,
    fontStyle: 'italic',
    lineHeight: 1.3,
  },
  assinatura: {
    marginTop: 28,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: PDF_COLORS.coal3,
  },
  assinaturaLabel: {
    fontFamily: 'Inter',
    fontSize: 8,
    color: PDF_COLORS.creamFaint,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  assinaturaLinha: {
    fontFamily: 'Fraunces',
    fontSize: 18,
    color: PDF_COLORS.cream,
    fontStyle: 'italic',
    borderBottomWidth: 0.5,
    borderBottomColor: PDF_COLORS.creamFaint,
    paddingBottom: 4,
    marginBottom: 4,
  },
  assinaturaData: {
    fontFamily: 'Inter',
    fontSize: 9,
    color: PDF_COLORS.creamFaint,
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
  validadeISO: string
  clienteNome: string
}

export function PageCondicoes({ validadeISO, clienteNome }: Props) {
  const validadeFmt = pdfData(validadeISO)
  return (
    <View style={{ flex: 1, backgroundColor: PDF_COLORS.ink, padding: 48 }}>
      <View style={styles.header}>
        <Text style={styles.brand}>Maná Pizzas</Text>
        <Text style={styles.validade}>Rodízio em casa</Text>
      </View>

      <Text style={styles.kicker}>Condições comerciais</Text>
      <Text style={styles.title}>Para fechar o evento</Text>

      <View style={styles.condicoes}>
        <View style={styles.condicao}>
          <Text style={styles.numero}>01</Text>
          <View style={styles.condicaoBody}>
            <Text style={styles.condicaoTitulo}>Reserva da data</Text>
            <Text style={styles.condicaoTexto}>
              Para reservar a data do seu evento solicitamos os dados do contratante para
              confecção do contrato e 30% do valor no Pix (ou pagamento parcelado conforme
              combinado).
            </Text>
          </View>
        </View>

        <View style={styles.condicao}>
          <Text style={styles.numero}>02</Text>
          <View style={styles.condicaoBody}>
            <Text style={styles.condicaoTitulo}>Quitação</Text>
            <Text style={styles.condicaoTexto}>
              A quitação total do serviço deve ser realizada 1 dia antes da data do evento,
              via Pix ou dinheiro para garantir o valor com 15% de desconto, ou em até 10x
              no cartão.
            </Text>
          </View>
        </View>

        <View style={styles.condicao}>
          <Text style={styles.numero}>03</Text>
          <View style={styles.condicaoBody}>
            <Text style={styles.condicaoTitulo}>Horário do evento</Text>
            <Text style={styles.condicaoTexto}>
              O horário máximo para a finalização do evento é {BATE_LIMITE_HORAS}h. Após esse
              horário o valor poderá sofrer alteração pela hora extra da equipe.
            </Text>
          </View>
        </View>

        <View style={styles.condicao}>
          <Text style={styles.numero}>04</Text>
          <View style={styles.condicaoBody}>
            <Text style={styles.condicaoTitulo}>Validade</Text>
            <Text style={styles.condicaoTexto}>
              Este orçamento é válido por {VALIDADE_HORAS} horas ({validadeFmt}). Após esse
              período os valores podem ser reajustados.
            </Text>
          </View>
        </View>

        <View style={styles.condicao}>
          <Text style={styles.numero}>05</Text>
          <View style={styles.condicaoBody}>
            <Text style={styles.condicaoTitulo}>Deslocamento</Text>
            <Text style={styles.condicaoTexto}>
              O deslocamento está incluso até 25 km de raio. Para distâncias maiores
              combinamos o valor do deslocamento adicional.
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.boxReserva}>
        <Text style={styles.boxReservaLabel}>Próximo passo</Text>
        <Text style={styles.boxReservaTexto}>
          Confirme o evento pelo WhatsApp respondendo "fechado" e envie seus dados para o contrato.
        </Text>
      </View>

      <View style={styles.assinatura}>
        <Text style={styles.assinaturaLabel}>Contratante</Text>
        <Text style={styles.assinaturaLinha}>{clienteNome || '___________________________'}</Text>
        <Text style={styles.assinaturaData}>Data: ___/___/______</Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>manarodizio · @manarodizio</Text>
        <Text style={styles.footerText}>Página 3 de 3</Text>
      </View>
    </View>
  )
}
