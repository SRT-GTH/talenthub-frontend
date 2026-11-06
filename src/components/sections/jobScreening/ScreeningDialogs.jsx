import { useEffect, useState } from 'react';
import Button from '../../ui/Button.jsx';
import IconTileDialog from '../../ui/IconTileDialog.jsx';
import Modal from '../../ui/Modal.jsx';
import Select from '../../ui/form/Select.jsx';
import TextInput from '../../ui/form/TextInput.jsx';
import { ArrowheadDownIcon } from '../../shared/assets.jsx';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import { flowIcons } from './screeningFlowIcons.js';
import { MOVE_DIALOG, PROCESSING, SAVE_DIALOG } from './screeningFlowData.js';

const log = debug('ScreeningDialogs');

/*
 * ScreeningDialogs — the three dialogs of the screening flow (Figma "Recruiter - Job Postings" 10103:59491), all on `ui/Modal` over the #0b1a0f 45 % scrim.
 *   ProcessingDialog     JS-04  "Modal · Screening 128 applicants…" (500 wide, r24, p32): filter tile, title, the four check steps (done / running / pending) and a progress track. Props: checked (0-128).
 *   MoveToPipelineDialog JS-10  "Modal · Move 46 applicants to Screening?" (560 wide): pipeline tile, the notify checkbox and the two radios for the applicants who didn’t qualify.
 *                               Props: count, unqualified, notify, rejectOthers, onChange({ notify?, rejectOthers? }), onCancel, onConfirm.
 *   SaveCriteriaDialog   JS-12  "Modal · Save screening criteria" (520 wide, on `ui/IconTileDialog`): Name, Suggest it for, the five-rule summary and two checkboxes.
 *                               Props: name, suggestFor, share, makeDefault, onChange(partial), onCancel, onConfirm.
 */
const CenteredDialog = ({ ariaLabel, onClose, widthClassName, icon, title, children, footer }) => (
  <Modal
    isOpen
    onClose={onClose}
    size="sm"
    ariaLabel={ariaLabel}
    showClose={false}
    scrollHint={false}
    className="!bg-[#0b1a0f]/45 !backdrop-blur-none"
    contentClassName={classNames(
      widthClassName,
      '!rounded-[24px] p-[32px] shadow-[0_2px_4px_rgba(15,15,10,0.06),0_12px_28px_-6px_rgba(15,15,10,0.1)] sm:!pb-[32px] max-sm:!rounded-b-none max-sm:p-[20px]'
    )}
  >
    <div className="flex flex-col items-center gap-[16px]">
      <span className="flex size-[56px] shrink-0 items-center justify-center rounded-[10px] bg-[#ebf1ec]">
        <img src={icon} alt="" aria-hidden="true" className="size-[28px]" />
      </span>
      <h2 className="m-0 text-center font-['Bricolage_Grotesque',sans-serif] text-[28px] leading-[34px] font-semibold tracking-[-0.56px] text-[#111]">
        {title}
      </h2>
      {children}
      {footer}
    </div>
  </Modal>
);

const STEP_ICONS = {
  done: flowIcons.stepDoneCheckCircle,
  running: flowIcons.stepRunningRefresh,
  pending: flowIcons.stepPendingClock,
};

