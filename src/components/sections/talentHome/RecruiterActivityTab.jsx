import {
  ActivityAppliedSuitcaseIcon,
  ActivityDateRangeCalendarIcon,
  ActivityMessageChatIcon,
  ActivityShortlistedHeartIcon,
  ActivityViewedEyeIcon,
  ArrowRightIcon,
  RecruiterVerifiedCheckIcon,
  TalentVisibilitySwitchOffIcon,
  TalentVisibilitySwitchOnIcon,
} from '../../shared/assets.jsx';
import { useEffect, useMemo, useState } from 'react';
import { debug } from '../../../utils/debug.js';
import { classNames } from '../../../utils/classNames.js';
import Button from '../../ui/Button.jsx';
import TalentHomeHero from './TalentHomeHero.jsx';
import { CARD, LIFT, DISPLAY, Chip, Sticker, HomeTabs } from './TabsParts.jsx';
import { RECRUITER_FEED, THIS_WEEK, VISIBILITY, BUDDY_TIP } from './talentHomeTabsData.js';
import careerBuddy from '../../../assets/talent-home/tabs/career-buddy-avatar.png';

const log = debug('RecruiterActivityTab');

/*
 * RecruiterActivityTab — HM-07. Figma Playful 7742:3439 / Focused 8097:8716.
 * Page body for `?tab=recruiter`: hero (Core) + Home tabs + activity feed (left) +
 * "This week" stats, "Who can see you" switches and the Buddy tip (right).
 * Filters and switches are local state (mock) — replace `RECRUITER_FEED` / `VISIBILITY`
 * with API data and wire the setters.
 */

const KIND = {
  eye: { icon: ActivityViewedEyeIcon, bg: 'bg-[#f7f8f4]', size: 'h-[11.4px] w-[12px]' },
  chat: { icon: ActivityMessageChatIcon, bg: 'bg-[#ebf1ec]', size: 'size-[12px]' },
  heart: { icon: ActivityShortlistedHeartIcon, bg: 'bg-[#faf4e8]', size: 'size-[12px]' },
  suitcase: { icon: ActivityAppliedSuitcaseIcon, bg: 'bg-[#e8f2ed]', size: 'size-[12px]' },
};

const FilterPill = ({ on, label, count, onClick }) => (
  <button
    type="button"
    aria-pressed={on}
    onClick={onClick}
    className={classNames(
      'inline-flex shrink-0 cursor-pointer items-center gap-[6px] whitespace-nowrap rounded-full border border-solid px-[12px] py-[7px] font-semibold leading-normal',
      'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green',
      on
        ? 'border-[rgba(28,42,33,0.12)] bg-[#1c2a21] playful:border-[#1c2a21]'
        : 'border-[#e7e7e7] bg-white'
    )}
  >
    <span className={classNames('text-[13px]', on ? 'text-white' : 'text-[#1c2a21]')}>{label}</span>
    <span className={classNames('text-[12px]', on ? 'text-[#ffd86b]' : 'text-[#595959]')}>
      {count}
    </span>
  </button>
);

