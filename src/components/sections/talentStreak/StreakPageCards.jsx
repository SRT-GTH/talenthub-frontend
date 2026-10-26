import { useEffect, useState } from 'react';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import { STREAK_PAGE_COPY } from './talentStreakData.js';
import { saveStreakReminders, setLeaderboardOptIn } from '../../../services/streak.api.js';
import flameSm from '../../../assets/talent-streak/page/flame-sm.svg';
import iconBook from '../../../assets/talent-streak/page/icon-book.svg';
import iconQuiz from '../../../assets/talent-streak/page/icon-quiz.svg';
import iconGame from '../../../assets/talent-streak/page/icon-game.svg';
import iconClip from '../../../assets/talent-streak/page/icon-clip.svg';
import iconBell from '../../../assets/talent-streak/page/icon-bell.svg';
import iconLock from '../../../assets/talent-streak/page/icon-lock.svg';
import iconCheck from '../../../assets/talent-streak/page/icon-check.svg';

const log = debug('StreakPageCards');
const ICONS = { book: iconBook, quiz: iconQuiz, game: iconGame, clip: iconClip };

/*
 * The four supporting cards of /streak (Figma "What counts" 7534:1504, "Milestones" 7534:1528,
 * "Reminders" 7534:1576, "Leaderboard" 7534:1592; Focused twins under 8110:24897 / 8110:24921…).
 * All four share the white card: #e1eae2 hairline, r22, no shadow, in both styles. Playful swaps the
 * titles to Bricolage and adds the ink shelf to the milestone badges, the ink borders to the toggles and
 * time pill. Exports: StreakCountsCard, StreakMilestonesCard, StreakRemindersCard, StreakLeaderboardCard.
 */
const CARD = 'rounded-[22px] border border-solid border-[#e1eae2] bg-white';
const TITLE_21 =
  'm-0 font-sans text-[21px] font-semibold leading-[26px] text-[#1c2a21] playful:font-heading';
const TITLE_19 =
  'm-0 font-sans text-[19px] font-semibold leading-[24px] text-[#1c2a21] playful:font-heading';

export const StreakCountsCard = () => (
  <section
    aria-label={STREAK_PAGE_COPY.counts.title}
    className={classNames(CARD, 'flex flex-col gap-[12px] p-[20px]')}
  >
    <h2 className={TITLE_19}>{STREAK_PAGE_COPY.counts.title}</h2>
    <ul className="m-0 flex list-none flex-wrap gap-[10px] p-0">
      {STREAK_PAGE_COPY.counts.items.map((item) => (
        <li
          key={item.id}
          className="inline-flex items-center gap-[8px] rounded-full border border-solid border-[#c1d4c4] bg-[#ebf1ec] py-[9px] pl-[10px] pr-[14px] font-sans text-[13.5px] font-semibold leading-[16px] text-[#2d5d33] max-lg:text-[14px]"
        >
          <img src={ICONS[item.icon]} alt="" aria-hidden="true" className="size-[16px] shrink-0" />
          {item.label}
        </li>
      ))}
    </ul>
  </section>
);

const MilestoneRow = (props) => {
  const m = props.milestone;
  const locked = m.state === 'locked';
  const live = m.state === 'current' || m.state === 'unlocked';
  return (
    <li
      className={classNames(
        'flex items-center gap-[12px] rounded-[14px] py-[6px] pl-[10px] pr-[8px]',
        live && 'border-[1.2px] border-solid border-[#f59638] bg-[#fef5eb]'
      )}
    >
      <span
        className={classNames(
          'flex shrink-0 items-center justify-center rounded-[12px] border-[1.2px] border-solid',
          locked
            ? 'size-[40px] border-[#e1eae2] bg-[#f8f8f4]'
            : 'size-[43px] border-[#1c2a21] playful:shadow-[1.5px_1.5px_0_#1c2a21]',
          live ? 'bg-[#f59638]' : !locked && 'bg-[#ffd86b]'
        )}
        aria-hidden="true"
      >
        {locked ? (
          <img src={iconLock} alt="" className="size-[15px]" />
        ) : (
          <span
            className={classNames(
              'font-sans text-[15px] font-bold leading-[18px]',
              live ? 'text-white' : 'text-[#1c2a21]'
            )}
          >
            {m.id}
          </span>
        )}
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-[1px]">
        <span
          className={classNames(
            'font-sans text-[14.5px] font-semibold leading-[17px]',
            locked ? 'text-[#737373]' : 'text-[#1c2a21]'
          )}
        >
          {m.label}
        </span>
        <span
          className={classNames(
            'font-sans text-[12px] leading-[14px]',
            live ? 'text-[#b8712a]' : 'text-[#737373]'
          )}
        >
          {m.note}
        </span>
      </span>
      {m.state === 'done' ? (
        <img src={iconCheck} alt="" aria-hidden="true" className="size-[16px] shrink-0" />
      ) : null}
    </li>
  );
};

