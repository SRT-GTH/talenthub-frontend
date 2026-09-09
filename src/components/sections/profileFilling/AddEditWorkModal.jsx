import { useState, useEffect } from 'react';
import Modal from '../../ui/Modal.jsx';
import Button from '../../ui/Button.jsx';
import { TextInput, Select, Textarea, Checkbox, DatePicker } from '../../ui/form';
import { debug } from '../../../utils/debug.js';
import { CloseIcon, ArrowLeftIcon, WorkDeleteWarningIcon } from '../../shared/assets.jsx';

const log = debug('AddEditWorkModal');

/*
 * AddEditWorkModal — single form component for both the Add-Work and
 * Edit-Work flows, switched via the `mode` prop ('add' | 'edit') per
 * CLAUDE.md's shared-component-reuse rule (the two Figma frames — 5113:121160
 * "new work-upload" / 5114:124039 "Overlay centred card" for Add, and
 * 5178:36163 "Edit Work" for Edit — are the same form; Edit just pre-fills
 * values, adds a "Delete this role" footer link, and (per Figma) an
 * "unsaved changes" bar).
 *
 * Source: Figma 5114:124039 (get_design_context dive, 2026-09-06) for the
 * exact field set / labels / placeholders / helper copy — confirmed real
 * text is "New role. Tell your story", NOT the "Identity captured." string
 * this session's brief suspected as a copy-paste artifact from the identity
 * onboarding flow. That suspicion did not hold up for THIS modal.
 *
 * Sections (Figma layer names are misleading — both are literally named
 * "Section 1: Role & org" in the Figma layer tree, but their *content* is
 * two distinct groups):
 *   1. "Role & organisation" (badge "1") — job title, organisation,
 *      employment type, location.
 *   2. "Dates & duration" (badge "2", Figma layer mislabeled "Section 1:
 *      Role & org" again) — start date, end date, "I currently work here"
 *      checkbox (disables end date).
 *   3. "What you did & what you achieved" (badge "3") — description
 *      textarea (400 char cap) + a "Strong description patterns" tips card
 *      (5 fill-in-the-blank example bullets, verbatim from Figma).
 *
 * Fields use the shared `ui/form` primitives (TextInput / Select / Textarea /
 * Checkbox) rather than hand-rolled markup — this modal's own compact 38px
 * visual (rounded-10, border #e8e8e4, no shelf) didn't match either of
 * TextInput/Select's existing `md` (51px shelf) or `sm` (46px) sizes, so a
 * new `xs` size was added to both per CLAUDE.md's "extend, don't duplicate"
 * rule — `md`/`sm` usages elsewhere are untouched. The "I currently work
 * here" checkbox reuses the shared `Checkbox` component as-is (Figma node
 * 5178:101047 "GTHCheckbox" is a plain default-state instance of it, no new
 * variant needed).
 *
 * Date fields use the shared `ui/form/DatePicker` component (added
 * 2026-09-06, first used here) — a real styled calendar popup, not the
 * native `<input type="date">.showPicker()` this modal used originally
 * (which opens unstyled browser chrome; couldn't be made to match the app).
 * See DatePicker.jsx for how the popup itself works.
 *
 * ⚠️ Figma's "Editing banner" (node 5178:100857, "Editing: Junior Frontend
 * Developer at Hubtel…") is marked HIDDEN in the Figma layer tree itself —
 * respected here by NOT rendering it (screenshot/visibility wins over the
 * node's mere presence in the tree). The "Unsaved changes" bar (5178:101055)
 * IS visible in Figma, so it's implemented here as a dirty-state indicator
 * that appears once any field changes in edit mode.
 */

const EMPLOYMENT_TYPES = [
  'Full-time',
  'Part-time',
  'Internship',
  'Freelance / Contract',
  'National Service',
  'Apprenticeship',
  'Volunteer',
];

const DESCRIPTION_MAX = 400;

// Figma 5114:124569 — verbatim fill-in-the-blank example bullets.
const STRONG_PATTERNS = [
  'Built [what] for [who] that [outcome with number]',
  'Reduced [metric] by [%] through [method]',
  'Led team of [N] to deliver [project] on time / under budget',
  'Automated [task], saving [N hours / GH₵N] per [period]',
  'Grow [metric] from X to Y in [timeframe]',
];

const EMPTY_FORM = {
  jobTitle: '',
  organisation: '',
  employmentType: '',
  location: '',
  startDate: '',
  endDate: '',
  isCurrent: false,
  description: '',
};

