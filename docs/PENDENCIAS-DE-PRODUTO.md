# Pendências de produto — Maná Orçamentos

Decisões que **dependem do cliente (Lucas)** ou de definição de produto e que hoje estão
resolvidas de forma provisória, divergente ou apenas textual no código.

- Cada item traz **contexto**, **opções** e uma **recomendação**.
- Cada item é marcado como **`bloqueante`** (afeta o valor cobrado, o que o cliente lê no
  PDF ou a confiança no orçamento) ou **`melhoria`** (pode esperar).
- As regras como o código as implementa hoje estão em
  [`REGRAS-DE-NEGOCIO.md`](./REGRAS-DE-NEGOCIO.md).

> **Como estas pendências são resolvidas:** o epic PAMP-221 tem um estágio de correções
> (PAMP-232) que consome esta lista. Nenhuma decisão abaixo deve ser implementada sem a
> resposta do Lucas — o código atual é a referência do comportamento vigente.

## Resumo

| # | Pendência | Área | Classificação |
|---|---|---|---|
| 1 | Multiplicadores infantis (0–4 grátis, 5–9 meia) | Cálculo | **bloqueante** |
| 2 | Preço "à vista" configurável é ignorado | Cálculo | **bloqueante** |
| 3 | Desconto manual: escopo e exibição no PDF | Cálculo / PDF | **bloqueante** |
| 4 | Deslocamento somado a todos os planos | Cálculo | **bloqueante** |
| 5 | Validade calculada de duas origens | PDF / Histórico | **bloqueante** |
| 6 | PDF do plano 4 recalcula pizzas com pessoas brutas | PDF | **bloqueante** |
| 7 | "30% do valor no Pix" no PDF | PDF | **bloqueante** |
| 8 | Contagem de sabores ("26" vs 27 vs "30") | PDF / Cardápio | melhoria |
| 9 | Hora extra após 22h | Condições | melhoria |
| 10 | Quitação 1 dia antes | Condições | melhoria |
| 11 | Adicionais de entrada e cento extra nunca somados | Cálculo / PDF | **bloqueante** |
| 12 | Bônus "deslocamento até 25 km" nunca aplicado | Cálculo / PDF | melhoria |
| 13 | Três mensagens de WhatsApp divergentes | Editor / PDF | **bloqueante** |
| 14 | Nenhuma tela mostra o total ao vivo | Editor | **bloqueante** |
| 15 | Campos obrigatórios do orçamento | Editor / PDF | **bloqueante** |

### As mais bloqueantes de cada área (resolver primeiro)

| Área | Item | Por quê |
|---|---|---|
| **Cálculo** | **#2 — preço "à vista" ignorado** | A tela de preços promete 8 valores configuráveis, mas metade deles não tem efeito; o atendente pode achar que configurou um preço e cobrar outro. Em seguida: #3 (escopo do desconto) e #4 (deslocamento). |
| **PDF** | **#6 — plano 4 recalcula com pessoas brutas** | O texto impresso ("18 pizzas para 30 pessoas") contradiz o total cobrado (calculado com 15 pizzas). É o único defeito em que o próprio PDF se contradiz. Em seguida: #7 (30% vs 15%) e #11 (adicionais). |
| **Editor** | **#14 — nenhuma tela mostra o total ao vivo** | Contraria o princípio central do produto ("o cálculo aparece ao vivo") e a razão de existir do app: hoje o atendente só vê o número dentro do PDF. |

---

## 1. Multiplicadores infantis (0–4 grátis, 5–9 meia) — `bloqueante`

**Contexto.** A regra é `adultos + 0,5 × crianças 5–9 + 0 × crianças 0–4`
(`src/utils/calculo.ts:16-24`). Os multiplicadores são constantes literais e o `PRODUCT.md`
os marca explicitamente como "inferido de padrão de mercado, **a confirmar com Lucas**"
(`PRODUCT.md:48-49`). Toda a receita dos planos 1–3 depende disso.

**Opções.**
1. Manter 0–4 grátis e 5–9 meia (comportamento atual).
2. 0–4 grátis e 5–9 integral (toda criança de 5+ paga inteiro).
3. Faixas diferentes (ex.: 0–2 grátis, 3–9 meia) ou idade de corte outra.
4. Multiplicadores configuráveis nas Configurações.

