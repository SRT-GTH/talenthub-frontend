import { useNavigate } from 'react-router-dom';
import { debug } from '../../../utils/debug.js';
import { classNames } from '../../../utils/classNames.js';
import Button from '../../ui/Button.jsx';
import {
  TalentHomeCustomizeIcon,
  TalentHomeDoodleStarGold20,
  TalentHomeDoodleStarGold9,
  TalentHomeDoodleStarGoldLarge,
  TalentHomeDoodleStarGoldMedium,
  TalentHomeDoodleStarLime9,
  TalentHomeDoodleStarWhiteSmall,
  TalentHomeEditProfileIcon,
  TalentHomeHeroXpAvatar,
} from '../../shared/assets.jsx';
import { CARD_INK, CtaButton, Chip, Doodle, HEAD, Points, Sticker } from './coreUi.jsx';
import { HERO } from './talentHomeCoreData.js';

const log = debug('TalentHomeHero');

const CAREER_BUDDY_ROUTE = '/profile/filling/career-buddy';

// Headline pieces: [['text'], ['accent text', true]]
const Headline = ({ parts, base, accent, className }) => (
  <h1 className={classNames(HEAD, 'leading-[1.1]', className)}>
    {parts.map(([text, isAccent], i) => (
      <span key={i} className={isAccent ? accent : base}>
        {text}
      </span>
    ))}
  </h1>
);

// 120px progress ring (Figma "Ring": 12px track #d6e5d9, arc #387440).
const Ring = ({ pct, size = 120, stroke = 12, children }) => {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#d6e5d9"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#387440"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${(c * pct) / 100} ${c}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">{children}</div>
    </div>
  );
};

const WelcomeHero = ({ copy, scrollToJourney, goOn }) => (
  <section
    aria-label="Welcome"
    className={classNames(
      'relative flex flex-col gap-[clamp(14px,1.4vw,24px)] rounded-[clamp(20px,1.6vw,28px)] bg-gradient-to-r from-[#2a5730] to-[#387440] p-[clamp(18px,2.1vw,36px)] min-[640px]:flex-row min-[640px]:items-center lg:pl-[clamp(24px,2.3vw,40px)]',
      CARD_INK
    )}
  >
    <div className="flex min-w-0 flex-1 flex-col gap-[clamp(8px,0.7vw,12px)]">
      <p className="text-[12px] leading-[normal] font-bold tracking-[1.2px] text-white">
        {copy.eyebrow}
      </p>
      <Headline
        parts={copy.headline}
        base="text-white"
        accent="text-[#ffd86b]"
        className="text-[clamp(26px,2.6vw,45px)]"
      />
      <p className="max-w-[640px] text-[clamp(14px,1vw,17px)] leading-[1.53] text-white">
        {copy.body}
      </p>
      <div className="mt-[clamp(4px,0.7vw,12px)] flex flex-wrap items-center gap-[clamp(10px,0.9vw,12px)]">
        <CtaButton size="lg" onClick={goOn}>
          {copy.cta}
        </CtaButton>
        <button
          type="button"
          onClick={scrollToJourney}
          className="cursor-pointer text-[15px] font-semibold text-white underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          {copy.link}
        </button>
      </div>
    </div>
    {/* XP card */}
    <div className="flex shrink-0 justify-center min-[640px]:w-[clamp(120px,11.4vw,157px)]">
      <div
        className={classNames(
          'flex flex-col items-center gap-[6px] rounded-[22px] bg-white px-[clamp(16px,1.4vw,24px)] py-[clamp(14px,1.2vw,20px)] playful:-rotate-3',
          CARD_INK
        )}
      >
        <div className="flex size-[clamp(72px,5.6vw,96px)] items-center justify-center overflow-hidden rounded-full bg-[#387440] playful:bg-gradient-to-b playful:from-[#7aa870] playful:to-[#387440]">
          <TalentHomeHeroXpAvatar className="mt-[6%] h-[113%] w-auto max-w-none shrink-0" />
        </div>
        <p
          className={classNames(HEAD, 'text-[clamp(22px,1.6vw,27px)] leading-[1.2] text-[#387440]')}
        >
          <Points n={copy.xp.n} />
        </p>
        <p className="text-[12px] leading-[normal] font-semibold text-[#595959]">
          {copy.xp.caption}
        </p>
      </div>
    </div>
    <Sticker className="top-[-12px] right-[16px] min-[640px]:top-4 min-[640px]:right-[clamp(130px,11.3%,160px)]">
      {copy.sticker}
    </Sticker>
    <Doodle icon={TalentHomeDoodleStarGoldLarge} className="top-[40px] left-[78.5%] size-[24px]" />
    <Doodle icon={TalentHomeDoodleStarGoldMedium} className="top-[80px] left-[80.7%] size-[10px]" />
    <Doodle
      icon={TalentHomeDoodleStarWhiteSmall}
      className="top-[170px] left-[71%] hidden size-[14px] min-[640px]:playful:block"
    />
  </section>
);

