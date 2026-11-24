# Glossário de domínio — Maná Orçamentos

Vocabulário pt-BR usado no app, no PDF e neste repositório. Serve para quem nunca viu o
app entender rapidamente o que cada termo significa **neste produto** (não é um dicionário
genérico de pizzaria).

Os termos estão em ordem alfabética dentro de cada grupo. Onde existe um campo, uma chave
de config ou um trecho de código correspondente, ele é citado.

---

## 1. Pessoas e convidados

| Termo | Significado no app |
|---|---|
| **Adulto** | Pessoa de 10 anos ou mais; paga integralmente. O Editor mostra o texto "10+ anos contam como adulto" (`GuestBreakdown`). Campo: `convidados.adultos`. |
| **Adulto equivalente** | Número que entra na conta depois de aplicar os multiplicadores infantis. Não é o número de convidados. Ver "Equivalência de convidados" em `REGRAS-DE-NEGOCIO.md §2`. |
| **Criança 0–4** | Criança de 0 a 4 anos; **grátis** (multiplicador 0). Campo: `convidados.criancas0a4`. |
| **Criança 5–9** | Criança de 5 a 9 anos; paga **meia entrada** (multiplicador 0,5). Campo: `convidados.criancas5a9`. |
| **Convidados** | Bloco do orçamento com as três faixas etárias acima. No resumo da tela e da capa ele mostra o **total bruto de pessoas** (adultos + crianças), não o equivalente — por isso um orçamento pode dizer "30 pessoas" e cobrar por 25. |
| **Pessoa bruta** | Expressão usada neste documento para diferenciar o total simples (`adultos + crianças`) do "adulto equivalente". Aparece em divergências de PDF. |
| **Cliente** | Quem contrata o evento. No app, só `nome` e `whatsapp` (`Cliente`). Não há cadastro nem login. |
| **Contratante** | Termo do PDF de condições; é o cliente que assina o contrato. Equivale a "cliente". |
| **Atendente** | Usuário primário do app: funcionário da Maná no balcão, no celular ou desktop, que monta o orçamento e envia o PDF. Não é desenvolvedor nem designer. |

## 2. O orçamento

| Termo | Significado no app |
|---|---|
| **Orçamento** | Documento comercial de um cliente para um evento: dados do cliente, data/local, convidados, deslocamento, desconto, pagamento e os totais dos 4 planos. Saída final = PDF + mensagem de WhatsApp. Tipo: `Orcamento`. |
| **Orçamento salvo** | Orçamento arquivado no Histórico, **com os totais congelados** no momento em que foi salvo. Tipo: `OrcamentoSalvo` (`Orcamento & { totais }`). |
| **Rascunho** | Status exibido no Histórico para orçamentos criados nos últimos **5 minutos**. Não tem relação com a validade nem com estar salvo. Ver `REGRAS-DE-NEGOCIO.md §20`. |
| **Válido** | Status do Histórico para orçamento ainda dentro da validade (`criadoEm + validade.horas`). |
| **Expirado** | Status do Histórico para orçamento fora da validade. O orçamento continua no histórico; só muda o rótulo. |
| **Validade** | Prazo em horas durante o qual o orçamento vale (padrão 48h). Configurável em Configurações. É calculada de formas diferentes no PDF e no Histórico — ver `REGRAS-DE-NEGOCIO.md §12`. |
| **Evento** | A festa/ocasião do cliente: `data`, `cidadeBairro` e `observacoes` (ex.: restrições alimentares). Não há horário nem número de convidados mínimo. |
| **Duplicar** | Criar uma cópia de um orçamento salvo, com novo `id`, nova data de criação e sufixo "(cópia)" no nome do cliente. |
| **Histórico** | Tela que lista os orçamentos salvos na máquina, agrupados por mês, com busca, abrir, reenviar no WhatsApp, duplicar e excluir. |

## 3. Planos e serviço

