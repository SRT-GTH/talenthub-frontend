import { useState, useEffect } from 'react';
import Modal from '../../ui/Modal.jsx';
import Button from '../../ui/Button.jsx';
import { TextInput, Select, Textarea } from '../../ui/form';
import { debug } from '../../../utils/debug.js';
import {
  CloseIcon,
  ArrowLeftIcon,
  WorkDeleteWarningIcon,
  HelperTextIcon,
} from '../../shared/assets.jsx';
import { INDUSTRY_OPTIONS, OPPORTUNITY_TYPES, TIMEFRAME_OPTIONS } from './goalTypeStyles.js';

const log = debug('AddEditGoalModal');

/*
 * AddEditGoalModal — single form component for both the Add-Goal and
 * Edit-Goal flows, switched via the `mode` prop ('add' | 'edit') per
 * CLAUDE.md's shared-component-reuse rule and AddEditCertModal.jsx /
 * AddEditWorkModal.jsx / AddEditPortfolioModal.jsx's established precedent.
 *
 * Source (all ✅ VERIFIED via real `get_design_context` dives, 2026-09-09,
 * file key Bin8roWL8sloyc36IgFMuT):
 *   Add mode   — 5622:90104 "Overlay centred card" (whole subtree in one
 *                call), inside frame 5622:89666.
 *   Edit mode  — 5625:90924 "Overlay centred card" inside frame 5625:90578
 *                ("Edits Goals"); its header (5625:90930) and footer
 *                (5625:91327) were dived separately.
 *
 * Card shell: bg-white, 3px #c1d4c4 border, rounded-24, Figma's
 * bottom.300 elevation. Close button: 28px #ebf1ec circle, top-right.
 *
 * ── Verbatim copy inventory ────────────────────────────────────────────
 *   Badge (5622:90112 / 5625:90932) — "Add A Goal", with the design
 *     system's dot marker (8px, bg #c1d4c4, 1.5px #1d7c4d border,
 *     0 0 4px #387440 glow).
 *   Headline (5622:90114 / 5625:90934) — mixed style: plain "New Goals. "
 *     + italic green "Where do you want to go?".
 *   Subtitle (5622:90115 / 5625:90935) — "Add one clear goal at a time
 *     with salary, location, and timeline so recruiters know if you fit
 *     before contacting you."
 *   Four numbered sections (NOT three): 1 "Role & opportunity type"
 *     (5622:90142), 2 "Location & timeline" (5622:90203), 3 "Salary /
 *     compensation range" (5622:90220), 4 "Notes for recruiters"
 *     (5625:90547).
 *   Footer — Add: "Cancel" + "Save Goals" (5622:90255/90256). Edit:
 *     "Delete this Goal" destructive pill (#f9ebea / #ebc2bd / #c0392b,
 *     5625:91329-91332) + "Save Changes" (5625:91333).
 *
 * ── ❓ NEEDS-CLARIFICATION (flagged, reproduced verbatim, NOT fixed) ────
 *   1. Edit mode reuses Add mode's badge AND headline verbatim in Figma
 *      ("Add A Goal" / "New Goals. Where do you want to go?", confirmed by
 *      a dedicated dive on 5625:90930). That is almost certainly a clone
 *      leftover, but since BOTH mode's nodes literally carry the same
 *      strings there is no second source to substitute from, so both modes
 *      render it as designed. Only the footer differs (which IS genuinely
 *      different in Figma).
 *   2. Two placeholders are clone leftovers from OTHER stages, reproduced
 *      verbatim per the never-invent-copy rule:
 *        - "Role or opportunity" (5622:90152) →
 *          "e.g. Google Data Analytics Certificate, WASSCE, AWS Cloud
 *          Practitioner…"  (a Certs placeholder)
 *        - "Skills or subjects covered" (5622:90170) →
 *          "e.g. Solo developer — Lead UX designer — Backend engineer on a
 *          team of 4…"  (a Work/Portfolio placeholder)
 *        - "Maximum per month" (5622:90237) → "https://…"  (a Certs
 *          badge-URL placeholder)
 *   3. Section 2's second field is labelled "Opportunity type" with default
 *      "Any type" — the same label as Section 1's own select, inside a
 *      section titled "Location & timeline", while the populated goal cards
 *      render a timeline chip no field produces. See goalTypeStyles.js's
 *      TIMEFRAME_OPTIONS comment for the full write-up. Label + placeholder
 *      are Figma-verbatim; the option list is Figma's own card values.
 *
 * ── ⚠️ Stray decorative asterisks (deliberately NOT reproduced) ─────────
 *   Every section frame carries two pink (#fb7185) "*" text nodes at wild
 *   absolute offsets (e.g. 5622:90143 at left:-495.83px, 5622:90144 at
 *   right:-89.17px) — they sit outside their own parent's box and are not
 *   attached to any label. These are Figma file artifacts, not
 *   required-markers, and are skipped. The REAL required markers are the
 *   green (#2e8b57) asterisks rendered inline inside each `label` node,
 *   which the shared `Field` component already produces via `required`.
 *
 * ── Required-field judgment call (documented per CLAUDE.md) ─────────────
 *   Figma puts a genuine green required-asterisk on SIX fields: Role or
 *   opportunity, Skills or subjects covered, Preferred location, Salary /
 *   compensation range (min), Maximum per month, and Description. Industry
 *   / sector and both "Opportunity type" selects carry no marker.
 *
 *   The two SALARY asterisks directly contradict the rest of the design:
 *   the intro page's own stage card #2 says compensation range is "Optional
 *   but high-value" (Figma 5619:81218/81219, ✅ VERIFIED), and this modal's
 *   own tip block is a persuasive "Why add a salary range?" pitch
 *   (5622:90240) rather than a requirement notice. Same shape as the Certs
 *   "either/or" case AddEditCertModal.jsx already resolved.
 *
 *   Resolution (identical to that precedent): render all six asterisks
 *   exactly as Figma draws them — the asterisk documents Figma's visual
 *   truth — but gate `canSubmit` only on the four non-contradicted fields
 *   (role, skills, location, description). Salary never blocks submission.
 */

