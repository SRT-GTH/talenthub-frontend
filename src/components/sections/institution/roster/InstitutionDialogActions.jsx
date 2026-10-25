import { classNames } from '../../../../utils/classNames.js';
import { Roster20ArrowRightIcon } from './rosterIcons.jsx';

/*
 * InstitutionDialogActions — the footer buttons of the 820 / 620 roster dialogs (Figma "Actions" 8590:384493, 60 high, p-top 8, gap 12, right aligned):
 * a light "cancel" button (r14, p 14/34, #e1eae2, 2px #c1d4c4, 16/24 700 #165d3a) and the green primary (r10, p 14/28, #387440, 2px #2a5730, 4px shelf, 16/24 700 white, arrow 20).
 * Props: left (node, e.g. the "Download error report" link), cancelLabel, onCancel, primaryLabel, onPrimary, primaryDisabled, primaryType, arrow (bool, default true),
 * ring (the 20 px ring of "Send transfer request"), form (id of a <form> the primary submits), className.
 */
const InstitutionDialogActions = ({
  left,
  cancelLabel,
  onCancel,
  primaryLabel,
  onPrimary,
  primaryDisabled = false,
  primaryType = 'button',
  arrow = true,
  ring = false,
  form,
  className,
}) => (
  <div className={classNames('flex flex-wrap items-center gap-[12px] pt-[8px]', className)}>
    <div className="mr-auto">{left}</div>
    {cancelLabel ? (
      <button
        type="button"
        onClick={onCancel}
        className="inline-flex h-[52px] cursor-pointer items-center rounded-[14px] border-2 border-solid border-[#c1d4c4] bg-[#e1eae2] px-[34px] font-sans text-[16px] leading-[24px] font-bold tracking-[0.1px] text-[#165d3a] shadow-[0_1px_2px_rgba(15,15,10,0.05)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
      >
        {cancelLabel}
      </button>
    ) : null}
    <button
      type={primaryType}
      form={form}
      onClick={onPrimary}
      disabled={primaryDisabled}
      className="inline-flex h-[52px] cursor-pointer items-center gap-[8px] rounded-[10px] border-2 border-solid border-[#2a5730] bg-[#387440] px-[28px] font-sans text-[16px] leading-[24px] font-bold tracking-[0.1px] text-white shadow-[0_4px_0_#2a5730] transition-[transform,box-shadow] duration-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440] active:translate-y-[3px] active:shadow-[0_1px_0_#2a5730] disabled:cursor-not-allowed disabled:opacity-50"
    >
      {primaryLabel}
      {ring ? (
        <span
          aria-hidden="true"
          className="size-[20px] rounded-full border border-solid border-[#fefefe]"
        />
      ) : arrow ? (
        <Roster20ArrowRightIcon className="size-[20px]" />
      ) : null}
    </button>
  </div>
);

export default InstitutionDialogActions;
