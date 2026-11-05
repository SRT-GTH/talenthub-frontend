import { useId } from 'react';
import { classNames } from '../../../../../utils/classNames.js';
import { debug } from '../../../../../utils/debug.js';
import CopyChip from './CopyChip.jsx';
import { PreviewCloseIcon } from './PreviewIcons.jsx';

const log = debug('QuickSectionPanel');

/*
 * QuickSectionPanel — the slim "Section editor" that opens beside the preview when an outlined section is clicked (Figma 7.8.3d, 445 wide, white, r20, p24, gap22):
 * breadcrumb "Home › How it works", the section title 22/26 600 + status chip + "Close", then one field per text with its counter ("12 / 40", 12.5/600 #575755).
 * Typing writes the draft (the preview updates live); a role without edit sees the fields read-only.
 * Props: meta (sectionMeta), value(key), onChange(key, text), onClose, status ('Default' | 'Edited' | 'Draft'), readOnly.
 */
const BOX =
  'w-full rounded-[12px] border border-solid border-[#e7e7e7] bg-white px-[14px] py-[12px] font-sans text-[15px] leading-[22px] text-[#1c2a21] outline-none placeholder:text-[#575755] focus-visible:border-[#387440] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#387440] read-only:bg-[#f8f8f4]';

const PanelField = ({ field, value, onChange, readOnly }) => {
  const id = useId();
  const long = Boolean(field.long);
  const Tag = long ? 'textarea' : 'input';
  return (
    <div className="flex flex-col gap-[8px]">
      <div className="flex items-baseline justify-between gap-[8px]">
        <label
          htmlFor={id}
          className="font-sans text-[14px] leading-[17px] font-semibold text-[#1c2a21]"
        >
          {field.label}
        </label>
        <span
          aria-hidden="true"
          data-count={`${value.length} / ${field.max}`}
          className="font-sans text-[12.5px] leading-[15px] font-semibold text-[#575755] after:content-[attr(data-count)]"
        />
      </div>
      <Tag
        id={id}
        value={value}
        readOnly={readOnly}
        maxLength={field.max}
        rows={long ? 4 : undefined}
        aria-label={`${field.label}, ${value.length} of ${field.max} characters`}
        onChange={(e) => onChange(field.key, e.target.value)}
        className={classNames(BOX, long ? 'min-h-[96px] resize-y' : 'h-[48px]')}
      />
    </div>
  );
};

const QuickSectionPanel = ({ meta, value, onChange, onClose, status, readOnly }) => {
  log('render', { section: meta.id, status, readOnly });
  return (
    <aside
      aria-label={`Section editor · ${meta.label}`}
      className="flex w-full flex-col gap-[22px] rounded-[20px] border border-solid border-[#1c2a21]/10 bg-white p-[24px] xl:w-[445px] xl:shrink-0"
    >
      <div className="flex flex-col gap-[10px]">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-[6px] font-sans text-[13px] leading-[16px] font-medium text-[#575755]"
        >
          <span>{meta.page}</span>
          <span aria-hidden="true">›</span>
          <span className="font-semibold text-[#1c2a21]" aria-current="page">
            {meta.label}
          </span>
        </nav>
        <div className="flex flex-wrap items-center gap-[10px]">
          <h2 className="m-0 font-sans text-[22px] leading-[26px] font-semibold text-[#1c2a21]">
            {meta.label}
          </h2>
          <CopyChip
            tone={status === 'Default' ? 'default' : status === 'Edited' ? 'edited' : 'unpublished'}
          >
            {status}
          </CopyChip>
          <span className="min-w-0 flex-1" />
          <button
            type="button"
            onClick={onClose}
            className="inline-flex min-h-[34px] cursor-pointer items-center gap-[6px] rounded-[10px] border border-solid border-[#e7e7e7] bg-white px-[12px] py-[8px] font-sans text-[13.5px] leading-[16px] font-semibold text-[#1c2a21] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
          >
            <PreviewCloseIcon className="size-[16px]" />
            Close
          </button>
        </div>
      </div>
      {meta.fields.map((f) => (
        <PanelField
          key={f.key}
          field={f}
          value={value(f.key)}
          onChange={onChange}
          readOnly={readOnly}
        />
      ))}
    </aside>
  );
};

export default QuickSectionPanel;
