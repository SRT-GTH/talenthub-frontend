import { classNames } from '../../../../utils/classNames.js';
import Button from '../../../ui/Button.jsx';
import { useUiStyle } from '../../../../hooks/useUiStyle.js';
import { CARD, DISPLAY, GUTTER } from '../personality/personalityStyles.js';
import { PlayfulStar, PlayfulSticker } from '../personality/PersonalityParts.jsx';
import {
  ArrowRightIcon,
  BulbIcon,
  CheckCircleIcon,
  LockIcon,
  TargetIcon,
} from '../personality/personalityIcons.jsx';
import coverMakolaFeatured from '../../../../assets/engagement-v2/arcade/makola-featured.png';
import { ChevronDownIcon } from '../interests/interestsIcons.jsx';
import { ClockIcon, PlusIcon, UnlockIcon } from './arcadeIcons.jsx';
import { FEATURED, FILTERS, GAMES, HUB, STATUS_LABEL, UNLOCK_AT } from './arcadeData.js';

/*
 * Arcade hub (Figma PA-01 / PA-13): header (kicker, title, lead + the "archetype unlocks at 3" progress card), the featured game,
 * category filters, the game grid (+ "Got a game idea?" card). Focused is the default, Playful via `playful:` variants.
 */
const xpWord = (uiStyle, s) => s.replace('{xp}', uiStyle === 'playful' ? 'XP' : 'pts');

const Chip = ({ children, className }) => (
  <span
    className={classNames(
      'inline-flex h-[32px] items-center rounded-full border border-solid border-[#e1eae2] bg-white px-[14px] font-sans text-[13px] leading-[16px] font-semibold text-[#595959] max-lg:text-[12px]',
      className
    )}
  >
    {children}
  </span>
);

/* The yellow / green / mint pill on a game card. Playful: ink border + 2px hard shadow. */
const StatusChip = ({ status, played, uiStyle }) => {
  if (status === 'soon') {
    return (
      <span className="inline-flex items-center rounded-full bg-[#f7f8f4] px-[10px] py-[4px] font-sans text-[11px] leading-[13px] font-semibold text-[#595959] max-lg:text-[12px]">
        {STATUS_LABEL.soon}
      </span>
    );
  }
  if (played) {
    return (
      <span className="inline-flex items-center gap-[5px] rounded-full border border-solid border-[#1c2a21]/[0.12] bg-[#ebf1ec] py-[5px] pr-[10px] pl-[8px] font-sans text-[11px] leading-[13px] font-semibold text-[#1c2a21] playful:border-[1.5px] playful:border-[#1c2a21] max-lg:text-[12px]">
        <CheckCircleIcon className="size-[13px] text-[#387440]" />
        {xpWord(uiStyle, 'Played · +50 {xp}')}
      </span>
    );
  }
  return (
    <span
      className={classNames(
        'inline-flex items-center rounded-full border border-solid border-[#1c2a21]/[0.12] px-[10px] py-[4px] font-sans text-[11px] leading-[13px] font-bold text-[#1c2a21] playful:border-[1.2px] playful:border-[#1c2a21] playful:shadow-[2px_2px_0_#1c2a21] max-lg:text-[12px]',
        status === 'new' ? 'bg-[#c1d4c4]' : 'bg-[#ffd86b]'
      )}
    >
      {STATUS_LABEL[status]}
    </span>
  );
};