export const StreakMilestonesCard = (props) => {
  const milestones = props.milestones;
  return (
    <section
      aria-label={STREAK_PAGE_COPY.milestonesTitle}
      className={classNames(CARD, 'flex flex-col gap-[2px] px-[20px] pb-[12px] pt-[16px]')}
    >
      <h2 className={classNames(TITLE_21, 'pb-[2px]')}>{STREAK_PAGE_COPY.milestonesTitle}</h2>
      <ul className="m-0 flex list-none flex-col gap-[2px] p-0">
        {milestones.map((m) => (
          <MilestoneRow key={m.id} milestone={m} />
        ))}
      </ul>
    </section>
  );
};

const Toggle = (props) => {
  const { checked, onChange, label } = props;
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={classNames(
        'flex h-[26px] w-[44px] shrink-0 cursor-pointer items-center rounded-full border-[1px] border-solid border-[rgba(28,42,33,0.12)] p-[2px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440] playful:border-[1.5px] playful:border-[#1c2a21]',
        checked ? 'justify-end bg-[#387440]' : 'justify-start bg-[#d9dfd9]'
      )}
    >
      <span className="size-[20px] rounded-full border-[1.2px] border-solid border-[#1c2a21] bg-white" />
    </button>
  );
};

// `live`: each switch saves (PUT /streak/reminders) and rolls back if the save fails.
export const StreakRemindersCard = (props) => {
  const [items, setItems] = useState(props.reminders);
  useEffect(() => {
    log('reminders', items.map((r) => `${r.id}:${r.enabled}`).join(' '));
  }, [items]);
  const flip = (id) => {
    const target = items.find((r) => r.id === id);
    const enabled = !target?.enabled;
    setItems((list) => list.map((r) => (r.id === id ? { ...r, enabled } : r)));
    if (!props.live) return;
    saveStreakReminders({ [id]: { enabled } }).catch((err) => {
      log('save reminders failed', err?.response?.status || err?.message);
      setItems((list) => list.map((r) => (r.id === id ? { ...r, enabled: !enabled } : r)));
    });
  };
  return (
    <section
      aria-label={STREAK_PAGE_COPY.remindersTitle}
      className={classNames(CARD, 'flex flex-col gap-[10px] px-[20px] pb-[14px] pt-[16px]')}
    >
      <h2 className={TITLE_19}>{STREAK_PAGE_COPY.remindersTitle}</h2>
      {items.map((r) => (
        <div key={r.id} className="flex items-center gap-[10px] py-[4px]">
          <img src={iconBell} alt="" aria-hidden="true" className="size-[16px] shrink-0" />
          <span className="min-w-0 flex-1 font-sans text-[14px] font-medium leading-[17px] text-[#1c2a21]">
            {r.label}
          </span>
          {r.time ? (
            <span className="rounded-full bg-[#ebf1ec] px-[10px] py-[4px] font-sans text-[12.5px] font-semibold leading-[15px] text-[#2d5d33] playful:border playful:border-solid playful:border-[rgba(28,42,33,0.35)]">
              {r.time}
            </span>
          ) : null}
          <Toggle checked={r.enabled} onChange={() => flip(r.id)} label={r.label} />
        </div>
      ))}
    </section>
  );
};

/*
 * Leaderboard (Figma S-07). Live (`board` from GET /streak): opt-in only (US-7.1-12). Nobody is listed
 * until they join; joining is confirmed here first (what others will see), leaving is one tap.
 * Under-18s can't join yet (a parent's consent is needed first). Rank numbers only for the top half.
 */
