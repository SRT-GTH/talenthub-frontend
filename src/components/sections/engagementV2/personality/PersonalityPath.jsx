import { useEffect } from 'react';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import { PATHS, PATH_CHAT_BUBBLES, PATH_IMAGES, PATH_QUIZ_OPTIONS } from './personalityData.js';
import { CHIP, DISPLAY, GUTTER } from './personalityStyles.js';
import { PIcon, PageFooter, PlayfulSticker, PlayfulStar, StageTrail } from './PersonalityParts.jsx';

const log = debug('PersonalityPath');

const IMG_EDGE =
  'absolute border border-solid border-[rgba(28,42,33,0.1)] object-cover shadow-[0_1px_2px_rgba(28,42,33,0.04),0_2px_8px_rgba(28,42,33,0.04)] playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:shadow-[4px_4px_0_rgba(28,42,33,0.45),0_10px_24px_rgba(28,42,33,0.06)]';

const GamesVisual = () => (
  <div className="relative h-[220px] bg-[#fffefc]" aria-hidden="true">
    <img
      src={PATH_IMAGES.makola}
      alt=""
      className={`${IMG_EDGE} left-[24px] top-[28px] h-[170px] w-[260px] rounded-[18px] max-sm:w-[52%]`}
    />
    <img
      src={PATH_IMAGES.escape}
      alt=""
      className={`${IMG_EDGE} left-[250px] top-[40px] h-[150px] w-[220px] rounded-[18px] max-sm:left-[38%] max-sm:w-[44%]`}
    />
    <img
      src={PATH_IMAGES.groupChat}
      alt=""
      className={`${IMG_EDGE} left-[170px] top-[110px] h-[120px] w-[170px] rounded-[16px] max-sm:left-[26%] max-sm:w-[34%]`}
    />
    <PlayfulStar size={30} className="left-[440px] top-[21px] rotate-[10deg]" />
    <PlayfulStar size={18} green className="left-[467px] top-[71px] rotate-[-8deg]" />
  </div>
);

const QuizVisual = () => (
  <div
    className="flex h-[220px] flex-col justify-center gap-[10px] bg-[#f8f8f4] p-[20px]"
    aria-hidden="true"
  >
    {PATH_QUIZ_OPTIONS.map((o) => (
      <div
        key={o.letter}
        className={classNames(
          'flex items-center gap-[12px] rounded-[14px] border border-solid bg-white p-[12px_14px]',
          o.selected
            ? 'border-[#387440] playful:border-[1.5px]'
            : 'border-[rgba(28,42,33,0.1)] playful:border-[rgba(28,42,33,0.15)]'
        )}
      >
        <span
          className={classNames(
            'flex h-[26px] min-w-[29px] items-center justify-center rounded-[8px] border border-solid px-[9px] font-sans text-[13px] leading-[16px] font-bold',
            o.selected
              ? 'border-[rgba(28,42,33,0.1)] bg-[#387440] text-white playful:border-[rgba(28,42,33,0.35)]'
              : 'border-[rgba(28,42,33,0.12)] bg-white text-[#1c2a21]'
          )}
        >
          {o.letter}
        </span>
        <span className="font-sans text-[14px] leading-[17px] font-medium text-[#1c2a21] max-lg:text-[12px]">
          {o.text}
        </span>
      </div>
    ))}
  </div>
);

const BUBBLE =
  'border border-solid border-[rgba(28,42,33,0.1)] p-[10px_14px] font-sans text-[14px] leading-[17px] max-lg:text-[12px] playful:border-[rgba(28,42,33,1)] playful:border-[1.2px]';

const ChatVisual = () => (
  <div
    className="flex h-[220px] flex-col justify-center gap-[10px] bg-[#ebf1ec] p-[20px]"
    aria-hidden="true"
  >
    <p
      className={`${BUBBLE} m-0 w-fit max-w-[301px] rounded-[4px_16px_16px_16px] bg-white font-normal text-[#1c2a21]`}
    >
      {PATH_CHAT_BUBBLES.buddy}
    </p>
    <div className="flex justify-end">
      <p
        className={`${BUBBLE} m-0 w-fit max-w-[212px] rounded-[16px_4px_16px_16px] bg-[#387440] font-medium text-white`}
      >
        {PATH_CHAT_BUBBLES.user}
      </p>
    </div>
    <p
      className={`${BUBBLE} m-0 w-fit max-w-[212px] rounded-[4px_16px_16px_16px] bg-white font-normal text-[#1c2a21]`}
    >
      {PATH_CHAT_BUBBLES.reply}
    </p>
  </div>
);

const VISUALS = { games: GamesVisual, quiz: QuizVisual, chat: ChatVisual };

/*
 * PA-00 · Personality · Choose your path (Figma Focused 8285:12125 / Playful 7945:31864): stage trail, heading, three radio
 * cards (Play mini-games / Quick quiz / Chat with Buddy) and the footer ("Let's play").
 * Props: path ('games'|'quiz'|'chat' = selected card), onSelect(id), onStart, onSkip. Playful adds the "MOST FUN" sticker on the
 * first card and two doodle stars; unselected cards use the lighter ink@.35 edge.
 */