export const ProcessingDialog = ({ checked }) => {
  const total = PROCESSING.total;
  const safe = Math.max(0, Math.min(total, checked));
  const stateOf = (index) => {
    if (safe >= (index + 1) * PROCESSING.stepSize) return 'done';
    if (safe >= index * PROCESSING.stepSize) return 'running';
    return 'pending';
  };
  log('render', { checked: safe, steps: PROCESSING.steps.map((_, i) => stateOf(i)) });

  return (
    <CenteredDialog
      ariaLabel={PROCESSING.title}
      onClose={() => {}}
      widthClassName="!max-w-[500px]"
      icon={flowIcons.processingFilterGlyph}
      title={PROCESSING.title}
    >
      <div className="flex w-full flex-col gap-[12px]" role="status" aria-live="polite">
        <p className="m-0 font-sans text-[14px] leading-[24px] tracking-[0.2px] text-[#575755]">
          {PROCESSING.body}
        </p>
        <ul className="m-0 flex list-none flex-col gap-[10px] p-0">
          {PROCESSING.steps.map((label, index) => {
            const state = stateOf(index);
            return (
              <li key={label} className="flex items-center gap-[10px]" data-state={state}>
                <img
                  src={STEP_ICONS[state]}
                  alt=""
                  aria-hidden="true"
                  className={classNames(
                    'size-[18px] shrink-0',
                    state === 'running' && 'animate-spin'
                  )}
                />
                <span
                  className={classNames(
                    'font-sans text-[14px] leading-[24px] tracking-[0.2px]',
                    state === 'pending' ? 'text-[#575755]' : 'font-medium text-[#111]'
                  )}
                >
                  {label}
                </span>
              </li>
            );
          })}
        </ul>
        <div className="flex flex-col items-center gap-[12px]">
          <div
            role="progressbar"
            aria-label="Screening progress"
            aria-valuemin={0}
            aria-valuemax={total}
            aria-valuenow={safe}
            className="h-[8px] w-full overflow-hidden rounded-[8px] bg-[#fefefe] shadow-[inset_0_0_0_1px_#e5e8e3]"
          >
            <span
              className="block h-full rounded-[8px] bg-[#387440] transition-[width] duration-300"
              style={{ width: `${(safe / total) * 100}%` }}
            />
          </div>
          <span className="font-sans text-[12px] leading-[20px] tracking-[0.2px] text-[#575755]">
            {`${safe} of ${total} checked`}
          </span>
        </div>
      </div>
    </CenteredDialog>
  );
};

/*
 * ProcessingRunner — the live JS-04: counts `checked` up by 8 every 220 ms, then calls onDone 400 ms after 128.
 * `pinned` (URL key `checked`) freezes the count at that number so a frame can be opened as it was drawn (80 of 128).
 */
export const ProcessingRunner = ({ pinned, onDone }) => {
  const [counted, setCounted] = useState(0);
  const isPinned = pinned !== null && !Number.isNaN(pinned);
  useEffect(() => {
    if (isPinned) return undefined;
    const timer = setInterval(
      () => setCounted((value) => Math.min(PROCESSING.total, value + 8)),
      220
    );
    return () => clearInterval(timer);
  }, [isPinned]);
  useEffect(() => {
    if (isPinned || counted < PROCESSING.total) return undefined;
    const timer = setTimeout(onDone, 400);
    return () => clearTimeout(timer);
  }, [isPinned, counted, onDone]);
  return <ProcessingDialog checked={isPinned ? pinned : counted} />;
};

const Box = ({ checked, round = false }) => (
  <span
    aria-hidden="true"
    className={classNames(
      'mt-[3px] flex size-[18px] shrink-0 items-center justify-center peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand-green',
      round ? 'rounded-full' : 'rounded-[5px]',
      checked ? 'bg-[#387440]' : 'border border-solid border-[#dbded9] bg-white'
    )}
  >
    {checked && round ? <span className="size-[8px] rounded-full bg-white" /> : null}
    {checked && !round ? (
      <img src={flowIcons.checkboxTickWhite} alt="" className="size-[12px]" />
    ) : null}
  </span>
);

const ChoiceRow = ({ type, checked, onChange, label, note }) => (
  <label className="flex cursor-pointer items-start gap-[10px]">
    <input
      type={type}
      checked={checked}
      onChange={onChange}
      className="peer sr-only"
      name={type === 'radio' ? 'unqualified' : undefined}
    />
    <Box checked={checked} round={type === 'radio'} />
    <span className="flex min-w-0 flex-col gap-[2px]">
      <span className="font-sans text-[14px] leading-[24px] tracking-[0.2px] text-[#111]">
        {label}
      </span>
      {note ? (
        <span className="font-sans text-[12px] leading-[20px] tracking-[0.2px] text-[#575755]">
          {note}
        </span>
      ) : null}
    </span>
  </label>
);