**Recomendação.** Confirmar a opção 1 com o Lucas e, se confirmada, tornar as constantes
documentadas como regra comercial acordada. Não abrir a configuração (opção 4) no MVP:
aumenta a chance de erro do atendente e não há pedido do cliente.

---

## 2. Preço "à vista" configurável é ignorado — `bloqueante`

**Contexto.** A tela de Configurações tem 8 campos de preço (4 planos × parcelado/à vista,
`src/pages/Settings/index.tsx:375-414`). Só `parcelado` entra no cálculo
(`src/utils/calculo.ts:59,96`); `avista` é ignorado, e o app deriva o à vista aplicando o
percentual de desconto ao total (`§9`). Os valores "à vista" de `plans.ts`
(R$ 99,90 / 55,92 / 49,92 / 66,67) também não são usados e nem correspondem a 15% exatos.

**Opções.**
1. Remover os 4 campos "à vista" da tela e deixar só o percentual global de desconto
   (fonte única de verdade).
2. Fazer o preço "à vista" configurado ser o valor efetivamente exibido/cobrado e o
   percentual virar apenas o padrão de preenchimento.
3. Manter os dois e definir uma precedência documentada (ex.: preço à vista da config
   vence o percentual global).

**Recomendação.** Opção 1. É a que menos confunde: um único número (o percentual de
desconto à vista) explica todos os preços Pix, e o campo parcelado continua sendo o preço
de tabela. Se o Lucas quiser preços Pix diferentes por plano, aí sim a opção 2, com a tela
avisa que o percentual global deixa de valer.

---

## 3. Desconto manual: escopo e exibição no PDF — `bloqueante`

**Contexto.** O Editor diz que o desconto é "aplicado sobre o total do plano Premium
(referência) e aparece no PDF" (`src/pages/Editor/index.tsx:120-124`). O código aplica o
desconto a **todos os 4 planos** (`src/hooks/useOrcamento.tsx:104-109`) e o valor
**nunca é impresso no PDF** (nenhuma página lê `descontoAplicado`).

**Opções.**
1. Desconto em todos os planos e impresso em cada card/página (comportamento atual + copy
   corrigida).
2. Desconto só no Premium, como o texto diz; os outros planos ficam sem desconto.
3. Desconto em todos os planos, mas mostrado apenas como uma linha "desconto negociado"
   no resumo do PDF.

**Recomendação.** Opção 1: alinhar o texto do Editor ao comportamento e **imprimir o
desconto** no PDF (linha de desconto no comparativo e na página do plano 4). O desconto é
parte do que o cliente combinou; omiti-lo do PDF é o problema mais grave. A opção 2 exige
saber o que o cliente espera quando negocia "o orçamento" — provavelmente uma redução
geral, não só no Premium.

---

## 4. Deslocamento somado a todos os planos — `bloqueante`

**Contexto.** `valorDeslocamento` entra na base de todos os planos
(`src/utils/calculo.ts:87-88`) e antes do desconto. O PDF declara que o deslocamento está
"já incluído nos valores abaixo" (`src/pdf/pages/PageComparativo.tsx:266-269`). Não há
cobrança por km nem limite aplicado.

**Opções.**
1. Manter: um valor único de deslocamento somado a todos os planos.
2. Somar só aos planos que incluem serviço no local (1–3), deixando o plano 4 (self
   service, mesa fixa) sem deslocamento.
3. Calcular por km/fórmula, usando o limite configurado.

**Recomendação.** Confirmar a opção 1 com o Lucas, já que é o comportamento atual e o
atendente digita o valor manualmente (flexível). A opção 2 é uma pergunta comercial
legítima: faz sentido cobrar deslocamento de um plano que já é self service? Registrar a
resposta. A opção 3 é melhoria futura, não MVP.

---

## 5. Validade calculada de duas origens — `bloqueante`

**Contexto.** O Preview/PDF calcula `agora + validade.horas`
(`src/pages/Preview/index.tsx:56-59`); o Histórico calcula `criadoEm + validade.horas`
(`src/pages/History/index.tsx:155-158`). O mesmo orçamento aparece como "Expirado" no
Histórico e com data futura no PDF reemitido. Além disso, "Rascunho" é uma janela
arbitrária de 5 minutos (`History:35`).

