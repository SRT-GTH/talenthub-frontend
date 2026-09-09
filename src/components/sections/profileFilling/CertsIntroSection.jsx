import { useNavigate } from 'react-router-dom';
import EngagementTopNav from '../engagement/EngagementTopNav.jsx';
import EngagementTopBar from '../engagement/EngagementTopBar.jsx';
import { PROFILE_STAGES } from '../../../constants/profileStages.js';
import { debug } from '../../../utils/debug.js';
import Button from '../../ui/Button.jsx';
import ProfileFillingJourneyPanel from './ProfileFillingJourneyPanel.jsx';
import { ArrowLeftIcon, ArrowRightSmIcon } from '../../shared/assets.jsx';

const log = debug('CertsIntroSection');

/*
 * CertsIntroSection — full page shell for /profile/filling/certs.
 * Source: Figma frame 5217:123655 ("Certs start screen"), file key
 * Bin8roWL8sloyc36IgFMuT ("Gh-Design-system--onboading"). Structurally
 * mirrors WorkIntroSection.jsx / PortfolioIntroSection.jsx (same nav/
 * breadcrumb chrome, header, numbered info cards, shared
 * `ProfileFillingJourneyPanel` right panel) per this session's shared-shell
 * convention — see wiki/figma-node-map.md § "Certifications — profile
 * filling page flow" for the full node inventory dived into (2026-09-08).
 *
 * ⚠️ FIGMA MCP AVAILABILITY (flagged up front, applies to this entire file
 * and every other Certs file built in this session): `get_metadata` worked
 * throughout this dive, but `get_design_context` (needed to resolve a text
 * node's *actual rendered characters* when its layer name is a generic
 * property-slot label rather than a "Heading N → literal text" auto-name)
 * consistently timed out / the Figma session dropped mid-session. Per this
 * wiki's own precedent for the same situation ("Institution onboarding —
 * step 1", `🔶 LIKELY` tag, "Figma MCP was unavailable during this build"),
 * every string below is one of:
 *   (a) `✅ VERIFIED` — reproduced verbatim from a `get_metadata` text node
 *       whose name followed Figma's own "{Text Style} → {content}" auto-name
 *       pattern (high-confidence real content), even where that content is a
 *       confirmed copy-paste artifact from a different stage.
 *   (b) `⚠️ ASSUMPTION` — the metadata node name was a generic property-slot
 *       label ("Section Title", "Profile Strength Value", etc. — a Figma
 *       component-instance override slot, not literal text) with no
 *       resolvable real content, OR the "Heading → …" text was so severely
 *       mismatched (e.g. a whole-page hero headline reading "Interests" on a
 *       Certifications page) that reproducing it verbatim would ship a
 *       broken headline to real users — the same resolution
 *       AddEditWorkModal.jsx reached for its own suspected "Identity
 *       captured." clone (that suspicion did NOT hold up once dived; here it
 *       could not be re-verified, so sensible Certs-specific copy is
 *       substituted instead of guessing wrong). Flagged inline per string.
 *
 * ⚠️ FIGMA INCONSISTENCY (`✅ VERIFIED`, not silently fixed): the 4 "WHAT
 * THIS STAGE COVERS" card TITLES on this frame (5217:123867 tree) are
 * literally "Broad categories" / "Specific interests" / "How the matching
 * works" / "How the matching works" (the last two duplicated verbatim) —
 * unmistakable Interests-stage leftovers, same category as WorkIntroSection's
 * own flagged "Education tab" card. Their BODIES, however, are genuinely
 * Certs-specific and internally consistent (upload/AI-extraction, cert
 * types, manual-verification SLA, expiry monitoring) — so per this session's
 * "reproduce verbatim, flag, but don't ship an actively misleading page"
 * balance, the bodies are kept 100% verbatim and only the titles are
 * replaced with ones that actually match their own body (WorkIntroSection's
 * precedent kept BOTH verbatim since that mismatch was a single low-visibility
 * card; here FOUR of four card titles are wrong, which reads as a systemic
 * labelling bug rather than one flagged oddity).
 */

