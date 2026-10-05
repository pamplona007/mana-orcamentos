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

export type Config = {
  empresa: ConfigEmpresa
  validade: ConfigValidade
  editor: ConfigEditor
  whatsapp: ConfigWhatsApp
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
}

