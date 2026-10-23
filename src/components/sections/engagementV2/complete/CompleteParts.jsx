import Button from '../../../ui/Button.jsx';
import avatarImg from '../../../../assets/engagement/avatar-hero-stage.webp';
import { BIO, BIO_STEPS, NEXT_CARDS, PROFILE, STATS, TONES } from './completeData.js';
import { CARD, EYEBROW, FOCUS_RING, HEADING_FONT, LINE_SHADOW } from '../goals/goalsStyles.js';
import { IconTile, Sticker } from '../goals/GoalsParts.jsx';
import * as Icons from '../goals/goalsIcons.jsx';

const BAR_WIDTHS = ['97%', '91%', '99%', '63%'];

const Chip = ({ children, tone = 'plain', pressed, onClick, className = '' }) => {
  const look =
    tone === 'dark'
      ? 'border-[rgba(28,42,33,0.12)] bg-[#1c2a21] text-white playful:border-[#1c2a21]'
      : tone === 'green'
        ? 'border-[#c1d4c4] bg-[#ebf1ec] text-[#387440]'
        : 'border-[#e1eae2] bg-white text-[#595959]';
  const cls = `inline-flex h-8 items-center rounded-full border border-solid px-[14px] font-sans text-[13px] font-semibold leading-[16px] max-lg:text-[12px] ${look} ${className}`;
  return onClick ? (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={`${cls} min-h-[24px] cursor-pointer ${FOCUS_RING}`}
    >
      {children}
    </button>
  ) : (
    <span className={cls}>{children}</span>
  );
};

/* Four stat tiles (9/9, 100%, 14, +1,240 pts|XP). */
export const StatsRow = ({ xpWord }) => (
  <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
    {STATS.map((s) => (
      <div
        key={s.label}
        className={`flex flex-col items-center gap-[2px] rounded-[18px] px-2 py-4 ${s.bg} ${LINE_SHADOW}`}
      >
        <span
          className={`text-[clamp(22px,1.56vw,27px)] font-semibold leading-[1.185] ${HEADING_FONT} ${s.fg}`}
        >
          {typeof s.value === 'number' ? `+${s.value.toLocaleString('en-US')} ${xpWord}` : s.value}
        </span>
        <span className="font-sans text-[10px] font-semibold leading-[12px] tracking-[1px] text-[#595959] max-lg:text-[12px]">
          {s.label}
        </span>
      </div>
    ))}
  </div>
);

/*
 * BioCard (CO-01 writing / CO-02 ready): Career Buddy's drafted bio. Props: writing (bool), tone, onTone, onRegenerate, onEdit,
 * bio ({ text, words }, default the demo BIO; words 0 hides the word-count chip), sticker (Playful: COOKING while writing,
 * FRESH when ready).
 */
