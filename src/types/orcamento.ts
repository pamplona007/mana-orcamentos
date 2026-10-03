export type PlanoId = 'premium' | 'livre-bebida' | 'livre-sem-bebida' | 'unidade';

export type Convidado = {
  adultos: number;
  criancas0a4: number;
  criancas5a9: number;
};

export type Evento = {
  data: string;
  cidadeBairro: string;
  observacoes: string;
};

export type Pagamento = 'pix' | 'parcelado';

export type Desconto = {
  tipo: 'nenhum' | 'percentual' | 'absoluto'
  valor: number
}

export type Deslocamento = {
  ativo: boolean;
  valor: number;
};

export type Cliente = {
  nome: string;
  whatsapp: string;
};

export type Orcamento = {
  id: string;
  criadoEm: string;
  cliente: Cliente;
  evento: Evento;
  convidados: Convidado;
  deslocamento: Deslocamento;
  pagamento: Pagamento;
  desconto: Desconto;
};

export type Totais = {
  adultosEquivalentes: number;
  pizzas: number;
  subtotal: number;
  deslocamento: number;
  descontoAplicado: number;
  total: number;
  totalParcelado: number;
  totalAvista: number;
  parcela10x: number;
  precoPessoaUsado: number;
};

export type TotaisPorPlano = {
  premium: Totais;
  livreBebida: Totais;
  livreSemBebida: Totais;
  unidade: Totais;
};

export type MensagemWhatsApp = {
  texto: string;
  url: string;
};