const RingHero = ({ copy, goOn, goProfile }) => (
  <section
    aria-label="Milestone"
    className={classNames(
      'relative flex flex-col gap-[clamp(14px,1.4vw,24px)] rounded-[clamp(20px,1.6vw,28px)] bg-white p-[clamp(18px,2vw,32px)] min-[640px]:flex-row min-[640px]:items-center lg:pr-[32px] lg:pl-[36px]',
      CARD_INK
    )}
  >
    <div className="flex min-w-0 flex-1 flex-col gap-[12px]">
      <p className="text-[12px] leading-[normal] font-bold tracking-[1.2px] text-[#387440]">
        {copy.eyebrow}
      </p>
      <Headline
        parts={copy.headline}
        base="text-[#1c2a21]"
        accent="text-[#387440]"
        className="text-[clamp(26px,2.55vw,44px)]"
      />
      <p className="max-w-[620px] text-[clamp(14px,1vw,17px)] leading-[1.53] text-[#595959]">
        {copy.body}
      </p>
      <div className="mt-[clamp(2px,0.5vw,8px)] flex flex-wrap items-center gap-[12px]">
        <Button variant="primary" size="md" onClick={goOn}>
          {copy.cta}
        </Button>
        <Button variant="tertiary-subtle" size="lg" className="lg:py-[14px]!" onClick={goProfile}>
          {copy.secondaryCta}
        </Button>
      </div>
    </div>
    <div className="flex shrink-0 justify-center">
      <div
        className={classNames(
          'flex flex-col items-center gap-[8px] rounded-[22px] bg-[#e8f2ed] px-[24px] py-[20px]',
          CARD_INK
        )}
      >
        <Ring pct={copy.ring.pct}>
          <span className={classNames(HEAD, 'text-[27px] leading-[1.2] text-[#1c2a21]')}>
            {copy.ring.pct}%
          </span>
        </Ring>
        <p className="text-[13px] leading-[normal] font-semibold text-[#1c2a21]">
          {copy.ring.label}
        </p>
        <p className="text-[12px] leading-[normal] font-medium text-[#387440]">
          <Points n={copy.ring.xp} /> {copy.ring.xpTail}
        </p>
      </div>
    </div>
    <Sticker className="top-[18px] left-[30%] max-lg:hidden" rotate="rotate-[5deg]">
      {copy.sticker}
    </Sticker>
    <Doodle icon={TalentHomeDoodleStarGold20} className="top-[58px] left-[42%] size-[20px]" />
    <Doodle icon={TalentHomeDoodleStarGold9} className="top-[90px] left-[44%] size-[9px]" />
  </section>
);

const STAT_TONE = {
  white: { bg: 'bg-white', note: 'text-[#1d7c4d]' },
  amber: { bg: 'bg-[#faf4e8]', note: 'text-[#785910]' },
  mint: { bg: 'bg-[#e8f2ed]', note: 'text-[#387440]' },
};

