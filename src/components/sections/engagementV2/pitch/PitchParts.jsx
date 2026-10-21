import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import { ArrowRightIcon } from '../../../shared/assets.jsx';
import { TalentHomeActivityCheckCircleIcon } from '../../../shared/assets.jsx';
import Button from '../../../ui/Button.jsx';
import {
  PitchBellIcon,
  PitchBoltIcon,
  PitchCameraIcon,
  PitchChatIcon,
  PitchDoodleStarIcon,
  PitchEditIcon,
  PitchEyeIcon,
  PitchFileIcon,
  PitchPlayIcon,
  PitchRefreshIcon,
  PitchStarIcon,
  PitchTargetIcon,
  PitchTextIcon,
  PitchTrendUpIcon,
  PitchUploadIcon,
  PitchUserIcon,
  PitchVideoCameraIcon,
} from './pitchIcons.jsx';

const log = debug('PitchParts');

/*
 * Shared atoms for the Pitch stage (Figma section Pitch, Playful 5625:92950 / Focused 8285:20481).
 * Card = white r24 with a ring drawn inside (Playful 1.5px ink@.55 + hard shadow, Focused 1px ink@.10 + soft shadow).
 * Stickers / doodles are Playful-only (Focused frames do not draw them).
 */
const ICONS = {
  video: PitchVideoCameraIcon,
  upload: PitchUploadIcon,
  text: PitchTextIcon,
  user: PitchUserIcon,
  star: PitchStarIcon,
  target: PitchTargetIcon,
  bolt: PitchBoltIcon,
  refresh: PitchRefreshIcon,
  play: PitchPlayIcon,
  chat: PitchChatIcon,
  bell: PitchBellIcon,
  camera: PitchCameraIcon,
  file: PitchFileIcon,
  eye: PitchEyeIcon,
  edit: PitchEditIcon,
  trend: PitchTrendUpIcon,
};

export const PitchGlyph = ({ name, className }) => {
  const Glyph = ICONS[name];
  return Glyph ? <Glyph className={className} /> : null;
};

export const HEAD_FONT = 'playful:font-[family-name:var(--pf-font-display)]';
export const CARD_SHADOW =
  'shadow-[0_1px_2px_rgba(28,42,33,0.04),0_2px_8px_rgba(28,42,33,0.04)] playful:shadow-[4px_4px_0_rgba(28,42,33,0.45),0_10px_24px_rgba(28,42,33,0.06)]';
const RING =
  'pointer-events-none absolute inset-0 rounded-[inherit] border border-[rgba(28,42,33,0.1)] playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)]';

export const Card = ({ className, ringClass, children, ...rest }) => (
  <div className={classNames('relative bg-white', CARD_SHADOW, className)} {...rest}>
    <span aria-hidden="true" className={classNames(RING, ringClass)} />
    {children}
  </div>
);

export const Chip = ({ children, tone = 'neutral', className }) => (
  <span
    className={classNames(
      'inline-flex min-h-[32px] items-center rounded-full border px-[14px] font-sans text-[13px] font-semibold leading-[16px] whitespace-nowrap',
      tone === 'green'
        ? 'border-[#c1d4c4] bg-[#ebf1ec] text-[#387440]'
        : 'border-[#e1eae2] bg-white text-[#595959]',
      className
    )}
  >
    {children}
  </span>
);

export const Sticker = ({ children, className, style }) => (
  <span
    style={style}
    aria-hidden="true"
    className={classNames(
      'hidden items-center rounded-[8px] border-[1.2px] border-[#1c2a21] bg-[#ffd86b] px-[11px] py-[5px] font-sans text-[12px] font-bold leading-[14px] tracking-[0.4px] text-[#1c2a21] shadow-[2px_2px_0_#1c2a21] playful:inline-flex',
      className
    )}
  >
    {children}
  </span>
);

export const Eyebrow = ({ children, className }) => (
  <p
    className={classNames(
      'm-0 font-sans text-[11px] font-bold leading-[13px] tracking-[1.2px] max-lg:text-[12px]',
      className
    )}
  >
    {children}
  </p>
);

export const InfoRow = ({ icon, title, sub, size = 'md' }) => (
  <div className="flex items-start gap-3">
    <span className="flex size-8 shrink-0 items-center justify-center rounded-[10px] bg-[#ebf1ec] text-[#387440]">
      <PitchGlyph name={icon} className="size-4" />
    </span>
    <div className="flex min-w-0 flex-col gap-[2px]">
      <span
        className={classNames(
          'font-sans font-semibold text-[#1c2a21]',
          size === 'md' ? 'text-[14px] leading-[17px]' : 'text-[14px] leading-[17px]'
        )}
      >
        {title}
      </span>
      <span className="font-sans text-[13px] leading-[19px] font-normal text-[#595959]">{sub}</span>
    </div>
  </div>
);

export const RailCard = ({ title, rows }) => (
  <Card className="flex flex-col gap-[14px] rounded-[24px] p-6">
    <h2 className="m-0 font-sans text-[18px] leading-[21px] font-semibold text-[#1c2a21]">
      {title}
    </h2>
    {rows.map((r) => (
      <InfoRow key={r.title} {...r} />
    ))}
  </Card>
);

