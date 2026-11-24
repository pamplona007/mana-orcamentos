# Regras de negócio — Maná Orçamentos

Este documento descreve **o que o app realmente faz hoje**, em termos de negócio: cada
regra que o código implementa, com a fórmula exata, um exemplo numérico e a referência
`arquivo:linha` do código que a implementa. O objetivo é que ninguém precise ler `src/`
para saber como um orçamento é calculado.

> **Fonte de verdade:** o código na branch deste documento (commit base `1c3a656`).
> Onde o texto do PDF, o texto da tela ou o `PRODUCT.md` divergem do código, a divergência
> está registrada aqui e em [`PENDENCIAS-DE-PRODUTO.md`](./PENDENCIAS-DE-PRODUTO.md).
>
> **Observação sobre caminhos:** a estrutura real do repositório usa `src/storage/`
> (não `src/services/`) e `src/hooks/` (não `src/contexts/`). As referências abaixo
> apontam para os caminhos reais.

## Legenda de status

| Símbolo | Significado |
|---|---|
| ✅ **Implementada** | O código aplica a regra em todos os fluxos que deveriam usá-la. |
| ⚠️ **Divergente** | O código implementa algo, mas de forma diferente do que a tela/PDF/promessa diz — ou de forma inconsistente entre telas. |
| 📄 **Apenas textual no PDF** | A regra existe só como frase impressa no PDF; não há código que a calcule ou valide. |
| ☠️ **Código morto** | Existe no repositório, mas nenhum fluxo o consome. |

---

## Índice

