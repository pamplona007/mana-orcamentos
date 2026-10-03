import { View, Text, StyleSheet } from '@react-pdf/renderer'
import { PDF_COLORS } from '../styles'
import type { Plano } from '@/data/plans'
import type { Adicional, Convidado } from '@/types/orcamento'
import { ADICIONAL_ENTRADA, ADICIONAL_SALGADO_EXTRA } from '@/data/plans'
import { formatBRL } from '@/utils/money'

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
    marginBottom: 4,
  },
  sub: {
    fontFamily: 'Fraunces',
    fontSize: 14,
    fontStyle: 'italic',
    color: PDF_COLORS.creamDim,
    marginBottom: 24,
  },
  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontFamily: 'Inter',
    fontSize: 8,
    color: PDF_COLORS.ochre,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    fontWeight: 700,
    marginBottom: 8,
  },
  incluso: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginBottom: 5,
  },
  check: {
    fontFamily: 'Inter',
    fontSize: 9,
    color: PDF_COLORS.ochre,
    fontWeight: 700,
    marginTop: 0.5,
  },
  inclusoTexto: {
    fontFamily: 'Inter',
    fontSize: 9.5,
    color: PDF_COLORS.cream,
    lineHeight: 1.4,
    flex: 1,
  },
  sabor: {
    fontFamily: 'Fraunces',
    fontSize: 11,
    color: PDF_COLORS.cream,
    fontStyle: 'italic',
    marginBottom: 3,
  },
  observacoes: {
    fontFamily: 'Inter',
    fontSize: 9.5,
    color: PDF_COLORS.creamDim,
    lineHeight: 1.5,
    fontStyle: 'italic',
  },
  bonus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 8,
  },
  bonusLabel: {
    fontFamily: 'Inter',
    fontSize: 7.5,
    color: PDF_COLORS.creamFaint,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  bonusTexto: {
    fontFamily: 'Inter',
    fontSize: 9.5,
    color: PDF_COLORS.ochre,
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
  plano: Plano
  adicionais: Adicional
  convidados: Convidado
  observacoes: string
}

export function PageDetalhes({ plano, adicionais, convidados, observacoes }: Props) {
  return (
    <View style={{ flex: 1, backgroundColor: PDF_COLORS.ink, padding: 48 }}>
      <View style={styles.header}>
        <Text style={styles.brand}>Maná Pizzas</Text>
        <Text style={styles.validade}>Rodízio em casa</Text>
      </View>

      <Text style={styles.kicker}>Detalhes do plano</Text>
      <Text style={styles.title}>{plano.nome}</Text>
      <Text style={styles.sub}>{plano.tagline}</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Itens inclusos</Text>
        {plano.inclusos.map((item) => (
          <View key={item} style={styles.incluso}>
            <Text style={styles.check}>✓</Text>
            <Text style={styles.inclusoTexto}>{item}</Text>
          </View>
        ))}
      </View>

      {plano.saboresPremium && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sabores premium disponíveis</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {plano.saboresPremium.map((s) => (
              <Text key={s} style={[styles.sabor, { width: '48%' }]}>
                · {s}
              </Text>
            ))}
          </View>
        </View>
      )}

      {(adicionais.entrada || adicionais.salgadosExtras > 0) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Adicionais contratados</Text>
          {adicionais.entrada && (
            <View style={styles.incluso}>
              <Text style={styles.check}>+</Text>
              <Text style={styles.inclusoTexto}>
                Entrada de salgados e batata frita — 2 centos de salgados + 2 kg de batata ·{' '}
                {formatBRL(ADICIONAL_ENTRADA)}
              </Text>
            </View>
          )}
          {adicionais.salgadosExtras > 0 && (
            <View style={styles.incluso}>
              <Text style={styles.check}>+</Text>
              <Text style={styles.inclusoTexto}>
                {adicionais.salgadosExtras} cento(s) de salgados adicional ·{' '}
                {formatBRL(adicionais.salgadosExtras * ADICIONAL_SALGADO_EXTRA)}
              </Text>
            </View>
          )}
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Composição dos convidados</Text>
        <Text style={styles.inclusoTexto}>
          {convidados.adultos} adultos
          {convidados.criancas0a4 > 0 && ` · ${convidados.criancas0a4} crianças 0-4 anos (não contam)`}
          {convidados.criancas5a9 > 0 && ` · ${convidados.criancas5a9} crianças 5-9 anos (meia entrada)`}
        </Text>
      </View>

      {observacoes.trim() && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Observações</Text>
          <Text style={styles.observacoes}>{observacoes}</Text>
        </View>
      )}

      {plano.bonus.length > 0 && (
        <View style={[styles.section, styles.bonus]}>
          <Text style={styles.bonusLabel}>Bônus</Text>
          <Text style={styles.bonusTexto}>{plano.bonus.join(' · ')}</Text>
        </View>
      )}

      <View style={styles.footer}>
        <Text style={styles.footerText}>manarodizio · @manarodizio</Text>
        <Text style={styles.footerText}>Página 3 de 4</Text>
      </View>
    </View>
  )
}