const GameCard = ({ game, played, uiStyle, onPlay }) => {
  const soon = game.status === 'soon';
  return (
    <article
      className={classNames(
        'flex min-w-0 flex-col gap-[12px] rounded-[24px] bg-white p-[20px]',
        soon || played
          ? 'border border-solid border-[#e7e7e7] shadow-[0_8px_24px_rgba(18,38,20,0.06)]'
          : '',
        !soon && !played && CARD.replace('rounded-[24px] bg-white ', '')
      )}
    >
      <div className="flex items-center gap-[10px]">
        <img
          src={game.cover}
          alt=""
          draggable="false"
          className={classNames(
            'size-[56px] shrink-0 rounded-[14px] border border-solid border-[#1c2a21]/[0.12] object-cover',
            soon && 'opacity-50'
          )}
        />
        <span className="inline-flex items-center rounded-full bg-[#f7f8f6] px-[10px] py-[4px] font-sans text-[11px] leading-[13px] font-semibold text-[#595959] max-lg:text-[12px]">
          {game.category}
        </span>
        <span className="min-w-0 flex-1" />
        <StatusChip status={game.status} played={played} uiStyle={uiStyle} />
      </div>
      <div className="flex flex-col gap-[10px]">
        <h3
          className={classNames(
            'm-0 font-sans text-[19px] leading-[23px] font-semibold',
            soon ? 'text-[#595959]' : 'text-[#1c2a21]'
          )}
        >
          {game.title}
        </h3>
        <p className="m-0 flex items-center gap-[6px] font-sans text-[13px] leading-[16px] font-medium text-[#595959] max-lg:text-[12px]">
          <ClockIcon className="size-[14px] shrink-0 text-[#595959]" />
          {game.meta}
        </p>
        <p className="m-0 font-sans text-[13px] leading-[19px] text-[#595959] max-lg:text-[14px]">
          {game.blurb}
        </p>
        <p className="m-0 flex items-center gap-[6px] font-sans text-[12.5px] leading-[15px] font-semibold text-[#2a5730] max-lg:text-[12px]">
          <TargetIcon className="size-[14px] shrink-0" />
          {game.measures}
        </p>
      </div>
      {soon ? (
        <Button
          variant="tertiary-subtle"
          size="md"
          disabled
          className="mt-auto !py-[12px] !px-[18px] !opacity-50"
        >
          Coming soon
        </Button>
      ) : played ? (
        <Button
          variant="tertiary-subtle"
          size="md"
          onClick={() => onPlay(game)}
          className="mt-auto !py-[12px] !px-[18px]"
        >
          Replay
        </Button>
      ) : (
        <Button
          size="md"
          rightIcon={<ArrowRightIcon />}
          onClick={() => onPlay(game)}
          className="mt-auto !py-[12px] !px-[18px]"
        >
          Play game
        </Button>
      )}
    </article>
  );
};

const ProgressCard = ({ played, gamesById }) => {
  const done = played.length >= UNLOCK_AT;
  const slots = played.slice(0, UNLOCK_AT);
  return (
    <aside
      aria-label="Archetype progress"
      className={classNames(
        'flex w-full flex-col gap-[16px] p-[24px] lg:w-[clamp(340px,26.6vw,460px)] lg:shrink-0',
        CARD
      )}
    >
      <div className="flex items-center justify-between gap-[10px]">
        <h2
          className={classNames(
            'm-0 font-sans text-[19px] leading-[24px] font-semibold tracking-[-0.19px] text-[#1c2a21] playful:font-heading'
          )}
        >
          {done ? HUB.progress.unlocked : HUB.progress.locked}
        </h2>
        <span
          className={classNames(
            'inline-flex h-[32px] shrink-0 items-center rounded-full border border-solid px-[14px] font-sans text-[13px] leading-[16px] font-semibold',
            done
              ? 'border-[#1c2a21] bg-[#1c2a21] text-white'
              : 'border-[#e1eae2] bg-white text-[#595959]'
          )}
        >
          {Math.min(played.length, UNLOCK_AT)} / {UNLOCK_AT}
        </span>
      </div>
      <div className="flex items-center gap-[12px]">
        {[0, 1, 2].map((i) =>
          slots[i] ? (
            <img
              key={i}
              src={gamesById[slots[i]]?.cover}
              alt={gamesById[slots[i]]?.title}
              draggable="false"
              className="h-[72px] w-[96px] shrink-0 rounded-[16px] border-[1.5px] border-solid border-[#1c2a21] object-cover"
            />
          ) : (
            <span
              key={i}
              className="grid h-[72px] w-[96px] shrink-0 place-items-center rounded-[16px] border border-solid border-[#1c2a21]/[0.1] bg-[#f8f8f4] text-[#595959] playful:border-[1.5px] playful:border-[#1c2a21]/30"
            >
              <PlusIcon className="size-[20px]" />
            </span>
          )
        )}
        <span
          className={classNames(
            'grid h-[72px] w-[96px] shrink-0 place-items-center rounded-[16px]',
            done
              ? 'border-[1.5px] border-solid border-[#1c2a21] bg-[#ffd86b] text-[#1c2a21]'
              : 'bg-[#1c2a21] text-white'
          )}
        >
          {done ? <UnlockIcon className="size-[22px]" /> : <LockIcon className="size-[22px]" />}
        </span>
      </div>
      <p className="m-0 font-sans text-[13.5px] leading-[20px] text-[#595959] max-lg:text-[14px]">
        {HUB.progress.note}
      </p>
    </aside>
  );
};

