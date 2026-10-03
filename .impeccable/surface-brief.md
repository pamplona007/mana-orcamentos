# Surface Brief — Editor de Orçamentos (Maná Pizzas)

> Mantido como lembrete durável para agentes futuros. Atualizar quando a direção ou escopo mudar.

**Mode:** Operate (atendente no balcão completando uma tarefa). O mundo é o que a marca é, não o que a página vira.

**Surface scope:** a página `Editor` (rota principal do app, onde o atendente monta o orçamento). Preview/History herdam este sistema.

**Visitor:** atendente da Maná Pizzas & Eventos, no celular ou desktop, durante o expediente, gerando um PDF por cliente. Tempo-alvo: 90 segundos do zero ao PDF baixado.

**Job:** converter dados do evento (cliente, data, convidados, adicionais) em 4 totais comparados e 1 PDF premium pronto pra WhatsApp.

**Action:** clicar "Selecionar" no plano escolhido, revisar o total ao vivo, abrir Preview, baixar PDF, abrir WhatsApp com texto pré-preenchido.

**Memorable moment:** a primeira vez que o atendente clica no Premium e vê o card inteiro ganhar uma borda wine animada, o badge "RECOMENDADO" aparecer com fade-up, e o preço em 96px Fraunces deslizar pro canto com glow sutil. Os outros 3 planos ficam com 1px coal, em silêncio — a hierarquia é a mensagem.

**Constraints:**
- Mobile-first (≥360px) e desktop (até 1440px)
- WCAG AA (contraste, foco visível, ARIA em toggles e stepper)
- Sem backend, sem auth, sem DB no MVP
- PDF gerado no client (`@react-pdf/renderer`)

**Unresolved:**
- Multiplicadores infantis (0-4 = grátis, 5-9 = meia) — confirmar com Lucas antes da Fase 4
- Persistência entre atendentes — v2

---

## Direction contract

**THESIS:** O PDF atual trata os 4 planos como linhas de texto equivalentes. O app reverte isso: o Premium é o produto principal, os outros 3 são alternativas. A calculadora aparece ao vivo na coluna direita enquanto o atendente digita — então o Premium deixa de ser "mais caro" e vira "quanto eu entrego a mais por R$ X/pessoa".

**OWN-WORLD:** Paleta `trattoria editorial` — tinta preta profunda (`#0E0B08`), espresso elevado (`#1A130D`), creme quente (`#F5E9D7`) como foreground, ferrugem (`#B5471B`) como CTA, vinho (`#6B1F2A`) carrega o Premium, ocre (`#D4A24A`) para inclusos. Tipografia: **Fraunces** (serif variável com italic editorial) nos displays e preços, **Inter** no corpo e chrome. Density: shell arejado (8px baseline), cards com surface coal `rgba(255,255,255,0.03)` sobre 1px hairline.

**STORY:** o atendente abre o app, vê o comparativo com o Premium destacado, escolhe rápido porque a hierarquia visual fez o trabalho, ajusta número de convidados com steppers grandes, vê o total respirar ao vivo, abre Preview, baixa o PDF. O PDF carrega a mesma marca no cliente — fechamento editorial, não orçamento de padaria.

**FIRST VIEWPORT (1366×900 desktop, 390×844 mobile):**
- Header 64px: logo Maná à esquerda (placeholder text com Fraunces), ThemeToggle (dark/light) à direita, indicador discreto "Salvo automaticamente" no centro
- Body: grid 2 colunas em desktop (form 60% / sticky summary 40%), coluna única em mobile (summary colapsa em bottom-sheet)
- Comparativo de planos: 4 PlanCards em grid responsivo. O Premium (2º da esquerda) ocupa 1.4x a altura dos outros, borda wine 2px, badge "RECOMENDADO" no canto superior direito com animação de pulse suave (3s loop), ícone coroa (Tabler `Crown`) acima do título em 48px
- Sticky summary (desktop): card coal elevado, label "TOTAL" em ocre tracked-wide, valor em Fraunces 56px, breakdown abaixo em 2 linhas (parcelado 10x | à vista pix)
- Sticky summary (mobile): bottom sheet com handle, expansível

**FORM (signature interaction + motion grammar):**
1. *Selecionar plano*: clique no PlanCard → borda wine anima de 0 a 2px em 240ms ease-out, badge "RECOMENDADO" dos outros 3 desaparece em 120ms, card selecionado ganha sombra wine `0 8px 24px -8px rgba(107,31,42,0.5)`, escala sutil `1.0 → 1.02` em 180ms ease-out
2. *Stepper de convidados*: clique no `+` → número anima de N para N+1 com tween de 200ms ease-out (Fraunces), linha de total no summary anima de Velho para Novo em 300ms ease-out exponencial
3. *Auto-save indicator*: depois de 800ms sem input, fade-in "✓ Salvo" no header por 1.6s, fade-out
4. *Transição Editor → Preview*: o card de resumo sticky expande para fullscreen em 320ms com `clip-path` inset(0) → inset(0 0 100% 0), revelando o PDF abaixo com fade-in 240ms

**FINISH:** unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.

**Seed key:** code-led-direct (no concept-seed binary available; direction written inline per `craft-floor.md` calibration guard — eschewed the "warm cream ground + serif + terracotta" training default by going full dark with rust+wine and committed density; face choice is Fraunces, not the default Lora/Playfair for "food"). Build path recorded in `.impeccable/config.json` as `code`.
