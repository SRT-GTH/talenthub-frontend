import { useEffect, useState } from 'react';
import Modal from '../../ui/Modal.jsx';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import CommunityIcon from './CommunityIcon.jsx';
import { icons } from './communityIcons.js';
import { REPORT_POST_COPY } from './communityData.js';

const log = debug('ReportPostModal');

/*
 * ReportPostModal — Figma frame 7025:89962, modal card 7025:90562.
 *
 * Same card shell as Create Post (white, r24, px32 py28, 40/100 shadow +
 * 4px hard shadow, #ebf1ec close puck).
 *
 * Reason rows are a radio group. Figma ships two distinct 18px SVGs —
 * `radio-checked` (green ring + dot) and `radio-unchecked` (grey ring) — plus
 * a matching label treatment: selected is SF Pro Rounded Medium #111,
 * unselected is Regular #595959. Both states reproduced, neither invented.
 * Figma's default selection is the first reason, "Inappropriate".
 */

const SUBMIT_LABEL_GRADIENT = 'linear-gradient(188.38deg, #fef1e7 0%, #e8f2ed 20.192%)';

const ReportPostModal = ({ isOpen, onClose, post, onSubmit }) => {
  const [reason, setReason] = useState(REPORT_POST_COPY.reasons[0]);

  useEffect(() => {
    if (!isOpen) return;
    log('mount', { post: post?.id ?? null, defaultReason: REPORT_POST_COPY.reasons[0] });
    setReason(REPORT_POST_COPY.reasons[0]);
  }, [isOpen, post]);

  const handleSubmit = () => {
    log('report submitted:', { post: post?.id ?? null, reason });
    onSubmit?.({ postId: post?.id ?? null, reason });
    onClose?.();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      showClose={false}
      ariaLabel={REPORT_POST_COPY.title}
      contentClassName="!max-w-[560px] !rounded-[24px] !shadow-[0px_40px_100px_0px_rgba(0,0,0,0.25),0px_4px_0px_0px_rgba(0,0,0,0.13)]"
    >
      <div className="relative flex flex-col items-start gap-[17px] px-[32px] py-[28px]">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-[14px] top-[11px] inline-flex size-[28px] items-center justify-center rounded-[20px] bg-brand-green-light transition-colors hover:bg-brand-green-light-active focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
        >
          <CommunityIcon src={icons.modalClose} size={16} />
        </button>

        <div className="flex flex-col items-start gap-[4px]">
          <h2 className="font-display text-[32px] text-black">{REPORT_POST_COPY.title}</h2>
          <p className="font-sans text-[14px] text-[#595959]">{REPORT_POST_COPY.subtitle}</p>
        </div>

        <div className="flex w-full flex-col items-start gap-[14px]">
          <div
            role="radiogroup"
            aria-label={REPORT_POST_COPY.title}
            className="flex flex-col items-start"
          >
            {REPORT_POST_COPY.reasons.map((item) => {
              const selected = item === reason;
              return (
                <button
                  key={item}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => {
                    log('report reason selected:', item);
                    setReason(item);
                  }}
                  className="flex items-center gap-[12px] overflow-hidden rounded bg-white py-[6px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
                >
                  <CommunityIcon
                    src={selected ? icons.radioChecked : icons.radioUnchecked}
                    size={18}
                  />
                  <span
                    className={classNames(
                      'whitespace-nowrap font-sans text-[14px]',
                      selected ? 'font-medium text-black' : 'text-[#595959]'
                    )}
                  >
                    {item}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex w-full flex-col items-end bg-white">
            <div className="flex items-start gap-[12px] bg-white">
              <button
                type="button"
                onClick={onClose}
                className="flex items-center justify-center rounded-[14px] border-b-2 border-l-2 border-r-2 border-t border-[rgba(17,17,17,0.3)] bg-white px-[18px] py-[10px] drop-shadow-[0px_4px_0px_rgba(17,17,17,0.25)] transition-transform active:translate-y-[2px] active:drop-shadow-[0px_2px_0px_rgba(17,17,17,0.25)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
              >
                <span className="whitespace-nowrap font-sans text-[14px] font-semibold leading-6 tracking-[0.1px] text-black">
                  {REPORT_POST_COPY.cancelLabel}
                </span>
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="flex items-center justify-center gap-[8px] rounded-[10px] border-b-2 border-l-2 border-r-2 border-t border-brand-green-dark bg-brand-green px-[18px] py-[10px] drop-shadow-[0px_4px_0px_#224626] transition-transform active:translate-y-[2px] active:drop-shadow-[0px_2px_0px_#224626] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
              >
                <span
                  className="whitespace-nowrap bg-clip-text font-sans text-[14px] font-bold leading-6 tracking-[0.1px] text-transparent"
                  style={{ backgroundImage: SUBMIT_LABEL_GRADIENT }}
                >
                  {REPORT_POST_COPY.submitLabel}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ReportPostModal;
