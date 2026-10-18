import { useEffect, useRef } from 'react';
import { debug } from '../../../utils/debug.js';
import { classNames } from '../../../utils/classNames.js';
import Button from '../../ui/Button.jsx';
import { CheckIcon, CourseChevronUpIcon, CourseZapIcon } from '../../shared/assets.jsx';
import LearningHub from './LearningHub.jsx';
import LearningInProgress from './LearningInProgress.jsx';
import { CARD_INK, CertCard, CourseSticker, DualText, HEAD } from './CourseUi.jsx';
import { CERTIFICATES, COMPLETE } from './talentLearningCourseData.js';

const log = debug('CourseComplete');

const CHANGE_ICONS = {
  check: <CheckIcon className="size-[18px] text-[#387440]" />,
  up: <CourseChevronUpIcon className="size-[18px] text-[#1c2a21]" />,
  zap: <CourseZapIcon className="size-[18px] text-[#967014]" />,
};

const SQL_CERT = CERTIFICATES.items[0];

/*
 * CourseComplete — ML-04 "Course complete 🎉 (SQL verified)" (`?view=complete`).
 * Focused 8110:12020 / Playful 7525:382: the My Learning hub dimmed behind a 45% ink scrim with the
 * celebration modal on top. The hub behind is the Hub agent's (LearningHub + LearningInProgress).
 */
const CourseComplete = ({ learning }) => {
  const dialogRef = useRef(null);

  const close = () => {
    log('close -> My Learning');
    learning.update({ view: null });
  };

  useEffect(() => {
    log('mount', { changes: COMPLETE.changes.length });
    dialogRef.current?.focus?.();
    const onKey = (e) => {
      if (e.key === 'Escape') learning.update({ view: null });
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div aria-hidden="true" inert>
        <LearningHub learning={learning}>
          <LearningInProgress learning={learning} />
        </LearningHub>
      </div>

      <div className="fixed inset-0 z-[90] flex items-start justify-center overflow-y-auto bg-[rgba(28,42,33,0.45)] px-[12px] py-[clamp(12px,16.1vh,172px)] lg:pl-[calc(9.26vw+12px)]">
        <div
          ref={dialogRef}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-labelledby="course-complete-title"
          className={classNames(
            'relative flex w-full max-w-[620px] flex-col rounded-[28px] bg-[#fffefc] outline-none',
            CARD_INK
          )}
        >
          <div className="relative flex flex-col items-center gap-[14px] overflow-hidden rounded-t-[27px] bg-[#387440] px-[clamp(14px,1.74vw,30px)] pt-[26px] pb-[30px] text-center">
            {COMPLETE.confetti.map((c, i) => (
              <span
                key={i}
                aria-hidden="true"
                className="absolute hidden h-[7px] w-[16px] rounded-[2px] border border-[rgba(28,42,33,0.12)] sm:block"
                style={{
                  left: `${(c.x / 620) * 100}%`,
                  top: c.y,
                  background: c.c,
                  transform: `translate(-50%, -50%) rotate(${c.r}deg)`,
                }}
              />
            ))}
            <CourseSticker rotate="playful:rotate-[5deg]" textClass="text-[12.5px]">
              {COMPLETE.sticker}
            </CourseSticker>
            <h1
              id="course-complete-title"
              className={classNames(
                HEAD,
                'text-[clamp(26px,1.97vw,34px)] leading-[1.2] text-white'
              )}
            >
              {COMPLETE.title}
            </h1>
            <p className="text-[14px] leading-[16.7px] font-medium text-[#e1eae2]">
              {COMPLETE.sub}
            </p>
            <CertCard
              course={SQL_CERT.course}
              date={SQL_CERT.date}
              link={SQL_CERT.link}
              tilt="playful:rotate-[2deg]"
              className="mt-[4px] w-full max-w-[420px] text-left"
            />
          </div>

          <ul className="flex flex-col gap-[8px] px-[clamp(14px,1.39vw,24px)] py-[8px]">
            {COMPLETE.changes.map((c, i) => (
              <li
                key={c.id}
                className={classNames(
                  'flex items-center gap-[12px] py-[14px]',
                  i > 0 && 'border-t border-[#e1eae2]'
                )}
              >
                <span
                  className={classNames(
                    'flex size-[38px] shrink-0 items-center justify-center rounded-[12px] border border-[rgba(28,42,33,0.12)] playful:border-[1.2px] playful:border-[#1c2a21]',
                    c.tint
                  )}
                >
                  {CHANGE_ICONS[c.icon]}
                </span>
                <span className="flex min-w-0 flex-col gap-[2px]">
                  <span className="text-[15px] leading-[17.9px] font-semibold text-[#1c2a21]">
                    {typeof c.title === 'string' ? (
                      c.title
                    ) : (
                      <DualText focused={c.title.focused} playful={c.title.playful} />
                    )}
                  </span>
                  <span className="text-[12.5px] leading-[14.9px] text-[#737373]">{c.sub}</span>
                </span>
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-[10px] px-[clamp(14px,1.39vw,24px)] pt-[8px] pb-[24px]">
            <Button variant="tertiary" size="lg" onClick={close} className="min-w-0 flex-1">
              {COMPLETE.back}
            </Button>
            <Button
              variant="primary"
              size="lg"
              onClick={() => {
                // Figma prototype link: ML-04 'Button · Share certificate' -> ML-05 Certificates.
                log('share certificate -> Certificates');
                learning.update({ view: 'certificates' });
              }}
              className="min-w-0 flex-1"
            >
              {COMPLETE.share}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseComplete;
