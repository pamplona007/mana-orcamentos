import { describe, it, expect } from 'vitest'
import {
  applyDescontoAvista,
  formatBRL,
  formatBRLCompact,
  formatCentavos,
  parseBRL,
  roundParcela,
} from '@/utils/money'

const norm = (s: string) => s.replace(/\u00a0/g, ' ')

describe('formatBRL', () => {
  it('formata valores inteiros com centavos zero', () => {
    expect(norm(formatBRL(100))).toBe('R$ 100,00')
  })

  it('formata valores com centavos', () => {
    expect(norm(formatBRL(2497.5))).toBe('R$ 2.497,50')
  })

  it('formata zero', () => {
    expect(norm(formatBRL(0))).toBe('R$ 0,00')
  })

  it('formata valores grandes', () => {
    expect(norm(formatBRL(1234567.89))).toBe('R$ 1.234.567,89')
  })
})

describe('formatBRLCompact', () => {
  it('omite o prefixo R$', () => {
    expect(formatBRLCompact(2497.5)).toBe('2.497,50')
  })
})

describe('formatCentavos', () => {
  it('formata parte inteira e decimal sem pontuação de milhar', () => {
    expect(formatCentavos(2497.5)).toBe('2497,50')
  })
})

describe('parseBRL', () => {
  it('parse formato completo', () => {
    expect(parseBRL('R$ 2.497,50')).toBe(2497.5)
  })

  it('parse formato simples', () => {
    expect(parseBRL('2497,50')).toBe(2497.5)
  })

  it('retorna 0 para string vazia', () => {
    expect(parseBRL('')).toBe(0)
  })

  it('retorna 0 para string inválida', () => {
    expect(parseBRL('abc')).toBe(0)
  })
})

describe('roundParcela', () => {
  it('arredonda para 2 casas decimais', () => {
    expect(roundParcela(2940, 10)).toBe(294)
  })

  it('arredonda metade para cima (banker\'s rounding não usado)', () => {
    expect(roundParcela(1398, 10)).toBe(139.8)
  })
})

describe('applyDescontoAvista', () => {
  it('aplica 15% de desconto', () => {
    expect(applyDescontoAvista(2940, 0.15)).toBe(2499)
  })

  it('retorna o mesmo valor com desconto zero', () => {
    expect(applyDescontoAvista(1000, 0)).toBe(1000)
  })
})
