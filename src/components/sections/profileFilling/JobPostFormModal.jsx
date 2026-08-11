import { useEffect, useState } from 'react';
import Modal from '../../ui/Modal.jsx';
import Button from '../../ui/Button.jsx';
import TextInput from '../../ui/form/TextInput.jsx';
import Textarea from '../../ui/form/Textarea.jsx';
import Select from '../../ui/form/Select.jsx';
import Checkbox from '../../ui/form/Checkbox.jsx';
import Radio from '../../ui/form/Radio.jsx';
import { debug } from '../../../utils/debug.js';
import { ArrowRightIcon, ArrowheadDownIcon } from '../../shared/assets.jsx';
import {
  BENEFIT_OPTIONS,
  CURRENCY_OPTIONS,
  EXPERIENCE_LEVEL_OPTIONS,
  INDUSTRY_OPTIONS,
  JOB_DESCRIPTION_MAX,
  JOB_POST_AUTOSAVE,
  JOB_POST_CONVERSATION_HEADLINE,
  JOB_POST_CONVERSATION_SUBTITLE,
  JOB_POST_CTA,
  JOB_POST_HEADLINE,
  JOB_POST_PLACEHOLDERS,
  JOB_POST_SUBTITLE,
  JOB_POST_UPLOAD_HEADLINE,
  JOB_POST_UPLOAD_SUBTITLE,
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
};

const AutosaveIcon = ({ className = '' }) => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
    <circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeWidth="1.4" />
    <path
      d="M8 4.5v4l2.5 1.5"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** Section card used across multi-section job / company forms. */
const FormSection = ({ title, children }) => (
  <fieldset className="m-0 rounded-[12px] border border-[#e8e8e8] p-[clamp(16px,2vw,24px)]">
    <legend className="px-[6px] font-sans text-[13px] font-medium uppercase tracking-[0.04em] text-[#9a9a97]">
      {title}
    </legend>
    <div className="flex flex-col gap-[clamp(12px,1.5vw,15px)] pt-[4px]">{children}</div>
  </fieldset>
);

