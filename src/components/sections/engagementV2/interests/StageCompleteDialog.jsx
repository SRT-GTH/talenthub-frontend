import Button from '../../../ui/Button.jsx';
import InterestsDialogShell from './InterestsDialogShell.jsx';
import { COMPLETE_DONE_COUNT, STAGE_DONE_XP, completeSummary } from './interestsData.js';
import { HEADING_FONT, SHELF_ONLY } from './interestsStyles.js';
import * as Icons from './interestsIcons.jsx';

/* Confetti: [x, y (centre in the 560x173 art), rotation deg, colour, opacity] (Figma IN-05 7706:185526, 6x10 chips). */
const CONFETTI = [
  [429, 33, 46, '#c0392b', 0.9],
  [409, 22, -68, '#c0392b', 0.9],
  [119, 53, -51, '#ffd86b', 0.9],
  [57, 87, 48, '#ffd86b', 0.9],
  [104, 96, 2, '#387440', 1],
  [52, 141, -85, '#c8951a', 0.9],
  [128, 150, 56, '#387440', 1],
  [425, 111, 39, '#c0392b', 0.9],
  [530, 79, 48, '#c8951a', 0.9],
  [78, 35, -49, '#ffd86b', 0.9],
  [88, 21, -77, '#c0392b', 0.9],
  [477, 83, 48, '#c8951a', 0.9],
  [114, 121, -28, '#ffd86b', 0.9],
  [132, 78, 74, '#387440', 1],
  [119, 111, -26, '#387440', 1],
  [71, 78, 1, '#3062d4', 0.9],
  [457, 80, 11, '#c0392b', 0.9],
  [139, 120, 66, '#c8951a', 0.9],
  [424, 130, -84, '#c8951a', 0.9],
  [472, 120, -25, '#3062d4', 0.9],
];

const Stat = ({ value, label, tone }) => (
  <div
    className={`flex min-w-0 flex-1 flex-col items-center gap-[2px] rounded-[16px] border border-solid border-[rgba(28,42,33,0.1)] px-2 py-3 playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] ${SHELF_ONLY} ${tone.bg}`}
  >
    <span className={`text-[23px] font-semibold leading-[29px] ${HEADING_FONT} ${tone.fg}`}>
      {value}
    </span>
    <span className="font-sans text-[10px] font-semibold uppercase leading-[12px] tracking-[1px] text-[#595959] max-lg:text-[12px]">
      {label}
    </span>
  </div>
);

/*
 * StageCompleteDialog (IN-05, Figma "Modal · Stage complete" 7706:185525): art (confetti, heart medallion, Playful "STAGE 2
 * DONE" sticker, star), heading, summary, three stats, "What you just unlocked", Stay here / Next: Personality.
 * Props: areas [{id,specifics}], specificsCount, uiStyle, onClose (Stay here / close / Esc), onNext.
 */