const Featured = ({ uiStyle, onPlay }) => (
  <section
    aria-label="New this week"
    className="relative flex flex-col overflow-hidden rounded-[24px] border border-solid border-[#1c2a21]/[0.1] bg-[#ffd86b] shadow-[0_1px_2px_rgba(28,42,33,0.04),0_2px_8px_rgba(28,42,33,0.04)] playful:border-[1.5px] playful:border-[#1c2a21]/55 playful:shadow-[4px_4px_0_rgba(28,42,33,0.45),0_10px_24px_rgba(28,42,33,0.06)] lg:h-[323px] lg:flex-row"
  >
    <img
      src={coverMakolaFeatured}
      alt=""
      draggable="false"
      className="h-[200px] w-full object-cover lg:h-full lg:w-[45%] lg:max-w-[720px] lg:shrink-0"
    />
    <div className="flex min-w-0 flex-1 flex-col justify-center gap-[14px] p-[clamp(20px,2.3vw,40px)]">
      <div className="flex items-center gap-[8px]">
        <span className="hidden whitespace-nowrap rounded-full border-[1.2px] border-solid border-[#1c2a21] bg-[#c1d4c4] px-[11px] py-[5px] font-sans text-[11px] leading-[17px] font-bold text-[#1c2a21] shadow-[2px_2px_0_#1c2a21] playful:inline-block">
          {FEATURED.sticker}
        </span>
        <Chip>{FEATURED.category}</Chip>
      </div>
      <h2
        className={classNames(
          'm-0 font-sans text-[clamp(30px,2.31vw,40px)] leading-[1.1] font-semibold tracking-[-0.02em] text-[#1c2a21]',
          DISPLAY
        )}
      >
        {FEATURED.title}
      </h2>
      <p className="m-0 max-w-[797px] font-sans text-[17px] leading-[26px] text-[#1c2a21] max-lg:text-[16px]">
        {FEATURED.text}
      </p>
      <div className="flex flex-wrap items-center gap-[16px]">
        <Button size="lg" rightIcon={<ArrowRightIcon />} onClick={onPlay}>
          {FEATURED.action}
        </Button>
        <span className="flex items-center gap-[6px] font-sans text-[15px] leading-[18px] font-semibold text-[#1c2a21]">
          <ClockIcon className="size-[16px]" />
          {xpWord(uiStyle, FEATURED.meta)}
        </span>
      </div>
    </div>
    <PlayfulStar size={35} className="right-[78px] top-[18px]" />
    <PlayfulStar size={20} green className="right-[8px] top-[63px]" />
  </section>
);

