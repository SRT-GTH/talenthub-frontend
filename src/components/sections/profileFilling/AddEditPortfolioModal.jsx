import { useState, useEffect } from 'react';
import Modal from '../../ui/Modal.jsx';
import Button from '../../ui/Button.jsx';
import { TextInput, Select, Textarea, Upload } from '../../ui/form';
import { debug } from '../../../utils/debug.js';
import {
  CloseIcon,
  ArrowLeftIcon,
  HelperTextIcon,
  WorkDeleteWarningIcon,
} from '../../shared/assets.jsx';
import { PROJECT_TYPES, getYearOptions } from './portfolioProjectTypeStyles.js';

const log = debug('AddEditPortfolioModal');

/*
 * AddEditPortfolioModal — single form component for both the Add-Project and
 * Edit-Project flows, switched via the `mode` prop ('add' | 'edit') per
 * CLAUDE.md's shared-component-reuse rule and AddEditWorkModal.jsx's
 * established precedent (same file serves both modes; Edit just pre-fills
 * values and swaps the footer).
 *
 * Source (all dived via get_design_context, 2026-09-07): 5178:102292
 * "Overlay centred card" (Add), 5215:114592 (Edit, same shape). File key
 * Bin8roWL8sloyc36IgFMuT.
 *
 * ⚠️ FIGMA INCONSISTENCY (flagged, not silently fixed — same "never silently
 * fix Figma copy" rule the Work flow established): this modal's Figma frames
 * were evidently cloned from the Skills "Add a skill" modal and only
 * partially re-copy-edited for Portfolio. Reproduced verbatim below:
 *   - The small status badge above the headline literally reads "Add A
 *     skill" in BOTH Add and Edit mode (5178:102300 / 5215:114600) — should
 *     logically read "Add a project" / "Editing project".
 *   - The subtitle under the headline reads "Fill in the name, set your
 *     proficiency honestly, and tag it to a category. That's it — you can
 *     verify it later." in BOTH modes (5178:102303 / 5215:114603) —
 *     "proficiency" and "verify it later" are Skills-flow concepts with no
 *     equivalent here. A hidden node in the same tree (5178:102386 / node
 *     name "Skills Lab — verify Excel & SQL next", `hidden="true"` in
 *     Figma's own layer tree) further confirms the clone — respected here by
 *     NOT rendering it, same treatment as the Work modal's hidden "Editing
 *     banner".
 *   - The "Figma / design file link" field's helper text (5204:112623 helper)
 *     reads "Say what you personally built, even if the project was a group
 *     effort." — identical, word-for-word, to the "Your specific role"
 *     field's own helper a few rows up (5209:112760 / 5215:114649). Kept
 *     verbatim on both fields per the same rule.
 *   - The headline itself and the section titles/descriptions were all
 *     independently verified NOT to have this problem — only the two
 *     header-area strings above and the one duplicated helper are affected.
 *
 * ⚠️ SECTION NUMBERING (flagged, corrected for UX clarity): Figma's own badge
 * numerals literally show "2" on BOTH the Cover-image section (5178:102307)
 * and the Project-basics section (5209:112738) — a numbering slip, not an
 * intentional shared step. Renumbered sequentially 1-4 here (Cover image →
 * Project basics → Description → Technologies & links) since a UI numbering
 * a user actually reads needs to be sequential; the badge text is decorative
 * chrome, not data pulled from a Figma variable.
 *
 * ⚠️ REQUIRED-FIELD ASTERISKS ON LINK FIELDS (business-logic call, not a
 * blind copy): Figma's "Required Indicator" asterisk nodes for this section
 * are positioned via absolute offsets that land far off-frame (e.g.
 * `left: -495.83px`), i.e. they're visibly detached from any specific field
 * in the Figma file itself — not reliable evidence of which fields are
 * actually required. Treating "Live link or demo" AND "Figma / design file
 * link" as both hard-required (as a literal asterisk count would suggest)
 * would make it impossible to save a project with only a GitHub link, which
 * contradicts the intro page's own "Multiple links per project" / "any live
 * URL" framing. All three link fields (Live link, GitHub, Figma) are
 * therefore optional at the code level; only Project title, Project type,
 * Year, Your specific role, Description and Technologies gate submit.
 *
 * "Project Type" renders as a `Select` (not a plain `TextInput`, despite
 * Figma's own instance for this slot using the generic unswapped "Input
 * ields" component with placeholder text "writing field" — an authoring gap,
 * not a deliberate plain-text field) because the surrounding copy
 * (5211:112848 "a colour is set automatically from your project type below")
 * and the intro page's own list of project kinds only make sense against a
 * fixed option set — see portfolioProjectTypeStyles.js for the option list
 * and the (invented, flagged) colour-per-type mapping.
 *
 * The cover-image upload composes the shared `ui/form/Upload` component
 * directly (drag-and-drop + browse, default 173px height matches Figma's own
 * 173px dropzone exactly) rather than hand-rolling a dropzone — per
 * CLAUDE.md's reuse-shared-components rule. The pinned-project switch has no
 * existing shared Toggle/Switch primitive in this codebase (checked
 * `ui/form/` — only Checkbox exists), so it's hand-rolled directly with
 * Figma's exact track/knob visual (5211:112852) rather than forcing it
 * through Checkbox's very different shelf-button visual language.
 */

