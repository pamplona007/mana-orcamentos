import { describe, it, expect } from 'vitest'
import {
  calcularConvidados,
  calcularPizzasSugeridas,
  calcularSubtotal,
  calcularTotais,
  dataValidade,
  validarDeslocamento,
} from '@/utils/calculo'
import type { PlanoId } from '@/types/orcamento'
import type { State } from '@/hooks/useOrcamento'

const convidadosPadrao = { adultos: 25, criancas0a4: 0, criancas5a9: 0 }

function makeState(overrides: Partial<State> = {}): State {
  return {
    cliente: { nome: '', whatsapp: '' },
    evento: { data: '', cidadeBairro: '', observacoes: '' },
    convidados: convidadosPadrao,
    pagamento: 'parcelado',
    desconto: { tipo: 'nenhum', valor: 0 },
    deslocamento: { ativo: false, valor: 150 },
    ...overrides,
  }
}

describe('calcularConvidados', () => {
  it('soma apenas adultos', () => {
    expect(calcularConvidados({ adultos: 25, criancas0a4: 0, criancas5a9: 0 })).toBe(25)
  })

  it('soma adultos + crianças 5-9 com meia', () => {
    expect(calcularConvidados({ adultos: 20, criancas0a4: 0, criancas5a9: 10 })).toBe(25)
  })

  it('crianças 0-4 não contam', () => {
    expect(calcularConvidados({ adultos: 20, criancas0a4: 5, criancas5a9: 0 })).toBe(20)
  })

  it('combina todas as faixas', () => {
    expect(calcularConvidados({ adultos: 20, criancas0a4: 5, criancas5a9: 10 })).toBe(25)
  })

  it('ignora valores negativos', () => {
    expect(calcularConvidados({ adultos: -5, criancas0a4: 0, criancas5a9: 0 })).toBe(0)
  })
})

describe('calcularPizzasSugeridas', () => {
  it('arredonda para cima (25 adultos = 15 pizzas)', () => {
    expect(calcularPizzasSugeridas({ adultos: 25, criancas0a4: 0, criancas5a9: 0 })).toBe(15)
  })

  it('considera crianças 5-9 com meia', () => {
    expect(calcularPizzasSugeridas({ adultos: 20, criancas0a4: 0, criancas5a9: 10 })).toBe(15)
  })
})

describe('calcularSubtotal: Premium', () => {
  const plano: PlanoId = 'premium'

  it('25 adultos parcelado = 2940', () => {
    const r = calcularSubtotal(plano, { adultos: 25, criancas0a4: 0, criancas5a9: 0 })
    expect(r.subtotal).toBe(2940)
    expect(r.unidades).toBe(25)
    expect(r.tipoUnidade).toBe('pessoas')
  })
})

describe('calcularSubtotal: Livre c/ bebida', () => {
  it('25 adultos = 1650', () => {
    const r = calcularSubtotal('livre-bebida', {
      adultos: 25,
      criancas0a4: 0,
      criancas5a9: 0,
    })
    expect(r.subtotal).toBe(1650)
  })
})

describe('calcularSubtotal: Por unidade', () => {
  it('25 adultos = 15 pizzas = 1177.50', () => {
    const r = calcularSubtotal('unidade', {
      adultos: 25,
      criancas0a4: 0,
      criancas5a9: 0,
    })
    expect(r.subtotal).toBe(1177.5)
    expect(r.unidades).toBe(15)
    expect(r.tipoUnidade).toBe('pizzas')
  })
})

describe('calcularTotais', () => {
  it('Premium 25 adultos, sem deslocamento', () => {
    const t = calcularTotais('premium', makeState())
    expect(t.total).toBe(2940)
    expect(t.totalParcelado).toBe(2940)
    expect(t.totalAvista).toBe(2499)
    expect(t.parcela10x).toBe(294)
  })

  it('Livre c/ bebida não inclui adicionais opcionais', () => {
    const t = calcularTotais('livre-bebida', makeState())
    expect(t.subtotal).toBe(1650)
    expect(t.total).toBe(1650)
    expect(t.totalAvista).toBe(1402.5)
  })

  it('soma o deslocamento ao total do plano', () => {
    const t = calcularTotais(
      'premium',
      makeState({ deslocamento: { ativo: true, valor: 150 } }),
    )
    expect(t.deslocamento).toBe(150)
    expect(t.total).toBe(3090)
    expect(t.totalAvista).toBe(2626.5)
  })

  it('20 adultos + 10 crianças 5-9 no Premium', () => {
    const t = calcularTotais('premium', makeState({
      convidados: { adultos: 20, criancas0a4: 0, criancas5a9: 10 },
    }))
    expect(t.adultosEquivalentes).toBe(25)
    expect(t.subtotal).toBe(2940)
  })

  it('Por unidade: 15 pizzas parcelado', () => {
    const t = calcularTotais('unidade', makeState())
    expect(t.pizzas).toBe(15)
    expect(t.subtotal).toBe(1177.5)
    expect(t.totalParcelado).toBe(1177.5)
  })
})

describe('validarDeslocamento', () => {
  it('vazio retorna true (sem info ainda)', () => {
    expect(validarDeslocamento('')).toBe(true)
  })

  it('Fortaleza capital dentro da área', () => {
    expect(validarDeslocamento('Fortaleza - Aldeota')).toBe(true)
    expect(validarDeslocamento('Aldeota, Fortaleza')).toBe(true)
  })

  it('Caucaia dentro da área', () => {
    expect(validarDeslocamento('Caucaia')).toBe(true)
  })

  it('Local fora da área', () => {
    expect(validarDeslocamento('Aracaju')).toBe(false)
  })
})

describe('calcularDesconto (via calcularTotais)', () => {
  it('não aplica desconto quando tipo é "nenhum"', () => {
    const t = calcularTotais(
      'premium',
      makeState({ desconto: { tipo: 'nenhum', valor: 0 } }),
    )
    expect(t.descontoAplicado).toBe(0)
    expect(t.total).toBe(2940)
  })

  it('aplica desconto percentual sobre o subtotal + deslocamento', () => {
    const t = calcularTotais(
      'premium',
      makeState({
        desconto: { tipo: 'percentual', valor: 5 },
        deslocamento: { ativo: true, valor: 150 },
      }),
    )
    expect(t.descontoAplicado).toBe(154.5) // 5% de 3090
    expect(t.total).toBe(2935.5)
  })

  it('aplica desconto absoluto limitado ao total', () => {
    const t = calcularTotais(
      'premium',
      makeState({ desconto: { tipo: 'absoluto', valor: 500 } }),
    )
    expect(t.descontoAplicado).toBe(500)
    expect(t.total).toBe(2440)
  })

  it('desconto absoluto maior que o total zera o total', () => {
    const t = calcularTotais(
      'livre-bebida',
      makeState({
        convidados: { adultos: 1, criancas0a4: 0, criancas5a9: 0 },
        desconto: { tipo: 'absoluto', valor: 9999 },
      }),
    )
    expect(t.descontoAplicado).toBe(66) // limitado ao subtotal
    expect(t.total).toBe(0)
  })
})

describe('dataValidade', () => {
  it('soma 48h', () => {
    const antes = '2026-10-03T12:00:00.000Z'
    const depois = dataValidade(antes, 48)
    expect(new Date(depois).getTime() - new Date(antes).getTime()).toBe(48 * 60 * 60 * 1000)
  })
})