const ArcadeHub = ({ played, filter, onFilter, onPlay, onFeatured, onSuggest }) => {
  const { uiStyle } = useUiStyle();
  const gamesById = Object.fromEntries(GAMES.map((g) => [g.id, g]));
  const counts = Object.fromEntries(
    FILTERS.map((f) => [f, GAMES.filter((g) => g.category === f).length])
  );
  const list = filter ? GAMES.filter((g) => g.category === filter) : GAMES;

  return (
    <div
      className={classNames(
        'mx-auto flex w-full max-w-[1728px] flex-col gap-[32px] pb-[40px] pt-[40px]',
        GUTTER
      )}
    >
      <header className="flex flex-col gap-[24px] lg:flex-row lg:items-center lg:justify-between lg:gap-[40px]">
        <div className="flex max-w-[1100px] flex-col gap-[12px]">
          <div className="flex items-center gap-[10px]">
            <span className="font-sans text-[11.5px] leading-[14px] font-bold tracking-[0.69px] text-[#387440] max-lg:text-[12px]">
              {HUB.kicker}
            </span>
            <span className="hidden rounded-full border-[1.2px] border-solid border-[#1c2a21] bg-[#c1d4c4] px-[11px] py-[5px] font-sans text-[11px] leading-[17px] font-bold text-[#1c2a21] shadow-[2px_2px_0_#1c2a21] playful:inline-block">
              {HUB.sticker}
            </span>
          </div>
          <h1
            className={classNames(
              'm-0 font-sans text-[clamp(32px,2.78vw,48px)] leading-[1.1] font-semibold tracking-[-0.02em] text-[#1c2a21]',
              DISPLAY
            )}
          >
            {HUB.title[0]}
            <span className="text-[#387440]">{HUB.title[1]}</span>
          </h1>
          <p className="m-0 font-sans text-[18px] leading-[27px] text-[#595959] max-lg:text-[16px] max-lg:leading-[24px]">
            {HUB.lead}
          </p>
        </div>
        <ProgressCard played={played} gamesById={gamesById} />
      </header>

      <Featured uiStyle={uiStyle} onPlay={onFeatured} />

      <div className="flex flex-wrap items-center gap-[10px]">
        <div
          role="group"
          aria-label="Filter games"
          className="flex flex-wrap items-center gap-[10px]"
        >
          {[null, ...FILTERS].map((f) => {
            const on = (filter ?? null) === f;
            return (
              <button
                key={f ?? 'all'}
                type="button"
                aria-pressed={on}
                onClick={() => onFilter(f)}
                className={classNames(
                  'inline-flex cursor-pointer items-center gap-[8px] rounded-full border border-solid px-[16px] py-[9px] font-sans text-[14px] leading-[17px] font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]',
                  on
                    ? 'border-[#1c2a21]/[0.1] bg-[#1c2a21] text-white playful:border-[1.5px] playful:border-[#1c2a21]'
                    : 'border-[#1c2a21]/[0.1] bg-white text-[#1c2a21] playful:border-[1.5px] playful:border-[#1c2a21]'
                )}
              >
                {f ?? 'All'}
                <span
                  className={classNames(
                    'inline-flex min-w-[20px] items-center justify-center rounded-full px-[7px] py-px font-sans text-[12px] leading-[14px] font-bold',
                    on ? 'bg-[#387440] text-white' : 'bg-[#f8f8f4] text-[#1c2a21]'
                  )}
                >
                  {f ? counts[f] : GAMES.length}
                </span>
              </button>
            );
          })}
        </div>
        <span className="hidden min-w-[40px] flex-1 lg:block" />
        <span className="inline-flex items-center gap-[6px] font-sans text-[14px] leading-[17px] font-semibold text-[#1c2a21]">
          {HUB.sort}
          <ChevronDownIcon className="size-[16px]" />
        </span>
      </div>

      <div className="grid grid-cols-1 gap-[24px] sm:grid-cols-2 lg:grid-cols-4">
        {list.map((g) => (
          <GameCard
            key={g.id}
            game={g}
            played={played.includes(g.id)}
            uiStyle={uiStyle}
            onPlay={onPlay}
          />
        ))}
        {filter ? null : (
          <section
            aria-label="Suggest a game"
            className={classNames(
              'flex flex-col items-center justify-center gap-[12px] rounded-[24px] bg-[#fffefc] p-[28px] text-center sm:col-span-2 lg:col-span-1 lg:h-[404px]',
              CARD.replace('rounded-[24px] bg-white ', '')
            )}
          >
            <span className="grid size-[52px] place-items-center rounded-[16px] bg-[#ffd86b] text-[#1c2a21]">
              <BulbIcon className="size-[25px]" />
            </span>
            <h3 className="m-0 font-sans text-[20px] leading-[25px] font-semibold tracking-[-0.2px] text-[#1c2a21] playful:font-heading">
              {HUB.suggest.title}
            </h3>
            <p className="m-0 max-w-[323px] font-sans text-[14px] leading-[20px] text-[#595959]">
              {HUB.suggest.text}
            </p>
            <button
              type="button"
              onClick={onSuggest}
              className="inline-flex h-[32px] cursor-pointer items-center rounded-full border border-solid border-[#e1eae2] bg-white px-[14px] font-sans text-[13px] leading-[16px] font-semibold text-[#595959] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
            >
              {HUB.suggest.action}
            </button>
          </section>
        )}
      </div>
    </div>
  );
};

export default ArcadeHub;