export const StreakLeaderboardCard = (props) => {
  const board = props.board || null;
  const rows = props.rows;
  // Live: "Top streaks in <your community>" from the API; the drawn frame says Data Gang GH.
  const title = props.title ?? STREAK_PAGE_COPY.leaderboardTitle;
  const [optedIn, setOptedIn] = useState(Boolean(board?.optedIn));
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => setOptedIn(Boolean(board?.optedIn)), [board?.optedIn]);

  const save = async (next) => {
    setBusy(true);
    setError('');
    try {
      await setLeaderboardOptIn(next);
      setOptedIn(next);
      setConfirming(false);
      log('branch', { leaderboardOptIn: next });
      props.onChanged?.();
    } catch (err) {
      const type = err?.response?.data?.type;
      setError(
        type === 'LEADERBOARD_NEEDS_PARENTAL_CONSENT'
          ? 'Under-18s need a parent\u2019s OK to join leaderboards. That\u2019s coming soon.'
          : 'That didn\u2019t save. Please try again.'
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <section aria-label={title} className={classNames(CARD, 'flex flex-col gap-[6px] p-[20px]')}>
      <h2 className={classNames(TITLE_19, 'pb-[4px]')}>{title}</h2>
      {!rows.length ? (
        <p className="m-0 font-sans text-[13.5px] leading-[19px] text-[#595959]">
          No streaks here yet. Yours could be first.
        </p>
      ) : null}
      <ol className="m-0 flex list-none flex-col gap-[6px] p-0">
        {rows.map((row, i) => (
          <li
            key={row.you ? 'you' : `${row.name}-${i}`}
            className={classNames(
              'flex items-center gap-[10px] rounded-[14px] py-[8px] pl-[8px] pr-[10px]',
              row.you && 'border border-solid border-[#387440] bg-[#ebf1ec] playful:border-[1.2px]'
            )}
          >
            <span className="w-[10px] text-center font-sans text-[13px] font-bold leading-[16px] text-[#737373]">
              {row.rank ?? ''}
            </span>
            {row.avatar ? (
              <img
                src={row.avatar}
                alt=""
                className="size-[30px] shrink-0 rounded-full object-cover"
              />
            ) : (
              <span
                aria-hidden="true"
                className="flex size-[30px] shrink-0 items-center justify-center rounded-full bg-[#387440] font-sans text-[12px] font-bold leading-[14px] text-white"
              >
                {row.initial}
              </span>
            )}
            <span
              className={classNames(
                'min-w-0 flex-1 truncate font-sans text-[14px] leading-[17px] text-[#1c2a21]',
                row.you ? 'font-bold' : 'font-medium'
              )}
            >
              {row.name}
            </span>
            <span className="flex items-center gap-[4px] font-sans text-[13.5px] font-bold leading-[16px] text-[#1c2a21]">
              <img src={flameSm} alt="" aria-hidden="true" className="size-[14px]" />
              {row.days}
            </span>
          </li>
        ))}
      </ol>
      {board ? (
        <div className="flex flex-col gap-[8px] pt-[6px]">
          {board.notice ? (
            <p className="m-0 font-sans text-[13px] leading-[18px] text-[#595959]">
              {board.notice}
            </p>
          ) : null}
          {confirming ? (
            <div className="flex flex-col gap-[8px] rounded-[14px] bg-[#f6f8f6] p-[12px]">
              <p className="m-0 font-sans text-[13px] leading-[18px] text-[#1c2a21]">
                Members of {board.scope || 'your community'} will see your first name, last initial
                and streak. You can leave any time.
              </p>
              <div className="flex gap-[8px]">
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => save(true)}
                  className="rounded-full bg-[#387440] px-[14px] py-[6px] font-sans text-[13px] font-semibold text-white disabled:opacity-60"
                >
                  {busy ? 'Joining…' : 'Join'}
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => setConfirming(false)}
                  className="rounded-full border border-solid border-[#c9d6cb] bg-white px-[14px] py-[6px] font-sans text-[13px] font-semibold text-[#1c2a21]"
                >
                  Not now
                </button>
              </div>
            </div>
          ) : optedIn ? (
            <button
              type="button"
              disabled={busy}
              onClick={() => save(false)}
              className="self-start bg-transparent p-0 font-sans text-[13px] font-semibold text-[#387440] underline disabled:opacity-60"
            >
              {busy ? 'Leaving…' : 'Leave the leaderboard'}
            </button>
          ) : board.canOptIn ? (
            <button
              type="button"
              onClick={() => setConfirming(true)}
              className="self-start rounded-full border border-solid border-[#387440] bg-white px-[14px] py-[6px] font-sans text-[13px] font-semibold text-[#387440]"
            >
              Join the leaderboard
            </button>
          ) : (
            <p className="m-0 font-sans text-[13px] leading-[18px] text-[#595959]">
              Under-18s need a parent&rsquo;s OK to join leaderboards. That&rsquo;s coming soon.
            </p>
          )}
          {error ? (
            <p role="alert" className="m-0 font-sans text-[13px] leading-[18px] text-[#C4320A]">
              {error}
            </p>
          ) : null}
        </div>
      ) : null}
    </section>
  );
};