const StatsHero = ({ copy, home }) => (
  <section
    aria-label="Today"
    className={classNames(
      'relative flex flex-col gap-[clamp(14px,1.4vw,24px)] rounded-[clamp(20px,1.6vw,28px)] bg-white p-[clamp(16px,2vw,32px)] lg:min-h-[255px] lg:flex-row lg:items-center lg:pr-[32px] lg:pl-[36px]',
      CARD_INK
    )}
  >
    <div className="flex min-w-0 flex-col gap-[10px] lg:w-[min(645px,46%)] lg:shrink-0">
      <p className="text-[12px] leading-[normal] font-bold tracking-[1.2px] text-[#387440]">
        {copy.eyebrow}
      </p>
      <Headline
        parts={copy.headline}
        base="text-[#1c2a21]"
        accent="text-[#387440]"
        className="text-[clamp(26px,2.55vw,44px)]"
      />
      <p className="max-w-[560px] text-[clamp(14px,0.95vw,16px)] leading-[1.5] text-[#595959]">
        {copy.body}
      </p>
      <div className="flex flex-wrap gap-[8px]">
        {copy.quick.map((label, i) => (
          <Chip
            key={label}
            as="button"
            type="button"
            icon={i === 2 ? <TalentHomeEditProfileIcon className="size-[14px]" /> : null}
          >
            {label}
          </Chip>
        ))}
      </div>
    </div>
    <div className="grid min-w-0 grid-cols-2 gap-[12px] lg:ml-auto lg:grid-cols-4">
      {copy.stats.map((s) => (
        <div
          key={s.label}
          className={classNames(
            'flex min-w-0 flex-col gap-[4px] rounded-[18px] p-[clamp(12px,1.1vw,16px)] lg:w-[clamp(120px,10.9vw,150px)]',
            STAT_TONE[s.tone].bg,
            CARD_INK
          )}
        >
          <p
            className={classNames(
              HEAD,
              'text-[clamp(26px,1.85vw,32px)] leading-[1.2] text-[#1c2a21]'
            )}
          >
            {s.n}
          </p>
          <p className="text-[13px] leading-[normal] font-semibold text-[#1c2a21]">{s.label}</p>
          <p
            className={classNames(
              'text-[12px] leading-[normal] font-medium',
              STAT_TONE[s.tone].note
            )}
          >
            {s.note}
          </p>
        </div>
      ))}
    </div>
    <button
      type="button"
      onClick={() => home.update({ edit: true })}
      className="max-lg:order-first max-lg:self-end lg:absolute lg:top-[16px] lg:right-[24px] inline-flex cursor-pointer items-center gap-[6px] rounded-full border border-[#e7e7e7] bg-white px-[10px] py-[6px] text-[12px] leading-[normal] font-semibold text-[#387440] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
    >
      <TalentHomeCustomizeIcon className="size-[14px]" />
      {copy.customize}
    </button>
    <Sticker
      className="top-[18px] left-[22%] max-lg:hidden"
      color="bg-[#84cc16]"
      rotate="rotate-[5deg]"
    >
      {copy.sticker}
    </Sticker>
    <Doodle
      icon={TalentHomeDoodleStarGold20}
      className="top-[60px] left-[33%] size-[20px] max-lg:hidden"
    />
    <Doodle
      icon={TalentHomeDoodleStarLime9}
      className="top-[90px] left-[34.7%] size-[9px] max-lg:hidden"
    />
  </section>
);

const TalentHomeHero = ({ home }) => {
  const navigate = useNavigate();
  const copy = HERO[home.stateKey] ?? HERO.day1;
  log('render', { state: home.stateKey, kind: copy.kind });

  const goOn = () => {
    log('continue clicked', home.stateKey);
    navigate(CAREER_BUDDY_ROUTE);
  };
  const scrollToJourney = () => {
    log('scroll to journey');
    document.getElementById('talent-home-journey')?.scrollIntoView({
      behavior:
        window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
        document.querySelector('[data-a11y-motion]')
          ? 'auto'
          : 'smooth',
    });
  };

  if (copy.kind === 'welcome')
    return <WelcomeHero copy={copy} goOn={goOn} scrollToJourney={scrollToJourney} />;
  if (copy.kind === 'ring') return <RingHero copy={copy} goOn={goOn} goProfile={goOn} />;
  return <StatsHero copy={copy} home={home} />;
};

export default TalentHomeHero;
