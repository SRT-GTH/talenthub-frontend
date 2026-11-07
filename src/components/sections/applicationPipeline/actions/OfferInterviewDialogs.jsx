import { useState } from 'react';
import Button from '../../../ui/Button.jsx';
import IconTileDialog from '../../../ui/IconTileDialog.jsx';
import Select from '../../../ui/form/Select.jsx';
import Textarea from '../../../ui/form/Textarea.jsx';
import TextInput from '../../../ui/form/TextInput.jsx';
import { ArrowheadDownIcon } from '../../../shared/assets.jsx';
import { BadgeCheck, CalendarGlyph, XCircleGlyph } from '../../recruiterJobs/jobIcons.jsx';
import { FeedbackBubbleIcon, OfferLetterFileIcon, RatingOutlineStarIcon } from './actionIcons.jsx';
import {
  FEEDBACK_CRITERIA,
  INTERVIEW_FEEDBACK_COPY,
  NEXT_STEP_OPTIONS,
  OFFER_COPY,
  OFFER_DEFAULTS,
  OFFER_EMPLOYMENT_OPTIONS,
  OFFER_EXPIRY_OPTIONS,
  OVERALL_VERDICTS,
} from './pipelineActionData.js';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';

const log = debug('OfferInterviewDialogs');

/*
 * OfferInterviewDialogs — the two forms that sit on `ui/IconTileDialog`.
 *   ExtendOfferDialog         PL-10 "Extend an offer to Sarah Jenkins" (10173:18129, 640px): salary + start date, expiry + employment dropdowns, the attached offer letter (Replace), message (600), withdraw hint, Cancel / Send offer.
 *   InterviewCompletedDialog  PL-14 "How did the interview with Sarah go?" (10173:20763, 620px): overall verdict pills, three 5-star ratings, notes, next-step pills, Save for later / Save and extend offer.
 * ⚠️ ASSUMPTION: the letter is a mock file; Replace only logs. The star rows and the pills are real controls (radio semantics) although Figma draws one state.
 */
const DIALOG_BUTTON = '!h-[48px] !py-0';
const chevron = <ArrowheadDownIcon className="size-[20px] text-[#387440]" />;
const firstName = (name) => name.split(' ')[0];
const boxClass =
  '!rounded-[10px] !border !border-[#dbded9] !bg-white !shadow-[0_3px_0_0_rgba(34,70,38,0.8)]';
const areaClass = '!resize-none !px-[16px] !pt-[12px] !pb-[8px] !leading-[24px]';