const AddEditWorkModal = ({ isOpen, onClose, onSave, mode = 'add', initialData = null }) => {
  const isEditMode = mode === 'edit';
  const [form, setForm] = useState(EMPTY_FORM);
  const [isDirty, setIsDirty] = useState(false);

  log('mount', { isOpen, mode, initialDataId: initialData?.id });

  useEffect(() => {
    if (isOpen) {
      log('open — resetting form', { mode, prefill: Boolean(initialData) });
      setForm(initialData ? { ...EMPTY_FORM, ...initialData } : EMPTY_FORM);
      setIsDirty(false);
    }
  }, [isOpen, initialData, mode]);

  const update = (field, value) => {
    log('field change', { field, value });
    setForm((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const canSubmit =
    form.jobTitle.trim() &&
    form.organisation.trim() &&
    form.employmentType &&
    form.location.trim() &&
    form.startDate.trim() &&
    (form.isCurrent || form.endDate.trim()) &&
    form.description.trim();

  const handleSubmit = () => {
    if (!canSubmit) return;
    log(isEditMode ? 'save role edit' : 'add role', form);
    onSave({ ...(isEditMode && initialData ? { id: initialData.id } : {}), ...form });
    onClose();
  };

  // Edit mode's footer is just Delete + Save (no separate Cancel button —
  // Figma 5178:36607 only ever shows these two side by side); Add mode keeps
  // Cancel + Save since there's nothing to delete yet.
  const footer = (
    <div className="border-t border-[rgba(0,0,0,0.07)] bg-white px-[clamp(20px,2.5vw,40px)] py-[16px] flex items-center justify-between">
      {isEditMode && initialData?.onDelete ? (
        // Figma 5217:122734 — a flat pink pill, not the shelf-style
        // `Button` architecture (no border-2/shelf-shadow at all here), so
        // hand-rolled directly rather than forcing it through a variant
        // that would fight the flat look.
        <button
          type="button"
          onClick={initialData.onDelete}
          className="flex items-center gap-[7px] rounded-[10px] border border-[#ebc2bd] bg-[#f9ebea] px-[14px] py-[10px] font-sans font-bold text-[12px] text-[#c0392b] transition-colors duration-150 hover:bg-[#f6ddda]"
        >
          <WorkDeleteWarningIcon className="size-4" />
          Delete this Role
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
        // Edit mode's "Delete this Role" is a flat, shorter pill (Figma
        // 5217:122734, py-10/12px text, no shelf) — match its height here
        // rather than leaving Save Changes at Button's taller default.
        className={isEditMode ? '!py-[10px] !text-[12px] !leading-[normal]' : undefined}
      >
        {isEditMode ? 'Save Changes' : 'Save role →'}
      </Button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      ariaLabel={isEditMode ? 'Edit role' : 'Add a role'}
      showClose={false}
      contentClassName="!max-w-[757px] !rounded-[24px] !border-3 !border-[#c1d4c4] overflow-hidden p-0"
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

      {/* Modal's own children region is already `flex-1 overflow-y-auto` —
          no extra scroll wrapper needed here (this used to be hand-rolled
          with its own scroll + footer div, which put the "sticky" footer
          INSIDE that single scroll region instead of pinning it — Modal's
          own `footer` prop above is what actually keeps it fixed). */}
      <div className="px-[clamp(24px,4vw,68px)] pt-[clamp(28px,3vw,48px)] pb-[clamp(20px,2vw,32px)] flex flex-col gap-[24px]">
        {/* Header — Figma 5114:124045 */}
        <div className="flex flex-col items-center gap-[16px] text-center">
          <div
            className="flex items-center gap-[6px] h-[24px] px-[14px] rounded-[6px] border border-[#c1d4c4] shrink-0"
            style={{ background: 'rgba(235,241,236,0.5)' }}
          >
            <span
              className="size-[8px] rounded-full shrink-0 bg-[#c1d4c4]"
              style={{ border: '1.5px solid #1d7c4d', boxShadow: '0px 0px 4px 0px #387440' }}
            />
            <span className="font-sans text-[12px] text-[#999] tracking-[0.2px] whitespace-nowrap">
              {isEditMode ? 'Edit role' : 'Add a role'}
            </span>
          </div>

          <div className="flex flex-col items-center gap-[4px]">
            <h2 className="font-display text-[clamp(22px,2.4vw,32px)] tracking-[-1.2px] leading-[1.1] text-[#111]">
              {isEditMode ? 'Update your role.' : 'New role. Tell your story'}
            </h2>
            <p className="font-sans text-[12px] text-[#959592] tracking-[0.2px] leading-[18px] max-w-[480px]">
              {isEditMode
                ? "Update the details below and save when you're done."
                : 'Use your real title and dates. Add 2–3 bullets on what you did and the impact. That’s it — you can re-order roles later.'}
            </p>
          </div>
        </div>

        {/* Section 1 — Role & organisation — Figma 5114:124319 */}
        <div className="rounded-[24px] border border-[#e8e8e4] bg-white p-[22px] flex flex-col gap-[16px]">
          <div className="flex items-center gap-[10px] border-b border-[#f8f8f4] pb-[10px]">
            <span className="size-[22px] rounded-[11px] bg-brand-green flex items-center justify-center shrink-0">
              <span className="font-sans font-bold text-[11px] text-white leading-none">1</span>
            </span>
            <span className="font-sans font-semibold text-[12px] text-[#111]">
              Role &amp; organisation
            </span>
          </div>

          <TextInput
            size="xs"
            label="Job title"
            required
            helperText="Use your real title, not your department or company name."
            value={form.jobTitle}
            onChange={(e) => update('jobTitle', e.target.value)}
            placeholder="e.g. Software Engineer, Graphic Designer, ICT Instructor, Sales Manager…"
          />

          <div className="flex flex-col sm:flex-row gap-[16px] sm:gap-[35px]">
            <div className="flex-1">
              <TextInput
                size="xs"
                label="Organisation"
                required
                value={form.organisation}
                onChange={(e) => update('organisation', e.target.value)}
                placeholder="Company or institution name"
              />
            </div>
            <div className="flex-1">
              <Select
                size="xs"
                label="Employment type"
                required
                options={EMPLOYMENT_TYPES}
                value={form.employmentType}
                onChange={(value) => update('employmentType', value)}
                placeholder="Select…"
              />
            </div>
          </div>

          <TextInput
            size="xs"
            label="Location"
            required
            value={form.location}
            onChange={(e) => update('location', e.target.value)}
            placeholder="e.g. Accra, Ghana — or Remote — or Kumasi (On-site)"
          />
        </div>

        {/* Section 2 — Dates & duration — Figma 5114:124385 */}
        <div className="rounded-[24px] border border-[#e8e8e4] bg-white p-[22px] flex flex-col gap-[16px]">
          <div className="flex items-center gap-[10px] border-b border-[#f8f8f4] pb-[10px]">
            <span className="size-[22px] rounded-[11px] bg-brand-green flex items-center justify-center shrink-0">
              <span className="font-sans font-bold text-[11px] text-white leading-none">2</span>
            </span>
            <span className="font-sans font-semibold text-[12px] text-[#111]">
              Dates &amp; duration
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-[16px] sm:gap-[35px]">
            <div className="flex-1">
              <DatePicker
                label="Start date"
                required
                value={form.startDate}
                onChange={(value) => update('startDate', value)}
              />
            </div>
            <div className="flex-1">
              <DatePicker
                label="End Date"
                required={!form.isCurrent}
                value={form.endDate}
                onChange={(value) => update('endDate', value)}
                disabled={form.isCurrent}
              />
            </div>
          </div>

          <Checkbox
            label="I currently work here (end date not set)"
            checked={form.isCurrent}
            onChange={(e) => {
              update('isCurrent', e.target.checked);
              if (e.target.checked) update('endDate', '');
            }}
          />
        </div>

        {/* Section 3 — What you did & achieved — Figma 5114:124542 */}
        <div className="rounded-[24px] border border-[#e8e8e4] bg-white p-[22px] flex flex-col gap-[16px]">
          <div className="flex items-center gap-[10px] border-b border-[#f8f8f4] pb-[10px]">
            <span className="size-[22px] rounded-[11px] bg-brand-green flex items-center justify-center shrink-0">
              <span className="font-sans font-bold text-[11px] text-white leading-none">3</span>
            </span>
            <span className="font-sans font-semibold text-[12px] text-[#595959]">
              What you did &amp; what you achieved
            </span>
          </div>

          <Textarea
            label="Description"
            required
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
            placeholder="Describe what you worked on, what you built or improved, and the results. Lead with your highest-impact contribution."
            maxLength={DESCRIPTION_MAX}
            rows={4}
          />

          {/* Strong description patterns — Figma 5114:124567 */}
          <div
            className="rounded-[10px] p-[15px] flex flex-col gap-[10px]"
            style={{ background: 'rgba(235,241,236,0.3)' }}
          >
            <span className="font-sans font-semibold text-[11px] text-[#2a5730]">
              Strong description patterns
            </span>
            <ul className="flex flex-col gap-[6px]">
              {STRONG_PATTERNS.map((tip) => (
                <li
                  key={tip}
                  className="flex items-start gap-[8px] font-sans text-[10px] text-[#2a5730] opacity-85 leading-[1.5]"
                >
                  <span className="shrink-0">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Unsaved-changes bar — Figma 5178:101055, edit mode only, shown once dirty */}
        {isEditMode && isDirty && (
          <div className="rounded-[10px] border border-[#eedeb8] bg-[#fffefc] px-[16px] py-[10px] flex items-center gap-[8px]">
            <span className="size-[6px] rounded-full bg-[#c8951a] shrink-0" aria-hidden="true" />
            <span className="font-sans text-[11px] text-[#967014]">
              Unsaved changes — save before leaving or changes will be lost.
            </span>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default AddEditWorkModal;