1. [Entrada de dados do orçamento](#1-entrada-de-dados-do-orçamento)
2. [Equivalência de convidados](#2-equivalência-de-convidados)
3. [Pizzas sugeridas](#3-pizzas-sugeridas)
4. [Origem dos preços por plano](#4-origem-dos-preços-por-plano)
5. [Subtotal por plano](#5-subtotal-por-plano)
6. [Ordem das operações do total](#6-ordem-das-operações-do-total)
7. [Deslocamento](#7-deslocamento)
8. [Desconto manual](#8-desconto-manual)
9. [Total à vista (Pix)](#9-total-à-vista-pix)
10. [Parcelamento](#10-parcelamento)
11. [Tabela dos 4 planos](#11-tabela-dos-4-planos)
12. [Validade do orçamento](#12-validade-do-orçamento)
13. [Quitação 1 dia antes](#13-quitação-1-dia-antes-do-evento-)
14. [Hora extra após 22h](#14-hora-extra-após-22h-)
15. [Bônus de deslocamento até 25 km](#15-bônus-de-deslocamento-até-25-km-)
16. [Adicionais: entrada e cento extra](#16-adicionais-entrada-e-cento-extra-)
17. [Cardápio, sabores e maturação da massa](#17-cardápio-sabores-e-maturação-da-massa)
18. [Condição de pagamento no PDF](#18-condição-de-pagamento-no-pdf-)
19. [Mensagem de WhatsApp](#19-mensagem-de-whatsapp-)
20. [Status do orçamento no histórico](#20-status-do-orçamento-no-histórico)
21. [Persistência (localStorage)](#21-persistência-localstorage)
22. [Campos opcionais e fallbacks](#22-campos-opcionais-e-fallbacks)
23. [Formatação de valores e datas](#23-formatação-de-valores-e-datas)
24. [Código morto e divergências consolidadas](#24-código-morto-e-divergências-consolidadas)

---

## 1. Entrada de dados do orçamento

✅ **Implementada**

Um orçamento é montado no Editor sobre um estado (`State`) com seis blocos:

| Bloco | Campos | Origem do valor inicial |
|---|---|---|
| `cliente` | `nome`, `whatsapp` | vazio |
| `evento` | `data` (ISO `YYYY-MM-DD`), `cidadeBairro`, `observacoes` | vazio |
| `convidados` | `adultos`, `criancas0a4`, `criancas5a9` | `config.editor.convidadosPadrao` |
| `pagamento` | `'pix'` ou `'parcelado'` | `config.editor.pagamentoPadrao` |
| `desconto` | `tipo` (`nenhum`/`percentual`/`absoluto`), `valor` | `nenhum` / `0` |
| `deslocamento` | `ativo`, `valor` | `config.editor.deslocamentoPadrao` |

- Estado inicial: `src/hooks/useOrcamento.tsx:42-58` (`buildInitialState`).
- Tipos: `src/types/orcamento.ts:3-41`.
- O padrão de convidados vem de `CONFIG_DEFAULT.editor.convidadosPadrao` = 25 adultos
  (`src/types/config.ts:94-105`).
- O `pagamento` não altera nenhum total: ele só muda o texto da condição e a mensagem
  de WhatsApp. Todos os 4 planos sempre têm total à vista **e** total parcelado calculados.

---

## 2. Equivalência de convidados

✅ **Implementada**

O número que entra em todos os cálculos por pessoa não é o número de convidados, e sim o
de **adultos equivalentes**:

```
adultosEquivalentes = max(0, adultos)
                    + max(0, criancas0a4) × 0   // crianças de 0 a 4 anos são grátis
                    + max(0, criancas5a9) × 0,5 // crianças de 5 a 9 anos pagam meia
```

- Constantes: `MULTIPLICADOR_CRIANCA_5A9 = 0,5` e `MULTIPLICADOR_CRIANCA_0A4 = 0`
  em `src/utils/calculo.ts:16-17`.
- Função: `calcularConvidados` em `src/utils/calculo.ts:19-24`.
- Valores negativos são zerados por `Math.max(0, …)` (mesma função).

**Exemplo:** 20 adultos + 10 crianças de 5–9 + 5 crianças de 0–4
→ `20 + 10×0,5 + 5×0 = 25` adultos equivalentes.

**Status:** implementada, mas os multiplicadores são **constantes literais** e o
`PRODUCT.md` os marca como "a confirmar com Lucas" (`PRODUCT.md:48-49`). Ver pendência 1.

---

## 3. Pizzas sugeridas

✅ **Implementada** (com uma segunda implementação divergente na UI, ver abaixo)

```
pizzasSugeridas = ceil(adultosEquivalentes × 0,6)
```

- `src/utils/calculo.ts:26-28` (`calcularPizzasSugeridas`).
- O fator 0,6 significa **1 pizza a cada 1,67 pessoa** (o PDF diz "1,6 pessoa" — ver §17).

**Exemplo:** 25 equivalentes → `ceil(25 × 0,6) = ceil(15) = 15` pizzas.

A função só é usada em dois lugares que importam para dinheiro:
`calcularSubtotal` do plano por unidade (`src/utils/calculo.ts:61-67`) e o PDF
(`src/pdf/pages/PageUnidade.tsx:169`, `src/pdf/print/PageUnidadePrint.tsx:170`).

⚠️ **Divergente na UI:** o componente `GuestBreakdown` recalcula o mesmo número inline
(`Math.ceil(total * 0.6)`) em vez de chamar `calcularPizzasSugeridas`
(`src/components/GuestBreakdown/index.tsx:13`). Hoje os dois dão o mesmo resultado, mas
são duas fontes para o mesmo número.

---

## 4. Origem dos preços por plano

✅ **Implementada** — com um campo ignorado (o preço "à vista", ver pendência 2)

Há **duas** tabelas de preço no repositório:

1. `src/data/plans.ts:32-156` — tabela comercial fixa (`precoPessoaParcelado`,
   `precoPessoaAvista`, e no plano 4 `precoPizzaParcelado`/`precoPizzaAvista`).
2. `config.pdf.precos` — os 8 campos da tela "Preços dos planos"
   (`src/pages/Settings/index.tsx:375-414`, tipo em `src/types/config.ts:35-40`,
   padrão em `src/types/config.ts:119-124`).

O cálculo usa `config.pdf.precos` quando ele existe e cai na tabela de `plans.ts` quando
não existe:

```
precoPlano(planoId) = config.pdf.precos[planoId]  se config existir
                    = plans.ts[planoId]            caso contrário
```

- `src/utils/calculo.ts:32-44` (`precoPlano`), usado em `:59` (subtotal) e `:96`
  (`precoPessoaUsado`, só informativo).

⚠️ **Divergente:** de cada par de preços, o código lê **apenas `parcelado`**; o campo
`avista` devolvido por `precoPlano` nunca é consumido. O "à vista" exibido é sempre
derivado do total pelo percentual de `config.pdf.adicionais.descontoAvista` (§9), e os
valores `precoPessoaAvista`/`precoPizzaAvista` de `plans.ts` (`:45,97,121,144,146`) só
servem de referência. Consequência: **os 4 campos "à vista" da tela de preços são
inúteis**; os 4 campos "parcelado" são os únicos preços da tela que entram no cálculo.

No plano 4, `precoPlano` devolve `precoPessoaParcelado` (R$ 78,50) — e **não**
`precoPizzaParcelado` (`src/data/plans.ts:22,145`), que é declarado mas nunca lido. Hoje
os dois valores são iguais, então a conta fecha; se um dia divergirem, o cálculo continua
usando `precoPessoaParcelado`.

---

## 5. Subtotal por plano

✅ **Implementada**

```
Planos 1, 2 e 3 (por pessoa):
    subtotal = adultosEquivalentes × precoParcelado(plano)

Plano 4 (por unidade/pizza):
    subtotal = pizzasSugeridas × precoParcelado(plano 4)
```

- `src/utils/calculo.ts:54-76` (`calcularSubtotal`); o desvio do plano 4 está em
  `:61-67`, os demais em `:70-75`.
- No plano 4, o preço unitário usado é `precoPessoaParcelado` do plano (via
  `precoPlano`, `src/utils/calculo.ts:41`) — não `precoPizzaParcelado` (ver §4).
- O campo `tipoUnidade` retornado (`'pessoas'` ou `'pizzas'`) é o que decide, em
  `calcularTotais`, qual número vai para `adultosEquivalentes` e qual vai para `pizzas`
  (`src/utils/calculo.ts:98-100`).

**Exemplos (25 adultos, preços padrão):**

| Plano | Conta | Subtotal |
|---|---|---|
| Premium | `25 × 117,60` | **R$ 2.940,00** |
| Rodízio Livre | `25 × 66,00` | **R$ 1.650,00** |
| Rodízio sem bebida | `25 × 58,80` | **R$ 1.470,00** |
| Pizzas por unidade | `15 × 78,50` | **R$ 1.177,50** |

---

## 6. Ordem das operações do total

✅ **Implementada** (mas vale para os 4 planos — divergência de copy, pendência 3)

A ordem é fixa e igual para todos os planos:

```
1. subtotal          = (§5)
2. base              = subtotal + deslocamento            (deslocamento só se ativo)
3. descontoAplicado  = (§8), calculado sobre a base
4. total             = max(0, base − descontoAplicado)
5. totalParcelado    = total
6. totalAvista       = round(total × (1 − descontoAvista)) (§9)
7. parcela           = round(total / parcelas)             (§10)
```

- `src/utils/calculo.ts:78-110` (`calcularTotais`). Ordem visível em `:86-95`.
- O deslocamento entra **antes** do desconto (`:87-91`), então um desconto percentual
  também incide sobre o deslocamento.
- Os totais dos **4 planos** são calculados a cada mudança de estado:
  `src/hooks/useOrcamento.tsx:102-110`.

---

## 7. Deslocamento

✅ **Implementada** / ⚠️ **Divergente quanto ao escopo**

```
valorDeslocamento = ativo ? max(0, valor) : 0
base              = subtotal + valorDeslocamento
```

- `src/utils/calculo.ts:87-88`.
- Entra no total dos **4 planos**, e entra **antes** do desconto.
- O valor é digitado livremente no Editor (`src/pages/Editor/index.tsx:98-113`, campo
  `min={0}`); o toggle usa `OPCIONAIS.deslocamento` (`src/data/plans.ts:178-182`), cujo
  rótulo mostra `'~R$ 150,00'` **fixo**, ignorando `config.editor.deslocamentoPadrao.valor`
  (`src/pages/Editor/index.tsx:94`).

**Exemplo:** Premium (25 adultos) + deslocamento R$ 150,00 → base R$ 3.090,00.

**Divergência:** o Editor descreve o deslocamento como adicional e o PDF diz que ele está
"já incluído nos valores abaixo" de todos os planos
(`src/pdf/pages/PageComparativo.tsx:266-269`), o que é coerente com o código; o problema é
que o bônus "até 25 km" (§15) nunca é aplicado. Ver pendência 4.

---

## 8. Desconto manual

✅ **Implementada** / ⚠️ **Divergente quanto ao escopo e à exibição**

```
se tipo == 'nenhum' ou valor <= 0:  descontoAplicado = 0
se tipo == 'percentual':
    pct               = min(100, max(0, valor))            // clampado a 0–100
    descontoAplicado  = round(base × (pct/100) × 100)/100  // 2 casas
se tipo == 'absoluto':
    descontoAplicado  = min(base, max(0, valor))           // limitado à base
```

- `src/utils/calculo.ts:112-119` (`calcularDesconto`), chamado em `:90`.
- A base é `subtotal + deslocamento` (§6). O total nunca fica negativo (`:91`).

**Exemplos (Premium, 25 adultos):**

| Desconto | Base | Desconto aplicado | Total |
|---|---|---|---|
| 5% com deslocamento R$ 150 | 3.090,00 | 154,50 | **2.935,50** |
| R$ 500 absoluto, sem deslocamento | 2.940,00 | 500,00 | **2.440,00** |
| R$ 9.999 absoluto, 1 adulto no Livre | 66,00 | 66,00 (limitado) | **0,00** |

**Divergências:**
- O Editor diz que o desconto é "aplicado sobre o total do plano Premium (referência) e
  aparece no PDF" (`src/pages/Editor/index.tsx:120-124`). Na prática o código aplica o
  desconto a **todos os 4 planos** (`src/hooks/useOrcamento.tsx:104-109`) e o desconto
  **nunca é impresso no PDF** (nenhuma página lê `descontoAplicado`). Ver pendência 3.

---

## 9. Total à vista (Pix)

✅ **Implementada**

```
totalAvista = round(total × (1 − descontoAvista) × 100) / 100
```

- `src/utils/money.ts:33-35` (`applyDescontoAvista`), chamado em `src/utils/calculo.ts:93`.
- `descontoAvista` vem de `config.pdf.adicionais.descontoAvista` (padrão **0,15 = 15%**,
  `src/types/config.ts:128`), com fallback para `DESCONTO_AVISTA = 0,15`
  (`src/data/plans.ts:164`, `src/utils/calculo.ts:46-48`).

**Exemplos:** 2.940,00 → **2.499,00**; 1.650,00 → **1.402,50**; 1.177,50 → **1.000,88**
(1.177,50 × 0,85 = 1.000,875, arredondado para cima no centavo).

**Divergências (todas de copy, ver §17):**
- O rótulo "15%" está **fixo** em dois lugares (`PageUnidade.tsx:243`,
  `PageUnidadePrint.tsx:243`) em vez de derivar de `descontoAvista`; o comparativo usa o
  valor derivado (`PageComparativo.tsx:257,301`).
- A tela de preços promete que o campo "à vista" define esse valor, mas ele é ignorado
  (§4, pendência 2).
- O PDF do plano 4 mostra o preço "Pix por pizza" a partir de `plans.ts`
  (`PageUnidade.tsx:171`), ignorando `config.pdf.precos.unidade` — o número exibido pode
  não bater com o total.

---

## 10. Parcelamento

✅ **Implementada**

```
parcela = round(total / parcelas × 100) / 100
```

- `src/utils/money.ts:29-31` (`roundParcela`), chamado em `src/utils/calculo.ts:95`.
- `parcelas` vem de `config.pdf.adicionais.parcelas` (padrão **10**,
  `src/types/config.ts:129`; fallback em `src/data/plans.ts:165`).
- O total parcelado (`totalParcelado`) é o próprio total: o parcelamento **não** acrescenta
  juros.

**Exemplo:** 2.940,00 em 10x → **R$ 294,00** por parcela.

⚠️ **Divergente (arredondamento):** quando o total não é divisível, a soma das parcelas
não reproduz o total (ex.: 10,00 em 3x → 3,33; 3 × 3,33 = 9,99). Não existe linha de
ajuste no PDF.

---

## 11. Tabela dos 4 planos

✅ **Implementada** — os dados comerciais vivem em `src/data/plans.ts:32-156`

| # | Plano (`PlanoId`) | Preço parcelado | Preço "à vista" de tabela* | Unidade | Duração | Bônus | O que inclui (resumo) |
|---|---|---|---|---|---|---|---|
| 1 | **Premium** (`premium`) | R$ 117,60 / pessoa | R$ 99,90 (não usado) | pessoa | 3h | Deslocamento até 25 km | Garçom para pizzas e bebidas; refrigerante, suco e água; serviço livre 3h; 1 pizzaiolo dedicado; 1 garçom a cada 40 convidados; descartáveis; sabores tradicionais, especiais, doces e salgados. Badge **RECOMENDADO**; 8 sabores premium com búfala; 4 "destaques Premium". |
| 2 | **Rodízio Livre** (`livre-bebida`) | R$ 66,00 / pessoa | R$ 55,92 (não usado) | pessoa | 3h | Deslocamento até 25 km | Garçom para pizzas e bebidas; bebidas liberadas; 3h de serviço; 1 pizzaiolo; 1 garçom a cada 40; descartáveis; 30 sabores. |
| 3 | **Rodízio sem bebida** (`livre-sem-bebida`) | R$ 58,80 / pessoa | R$ 49,92 (não usado) | pessoa | 3h | Deslocamento até 25 km | Garçom só para pizzas; 3h de serviço; 1 pizzaiolo; 1 garçom a cada 40; descartáveis; 30 sabores. Bebidas por conta do cliente. |
| 4 | **Pizzas por unidade** (`unidade`) | R$ 78,50 / pizza | R$ 66,67 (não usado) | pizza | 3h | Deslocamento até 25 km | Mesa fixa de self service; luvas e guardanapos; 30 sabores. Estimativa de 0,6 pizza por adulto equivalente. |

\* Os preços "à vista" da tabela são apenas referenciais (ver §4) e já embutem um desconto
de ~15,05–15,27% (arredondado), não os 15% exatos aplicados pelo cálculo.

**Exemplo — os 4 planos para 25 adultos, sem deslocamento nem desconto:**

| Plano | Total (`total`) | À vista (15%) | Parcela 10x |
|---|---|---|---|
| Premium | R$ 2.940,00 | R$ 2.499,00 | R$ 294,00 |
| Rodízio Livre | R$ 1.650,00 | R$ 1.402,50 | R$ 165,00 |
| Rodízio sem bebida | R$ 1.470,00 | R$ 1.249,50 | R$ 147,00 |
| Por unidade (15 pizzas) | R$ 1.177,50 | R$ 1.000,88 | R$ 117,75 |

**Onde os 4 planos aparecem:**
- Cálculo: `src/hooks/useOrcamento.tsx:104-109`.
- Comparativo no PDF: apenas os planos 1, 2 e 3 (`src/pdf/pages/PageComparativo.tsx:8`).
- Página própria do plano 4: `src/pdf/pages/PageUnidade.tsx`.
- **No app (telas), nenhum plano é exibido com total** — ver pendência 14.

⚠️ **Armadilha:** `PLANO_TOTAL_KEY` mapeia `unidade → 'premium'`
(`src/pdf/pages/PageComparativo.tsx:239-244` e `src/pdf/print/PageComparativoPrint.tsx:241-245`).
Hoje é inofensivo porque o plano 4 não está no comparativo, mas mostra o total do Premium
se alguém incluir o plano 4 na lista.

---

## 12. Validade do orçamento

⚠️ **Divergente — calculada de duas origens diferentes**

Regra de negócio: o orçamento é válido por `config.validade.horas` (padrão **48h**,
`src/types/config.ts:91-93`).

| Onde | Fórmula | Referência |
|---|---|---|
| PDF / Preview | `agora + validade.horas` — recalculado a cada render | `src/pages/Preview/index.tsx:56-59`; impresso em `src/pdf/pages/PageCapa.tsx:268-269` e `PageCondicoes.tsx:250` |
| Histórico (status) | `criadoEm + validade.horas` | `src/pages/History/index.tsx:155-158` |

**Exemplo do problema:** orçamento criado em 01/11 às 10:00, validade 48h. O Histórico
considera válido até **03/11 às 10:00** (`criadoEm + 48h`). Se o atendente reabrir esse
orçamento e gerar o PDF em 02/11 às 10:00, a capa imprime **"Válido até 04/11"**
(`agora + 48h`). No dia 03/11 às 11:00, o Histórico já marca **"Expirado"**, embora o PDF
entregue ao cliente diga que vale até 04/11. É o mesmo orçamento com duas validades.

`dataValidade(criadoEm, horas)` existe em `src/utils/calculo.ts:138-142` (com
`setHours(getHours() + horas)`) mas **não é chamada por nenhum fluxo** — é código morto
(só usada em teste). Também tem bug de DST (perde 1h em transições de horário de verão).
Ver pendência 5.

---

## 13. Quitação 1 dia antes do evento 📄

📄 **Apenas textual no PDF**

O PDF imprime: *"A quitação do serviço deverá ser realizada 1 dia antes da data do
evento."*

- Colorido: `src/pdf/pages/PageCondicoes.tsx:233-236`.
- P&B: `src/pdf/print/PageCondicoesPrint.tsx:235-238`.

Não há nenhuma validação de data, cobrança, lembrete ou campo que implemente essa regra.
O app aceita qualquer data (inclusive passada) e não bloqueia a geração. Ver pendência 10.

---

## 14. Hora extra após 22h 📄

📄 **Apenas textual no PDF** (e há código morto relacionado)

O PDF imprime: *"A finalização do evento acontece até 22h. Após esse horário, o valor
poderá sofrer alteração."*

- Colorido: `src/pdf/pages/PageCondicoes.tsx:240-243`.
- P&B: `src/pdf/print/PageCondicoesPrint.tsx:244`.

- `BATE_LIMITE_HORAS = 22` existe em `src/data/plans.ts:166` e **não é lido por ninguém**.
- O app **não tem campo de horário do evento** — só a data (`src/pages/Editor/index.tsx:47-54`).
- Não existe cálculo de hora extra nem adicional por horário.

Ver pendência 9.

---

## 15. Bônus de deslocamento até 25 km 📄

📄 **Apenas textual** (e nem chega a ser impresso)

Os 4 planos declaram o bônus `'Deslocamento até 25 km'` (`src/data/plans.ts:84,108,131,154`),
mas a palavra `bonus` **não é referenciada em nenhuma página do PDF** (`src/pdf/`) nem em
nenhuma tela. Ou seja: o bônus existe só no array de dados.

- `config.pdf.adicionais.limiteKmDeslocamento` (padrão 25) é configurável em
  `src/pages/Settings/index.tsx:465-476`, mas é **write-only**: nenhum cálculo o lê.
- `validarDeslocamento(cidadeBairro)` em `src/utils/calculo.ts:121-136` sabe dizer se a
  cidade está na área (Fortaleza, Caucaia, Maracanaú, Eusébio, Aquiraz, Pacatuba,
  Itaitinga), mas **não é chamada por nenhum fluxo** (só teste).
- O valor do deslocamento é digitado manualmente e cobrado de todos os planos (§7), sem
  qualquer consideração de km ou de bônus.

Ver pendência 12.

---

## 16. Adicionais: entrada e cento extra 📄

📄 **Apenas textual no PDF**

Dois adicionais opcionais existem no cardápio:

| Adicional | Valor padrão | Chave de config | O que é |
|---|---|---|---|
| Entrada | **R$ 350,00** | `pdf.adicionais.entrada` | 2 centos de salgados + 2 kg de batata |
| Cento extra | **R$ 75,00** | `pdf.adicionais.salgadoExtra` | cada cento de salgados adicional |

- Padrões em `src/types/config.ts:125-131`; constantes em `src/data/plans.ts:162-163`.
- Impressos no cardápio: colorido `src/pdf/pages/PageCardapio.tsx:348-357`; P&B
  `src/pdf/print/PageCardapioPrint.tsx:367-376`.
- **Não existe toggle** no Editor para incluí-los (`src/pages/Editor/index.tsx` só tem
  deslocamento e desconto).
- **Nunca são somados a nenhum total**: `calcularTotais` (`src/utils/calculo.ts:78-110`)
  não os menciona. O PDF ainda diz "Adicionais opcionais não estão incluídos neste total"
  (`src/pdf/pages/PageUnidade.tsx:249`).

Ver pendência 11.

---

## 17. Cardápio, sabores e maturação da massa

⚠️ **Divergente — múltiplas fontes e números que não fecham**

### 17.1 Sabores

| Fonte | Salgados | Doces | Total | Referência |
|---|---|---|---|---|
| PDF colorido (listas fixas) | 21 | 6 | **27** | `src/pdf/pages/PageCardapio.tsx:7-13,15-18` |
| PDF P&B (lista única com categoria) | 21 | 6 | **27** | `src/pdf/print/PageCardapioPrint.tsx:11-39` |
| Título do cardápio (ambos) | — | — | **"26 sabores"** | `PageCardapio.tsx:299`, `PageCardapioPrint.tsx:318` |
| Título da página do plano 4 | — | — | **"30 sabores"** | `PageUnidade.tsx:230`, `PageUnidadePrint.tsx:230` |
| `plans.ts` (inclusos) | — | — | **"30 sabores"** | `src/data/plans.ts:105,128,139,151` |
| Tela de Configurações (placeholders) | **21** | **6** | 27 | `src/pages/Settings/index.tsx:577,592` |

Além disso:
- O cardápio colorido respeita `config.pdf.cardapio.salgadosCustomizados` /
  `docesCustomizados` (`PageCardapio.tsx:287-290`), mas o **P&B ignora totalmente** a
  config (usa a lista `SABORES` fixa, `PageCardapioPrint.tsx:308-309`) — um cardápio
  configurado não aparece na versão preta e branca.
- A lista de sabores premium está duplicada com texto diferente: `plans.ts:55-63`
  (`'Pepperoni premium'`) vs `PageCardapio.tsx:20-29` e `PageCardapioPrint.tsx:41-50`
  (`'Pepperoni premium (búfala)'`); o campo `Plano.saboresPremium` é código morto.

### 17.2 Maturação da massa

| Texto | Referência |
|---|---|
| "Massa maturada por **48h**" | `src/data/plans.ts:39` |
| "maturada por **48 horas**" | `src/data/plans.ts:68` |
| "massa maturada **12h**" | `PageCardapio.tsx:299`, `PageCardapioPrint.tsx:318` |
| "**12 horas** de fermentação natural" | `src/types/config.ts:136` (capa padrão) |

### 17.3 Estimativa de pizza no plano 4

"**uma pizza a cada 1,6 pessoa**" (`PageUnidade.tsx:224`, `PageUnidadePrint.tsx:224`) vs o
fator real de 0,6 por equivalente (`calcularPizzasSugeridas`, §3), que é 1 pizza a cada
**1,67** pessoa — e, pior, o texto do PDF usa **pessoas brutas** (§ abaixo).

⚠️ **Divergência de cálculo no PDF do plano 4:** `PageUnidade.tsx:165-169` (e
`PageUnidadePrint.tsx:166-170`) recalculam `pizzasSugeridas` com
`adultos + criancas0a4 + criancas5a9` — **ignorando os multiplicadores infantis** — e usam
esse número no texto e no rótulo "Total estimado". O **valor** impresso
(`total.totalAvista`) vem de `totais.unidade`, que foi calculado corretamente. Resultado:
o texto ("X pizzas p/ Y pessoas") contradiz o total impresso.

**Exemplo:** 20 adultos + 10 crianças de 5–9 → equivalentes 25 → 15 pizzas no cálculo;
o PDF do plano 4 imprime **30 pessoas → 18 pizzas**, mas cobra o total de 15 pizzas.

Ver pendências 6 e 8.

---

## 18. Condição de pagamento no PDF 📄

⚠️ **Divergente**

O PDF de condições imprime: *"Pagamento parcelado ou **30% do valor no Pix**."*
(`src/pdf/pages/PageCondicoes.tsx:224`, P&B em `PageCondicoesPrint.tsx:226`).

Isso contradiz a regra real do app, que é **15% de desconto à vista**
(`config.pdf.adicionais.descontoAvista`), como aparece no comparativo
(`PageComparativo.tsx:301`) e no plano 4 (`PageUnidade.tsx:243`). É um texto fixo, não
derivado da config. Ver pendência 7.

---

## 19. Mensagem de WhatsApp

⚠️ **Divergente — três implementações da mesma mensagem**

A mensagem é montada a partir de `config.whatsapp.template` (padrão em
`src/types/config.ts:106-117`), com as variáveis `{nome}`, `{empresa}`, `{deData}`,
`{emCidade}`, `{condicao}`, `{validadeHoras}`.

| Tela | Condição `{condicao}` | Inclui total? | Referência |
|---|---|---|---|
| Preview | "à vista no Pix com **15%** de desconto" ou "parcelado em 10x" (fixos) | Não | `src/pages/Preview/index.tsx:24-48,80-104` |
| Histórico | mesma frase fixa **+ "· total a partir de R$ X"** (usa `totais.livreSemBebida.totalAvista`) | Sim | `src/pages/History/index.tsx:90-106` |
| Configurações (preview do template) | "à vista no Pix com **15%** de desconto" (fixo) | Não | `src/pages/Settings/index.tsx:351-360` |

Problemas:
- O mesmo orçamento gera textos diferentes em Preview e Histórico (o Histórico acrescenta
  o total).
- O "15%" está fixo nas três, ignorando `config.pdf.adicionais.descontoAvista` e o
  `pagamento` selecionado só troca entre duas frases fixas, sem olhar `parcelas`.
- O telefone é normalizado só com `\D` e prefixado com `55` (`Preview:106-111`,
  `History:103-105`).

Ver pendência 13.

---

## 20. Status do orçamento no histórico

✅ **Implementada** / ⚠️ **Regra de "Rascunho" arbitrária**

`statusDoOrcamento` (`src/pages/History/index.tsx:31-42`) decide, nesta ordem:

```
se criadoEm > agora − 5 minutos        → "Rascunho"  (fresh)
senão se validadeISO < agora           → "Expirado"  (expired)
senão                                  → "Válido"    (ok)
```

- `validadeISO` = `criadoEm + config.validade.horas` (§12).
- A janela de 5 minutos para "Rascunho" não tem relação com a validade nem com o negócio:
  é só um sinal visual de "acabei de criar". Ver pendência 5.

---

## 21. Persistência (localStorage)

✅ **Implementada** — sem backend (MVP)

| Chave | Conteúdo | Referência |
|---|---|---|
| `mana-config:v1` | config completa (`Config`) | `src/storage/config.ts:3` (leitura/escrita `:5-19`) |
| `mana-orcamentos:v1` | array de orçamentos salvos (`OrcamentoSalvo[]`) | `src/storage/orcamentos.ts:7` |
| `mana:theme` | `'dark'` ou `'light'` | `src/hooks/useTheme.ts:5` |

### O que é congelado no histórico

Ao salvar no Preview (`handleSalvar`, `src/pages/Preview/index.tsx:115-119`), o app grava
um **snapshot** do orçamento **mais** os totais calculados naquele momento:

```ts
OrcamentoSalvo = Orcamento & { totais: TotaisPorPlano }   // src/storage/orcamentos.ts:3-5
```

- `salvarOrcamento` insere ou atualiza por `id` (`src/storage/orcamentos.ts:48-59`).
- Os `totais` ficam **congelados**: mudar preços nas Configurações depois não altera os
  totais já salvos. É isso que o Histórico exibe (`History:154,184`) e o que a mensagem
  do Histórico usa (`History:92,101`).
- **Porém**, ao clicar em "Abrir" (`History:66-76`), o app recarrega os **dados** no
  `OrcamentoProvider` e navega para o Preview, que **recalcula** os totais com a config
  atual. Ou seja: o orçamento salvo mostra um valor no Histórico e pode mostrar outro no
  Preview/PDF depois de uma mudança de preço.
- `listarOrcamentos` ordena por `criadoEm` descendente (`src/storage/orcamentos.ts:38-42`).
- `duplicarOrcamento` cria novo `id`, novo `criadoEm` e sufixo `" (cópia)"` no nome
  (`src/storage/orcamentos.ts:65-78`).
- `removerOrcamento` reescreve o array filtrando o id (`src/storage/orcamentos.ts:61-63`)
  — reescreve mesmo se o id não existir.
- Leitura tolerante: `isOrcamentoSalvo` filtra entradas corrompidas
  (`src/storage/orcamentos.ts:27-36`); `readAll` engole `JSON.parse` inválido
  (`:9-20`).

### O que é configurável

Tudo em `Config` (`src/types/config.ts:70-76`), editável em `src/pages/Settings/index.tsx`:

| Bloco | Campos | Efeito real |
|---|---|---|
| `empresa` | 10 campos | nome/WhatsApp aparecem no PDF, na tela e na mensagem; os demais são decorativos |
| `validade.horas` | inteiro ≥ 1 | usado no PDF (agora + horas) e no status do Histórico |
| `editor` | convidados padrão, pagamento padrão, deslocamento padrão | preenche o Editor ao abrir/resetar |
| `whatsapp.template` | texto | base da mensagem de WhatsApp |
| `pdf.precos` | 4 planos × parcelado/à vista | **só `parcelado`** entra no cálculo (§4) |
| `pdf.adicionais` | entrada, cento extra, desconto à vista, parcelas, limite de km | desconto à vista e parcelas entram no cálculo; entrada/cento só no cardápio; limite de km não é lido |
| `pdf.capa` | textos do "Sobre" + 3 promessas + rodapé | aparecem na capa |
| `pdf.cardapio` | listas customizadas de salgados/doces | só no PDF colorido (§17) |

- Merge tolerante de config parcial: `mergeComDefault` (`src/storage/config.ts:21-73`) —
  mescla por seção, cai no default se a seção tiver tipo errado, mas **não valida tipos
  numéricos** (ex.: `validade.horas: "abc"` é aceito).
- Exportar: `exportarConfig` gera JSON indentado (`src/storage/config.ts:87-89`).
- Importar: `importarConfig` faz `JSON.parse` **sem `try/catch`**
  (`src/storage/config.ts:91-96`); a exceção é capturada só na tela de Configurações
  (`src/pages/Settings/index.tsx:36-43`).
- Restaurar padrão: reescreve `CONFIG_DEFAULT` (`src/storage/config.ts:83-85`;
  `src/hooks/useConfig.tsx:86-89`).
- Sincronia entre abas pelo evento `storage` (`src/hooks/useConfig.tsx:38-44`).

---

## 22. Campos opcionais e fallbacks

⚠️ **Divergente em relação ao que se esperaria de um orçamento**

Nada é obrigatório. A geração e o download do PDF funcionam sem nome, data ou local, e o
PDF substitui por textos fixos:

| Campo vazio | Fallback no PDF | Referência |
|---|---|---|
| `cliente.nome` | `'Cliente'` | `src/pdf/pages/PageCapa.tsx:237`; P&B `PageCapaPrint.tsx:242` |
| `evento.data` | `'A agendar'` (capa) / `'A definir'` (`pdfData`) | `PageCapa.tsx:244`; `src/pdf/utils.ts:8-11` |
| `evento.cidadeBairro` | `'Local a combinar'` | `PageCapa.tsx:246`; `PageCapaPrint.tsx:251` |

No Editor, os campos são livres (`src/pages/Editor/index.tsx`), e não há validação de
schema (React Hook Form + Zod estão instalados mas não são usados). Ver pendência 15.

---

## 23. Formatação de valores e datas

✅ **Implementada** (com funções mortas)

| Função | Regra | Usada em produção? |
|---|---|---|
| `formatBRL` | `Intl.NumberFormat('pt-BR', {style:'currency', currency:'BRL'})` | Sim (tela do Histórico, Editor, cardápio P&B) |
| `pdfFormatBRL` | divide valor em `cifrao`/`inteiro`/`centavos` para tipografia do PDF | Sim (todas as páginas do PDF) |
| `pdfData` | `YYYY-MM-DD` ou ISO → `"segunda-feira, 03 de novembro de 2026"`; vazio/inválido → `"A definir"` | Sim |
| `formatBRLCompact` | número sem "R$" | **Não** (só teste) |
| `formatCentavos` | string `"inteiro,centavos"` | **Não** (só teste) |
| `parseBRL` | texto → número | **Não** (só teste) |
| `roundParcela` | `round(total/parcelas × 100)/100` | Sim (§10) |
| `applyDescontoAvista` | `round(total × (1−desconto) × 100)/100` | Sim (§9) |
| `dataValidade` | `criadoEm + horas` via `setHours` | **Não** (código morto) |

- Dinheiro: `src/utils/money.ts:1-35`.
- Datas/PDF: `src/pdf/utils.ts:1-18`.
- Observação: `pdfData` fixa meio-dia quando recebe data sem hora
  (`src/pdf/utils.ts:10`), para evitar deslocamento de fuso.
- Um 4º formato inline de moeda existe em `PageCapa.tsx` (`toLocaleString` direto) e um
  em `PageCardapio.tsx:351` (`toFixed(2).replace('.', ',')`).

---

## 24. Código morto e divergências consolidadas

### Código morto confirmado

| Item | Referência | Observação |
|---|---|---|
| `validarDeslocamento` | `src/utils/calculo.ts:121-136` | Só chamada por teste |
| `dataValidade` | `src/utils/calculo.ts:138-142` | Só chamada por teste; bug de DST |
| `BATE_LIMITE_HORAS` | `src/data/plans.ts:166` | Nunca lido |
| `ADICIONAL_ENTRADA`, `ADICIONAL_SALGADO_EXTRA` | `src/data/plans.ts:162-163` | Só reexportados em `OPCIONAIS` como texto |
| `Plano.saboresPremium` | `src/data/plans.ts:26,55-63` | Nenhum código lê; o cardápio usa listas próprias (`PageCardapio.tsx:20-29`, `PageCardapioPrint.tsx:41-50`), com texto divergente |
| `parseBRL`, `formatCentavos`, `formatBRLCompact` | `src/utils/money.ts:10-27` | Só testes |
| `precoPizzaParcelado` | `src/data/plans.ts:22,145` | Nunca lido: o plano 4 calcula com `precoPessoaParcelado` (`calculo.ts:41`) |
| `precoPessoaAvista` / `precoPizzaAvista` de `plans.ts` | `src/data/plans.ts:45,97,121,144,146` | `precoPessoaAvista` é copiado para `precoPlano().avista` (`calculo.ts:42`), mas esse campo nunca é consumido; só `precoPizzaAvista` é lido, como rótulo em `PageUnidade.tsx:171` |
| `config.pdf.precos.*.avista` | `src/types/config.ts:36-39` | Ignorado no cálculo |
| `config.pdf.adicionais.limiteKmDeslocamento` | `src/types/config.ts:47` | Write-only |
| Bônus `'Deslocamento até 25 km'` | `src/data/plans.ts:84,108,131,154` | Nunca renderizado |

> **Não é código morto:** `Plano.destaquesPremium` (`src/data/plans.ts:27,65-82`) é
> **renderizado** no card do Premium no comparativo, em ambos os PDFs
> (`src/pdf/pages/PageComparativo.tsx:282,315-324`;
> `src/pdf/print/PageComparativoPrint.tsx:284,313-321`). Só `saboresPremium` está morto.

### Divergências entre telas, cálculo e PDF

| # | Divergência | Pendência |
|---|---|---|
| 1 | Multiplicadores infantis são constantes não confirmadas | 1 |
| 2 | Preço "à vista" configurável é ignorado | 2 |
| 3 | Desconto manual vale para os 4 planos e não aparece no PDF | 3 |
| 4 | Deslocamento é somado a todos os planos | 4 |
| 5 | Validade calculada de duas origens | 5 |
| 6 | PDF do plano 4 recalcula pizzas com pessoas brutas | 6 |
| 7 | "30% do valor no Pix" no PDF vs 15% no app | 7 |
| 8 | "26 sabores" vs 27 na lista vs "30" nos planos | 8 |
| 9 | Hora extra após 22h é só texto | 9 |
| 10 | Quitação 1 dia antes é só texto | 10 |
| 11 | Adicionais nunca somados | 11 |
| 12 | Bônus de 25 km nunca aplicado | 12 |
| 13 | Três mensagens de WhatsApp divergentes | 13 |
| 14 | Nenhuma tela mostra o total ao vivo | 14 |
| 15 | Nada é obrigatório no orçamento | 15 |
| 16 | Parcelamento perde centavos quando não divisível | — (bug de implementação) |
| 17 | Cardápio P&B ignora o cardápio configurado | — (bug de implementação) |
| 18 | Rótulos "15%" fixos em vez de derivados da config | — (consistência) |

Regras de negócio em aberto (todas dependem de decisão do cliente) estão detalhadas em
[`PENDENCIAS-DE-PRODUTO.md`](./PENDENCIAS-DE-PRODUTO.md).
