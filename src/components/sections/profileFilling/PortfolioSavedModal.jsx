import Modal from '../../ui/Modal.jsx';
import Button from '../../ui/Button.jsx';
import { debug } from '../../../utils/debug.js';
import { CheckIcon, ArrowRightIcon } from '../../shared/assets.jsx';
import { PROJECT_ICON_GRADIENT, getProjectTypeEmoji } from './portfolioProjectTypeStyles.js';

const log = debug('PortfolioSavedModal');

/*
 * PortfolioSavedModal — success overlay shown after saving a project (add OR
 * edit). Source: Figma frame 5217:122490 ("div.succ-card:shadow"), headline
 * 5217:122496, checklist row 5217:122500, mini-list rows 5217:122510 /
 * 5217:122520 / 5217:122532, profile-strength bar 5217:122542, CTA button
 * 5217:122551. File key Bin8roWL8sloyc36IgFMuT. Structurally mirrors
 * WorkSavedModal.jsx — same rules applied here:
 *
 * WHEN this opens: per WorkSavedModal.jsx's established rule for this
 * session, this opens after every successful save (add AND edit) — the same
 * "Confirm → success" pattern every other stage uses — not on some invented
 * "every Nth project" milestone gate.
 *
 * Figma's headline description ("5 projects, 1 pinned...") is a static demo
 * snapshot — this modal computes the real project/pinned counts from the
 * live `projects` array instead. "3.4×" (recruiter attention multiplier) and
 * "52% : 4 stages done" (profile-strength bar) are kept as Figma's literal
 * static values — no real analytics or cross-stage completion tracking is
 * wired up anywhere in this app yet, matching WorkSavedModal's own reasoning
 * for keeping the equivalent numbers static.
 *
 * The CTA's leading glyph is hand-crafted (not pulled from Figma path data)
 * for the same reason WorkSavedModal's `CornerArrowIcon` is: Figma's own
 * asset reference for this button slot resolves to the exact same SVG hash
 * used elsewhere for an unrelated "20-delete" icon in the Edit modal — an
 * internal Figma component-variant mix-up, not a real distinct icon to pull.
 */

const CornerArrowIcon = ({ className }) => (
  <svg
    viewBox="0 0 14 14"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
  >
    <path d="M4 2v5a2 2 0 0 0 2 2h5M8 6l3 3-3 3" />
  </svg>
);

