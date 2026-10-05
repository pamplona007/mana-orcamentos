export type ConfigEmpresa = {
  nomeFantasia: string
  telefone: string
  whatsapp: string
  email: string
  instagram: string
  site: string
  endereco: string
  cnpj: string
  cidade: string
  estado: string
}

export type ConfigValidade = {
  horas: number
}

export type ConfigEditor = {
  convidadosPadrao: {
    adultos: number
    criancas0a4: number
    criancas5a9: number
  }
  pagamentoPadrao: 'pix' | 'parcelado'
  deslocamentoPadrao: {
    ativo: boolean
    valor: number
  }
}

export type ConfigWhatsApp = {
  template: string
}

export type ConfigPdfPrecos = {
  premium: { parcelado: number; avista: number }
  livreBebida: { parcelado: number; avista: number }
  livreSemBebida: { parcelado: number; avista: number }
  unidade: { parcelado: number; avista: number }
}

export type ConfigPdfAdicionais = {
  entrada: number
  salgadoExtra: number
  descontoAvista: number
  parcelas: number
  limiteKmDeslocamento: number
}

export type ConfigPdfCapa = {
  sobreKicker: string
  sobreTitulo: string
  sobreCorpo: string
  promessas: { titulo: string; corpo: string }[]
  contatoRodape: string
}

export type ConfigPdfCardapio = {
  salgadosCustomizados: string[]
  docesCustomizados: string[]
}

export type ConfigPdf = {
  precos: ConfigPdfPrecos
  adicionais: ConfigPdfAdicionais
  capa: ConfigPdfCapa
  cardapio: ConfigPdfCardapio
}

export type Config = {
  empresa: ConfigEmpresa
  validade: ConfigValidade
  editor: ConfigEditor
  whatsapp: ConfigWhatsApp
  pdf: ConfigPdf
}

export const CONFIG_DEFAULT: Config = {
  empresa: {
    nomeFantasia: 'Maná Pizzas & Eventos',
    telefone: '(85) 99280-3884',
    whatsapp: '(85) 99280-3884',
    email: '',
    instagram: '@manarodizio',
    site: 'manarodizio.com.br',
    endereco: 'Fortaleza, CE',
    cnpj: '',
    cidade: 'Fortaleza',
    estado: 'CE',
  },
  validade: {
    horas: 48,
  },
  editor: {
    convidadosPadrao: {
      adultos: 25,
      criancas0a4: 0,
      criancas5a9: 0,
    },
    pagamentoPadrao: 'parcelado',
    deslocamentoPadrao: {
      ativo: false,
      valor: 150,
    },
  },
  whatsapp: {
    template: [
      'Oi{nome},',
      '',
      'Segue o orçamento da {empresa} para o evento{deData}{emCidade}.',
      '',
      'O PDF traz os 3 planos lado a lado. Escolhe o que combina mais com o seu evento.',
      'Condição: {condicao}.',
      '',
      'Válido por {validadeHoras}h. Qualquer dúvida, me chama aqui!',
    ].join('\n'),
  },
  pdf: {
    precos: {
      premium: { parcelado: 117.6, avista: 99.9 },
      livreBebida: { parcelado: 66.0, avista: 55.92 },
      livreSemBebida: { parcelado: 58.8, avista: 49.92 },
      unidade: { parcelado: 78.5, avista: 66.67 },
    },
    adicionais: {
      entrada: 350,
      salgadoExtra: 75,
      descontoAvista: 0.15,
      parcelas: 10,
      limiteKmDeslocamento: 25,
    },
    capa: {
      sobreKicker: 'Sobre a Maná',
      sobreTitulo: 'Pizzaria napolitana de bairro',
      sobreCorpo:
        'Massa maturada por 12 horas em fermentação natural, ingredientes selecionados e o cuidado de quem entende que pizza boa começa muito antes do forno.',
      promessas: [
        {
          titulo: 'Massa maturada 12h',
          corpo: 'Fermentação natural lenta, digestiva e crocante na medida.',
        },
        {
          titulo: 'Chega 30 min antes',
          corpo: 'Tudo pronto e quente na sua casa quando o primeiro convidado chegar.',
        },
        {
          titulo: 'Cozinha limpa no final',
          corpo: 'A gente monta, serve, desmonta e deixa a cozinha como encontrou.',
        },
      ],
      contatoRodape: 'manarodizio.com.br',
    },
    cardapio: {
      salgadosCustomizados: [],
      docesCustomizados: [],
    },
  },
}
