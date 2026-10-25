import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { debug } from '../../../utils/debug.js';
import { classNames } from '../../../utils/classNames.js';
import {
  TalentHomeQuestBellIcon,
  TalentHomeQuestBulbIcon,
  TalentHomeQuestCheckWhiteIcon,
  TalentHomeQuestFireIcon,
  TalentHomeQuestHeartIcon,
} from '../../shared/assets.jsx';
import { saveStreakReminders } from '../../../services/streak.api.js';
import { reloadStreak, useLiveStreak } from '../talentStreak/useLiveStreak.js';
import { CARD_INK, DualPill, HEAD, Points } from './coreUi.jsx';
import { FIRST_QUESTS } from './talentHomeCoreData.js';

const log = debug('FirstQuestsCard');

const QUEST_ICON = {
  check: TalentHomeQuestCheckWhiteIcon,
  heart: TalentHomeQuestHeartIcon,
  bulb: TalentHomeQuestBulbIcon,
  bell: TalentHomeQuestBellIcon,
};

/*
 * Day 1 only ("Start a streak today"); later states fold quests into the streak card.
 *
 * 2026-10-25: the quests were a static picture (avatar always "Done", nothing tappable). On the live home:
 *   - avatar / interests / personality quiz are done when their journey stage is (home.snapshot.stages,
 *     GET /profiles/journey), and a tap opens that stage;
 *   - streak reminders are done when the daily nudge is on (GET /streak). A tap turns it on
 *     (PUT /streak/reminders) and rolls back if the save fails; once on, a tap opens /streak to manage it.
 * The Figma demo states (?state=day1, no live data) keep the designed values.
 */
const FirstQuestsCard = ({ home }) => {
  const navigate = useNavigate();
  const live = Boolean(home.snapshot?.live);
  const streak = useLiveStreak({ enabled: live && home.stateKey === 'day1' });
  const [reminderSaving, setReminderSaving] = useState(false);
  const [reminderOverride, setReminderOverride] = useState(null);
  log('render', { state: home.stateKey, live });
  if (home.stateKey !== 'day1') return null;

  const stageDone = Object.fromEntries((home.snapshot?.stages || []).map((s) => [s.id, Boolean(s.done)]));
  const dailyOn =
    reminderOverride ??
    Boolean((streak.data?.reminders || []).find((r) => r.id === 'daily')?.enabled);

  const isDone = (q) => {
    if (!live) return Boolean(q.done);
    if (q.id === 'reminders') return dailyOn;
    return Boolean(stageDone[q.stage]);
  };

  const turnOnReminders = () => {
    if (reminderSaving) return;
    log('reminders on');
    setReminderSaving(true);
    setReminderOverride(true);
    saveStreakReminders({ daily: { enabled: true } })
      .then(() => reloadStreak().catch(() => {}))
      .then(() => setReminderOverride(null))
      .catch((err) => {
        log.error('reminders save failed', err?.response?.status || err?.message);
        setReminderOverride(false);
      })
      .finally(() => setReminderSaving(false));
  };

  const open = (q) => {
    log('quest', { id: q.id, done: isDone(q) });
    if (q.id === 'reminders' && live && !dailyOn) {
      turnOnReminders();
      return;
    }
    if (q.route) navigate(q.route);
  };

  return (
    <section
      aria-label={FIRST_QUESTS.title}
      className={classNames(
        'flex min-w-0 flex-col gap-[14px] rounded-[24px] bg-white p-[clamp(14px,1.6vw,22px)]',
        CARD_INK
      )}
    >
      <div className="flex items-center gap-[12px]">
        <span
          aria-hidden="true"
          className="flex size-[44px] shrink-0 items-center justify-center rounded-[14px] bg-[#fff1e6]"
        >
          <TalentHomeQuestFireIcon className="size-[26px]" />
        </span>
        <span className="flex min-w-0 flex-col gap-[2px]">
          <h2
            className={classNames(
              HEAD,
              'text-[clamp(17px,1.1vw,19px)] leading-[1.25] text-[#1c2a21]'
            )}
          >
            {FIRST_QUESTS.title}
          </h2>
          <p className="text-[13px] leading-[normal] text-[#595959]">{FIRST_QUESTS.sub}</p>
        </span>
      </div>
      <ul className="m-0 flex list-none flex-col gap-[14px] p-0">
        {FIRST_QUESTS.quests.map((q) => {
          const done = isDone(q);
          const Icon = done ? QUEST_ICON.check : QUEST_ICON[q.icon];
          const meta =
            q.id === 'reminders'
              ? reminderSaving
                ? 'Turning on…'
                : done
                  ? q.metaOn
                  : q.meta
              : done
                ? 'Done'
                : q.meta;
          return (
            <li key={q.id}>
              <button
                type="button"
                onClick={() => open(q)}
                disabled={q.id === 'reminders' && reminderSaving}
                aria-label={`${q.title}${done ? ' (done)' : ''}`}
                className={classNames(
                  'flex w-full cursor-pointer items-center gap-[12px] rounded-[14px] border px-[14px] py-[12px] text-left font-sans',
                  'transition-colors hover:border-[#387440] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#387440]',
                  done ? 'border-[#bfdccb] bg-[#e8f2ed]' : 'border-[#e7e7e7] bg-white'
                )}
              >
                <span
                  aria-hidden="true"
                  className={classNames(
                    'flex size-[32px] shrink-0 items-center justify-center rounded-[10px]',
                    done ? 'bg-[#387440]' : 'bg-[#ebf1ec]'
                  )}
                >
                  <Icon className="size-[16px]" />
                </span>
                <span className="flex min-w-0 flex-1 flex-col gap-px leading-[normal]">
                  <span className="truncate text-[14px] font-semibold text-[#1c2a21]">{q.title}</span>
                  <span className="text-[12px] text-[#595959]">{meta}</span>
                </span>
                <DualPill focused={done ? 'white' : 'amber'} playful="white">
                  <Points n={q.pts} />
                </DualPill>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default FirstQuestsCard;