export const ExtendOfferDialog = ({ candidate, jobTitleShort, onCancel, onConfirm }) => {
  const first = firstName(candidate.name);
  const [salary, setSalary] = useState(OFFER_DEFAULTS.salary);
  const [startDate, setStartDate] = useState(OFFER_DEFAULTS.startDate);
  const [expires, setExpires] = useState(OFFER_DEFAULTS.expires);
  const [employment, setEmployment] = useState(OFFER_DEFAULTS.employment);
  const [message, setMessage] = useState(OFFER_COPY.defaultMessage(first, jobTitleShort));
  const canSend = salary.trim() && startDate.trim() && message.trim();
  log('render', { candidate: candidate.id, expires, employment, length: message.length });

  return (
    <IconTileDialog
      icon={<BadgeCheck size={22} />}
      title={OFFER_COPY.title(candidate.name)}
      body={OFFER_COPY.body(first)}
      onClose={onCancel}
      widthClassName="!max-w-[640px]"
      footer={
        <div className="flex flex-wrap items-center justify-between gap-x-[10px] gap-y-[12px]">
          <p className="m-0 font-sans text-[12px] leading-[20px] tracking-[0.2px] text-[#575755]">
            {OFFER_COPY.withdrawHint(first)}
          </p>
          <div className="flex items-center gap-[10px] max-sm:w-full max-sm:justify-end">
            <Button variant="tertiary" className={DIALOG_BUTTON} onClick={onCancel}>
              {OFFER_COPY.cancel}
            </Button>
            <Button
              variant="primary"
              size="sm"
              className={DIALOG_BUTTON}
              disabled={!canSend}
              onClick={() => {
                log('branch: send offer', { salary, startDate, expires, employment });
                onConfirm({ salary, startDate, expires, employment, message });
              }}
            >
              {OFFER_COPY.confirm}
            </Button>
          </div>
        </div>
      }
    >
      <div className="grid grid-cols-2 gap-x-[12px] max-sm:grid-cols-1">
        <TextInput
          required
          label={OFFER_COPY.salaryLabel}
          value={salary}
          onChange={(event) => setSalary(event.target.value)}
        />
        <TextInput
          required
          label={OFFER_COPY.startDateLabel}
          value={startDate}
          onChange={(event) => setStartDate(event.target.value)}
        />
      </div>
      <div className="grid grid-cols-2 gap-x-[12px] max-sm:grid-cols-1">
        <div className="pb-[23px]">
          <Select
            verified
            chevronIcon={chevron}
            required
            label={OFFER_COPY.expiresLabel}
            value={expires}
            onChange={setExpires}
            options={OFFER_EXPIRY_OPTIONS}
          />
        </div>
        <div className="pb-[23px]">
          <Select
            verified
            chevronIcon={chevron}
            required
            label={OFFER_COPY.employmentLabel}
            value={employment}
            onChange={setEmployment}
            options={OFFER_EMPLOYMENT_OPTIONS}
          />
        </div>
      </div>
      <div className="flex items-center gap-[12px] rounded-[16px] border border-solid border-[#e5e8e3] bg-white p-[16px]">
        <OfferLetterFileIcon className="size-[20px] shrink-0 text-[#387440]" />
        <p className="m-0 min-w-0 flex-1 truncate font-sans text-[14px] leading-[24px] font-medium tracking-[0.2px] text-[#111]">
          {`${OFFER_DEFAULTS.letter.name} · ${OFFER_DEFAULTS.letter.size}`}
        </p>
        <button
          type="button"
          onClick={() => log('replace offer letter (mock, no file picker)')}
          className="min-h-[24px] shrink-0 cursor-pointer border-0 bg-transparent p-0 font-sans text-[14px] leading-[24px] font-medium tracking-[0.2px] text-[#387440] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
        >
          {OFFER_COPY.replace}
        </button>
      </div>
      <Textarea
        label={OFFER_COPY.messageLabel}
        maxLength={OFFER_COPY.maxLength}
        counterInside
        rows={2}
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        boxClassName={boxClass}
        textareaClassName={areaClass}
      />
    </IconTileDialog>
  );
};

const PILL_BASE =
  'inline-flex min-h-[40px] cursor-pointer items-center gap-[6px] rounded-full border border-solid px-[16px] py-[8px] font-sans text-[14px] leading-[24px] font-medium tracking-[0.2px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green';

const NEXT_ICONS = { 'badge-check': BadgeCheck, calendar: CalendarGlyph, 'x-circle': XCircleGlyph };

const StarRating = ({ label, value, onChange }) => (
  <div className="flex items-center justify-between gap-[12px]">
    <span className="font-sans text-[14px] leading-[24px] tracking-[0.2px] text-[#111]">
      {label}
    </span>
    <div role="radiogroup" aria-label={label} className="flex shrink-0 items-center gap-[4px]">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          role="radio"
          aria-checked={value === star}
          aria-label={`${star} of 5`}
          onClick={() => onChange(star)}
          className={classNames(
            '-mx-[3px] flex size-[24px] cursor-pointer items-center justify-center border-0 bg-transparent p-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green',
            star <= value ? 'text-[#c8951a]' : 'text-[#babab7]'
          )}
        >
          <RatingOutlineStarIcon filled={star <= value} className="size-[18px]" />
        </button>
      ))}
    </div>
  </div>
);