const ActivityRow = ({ item }) => {
  const k = KIND[item.kind];
  return (
    <li
      className={classNames(
        'relative flex flex-wrap items-center gap-x-[14px] gap-y-[10px] rounded-[16px] p-[14px]',
        item.highlight ? classNames('bg-[#f5f9f5]', LIFT) : 'border border-[#e7e7e7] bg-white'
      )}
    >
      <span className="relative flex shrink-0 items-center">
        <img src={item.photo} alt="" width="44" height="44" className="size-[44px] rounded-full" />
        <span
          className={classNames(
            'absolute left-[28px] top-[26px] flex size-[22px] items-center justify-center rounded-[11px] border-2 border-solid border-white',
            k.bg
          )}
        >
          <k.icon className={k.size} />
        </span>
      </span>
      <div className="flex min-w-0 flex-1 basis-[200px] flex-col gap-[3px]">
        <div className="flex flex-wrap items-center gap-x-[6px]">
          <span className="whitespace-nowrap text-[15px] font-semibold text-[#1c2a21]">
            {item.name}
          </span>
          <RecruiterVerifiedCheckIcon className="size-[14px]" />
          <span className="text-[13px] text-[#595959]">{item.role}</span>
        </div>
        <p
          className={classNames(
            'max-w-[560px] text-[13px] leading-[19px] text-[#1c2a21]',
            item.highlight ? 'font-medium' : null
          )}
        >
          {item.text}
        </p>
        <div className="flex flex-wrap items-center gap-[8px]">
          <span className="whitespace-nowrap text-[12px] text-[#595959]">{item.when}</span>
          <Chip>{item.tag}</Chip>
        </div>
      </div>
      {item.action ? (
        <Button
          size={item.secondary ? 'lg' : 'sm'}
          variant={item.secondary ? 'tertiary-subtle' : 'primary'}
          className="max-md:w-full"
          rightIcon={item.secondary ? undefined : <ArrowRightIcon />}
          onClick={() => log('action', item.id, item.action)}
        >
          {item.action}
        </Button>
      ) : null}
      {item.sticker ? (
        <Sticker rotate="4deg" className="absolute right-[clamp(12px,12.5vw,180px)] top-[-13px]">
          {item.sticker}
        </Sticker>
      ) : null}
    </li>
  );
};

const FeedCard = () => {
  const f = RECRUITER_FEED;
  const [filter, setFilter] = useState('all');
  const rows = useMemo(
    () => (filter === 'all' ? f.items : f.items.filter((i) => i.filter === filter)),
    [f.items, filter]
  );
  const pick = (id) => {
    log(
      'filter ->',
      id,
      'rows:',
      id === 'all' ? f.items.length : f.items.filter((i) => i.filter === id).length
    );
    setFilter(id);
  };
  return (
    <section
      aria-labelledby="ra-title"
      className={classNames(CARD, 'flex flex-col gap-[16px] p-[clamp(14px,1.6vw,22px)]')}
    >
      <div className="flex items-center gap-[10px] pb-[8px]">
        <h2
          id="ra-title"
          className={classNames(
            'whitespace-nowrap text-[19px] font-semibold leading-[1.25] text-[#1c2a21]',
            DISPLAY
          )}
        >
          {f.title}
        </h2>
        <span className="h-px min-w-px flex-1" aria-hidden="true" />
        <span className="inline-flex h-[32px] shrink-0 items-center gap-[6px] whitespace-nowrap rounded-full border border-[#e1eae2] bg-white px-[14px] text-[13px] font-semibold text-[#595959]">
          <ActivityDateRangeCalendarIcon className="size-[14px]" />
          {f.range}
        </span>
      </div>
      <div
        role="group"
        aria-label="Filter activity"
        className="-mx-px flex gap-[8px] overflow-x-auto px-px py-px [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {f.filters.map((x) => (
          <FilterPill
            key={x.id}
            on={filter === x.id}
            label={x.label}
            count={x.count}
            onClick={() => pick(x.id)}
          />
        ))}
      </div>
      <ul className="flex flex-col gap-[16px] playful:gap-[16px]">
        {rows.map((it) => (
          <ActivityRow key={it.id} item={it} />
        ))}
      </ul>
    </section>
  );
};

const STAT_BG = { white: 'bg-white', gold: 'bg-[#faf4e8]', mint: 'bg-[#e8f2ed]' };

