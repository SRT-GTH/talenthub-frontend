import { classNames } from '../../../../../utils/classNames.js';
import { PreviewEditIcon } from './PreviewIcons.jsx';

/*
 * SectionOutline — the drawn outline + edit tag of one section of the mock public page (Figma 7.8.3a "Hero" / "How it works": 1.5 px dashed #1f5fa8
 * at 70 %, tag #244a9f r6 h20 with the pencil and the section name 11.5/700; selected 7.8.3d: 2.5 px solid #387440 and a #387440 tag; the drafted FAQ
 * item 7.8.3f straddles its top edge). The tag is the keyboard / screen-reader button; a hidden full-size button catches the mouse ("click a section to open it").
 * Props: label (tag text), name (aria name of the section), selected, active (false = no outline at all: the published view), onOpen, tagClassName, className, children.
 */
const SectionOutline = ({
  label,
  name,
  selected = false,
  active = true,
  onOpen,
  tagClassName = 'top-[8px] left-[8px]',
  className,
  children,
}) => {
  if (!active) return <div className={className}>{children}</div>;
  return (
    <div
      className={classNames(
        'relative border-solid',
        selected
          ? 'border-[2.5px] border-[#387440]'
          : 'border-[1.5px] border-dashed border-[#1f5fa8]/70',
        className
      )}
    >
      {children}
      <button
        type="button"
        tabIndex={-1}
        aria-hidden="true"
        onClick={onOpen}
        className="absolute inset-0 z-[1] cursor-pointer border-0 bg-transparent p-0"
      />
      <button
        type="button"
        onClick={onOpen}
        aria-label={`Edit ${name ?? label}`}
        aria-pressed={selected}
        className={classNames(
          'absolute z-[2] inline-flex min-h-[24px] cursor-pointer items-center gap-[4px] rounded-[6px] border-0 py-[3px] pr-[8px] pl-[6px] font-sans text-[11.5px] leading-[14px] font-bold whitespace-nowrap text-white max-lg:text-[12px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1c2a21]',
          selected ? 'bg-[#387440]' : 'bg-[#244a9f]',
          tagClassName
        )}
      >
        <PreviewEditIcon className="size-[12px]" />
        {label}
      </button>
    </div>
  );
};

export default SectionOutline;
