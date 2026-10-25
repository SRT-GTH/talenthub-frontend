import { classNames } from '../../../../utils/classNames.js';
import {
  CalendarIcon,
  CompanyIcon,
  EditIcon,
  FileIcon,
  FileCheckIcon,
  LabelIcon,
  LinkIcon,
  TimeClockIcon,
} from './institutionOnboardingIcons.jsx';

/*
 * InstitutionAccredDocCard — one document entry of the accreditation page (Figma "Entry · …" 8596:1133 in the upload state, "Doc …" rows of 11.1.2a2 8589:2700): white, 1px ink@.10, r20,
 * p 20, gap 16, 52 round tile (verified = solid #387440 with a white file-check; others = #ebf1ec with the file glyph), title 18/21 600 + status chip, meta row
 * (13/16 500 #595959 with 14px glyphs), tag chips (#ebf1ec, 12/14 600 #387440), the green link ("Upload" / "View file") and the pencil button on listed documents.
 * Props: title, status (chip text), tone ('ok' verified | 'warn' pending check | 'plain' needs more info | 'required' the yellow "Required" chip), meta (strings),
 * tags (strings), link ({ label, onClick, href }), onEdit, verified (solid tile), className.
 */

const CHIP = {
  ok: 'border-[#1c2a21]/10 bg-white text-[#595959]',
  warn: 'border-[#ecd9a3] bg-[#faf4e8] text-[#785910]',
  plain: 'border-[#1c2a21]/10 bg-[#f8f8f4] text-[#595959]',
  required: 'border-[#1c2a21]/12 bg-[#ffd86b] text-[#1c2a21]',
};
const META_ICONS = [CompanyIcon, CalendarIcon, LabelIcon];

const InstitutionAccredDocCard = ({
  title,
  status,
  tone = 'ok',
  meta,
  tags = [],
  link,
  onEdit,
  verified = false,
  pending = false,
  className,
}) => (
  <li
    className={classNames(
      'flex list-none items-start gap-[16px] rounded-[20px] border border-solid border-[#1c2a21]/10 bg-white py-[20px] pr-[20px] pl-[18px] shadow-[0_1px_2px_rgba(15,15,10,0.05),0_2px_8px_rgba(15,15,10,0.06)]',
      className
    )}
  >
    <span
      aria-hidden="true"
      className={classNames(
        'grid size-[52px] shrink-0 place-items-center rounded-[14px]',
        verified ? 'bg-[#387440] text-white' : 'bg-[#ebf1ec] text-[#387440]'
      )}
    >
      {verified || !pending ? (
        <FileCheckIcon className="size-[24px]" />
      ) : (
        <FileIcon className="size-[24px]" />
      )}
    </span>
    <div className="flex min-w-0 flex-1 flex-col gap-[6px]">
      <div className="flex flex-wrap items-center gap-[10px]">
        <h3 className="m-0 font-sans text-[18px] leading-[21px] font-semibold text-[#1c2a21]">
          {title}
        </h3>
        <span
          className={classNames(
            'inline-flex items-center gap-[4px] rounded-full border border-solid px-[10px] py-[4px] font-sans text-[11px] max-lg:text-[12px] leading-[13px] font-semibold',
            CHIP[tone]
          )}
        >
          {tone === 'warn' ? <TimeClockIcon className="size-[11px]" /> : null}
          {status}
        </span>
      </div>
      <p className="m-0 flex flex-wrap items-center gap-x-[12px] gap-y-[4px] font-sans text-[13px] leading-[16px] font-medium text-[#595959]">
        {meta.map((m, i) => {
          const Icon = META_ICONS[i] ?? LabelIcon;
          return (
            <span key={m} className="inline-flex items-center gap-[5px]">
              <Icon className="size-[14px] shrink-0 text-[#595959]" />
              {m}
            </span>
          );
        })}
      </p>
      {tags.length ? (
        <ul className="m-0 flex list-none flex-wrap gap-[6px] p-0">
          {tags.map((t) => (
            <li
              key={t}
              className="inline-flex items-center rounded-full border border-solid border-[#1c2a21]/10 bg-[#ebf1ec] px-[10px] py-[4px] font-sans text-[12px] leading-[14px] font-semibold text-[#387440]"
            >
              {t}
            </li>
          ))}
        </ul>
      ) : null}
      {link ? (
        <button
          type="button"
          onClick={link.onClick}
          className="inline-flex min-h-[24px] w-fit items-center gap-[5px] font-sans text-[13px] leading-[16px] font-semibold text-[#387440] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
        >
          <LinkIcon className="size-[14px]" />
          {link.label}
        </button>
      ) : null}
    </div>
    {onEdit ? (
      <button
        type="button"
        onClick={onEdit}
        aria-label={`Edit ${title}`}
        className="grid size-[32px] shrink-0 place-items-center rounded-[8px] border border-solid border-[#1c2a21]/10 bg-white text-[#387440] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
      >
        <EditIcon className="size-[16px]" />
      </button>
    ) : null}
  </li>
);

export default InstitutionAccredDocCard;