const ThisWeekCard = () => (
  <section
    aria-labelledby="ra-week"
    className={classNames(CARD, 'flex flex-col gap-[16px] p-[clamp(14px,1.6vw,22px)]')}
  >
    <h2
      id="ra-week"
      className={classNames('text-[19px] font-semibold leading-[1.25] text-[#1c2a21]', DISPLAY)}
    >
      {THIS_WEEK.title}
    </h2>
    <div className="grid grid-cols-2 gap-x-[10px] gap-y-[16px]">
      {THIS_WEEK.stats.map((s) => (
        <div
          key={s.label}
          className={classNames(
            'flex min-w-0 flex-col gap-[2px] rounded-[16px] px-[14px] py-[12px]',
            STAT_BG[s.tone],
            LIFT
          )}
        >
          <span
            className={classNames(
              'text-[27px] font-semibold leading-[1.2] text-[#1c2a21]',
              DISPLAY
            )}
          >
            {s.value}
          </span>
          <span className="text-[13px] font-semibold text-[#1c2a21]">{s.label}</span>
          <span className="text-[12px] font-medium text-[#387440]">{s.note}</span>
        </div>
      ))}
    </div>
    <p className="text-[12px] font-medium text-[#595959]">{THIS_WEEK.footer}</p>
  </section>
);

const VisibilityCard = () => {
  const [settings, setSettings] = useState(() =>
    Object.fromEntries(VISIBILITY.settings.map((s) => [s.id, s.on]))
  );
  const toggle = (id) => {
    setSettings((prev) => {
      log('visibility', id, '->', !prev[id]);
      return { ...prev, [id]: !prev[id] };
    });
  };
  return (
    <section
      aria-labelledby="ra-vis"
      className={classNames(CARD, 'flex flex-col gap-[12px] p-[clamp(14px,1.6vw,22px)]')}
    >
      <h2 id="ra-vis" className="text-[16px] font-semibold text-[#1c2a21]">
        {VISIBILITY.title}
      </h2>
      {VISIBILITY.settings.map((s) => (
        <div key={s.id} className="flex items-center gap-[12px] py-[10px]">
          <div className="flex min-w-0 flex-1 flex-col gap-[2px]">
            <span id={`ra-vis-${s.id}`} className="text-[14px] font-semibold text-[#1c2a21]">
              {s.title}
            </span>
            <span className="max-w-[320px] text-[12px] leading-[17px] text-[#595959]">
              {s.hint}
            </span>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={settings[s.id]}
            aria-labelledby={`ra-vis-${s.id}`}
            onClick={() => toggle(s.id)}
            className="h-[24px] w-[40px] shrink-0 cursor-pointer rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
          >
            {settings[s.id] ? (
              <TalentVisibilitySwitchOnIcon className="size-full" />
            ) : (
              <TalentVisibilitySwitchOffIcon className="size-full" />
            )}
          </button>
        </div>
      ))}
    </section>
  );
};

const BuddyTip = () => (
  <div className="flex items-center gap-[12px] rounded-[20px] border border-[#c1d4c4] bg-[#ebf1ec] p-[16px]">
    <span className="flex size-[44px] shrink-0 items-center justify-center overflow-hidden rounded-[22px] bg-white">
      <span className="relative size-[40px] overflow-hidden">
        <img
          src={careerBuddy}
          alt=""
          aria-hidden="true"
          className="absolute left-[-9.93%] top-[-12.75%] h-[117.89%] w-[129.76%] max-w-none"
        />
      </span>
    </span>
    <p className="min-w-0 text-[13px] font-medium leading-[19px] text-[#1c2a21]">{BUDDY_TIP}</p>
  </div>
);

const RecruiterActivityTab = ({ home }) => {
  useEffect(() => {
    log('mount', { stateKey: home?.stateKey, tab: home?.tab });
  }, [home?.stateKey, home?.tab]);

  const selectTab = (id) => {
    log('tab ->', id);
    home.update({ tab: id === 'home' ? null : id });
  };

  return (
    <>
      <TalentHomeHero home={home} />
      <HomeTabs active="recruiter" onSelect={selectTab} />
      <div className="grid items-start gap-[16px] lg:grid-cols-[minmax(0,912fr)_minmax(0,448fr)]">
        <FeedCard />
        <div className="flex min-w-0 flex-col gap-[16px]">
          <ThisWeekCard />
          <VisibilityCard />
          <BuddyTip />
        </div>
      </div>
    </>
  );
};

export default RecruiterActivityTab;