/* Hero: gradient band, copy left (+ Playful sticker / doodles), "What to say" card right. */
export const PitchHero = ({ hero, sticker, card }) => (
  <section
    className="bg-[linear-gradient(90deg,#ebf1ec_0%,#faf4e8_100%)] px-4 pt-[clamp(24px,2vw,34px)] pb-3 md:px-[clamp(20px,3.7vw,64px)]"
    aria-label="Pitch intro"
  >
    <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
      <div className="relative flex max-w-[min(100%,820px)] flex-col gap-3">
        <Eyebrow className="text-[#387440]">{hero.eyebrow}</Eyebrow>
        <div className="relative flex items-start max-sm:flex-wrap">
          <h1
            className={classNames(
              'm-0 font-sans text-[clamp(28px,2.72vw,47px)] leading-[clamp(36px,3.0vw,52px)] font-semibold text-[#1c2a21]',
              HEAD_FONT,
              'playful:text-[#111111]'
            )}
          >
            {hero.title[0]}
            <span className="text-[#387440]">{hero.title[1]}</span>
          </h1>
          {sticker ? (
            <Sticker
              className="mt-[clamp(10px,1.4vw,24px)]"
              style={{ marginLeft: hero.stickerShift }}
            >
              {sticker}
            </Sticker>
          ) : null}
          <PitchDoodleStarIcon
            className="pointer-events-none absolute top-1 hidden size-6 text-[#c8951a] playful:xl:block"
            style={{ left: hero.stars[0] }}
          />
          <PitchDoodleStarIcon
            className="pointer-events-none absolute top-[46px] hidden size-[13px] text-[#387440] playful:xl:block"
            style={{ left: hero.stars[1] }}
          />
        </div>
        <p className="m-0 max-w-[660px] font-sans text-[16px] leading-[24px] font-normal text-[#595959]">
          {hero.body}
        </p>
      </div>
      {card ? (
        <Card className="flex w-full max-w-[460px] flex-col gap-[10px] rounded-[24px] px-[22px] py-5 lg:w-[clamp(300px,26.6vw,460px)] lg:shrink-0">
          <h2 className="m-0 font-sans text-[15px] leading-[18px] font-semibold text-[#1c2a21]">
            {card.title}
          </h2>
          {card.rows.map((r) => (
            <div key={r.title} className="flex items-center gap-[10px]">
              <span className="flex size-[30px] shrink-0 items-center justify-center rounded-[9px] bg-[#ebf1ec] text-[#387440]">
                <PitchGlyph name={r.icon} className="size-4" />
              </span>
              <span className="flex flex-col gap-px">
                <span className="font-sans text-[13px] leading-[16px] font-semibold text-[#1c2a21] max-lg:text-[13px]">
                  {r.title}
                </span>
                <span className="font-sans text-[12px] leading-[14px] text-[#595959]">{r.sub}</span>
              </span>
            </div>
          ))}
        </Card>
      ) : null}
    </div>
  </section>
);

export const MethodTabs = ({ tabs, active, onPick }) => (
  <div
    role="tablist"
    aria-label="Pitch method"
    className="flex gap-[6px] rounded-[16px] border border-[#e7e7e7] bg-[#f7f8f4] p-[6px]"
  >
    {tabs.map((t) => {
      const on = t.id === active;
      return (
        <button
          key={t.id}
          type="button"
          role="tab"
          aria-selected={on}
          onClick={() => {
            log('tab', t.id);
            onPick(t.id);
          }}
          className={classNames(
            'relative flex min-h-[42px] flex-1 cursor-pointer items-center justify-center gap-2 rounded-[12px] border-0 px-2 py-3 font-sans text-[15px] leading-[18px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green sm:px-4',
            on
              ? classNames('bg-white font-bold text-[#1c2a21]', CARD_SHADOW)
              : 'bg-[#f7f8f4] font-semibold text-[#595959]'
          )}
        >
          {on ? (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-[inherit] border border-[rgba(28,42,33,0.1)] playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)]"
            />
          ) : null}
          <PitchGlyph
            name={t.icon}
            className={classNames('size-[18px]', on ? 'text-[#387440]' : 'text-[#595959]')}
          />
          {t.label}
        </button>
      );
    })}
  </div>
);

/* Primary green button with the white arrow (Start recording / Allow camera / Browse files …). */
export const PitchPrimary = ({ children, arrow = true, size = 'md', className, ...rest }) => (
  <Button
    size={size}
    className={classNames(size === 'sm' ? 'lg:py-[10.5px]' : 'lg:py-[12.5px]', className)}
    rightIcon={arrow ? <ArrowRightIcon /> : undefined}
    {...rest}
  >
    {children}
  </Button>
);

export const PitchSecondary = ({ children, className, ...rest }) => (
  <Button
    variant="tertiary-subtle"
    size="lg"
    className={classNames('lg:py-[12.5px]', className)}
    {...rest}
  >
    {children}
  </Button>
);

/* Footer (88px): optional back button left; right group Skip · Auto-saved · primary. */
export const PitchFooter = ({
  backLabel,
  onBack,
  skipLabel,
  onSkip,
  continueLabel,
  onContinue,
  disabled,
}) => (
  <div className="sticky bottom-0 z-20 flex min-h-[88px] w-full flex-wrap items-center justify-between gap-3 border-t border-[#e7e7e7] bg-white px-4 py-3 md:px-[clamp(20px,3.7vw,64px)]">
    <PitchSecondary onClick={onBack}>{backLabel}</PitchSecondary>
    <div className="flex flex-wrap items-center justify-end gap-4">
      {skipLabel ? (
        <button
          type="button"
          onClick={onSkip}
          className="min-h-[24px] cursor-pointer border-0 bg-transparent p-0 font-sans text-[15px] leading-[18px] font-semibold text-[#1c2a21] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
        >
          {skipLabel}
        </button>
      ) : null}
      <span className="inline-flex items-center gap-[6px] font-sans text-[13px] leading-[16px] font-medium text-[#595959] max-md:hidden">
        <TalentHomeActivityCheckCircleIcon className="size-[14px] text-[#387440]" />
        Auto-saved
      </span>
      <PitchPrimary disabled={disabled} onClick={onContinue}>
        {continueLabel}
      </PitchPrimary>
    </div>
  </div>
);