// Matches the "20-alert" symbol Field.jsx already uses internally for its
// own helperText row (that component doesn't export its icon, so it's
// reproduced here for the standalone cover-image note below, which isn't
// attached to any single input).
const AlertIcon = ({ className }) => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
    <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.4" />
    <path d="M8 4.5v4.25" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <circle cx="8" cy="11.4" r="0.85" fill="currentColor" />
  </svg>
);

const DESCRIPTION_MAX = 600;

// Figma 5204:112556 — the description textarea's own placeholder is this
// exact 3-line prompt (verbatim, confirmed via get_design_context).
const DESCRIPTION_PLACEHOLDER =
  '1. The problem or goal\n2. What you built or designed\n3. The result or outcome (include numbers where possible)\n\n\nExample: "Built a real-time bus tracking app for Accra commuters. Aggregated route data from 40+ drivers via a lightweight PWA. Used by 200+ commuters during the KNUST pilot."';

// Figma 5204:112591 — "Strong description patterns" tips card (verbatim,
// confirmed via get_design_context; the single flowing Figma string is split
// into a lead line + bullet list here purely for layout, text unchanged).
const STRONG_PATTERN_LEAD =
  'Problem → What you built → Outcome with a number  •  “Reduced task completion time 28% in usability testing”  •  “Used by 200+ commuters during pilot”  •  “1,200+ readers on publication”';

const EMPTY_FORM = {
  title: '',
  projectType: '',
  year: '',
  role: '',
  description: '',
  technologiesText: '',
  liveLink: '',
  githubLink: '',
  figmaLink: '',
  isPinned: false,
  coverImage: null,
};