| Termo | Significado no app |
|---|---|
| **Plano** | Uma das 4 formas de servir/pagar o evento. `PlanoId = 'premium' \| 'livre-bebida' \| 'livre-sem-bebida' \| 'unidade'`. |
| **Premium** | Plano 1 (`premium`), o principal/recomendado. Inclui garçom para pizzas e bebidas, 1 pizzaiolo dedicado, 8 sabores premium com muçarela de búfala. Badge "RECOMENDADO". |
| **Rodízio Livre** | Plano 2 (`livre-bebida`). Rodízio com bebidas liberadas (refrigerante, suco, água). |
| **Rodízio sem bebida** | Plano 3 (`livre-sem-bebida`). Mesmo rodízio do plano 2, sem bebidas — o cliente leva ou contrata à parte. |
| **Pizzas por unidade** | Plano 4 (`unidade`). Cobrança **por pizza** (não por pessoa), em mesa fixa de self service. A quantidade é **sugerida** pelo app (0,6 pizza por adulto equivalente), mas o cliente paga pelo que sair do forno. |
| **Por pessoa** | Unidade de cobrança dos planos 1–3: preço × adultos equivalentes. |
| **Por pizza** | Unidade de cobrança do plano 4: preço × pizzas sugeridas. |
| **Preço parcelado** | Preço cheio, usado como base do cálculo dos 4 planos. É o único preço configurável que realmente entra na conta. |
| **Preço à vista** | Preço de tabela com desconto Pix. **Não é usado no cálculo**; o app deriva o à vista do total aplicando o percentual de desconto à vista. |
| **Preço por pessoa / Preço por pizza** | Campo do plano que representa o preço unitário (parcelado). No plano 4, o preço por pessoa existe na tabela mas o app cobra por pizza. |
| **Inclusos** | Lista do que cada plano oferece (garçom, bebidas, horas de serviço, descartáveis etc.). Aparece no comparativo do PDF. |
| **Bônus** | Vantagem declarada do plano. Hoje todos os planos têm "Deslocamento até 25 km", mas o bônus **não é renderizado** em lugar nenhum. |
| **Destaques Premium** | Quatro blocos de texto ("O que muda no Premium") exibidos somente no card do Premium no comparativo. |
| **Tagline** | Frase curta de venda de cada plano (ex.: "A verdadeira pizzaria italiana no seu evento"). |
| **Badge** | Selo do card: `RECOMENDADO` (Premium) ou `MAIS VANTAJOSO` (previsto no tipo, não usado hoje). |
| **Comparativo** | Página do PDF que coloca os planos 1, 2 e 3 lado a lado com total à vista, parcela e inclusos. |
| **Self service** | Formato do plano 4: mesa fixa, o convidado se serve; a equipe repõe as pizzas. |
| **Rodízio** | Formato dos planos 2 e 3: serviço livre e ilimitado por 3 horas, com garçom. |

## 4. Dinheiro e condições

| Termo | Significado no app |
|---|---|
| **Subtotal** | Valor do plano **antes** de deslocamento e desconto: adultos equivalentes × preço (ou pizzas × preço no plano 4). |
| **Deslocamento** | Adicional de transporte cobrado quando o evento é longe. É ligado por toggle e tem valor livre; entra em **todos** os planos, antes do desconto. |
| **Desconto manual** | Abatimento negociado no WhatsApp, informado no Editor como percentual (0–100%) ou valor absoluto (limitado à base). Aplica-se aos 4 planos e **não é impresso no PDF**. |
| **Desconto percentual** | Desconto em %, clampado a 0–100 e arredondado ao centavo. |
| **Desconto absoluto** | Desconto em R$, limitado ao valor da base (não deixa o total negativo). |
| **Base** | `subtotal + deslocamento`; é sobre ela que o desconto manual incide. |
| **Total** | `max(0, base − desconto aplicado)`. É o valor cheio; o parcelado é igual a ele. |
| **Total à vista** | Total com o desconto Pix (padrão 15%). Arredondado ao centavo. |
| **Parcela** | Valor de cada uma das `parcelas` prestações no cartão: `round(total / parcelas)`. Não há juros. |
| **Parcelas** | Número de prestações (padrão 10, configurável). |
| **Desconto à vista** | Percentual do desconto Pix, guardado como fração (0,15 = 15%) e configurável em Configurações. |
| **Pix** | Forma de pagamento à vista com desconto. No app é um dos valores de `pagamento` (`'pix' \| 'parcelado'`). |
| **Adicional de entrada** | Opcional de cardápio: 2 centos de salgados + 2 kg de batata (padrão R$ 350). Só aparece no cardápio do PDF; nunca é somado a um total. |
| **Cento extra** | Opcional: cada cento de salgados adicional (padrão R$ 75). Também só textual. |
| **Quitação** | Regra do PDF: pagamento integral deve ser quitado 1 dia antes do evento. Não é validado pelo app. |
| **Hora extra** | Regra do PDF: evento que passa das 22h pode ter acréscimo. Não é calculado pelo app (não há horário do evento). |
| **Condição de pagamento** | Frase que resume a forma escolhida ("à vista no Pix com 15% de desconto" ou "parcelado em 10x no cartão"). Usada como `{condicao}` na mensagem. |

