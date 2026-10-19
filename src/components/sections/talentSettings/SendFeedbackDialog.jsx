import { useId, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import {
  FeedbackCheck16Icon,
  FeedbackCommentIcon,
  FeedbackEmojiBigSmileIcon,
  FeedbackEmojiSadIcon,
  FeedbackEmojiSmileIcon,
  HelpModalCloseIcon,
} from '../../shared/assets.jsx';
import { DIALOG_CARD, FOCUS_RING, HEADING, HelpButton, HelpModal } from './helpUi.jsx';
import { FEEDBACK } from './helpData.js';

const log = debug('SendFeedbackDialog');

/*
 * SendFeedbackDialog — FB-01 "Send feedback" (Playful 7857:12397 / Focused 8110:39078, modal 7857:13468 /
 * 8110:39739). Opened by `?dialog=feedback` (mounted by TalentShellOverlays). Starts pre-filled exactly as
 * drawn (rating "Love it", the sample comment, screenshot ticked); everything is editable.
 *
 * Props (all optional): `settings` ({ update }) or `onClose`. With neither, it closes by removing `dialog`
 * from the URL itself (useSearchParams).
 */
const RATINGS = [
  { label: FEEDBACK.ratings[0], Icon: FeedbackEmojiSadIcon },
  { label: FEEDBACK.ratings[1], Icon: FeedbackEmojiSmileIcon },
  { label: FEEDBACK.ratings[2], Icon: FeedbackEmojiBigSmileIcon },
];

const SendFeedbackDialog = ({ settings, onClose }) => {
  const uid = useId();
  const [params, setParams] = useSearchParams();
  const [rating, setRating] = useState(FEEDBACK.ratingValue);
  const [text, setText] = useState(FEEDBACK.textValue);
  const [screenshot, setScreenshot] = useState(true);
  const canSend = text.trim().length > 0;
  log('mount', { rating, screenshot });

  const close = () => {
    log('close');
    if (onClose) onClose();
    else if (settings?.update) settings.update({ dialog: null });
    else {
      const next = new URLSearchParams(params);
      next.delete('dialog');
      setParams(next, { replace: true });
    }
  };

  const send = () => {
    if (!canSend) {
      log('branch: blocked, comment empty');
      return;
    }
    log('send feedback', { rating, chars: text.length, screenshot });
    close();
  };

  return (
    <HelpModal
      onClose={close}
      labelledBy={`${uid}-title`}
      scrim="rgba(28,42,33,0.55)"
      cardClassName="max-w-[540px]"
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
        className={classNames(DIALOG_CARD, 'flex flex-col gap-[24px] p-[clamp(18px,2vw,28px)]')}
      >
        <div className="flex items-center gap-[12px]">
          <span className="flex size-[44px] shrink-0 items-center justify-center rounded-[13px] bg-[#ffd86b]">
            <FeedbackCommentIcon className="size-[21px]" />
          </span>
          <h2
            id={`${uid}-title`}
            className={classNames(
              'm-0 min-w-0 flex-1 text-[24px] leading-[1.2] tracking-[-0.24px] text-[#1c2a21]',
              HEADING
            )}
          >
            {FEEDBACK.title}
          </h2>
          <button
            type="button"
            aria-label="Close"
            onClick={close}
            className={classNames(
              'flex shrink-0 cursor-pointer items-start rounded-full bg-[#f8f8f4] p-[6px]',
              FOCUS_RING
            )}
          >
            <HelpModalCloseIcon className="size-[18px]" />
          </button>
        </div>

        <p
          id={`${uid}-q`}
          className="m-0 font-sans text-[15px] font-semibold leading-[1.2] text-[#1c2a21]"
        >
          {FEEDBACK.question}
        </p>
        <div role="radiogroup" aria-labelledby={`${uid}-q`} className="flex gap-[10px]">
          {RATINGS.map((rating_) => {
            const { label } = rating_;
            const Icon = rating_.Icon;
            const on = label === rating;
            return (
              <button
                key={label}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => setRating(label)}
                className={classNames(
                  'flex min-w-px flex-1 cursor-pointer flex-col items-center gap-[6px] rounded-[14px] border border-solid py-[14px]',
                  FOCUS_RING,
                  on
                    ? 'border-[#387440] bg-[#ebf1ec] text-[#387440] playful:border-[1.5px]'
                    : 'border-[rgba(28,42,33,0.1)] bg-white text-[#1c2a21] playful:border-[rgba(28,42,33,0.15)]'
                )}
              >
                <Icon className="size-[28px]" />
                <span
                  className={classNames(
                    'font-sans text-[13.5px] font-semibold leading-[1.2]',
                    on ? 'text-[#2a5730]' : 'text-[#1c2a21]'
                  )}
                >
                  {label}
                </span>
              </button>
            );
          })}
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          aria-label={FEEDBACK.title}
          className="h-[120px] w-full resize-none rounded-[14px] border border-solid border-[rgba(28,42,33,0.1)] bg-white p-[14px] font-sans text-[15px] leading-[1.45] text-[#1c2a21] outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green playful:border-[rgba(28,42,33,0.25)]"
        />

        <label className="flex min-h-[24px] cursor-pointer items-center gap-[10px]">
          <input
            type="checkbox"
            checked={screenshot}
            onChange={(e) => setScreenshot(e.target.checked)}
            className="peer sr-only"
          />
          <span
            aria-hidden="true"
            className={classNames(
              'flex size-[22px] shrink-0 items-center justify-center rounded-[6px] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand-green',
              screenshot ? 'bg-[#387440]' : 'border border-solid border-[#ccc] bg-white'
            )}
          >
            {screenshot && <FeedbackCheck16Icon className="size-[16px]" />}
          </span>
          <span className="font-sans text-[14px] font-medium leading-[1.2] text-[#1c2a21]">
            {FEEDBACK.screenshot}
          </span>
        </label>

        <div className="flex items-start gap-[12px]">
          <HelpButton
            size="xl"
            className="min-w-px flex-1 !h-auto !px-[18px] py-[16px]"
            onClick={close}
          >
            {FEEDBACK.cancel}
          </HelpButton>
          <HelpButton
            tone="primary"
            size="xl"
            disabled={!canSend}
            className="min-w-px flex-1"
            onClick={(e) => e.currentTarget.form?.requestSubmit()}
          >
            {FEEDBACK.send}
          </HelpButton>
        </div>
      </form>
    </HelpModal>
  );
};

export default SendFeedbackDialog;