export const InterviewCompletedDialog = ({ candidate, onCancel, onSaveForLater, onSave }) => {
  const first = firstName(candidate.name);
  const [overall, setOverall] = useState('yes');
  const [ratings, setRatings] = useState(
    Object.fromEntries(FEEDBACK_CRITERIA.map((item) => [item.id, item.rating]))
  );
  const [notes, setNotes] = useState(INTERVIEW_FEEDBACK_COPY.defaultNotes);
  const [nextStep, setNextStep] = useState('extend-offer');
  log('render', { candidate: candidate.id, overall, nextStep });

  const payload = { overall, ratings, notes, nextStep };
  return (
    <IconTileDialog
      icon={<FeedbackBubbleIcon className="size-[22px]" />}
      title={INTERVIEW_FEEDBACK_COPY.title(first)}
      body={INTERVIEW_FEEDBACK_COPY.body(first)}
      onClose={onCancel}
      widthClassName="!max-w-[620px]"
      footer={
        <div className="flex items-center justify-end gap-[10px]">
          <Button
            variant="tertiary"
            className={DIALOG_BUTTON}
            onClick={() => onSaveForLater(payload)}
          >
            {INTERVIEW_FEEDBACK_COPY.saveForLater}
          </Button>
          <Button
            variant="primary"
            size="sm"
            className={DIALOG_BUTTON}
            onClick={() => {
              log('branch: save and continue', payload);
              onSave(payload);
            }}
          >
            {INTERVIEW_FEEDBACK_COPY.saveAndExtend}
          </Button>
        </div>
      }
    >
      <p className="m-0 font-sans text-[14px] leading-[24px] font-medium tracking-[0.2px] text-[#111]">
        {INTERVIEW_FEEDBACK_COPY.overallLabel}
      </p>
      <div
        role="radiogroup"
        aria-label={INTERVIEW_FEEDBACK_COPY.overallLabel}
        className="flex flex-wrap gap-[8px]"
      >
        {OVERALL_VERDICTS.map((verdict) => {
          const selected = overall === verdict.value;
          return (
            <button
              key={verdict.value}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => setOverall(verdict.value)}
              className={classNames(
                PILL_BASE,
                selected
                  ? 'border-[1.5px] border-[#387440] bg-[#ebf1ec] text-[#387440]'
                  : 'border-[#dbded9] bg-white text-[#111]'
              )}
            >
              {verdict.label}
            </button>
          );
        })}
      </div>
      {FEEDBACK_CRITERIA.map((criterion) => (
        <StarRating
          key={criterion.id}
          label={criterion.label}
          value={ratings[criterion.id]}
          onChange={(rating) => setRatings((current) => ({ ...current, [criterion.id]: rating }))}
        />
      ))}
      <Textarea
        label={INTERVIEW_FEEDBACK_COPY.notesLabel}
        counterInside={false}
        rows={2}
        value={notes}
        onChange={(event) => setNotes(event.target.value)}
        boxClassName={boxClass}
        textareaClassName={areaClass}
      />
      <p className="m-0 font-sans text-[14px] leading-[24px] font-medium tracking-[0.2px] text-[#111]">
        {INTERVIEW_FEEDBACK_COPY.nextStepLabel}
      </p>
      <div
        role="radiogroup"
        aria-label={INTERVIEW_FEEDBACK_COPY.nextStepLabel}
        className="flex flex-wrap gap-[8px]"
      >
        {NEXT_STEP_OPTIONS.map((option) => {
          const selected = nextStep === option.value;
          const Icon = NEXT_ICONS[option.icon];
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => setNextStep(option.value)}
              className={classNames(
                PILL_BASE,
                selected
                  ? 'border-[#2a5730] bg-[#2a5730] text-white'
                  : 'border-[#dbded9] bg-white text-[#111]'
              )}
            >
              <Icon size={16} className={selected ? 'text-white' : 'text-[#575755]'} />
              {option.label}
            </button>
          );
        })}
      </div>
    </IconTileDialog>
  );
};