const PersonalityPath = ({ path = 'games', onSelect, onStart, onSkip }) => {
  useEffect(() => {
    log('mount', { path });
  }, [path]);

  return (
    <>
      <StageTrail />
      <div
        className={`flex flex-1 flex-col gap-[28px] pb-[40px] pt-[clamp(28px,2.6vw,40px)] ${GUTTER}`}
      >
        <div className="flex flex-col gap-[12px]">
          <p className="m-0 font-sans text-[11.5px] leading-[14px] font-bold tracking-[0.69px] text-[#387440] max-lg:text-[12px]">
            PERSONALITY · STEP 3 OF 9
          </p>
          <h1
            className={`${DISPLAY} m-0 text-[clamp(30px,2.78vw,48px)] leading-[1.1] font-semibold tracking-[-0.02em] text-[#1c2a21]`}
          >
            How do you want to find <span className="text-[#387440]">your style?</span>
          </h1>
          <p className="m-0 max-w-[760px] font-sans text-[18px] leading-[27px] text-[#595959] max-lg:text-[16px]">
            Pick the way that feels most like you. Every path ends with your archetype and six trait
            scores.
          </p>
        </div>
        <div
          role="radiogroup"
          aria-label="How do you want to find your style?"
          className="grid grid-cols-1 gap-[24px] md:grid-cols-3"
        >
          {PATHS.map((p) => {
            const on = path === p.id;
            const Visual = VISUALS[p.id];
            return (
              <div
                key={p.id}
                role="radio"
                tabIndex={0}
                aria-checked={on}
                onClick={() => {
                  log('select path', p.id);
                  onSelect?.(p.id);
                }}
                onKeyDown={(e) => {
                  if (e.key === ' ' || e.key === 'Enter') {
                    e.preventDefault();
                    onSelect?.(p.id);
                  }
                }}
                className={classNames(
                  'relative flex min-w-0 cursor-pointer flex-col overflow-hidden rounded-[24px] border border-solid border-[rgba(28,42,33,0.1)] bg-white p-0 text-left shadow-[0_1px_2px_rgba(28,42,33,0.04),0_2px_8px_rgba(28,42,33,0.04)] playful:border-[1.5px] playful:shadow-[4px_4px_0_rgba(28,42,33,0.45),0_10px_24px_rgba(28,42,33,0.06)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green',
                  on
                    ? 'playful:border-[rgba(28,42,33,0.55)]'
                    : 'playful:border-[rgba(28,42,33,0.35)]'
                )}
              >
                <Visual />
                <div className="flex flex-col gap-[10px] p-[24px]">
                  <span className="flex items-center gap-[10px]">
                    <span
                      className={classNames(
                        'flex size-[40px] shrink-0 items-center justify-center rounded-[12px]',
                        on ? 'bg-[#387440] text-white' : 'bg-[#ebf1ec] text-[#387440]'
                      )}
                    >
                      <PIcon name={p.icon} className="size-[19px]" />
                    </span>
                    <span
                      className={`${DISPLAY} flex-1 font-sans text-[24px] leading-[29px] font-semibold tracking-[-0.24px] text-[#1c2a21] max-lg:text-[20px]`}
                    >
                      {p.title}
                    </span>
                    <span
                      aria-hidden="true"
                      className={classNames(
                        'flex size-[24px] shrink-0 items-center justify-center rounded-full border border-solid bg-white',
                        on
                          ? 'border-[#387440]'
                          : 'border-[rgba(28,42,33,0.1)] playful:border-[1.5px] playful:border-[rgba(28,42,33,0.35)]'
                      )}
                    >
                      {on ? <span className="size-[11px] rounded-full bg-[#387440]" /> : null}
                    </span>
                  </span>
                  <span className="font-sans text-[15px] leading-[22px] text-[#595959] max-lg:text-[14px]">
                    {p.body}
                  </span>
                  <span className="flex flex-wrap gap-[8px]">
                    {p.meta.map((m) => (
                      <span key={m} className={CHIP}>
                        {m}
                      </span>
                    ))}
                  </span>
                </div>
                {p.id === 'games' ? (
                  <PlayfulSticker rotate={5} pill className="left-[408px] top-[11px]">
                    MOST FUN
                  </PlayfulSticker>
                ) : null}
              </div>
            );
          })}
        </div>
        <div className="flex items-start gap-[12px] rounded-[16px] bg-[#faf4e8] p-[16px_20px]">
          <PIcon name="InfoCircle" className="mt-[1px] size-[20px] shrink-0 text-[#463409]" />
          <p className="m-0 font-sans text-[15px] leading-[18px] font-medium text-[#463409] max-lg:text-[14px]">
            You can mix paths. Play one game now, finish the rest in the quiz later. Your progress
            is kept either way.
          </p>
        </div>
      </div>
      <PageFooter
        buttonSize="lg"
        note="Same archetype and trait scores whichever path you pick."
        skip={{ label: 'Skip for now', onClick: onSkip }}
        primary={{ label: "Let's play", onClick: onStart }}
      />
    </>
  );
};

export default PersonalityPath;
