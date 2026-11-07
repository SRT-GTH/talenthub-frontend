import { useState } from 'react';
import Button from '../../../ui/Button.jsx';
import CenteredIconDialog from '../../../ui/CenteredIconDialog.jsx';
import IconTileDialog from '../../../ui/IconTileDialog.jsx';
import Select from '../../../ui/form/Select.jsx';
import Textarea from '../../../ui/form/Textarea.jsx';
import { ArrowheadDownIcon } from '../../../shared/assets.jsx';
import {
  ArrowRight,
  BadgeCheck,
  PipelineGlyph,
  XCircleGlyph,
} from '../../recruiterJobs/jobIcons.jsx';
import { HintCheckbox, RadioOptionRow } from './ActionFormParts.jsx';
import {
  BULK_MOVE_COPY,
  NOT_PROGRESSING_COPY,
  NOT_PROGRESSING_REASONS,
  OFFER_ACCEPTED_COPY,
  OFFER_DECLINED_COPY,
  STAGE_LABELS,
} from './pipelineActionData.js';
import { debug } from '../../../../utils/debug.js';

const log = debug('ActionDialogs');

/*
 * ActionDialogs — the pipeline's confirm / prompt dialogs (all on the recruiter dialog shells `ui/IconTileDialog` and `ui/CenteredIconDialog`).
 *   BulkMoveDialog         PL-07 "Move 3 candidates to Screening?" (10173:16179): Move to dropdown, "Send each of them a short update" checkbox.
 *   NotProgressingDialog   PL-08 "Not progressing with Marcus Thorne" (10173:16828): private reason, message (600), keep in pool, don't send a message; red "Send and move".
 *   OfferAcceptedDialog    PL-12 "Akosua accepted your offer!" (10173:19440): what to do with the posting (radio list).
 *   OfferDeclinedDialog    PL-13 "Akosua declined the offer" (10173:20098): three next-step rows, Move to Not progressed, Done.
 * Each dialog is controlled by the layer: it gets the data and `onCancel` / `onConfirm`; closing and follow-up state live in the URL (PipelineActionLayer).
 */
// Figma draws every dialog button 48px high (the Button's own lg padding would give 56px).
const DIALOG_BUTTON = '!h-[48px] !py-0';
const chevron = <ArrowheadDownIcon className="size-[20px] text-[#387440]" />;
const firstName = (name) => name.split(' ')[0];

const FooterButtons = ({
  cancelLabel,
  confirmLabel,
  onCancel,
  onConfirm,
  confirmVariant,
  disabled,
}) => (
  <>
    <Button variant="tertiary" className={DIALOG_BUTTON} onClick={onCancel}>
      {cancelLabel}
    </Button>
    <Button
      variant={confirmVariant ?? 'primary'}
      size="sm"
      className={DIALOG_BUTTON}
      disabled={disabled}
      onClick={onConfirm}
    >
      {confirmLabel}
    </Button>
  </>
);

// ⚠️ ASSUMPTION: the "Move to" list holds the board stages a card can be moved forward to (only "Screening" is drawn).
const MOVE_TARGETS = ['screening', 'shortlisted', 'interview'].map((value) => ({
  value,
  label: STAGE_LABELS[value],
}));