## 5. Cardápio e produto

| Termo | Significado no app |
|---|---|
| **Cardápio** | Página do PDF com os sabores salgados, doces e premium, além dos adicionais de entrada e cento extra. |
| **Sabor salgado / doce** | Itens das duas listas padrão do cardápio (21 salgados e 6 doces). Podem ser substituídos nas Configurações por listas customizadas — mas a substituição só vale no PDF colorido. |
| **Sabor premium** | Sabores exclusivos do plano Premium, preparados com muçarela de búfala ("escolha 3 sabores"). Aparecem numa lista própria de 8 itens. |
| **Massa maturada** | Argumento de qualidade do produto: fermentação longa. O número de horas varia entre 12h e 48h nos textos do app/PDF (inconsistência conhecida). |
| **Muçarela de búfala** | Ingrediente premium citado no cardápio e nos destaques. |
| **Forno a lenha / pedra** | Referência ao modo de assar; aparece em textos de venda, sem efeito no cálculo. |
| **Búfala** | Ver "Muçarela de búfala". |
| **Restrição alimentar** | Observação do evento (ex.: vegetariano, lactose); impressa como observação, sem alterar preço. |

## 6. Telas, PDF e técnica

| Termo | Significado no app |
|---|---|
| **Editor** | Tela `/` onde o atendente preenche cliente, evento, convidados, deslocamento e desconto. Não exibe totais. |
| **Preview** | Tela `/preview` com resumo, visualização do PDF, botões de download (colorido e P&B), salvar e enviar no WhatsApp. |
| **History / Histórico** | Tela `/history` com os orçamentos salvos. |
| **Settings / Configurações** | Tela `/settings` com empresa, validade, padrões, template de WhatsApp, preços, adicionais, capa e cardápio. |
| **PDF colorido** | Versão editorial com fundo escuro, imagens dos planos e cores da marca. Gerado por `OrcamentoPDF` (`src/pdf/pages/`). |
| **PDF P&B / preto e branco** | Versão para impressão econômica, fundo branco, cards contornados, sem imagens. Gerado por `OrcamentoPDFPrint` (`src/pdf/print/`). Hoje é uma segunda árvore de código quase idêntica. |
| **Capa** | Primeira página do PDF: cliente, data, local, convidados, validade, texto "Sobre a Maná" e promessas. |
| **Condições** | Última página do PDF: reserva, quitação, horário máximo, validade e contato. |
| **Página do plano 4 / Unidade** | Página do PDF dedicada ao plano por unidade (preço por pizza, pizzas sugeridas, total estimado). |
| **Template de WhatsApp** | Texto com variáveis que vira a mensagem enviada junto com o PDF. |
| **Variáveis do template** | `{nome}`, `{empresa}`, `{deData}`, `{emCidade}`, `{condicao}`, `{validadeHoras}`. |
| **Config** | Conjunto completo de configurações da pizzaria, salvo em `localStorage` sob `mana-config:v1`. Exportável/importável como JSON. |
| **`mergeComDefault`** | Função que completa uma config parcial ou antiga com os valores padrão, para não quebrar a tela. |
| **Estado (`State`)** | Dados do orçamento em edição no Editor. |
| **Totais por plano (`TotaisPorPlano`)** | Objeto com os totais calculados de `premium`, `livreBebida`, `livreSemBebida` e `unidade`. |
| **`localStorage`** | Armazenamento do navegador. Único banco de dados do MVP: config, histórico e tema. Não há sincronização entre dispositivos. |
| **Chave de storage** | Identificador da entrada no `localStorage`: `mana-config:v1`, `mana-orcamentos:v1`, `mana:theme`. |
| **Snapshot / congelado** | Cópia imutável dos dados no momento do salvamento. No histórico, os `totais` são congelados. |
| **Tema** | `dark` (padrão) ou `light`; persistido em `mana:theme` e aplicado via `data-theme` no `<html>`. |
| **Fallback** | Texto substituto quando um campo está vazio (`'Cliente'`, `'A agendar'`, `'Local a combinar'`, `'A definir'`). |
| **Código morto** | Função/constante presente no repositório sem nenhum consumidor em produção (ex.: `validarDeslocamento`, `dataValidade`, `BATE_LIMITE_HORAS`). |
| **Write-only** | Configuração que pode ser editada e salva, mas que nenhum fluxo lê (ex.: `limiteKmDeslocamento`, preços "à vista"). |