export const BioCard = ({ writing, tone, onTone, onRegenerate, onEdit, bio = BIO }) => (
  <section className={`relative flex flex-col gap-4 px-6 py-[22px] ${CARD}`}>
    <Sticker
      className={`absolute right-[47px] rotate-[-6deg] ${writing ? '-top-[20px]' : '-top-[9px]'}`}
    >
      {writing ? 'COOKING' : 'FRESH'}
    </Sticker>
    <div className="flex items-center gap-3">
      <span className="grid size-10 shrink-0 place-items-center rounded-[12px] bg-[#387440] text-[22px] text-[#faf4e8]">
        <Icons.AiIcon className="size-[1em]" />
      </span>
      <span className={`flex min-w-0 flex-col ${writing ? 'gap-1' : 'gap-[2px]'}`}>
        <h2 className="m-0 font-sans text-[17px] font-semibold leading-[20px] text-[#1c2a21]">
          Your bio, drafted by Career Buddy
        </h2>
        <span className="font-sans text-[13px] leading-[16px] text-[#595959] max-lg:text-[12px]">
          Reading your skills, roles, projects and pitch…
        </span>
      </span>
    </div>
    <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Tone">
      <span className={`${EYEBROW} mr-1 text-[#595959]`}>TONE</span>
      {TONES.map((t) => (
        <Chip
          key={t}
          tone={t === tone ? 'dark' : 'plain'}
          pressed={t === tone}
          onClick={() => onTone(t)}
        >
          {t}
        </Chip>
      ))}
    </div>
    {writing ? (
      <>
        <div
          role="status"
          className="flex flex-col gap-4 rounded-[16px] bg-[#f7f8f4] p-[18px]"
          data-testid="bio-skeleton"
        >
          {BAR_WIDTHS.map((w) => (
            <span
              key={w}
              aria-hidden="true"
              style={{ width: w }}
              className="h-3 rounded-[6px] bg-[linear-gradient(90deg,#ebf1ec_0%,#f3f3ef_100%)]"
            />
          ))}
        </div>
        <ol className="m-0 flex list-none flex-wrap gap-x-4 gap-y-2 p-0">
          {BIO_STEPS.map((s, i) => {
            const done = i < 2;
            return (
              <li key={s} className="flex items-center gap-[6px]">
                <span
                  aria-hidden="true"
                  className={`grid size-5 shrink-0 place-items-center rounded-full ${
                    done
                      ? 'bg-[#387440] text-[12px] text-white'
                      : 'border-2 border-solid border-[#c8951a] bg-[#faf4e8]'
                  }`}
                >
                  {done ? <Icons.CheckIcon className="size-3" /> : null}
                </span>
                <span
                  className={`font-sans text-[13px] leading-[16px] max-lg:text-[12px] ${
                    done ? 'font-medium text-[#595959]' : 'font-semibold text-[#1c2a21]'
                  }`}
                >
                  {s}
                </span>
              </li>
            );
          })}
        </ol>
      </>
    ) : (
      <>
        <div className="rounded-[16px] border border-solid border-[#e7e7e7] bg-[#f7f8f4] px-[18px] py-4">
          <p className="m-0 font-sans text-[16px] leading-[26px] text-[#1c2a21]">{bio.text}</p>
        </div>
        <div className="flex flex-wrap items-center gap-[10px]">
          {bio.words ? <Chip tone="green">{bio.words} words</Chip> : null}
          <Chip>{BIO.shownAt}</Chip>
        </div>
        <div className="flex flex-wrap gap-[10px]">
          <Button variant="tertiary-subtle" size="lg" className="py-[14px]!" onClick={onRegenerate}>
            Regenerate
          </Button>
          <Button variant="tertiary-subtle" size="lg" className="py-[14px]!" onClick={onEdit}>
            Edit bio
          </Button>
        </div>
      </>
    )}
  </section>
);

/* "What happens next" cards: the middle card keeps the grey border + lifted shadow it has in Figma. */
export const NextCards = () => (
  <div className="grid gap-3 md:grid-cols-3">
    {NEXT_CARDS.map((c, i) => (
      <div
        key={c.title}
        className={`flex flex-col gap-[10px] rounded-[24px] bg-white p-[18px] ${
          i === 1
            ? 'border border-solid border-[#e7e7e7] shadow-[0_5px_17px_rgba(18,38,20,.03)] playful:shadow-[0_8px_24px_rgba(18,38,20,.06)]'
            : LINE_SHADOW
        }`}
      >
        <IconTile
          icon={c.icon}
          tileClass="size-10 rounded-[12px] bg-[#ebf1ec]"
          iconClass="size-5 text-[#387440]"
        />
        <h3 className="m-0 font-sans text-[16px] font-semibold leading-[19px] text-[#1c2a21]">
          {c.title}
        </h3>
        <p className="m-0 font-sans text-[13px] leading-[19px] text-[#595959] max-lg:text-[12px]">
          {c.text}
        </p>
      </div>
    ))}
  </div>
);

/* Rail card "HOW RECRUITERS SEE YOU" (avatar, name, headline, badges, Playful LIVE sticker). fullName defaults to the demo name. */
export const ProfilePreview = ({ fullName = PROFILE.fullName }) => (
  <div className={`relative flex flex-col gap-3 p-5 ${CARD}`}>
    <Sticker className="absolute -top-[17px] right-[84px] rotate-[-6deg]">LIVE</Sticker>
    <p className={`${EYEBROW} text-[#595959]`}>HOW RECRUITERS SEE YOU</p>
    <div className="flex items-center gap-3">
      <img
        src={avatarImg}
        alt=""
        className="size-14 shrink-0 rounded-full border-2 border-solid border-[#1c2a21] object-cover object-top"
      />
      <span className="flex min-w-0 flex-col gap-[2px]">
        <span className="font-sans text-[17px] font-semibold leading-[20px] text-[#1c2a21]">
          {fullName}
        </span>
        <span className="font-sans text-[13px] leading-[16px] text-[#595959] max-lg:text-[12px]">
          {PROFILE.headline}
        </span>
      </span>
    </div>
    <div className="flex flex-wrap gap-[6px]">
      {PROFILE.badges.map((b, i) => (
        <Chip key={b} tone={i === 0 ? 'plain' : 'green'}>
          {b}
        </Chip>
      ))}
    </div>
  </div>
);
