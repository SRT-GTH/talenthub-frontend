import { useState } from 'react';
import { classNames } from '../../../utils/classNames.js';
import Button from '../../ui/Button.jsx';
import Modal from '../../ui/Modal.jsx';
import Textarea from '../../ui/form/Textarea.jsx';
import { dashIcons } from './recruiterDashboardIcons.js';
import { FEEDBACK_DIALOG, FEEDBACK_MINE } from './recruiterDashboardData.js';

/*
 * FeedbackParts — the two pieces behind the Feedback widget's states (section 08):
 *   MyFeedbackPanel — the "My feedback · 4.5 ★" tab (Figma D70 10197:115334): a mint rating summary (4.5, five stars, "From 12 candidate ratings · raters stay anonymous")
 *                     and three anonymous quotes with stars, "A candidate · <role>", an uppercase age and the quote.
 *   FeedbackDialog  — "Feedback for Elena Sterling" (D71 10197:118025, D72 10197:119299 "too short"): a 5-star overall rating, three Needs work / Good / Strong groups,
 *                     a 500-character note (minimum 20) and Cancel / Submit feedback (disabled until a rating and 20 characters).
 * ⚠️ ASSUMPTION: no frame draws a chosen Needs work / Good / Strong, so a chosen one is filled green; the star rating is clickable (D72 draws 4 of 5 filled).
 */
const Stars = ({ value, size = 'small' }) => {
  const filled =
    size === 'summary' ? dashIcons.ratingStarFilledSummary : dashIcons.ratingStarFilledSmall;
  const empty =
    size === 'summary' ? dashIcons.ratingStarEmptySummary : dashIcons.ratingStarEmptySmall;
  const px = size === 'summary' ? 'size-[16px]' : 'size-[12px]';
  return (
    <span role="img" aria-label={`${value} out of 5 stars`} className="inline-flex gap-[2px]">
      {[1, 2, 3, 4, 5].map((n) => (
        <img
          key={n}
          src={value >= n - 0.5 ? filled : empty}
          alt=""
          aria-hidden="true"
          className={px}
        />
      ))}
    </span>
  );
};

export const MyFeedbackPanel = () => (
  <div className="flex flex-col gap-[12px]">
    <div className="flex items-center gap-[12px] rounded-[12px] bg-[#ebf1ec] px-[16px] py-[12px]">
      <span className="font-['Bricolage_Grotesque',sans-serif] text-[37px] leading-[44px] font-semibold text-[#111]">
        {FEEDBACK_MINE.score}
      </span>
      <span className="flex flex-col gap-[2px]">
        <Stars value={FEEDBACK_MINE.stars} size="summary" />
        <span className="font-sans text-[12px] leading-[20px] text-[#575755]">
          {FEEDBACK_MINE.caption}
        </span>
      </span>
    </div>
    <ul className="m-0 flex list-none flex-col gap-[12px] p-0">
      {FEEDBACK_MINE.reviews.map((review) => (
        <li
          key={review.id}
          className="flex flex-col gap-[6px] rounded-[10px] border border-solid border-[#e5e8e3] p-[12px]"
        >
          <span className="flex items-center justify-between gap-[8px]">
            <span className="flex items-center gap-[8px]">
              <Stars value={review.stars} />
              <span className="font-sans text-[12px] leading-[20px] font-medium text-[#111]">
                {review.who}
              </span>
            </span>
            <span className="font-sans text-[10px] leading-[16px] text-[#575755] uppercase max-xl:text-[12px]">
              {review.when}
            </span>
          </span>
          <span className="font-sans text-[14px] leading-[24px] text-[#111]">{review.text}</span>
        </li>
      ))}
    </ul>
  </div>
);

const MIN_CHARS = 20;

