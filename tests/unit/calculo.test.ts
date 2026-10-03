import { describe, it, expect } from 'vitest'
import {
  calcularAdicionais,
  calcularConvidados,
  calcularPizzasSugeridas,
  calcularSubtotal,
  calcularTotais,
  dataValidade,
  validarDeslocamento,
} from '@/utils/calculo'
import type { Adicional, Convidado, Pagamento, PlanoId } from '@/types/orcamento'

const semAdicional: Adicional = { entrada: false, salgadosExtras: 0 }

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

describe('calcularAdicionais', () => {
  it('zero sem opcionais', () => {
    expect(calcularAdicionais(semAdicional)).toBe(0)
  })

  it('entrada = 350', () => {
    expect(calcularAdicionais({ entrada: true, salgadosExtras: 0 })).toBe(350)
  })

  it('salgados extras', () => {
    expect(calcularAdicionais({ entrada: false, salgadosExtras: 2 })).toBe(150)
  })

  it('combina entrada + extras', () => {
    expect(calcularAdicionais({ entrada: true, salgadosExtras: 2 })).toBe(500)
  })

  it('ignora extras negativos', () => {
    expect(calcularAdicionais({ entrada: false, salgadosExtras: -3 })).toBe(0)
  })
})

describe('calcularSubtotal — Premium', () => {
  const plano: PlanoId = 'premium'

  it('25 adultos parcelado = 2940', () => {
    const r = calcularSubtotal(plano, { adultos: 25, criancas0a4: 0, criancas5a9: 0 })
    expect(r.subtotal).toBe(2940)
    expect(r.unidades).toBe(25)
    expect(r.tipoUnidade).toBe('pessoas')
  })
})

describe('calcularSubtotal — Livre c/ bebida', () => {
  it('25 adultos = 1650', () => {
    const r = calcularSubtotal('livre-bebida', {
      adultos: 25,
      criancas0a4: 0,
      criancas5a9: 0,
    })
    expect(r.subtotal).toBe(1650)
  })
})

describe('calcularSubtotal — Por unidade', () => {
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
  const pix: Pagamento = 'pix'

  it('Premium 25 adultos, sem adicionais, pix', () => {
    const t = calcularTotais(
      'premium',
      { adultos: 25, criancas0a4: 0, criancas5a9: 0 },
      semAdicional,
      pix,
    )
    expect(t.total).toBe(2940)
    expect(t.totalParcelado).toBe(2940)
    expect(t.totalAvista).toBe(2499)
    expect(t.parcela10x).toBe(294)
  })

  it('Livre c/ bebida 25 adultos com entrada e 2 extras, pix', () => {
    const t = calcularTotais(
      'livre-bebida',
      { adultos: 25, criancas0a4: 0, criancas5a9: 0 },
      { entrada: true, salgadosExtras: 2 },
      pix,
    )
    expect(t.subtotal).toBe(1650)
    expect(t.adicionais).toBe(500)
    expect(t.total).toBe(2150)
    expect(t.totalAvista).toBe(1827.5)
  })

  it('20 adultos + 10 crianças 5-9 no Premium', () => {
    const t = calcularTotais(
      'premium',
      { adultos: 20, criancas0a4: 0, criancas5a9: 10 },
      semAdicional,
      pix,
    )
    expect(t.adultosEquivalentes).toBe(25)
    expect(t.subtotal).toBe(2940)
  })

  it('Por unidade: 15 pizzas parcelado, à vista 1000', () => {
    const t = calcularTotais(
      'unidade',
      { adultos: 25, criancas0a4: 0, criancas5a9: 0 },
      semAdicional,
      'parcelado',
    )
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

describe('dataValidade', () => {
  it('soma 48h', () => {
    const antes = '2026-10-03T12:00:00.000Z'
    const depois = dataValidade(antes, 48)
    expect(new Date(depois).getTime() - new Date(antes).getTime()).toBe(48 * 60 * 60 * 1000)
  })
})
