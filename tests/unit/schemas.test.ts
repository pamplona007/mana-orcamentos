import { describe, expect, it } from 'vitest'
import {
  clienteSchema,
  convidadosSchema,
  descontoSchema,
  deslocamentoSchema,
  editorSchema,
  eventoSchema,
  MENSAGEM_NUMERO,
  pagamentoSchema,
} from '@/schemas/editorSchema'
import {
  adicionaisSchema,
  configSchema,
  configValida,
  empresaSchema,
  precosSchema,
  sanitizarConfig,
  validadeSchema,
} from '@/schemas/configSchema'
import { CONFIG_DEFAULT } from '@/types/config'
import type { State } from '@/types/orcamento'

const estadoValido: State = {
  cliente: { nome: 'Maria Silva', whatsapp: '(85) 99999-9999' },
  evento: { data: '2026-11-15', cidadeBairro: 'Fortaleza, Aldeota', observacoes: '' },
  convidados: { adultos: 25, criancas0a4: 1, criancas5a9: 2 },
  pagamento: 'parcelado',
  desconto: { tipo: 'percentual', valor: 10 },
  deslocamento: { ativo: true, valor: 150 },
}

describe('editorSchema', () => {
  it('aceita um estado completo e mantém os valores', () => {
    const parsed = editorSchema.parse(estadoValido)
    expect(parsed).toEqual(estadoValido)
  })

  it('aceita um estado totalmente vazio (nenhum campo é obrigatório)', () => {
    const vazio: State = {
      cliente: { nome: '', whatsapp: '' },
      evento: { data: '', cidadeBairro: '', observacoes: '' },
      convidados: { adultos: 0, criancas0a4: 0, criancas5a9: 0 },
      pagamento: 'pix',
      desconto: { tipo: 'nenhum', valor: 0 },
      deslocamento: { ativo: false, valor: 0 },
    }
    expect(editorSchema.safeParse(vazio).success).toBe(true)
  })

  it('clampa convidados entre 0 e 500 e trunca para inteiro', () => {
    const parsed = convidadosSchema.parse({
      adultos: -3,
      criancas0a4: 999,
      criancas5a9: 2.9,
    })
    expect(parsed).toEqual({ adultos: 0, criancas0a4: 500, criancas5a9: 2 })
  })

  it('rejeita convidados que não são número', () => {
    const resultado = convidadosSchema.safeParse({
      adultos: 'dez',
      criancas0a4: 0,
      criancas5a9: 0,
    })
    expect(resultado.success).toBe(false)
    if (!resultado.success) {
      expect(resultado.error.issues[0]?.message).toBe(MENSAGEM_NUMERO)
    }
  })

  it('rejeita NaN como número', () => {
    const resultado = convidadosSchema.safeParse({
      adultos: Number.NaN,
      criancas0a4: 0,
      criancas5a9: 0,
    })
    expect(resultado.success).toBe(false)
  })

  it('clampa o percentual de desconto entre 0 e 100', () => {
    expect(descontoSchema.parse({ tipo: 'percentual', valor: 150 })).toEqual({
      tipo: 'percentual',
      valor: 100,
    })
    expect(descontoSchema.parse({ tipo: 'percentual', valor: -5 })).toEqual({
      tipo: 'percentual',
      valor: 0,
    })
  })

  it('mantém desconto absoluto acima de 100 (o limite é a base do plano)', () => {
    expect(descontoSchema.parse({ tipo: 'absoluto', valor: 250 })).toEqual({
      tipo: 'absoluto',
      valor: 250,
    })
    expect(descontoSchema.parse({ tipo: 'absoluto', valor: -1 })).toEqual({
      tipo: 'absoluto',
      valor: 0,
    })
  })

  it('rejeita tipo de desconto desconhecido', () => {
    const resultado = descontoSchema.safeParse({ tipo: 'metade', valor: 10 })
    expect(resultado.success).toBe(false)
  })

  it('clampa o deslocamento negativo para zero', () => {
    const parsed = deslocamentoSchema.parse({ ativo: true, valor: -80 })
    expect(parsed.valor).toBe(0)
  })

  it('valida o formato da data do evento apenas quando preenchida', () => {
    expect(eventoSchema.safeParse({ data: '', cidadeBairro: '', observacoes: '' }).success).toBe(
      true,
    )
    expect(
      eventoSchema.safeParse({ data: '2026-11-15', cidadeBairro: '', observacoes: '' }).success,
    ).toBe(true)
    const invalida = eventoSchema.safeParse({
      data: '15/11/2026',
      cidadeBairro: '',
      observacoes: '',
    })
    expect(invalida.success).toBe(false)
    if (!invalida.success) {
      expect(invalida.error.issues[0]?.message).toBe('Informe uma data válida')
    }
  })

  it('rejeita forma de pagamento desconhecida', () => {
    expect(pagamentoSchema.safeParse('pix').success).toBe(true)
    expect(pagamentoSchema.safeParse('parcelado').success).toBe(true)
    expect(pagamentoSchema.safeParse('boleto').success).toBe(false)
  })

  it('aceita cliente com strings livres', () => {
    expect(clienteSchema.parse({ nome: '', whatsapp: '' })).toEqual({ nome: '', whatsapp: '' })
  })
})