export const MoveToPipelineDialog = ({
  count,
  unqualified,
  notify,
  rejectOthers,
  onChange,
  onCancel,
  onConfirm,
}) => {
  log('render', { count, unqualified, notify, rejectOthers });
  return (
    <CenteredDialog
      ariaLabel={MOVE_DIALOG.title(count)}
      onClose={onCancel}
      widthClassName="!max-w-[560px]"
      icon={flowIcons.movePipelineGlyph}
      title={MOVE_DIALOG.title(count)}
      footer={
        <div className="flex items-center justify-center gap-[12px] max-sm:flex-wrap">
          <Button variant="tertiary" onClick={onCancel}>
            {MOVE_DIALOG.cancel}
          </Button>
          <Button variant="primary" size="sm" onClick={onConfirm}>
            {MOVE_DIALOG.confirm(count)}
          </Button>
        </div>
      }
    >
      <div className="flex w-full flex-col gap-[12px]">
        <p className="m-0 font-sans text-[14px] leading-[24px] tracking-[0.2px] text-[#575755]">
          {MOVE_DIALOG.body}
        </p>
        <div className="flex flex-col gap-[10px] rounded-[16px] border border-solid border-[#e5e8e3] bg-[#fffefc] p-[16px]">
          <ChoiceRow
            type="checkbox"
            checked={notify}
            onChange={() => onChange({ notify: !notify })}
            label={MOVE_DIALOG.notify}
            note={MOVE_DIALOG.notifyNote}
          />
          <span className="font-sans text-[14px] leading-[24px] font-semibold tracking-[0.2px] text-[#111]">
            {MOVE_DIALOG.unqualifiedTitle(unqualified)}
          </span>
          <ChoiceRow
            type="radio"
            checked={!rejectOthers}
            onChange={() => onChange({ rejectOthers: false })}
            label={MOVE_DIALOG.keep}
            note={MOVE_DIALOG.keepNote}
          />
          <ChoiceRow
            type="radio"
            checked={rejectOthers}
            onChange={() => onChange({ rejectOthers: true })}
            label={MOVE_DIALOG.reject}
          />
        </div>
      </div>
    </CenteredDialog>
  );
};

export const SaveCriteriaDialog = ({
  name,
  suggestFor,
  share,
  makeDefault,
  onChange,
  onCancel,
  onConfirm,
}) => {
  log('render', { name, suggestFor, share, makeDefault });
  return (
    <IconTileDialog
      icon={<img src={flowIcons.saveCriteriaFilterGlyph} alt="" className="size-[22px]" />}
      title={SAVE_DIALOG.title}
      body={SAVE_DIALOG.body}
      onClose={onCancel}
      widthClassName="!max-w-[520px]"
      className="sm:!pb-[24px]"
      footer={
        <div className="flex items-center justify-end gap-[10px]">
          <Button variant="tertiary" onClick={onCancel}>
            {SAVE_DIALOG.cancel}
          </Button>
          <Button
            variant="primary"
            size="sm"
            disabled={name.trim().length === 0}
            onClick={onConfirm}
          >
            {SAVE_DIALOG.save}
          </Button>
        </div>
      }
    >
      <TextInput
        label={SAVE_DIALOG.nameLabel}
        required
        value={name}
        onChange={(event) => onChange({ name: event.target.value })}
      />
      <Select
        verified
        chevronIcon={<ArrowheadDownIcon className="size-[20px] text-[#387440]" />}
        required
        label={SAVE_DIALOG.suggestLabel}
        value={suggestFor}
        onChange={(value) => onChange({ suggestFor: value })}
        options={SAVE_DIALOG.suggestOptions.map((option) => ({ value: option, label: option }))}
      />
      <ul className="m-0 flex list-none flex-col gap-[6px] rounded-[16px] border border-solid border-[#e5e8e3] bg-[#fffefc] p-[16px]">
        {SAVE_DIALOG.rules.map((rule) => (
          <li key={rule} className="flex items-center gap-[8px]">
            <img
              src={flowIcons.savedCriteriaTick}
              alt=""
              aria-hidden="true"
              className="size-[14px]"
            />
            <span className="font-sans text-[12px] leading-[20px] tracking-[0.2px] text-[#111]">
              {rule}
            </span>
          </li>
        ))}
      </ul>
      <ChoiceRow
        type="checkbox"
        checked={share}
        onChange={() => onChange({ share: !share })}
        label={SAVE_DIALOG.share}
      />
      <ChoiceRow
        type="checkbox"
        checked={makeDefault}
        onChange={() => onChange({ makeDefault: !makeDefault })}
        label={SAVE_DIALOG.makeDefault}
      />
    </IconTileDialog>
  );
};