const DynamicList = ({ label, required, items, placeholders, onChange, onAdd, onRemove }) => (
  <div className="flex flex-col gap-[10px]">
    <div className="flex items-center justify-between gap-[12px]">
      <span className="font-sans text-[14px] font-medium text-[#111]">
        {label}
        {required && (
          <span className="font-semibold text-brand-green" aria-hidden="true">
            {' '}
            *
          </span>
        )}
      </span>
      <button
        type="button"
        onClick={onAdd}
        className="font-sans text-[14px] font-medium text-brand-green hover:opacity-80"
      >
        + Add
      </button>
    </div>
    <div className="flex flex-col gap-[10px]">
      {items.map((value, index) => (
        <div key={`row-${index}`} className="flex items-center gap-[8px]">
          {/* Figma 5132:67702 / 67709 — Instrument Serif 26px brand-green index */}
          <span className="w-5 shrink-0 self-center font-display text-[26px] leading-[46px] text-brand-green">
            {index + 1}.
          </span>
          <div className="min-w-0 flex-1">
            <TextInput
              value={value}
              onChange={(e) => onChange(index, e.target.value)}
              placeholder={placeholders[index] ?? placeholders[0]}
              rightIconInteractive
              rightIcon={
                <button
                  type="button"
                  onClick={() => onRemove(index)}
                  disabled={items.length <= 1}
                  className="font-sans text-[13px] leading-[20px] text-brand-green hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Remove
                </button>
              }
            />
          </div>
        </div>
      ))}
    </div>
  </div>
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

  const header = (
    <header className="flex flex-col gap-[10px] px-[clamp(20px,3vw,36px)] pb-[8px] pt-[clamp(24px,3vw,36px)] pr-[56px]">
      <h2
        className="font-display leading-[1.25] text-[#111]"
        style={{ fontSize: 'clamp(1.75rem, 2.6vw, 2.5rem)' }}
      >
        {copy.headline.before}
        <span className="italic text-brand-green">{copy.headline.accent}</span>
      </h2>
      <p className="font-sans text-[14px] leading-[1.4] text-[#575755]">{copy.subtitle}</p>
    </header>
  );

  const footer = (
    <div className="flex items-center justify-between gap-[16px] border-t border-[#f0ece4] bg-[#fefdfa] px-[clamp(20px,3vw,34px)] py-[16px]">
      <span className="inline-flex items-center gap-[8px] font-sans text-[12px] text-[#70706e]">
        <AutosaveIcon className="size-[14px] text-brand-green" />
        {JOB_POST_AUTOSAVE}
      </span>
      <Button
        type="button"
        variant="primary"
        size="sm"
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

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      size="xl"
      ariaLabel="Build your job post"
      showClose
      header={header}
      footer={footer}
      className="!bg-[rgba(17,17,17,0.7)] !backdrop-blur-none"
      contentClassName="!max-w-[850px] !h-[min(90vh,820px)] !rounded-[24px]"
    >
      <div className="flex flex-col gap-[clamp(16px,2vw,30px)] px-[clamp(20px,3vw,36px)] pb-[16px] pt-[clamp(8px,1vw,12px)]">
        <FormSection title="BASIC INFORMATION">
          <div className="grid grid-cols-1 gap-[14px] md:grid-cols-2">
            <TextInput
              label="Job Title"
              required
              value={form.jobTitle}
              onChange={(e) => setField('jobTitle', e.target.value)}
              placeholder={JOB_POST_PLACEHOLDERS.jobTitle}
            />
            <TextInput
              label="Company Name"
              required
              value={form.companyName}
              onChange={(e) => setField('companyName', e.target.value)}
              placeholder={JOB_POST_PLACEHOLDERS.companyName}
            />
            <Select
              label="Industry"
              required
              value={form.industry}
              onChange={(val) => setField('industry', val)}
              options={INDUSTRY_OPTIONS}
              placeholder="Select Industry"
            />
            <TextInput
              label="Department"
              optional
              value={form.department}
              onChange={(e) => setField('department', e.target.value)}
              placeholder={JOB_POST_PLACEHOLDERS.department}
            />
          </div>
        </FormSection>

        <FormSection title="DESCRIPTION & REQUIREMENTS">
          <Textarea
            label="Job Description"
            required
            value={form.description}
            onChange={(e) => setField('description', e.target.value)}
            placeholder={JOB_POST_PLACEHOLDERS.description}
            maxLength={JOB_DESCRIPTION_MAX}
            rows={5}
          />
          <DynamicList
            label="Required Qualifications"
            required
            items={form.qualifications}
            placeholders={[JOB_POST_PLACEHOLDERS.qualification, 'e.g. "3+ years experience"']}
            onChange={(i, v) => updateList('qualifications', i, v)}
            onAdd={() => addListItem('qualifications')}
            onRemove={(i) => removeListItem('qualifications', i)}
          />
          <DynamicList
            label="Key Responsibilities"
            required
            items={form.responsibilities}
            placeholders={[
              JOB_POST_PLACEHOLDERS.responsibility,
              'e.g. "Manage social media campaigns"',
            ]}
            onChange={(i, v) => updateList('responsibilities', i, v)}
            onAdd={() => addListItem('responsibilities')}
            onRemove={(i) => removeListItem('responsibilities', i)}
          />
        </FormSection>

        <FormSection title="JOB DETAILS">
          <div className="flex flex-col gap-[10px]">
            <span className="font-sans text-[14px] font-medium text-[#111]">
              Job Type <span className="font-semibold text-brand-green">*</span>
            </span>
            <div className="flex flex-wrap gap-x-[18px] gap-y-[10px]">
              {JOB_TYPE_OPTIONS.map((opt) => (
                <Radio
                  key={opt}
                  name="jobType"
                  value={opt}
                  label={opt}
                  checked={form.jobType === opt}
                  onChange={(v) => setField('jobType', v)}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-[14px] md:grid-cols-2">
            <div className="flex items-end gap-[10px]">
              <div className="min-w-0 flex-1">
                <Select
                  label="Experience Level"
                  required
                  value={form.experienceLevel}
                  onChange={(val) => setField('experienceLevel', val)}
                  options={EXPERIENCE_LEVEL_OPTIONS}
                  placeholder="Select Level"
                />
              </div>
              <span className="mb-[14px] shrink-0 font-sans text-[13px] text-[#9a9a97]">
                year(s)
              </span>
            </div>
            <TextInput
              label="Work Location"
              required
              value={form.workLocation}
              onChange={(e) => setField('workLocation', e.target.value)}
              placeholder={JOB_POST_PLACEHOLDERS.workLocation}
            />
          </div>

          <div className="flex flex-col gap-[10px]">
            <span className="font-sans text-[14px] font-medium text-[#111]">
              Work Arrangement <span className="font-semibold text-brand-green">*</span>
            </span>
            <div className="flex flex-wrap gap-x-[18px] gap-y-[10px]">
              {WORK_ARRANGEMENT_OPTIONS.map((opt) => (
                <Radio
                  key={opt}
                  name="workArrangement"
                  value={opt}
                  label={opt}
                  checked={form.workArrangement === opt}
                  onChange={(v) => setField('workArrangement', v)}
                />
              ))}
            </div>
          </div>
        </FormSection>

        <FormSection title="COMPENSATION & BENEFITS">
          <div className="flex flex-col gap-[12px]">
            <div className="flex flex-wrap items-center justify-between gap-[12px]">
              <span className="font-sans text-[14px] font-medium text-[#111]">
                Salary <span className="font-semibold text-brand-green">*</span>
              </span>
              <div className="inline-flex rounded-[6px] bg-[#f2f2f2] p-[4px]">
                {['range', 'fixed'].map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setField('salaryMode', mode)}
                    className={`rounded-[6px] px-[16px] py-[8px] font-sans text-[12px] capitalize transition-colors ${
                      form.salaryMode === mode
                        ? 'border border-[#e5e5e5] bg-white text-brand-green'
                        : 'text-[#595959]'
                    }`}
                  >
                    {mode === 'range' ? 'Range' : 'Fixed'}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-[10px] md:grid-cols-4">
              <Select
                inscription="Currency"
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
                    value={form.salaryMin}
                    onChange={(e) => setField('salaryMin', e.target.value)}
                    placeholder="10,000"
                  />
                  <TextInput
                    inscription="Max"
                    value={form.salaryMax}
                    onChange={(e) => setField('salaryMax', e.target.value)}
                    placeholder="20,000"
                  />
                </>
              ) : (
                <TextInput
                  inscription="Amount"
                  value={form.salaryFixed}
                  onChange={(e) => setField('salaryFixed', e.target.value)}
                  placeholder="Amount"
                />
              )}
              <Select
                inscription="Frequency"
                value={form.salaryFrequency}
                onChange={(val) => setField('salaryFrequency', val)}
                options={SALARY_FREQUENCY_OPTIONS}
                placeholder="/Month"
                chevronIcon={<ArrowheadDownIcon className="text-brand-green" />}
              />
            </div>
          </div>

          <div className="flex flex-col gap-[12px]">
            <span className="font-sans text-[14px] font-medium text-[#111]">
              Benefits / Perks <span className="font-semibold text-brand-green">*</span>
            </span>
            <div className="grid grid-cols-1 gap-x-[16px] gap-y-[12px] sm:grid-cols-2">
              {BENEFIT_OPTIONS.map((benefit) => (
                <Checkbox
                  key={benefit}
                  label={benefit}
                  checked={form.benefits.includes(benefit)}
                  onChange={() => toggleBenefit(benefit)}
                />
              ))}
            </div>
          </div>

          <Textarea
            label="Additional Perks"
            optional
            optionalClassName="text-brand-green"
            value={form.additionalPerks}
            onChange={(e) => setField('additionalPerks', e.target.value)}
            placeholder={JOB_POST_PLACEHOLDERS.additionalPerks}
            rows={3}
          />
        </FormSection>

        <FormSection title="PUBLISHING">
          {/* Figma 5132:68248 — label left, DD / Month / Year flexed right (gap 6). */}
          <div className="flex flex-wrap items-center justify-between gap-x-[12px] gap-y-[12px]">
            <span className="font-sans text-[14px] font-medium leading-6 text-[#111]">
              Application Deadline{' '}
              <span className="font-semibold text-brand-green" aria-hidden="true">
                *
              </span>
            </span>
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
          </div>
        </FormSection>
      </div>
    </Modal>
  );
};

export default JobPostFormModal;
