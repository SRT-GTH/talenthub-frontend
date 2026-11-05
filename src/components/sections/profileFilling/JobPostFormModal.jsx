import { useIsDesktop } from '../../../hooks/useMediaQuery.js';
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Modal from '../../ui/Modal.jsx';
import Button from '../../ui/Button.jsx';
import Field from '../../ui/form/Field.jsx';
import TextInput from '../../ui/form/TextInput.jsx';
import Textarea from '../../ui/form/Textarea.jsx';
import Select from '../../ui/form/Select.jsx';
import Checkbox from '../../ui/form/Checkbox.jsx';
import Radio from '../../ui/form/Radio.jsx';
import { debug } from '../../../utils/debug.js';
import { ArrowRightIcon, ArrowheadDownIcon } from '../../shared/assets.jsx';
import jobPostFormAddIcon from '../../../assets/recruiter/job-post-form-add.svg';
import jobPostFormAutosaveIcon from '../../../assets/recruiter/job-post-form-autosave.svg';
import jobPostFormCheckboxCheckedIcon from '../../../assets/recruiter/job-post-form-checkbox-checked.svg';
import jobPostFormCheckboxUncheckedIcon from '../../../assets/recruiter/job-post-form-checkbox-unchecked.svg';
import jobPostFormCloseIcon from '../../../assets/recruiter/job-post-form-close.svg';
import {
  BENEFIT_OPTIONS,
  CURRENCY_OPTIONS,
  EXPERIENCE_LEVEL_OPTIONS,
  INDUSTRY_OPTIONS,
  JOB_DESCRIPTION_MAX,
  JOB_POST_ADD_LABEL,
  JOB_POST_AUTOSAVE,
  JOB_POST_CONVERSATION_HEADLINE,
  JOB_POST_FALLBACK_HEADLINE,
  JOB_POST_FALLBACK_SUBTITLE,
  JOB_POST_CONVERSATION_SUBTITLE,
  JOB_POST_CTA,
  JOB_POST_HEADLINE,
  JOB_POST_OPTIONAL_LABEL,
  JOB_POST_PLACEHOLDERS,
  JOB_POST_REMOVE_LABEL,
  JOB_POST_SECTION_LEGENDS,
  JOB_POST_SUBTITLE,
  JOB_POST_UPLOAD_HEADLINE,
  JOB_POST_UPLOAD_SUBTITLE,
  JOB_TYPE_DISPLAY_LABELS,
  JOB_TYPE_OPTIONS,
  MONTH_OPTIONS,
  SALARY_FREQUENCY_OPTIONS,
  WORK_ARRANGEMENT_OPTIONS,
  emptyJobPostForm,
} from './jobPostFormData.js';

const log = debug('JobPostFormModal');

const FORM_COPY_BY_MODE = {
  manual: { headline: JOB_POST_HEADLINE, subtitle: JOB_POST_SUBTITLE },
  upload: { headline: JOB_POST_UPLOAD_HEADLINE, subtitle: JOB_POST_UPLOAD_SUBTITLE },
  conversation: {
    headline: JOB_POST_CONVERSATION_HEADLINE,
    subtitle: JOB_POST_CONVERSATION_SUBTITLE,
  },
  fallback: { headline: JOB_POST_FALLBACK_HEADLINE, subtitle: JOB_POST_FALLBACK_SUBTITLE },
};

/*
 * Preview states, driven by `?jobform=<key>` so the Figma scroll positions /
 * open dropdown frames (7958:165666, 166304, 166942, 171330) can be opened by
 * URL. Scroll offsets are measured from the frames (text y delta vs 165028).
 * `level-menu` also pins the Experience Level dropdown open.
 */
const JOB_FORM_PREVIEW_SCROLL = {
  qualifications: () => 466,
  'job-details': () => 932,
  'level-menu': (mode) => (mode === 'upload' ? 652 : 612),
};