export const BulkMoveDialog = ({
  candidates,
  fromLabel,
  jobTitle,
  defaultTo,
  onCancel,
  onConfirm,
}) => {
  const [to, setTo] = useState(defaultTo ?? 'screening');
  const [notify, setNotify] = useState(true);
  const names = candidates.map((card) => card.name);
  const nameList =
    names.length > 1 ? `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}` : names[0];
  const stageLabel = STAGE_LABELS[to];
  log('render', { count: candidates.length, to, notify });

  return (
    <CenteredIconDialog
      icon={<PipelineGlyph size={28} />}
      title={BULK_MOVE_COPY.title(candidates.length, stageLabel)}
      body={BULK_MOVE_COPY.body(nameList, fromLabel, stageLabel)}
      onClose={onCancel}
      widthClassName="!max-w-[520px]"
      footer={
        <FooterButtons
          cancelLabel={BULK_MOVE_COPY.cancel}
          confirmLabel={BULK_MOVE_COPY.confirm(candidates.length)}
          onCancel={onCancel}
          onConfirm={() => {
            log('branch: bulk move confirm', { to, notify, ids: candidates.map((c) => c.id) });
            onConfirm({ to, notify });
          }}
        />
      }
    >
      <div className="pb-[23px]">
        <Select
          verified
          chevronIcon={chevron}
          required
          label={BULK_MOVE_COPY.moveToLabel}
          value={to}
          onChange={setTo}
          options={MOVE_TARGETS}
        />
      </div>
      <HintCheckbox
        checked={notify}
        onChange={setNotify}
        label={BULK_MOVE_COPY.notifyLabel}
        hint={BULK_MOVE_COPY.notifyPreview(jobTitle, stageLabel)}
      />
    </CenteredIconDialog>
  );
};

export const NotProgressingDialog = ({ candidate, jobTitleShort, onCancel, onConfirm }) => {
  const first = firstName(candidate.name);
  const [reason, setReason] = useState(NOT_PROGRESSING_REASONS[0].value);
  const [message, setMessage] = useState(NOT_PROGRESSING_COPY.defaultMessage(first, jobTitleShort));
  const [keepInPool, setKeepInPool] = useState(true);
  const [noMessage, setNoMessage] = useState(false);
  const canSend = noMessage || message.trim().length > 0;
  log('render', { candidate: candidate.id, reason, keepInPool, noMessage, length: message.length });

  return (
    <IconTileDialog
      icon={<XCircleGlyph size={22} />}
      iconTileClassName="bg-[#f9ebea] text-[#c0392b]"
      title={NOT_PROGRESSING_COPY.title(first, candidate.name.split(' ').slice(1).join(' '))}
      body={NOT_PROGRESSING_COPY.body(first)}
      onClose={onCancel}
      footer={
        <div className="flex items-center justify-end gap-[10px]">
          <FooterButtons
            cancelLabel={NOT_PROGRESSING_COPY.cancel}
            confirmLabel={NOT_PROGRESSING_COPY.confirm}
            confirmVariant="danger"
            disabled={!canSend}
            onCancel={onCancel}
            onConfirm={() => {
              log('branch: not progressing confirm', { reason, keepInPool, noMessage });
              onConfirm({ reason, message: noMessage ? '' : message, keepInPool, noMessage });
            }}
          />
        </div>
      }
    >
      <div className="pb-[23px]">
        <Select
          verified
          chevronIcon={chevron}
          required
          label={NOT_PROGRESSING_COPY.reasonLabel}
          value={reason}
          onChange={setReason}
          options={NOT_PROGRESSING_REASONS}
        />
      </div>
      <Textarea
        label={NOT_PROGRESSING_COPY.messageLabel(first)}
        maxLength={NOT_PROGRESSING_COPY.maxLength}
        counterInside
        rows={3}
        disabled={noMessage}
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        boxClassName="!rounded-[10px] !border !border-[#dbded9] !bg-white !shadow-[0_3px_0_0_rgba(34,70,38,0.8)]"
        textareaClassName="!resize-none !px-[16px] !pt-[12px] !pb-[8px] !leading-[24px]"
      />
      <HintCheckbox
        checked={keepInPool}
        onChange={setKeepInPool}
        label={NOT_PROGRESSING_COPY.keepInPool(first)}
      />
      <HintCheckbox
        checked={noMessage}
        onChange={setNoMessage}
        label={NOT_PROGRESSING_COPY.noMessage}
        hint={NOT_PROGRESSING_COPY.noMessageHint}
      />
    </IconTileDialog>
  );
};

