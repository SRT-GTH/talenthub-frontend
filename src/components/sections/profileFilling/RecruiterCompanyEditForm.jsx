import { useState } from 'react';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import Button from '../../ui/Button.jsx';
import companyLogo from '../../../assets/recruiter/company-logo-silver-rock.png';
import photoChangeIcon from '../../../assets/recruiter/company-edit-photo-change.svg';
import sectionChevronIcon from '../../../assets/recruiter/company-edit-section-chevron.svg';
import selectArrowIcon from '../../../assets/recruiter/company-edit-select-arrow.svg';
import listRemoveIcon from '../../../assets/recruiter/company-edit-list-remove.svg';
import listAddIcon from '../../../assets/recruiter/company-edit-list-add.svg';
import kybUploadIcon from '../../../assets/recruiter/company-edit-kyb-upload.svg';

const log = debug('RecruiterCompanyEditForm');

// ⚠️ ASSUMPTION: Figma draws only the selected values ("11 - 50", "+233"); the other options are invented.
const COMPANY_SIZE_OPTIONS = ['1 - 10', '11 - 50', '51 - 200', '201 - 500', '501+'];
const PHONE_CODE_OPTIONS = ['+233'];

const INPUT_BOX =
  'box-border flex min-w-0 items-center rounded-[8px] border border-solid border-[#e9e9e9] bg-white px-[16px] py-[12px] font-sans text-[16px] leading-[22px] text-[#737373]';
const LABEL = 'shrink-0 font-sans text-[16px] font-medium leading-[24px] text-[#111]';

/** "11–50 employees" (panel) -> "11 - 50" (select). */
const sizeToOption = (value) => {
  const match = String(value ?? '').match(/(\d+)\s*[–-]\s*(\d+)/);
  return match ? `${match[1]} - ${match[2]}` : (COMPANY_SIZE_OPTIONS[1] ?? '');
};
const optionToSize = (option) => `${option.replace(/\s*-\s*/, '–')} employees`;

/** "+233 24 248 4435" -> { code: "+233", number: "24 248 4435" }. */
const splitPhone = (value) => {
  const match = String(value ?? '').match(/^(\+\d+)\s*(.*)$/);
  return match
    ? { code: match[1], number: match[2] }
    : { code: PHONE_CODE_OPTIONS[0], number: String(value ?? '') };
};