/** Figma label ink (#1c2a21), forced over the shared Field default. */
const FIELD_LABEL_INK = '!text-[#1c2a21]';
/** Figma GTHInput: 16px left padding, value 14/400 #595959, placeholder #999. */
const FIELD_INPUT_PROPS = {
  labelClassName: FIELD_LABEL_INK,
  boxClassName: 'md:!pl-[16px] md:!py-[12.5px]',
  inputClassName: '!font-normal !text-[#595959] placeholder:!text-[#999999]',
};
const FIELD_SELECT_PROPS = {
  labelClassName: FIELD_LABEL_INK,
  triggerClassName: 'md:!pl-[16px]',
  chevronIcon: <ArrowheadDownIcon className="text-brand-green" />,
};
/** Salary row boxes: text centred in the whole box (Figma 7958:166304). */
const SALARY_INPUT_CLASS = 'text-center !font-normal !text-[#595959] placeholder:!text-[#595959]';
const SALARY_SELECT_VALUE_CLASS = 'pl-[28px] text-center';
// Figma 7958:165028 draws the Min / Max / Frequency captions in Raleway.
const SALARY_CAPTION_FONT = '!font-[family-name:var(--font-raleway)]';

/** Figma GTHInput look for the multi-line fields: 1px border, 2.5px shelf at rest (the focus shelf stays). */
const TEXTAREA_BOX_CLASS =
  '!border !rounded-[10px] not-focus-within:shadow-[0_2.5px_0_0_rgba(191,191,191,0.8)]';

/** Benefit checkboxes: exported Figma glyphs (7958:165596 checked / 7958:165600 idle). */
const BENEFIT_CHECKBOX_GLYPHS = {
  checked: <img src={jobPostFormCheckboxCheckedIcon} alt="" />,
  unchecked: <img src={jobPostFormCheckboxUncheckedIcon} alt="" />,
};

/** Section card — Figma 7958:165348: 1px #dfdfdc, r12, 24 pad, legend chip on the top border. */
const FormSection = ({ title, children }) => (
  <fieldset className="m-0 rounded-[12px] border border-[#dfdfdc] px-[clamp(16px,2vw,24px)] pb-[clamp(16px,2vw,24px)] pt-[8px]">
    <legend className="px-[8px] py-[8px] font-sans text-[13px] font-medium leading-[16px] text-[#575755]">
      {title}
    </legend>
    <div className="flex flex-col gap-[clamp(12px,1.5vw,15px)]">{children}</div>
  </fieldset>
);

/** Numbered list field (Figma 7958:165401): "1." marker + input + inline Remove, "+ Add" top right. */
const DynamicList = ({ label, items, placeholders, onChange, onAdd, onRemove }) => (
  <Field
    label={label}
    required
    labelClassName={FIELD_LABEL_INK}
    labelTrailingClassName=""
    labelTrailing={
      <button
        type="button"
        onClick={onAdd}
        className="inline-flex items-center gap-[4px] font-sans text-[13px] font-medium leading-[16px] text-brand-green hover:opacity-80"
      >
        <img src={jobPostFormAddIcon} alt="" aria-hidden="true" className="size-[14px]" />
        {JOB_POST_ADD_LABEL}
      </button>
    }
    className="!gap-[10px]"
  >
    <div className="flex flex-col gap-[10px]">
      {items.map((value, index) => (
        <div key={`row-${index}`} className="flex items-start gap-[clamp(8px,1.2vw,16px)]">
          <span className="w-5 shrink-0 font-heading text-[23px] font-semibold leading-[29px] tracking-[0.2px] text-brand-green">
            {index + 1}.
          </span>
          <div className="min-w-0 flex-1">
            <TextInput
              {...FIELD_INPUT_PROPS}
              boxClassName="md:!pl-[16px] md:!py-[10px]"
              value={value}
              onChange={(e) => onChange(index, e.target.value)}
              placeholder={placeholders[index] ?? placeholders[0]}
              rightIconInteractive
              rightIcon={
                <button
                  type="button"
                  onClick={() => onRemove(index)}
                  disabled={items.length <= 1}
                  className="font-sans text-[13px] leading-[20px] tracking-[0.2px] text-brand-green hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {JOB_POST_REMOVE_LABEL}
                </button>
              }
            />
          </div>
        </div>
      ))}
    </div>
  </Field>
);

/*
 * JobPostFormModal — shared job form (manual 5132:70013 / upload 5132:75730 /
 * conversation review). Header copy switches by `mode`.
 *
 * Reuses ui/Modal the same way GameStoreModal does: fixed-height shell,
 * pinned `header` + `footer` slots, only the form body scrolls. Form
 * controls are the shared TextInput / Textarea / Select / Checkbox / Radio.
 *
 * Form draft lives in this modal even while `open` is false (confirm step
 * hides the form without unmounting). Parent bumps `resetKey` to clear the
 * draft after dismiss / successful post / a fresh "Fill Form" open.
 */
