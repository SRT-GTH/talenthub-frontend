import Modal from '../../ui/Modal.jsx';
import Button from '../../ui/Button.jsx';
import { debug } from '../../../utils/debug.js';
import { WorkRoleIcon, CheckIcon, ArrowRightIcon } from '../../shared/assets.jsx';

const log = debug('WorkSavedModal');

/*
 * WorkSavedModal — success overlay shown after saving a role (add OR edit).
 * Source: Figma frame 5113:122447 ("success"), overlay node 5113:122832.
 *
 * Restyled 2026-09-06 via real get_design_context dives on the headline/
 * card (5113:122834), the checklist row (5113:122844), the mini-list rows
 * (5113:122862 Internship / 5113:122870 National Service), the profile-
 * strength bar (5113:122878), and the CTA button (5113:122887) — the
 * previous pass's guess (plain "Role saved, and it shows." headline, a
 * flat green CTA, all-green status pills) didn't match any of these.
 * Verified now:
 *   - Headline is "Work History " (plain) + "complete." (italic brand-green),
 *     not "Role saved, and it shows."
 *   - The mini-list's status pills use a DIFFERENT palette than the main
 *     RoleCard list (workRoleStatusStyles.js) — Internship is amber here
 *     (RoleCard has it neutral-grey) and National Service is blue here
 *     (RoleCard has it amber). Figma specs these two lists independently;
 *     rather than force one shared map to cover both and get one of them
 *     wrong, this modal keeps its own local SUCCESS_STATUS_STYLES.
 *   - CTA is the same amber token as Button's `secondary` variant
 *     (#c8951a / #967014), with a small leading glyph + the shared
 *     `ArrowRightIcon` (Figma names it "20-arrow-right", the exact same
 *     icon already used elsewhere in this codebase) — not a plain green
 *     "Continue →".
 *
 * WHEN this opens: Figma's copy ("4 roles, 3+ years of experience...") is a
 * static demo snapshot, not evidence of a "some Nth save" trigger rule — a
 * previous version invented an "every 4th role added" milestone gate to
 * match that hardcoded number, which (a) was never verified against
 * anything real and (b) never fired on edits at all. This modal now opens
 * after every successful save (add AND edit) — the same "Confirm → success"
 * pattern every other stage in this app already uses — and computes its own
 * role count / years-of-experience from the live `roles` array instead of
 * reproducing Figma's fixed numbers.
 *
 * "52% : 4 stages done" (profile-strength bar) is kept as Figma's literal
 * static value — real cross-stage profile completion isn't wired up
 * anywhere in this app yet (every other stage's own "X% complete" label is
 * similarly a pinned static mock), so computing a live number here would be
 * inventing data the rest of the app doesn't have.
 */

// Success-modal-specific status pill colours (Figma 5113:122844-area) —
// deliberately NOT reusing workRoleStatusStyles.js's map, see file header.
const SUCCESS_STATUS_STYLES = {
  Current: { bg: '#ebf1ec', border: '#c1d4c4', text: '#2a5730' },
  Internship: { bg: '#faf4e8', border: '#eedeb8', text: '#c8951a' },
  'National Service': { bg: '#eaeffb', border: '#bfcef2', text: '#0369a1' },
};

// Small leading glyph on the CTA button (Figma's own asset name for this
// node was an opaque hash with no icon-set identifier, so hand-crafted per
// CLAUDE.md Rule 3 — bounding box + stroke colour only, no path data pulled
// from Figma MCP).
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

// Rough duration-string → months parser ("1yr 7mo" / "2yr" / "4mo") so the
// headline's years-of-experience figure reflects the live `roles` array
// instead of Figma's fixed "3+ years".
const parseDurationToMonths = (duration) => {
  if (!duration) return 0;
  const years = /(\d+)\s*yr/.exec(duration);
  const months = /(\d+)\s*mo/.exec(duration);
  return (years ? Number(years[1]) * 12 : 0) + (months ? Number(months[1]) : 0);
};