const splitList = (value) =>
  String(value ?? '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

/** One label + control row: label left, control right (Figma 7958:162027 rows, 72px apart). */
const FieldRow = ({ label, children, className }) => (
  <div
    className={classNames(
      'flex w-full items-center justify-between gap-[72px] max-lg:flex-col max-lg:items-stretch max-lg:gap-1.5',
      className
    )}
  >
    <span className={LABEL}>{label}</span>
    {children}
  </div>
);

const TextBox = ({ label, value, onChange }) => (
  <FieldRow label={label}>
    <input
      type="text"
      aria-label={label}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className={classNames(
        INPUT_BOX,
        'h-[46px] w-[320px] max-w-full focus:border-brand-green-light-active focus:outline-none max-lg:w-full'
      )}
    />
  </FieldRow>
);

const SelectBox = ({ ariaLabel, value, options, onChange, className }) => (
  <span className={classNames('relative inline-flex', className)}>
    <select
      aria-label={ariaLabel}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className={classNames(
        INPUT_BOX,
        'h-[46px] cursor-pointer appearance-none pr-[36px] focus:border-brand-green-light-active focus:outline-none'
      )}
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
    <img
      src={selectArrowIcon}
      alt=""
      aria-hidden="true"
      className="pointer-events-none absolute right-[12px] top-1/2 size-[16px] -translate-y-1/2"
    />
  </span>
);

/** A collapsible group of editable rows with a remove button each and an "Add" button (Culture & Values, Services Offered). */
const ChipListField = ({ label, items, onChange }) => {
  const [open, setOpen] = useState(true);
  return (
    <div className="flex w-full flex-col gap-[14px]">
      <div className="flex w-full items-center justify-between">
        <span className={classNames(LABEL, 'leading-[19px]')}>{label}</span>
        <button
          type="button"
          aria-label={`${open ? 'Collapse' : 'Expand'} ${label}`}
          aria-expanded={open}
          onClick={() => setOpen((prev) => !prev)}
          className="flex size-[24px] shrink-0 cursor-pointer items-center justify-center border-0 bg-transparent p-0"
        >
          <img
            src={sectionChevronIcon}
            alt=""
            aria-hidden="true"
            className={classNames('size-[16px] transition-transform', !open && 'rotate-180')}
          />
        </button>
      </div>
      {open && (
        <>
          <div className="flex flex-col gap-[10px]">
            {items.map((item, index) => (
              <div
                key={index}
                className="box-border flex h-[44px] items-center gap-[10px] rounded-[8px] border border-solid border-[#e9e9e9] bg-[#f8f8f8] py-[11px] pl-[16px] pr-[12px]"
              >
                <input
                  type="text"
                  aria-label={`${label} ${index + 1}`}
                  value={item}
                  onChange={(event) =>
                    onChange(items.map((x, i) => (i === index ? event.target.value : x)))
                  }
                  className="min-w-0 flex-1 border-0 bg-transparent p-0 font-sans text-[15px] leading-[21px] text-[#70706e] focus:outline-none"
                />
                <button
                  type="button"
                  aria-label={`Remove ${item || label}`}
                  onClick={() => onChange(items.filter((_, i) => i !== index))}
                  className="flex size-[26px] shrink-0 cursor-pointer items-center justify-center border-0 bg-transparent p-0"
                >
                  <img src={listRemoveIcon} alt="" aria-hidden="true" className="size-[26px]" />
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => onChange([...items, ''])}
            className="flex min-h-[24px] w-fit cursor-pointer items-center gap-[6px] border-0 bg-transparent p-0 font-sans text-[16px] font-medium leading-[19px] text-[#387440]"
          >
            <img src={listAddIcon} alt="" aria-hidden="true" className="size-[16px]" />
            Add
          </button>
        </>
      )}
    </div>
  );
};

/*
 * RecruiterCompanyEditForm — the Company Info. rows of the recruiter panel in edit mode (Figma "USER EDITS COMPANY INFO"
 * 7958:161872 / 7958:162080, instance 7958:162027): photo with "Change Photo", Name, a collapsible Bio box, Email, Company size
 * (select + "Employees"), Phone (code select + number), Address, Culture & Values and Services Offered as removable rows with an
 * "Add" button, the KYB/KYC upload box and the green "Update" button.
 * It draws only the rows the panel gives it, in Figma's order (rows it does not know follow as text boxes), so the signed-in
 * recruiter's panel (Industry, Website & social links, no phone or services) edits through the same form. A `readOnly` row is
 * shown as text; a KYB/KYC row that is not read-only is the upload box.
 * Props: fields ({ label, value, kind?, readOnly? }[] — the panel's field list, values as the view shows them), onChange(label, value), onUpdate().
 * Values are kept as the same strings the view mode renders (lists joined with ", ", size as "11–50 employees").
 */
const FIELD_ORDER = [
  'Name',
  'Bio',
  'Email',
  'Company size',
  'Phone',
  'Address',
  'Industry',
  'Culture & Values',
  'Services Offered',
  'Website & social links',
  'KYB/KYC Status',
];
const PLACEHOLDER_VALUES = ['Not added yet', '—', ''];
const orderIndex = (label) => {
  const i = FIELD_ORDER.indexOf(label);
  return i === -1 ? FIELD_ORDER.length : i;
};

const ReadOnlyRow = ({ label, value }) => (
  <FieldRow label={label}>
    <span className="max-w-[320px] text-right font-sans text-[16px] leading-[22px] text-[#595959] max-lg:max-w-full max-lg:text-left">
      {value}
    </span>
  </FieldRow>
);

const KybUploadBox = () => (
  <div className="flex w-full flex-col gap-[16px]">
    <span className={LABEL}>KYB/KYC Status</span>
    <button
      type="button"
      onClick={() => log('branch', { kybUpload: true })}
      className="box-border flex h-[74px] w-full cursor-pointer items-center justify-center gap-[10px] rounded-[8px] border border-solid border-[#bfbfbf] bg-[#f8f8f8] py-[20px]"
    >
      <img src={kybUploadIcon} alt="" aria-hidden="true" className="size-[20px]" />
      <span className="flex flex-col items-start gap-[2px] text-left">
        <span className="font-sans text-[15px] leading-[18px] text-[#575755]">
          Upload your KYB/KYC document
        </span>
        <span className="font-sans text-[12px] leading-[14px] text-[#959592]">
          Maximum file size: 5MB
        </span>
      </span>
    </button>
  </div>
);

const BioField = ({ value, onChange }) => {
  const [open, setOpen] = useState(true);
  return (
    <div className="flex w-full flex-col gap-[14px]">
      <div className="flex w-full items-center justify-between">
        <span className={classNames(LABEL, 'leading-[19px]')}>Bio</span>
        <button
          type="button"
          aria-label={open ? 'Collapse bio' : 'Expand bio'}
          aria-expanded={open}
          onClick={() => setOpen((prev) => !prev)}
          className="flex size-[24px] shrink-0 cursor-pointer items-center justify-center border-0 bg-transparent p-0"
        >
          <img
            src={sectionChevronIcon}
            alt=""
            aria-hidden="true"
            className={classNames('size-[16px] transition-transform', !open && 'rotate-180')}
          />
        </button>
      </div>
      {open && (
        <textarea
          aria-label="Bio"
          value={PLACEHOLDER_VALUES.includes(value) ? '' : value}
          placeholder={value === 'Not added yet' ? value : undefined}
          rows={4}
          onChange={(event) => onChange(event.target.value)}
          className={classNames(
            INPUT_BOX,
            'min-h-[108px] w-full resize-y items-start focus:border-brand-green-light-active focus:outline-none'
          )}
        />
      )}
    </div>
  );
};

const RecruiterCompanyEditForm = ({ fields, onChange, onUpdate }) => {
  log('render', { fieldCount: fields.length });
  const photo = fields.find((field) => field.kind === 'photo');
  const rows = fields
    .filter((field) => field.kind !== 'photo')
    .sort((a, b) => orderIndex(a.label) - orderIndex(b.label));

  const renderRow = (field) => {
    const { label, value = '' } = field;
    const set = (next) => onChange(label, next);
    if (label === 'KYB/KYC Status') {
      return field.readOnly ? (
        <ReadOnlyRow key={label} label={label} value={value} />
      ) : (
        <KybUploadBox key={label} />
      );
    }
    if (field.readOnly) return <ReadOnlyRow key={label} label={label} value={value} />;
    if (field.kind === 'bio') return <BioField key={label} value={value} onChange={set} />;
    if (label === 'Company size') {
      return (
        <FieldRow key={label} label={label}>
          <span className="flex items-center gap-[12px]">
            <SelectBox
              ariaLabel="Company size"
              value={sizeToOption(value)}
              options={COMPANY_SIZE_OPTIONS}
              onChange={(option) => set(optionToSize(option))}
            />
            <span className="font-sans text-[16px] leading-[22px] text-[#737373]">Employees</span>
          </span>
        </FieldRow>
      );
    }
    if (label === 'Phone') {
      const phone = splitPhone(value);
      return (
        <FieldRow key={label} label={label}>
          <span className="flex items-center gap-[6px]">
            <SelectBox
              ariaLabel="Phone country code"
              value={phone.code}
              options={PHONE_CODE_OPTIONS}
              onChange={(code) => set(`${code} ${phone.number}`)}
            />
            <input
              type="tel"
              aria-label="Phone number"
              value={phone.number}
              onChange={(event) => set(`${phone.code} ${event.target.value}`)}
              className={classNames(
                INPUT_BOX,
                'h-[46px] w-[124px] focus:border-brand-green-light-active focus:outline-none'
              )}
            />
          </span>
        </FieldRow>
      );
    }
    if (label === 'Culture & Values' || label === 'Services Offered') {
      return (
        <ChipListField
          key={label}
          label={label}
          items={PLACEHOLDER_VALUES.includes(value) ? [] : splitList(value)}
          onChange={(items) => set(items.join(', '))}
        />
      );
    }
    return (
      <TextBox
        key={label}
        label={label}
        value={PLACEHOLDER_VALUES.includes(value) ? '' : value}
        onChange={set}
      />
    );
  };

  return (
    <div className="flex w-full flex-col items-end gap-[48px] max-lg:gap-8">
      <div className="flex w-full flex-col gap-[24px]">
        {photo && (
          <div className="flex items-center gap-[11px]">
            <img
              src={companyLogo}
              alt="Silver Rock Technologies logo"
              className="size-[56px] shrink-0 rounded-full object-cover"
            />
            <div className="flex flex-col gap-[4px]">
              <span className="font-sans text-[16px] font-medium leading-[19px] text-[#1c2a21]">
                Profile Photo
              </span>
              <button
                type="button"
                onClick={() => log('branch', { changePhoto: true })}
                className="flex min-h-[24px] w-fit cursor-pointer items-center gap-[6px] border-0 bg-transparent p-0 font-sans text-[14px] leading-[17px] text-[#224626]"
              >
                <img src={photoChangeIcon} alt="" aria-hidden="true" className="size-[18px]" />
                Change Photo
              </button>
            </div>
          </div>
        )}

        <div className="flex w-full flex-col gap-[18px]">{rows.map(renderRow)}</div>
      </div>

      <div className="flex w-full justify-end">
        <Button variant="primary" size="md" className="h-[48px]" onClick={onUpdate}>
          Update
        </Button>
      </div>
    </div>
  );
};

export default RecruiterCompanyEditForm;