export const OfferAcceptedDialog = ({ candidate, jobTitleShort, onCancel, onConfirm }) => {
  const first = firstName(candidate.name);
  const [choice, setChoice] = useState('close');
  log('render', { candidate: candidate.id, choice });
  return (
    <CenteredIconDialog
      icon={<BadgeCheck size={28} />}
      title={OFFER_ACCEPTED_COPY.title(first)}
      body={OFFER_ACCEPTED_COPY.body(jobTitleShort)}
      onClose={onCancel}
      widthClassName="!max-w-[540px]"
      footer={
        <FooterButtons
          cancelLabel={OFFER_ACCEPTED_COPY.notNow}
          confirmLabel={OFFER_ACCEPTED_COPY.confirm}
          onCancel={onCancel}
          onConfirm={() => {
            log('branch: accepted offer choice', { choice });
            onConfirm({ choice });
          }}
        />
      }
    >
      <div
        role="radiogroup"
        aria-label={OFFER_ACCEPTED_COPY.title(first)}
        className="flex flex-col gap-[10px] rounded-[16px] border border-solid border-[#e5e8e3] bg-[#fffefc] p-[16px]"
      >
        {OFFER_ACCEPTED_COPY.options.map((option) => (
          <RadioOptionRow
            key={option.value}
            name="offer-accepted-choice"
            value={option.value}
            checked={choice === option.value}
            onChange={setChoice}
            label={
              typeof option.label === 'function'
                ? option.label(OFFER_ACCEPTED_COPY.otherActiveCandidates)
                : option.label
            }
            hint={option.hint}
          />
        ))}
      </div>
    </CenteredIconDialog>
  );
};

export const OfferDeclinedDialog = ({ candidate, onCancel, onMoveToNotProgressed, onStep }) => {
  const first = firstName(candidate.name);
  log('render', { candidate: candidate.id });
  return (
    <CenteredIconDialog
      icon={<XCircleGlyph size={28} />}
      iconTileClassName="bg-[#f9ebea] text-[#c0392b]"
      title={OFFER_DECLINED_COPY.title(first)}
      body={OFFER_DECLINED_COPY.body(OFFER_DECLINED_COPY.reason)}
      onClose={onCancel}
      footer={
        <>
          <Button variant="tertiary" className={DIALOG_BUTTON} onClick={onMoveToNotProgressed}>
            {OFFER_DECLINED_COPY.moveToNotProgressed(first)}
          </Button>
          <Button variant="primary" size="sm" className={DIALOG_BUTTON} onClick={onCancel}>
            {OFFER_DECLINED_COPY.done}
          </Button>
        </>
      }
    >
      <ul className="m-0 flex list-none flex-col gap-[8px] p-0">
        {OFFER_DECLINED_COPY.steps.map((step) => {
          const title = typeof step.title === 'function' ? step.title(first) : step.title;
          return (
            <li key={step.id}>
              <button
                type="button"
                onClick={() => {
                  log('branch: next step', { step: step.id });
                  onStep(step.id);
                }}
                className="flex min-h-[72px] w-full cursor-pointer items-center justify-between gap-[12px] rounded-[16px] border border-solid border-[#e5e8e3] bg-white p-[12px] text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
              >
                <span className="flex min-w-0 flex-col gap-[2px]">
                  <span className="font-sans text-[14px] leading-[24px] font-semibold tracking-[0.1px] text-[#111]">
                    {title}
                  </span>
                  <span className="font-sans text-[12px] leading-[20px] tracking-[0.2px] text-[#575755]">
                    {step.detail}
                  </span>
                </span>
                <span className="flex shrink-0 items-center gap-[6px] font-sans text-[14px] leading-[24px] font-medium tracking-[0.2px] text-[#387440]">
                  {OFFER_DECLINED_COPY.go}
                  <ArrowRight size={16} />
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </CenteredIconDialog>
  );
};
