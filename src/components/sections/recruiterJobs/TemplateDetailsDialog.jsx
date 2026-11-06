import Modal from '../../ui/Modal.jsx';
import { JobButton } from './jobButtons.jsx';
import { CheckCircle, CloseGlyph, EyeGlyph, FileGlyph } from './jobIcons.jsx';
import { PRODUCT_DESIGNER, TEMPLATE_DETAILS as D } from './jobFormData.js';
import { classNames } from '../../../utils/classNames.js';

/*
 * TemplateDetailsDialog — "Template details" (Figma JT-01 10117:50522): the Product Designer template read-only before choosing it.
 * Opened from a template card: /recruiter/job-templates?modal=details&template=<id>. Mock: every template shows the Product Designer content.
 * Layout: 44px file tile + title + meta + close; chips row; two columns (About / Responsibilities with check bullets / Skills pills | "Included in this template" card); footer "Preview as talent" link + Close + Use template.
 * Props: onClose, onUse, onPreview.
 */
const Chip = ({ children }) => (
  <span className="inline-flex h-[24px] items-center rounded-[6px] bg-[#f6f6f2] px-[8px] font-sans text-[12px] leading-[16px] text-[#575755]">
    {children}
  </span>
);

const TemplateDetailsDialog = ({ onClose, onUse, onPreview }) => (
  <Modal
    isOpen
    onClose={onClose}
    size="lg"
    ariaLabel={D.title}
    showClose={false}
    scrollHint={false}
    className="!bg-[#0b1a0f]/45 !backdrop-blur-none"
    contentClassName="!max-w-[740px] !rounded-[24px] p-[24px] sm:!pb-[24px] shadow-[0_4px_0_0_rgba(0,0,0,0.13),0_40px_100px_0_rgba(0,0,0,0.25)] max-sm:!rounded-b-none max-sm:p-[16px]"
  >
    <div className="flex flex-col gap-[16px]">
      <div className="flex items-start gap-[12px]">
        <span className="flex size-[44px] shrink-0 items-center justify-center rounded-[10px] bg-[#ebf1ec] text-[#2a5730]">
          <FileGlyph size={22} />
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-[2px]">
          <h2 className="m-0 font-heading text-[24px] leading-[29px] font-semibold tracking-[-0.48px] text-[#111]">
            {D.title}
          </h2>
          <p className="m-0 font-sans text-[14px] leading-[20px] text-[#575755]">{D.meta}</p>
        </div>
        <button
          type="button"
          aria-label="Close dialog"
          onClick={onClose}
          className="flex size-[32px] shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-[#fffefc] text-[#111]"
        >
          <CloseGlyph size={14} />
        </button>
      </div>

      <div className="flex flex-wrap gap-[8px]">
        {D.chips.map((chip) => (
          <Chip key={chip}>{chip}</Chip>
        ))}
      </div>

      <div className="grid gap-[20px] sm:grid-cols-[minmax(0,1fr)_220px]">
        <div className="flex min-w-0 flex-col gap-[12px]">
          <h3 className="m-0 font-sans text-[14px] leading-[20px] font-semibold text-[#111]">
            {D.aboutTitle}
          </h3>
          <p className="m-0 font-sans text-[14px] leading-[22px] text-[#111]">
            {PRODUCT_DESIGNER.about}
          </p>
          <h3 className="m-0 mt-[4px] font-sans text-[14px] leading-[20px] font-semibold text-[#111]">
            {D.responsibilitiesTitle}
          </h3>
          <ul className="m-0 flex list-none flex-col gap-[10px] p-0">
            {PRODUCT_DESIGNER.responsibilities.map((line) => (
              <li
                key={line}
                className="flex items-start gap-[8px] font-sans text-[14px] leading-[20px] text-[#111]"
              >
                <CheckCircle size={16} className="mt-[2px] shrink-0 text-[#2a5730]" />
                {line}
              </li>
            ))}
          </ul>
          <h3 className="m-0 mt-[4px] font-sans text-[14px] leading-[20px] font-semibold text-[#111]">
            {D.skillsTitle}
          </h3>
          <div className="flex flex-wrap gap-[8px]">
            {PRODUCT_DESIGNER.skills.map((skill) => (
              <span
                key={skill.name}
                className={classNames(
                  'inline-flex h-[24px] items-center rounded-full border border-solid px-[10px] font-sans text-[12px] leading-[16px] font-medium',
                  skill.required
                    ? 'border-[#bcd6c1] bg-[#ebf1ec] text-[#2a5730]'
                    : 'border-[#dbded9] bg-white text-[#575755]'
                )}
              >
                {skill.name}
                {skill.required ? ' (required)' : ''}
              </span>
            ))}
          </div>
        </div>

        <aside className="flex h-fit flex-col gap-[12px] rounded-[12px] border border-solid border-[#e1eae2] bg-white p-[16px]">
          <h3 className="m-0 font-sans text-[12px] leading-[16px] font-semibold text-[#111]">
            {D.includedTitle}
          </h3>
          <ul className="m-0 flex list-none flex-col gap-[10px] p-0">
            {D.included.map((line) => (
              <li
                key={line}
                className="flex items-start gap-[8px] font-sans text-[12px] leading-[16px] text-[#111]"
              >
                <CheckCircle size={14} className="mt-[1px] shrink-0 text-[#2a5730]" />
                {line}
              </li>
            ))}
          </ul>
          <p className="m-0 border-0 border-t border-solid border-[#e1eae2] pt-[10px] font-sans text-[10px] leading-[14px] text-[#575755]">
            {D.includedNote}
          </p>
        </aside>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-[12px]">
        <button
          type="button"
          onClick={onPreview}
          className="inline-flex cursor-pointer items-center gap-[6px] border-0 bg-transparent p-0 font-sans text-[12px] leading-[16px] font-medium text-[#2a5730]"
        >
          <EyeGlyph size={14} />
          {D.previewAsTalent}
        </button>
        <div className="flex items-center gap-[12px]">
          <JobButton tone="ghost" onClick={onClose}>
            {D.close}
          </JobButton>
          <JobButton onClick={onUse}>{D.use}</JobButton>
        </div>
      </div>
    </div>
  </Modal>
);

export default TemplateDetailsDialog;