const JobPostFormModal = ({
  open,
  onClose,
  onRequestPost,
  resetKey = 0,
  value,
  onChange,
  mode = 'manual',
}) => {
  const [searchParams] = useSearchParams();
  // Below lg the in-box captions of the Currency / Frequency selects would stack over their value (two rows in one button): the aria-label carries the name instead.
  const isDesktop = useIsDesktop();
  const previewKey = searchParams.get('jobform');
  const bodyRef = useRef(null);
  const controlled = typeof onChange === 'function' && value != null;
  const [internal, setInternal] = useState(emptyJobPostForm);
  const form = controlled ? value : internal;
  const setForm = controlled
    ? (updater) => {
        const next = typeof updater === 'function' ? updater(value) : updater;
        onChange(next);
      }
    : setInternal;
  const copy = FORM_COPY_BY_MODE[mode] ?? FORM_COPY_BY_MODE.manual;

  useEffect(() => {
    if (!open) return;
    log('mount', { open: true, controlled });
  }, [open, controlled]);

  useEffect(() => {
    if (controlled) return;
    setInternal(emptyJobPostForm());
    log('branch', { formReset: true, resetKey });
  }, [resetKey, controlled]);

  // Preview URL state (?jobform=qualifications|job-details|level-menu): scroll the form body.
  useEffect(() => {
    if (!open || !previewKey) return undefined;
    const offset = JOB_FORM_PREVIEW_SCROLL[previewKey]?.(mode);
    if (offset == null) return undefined;
    const timer = window.setTimeout(() => {
      const scroller = bodyRef.current?.parentElement;
      if (!scroller) return;
      scroller.scrollTop = offset;
      log('branch', { previewScroll: previewKey, offset, scrollTop: scroller.scrollTop });
    }, 60);
    return () => window.clearTimeout(timer);
  }, [open, previewKey, mode]);

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const updateList = (key, index, value) => {
    setForm((prev) => {
      const next = [...prev[key]];
      next[index] = value;
      return { ...prev, [key]: next };
    });
  };

  const addListItem = (key) => {
    setForm((prev) => ({ ...prev, [key]: [...prev[key], ''] }));
    log('branch', { addListItem: key });
  };

  const removeListItem = (key, index) => {
    setForm((prev) => {
      if (prev[key].length <= 1) return prev;
      return { ...prev, [key]: prev[key].filter((_, i) => i !== index) };
    });
    log('branch', { removeListItem: key, index });
  };

  const toggleBenefit = (benefit) => {
    setForm((prev) => {
      const has = prev.benefits.includes(benefit);
      return {
        ...prev,
        benefits: has ? prev.benefits.filter((b) => b !== benefit) : [...prev.benefits, benefit],
      };
    });
  };

  const isUploadMode = mode === 'upload';
  const isLevelMenuPreview = previewKey === 'level-menu';

  const header = (
    <div className="flex flex-col gap-[10px] px-[clamp(20px,3vw,36px)] pb-[18px] pt-[clamp(24px,3vw,36px)] pr-[56px]">
      <h2
        className="font-heading font-semibold leading-[1.2] text-[#1c2a21]"
        style={{
          fontSize: isUploadMode
            ? 'clamp(1.5rem, 2.2vw, 2.125rem)'
            : 'clamp(1.75rem, 2.6vw, 2.5rem)',
        }}
      >
        {copy.headline.before}
        {copy.headline.accent ? (
          <span className="text-brand-green">{copy.headline.accent}</span>
        ) : null}
      </h2>
      <p className="font-sans text-[14px] leading-[1.2] text-[#575755]">{copy.subtitle}</p>
      {/* Figma 7958:165663 — 28px #ebf1ec disc, 20/16 from the card corner; 44px hit area. */}
      <button
        type="button"
        onClick={onClose}
        autoFocus
        aria-label="Close"
        className="absolute right-[12px] top-[8px] inline-flex size-11 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
      >
        <img src={jobPostFormCloseIcon} alt="" aria-hidden="true" className="size-7" />
      </button>
    </div>
  );

  const footer = (
    <div className="flex items-center justify-between gap-[16px] border-t border-[#e6e6e6] bg-[#fefdfa] px-[clamp(20px,3vw,34px)] py-[16px]">
      <span className="inline-flex items-center gap-[6px] font-sans text-[12px] leading-[14px] text-[#70706e]">
        <img src={jobPostFormAutosaveIcon} alt="" aria-hidden="true" className="size-[14px]" />
        {JOB_POST_AUTOSAVE}
      </span>
      <Button
        type="button"
        variant="primary"
        size="sm"
        className="lg:!py-[10px] lg:!text-[14px]"
        rightIcon={<ArrowRightIcon />}
        onClick={() => {
          log('branch', { requestPost: true, jobTitle: form.jobTitle });
          onRequestPost?.(form);
        }}
      >
        {JOB_POST_CTA}
      </Button>
    </div>
  );

  const descriptionLength = form.description.length;

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      size="xl"
      ariaLabel="Build your job post"
      showClose={false}
      scrollHint={false}
      header={header}
      footer={footer}
      className="!bg-[rgba(28,42,33,0.7)] !backdrop-blur-none"
      contentClassName="!max-w-[850px] !h-[min(90vh,820px)] !rounded-[24px] max-sm:!rounded-b-none max-sm:!border-0"
    >
      <div
        ref={bodyRef}
        className="flex flex-col gap-[clamp(10px,1.2vw,15px)] px-[clamp(20px,3vw,36px)] pb-[16px]"
      >
        <FormSection title={JOB_POST_SECTION_LEGENDS.basic}>
          <div className="grid grid-cols-1 gap-[14px] md:grid-cols-2">
            <TextInput
              {...FIELD_INPUT_PROPS}
              label="Job Title"
              required
              value={form.jobTitle}
              onChange={(e) => setField('jobTitle', e.target.value)}
              placeholder={JOB_POST_PLACEHOLDERS.jobTitle}
            />
            <TextInput
              {...FIELD_INPUT_PROPS}
              label="Company Name"
              required
              value={form.companyName}
              onChange={(e) => setField('companyName', e.target.value)}
              placeholder={JOB_POST_PLACEHOLDERS.companyName}
            />
            <Select
              {...FIELD_SELECT_PROPS}
              label="Industry"
              required
              value={form.industry}
              onChange={(val) => setField('industry', val)}
              options={INDUSTRY_OPTIONS}
              placeholder="Select Industry"
              placeholderClassName="lg:!text-[13px] lg:!font-medium"
            />
            <TextInput
              {...FIELD_INPUT_PROPS}
              label="Department"
              labelTrailing={JOB_POST_OPTIONAL_LABEL}
              labelTrailingClassName="font-medium text-brand-green"
              value={form.department}
              onChange={(e) => setField('department', e.target.value)}
              placeholder={JOB_POST_PLACEHOLDERS.department}
            />
          </div>
        </FormSection>

        <FormSection title={JOB_POST_SECTION_LEGENDS.description}>
          <Textarea
            label="Job Description"
            required
            labelClassName={FIELD_LABEL_INK}
            labelTrailing={`${descriptionLength} / ${JOB_DESCRIPTION_MAX}`}
            labelTrailingClassName={
              descriptionLength > JOB_DESCRIPTION_MAX
                ? '!text-[13px] !leading-5 text-danger'
                : '!text-[13px] !leading-5 text-[#737373]'
            }
            showCounter={false}
            boxClassName={TEXTAREA_BOX_CLASS}
            textareaClassName="min-h-[68px] md:!pl-[16px] !font-normal !text-[#595959] placeholder:!text-[#999999]"
            value={form.description}
            onChange={(e) => setField('description', e.target.value)}
            placeholder={JOB_POST_PLACEHOLDERS.description}
            rows={3}
          />
          <DynamicList
            label="Required Qualifications"
            items={form.qualifications}
            placeholders={JOB_POST_PLACEHOLDERS.qualifications}
            onChange={(i, v) => updateList('qualifications', i, v)}
            onAdd={() => addListItem('qualifications')}
            onRemove={(i) => removeListItem('qualifications', i)}
          />
          <DynamicList
            label="Key Responsibilities"
            items={form.responsibilities}
            placeholders={JOB_POST_PLACEHOLDERS.responsibilities}
            onChange={(i, v) => updateList('responsibilities', i, v)}
            onAdd={() => addListItem('responsibilities')}
            onRemove={(i) => removeListItem('responsibilities', i)}
          />
        </FormSection>

        <FormSection title={JOB_POST_SECTION_LEGENDS.details}>
          <Field label="Job Type" required labelClassName={FIELD_LABEL_INK}>
            <div className="flex flex-wrap gap-x-[20px] gap-y-[10px]">
              {JOB_TYPE_OPTIONS.map((opt) => (
                <Radio
                  key={opt}
                  compact
                  name="jobType"
                  value={opt}
                  label={JOB_TYPE_DISPLAY_LABELS[opt] ?? opt}
                  checked={form.jobType === opt}
                  onChange={(v) => setField('jobType', v)}
                />
              ))}
            </div>
          </Field>

          <div className="grid grid-cols-1 gap-[14px] md:grid-cols-[minmax(0,302px)_minmax(0,1fr)]">
            <div className="flex items-end gap-[10px]">
              <div className="min-w-0 flex-1">
                <Select
                  {...FIELD_SELECT_PROPS}
                  menuVariant="divided"
                  state={isLevelMenuPreview ? 'open' : undefined}
                  label="Experience Level"
                  required
                  value={form.experienceLevel}
                  onChange={(val) => setField('experienceLevel', val)}
                  options={EXPERIENCE_LEVEL_OPTIONS}
                  placeholder="Select Level"
                />
              </div>
              <span className="mb-[15px] shrink-0 font-sans text-[14px] leading-[20px] tracking-[0.2px] text-[#595959]">
                year(s)
              </span>
            </div>
            <TextInput
              {...FIELD_INPUT_PROPS}
              label="Work Location"
              required
              value={form.workLocation}
              onChange={(e) => setField('workLocation', e.target.value)}
              placeholder={JOB_POST_PLACEHOLDERS.workLocation}
            />
          </div>

          <Field label="Work Arrangement" required labelClassName={FIELD_LABEL_INK}>
            <div className="flex flex-wrap gap-x-[20px] gap-y-[10px]">
              {WORK_ARRANGEMENT_OPTIONS.map((opt) => (
                <Radio
                  key={opt}
                  compact
                  name="workArrangement"
                  value={opt}
                  label={opt}
                  checked={form.workArrangement === opt}
                  onChange={(v) => setField('workArrangement', v)}
                />
              ))}
            </div>
          </Field>
        </FormSection>

        <FormSection title={JOB_POST_SECTION_LEGENDS.compensation}>
          <Field
            label="Salary"
            required
            labelClassName={FIELD_LABEL_INK}
            labelRowClassName="!h-[38px]"
            labelTrailingClassName=""
            labelTrailing={
              <div className="inline-flex gap-[2px] rounded-[6px] bg-[#f2f2f2] p-[4px] shadow-[0_1px_2px_rgba(0,0,0,0.08)]">
                {['range', 'fixed'].map((salaryMode) => (
                  <button
                    key={salaryMode}
                    type="button"
                    onClick={() => setField('salaryMode', salaryMode)}
                    className={`rounded-[6px] px-[16px] py-[8px] font-sans text-[12px] leading-[14px] transition-colors ${
                      form.salaryMode === salaryMode
                        ? 'border border-[#e5e5e5] bg-white text-brand-green'
                        : 'text-[#595959]'
                    }`}
                  >
                    {salaryMode === 'range' ? 'Range' : 'Fixed'}
                  </button>
                ))}
              </div>
            }
            className="!gap-[12px]"
          >
            <div className="grid grid-cols-2 gap-[10px] md:grid-cols-4">
              <Select
                inscription={isDesktop ? 'Currency' : undefined}
                aria-label="Currency"
                triggerClassName="md:!pl-[16px]"
                valueClassName={SALARY_SELECT_VALUE_CLASS}
                value={form.currency}
                onChange={(val) => setField('currency', val)}
                options={CURRENCY_OPTIONS}
                placeholder="Currency"
                chevronIcon={<ArrowheadDownIcon className="text-brand-green" />}
              />
              {form.salaryMode === 'range' ? (
                <>
                  <TextInput
                    inscription="Min"
                    inscriptionClassName={SALARY_CAPTION_FONT}
                    boxClassName="md:!pl-[16px]"
                    inputClassName={SALARY_INPUT_CLASS}
                    value={form.salaryMin}
                    onChange={(e) => setField('salaryMin', e.target.value)}
                    placeholder="10,000"
                  />
                  <TextInput
                    inscription="Max"
                    inscriptionClassName={SALARY_CAPTION_FONT}
                    boxClassName="md:!pl-[16px]"
                    inputClassName={SALARY_INPUT_CLASS}
                    value={form.salaryMax}
                    onChange={(e) => setField('salaryMax', e.target.value)}
                    placeholder="20,000"
                  />
                </>
              ) : (
                <TextInput
                  inscription="Amount"
                  boxClassName="md:!pl-[16px]"
                  inputClassName={SALARY_INPUT_CLASS}
                  value={form.salaryFixed}
                  onChange={(e) => setField('salaryFixed', e.target.value)}
                  placeholder="Amount"
                />
              )}
              <Select
                inscription={isDesktop ? 'Frequency' : undefined}
                inscriptionClassName={SALARY_CAPTION_FONT}
                aria-label="Frequency"
                triggerClassName="md:!pl-[16px]"
                valueClassName={SALARY_SELECT_VALUE_CLASS}
                value={form.salaryFrequency}
                onChange={(val) => setField('salaryFrequency', val)}
                options={SALARY_FREQUENCY_OPTIONS}
                placeholder="/Month"
                chevronIcon={<ArrowheadDownIcon className="text-brand-green" />}
              />
            </div>
          </Field>

          <Field label="Benefits / Perks" required labelClassName={FIELD_LABEL_INK}>
            <div className="grid grid-cols-1 gap-x-[16px] gap-y-[14px] sm:grid-cols-2 md:grid-cols-[repeat(3,minmax(0,27.77%))_minmax(max-content,1fr)]">
              {BENEFIT_OPTIONS.map((benefit) => (
                <Checkbox
                  key={benefit}
                  glyphs={BENEFIT_CHECKBOX_GLYPHS}
                  labelClassName="!text-[#595959] !tracking-[0.2px]"
                  label={benefit}
                  checked={form.benefits.includes(benefit)}
                  onChange={() => toggleBenefit(benefit)}
                />
              ))}
            </div>
          </Field>

          <Textarea
            label="Additional Perks"
            labelClassName={FIELD_LABEL_INK}
            labelTrailing={JOB_POST_OPTIONAL_LABEL}
            labelTrailingClassName="font-medium text-brand-green"
            boxClassName={TEXTAREA_BOX_CLASS}
            textareaClassName="min-h-[25px] md:!pl-[16px] !font-normal !text-[#595959] placeholder:!text-[#999999]"
            value={form.additionalPerks}
            onChange={(e) => setField('additionalPerks', e.target.value)}
            placeholder={JOB_POST_PLACEHOLDERS.additionalPerks}
            rows={1}
          />
        </FormSection>

        <FormSection title={JOB_POST_SECTION_LEGENDS.publishing}>
          {/* Figma 7958:165641 — 46px row: label left, DD / Month / YYYY chips right (gap 6). */}
          <Field
            label="Application Deadline"
            required
            labelClassName={FIELD_LABEL_INK}
            labelRowClassName="!h-auto flex-wrap gap-x-[12px] gap-y-[12px]"
            labelTrailingClassName=""
            labelTrailing={
              <div className="flex shrink-0 items-center gap-[6px]">
                <TextInput
                  size="sm"
                  className="!w-[80px]"
                  value={form.deadlineDay}
                  onChange={(e) => setField('deadlineDay', e.target.value)}
                  placeholder="DD"
                />
                <Select
                  size="sm"
                  aria-label="Application deadline month"
                  className="!w-[118px]"
                  value={form.deadlineMonth}
                  onChange={(val) => setField('deadlineMonth', val)}
                  options={MONTH_OPTIONS}
                  placeholder="Month"
                  chevronIcon={<ArrowheadDownIcon className="text-brand-green" />}
                />
                <TextInput
                  size="sm"
                  className="!w-[80px]"
                  value={form.deadlineYear}
                  onChange={(e) => setField('deadlineYear', e.target.value)}
                  placeholder="YYYY"
                />
              </div>
            }
          />
        </FormSection>
      </div>
    </Modal>
  );
};

export default JobPostFormModal;