**Opções.**
1. Uma única origem: `criadoEm + validade` em todos os lugares (PDF e Histórico).
2. Validade renovável: cada geração de PDF grava uma nova `validadeEm` no orçamento e
   Histórico/PDF usam esse campo.
3. Manter como está e apenas documentar.

**Recomendação.** Opção 2, se o negócio é "o orçamento vale 48h a partir de quando foi
enviado" — e então persistir `validadeEm` no snapshot. Se a regra é "48h a partir da
criação", opção 1 é mais simples e evita reemissão infinita. Perguntar ao Lucas qual é a
regra comercial antes de corrigir. A janela de 5 minutos do "Rascunho" deve ser separada:
ela não é validade e pode virar "criado agora" sem impacto fiscal.

---

## 6. PDF do plano 4 recalcula pizzas com pessoas brutas — `bloqueante`

**Contexto.** `PageUnidade.tsx:165-169` (e `PageUnidadePrint.tsx:166-170`) calculam
`pizzasSugeridas = ceil((adultos + criancas0a4 + criancas5a9) × 0,6)`, ignorando os
multiplicadores infantis. O total impresso vem de `totais.unidade`, que usa corretamente os
adultos equivalentes. Resultado: o texto "X pizzas p/ Y pessoas" e o "Calculado com X
pizzas × R$ Z" contradizem o total cobrado.

**Exemplo.** 20 adultos + 10 crianças de 5–9: cálculo correto = 25 equivalentes = 15
pizzas; o PDF imprime 30 pessoas / 18 pizzas, mas cobra 15 pizzas.

**Opções.**
1. Usar `totais.unidade.pizzas` (já calculado) no texto e no rótulo, mostrando também os
   adultos equivalentes.
2. Manter pessoas brutas no texto e corrigir o total para cobrar 18 pizzas (mudaria o
   preço).
3. Mostrar as duas informações separadas ("30 convidados · 25 equivalentes · 15 pizzas").

**Recomendação.** Opção 1 com um complemento da 3: o PDF deve dizer "15 pizzas para 25
adultos equivalentes (30 convidados)". Nunca cobrar diferente do que o restante do app
calcula. É correção de consistência, sem decisão comercial nova.

---

## 7. "30% do valor no Pix" no PDF — `bloqueante`

**Contexto.** A página de condições imprime "Pagamento parcelado ou **30% do valor no
Pix**" (`src/pdf/pages/PageCondicoes.tsx:224`; P&B `PageCondicoesPrint.tsx:226`), enquanto
todo o resto do app fala em **15% de desconto à vista**. São coisas diferentes: 30% de
entrada no Pix não é o mesmo que 15% de desconto.

**Opções.**
1. Corrigir o texto para o desconto real (15% à vista), derivado de
   `config.pdf.adicionais.descontoAvista`.
2. Manter "30% de entrada no Pix" como condição de reserva (sinal) e explicitar que o
   desconto à vista é outro número; então o app precisa de dois campos.
3. Remover a menção ao Pix da página de condições.

**Recomendação.** Opção 1 se o "30%" foi erro de digitação; opção 2 se existe de fato uma
entrada de 30% para reservar a data (o texto "Contrato e primeira condição de pagamento"
sugere que sim). **Perguntar ao Lucas** — este é um número comercial que pode estar certo
no PDF e errado no app. Enquanto não houver resposta, pelo menos derivar o percentual da
config para o texto não contradizer o comparativo.

---

## 8. Contagem de sabores ("26" vs 27 vs "30") — `melhoria`

**Contexto.** As listas têm 21 salgados + 6 doces = **27** sabores
(`PageCardapio.tsx:7-13,15-18`), mas o título do cardápio diz **"26 sabores"**
(`PageCardapio.tsx:299`), o plano 4 e os inclusos dos planos dizem **"30 sabores"**
(`PageUnidade.tsx:230`, `plans.ts:105,128,139,151`), e a tela de Configurações usa
placeholders "21/6" (`Settings:577,592`). O P&B também escreve "20 sabores" no cabeçalho
enquanto lista 21 (`PageCardapioPrint.tsx:328`).