const WorkSavedModal = ({ isOpen, onClose, onContinue, roles = [] }) => {
  const roleCount = roles.length;
  const totalMonths = roles.reduce((sum, r) => sum + parseDurationToMonths(r.duration), 0);
  const totalYears = Math.floor(totalMonths / 12);
  const yearsLabel = totalYears >= 1 ? `${totalYears}+ years` : 'under a year';
  const previewRoles = roles.slice(0, 3);

  log('mount', { isOpen, roleCount, yearsLabel });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      ariaLabel="Work history saved"
      contentClassName="!rounded-[24px] !border-3 !border-[#c1d4c4] !max-w-[480px] overflow-hidden"
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
          <h2 className="font-display text-[clamp(24px,2.4vw,32px)] tracking-[-1px] leading-[1.1]">
            <span className="not-italic text-[#111]">Work History </span>
            <span className="italic text-brand-green">complete.</span>
          </h2>
          <p className="font-sans text-[13px] text-[#70706e] leading-[1.5] max-w-[380px]">
            {roleCount} role{roleCount !== 1 ? 's' : ''}, {yearsLabel} of experience. Your profile
            now appears in senior role searches on GTH.
          </p>
        </div>

        {/* Checklist row — Figma 5113:122844 */}
        <div
          className="w-full rounded-[4px] px-[10px] py-[14px] flex items-center gap-[10px]"
          style={{ background: 'rgba(235,241,236,0.5)' }}
        >
          <span className="size-8 rounded-full bg-[#cce5cc] border border-[#2a5730] flex items-center justify-center shrink-0">
            <CheckIcon className="size-[18px] text-[#2a5730]" />
          </span>
          <div className="flex flex-col items-start gap-[4px] text-left">
            <span className="font-sans font-semibold text-[14px] text-[#2a5730]">
              Senior role matching unlocked
            </span>
            <p className="font-sans text-[12px] text-[#96a090] leading-[18px]">
              Recruiters filtering for 1–3 year experience roles can now find you. Work history is
              one of the top three filters in GTH recruiter search.
            </p>
          </div>
        </div>

        {/* Mini role-list preview — Figma 5113:122852-area */}
        {previewRoles.length > 0 && (
          <div className="w-full flex flex-col gap-[8px]">
            {previewRoles.map((r) => {
              const statusStyle =
                SUCCESS_STATUS_STYLES[r.statusTag] ?? SUCCESS_STATUS_STYLES.Internship;
              return (
                <div
                  key={r.id}
                  className="flex items-center gap-[10px] rounded-[10px] border border-[#e8e8e4] bg-white px-[12px] py-[8px]"
                >
                  <span className="size-[31px] rounded-[4px] bg-[rgba(235,241,236,0.5)] flex items-center justify-center shrink-0">
                    <WorkRoleIcon className="size-[15px] text-brand-green" />
                  </span>
                  <div className="flex flex-col items-start min-w-0 flex-1">
                    <span className="font-sans font-bold text-[12px] text-[#111] truncate">
                      {r.jobTitle}
                    </span>
                    <span className="font-sans text-[10px] text-[#70706e] truncate">
                      {r.isCurrent
                        ? `${r.organisation} — ${r.location}`
                        : `${r.organisation} · ${r.duration}`}
                    </span>
                  </div>
                  <span
                    className="inline-flex items-center shrink-0 rounded-full border px-[8px] py-[3px] font-sans font-semibold text-[10px]"
                    style={{
                      background: statusStyle.bg,
                      borderColor: statusStyle.border,
                      color: statusStyle.text,
                    }}
                  >
                    {r.statusTag}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Profile strength progress bar — Figma 5113:122878.
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
          Continue to Portfolio stage
        </Button>
      </div>
    </Modal>
  );
};

export default WorkSavedModal;