const PortfolioSavedModal = ({ isOpen, onClose, onContinue, projects = [] }) => {
  const projectCount = projects.length;
  const pinnedCount = projects.filter((p) => p.isPinned).length;
  const previewProjects = projects.slice(0, 3);

  log('mount', { isOpen, projectCount, pinnedCount });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      ariaLabel="Portfolio saved"
      contentClassName="!rounded-[24px] !border-3 !border-[#c1d4c4] !max-w-[482px] overflow-hidden"
    >
      <div className="relative flex flex-col items-center gap-[18px] p-[clamp(24px,3vw,40px)] text-center">
        {/* Top glow — same colour as the CTA button below (Button `secondary`
            variant, #c8951a). Every success modal gets this treatment. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-[-90px] size-[240px] -translate-x-1/2 rounded-full opacity-70 blur-[70px]"
          style={{ background: 'radial-gradient(circle, #c8951a 0%, transparent 70%)' }}
        />

        <span className="text-[48px] leading-none" aria-hidden="true">
          🏆
        </span>

        <div className="flex flex-col items-center gap-[6px]">
          <h2 className="font-display text-[clamp(24px,2.4vw,32px)] tracking-[-1.2px] leading-[1.1]">
            <span className="not-italic text-[#111]">Portfolio </span>
            <span className="italic text-brand-green">complete.</span>
          </h2>
          <p className="font-sans text-[13px] text-[#70706e] leading-[1.5] max-w-[380px]">
            {projectCount} project{projectCount !== 1 ? 's' : ''}, {pinnedCount} pinned. Recruiters
            now spend 3.4× longer on your profile and can filter you by project type.
          </p>
        </div>

        {/* Checklist row — Figma 5217:122500 */}
        <div
          className="w-full rounded-[4px] px-[10px] py-[14px] flex items-center gap-[10px]"
          style={{ background: 'rgba(235,241,236,0.5)' }}
        >
          <span className="size-8 rounded-full bg-[#cce5cc] border border-[#2a5730] flex items-center justify-center shrink-0">
            <CheckIcon className="size-[18px] text-[#2a5730]" />
          </span>
          <div className="flex flex-col items-start gap-[4px] text-left">
            <span className="font-sans font-semibold text-[14px] text-[#2a5730]">
              Portfolio filter unlocked in recruiter search
            </span>
            <p className="font-sans text-[12px] text-[#96a090] leading-[18px]">
              Recruiters can now filter for &ldquo;has portfolio&rdquo; — one of the most-used
              filters in GTH. Your pinned project title appears on every search result card.
            </p>
          </div>
        </div>

        {/* Mini project-list preview — Figma 5217:122510-122532. The icon
            column is a narrow (42px), FULL ROW HEIGHT green-gradient strip
            (Figma metadata: w=42 h=55, matching the row's own height) with a
            per-type emoji — a previous version used a small isolated
            31×31 box instead, which is why it looked wrong compared to the
            main list's own compact-row cards (PortfolioStage2Section.jsx). */}
        {previewProjects.length > 0 && (
          <div className="w-full flex flex-col gap-[8px]">
            {previewProjects.map((p) => (
              <div
                key={p.id}
                className="flex items-stretch gap-[10px] rounded-[10px] border border-[#e8e8e4] bg-white overflow-hidden"
              >
                <span
                  className="w-[42px] shrink-0 flex items-center justify-center"
                  style={{ background: PROJECT_ICON_GRADIENT }}
                  aria-hidden="true"
                >
                  <span className="text-[16px] leading-none">
                    {getProjectTypeEmoji(p.projectType)}
                  </span>
                </span>
                <div className="flex items-center gap-[10px] flex-1 min-w-0 py-[8px] pr-[12px]">
                  <div className="flex flex-col items-start min-w-0 flex-1">
                    <span className="font-sans font-bold text-[12px] text-[#111] truncate">
                      {p.title}
                    </span>
                    <span className="font-sans text-[10px] text-[#70706e] truncate">
                      {p.projectType} · {p.year}
                    </span>
                  </div>
                  {p.isPinned && (
                    <span className="inline-flex items-center shrink-0 rounded-full border border-[#c1d4c4] bg-[#ebf1ec] px-[8px] py-[3px] font-sans font-semibold text-[10px] text-[#2a5730]">
                      ⭐ Pinned
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Profile strength progress bar — Figma 5217:122542.
            "52% : 4 stages done" is Figma's own static value — see file
            header comment on why this isn't computed live. */}
        <div className="w-full flex flex-col gap-[6px]">
          <div className="flex items-center justify-between">
            <span className="font-sans text-[10px] text-[#111]">Profile strength</span>
            <span className="font-sans text-[10px] text-[#2a5730]">52% : 4 stages done</span>
          </div>
          <div className="h-[8px] w-full rounded-[4px] bg-[#f8f8f4] border border-[#e8e8e4] overflow-hidden">
            <div
              className="h-full rounded-[3px]"
              style={{ width: '52%', background: 'linear-gradient(90deg, #387440, #69da78)' }}
            />
          </div>
        </div>

        <Button
          variant="secondary"
          size="lg"
          onClick={onContinue}
          rightIcon={<ArrowRightIcon className="size-full" />}
          className="w-full"
        >
          Continue to Certs stage
        </Button>
      </div>
    </Modal>
  );
};

export default PortfolioSavedModal;