const StageCompleteDialog = ({ areas, specificsCount, uiStyle, onClose, onNext }) => {
  const xpLabel = uiStyle === 'playful' ? 'XP' : 'pts';
  return (
    <InterestsDialogShell
      open
      onClose={onClose}
      labelledBy="in-done-title"
      widthClass="max-w-[560px]"
      cardClassName="pb-7"
      closeSize={36}
      closeClassName="top-[19px] right-5"
    >
      <div className="relative h-[173px] bg-[radial-gradient(ellipse_at_center,#e1eae2_0%,#fff_100%)]">
        {CONFETTI.map(([x, y, r, c, o], i) => (
          <span
            key={i}
            aria-hidden="true"
            className="absolute hidden h-[10px] w-[6px] rounded-[2px] min-[560px]:block"
            style={{
              left: `calc(50% + ${x - 280}px)`,
              top: y - 5,
              transform: `translateX(-3px) rotate(${r}deg)`,
              background: c,
              opacity: o,
            }}
          />
        ))}
        <span
          className={`absolute top-[39px] left-1/2 grid size-[100px] -translate-x-1/2 place-items-center rounded-full border border-solid border-[rgba(28,42,33,0.1)] bg-[#387440] text-[44px] text-white playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] ${SHELF_ONLY}`}
        >
          <Icons.HeartIcon />
        </span>
        <span className="absolute top-[17px] left-[calc(50%+20px)] hidden -rotate-[8deg] rounded-[8px] border-[1.2px] border-solid border-[#1c2a21] bg-[#ffd86b] px-[11px] py-[5px] font-sans text-[12px] font-bold leading-[14px] tracking-[0.4px] text-[#1c2a21] shadow-[2px_2px_0_rgba(28,42,33,.45)] playful:inline-block">
          STAGE 2 DONE
        </span>
        <Icons.DoodleStarIcon className="absolute top-[49px] left-[calc(50%-100px)] hidden text-[18px] text-[#ffd86b] playful:block" />
      </div>
      <div className="flex flex-col gap-[18px] px-[clamp(20px,5.7vw,32px)] py-[3px] sm:px-8">
        <div className="flex flex-col items-center gap-2 text-center">
          <p className="m-0 font-sans text-[11px] font-bold uppercase leading-[13px] tracking-[1.2px] text-[#387440] max-lg:text-[12px]">
            Stage 2 of 9 complete
          </p>
          <h2
            id="in-done-title"
            className={`m-0 text-[clamp(26px,2.03vw,35px)] font-semibold leading-[1.19] text-[#111] ${HEADING_FONT}`}
          >
            <span className="text-[#1c2a21]">Interests </span>
            <span className="text-[#387440]">locked in.</span>
          </h2>
          <p className="m-0 font-sans text-[15px] leading-[22px] text-[#595959]">
            {completeSummary(areas, specificsCount)}
          </p>
        </div>
        <div className="flex gap-[10px]">
          <Stat
            value={`${COMPLETE_DONE_COUNT}/9`}
            label="Stages done"
            tone={{ bg: 'bg-[#f7f8f4]', fg: 'text-[#1c2a21]' }}
          />
          <Stat value="22%" label="Profile" tone={{ bg: 'bg-[#e8f2ed]', fg: 'text-[#165d3a]' }} />
          <Stat
            value={`+${STAGE_DONE_XP} ${xpLabel}`}
            label="Earned"
            tone={{ bg: 'bg-[#faf4e8]', fg: 'text-[#785910]' }}
          />
        </div>
        <div className="flex flex-col gap-1 playful:gap-4">
          <p className="m-0 font-sans text-[11px] font-bold uppercase leading-[13px] tracking-[1.2px] text-[#595959] max-lg:text-[12px]">
            What you just unlocked
          </p>
          {[
            {
              icon: 'Target',
              t: '142 role matches',
              b: 'Roles that fit your interests are waiting in Opportunities.',
            },
            {
              icon: 'Users',
              t: 'Mentor matching',
              b: 'We’ll suggest people who work in your niches.',
            },
          ].map((u) => {
            const Glyph = Icons[`${u.icon}Icon`];
            return (
              <div key={u.t} className="flex items-center gap-[14px] py-[10px]">
                <span className="grid size-[38px] shrink-0 place-items-center rounded-[12px] bg-[#ebf1ec] text-[19px] text-[#387440]">
                  <Glyph />
                </span>
                <span className="flex min-w-0 flex-col gap-[2px]">
                  <span className="font-sans text-[15px] font-semibold leading-[18px] text-[#1c2a21]">
                    {u.t}
                  </span>
                  <span className="font-sans text-[13px] leading-[18px] text-[#595959] max-lg:text-[12px]">
                    {u.b}
                  </span>
                </span>
              </div>
            );
          })}
        </div>
        <div className="flex flex-wrap gap-3">
          <Button
            variant="tertiary-subtle"
            size="lg"
            className="min-w-[140px] flex-1"
            onClick={onClose}
          >
            Stay here
          </Button>
          <Button
            size="lg"
            className="min-w-[160px] flex-1"
            rightIcon={<Icons.ArrowRightIcon />}
            onClick={onNext}
          >
            Next: Personality
          </Button>
        </div>
      </div>
    </InterestsDialogShell>
  );
};

export default StageCompleteDialog;