describe('configSchema', () => {
  it('aceita o CONFIG_DEFAULT inteiro', () => {
    expect(configSchema.safeParse(CONFIG_DEFAULT).success).toBe(true)
    expect(configValida(CONFIG_DEFAULT)).toBe(true)
  })

  it('clampa a validade para pelo menos 1 hora', () => {
    expect(validadeSchema.parse({ horas: 0 })).toEqual({ horas: 1 })
    expect(validadeSchema.parse({ horas: -10 })).toEqual({ horas: 1 })
    expect(validadeSchema.parse({ horas: 48.7 })).toEqual({ horas: 48 })
  })

  it('rejeita validade que não é número', () => {
    const resultado = validadeSchema.safeParse({ horas: 'abc' })
    expect(resultado.success).toBe(false)
  })

  it('clampa os adicionais nos limites atuais', () => {
    const parsed = adicionaisSchema.parse({
      entrada: -10,
      salgadoExtra: 0,
      descontoAvista: 2,
      parcelas: 0,
      limiteKmDeslocamento: -5,
    })
    expect(parsed).toEqual({
      entrada: 0,
      salgadoExtra: 0,
      descontoAvista: 1,
      parcelas: 1,
      limiteKmDeslocamento: 0,
    })
  })

  it('clampa os preços negativos para zero', () => {
    const parsed = precosSchema.parse({
      premium: { parcelado: -1, avista: 99.9 },
      livreBebida: { parcelado: 66, avista: 55.92 },
      livreSemBebida: { parcelado: 58.8, avista: 49.92 },
      unidade: { parcelado: 78.5, avista: 66.67 },
    })
    expect(parsed.premium).toEqual({ parcelado: 0, avista: 99.9 })
  })

  it('valida e-mail apenas quando preenchido', () => {
    expect(empresaSchema.safeParse({ ...CONFIG_DEFAULT.empresa, email: '' }).success).toBe(true)
    const invalido = empresaSchema.safeParse({
      ...CONFIG_DEFAULT.empresa,
      email: 'contato',
    })
    expect(invalido.success).toBe(false)
  })

  it('rejeita config com campo de tipo errado', () => {
    const invalida = structuredClone(CONFIG_DEFAULT) as unknown as {
      validade: { horas: unknown }
    }
    invalida.validade.horas = 'abc'
    expect(configSchema.safeParse(invalida).success).toBe(false)
  })
})

describe('sanitizarConfig', () => {
  it('devolve o default para entradas que não são objeto', () => {
    expect(sanitizarConfig(null)).toEqual(CONFIG_DEFAULT)
    expect(sanitizarConfig('texto')).toEqual(CONFIG_DEFAULT)
    expect(sanitizarConfig([1, 2, 3])).toEqual(CONFIG_DEFAULT)
    expect(sanitizarConfig(undefined)).toEqual(CONFIG_DEFAULT)
  })

  it('preserva os campos válidos e completa o resto com o default', () => {
    const sanitizada = sanitizarConfig({
      empresa: { nomeFantasia: 'Pizzaria Teste' },
      validade: { horas: 12 },
      pdf: { precos: { premium: { parcelado: 200, avista: 180 } } },
    })
    expect(sanitizada.empresa.nomeFantasia).toBe('Pizzaria Teste')
    expect(sanitizada.empresa.whatsapp).toBe(CONFIG_DEFAULT.empresa.whatsapp)
    expect(sanitizada.validade.horas).toBe(12)
    expect(sanitizada.pdf.precos.premium).toEqual({ parcelado: 200, avista: 180 })
    expect(sanitizada.pdf.precos.unidade).toEqual(CONFIG_DEFAULT.pdf.precos.unidade)
  })

  it('cai para o default no campo inválido sem perder os irmãos válidos', () => {
    const sanitizada = sanitizarConfig({
      empresa: { nomeFantasia: 'Pizzaria Teste', email: 'invalido' },
      validade: { horas: 'abc' },
    })
    expect(sanitizada.empresa.nomeFantasia).toBe('Pizzaria Teste')
    expect(sanitizada.empresa.email).toBe(CONFIG_DEFAULT.empresa.email)
    expect(sanitizada.validade.horas).toBe(CONFIG_DEFAULT.validade.horas)
  })

  it('clampa os valores coercíveis em vez de descartar a seção', () => {
    const sanitizada = sanitizarConfig({
      pdf: {
        adicionais: { ...CONFIG_DEFAULT.pdf.adicionais, descontoAvista: 5, parcelas: 0 },
      },
    })
    expect(sanitizada.pdf.adicionais.descontoAvista).toBe(1)
    expect(sanitizada.pdf.adicionais.parcelas).toBe(1)
  })

  it('substitui array inválido pelo default', () => {
    const sanitizada = sanitizarConfig({
      pdf: { capa: { ...CONFIG_DEFAULT.pdf.capa, promessas: 'nada' } },
    })
    expect(sanitizada.pdf.capa.promessas).toEqual(CONFIG_DEFAULT.pdf.capa.promessas)
  })

  it('produz uma config sempre válida para o schema', () => {
    const sanitizada = sanitizarConfig({
      empresa: 'quebrada',
      validade: { horas: [] },
      editor: { convidadosPadrao: { adultos: 'muitos' } },
      whatsapp: 42,
      pdf: { precos: { premium: 'grátis' } },
    })
    expect(configSchema.safeParse(sanitizada).success).toBe(true)
  })
})