**Opções.**
1. Padronizar em **27** e derivar o número das listas (nunca digitar à mão).
2. Se o cardápio real tem 30, completar as listas para 30 e padronizar em 30.
3. Manter textos genéricos ("mais de 25 sabores") para não depender da contagem.

**Recomendação.** Opção 1: derivar de `salgados.length + doces.length` e corrigir os
textos. É o menor risco e acaba com a divergência. Se o cliente disser que são 30, a
opção 2 força a lista a refletir a realidade (melhor para o cliente final).

---

## 9. Hora extra após 22h — `melhoria`

**Contexto.** Só existe como frase no PDF (`PageCondicoes.tsx:240-243`). O app não tem
campo de horário do evento, não calcula adicional e `BATE_LIMITE_HORAS = 22`
(`plans.ts:166`) é código morto.

**Opções.**
1. Manter apenas informativo (texto no PDF), sem cálculo.
2. Adicionar horário de início/fim no Editor e calcular hora extra por faixa.
3. Adicionar um campo manual "adicional por hora extra (R$)" somado ao total.

**Recomendação.** Opção 1 no MVP (é o que existe e o atendente negocia à parte), mas
registrar a decisão. Se o Lucas quiser cobrar automaticamente, opção 2 com uma regra
explícita (valor/hora ou % do plano) — nunca inferir.

---

## 10. Quitação 1 dia antes — `melhoria`

**Contexto.** Só texto no PDF (`PageCondicoes.tsx:233-236`). Nenhuma validação de data,
lembrete ou status de pagamento.

**Opções.**
1. Manter informativo.
2. Validar no Editor que a data do evento é pelo menos 2 dias no futuro (para caber a
   quitação) e avisar.
3. Criar acompanhamento de pagamento (fora do escopo do MVP, exige backend).

**Recomendação.** Opção 1 agora; opção 2 é uma melhoria barata e útil (aviso, não bloqueio,
porque o atendente pode ter exceções). Opção 3 só na v2.

---

## 11. Adicionais de entrada e cento extra nunca somados — `bloqueante`

**Contexto.** Entrada (R$ 350) e cento extra (R$ 75) são exibidos no cardápio do PDF
(`PageCardapio.tsx:345-357`), configuráveis (`Settings:427-438`), mas **não há toggle no
Editor** e **nunca entram em nenhum total** (`calcularTotais` não os conhece). O PDF
chega a dizer que adicionais não estão incluídos (`PageUnidade.tsx:249`).

**Opções.**
1. Manter como catálogo informativo (cliente escolhe à parte, fora do total).
2. Adicionar toggles no Editor e somar ao total do orçamento (nos 4 planos ou só no
   escolhido).
3. Adicionar toggles e imprimir uma linha de adicionais no PDF, somando ao total final.

**Recomendação.** Opção 3: o adicional é uma venda real; se ele não entra no total, o
atendente precisa calcular de cabeça — exatamente o que o app existe para evitar.
Perguntar ao Lucas se o adicional é por evento (soma única) ou por plano. Enquanto a
decisão não vem, a opção 1 é aceitável, mas o texto do PDF não deve sugerir que está
incluído.

---

## 12. Bônus "deslocamento até 25 km" nunca aplicado — `melhoria`

**Contexto.** Todos os planos declaram o bônus (`plans.ts:84,108,131,154`), mas ele não é
renderizado em nenhum PDF nem tela; `config.pdf.adicionais.limiteKmDeslocamento` é
write-only; `validarDeslocamento` (`calculo.ts:121-136`) é código morto.

**Opções.**
1. Renderizar o bônus no comparativo/capa e não aplicar nenhum cálculo (só promessa).
2. Usar o limite para isentar o deslocamento quando a cidade está na área e cobrar só
   acima de 25 km — exige distância real (não há mapa/API).
3. Remover o bônus dos planos e a config de km.

**Recomendação.** Opção 1 no MVP: o bônus é argumento de venda e o atendente controla o
valor manualmente. A opção 2 depende de distância real, que o app não tem. Registrar para
a v2.

---

## 13. Três mensagens de WhatsApp divergentes — `bloqueante`