export const FeedbackDialog = ({ candidate, initial = {}, onCancel, onSubmit }) => {
  const first = candidate.name.split(' ')[0];
  const [rating, setRating] = useState(initial.rating ?? 0);
  const [levels, setLevels] = useState({});
  const [text, setText] = useState(initial.text ?? '');
  const tooShort = text.length > 0 && text.length < MIN_CHARS;
  const canSubmit = rating > 0 && text.length >= MIN_CHARS;
  return (
    <Modal
      isOpen
      onClose={onCancel}
      size="sm"
      ariaLabel={FEEDBACK_DIALOG.title(candidate.name)}
      showClose={false}
      className="!bg-[#0b1a0f]/45 !backdrop-blur-none"
      contentClassName="!max-w-[560px] !rounded-[24px] p-[24px] shadow-[0_24px_64px_rgba(15,15,10,0.18)] max-sm:p-[20px]"
    >
      <div className="flex flex-col gap-[20px]">
        <div className="flex items-start gap-[12px]">
          <span className="flex size-[44px] shrink-0 items-center justify-center rounded-[12px] bg-[#ebf1ec]">
            <img
              src={dashIcons.feedbackDialogTile}
              alt=""
              aria-hidden="true"
              className="size-[22px]"
            />
          </span>
          <div className="flex min-w-0 flex-1 flex-col gap-[4px]">
            <h2 className="m-0 font-['Bricolage_Grotesque',sans-serif] text-[24px] leading-[29px] font-semibold tracking-[-0.48px] text-[#111]">
              {FEEDBACK_DIALOG.title(candidate.name)}
            </h2>
            <p className="m-0 font-sans text-[14px] leading-[24px] text-[#575755]">
              {FEEDBACK_DIALOG.body(candidate.role, candidate.date, first)}
            </p>
          </div>
          <button
            type="button"
            aria-label="Close dialog"
            onClick={onCancel}
            className="flex size-[32px] shrink-0 cursor-pointer items-center justify-center rounded-[8px] border-0 bg-[#fffefc] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
          >
            <img src={dashIcons.dialogCloseX} alt="" aria-hidden="true" className="size-[16px]" />
          </button>
        </div>

        <div className="flex flex-col gap-[8px]">
          <span className="font-sans text-[14px] leading-[24px] font-medium text-[#111]">
            {FEEDBACK_DIALOG.ratingLabel}
          </span>
          <div role="radiogroup" aria-label="Overall rating" className="flex gap-[2px]">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                role="radio"
                aria-checked={rating === n}
                aria-label={`${n} star${n > 1 ? 's' : ''}`}
                onClick={() => setRating(n)}
                className="flex size-[30px] cursor-pointer items-center justify-center border-0 bg-transparent p-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
              >
                <img
                  src={
                    n <= rating ? dashIcons.ratingStarFilledLarge : dashIcons.ratingStarEmptyLarge
                  }
                  alt=""
                  aria-hidden="true"
                  className="size-[28px]"
                />
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-[10px]">
          <span className="font-sans text-[14px] leading-[24px] font-medium text-[#111]">
            {FEEDBACK_DIALOG.groupLabel}
          </span>
          {FEEDBACK_DIALOG.criteria.map((criterion) => (
            <div key={criterion} className="flex flex-wrap items-center justify-between gap-[8px]">
              <span className="font-sans text-[14px] leading-[24px] text-[#111]">{criterion}</span>
              <div role="radiogroup" aria-label={criterion} className="flex gap-[8px]">
                {FEEDBACK_DIALOG.levels.map((level) => {
                  const on = levels[criterion] === level;
                  return (
                    <button
                      key={level}
                      type="button"
                      role="radio"
                      aria-checked={on}
                      onClick={() => setLevels((prev) => ({ ...prev, [criterion]: level }))}
                      className={classNames(
                        'inline-flex h-[24px] cursor-pointer items-center rounded-full border border-solid px-[10px] font-sans text-[12px] leading-[20px] font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green',
                        on
                          ? 'border-[#387440] bg-[#ebf1ec] text-[#2a5730]'
                          : 'border-[#dbded9] bg-white text-[#111]'
                      )}
                    >
                      {level}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <Textarea
          label={FEEDBACK_DIALOG.textLabel(first)}
          required
          maxLength={500}
          placeholder={FEEDBACK_DIALOG.placeholder}
          value={text}
          onChange={(event) => setText(event.target.value)}
          error={tooShort ? FEEDBACK_DIALOG.tooShort : undefined}
          counterSuffix={FEEDBACK_DIALOG.counterSuffix}
          counterErrorTone
        />

        <div className="flex justify-end gap-[12px]">
          <Button variant="tertiary" onClick={onCancel}>
            {FEEDBACK_DIALOG.cancel}
          </Button>
          <Button
            variant="primary"
            disabled={!canSubmit}
            onClick={() => onSubmit({ rating, levels, text })}
          >
            <img
              src={dashIcons.feedbackSubmitDisabledSend}
              alt=""
              aria-hidden="true"
              className="size-[16px]"
            />
            {FEEDBACK_DIALOG.submit}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