const AddEditPortfolioModal = ({ isOpen, onClose, onSave, mode = 'add', initialData = null }) => {
  const isEditMode = mode === 'edit';
  const [form, setForm] = useState(EMPTY_FORM);
  const [coverFilename, setCoverFilename] = useState(null);

  log('mount', { isOpen, mode, initialDataId: initialData?.id });

  useEffect(() => {
    if (isOpen) {
      log('open — resetting form', { mode, prefill: Boolean(initialData) });
      setForm(
        initialData
          ? {
              ...EMPTY_FORM,
              ...initialData,
              technologiesText: (initialData.technologies ?? []).join(', '),
            }
          : EMPTY_FORM
      );
      setCoverFilename(null);
    }
  }, [isOpen, initialData, mode]);

  const update = (field, value) => {
    log('field change', { field, value });
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCoverSelect = (fileOrFiles) => {
    const file = Array.isArray(fileOrFiles) ? fileOrFiles[0] : fileOrFiles;
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    log('cover image selected', { name: file.name });
    setCoverFilename(file.name);
    update('coverImage', previewUrl);
  };

  const canSubmit =
    form.title.trim() &&
    form.projectType &&
    form.year &&
    form.role.trim() &&
    form.description.trim() &&
    form.technologiesText.trim();

  const handleSubmit = () => {
    if (!canSubmit) return;
    const technologies = form.technologiesText
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    log(isEditMode ? 'save project edit' : 'add project', { ...form, technologies });
    onSave({
      ...(isEditMode && initialData ? { id: initialData.id } : {}),
      ...form,
      technologies,
    });
    onClose();
  };

  // Edit mode's footer is Delete + Save (no separate Cancel), same pattern
  // AddEditWorkModal.jsx established; Add mode keeps Cancel + Save since
  // there's nothing to delete yet. Both modes' Save button reads "Save
  // Changes" verbatim — confirmed identical via get_design_context on BOTH
  // the Add footer (5217:122741) and the Edit footer (5215:114749), so
  // (unlike AddEditWorkModal's Add/Edit distinction) this is not a
  // copy-paste slip to correct, just how Figma specs this particular modal.
  const footer = (
    <div className="border-t border-[rgba(0,0,0,0.07)] bg-white px-[clamp(20px,2.5vw,40px)] py-[16px] flex items-center justify-between">
      {isEditMode && initialData?.onDelete ? (
        <button
          type="button"
          onClick={initialData.onDelete}
          className="flex items-center gap-[7px] rounded-[10px] border border-[#ebc2bd] bg-[#f9ebea] px-[14px] py-[10px] font-sans font-bold text-[12px] text-[#c0392b] transition-colors duration-150 hover:bg-[#f6ddda]"
        >
          <WorkDeleteWarningIcon className="size-4" />
          Delete this Project
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
      <Button
        variant="primary"
        size="md"
        onClick={handleSubmit}
        disabled={!canSubmit}
        className={isEditMode ? '!py-[10px] !text-[12px] !leading-[normal]' : undefined}
      >
        Save Changes
      </Button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      ariaLabel={isEditMode ? 'Edit project' : 'Add a project'}
      showClose={false}
      contentClassName="!max-w-[820px] !rounded-[24px] !border-3 !border-[#c1d4c4] overflow-hidden p-0"
      footer={footer}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-[25px] top-[25px] z-10 size-[28px] rounded-[20px] bg-[#ebf1ec] flex items-center justify-center text-brand-green hover:bg-[#c1d4c4] transition-colors duration-150"
      >
        <CloseIcon className="size-[12px]" />
      </button>

      <div className="px-[clamp(24px,4vw,68px)] pt-[clamp(28px,3vw,48px)] pb-[clamp(20px,2vw,32px)] flex flex-col gap-[24px]">
        {/* Header — Figma 5178:102298 */}
        <div className="flex flex-col items-center gap-[16px] text-center">
          <div
            className="flex items-center gap-[6px] h-[24px] px-[14px] rounded-[6px] border border-[#c1d4c4] shrink-0"
            style={{ background: 'rgba(235,241,236,0.5)' }}
          >
            <span
              className="size-[8px] rounded-full shrink-0 bg-[#c1d4c4]"
              style={{ border: '1.5px solid #1d7c4d', boxShadow: '0px 0px 4px 0px #387440' }}
            />
            {/* ⚠️ "Add A skill" reproduced verbatim in both modes — see
                file-header comment, this is a Figma Skills-clone artifact. */}
            <span className="font-sans text-[12px] text-[#999] tracking-[0.2px] whitespace-nowrap">
              Add A skill
            </span>
          </div>

          <div className="flex flex-col items-center gap-[4px]">
            <h2 className="font-display text-[clamp(22px,2.4vw,32px)] tracking-[-1.2px] leading-[1.1] text-[#111]">
              {isEditMode
                ? 'Editing project. Update the details.'
                : 'New project. Show what you built.'}
            </h2>
            {/* ⚠️ Subtitle reproduced verbatim in both modes — Skills-flow
                copy ("proficiency", "verify it later") left over from the
                same clone, see file-header comment. */}
            <p className="font-sans text-[12px] text-[#959592] tracking-[0.2px] leading-[18px] max-w-[480px]">
              Fill in the name, set your proficiency honestly, and tag it to a category.
              That&rsquo;s it — you can verify it later.
            </p>
          </div>
        </div>

        {/* Section 1 — Cover image — Figma 5178:102305 */}
        <div className="rounded-[24px] border border-[#e8e8e4] bg-white p-[22px] flex flex-col gap-[8px]">
          <div className="flex items-center gap-[10px] border-b border-[#f8f8f4] pb-[10px]">
            <span className="size-[22px] rounded-[11px] bg-brand-green flex items-center justify-center shrink-0">
              <span className="font-sans font-bold text-[11px] text-white leading-none">1</span>
            </span>
            <span className="font-sans font-semibold text-[12px] text-[#111]">Cover image</span>
            <span className="font-sans text-[11px] text-[#70706e]">
              optional — strongly recommended
            </span>
          </div>

          <Upload
            title="Drop a screenshot or image here"
            accept="image/png,image/jpeg,image/webp"
            acceptLabels={['.png', '.jpeg', 'WebP']}
            onFileSelect={handleCoverSelect}
            filename={coverFilename ?? undefined}
            height={173}
          />

          <div className="flex items-center justify-center gap-[8px] px-[8px]">
            <HelperTextIcon className="size-4 shrink-0 text-[#575755]" />
            <span className="font-sans text-[12px] text-[#575755] tracking-[0.2px]">
              No image? A colour is set automatically from your project type below.
            </span>
          </div>
        </div>

        {/* Section 2 — Project basics — Figma 5209:112732 */}
        <div className="rounded-[24px] border border-[#e8e8e4] bg-white p-[22px] flex flex-col gap-[8px]">
          <div className="flex items-center gap-[10px] border-b border-[#f8f8f4] pb-[10px]">
            <span className="size-[22px] rounded-[11px] bg-brand-green flex items-center justify-center shrink-0">
              <span className="font-sans font-bold text-[11px] text-white leading-none">2</span>
            </span>
            <span className="font-sans font-semibold text-[12px] text-[#111]">Project basics</span>
          </div>

          <TextInput
            size="xs"
            label="Project title"
            required
            helperIcon={<HelperTextIcon />}
            // ⚠️ Helper text is Work/Skills-flow copy about job titles,
            // identical to AddEditWorkModal's own "Job title" helper — kept
            // verbatim, see file-header comment.
            helperText="Use your real title, not your department or company name."
            value={form.title}
            onChange={(e) => update('title', e.target.value)}
            placeholder="e.g. Accra Bus Tracker, GhanaPay Dashboard Redesign…"
          />

          <div className="flex flex-col sm:flex-row gap-[16px] sm:gap-[35px]">
            <div className="flex-1">
              <Select
                size="xs"
                label="Project Type"
                required
                options={PROJECT_TYPES}
                value={form.projectType}
                onChange={(value) => update('projectType', value)}
                placeholder="Select…"
              />
            </div>
            <div className="flex-1">
              <Select
                size="xs"
                label="Year completed"
                required
                options={getYearOptions()}
                value={form.year}
                onChange={(value) => update('year', value)}
                placeholder="e.g. 2024"
              />
            </div>
          </div>

          <TextInput
            size="xs"
            label="Your specific role"
            required
            helperIcon={<HelperTextIcon />}
            helperText="Say what you personally built, even if the project was a group effort."
            value={form.role}
            onChange={(e) => update('role', e.target.value)}
            placeholder="e.g. Solo developer — Lead UX designer — Backend engineer on a team of 4…"
          />
        </div>

        {/* Section 3 — What it is & what you built — Figma 5204:112463 */}
        <div className="rounded-[24px] border border-[#e8e8e4] bg-white p-[22px] flex flex-col gap-[8px]">
          <div className="flex items-center gap-[10px] border-b border-[#f8f8f4] pb-[10px]">
            <span className="size-[22px] rounded-[11px] bg-brand-green flex items-center justify-center shrink-0">
              <span className="font-sans font-bold text-[11px] text-white leading-none">3</span>
            </span>
            <span className="font-sans font-semibold text-[12px] text-[#111]">
              What it is &amp; what you built
            </span>
          </div>

          <Textarea
            label="Description"
            required
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
            placeholder={DESCRIPTION_PLACEHOLDER}
            maxLength={DESCRIPTION_MAX}
            rows={8}
          />

          {/* Strong description patterns — Figma 5204:112572 */}
          <div
            className="rounded-[10px] p-[15px] flex flex-col gap-[6px]"
            style={{ background: 'rgba(235,241,236,0.3)' }}
          >
            <span className="font-sans font-semibold text-[11px] text-[#2a5730]">
              Strong description patterns
            </span>
            <p className="font-sans text-[10px] text-[#2a5730] opacity-85">{STRONG_PATTERN_LEAD}</p>
          </div>
        </div>

        {/* Section 4 — Technologies & links — Figma 5204:112595 */}
        <div className="rounded-[24px] border border-[#e8e8e4] bg-white p-[22px] flex flex-col gap-[8px]">
          <div className="flex items-center gap-[10px] border-b border-[#f8f8f4] pb-[10px]">
            <span className="size-[22px] rounded-[11px] bg-brand-green flex items-center justify-center shrink-0">
              <span className="font-sans font-bold text-[11px] text-white leading-none">4</span>
            </span>
            <span className="font-sans font-semibold text-[12px] text-[#111]">
              Technologies &amp; links
            </span>
          </div>

          <TextInput
            size="xs"
            label="Technologies / Tools used"
            required
            helperIcon={<HelperTextIcon />}
            helperText="List the ones a recruiter would recognise. Aim for 3–6."
            value={form.technologiesText}
            onChange={(e) => update('technologiesText', e.target.value)}
            placeholder="e.g. React Native, Firebase, Figma, Python, Blender — comma separated"
          />

          <div className="flex flex-col sm:flex-row gap-[16px] sm:gap-[35px]">
            <div className="flex-1">
              <TextInput
                size="xs"
                label="Live link or demo"
                value={form.liveLink}
                onChange={(e) => update('liveLink', e.target.value)}
                placeholder="https://…"
              />
            </div>
            <div className="flex-1">
              <TextInput
                size="xs"
                label="GitHub / source"
                value={form.githubLink}
                onChange={(e) => update('githubLink', e.target.value)}
                placeholder="https://github.com/…"
              />
            </div>
          </div>

          <TextInput
            size="xs"
            helperIcon={<HelperTextIcon />}
            label="Figma / design file link"
            // ⚠️ Helper text is identical to "Your specific role" above,
            // word-for-word — a Figma copy-paste slip, kept verbatim, see
            // file-header comment.
            helperText="Say what you personally built, even if the project was a group effort."
            value={form.figmaLink}
            onChange={(e) => update('figmaLink', e.target.value)}
            placeholder="https://figma.com/…"
          />
        </div>

        {/* Pinned-project toggle — Figma 5204:112676 (Add) / 5215:114722 (Edit) */}
        <div
          className="rounded-[16px] border border-[#c1d4c4] bg-white px-[20px] py-[16px] flex items-center justify-between gap-[16px]"
          style={{ boxShadow: '0px 4px 0px 0px rgba(0,0,0,0.07)' }}
        >
          <div className="flex flex-col gap-[4px] min-w-0">
            <span className="font-sans font-bold text-[15px] pl-2 text-[#111]">
              {isEditMode ? ' Pinned as top project' : ' Set as pinned project'}
            </span>
            <p className="font-sans text-[12px] text-[#70706e]">
              {isEditMode
                ? 'Pinned project appears first on your card and recruiter profile. Only one project can be pinned at a time.'
                : 'Your pinned project appears first on your recruiter card. Only one can be pinned.'}
            </p>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={form.isPinned}
            aria-label="Set as pinned project"
            onClick={() => update('isPinned', !form.isPinned)}
            className="relative h-[24px] w-[44px] shrink-0 rounded-[12px] transition-colors duration-150"
            style={{ background: form.isPinned ? '#387440' : '#e8e8e4' }}
          >
            <span
              className="absolute top-[2px] size-[20px] rounded-[10px] bg-white transition-[left] duration-150"
              style={{
                left: form.isPinned ? '22px' : '2px',
                boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.06)',
              }}
            />
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AddEditPortfolioModal;
