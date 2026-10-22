# Landing site (New Landing Page)

Figma canvas "New Landing Page" `7797:4614` (file `Bin8roWL8sloyc36IgFMuT`), built 2026-10-22. Single look (no Playful/Focused toggle) — ⚠️ ASSUMPTION, not confirmed with the user. Mock/static content only; anything Figma doesn't draw is inert (logs only).

## Routes (outside `MainLayout`, own nav/footer) — ✅ VERIFIED in `src/App.jsx`

| URL                    | Page                            | Figma desktop / tablet / mobile                                                            |
| ---------------------- | ------------------------------- | ------------------------------------------------------------------------------------------ |
| `/`                    | `pages/landing/LandingHomePage` | LP-01 `7797:7854` / `7815:264459` / `7815:272276`                                          |
| `/how-it-works`        | `HowItWorksPage` (P-01)         | `7797:19953` / `7815:280356` / `7815:286952`                                               |
| `/features`            | `FeaturesPage` (P-02)           | `7797:26426` / `7815:261355` / `7815:262836`                                               |
| `/opportunities`       | `OpportunitiesPage` (P-03)      | `7797:27590` / `7815:303443` / `7815:304934` (+ filters sheet `7815:306490`, `?filters=1`) |
| `/for-parents-schools` | `ForParentsSchoolsPage` (P-04)  | `7797:28950` / `7815:296546` / `7815:297710`                                               |
| `/stories`             | `StoriesPage` (P-05)            | `7797:30021` / `7815:298873` / `7815:299931`                                               |
| `/faq`                 | `FaqPage` (P-06)                | `7797:31009` / `7815:300988` / `7815:302216`                                               |
| `/coming-soon`         | `ComingSoonPage` (CS-01..03)    | `?state=default\|joined\|error` ⚠️ param name is ours                                      |

URL slugs are ⚠️ ASSUMPTION (not drawn in Figma); constants in `src/constants/landingRoutes.js`.

## Structure

- Shared (`components/sections/landing/shared/`): `LandingNav` (desktop ≥1280 / tablet / mobile + full-screen menu), `LandingFooter` (S11), `FinalCta` (S10), `PageHero`, `KenteStripe` (exact Figma geometry, 740px period), `LandingShell`.
- Home sections (`landing/home/`): Hero, PartnerStrip, HowItWorks, Features (LP-A); Opportunities, MadeForGhana, ForEveryone, Stories, Faq (LP-B).
- Page folders: `howItWorks/ features/ opportunities/ parentsSchools/ stories/ faq/ comingSoon/`.
- Images: `src/assets/landing/` (from the Figma image fills, optimised to webp/png).
- `ComingSoonPage` does not use `LandingShell` (its frames carry their own top bar/strip, no S10/S11).

## Verification (2026-10-22) — ✅ VERIFIED

`npm run build` OK; eslint clean; no horizontal overflow and no page errors on all 10 routes at 320/430/834/1280/1440/1728. Section heights are within ~10px of Figma at 1728 and mostly ±25px at tablet/mobile; leftovers are font fallbacks (SF Pro Rounded/Bricolage absent on the dev machine). Not pixel-diffed.

## Known gaps

- **Icons (home sections S1–S9):** now the exact Figma vectors — REST svg export of the icon instances (`home/LpFigmaIcons.jsx`) plus the feature-card icons the user pasted from Dev Mode (`home/LpFeatureCardIcons.jsx`). ✅ VERIFIED visually. **Inner pages (P-01..P-06, Coming Soon) still use hand-redrawn icons** — 🔶 same export recipe applies (images endpoint, `format=svg`, one id per icon name).
- **Animations/hover:** hero float cards bob 10px, 1.6s ease-in-out alternate infinite (`.lp-float` in `index.css`, from the Figma float variants); Features cards hover = rotate −1° + lime hard shadow (Figma `State=Hover` variant has no readable children, so lift/shadow offset were estimated from its render) — 🔶. Job cards (S5) also have a Figma hover variant that is not built yet.
- **Partner logos** (strip): Figma draws empty 32×32 slots + names; real logo files needed.
- `PageHero` has a fixed 459×402 photo; Figma varies per page (P-03 376×338 desktop, 806×460 tablet…) so hero heights differ (P-01 608 vs 579, tablet/mobile off by 30–130px). No doodle star; kente is 8px (P-02 draws 14px).
- Home hero mobile lacks the iOS status-bar mock (Figma includes it, +47px).
- Coming Soon is ~150px taller than Figma at 1728; success/error states not visually checked. P-04 parents section 78–213px short at tablet/mobile (cause unknown). P-05 "more stories" grid 31px short at 1728.
- FAQ: only first item has answer copy in Figma; audience tabs on S7 only have Recruiters content. Footer links, language switch, filters/heart/sort on P-03 are inert.
- Hidden Figma layers (S5 kente stripe, S6 vertical pattern) not built.
- The old `pages/LandingPage.jsx` + `sections/landing/HeroSection.jsx`/`HeroPhotoCard.jsx` are now unused (not deleted — needs a yes).

## Interactions (2026-10-22) — ✅ VERIFIED in browser

- Nav is sticky (`fixed`; gets a translucent dark-green blurred backdrop after 8px scroll — ⚠️ backdrop not drawn in Figma). Active nav link is bold + underlined as in P-0x frames.
- Underlined links (`.lp-ul` in `index.css`) draw their underline left→right on hover/focus (450ms); footer links use `.lp-ul-hover`.
- S5 job cards: hover → dark border + green hard shadow (from the Figma hover variants' render; offset estimated 🔶).
- S7 audience tabs: all four variants (Students/Parents/Schools/Recruiters) with their copy, photo and sticker colour; copy/photo fade-slide out/in on switch (350ms ease-out). Variant contents were read from renders (REST returns variant components with no children).
- S9 FAQ: all six answers (hidden "expanded" text of the Figma items), independent toggles, 300ms height+fade expand.
- S10 Final CTA (updated Figma): no kente strip, gold "starts today.", sub ends "after the first three stages."; footer has no strip either.
- ⚠️ The Figma file changed after the first pull (CTA copy, strip) — other frames may have drifted too; re-pull before a pixel pass.

## Inner pages — headings & icons (2026-10-22)

- `PageHero`: h1 is Bricolage 600 at 67/50/34px (desktop/tablet/mobile), tracking −0.02em, last phrase gold (`accent` prop); no kente strip at the bottom of any hero (home hero included).
- Section titles on P-01..P-06 use `shared/AccentText` (green `#387440` on light sections, gold `#ffd86b` on dark) with the sizes read from the Figma character overrides (P-01/03/04/05/06: 47/35/32; P-02 deep-dives 40/30/32; P-01 Free-and-fair 37/34/30).
- P-01 icons are the exact Figma paste (`howItWorks/HowItWorksFigmaIcons.jsx`): chip map-pin, stages 5/7/8 (Work, Certificates, Goals), colour trophy (Top Talent), After-profile card 4. Other inner-page icons are still hand-drawn 🔶.
