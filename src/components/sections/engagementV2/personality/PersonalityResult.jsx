import { useEffect, useId, useState } from 'react';
import { debug } from '../../../../utils/debug.js';
import { CompassIcon, LockIcon, MarkerPinIcon } from './personalityIcons.jsx';
import { RESULT } from './personalityData.js';
import { CARD, CHIP, DISPLAY, GUTTER, KICKER } from './personalityStyles.js';
import {
  AccentHeading,
  PIcon,
  PageFooter,
  PlayfulSticker,
  PlayfulStar,
} from './PersonalityParts.jsx';

const log = debug('PersonalityResult');

/*
 * PE-05 · Personality · Your result (Figma Focused 8285:11819 / Playful 7662:273). The page frame draws the shared stage bar;
 * this draws hero, "Your six traits", the note for recruiters (live 0 / 200 counter, mirrored in the card preview), the
 * "How recruiters see you" card and the footer. Props: onRetake (inert, no destination drawn), onSave (Save and continue).
 * Percentile labels ("72th", "41th") are kept exactly as drawn in Figma.
 */
const PersonalityResult = ({ onRetake, onSave }) => {
  const [note, setNote] = useState('');
  const noteId = useId();

  useEffect(() => {
    log('mount', { archetype: RESULT.archetype });
  }, []);

  return (
    <>
      <section
        className={`bg-[linear-gradient(90deg,#ebf1ec_0%,#fffefc_60%,#faf4e8_100%)] ${GUTTER}`}
      >
        <div className="flex flex-col items-start gap-[clamp(20px,1.85vw,32px)] py-[clamp(24px,2.5vw,40px)] sm:flex-row sm:items-center lg:min-h-[260px]">
          <div className="relative shrink-0">
            <span className="flex size-[clamp(88px,7.64vw,132px)] items-center justify-center rounded-[clamp(26px,2.3vw,40px)] border border-solid border-[rgba(28,42,33,0.1)] bg-[#c8951a] text-white shadow-[0_1px_2px_rgba(28,42,33,0.04),0_2px_8px_rgba(28,42,33,0.04)] playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:shadow-[4px_4px_0_rgba(28,42,33,0.45),0_10px_24px_rgba(28,42,33,0.06)]">
              <CompassIcon className="size-[clamp(40px,3.5vw,60px)]" />
            </span>
            <PlayfulSticker rotate={-6} className="left-[-9px] top-[118px]">
              BADGE UNLOCKED
            </PlayfulSticker>
          </div>
          <div className="relative flex max-w-[640px] flex-col gap-[10px]">
            <p className={`${KICKER} m-0 text-[#785910]`}>{RESULT.kicker}</p>
            <AccentHeading
              lead={RESULT.titleLead}
              accent={RESULT.titleAccent}
              className={`${DISPLAY} text-[clamp(28px,2.72vw,47px)] leading-[1.1] text-[#1c2a21]`}
            />
            <p className="m-0 font-sans text-[16px] leading-[24px] text-[#595959]">{RESULT.body}</p>
            <div className="flex flex-wrap gap-[8px]">
              {RESULT.topChips.map((c) => (
                <span key={c} className={CHIP}>
                  {c}
                </span>
              ))}
            </div>
            <PlayfulStar size={20} className="left-[404px] top-[21px]" />
            <PlayfulStar size={9} green className="left-[428px] top-[51px]" />
          </div>
        </div>
      </section>

      <div
        className={`grid flex-1 grid-cols-1 content-start gap-[clamp(24px,3.7vw,64px)] pb-[40px] pt-[clamp(24px,2.3vw,40px)] lg:grid-cols-[1072fr_464fr] ${GUTTER}`}
      >
        <div className="flex min-w-0 flex-col gap-[26px]">
          <section className={`${CARD} flex flex-col gap-[24px] p-[clamp(18px,1.62vw,28px)]`}>
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h2 className="m-0 font-sans text-[22px] leading-[26px] font-semibold text-[#1c2a21]">
                Your six traits
              </h2>
              <p className="m-0 font-sans text-[13px] leading-[16px] text-[#595959] max-lg:text-[12px]">
                Percentile vs GTH talents who took the quiz
              </p>
            </div>
            {RESULT.traits.map((t) => (
              <div key={t.id} className="flex gap-[16px]">
                <span className="mt-[8px] flex size-[40px] shrink-0 items-center justify-center rounded-[12px] bg-[#ebf1ec] text-[#387440]">
                  <PIcon name={t.icon} className="size-[20px]" />
                </span>
                <div className="flex min-w-0 flex-1 flex-col gap-[6px]">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-sans text-[15px] leading-[18px] font-semibold text-[#1c2a21]">
                      {t.title}
                    </span>
                    <span
                      className={`font-sans text-[13px] leading-[16px] font-semibold max-lg:text-[12px] ${t.strong ? 'text-[#387440]' : 'text-[#595959]'}`}
                    >
                      {t.percentile}
                    </span>
                  </div>
                  <div className="h-[10px] rounded-[5px] bg-[#eeeeea]">
                    <div
                      className="h-full rounded-[5px] bg-[#387440]"
                      style={{ width: `${t.fill * 100}%` }}
                    />
                  </div>
                  <p className="m-0 font-sans text-[13px] leading-[16px] text-[#595959] max-lg:text-[12px]">
                    {t.body}
                  </p>
                </div>
              </div>
            ))}
          </section>

          <section className={`${CARD} flex flex-col gap-[14px] p-[clamp(18px,1.62vw,28px)]`}>
            <div className="flex flex-col gap-[8px]">
              <div className="flex items-baseline justify-between gap-2">
                <label
                  htmlFor={noteId}
                  className="font-sans text-[14px] leading-[24px] font-medium tracking-[0.2px] text-[#1c2a21]"
                >
                  Add a note for recruiters
                </label>
                <span className="font-sans text-[12px] leading-[18px] tracking-[0.2px] text-[#595959]">
                  Optional
                </span>
              </div>
              <textarea
                id={noteId}
                value={note}
                maxLength={RESULT.noteMax}
                placeholder={RESULT.notePlaceholder}
                onChange={(e) => {
                  log('note change', e.target.value.length);
                  setNote(e.target.value);
                }}
                className="h-[112px] w-full resize-none rounded-[10px] border border-solid border-[#cccccc] bg-white p-[14px_16px_13px_20px] font-sans text-[14px] leading-[20px] tracking-[0.2px] text-[#1c2a21] shadow-[0_1px_2px_rgba(28,42,33,0.04),0_2px_8px_rgba(28,42,33,0.04)] placeholder:text-[#595959] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
              />
            </div>
            <p className="m-0 font-sans text-[12px] leading-[14px] font-medium text-[#595959]">
              Shown next to your archetype on your card · {note.length} / {RESULT.noteMax}
            </p>
          </section>
        </div>

        <aside className={`${CARD} flex h-fit flex-col gap-[16px] p-[24px]`}>
          <p className={`${KICKER} m-0 text-[#595959]`}>HOW RECRUITERS SEE YOU</p>
          <div className="flex flex-col gap-[12px] rounded-[18px] border border-solid border-[#e7e7e7] bg-[#f7f8f4] p-[18px]">
            <div className="flex items-center gap-[12px]">
              <img
                src={RESULT.avatar}
                alt=""
                className="size-[52px] shrink-0 rounded-full object-cover"
              />
              <div className="flex flex-col gap-[3px]">
                <p className="m-0 font-sans text-[17px] leading-[20px] font-semibold text-[#1c2a21]">
                  {RESULT.cardName}
                </p>
                <p className="m-0 flex items-center gap-[4px] font-sans text-[12px] leading-[14px] font-medium text-[#595959]">
                  <MarkerPinIcon className="size-[13px]" />
                  {RESULT.cardPlace}
                </p>
              </div>
            </div>
            <span className="inline-flex w-fit items-center gap-[6px] rounded-full border border-solid border-[#eedeb8] bg-[#faf4e8] py-[6px] pr-[12px] pl-[8px] font-sans text-[13px] leading-[16px] font-semibold text-[#785910]">
              <CompassIcon className="size-[15px]" />
              {RESULT.archetype}
            </span>
            <div className="flex flex-wrap gap-[6px]">
              {RESULT.cardChips.map((c) => (
                <span
                  key={c}
                  className="inline-flex items-center rounded-full border border-solid border-[rgba(28,42,33,0.1)] bg-[#ebf1ec] px-[10px] py-[4px] font-sans text-[12px] leading-[14px] font-semibold text-[#387440] playful:border-[rgba(28,42,33,0.35)]"
                >
                  {c}
                </span>
              ))}
            </div>
            <p className="m-0 font-sans text-[13px] leading-[19px] break-words text-[#595959] max-lg:text-[12px]">
              {note.trim() ? `“${note.trim()}”` : RESULT.cardNoteEmpty}
            </p>
          </div>
          <p className="m-0 flex gap-[8px] font-sans text-[13px] leading-[19px] text-[#595959] max-lg:text-[12px]">
            <LockIcon className="mt-[2px] size-[15px] shrink-0 text-[#387440]" />
            Your individual answers are never shown. You can hide your archetype in Privacy
            settings.
          </p>
        </aside>
      </div>

      <PageFooter
        note="Result saved to your card. Finishing this stage makes you Discoverable."
        secondary={{
          label: 'Retake quiz',
          onClick: () => {
            log('retake quiz (no destination drawn)');
            onRetake?.();
          },
        }}
        primary={{ label: 'Save and continue', onClick: onSave }}
      />
    </>
  );
};

export default PersonalityResult;