**Contexto.** Preview (`Preview:24-48`), Histórico (`History:90-106`) e o preview das
Configurações (`Settings:351-360`) montam o mesmo template de formas diferentes: o
Histórico acrescenta "· total a partir de R$ X"; as três fixam "15%" e "10x" em vez de
derivar de `descontoAvista`/`parcelas`; e o Preview ignora completamente o total no texto.

**Opções.**
1. Uma única função `montarMensagemWhatsApp(...)` usada pelas três telas, derivando
   percentual, parcelas e total da config.
2. Manter três mensagens de propósito (ex.: Preview mais curta, Histórico com total).
3. Remover a mensagem do Histórico e deixar só o Preview.

**Recomendação.** Opção 1, com a variante do Histórico incluindo o total como opção
explícita (parâmetro), não como implementação separada. Além disso, adicionar
`{total}` como variável oficial do template — hoje ele só aparece por acidente no
Histórico. A mensagem é o que o cliente recebe; divergência aqui é risco comercial direto.

---

## 14. Nenhuma tela mostra o total ao vivo — `bloqueante`

**Contexto.** Os totais dos 4 planos são calculados a cada tecla
(`src/hooks/useOrcamento.tsx:102-110`), mas **nenhuma tela os exibe**: o Editor só mostra
contagem de convidados e o desconto em si; o comparativo existe apenas dentro do PDF. O
`PRODUCT.md` define como posicionamento central "o cálculo aparece ao vivo enquanto o
atendente digita" (`PRODUCT.md:27,73-78`).

**Opções.**
1. Mostrar no Editor um resumo fixo com os 4 totais (à vista e parcela).
2. Mostrar apenas o plano mais barato/mais relevante como referência e o comparativo
   completo só no Preview.
3. Não mostrar (comportamento atual) e remover a promessa do `PRODUCT.md`.

**Recomendação.** Opção 1: um painel "Totais" no Editor (ou barra fixa no rodapé) com os 4
planos, valor à vista e parcela. É a funcionalidade que justifica o app e a que o
`PRODUCT.md` promete. Não é decisão comercial; é entrega do produto — mas depende de
espaço/telas, então confirmar com o Lucas se quer o painel no Editor ou no Preview.

---

## 15. Campos obrigatórios do orçamento — `bloqueante`

**Contexto.** Hoje dá para gerar e baixar o PDF sem nome, data ou local; o PDF usa
fallbacks "Cliente" (`PageCapa.tsx:237`), "A agendar" (`:244`) e "Local a combinar"
(`:246`). Não há validação de schema (RHF/Zod instalados, não usados).

**Opções.**
1. Tudo opcional (comportamento atual), apenas com avisos visuais.
2. Exigir nome do cliente e data do evento para **baixar** o PDF; local e WhatsApp
   opcionais.
3. Exigir nome, data e local; bloquear o botão de download até preencher.
4. Exigir só o nome, permitindo "a definir" no restante.

**Recomendação.** Opção 2: nome e data são o mínimo para um documento comercial ter
validade; local pode ser combinado depois e é comum o cliente ainda não saber. Bloquear o
**download** (não a navegação nem o preenchimento) evita mandar "Proposta para Cliente"
para o cliente final. Perguntar ao Lucas se ele concorda em travar a geração.

---

## Notas de ambiguidade encontradas na documentação

Itens que não são decisão comercial, mas que a documentação do epic supunha diferentes do
código real — registrados para quem for implementar as correções:

1. **Estrutura de pastas:** as issues do epic citam `src/services/` e `src/contexts/`;
   o repositório usa `src/storage/` e `src/hooks/`. As correções devem usar os caminhos
   reais.
2. **Números de linha:** as referências do corpo da issue (ex.: `calculo.ts:16-24` para
   convidados, `Preview:56`, `History:170`) apontam para um estado anterior do arquivo.
   Este documento usa as linhas reais do commit base `1c3a656`.
3. **`PRODUCT.md` diz "Preços implícitos no PDF original (117,60 / 66,00 / 58,80 /
   78,50)"** e "À vista = 15% desconto (na prática 15,05–15,27% por arredondamento da
   parcela)". O cálculo real usa 15% exatos sobre o total; a diferença está nos valores
   `avista` de `plans.ts`, que não são usados.
4. **"Rascunho"** não estava descrito como janela de 5 minutos em nenhum documento —
   só no código.
