# Commit Sheet: Maná Pizzas (Editor de Orçamentos)

> Required by the Auteur skill before any markup. Seven non-default decisions on paper. Companion to `.impeccable/surface-brief.md` (Impeccable direction contract: different format, same intent).

## 1. Peak

**The single signature moment:** the instant an attendant clicks the Premium plan, the card *physically grows*. Its border thickens from 1px coal to 2px wine over 240ms, the "RECOMENDADO" badge fades in with a 3s pulse loop, the card scales 1.00 → 1.02, and the total in the sticky summary simultaneously tweens from old → new price in 300ms with a subtle wine glow. The other 3 plans go quiet. Hierarchy *is* the message: Premium is the protagonist, the others are the supporting cast.

## 2. Color

- **Primary (committed tier):** `#6B1F2A` wine (OKLCH ~37% L, ~0.13 C, hue 27). Owns the Premium plan, the "recomendado" badge, the active state, the shadow glow on selection.
- **CTA:** `#B5471B` rust (OKLCH ~46% L, ~0.13 C, hue 38). Owns the "Baixar PDF" and "Enviar no WhatsApp" actions.
- **Foreground:** `#F5E9D7` cream (OKLCH ~91% L, ~0.04 C, hue 70). Body text. NOT pure white.
- **Background lightness target:** mean L = `0.08` (very dark). Measured, not mood.
- **Tier:** Committed (wine takes 30-40% of the page through the Premium plan + selection states + summary shadow).

**Why this is not lavender, not cream, and not the category reflex:** Brazilian food-services apps reflex to warm cream + serif + terracotta (the AI default 2024-2026). Maná Pizzas is a *premium* brand, dark-room mood, evening event. A dark base with wine as a single saturated role commits more than a creamy surface with terracotta accent. The wine says "premium occasion", the cream says "readable", and the rust says "act". Not neutral, not a mood, a commitment.

## 3. Type

- **Display:** Fraunces (variable, opsz 9-144, with italic). Editorial, optical-size aware, has both a high-contrast display voice and a small-text body voice. Chosen for the "cardápio manuscrito meets revista" feel. Variable opsz lets us use the same family for 96px hero and 14px labels.
- **Body:** Inter (400, 500, 600, 700). Workhorse UI sans, tabular numerals for prices, no display use.
- **Why not Inter as display:** we're not. Inter stays in the chrome. Display voice is Fraunces, always. `auteur-allow: BAN-8 -- Inter paired with Fraunces (variable opsz editorial) keeps Inter as the body sans that doesn't compete with display; the alternative was IBM Plex Sans which would steal the warm register Fraunces owns.`

## 4. Grid break

The 4-up PlanCard grid is **asymmetric in height, not in width**. The Premium card is 1.4× the height of the other three (more space for the "Por que Premium" expanded list and the badge). All 4 cards align to a single shared top-baseline; Premium's bottom extends 40% further. The 3 secondary cards are identical in size. This breaks the "bento grid of equal cells" reflex (Auteur BAN-15). The grid itself communicates the hierarchy before any color or weight does.

## 5. Motion budget

3 scroll-pattern families, one peak (per Auteur):
1. **Entrance:** content fades in with translateY(8px) on mount, 240ms ease-out. Per-element, not per-section (no identical fade-up everywhere).
2. **Selection state (PEAK):** wine border thickening + scale 1.02 + shadow glow + badge pulse, 240ms ease-out. Tween library: CSS transitions on transform/opacity only.
3. **Price change:** total in summary tweens from old → new with `requestAnimationFrame`, 300ms ease-out, count-up via JS. Uses a custom hook `useTweenedValue`.

No scroll-scrub. No parallax. No "reveal on scroll". This is an Operate-mode app, not a marketing site; the attendant is working, not reading a story.

## 6. Reflex check

- **(a) First-order reflex for "food-services app":** warm cream background, terracotta accent, friendly sans, soft cards, "BOOK NOW" big button. This is the SaaS restaurant-template of 2024-2026.
- **(b) Second-order reflex (avoiding a):** dark mode + neon green or amber accent + monospace labels + "industrial" wordmark. Trying too hard to be "not cream".
- **(c) Our deviation:** dark *editorial*. Wine + rust + cream (not neon, not monochrome). Fraunces italic (not Impact, not mono). The dark is justified by the *use scene* (premium event at night, often after 18h), not by aesthetic. If this were a SaaS for lunch orders, the page would be cream. The deviation is **dark because the product happens at night**, not dark because dark is premium-coded.

## 7. House tells broken

Auteur's house tells, measured across 9 showcase builds (8/9 dark, 3 within 0.002 L). For this project, I am deliberately **not** doing:
- **Near-black + single neon accent (Auteur tell #1):** replaced by dark-warm base + dual saturated role (wine + rust) + warm cream foreground. Three roles, not one.
- **Mono service labels (Auteur tell #2):** Inter is sans, not mono. Mono would imply "technical / control panel" which is the wrong register for a pizzaria events tool. (Acknowledged ban broken: `auteur-allow: TELL-2 -- service labels in tracked sans Inter 11px UPPERCASE letter-spacing 0.08em, color cream-dim, give the editorial "section number" feel without a mono font.`)

## Verification gates (per Auteur)

- [ ] `slopscan.mjs` exits 0
- [ ] `shoot.mjs` produced screenshots at 390 / 768 / 1440 and each was reviewed
- [ ] Numeric rubric passes (contrast, LCP, CLS, reduced-motion journey)
- [ ] No `auteur-allow` is unjustified; both above are argued in-line