const EMPTY_FORM = {
  role: '',
  industry: '',
  opportunityType: '',
  skillsText: '',
  location: '',
  timeframe: '',
  salaryMin: '',
  salaryMax: '',
  description: '',
};

// Small shared shell for each numbered form section — Figma 5622:90142 and
// siblings (rounded-24, 1px #e8e8e4, 22px inset, 22px green number pill,
// 12px semibold title on a #f8f8f4 hairline).
const FormSection = ({ num, title, children }) => (
  <div className="rounded-[24px] border border-[#e8e8e4] bg-white p-[22px] flex flex-col gap-[16px]">
    <div className="flex items-center gap-[10px] border-b border-[#f8f8f4] pb-[10px]">
      <span className="size-[22px] rounded-[11px] bg-brand-green flex items-center justify-center shrink-0">
        <span className="font-sans font-bold text-[11px] text-white leading-none">{num}</span>
      </span>
      <span className="font-sans font-semibold text-[12px] text-[#111]">{title}</span>
    </div>
    {children}
  </div>
);

const AddEditGoalModal = ({ isOpen, onClose, onSave, mode = 'add', initialData = null }) => {
  const isEditMode = mode === 'edit';
  const [form, setForm] = useState(EMPTY_FORM);

  log('mount', { isOpen, mode, initialDataId: initialData?.id });

  useEffect(() => {
    if (isOpen) {
      log('open — resetting form', { mode, prefill: Boolean(initialData) });
      setForm(
        initialData
          ? { ...EMPTY_FORM, ...initialData, skillsText: (initialData.skills ?? []).join(', ') }
          : EMPTY_FORM
      );
    }
  }, [isOpen, initialData, mode]);

  const update = (field, value) => {
    log('field change', { field, value });
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // See the file-header "Required-field judgment call" block — salary is
  // deliberately excluded from the submit gate despite carrying an asterisk
  // in Figma.
  const canSubmit = Boolean(
    form.role.trim() && form.skillsText.trim() && form.location.trim() && form.description.trim()
  );

  const handleSubmit = () => {
    if (!canSubmit) {
      log('branch: submit blocked — required fields incomplete', {
        role: Boolean(form.role.trim()),
        skills: Boolean(form.skillsText.trim()),
        location: Boolean(form.location.trim()),
        description: Boolean(form.description.trim()),
      });
      return;
    }
    const skills = form.skillsText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    log(isEditMode ? 'save goal edit' : 'add goal', { ...form, skills });
    onSave({
      ...(isEditMode && initialData ? { id: initialData.id } : {}),
      ...form,
      skills,
    });
    onClose();
  };

  // Edit mode's footer is "Delete this Goal" + "Save Changes" (no separate
  // Cancel) — ✅ VERIFIED verbatim from 5625:91327's own dive. Add mode
  // keeps "Cancel" + "Save Goals" (5622:90254), since there's nothing to
  // delete yet.
  const footer = (
    <div className="border-t border-[rgba(0,0,0,0.07)] bg-white px-[clamp(20px,2.5vw,40px)] py-[16px] flex items-center justify-between">
      {isEditMode && initialData?.onDelete ? (
        <button
          type="button"
          onClick={initialData.onDelete}
          className="flex items-center gap-[7px] rounded-[10px] border border-[#ebc2bd] bg-[#f9ebea] px-[18px] py-[14px] font-sans font-bold text-[12px] text-[#c0392b] transition-colors duration-150 hover:bg-[#f6ddda]"
        >
          <WorkDeleteWarningIcon className="size-4" />
          Delete this Goal
        </button>
      ) : (
        <Button
          leftIcon={<ArrowLeftIcon className="size-full text-[#111111]" />}
          variant="tertiary"
          size="md"
          onClick={onClose}
        >
          Cancel
        </Button>
      )}
      <Button variant="primary" size="md" onClick={handleSubmit} disabled={!canSubmit}>
        {isEditMode ? 'Save Changes' : 'Save Goals'}
      </Button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      ariaLabel={isEditMode ? 'Edit goal' : 'Add a goal'}
      showClose={false}
      contentClassName="!max-w-[889px] !rounded-[24px] !border-3 !border-[#c1d4c4] overflow-hidden p-0"
      footer={footer}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-[28px] top-[28px] z-10 size-[28px] rounded-[20px] bg-[#ebf1ec] flex items-center justify-center text-brand-green hover:bg-[#c1d4c4] transition-colors duration-150"
      >
        <CloseIcon className="size-[12px]" />
      </button>

      <div className="px-[clamp(24px,4vw,48px)] pt-[clamp(28px,3vw,48px)] pb-[clamp(20px,2vw,32px)] flex flex-col gap-[20px]">
        {/* Header — Figma 5622:90110. See ❓ note #1: Edit mode carries the
            same badge/headline in Figma, so both modes render it. */}
        <div className="flex flex-col items-center gap-[16px] text-center">
          <div
            className="flex items-center gap-[6px] h-[24px] px-[32px] rounded-[6px] border border-[#c1d4c4] shrink-0"
            style={{ background: 'rgba(235,241,236,0.5)' }}
          >
            <span
              className="size-[8px] rounded-full shrink-0 bg-[#c1d4c4]"
              style={{ border: '1.5px solid #1d7c4d', boxShadow: '0px 0px 4px 0px #387440' }}
            />
            <span className="font-sans text-[12px] leading-[18px] text-[#999] tracking-[0.2px] whitespace-nowrap">
              Add A Goal
            </span>
          </div>

          <div className="flex flex-col items-center gap-[4px]">
            <h2 className="font-display text-[clamp(22px,2.4vw,32px)] tracking-[-1.2px] leading-[1.1] text-[#111]">
              New Goals. <span className="italic text-[#387440]">Where do you want to go?</span>
            </h2>
            <p className="font-sans text-[12px] text-[#959592] tracking-[0.2px] leading-[18px] max-w-[600px]">
              Add one clear goal at a time with salary, location, and timeline so recruiters know if
              you fit before contacting you.
            </p>
          </div>
        </div>

        {/* Section 1 — Figma 5622:90142 */}
        <FormSection num="1" title="Role & opportunity type">
          <TextInput
            size="xs"
            label="Role or opportunity"
            required
            helperIcon={<HelperTextIcon />}
            helperIconClassName="text-[#2e8b57]"
            helperText="Use a title a recruiter would recognise. You can add multiple goals at different seniority levels."
            value={form.role}
            onChange={(e) => update('role', e.target.value)}
            /* ❓ clone-leftover placeholder, verbatim — see file header #2 */
            placeholder="e.g. Google Data Analytics Certificate, WASSCE, AWS Cloud Practitioner…"
          />

          <div className="flex flex-col sm:flex-row gap-[16px] sm:gap-[35px]">
            <div className="flex-1">
              <Select
                size="xs"
                label="Industry / sector"
                options={INDUSTRY_OPTIONS}
                value={form.industry}
                onChange={(value) => update('industry', value)}
                placeholder="Select…"
              />
            </div>
            <div className="flex-1">
              <Select
                size="xs"
                label="Opportunity type"
                options={OPPORTUNITY_TYPES}
                value={form.opportunityType}
                onChange={(value) => update('opportunityType', value)}
                placeholder="Select…"
              />
            </div>
          </div>

          <TextInput
            size="xs"
            label="Skills or subjects covered"
            required
            helperIcon={<HelperTextIcon />}
            helperIconClassName="text-[#2e8b57]"
            helperText="These appear as searchable tags on your goal card."
            value={form.skillsText}
            onChange={(e) => update('skillsText', e.target.value)}
            /* ❓ clone-leftover placeholder, verbatim — see file header #2 */
            placeholder="e.g. Solo developer — Lead UX designer — Backend engineer on a team of 4…"
          />
        </FormSection>

        {/* Section 2 — Figma 5622:90203 */}
        <FormSection num="2" title="Location & timeline">
          <div className="flex flex-col sm:flex-row gap-[16px] sm:gap-[35px]">
            <div className="flex-1">
              <TextInput
                size="xs"
                label="Preferred location"
                required
                helperIcon={<HelperTextIcon />}
                helperIconClassName="text-[#2e8b57]"
                helperText="Be as flexible or specific as you are. Recruiters filter by this."
                value={form.location}
                onChange={(e) => update('location', e.target.value)}
                placeholder="e.g. Accra, Remote, Anywhere in Ghana, UK…"
              />
            </div>
            <div className="flex-1">
              {/* ❓ NEEDS-CLARIFICATION — Figma-verbatim label + placeholder
                  that duplicate Section 1's own select; wired to the goal
                  card's timeline chip. Full write-up in goalTypeStyles.js
                  (TIMEFRAME_OPTIONS) and in this file's header, note #3. */}
              <Select
                size="xs"
                label="Opportunity type"
                options={TIMEFRAME_OPTIONS}
                value={form.timeframe}
                onChange={(value) => update('timeframe', value)}
                placeholder="Any type"
              />
            </div>
          </div>
        </FormSection>

        {/* Section 3 — Figma 5622:90220 */}
        <FormSection num="3" title="Salary / compensation range">
          <div className="flex flex-col sm:flex-row gap-[16px] sm:gap-[35px]">
            <div className="flex-1">
              <TextInput
                size="xs"
                label="Salary / compensation range"
                required
                value={form.salaryMin}
                onChange={(e) => update('salaryMin', e.target.value)}
                placeholder="e.g. GHS 3,000 minimum per month"
              />
            </div>
            <div className="flex-1">
              <TextInput
                size="xs"
                label="Maximum per month"
                required
                value={form.salaryMax}
                onChange={(e) => update('salaryMax', e.target.value)}
                /* ❓ clone-leftover placeholder, verbatim — see file header #2 */
                placeholder="https://…"
              />
            </div>
          </div>

          {/* "Why add a salary range?" note — Figma 5622:90239/90240/90241,
              ✅ VERIFIED verbatim. */}
          <div className="flex flex-col gap-[7px]">
            <span className="font-sans font-bold text-[12px] text-brand-green">
              Why add a salary range?
            </span>
            <p className="font-sans text-[11px] text-[#111] opacity-85 leading-[19.25px]">
              Profiles with a salary range get 60% fewer mismatched outreach messages from
              recruiters whose budget doesn&rsquo;t match yours. Only recruiters within your range
              (or who choose to reach out anyway) will contact you.
            </p>
          </div>
        </FormSection>

        {/* Section 4 — Figma 5625:90547 */}
        <FormSection num="4" title="Notes for recruiters">
          <Textarea
            label="Description"
            required
            rows={4}
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
            placeholder="Any extra context — flexibility, constraints, what you're looking for in a team or company, remote vs in-office preference, anything a recruiter should know before reaching out…"
          />
        </FormSection>
      </div>
    </Modal>
  );
};

export default AddEditGoalModal;