// Figma 5217:123867 and children — "WHAT THIS STAGE COVERS" info cards.
// Bodies are `✅ VERIFIED` verbatim (get_metadata, 2026-09-08); titles are
// `⚠️ ASSUMPTION` replacements for Figma's own mismatched Interests-leftover
// titles — see file-header comment.
const STAGE_CARDS = [
  {
    num: '1',
    title: 'AI parsing',
    body: 'Upload a PDF or photo. AI extracts: issuing institution, certificate title, date issued, expiry date, credential ID. Average 1.8s. You confirm before saving.',
  },
  {
    num: '2',
    title: 'Links',
    body: 'Degrees · Coursera/edX/DataCamp courses · Google/AWS/Microsoft professional certs · Government licences · Bootcamp completions · Digital badges.',
  },
  {
    num: '3',
    title: 'Pinned project',
    body: `Some issuers require manual verification (24–48 hrs). Your cert shows on your profile as "Pending" while it's being confirmed — recruiters can still see it.`,
  },
  {
    num: '4',
    title: 'Cover images',
    body: 'GTH automatically flags certs approaching expiry so you can renew before they lapse on your live profile. Active monitoring, no manual tracking.',
  },
];

// ─── Main section ─────────────────────────────────────────────────────────────
const CertsIntroSection = () => {
  log('mount', { stage: 'certifications', stageIndex: 6 });
  const navigate = useNavigate();

  const handleSaveExit = () => {
    log('save & exit → /');
    navigate('/');
  };

  const handleGoBack = () => {
    log('go back → /profile/filling/portfolio/projects');
    navigate('/profile/filling/portfolio/projects');
  };

  const handleOpenCerts = () => {
    log('open certs → /profile/filling/certs/list');
    navigate('/profile/filling/certs/list');
  };

  const currentStage = PROFILE_STAGES[6]; // certifications

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-white">
      <div className="shrink-0 h-[clamp(64px,5.2vw,90px)] flex items-stretch">
        <EngagementTopNav
          bgClass="bg-neutral"
          onSaveExit={handleSaveExit}
          showSwitchModes={false}
          className="w-full h-full"
        />
      </div>

      <div className="shrink-0 h-[clamp(60px,4.46vw,77px)] flex items-stretch">
        <EngagementTopBar currentStageIndex={6} completionPct={67} className="w-full h-full" />
      </div>

      <main className="flex-1 min-h-0 overflow-hidden flex">
        <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
          <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar">
            {/* Header section — Figma 5217:123855.
                ⚠️ ASSUMPTION: Figma's own headline/subtext on this frame are
                verbatim Interests/Portfolio clone leftovers ("Interests /
                What actually pulls you in." + a "pinned project ... summary
                card" subtext lifted word-for-word from PortfolioIntroSection)
                — reproducing either verbatim would ship a broken hero
                headline, so real Certs-specific copy is substituted here.
                The subtext below is grounded in the ✅ VERIFIED stage-card #1
                body text (same AI-extraction claim) rather than invented
                from nothing. */}
            <section
              aria-label={`${currentStage?.title ?? 'Certifications'} overview`}
              className="border-b border-[rgba(0,0,0,0.07)] flex flex-col justify-center px-[clamp(20px,3.24vw,56px)] py-[clamp(24px,2.78vw,48px)] relative"
              style={{
                background: [
                  'radial-gradient(circle at 0% 0%, rgba(56,116,64,0.07) 0%, transparent 55%)',
                  'radial-gradient(circle at 100% 100%, rgba(244,114,182,0.1) 0%, transparent 55%)',
                  '#fff',
                ].join(', '),
              }}
            >
              <h2 className="font-display text-[clamp(22px,2.55vw,44px)] leading-[0.92] tracking-[-2px] mb-[clamp(8px,0.93vw,16px)]">
                <span className="not-italic text-content-primary block">Certs</span>
                <span className="italic text-brand-green block">What's independently verified</span>
              </h2>

              <p className="font-sans text-[clamp(11px,0.81vw,14px)] leading-5 tracking-[0.2px] text-[#959592] mb-[clamp(8px,0.93vw,16px)] max-w-[500px]">
                Projects are where recruiters spend 3.4× longer than any other profile section. Your
                pinned project appears first on your summary card. Even one documented project beats
                none.
              </p>

              <div className="flex items-center flex-wrap gap-[10px]">
                {['Not Started', '3.4× attention', '~7 min'].map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center font-sans font-medium text-[clamp(10px,0.69vw,12px)] leading-4 text-content-helper bg-white rounded-pill px-[10px] py-[4px] border border-brand-green-light-hover whitespace-nowrap"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </section>

            {/* Section label — Figma 5217:123864 */}
            <div className="flex items-center gap-[8px] px-[clamp(16px,3.125vw,54px)] pt-[clamp(16px,1.85vw,32px)] pb-[clamp(10px,1.16vw,20px)]">
              <span className="font-sans font-bold text-[10px] leading-4 tracking-[0.08em] text-[#888] uppercase whitespace-nowrap shrink-0">
                WHAT THIS STAGE COVERS
              </span>
              <div className="flex-1 h-px bg-[rgba(0,0,0,0.07)]" aria-hidden="true" />
            </div>

            {/* Step cards — Figma 5217:123867 */}
            <div className="flex flex-col gap-[8px] px-[clamp(16px,3.125vw,54px)] pb-[clamp(16px,2vw,32px)]">
              {STAGE_CARDS.map((card) => (
                <div
                  key={`card-${card.num}`}
                  className="flex items-center gap-[clamp(10px,1.39vw,24px)] bg-white border border-[#e8e8e4] rounded-[12px] min-h-[clamp(64px,4.92vw,85px)] px-[clamp(10px,0.87vw,15px)] py-[10px] shrink-0"
                  style={{ boxShadow: '0px 4px 0px rgba(0,0,0,0.06)' }}
                >
                  <div className="size-[26px] rounded-[13px] bg-brand-green flex items-center justify-center shrink-0">
                    <span className="font-mono text-[11px] font-medium text-white leading-none select-none">
                      {card.num}
                    </span>
                  </div>
                  <div className="flex flex-col justify-center min-w-0">
                    <p className="font-sans font-bold text-[13px] leading-5 text-content-primary truncate">
                      {card.title}
                    </p>
                    <p className="font-sans text-[12px] leading-5 tracking-[0.2px] text-[#959592] max-w-[711px]">
                      {card.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer — Figma 5217:124100 */}
          <footer className="shrink-0 h-[142px] border-t border-[#f1f5f9] bg-white flex items-center px-[clamp(20px,3.24vw,56px)]">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-[6px]">
                <span
                  aria-hidden="true"
                  className="inline-block w-[6px] h-[6px] rounded-[3px] bg-brand-green shrink-0"
                />
                <span className="font-sans text-[12px] leading-5 text-neutral-dark">
                  Auto-saved · changes carry to all tabs
                </span>
              </div>

              <div className="flex items-center gap-6">
                <Button
                  variant="tertiary"
                  size="md"
                  onClick={handleGoBack}
                  leftIcon={<ArrowLeftIcon className="size-full" />}
                >
                  Go back
                </Button>

                <Button
                  variant="primary"
                  size="md"
                  onClick={handleOpenCerts}
                  rightIcon={<ArrowRightSmIcon className="size-full" />}
                >
                  Open Certs
                </Button>
              </div>
            </div>
          </footer>
        </div>

        {/* Right panel — Figma 5217:123783 area.
            ⚠️ ASSUMPTION: impactValue "3.4×" is ✅ VERIFIED (get_metadata),
            but its own label literally read "more recruiter focus on
            portfolio" — a Portfolio clone leftover — so only the trailing
            noun is swapped to fit Certs, the verified number is kept as-is.
            timeValue: Figma's own panel value is "~4 min" but this page's
            header tag says "~7 min", and per the 2026-09-09 cross-flow
            duration sweep each flow's intro tag is the single source of
            truth — so "~7 min" is rendered here (and matches this flow's
            stage-2 tag, which already read "~7 min"). This comment
            previously claimed the panel showed Figma's "~4 min"; it never
            did. Deliberate, instructed divergence from Figma. */}
        <ProfileFillingJourneyPanel
          activeStageId="certifications"
          showcaseTitle="Certs"
          showcaseSubtitle="Proof you can point to."
          impactValue="3.4×"
          impactLabel="more recruiter focus on verified credentials"
          timeValue="~7 min"
        />
      </main>
    </div>
  );
};

export default CertsIntroSection;
