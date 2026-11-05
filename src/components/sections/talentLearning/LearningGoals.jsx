import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { debug } from '../../../utils/debug.js';
import { classNames } from '../../../utils/classNames.js';
import Button from '../../ui/Button.jsx';
import {
  deleteMyLearning,
  exportMyLearning,
  fetchAgenda,
  fetchGoals,
  setMyTracking,
  setGoalStatus,
  setPrimaryGoal,
  apiErrorOf,
} from '../../../services/learningPath.api.js';
import { BackRow, CARD_SOFT, FOCUS, HEAD } from './CourseUi.jsx';

const log = debug('LearningGoals');

/*
 * LearningGoals — `/learning?view=goals` (learning path iteration 4, part B).
 * "This week" across every active goal (shared steps once, primary goal first), then each career
 * goal with its progress and next step: make it your main goal, pause / resume, mark achieved.
 * Active goals are capped (platformConfig learningPath.maxActiveGoals, default 5); resuming past the
 * cap says which goals are active so the talent can pause one.
 */
const STATUS_LABEL = {
  active: 'Active',
  paused: 'Paused',
  achieved: 'Achieved',
  archived: 'Archived',
};

/** A step's link: course steps open the course page; others keep the path's own link. */
const stepHref = (step) => step?.ctaUrl || '/learning?view=explore';

export const ThisWeekList = ({ agenda, compact = false }) => {
  const items = agenda?.items || [];
  if (!items.length) {
    return (
      <p className="m-0 text-[14.5px] text-[#595959]">
        Nothing open this week. Ask Career Buddy for a learning path toward a career you want.
      </p>
    );
  }
  return (
    <ol className="m-0 flex list-none flex-col gap-[6px] p-0">
      {items.slice(0, compact ? 3 : items.length).map((it) => (
        <li key={it.itemKey}>
          <Link
            to={stepHref(it)}
            className={classNames(
              'flex items-center gap-[12px] rounded-[14px] bg-white px-[12px] py-[10px] no-underline hover:bg-[#f8f8f4]',
              FOCUS
            )}
          >
            <span className="flex min-w-0 flex-1 flex-col gap-[2px]">
              <span className="truncate text-[15px] font-semibold text-[#1c2a21]">{it.title}</span>
              <span className="truncate text-[12.5px] text-[#737373]">
                {it.goals?.length > 1
                  ? `Helps ${it.goals.length} goals: ${it.goals.join(', ')}`
                  : it.goals?.[0]}
              </span>
            </span>
            {(it.status === 'clicked_out' || it.status === 'in_progress') && (
              <span className="shrink-0 rounded-full bg-[#faf4e8] px-[10px] py-[4px] text-[12px] font-bold text-[#967014]">
                Started
              </span>
            )}
          </Link>
        </li>
      ))}
    </ol>
  );
};

const ProgressBar = ({ pct }) => (
  <div className="h-[8px] w-full overflow-hidden rounded-full bg-[#e1eae2]" aria-hidden="true">
    <div
      className="h-full rounded-full bg-[#387440]"
      style={{ width: `${Math.max(0, Math.min(100, pct || 0))}%` }}
    />
  </div>
);

/** The talent's own learning data: download it, delete it, switch tracking off (design note C4). */
const MyLearningData = () => {
  const [msg, setMsg] = useState(null);
  const [confirming, setConfirming] = useState(false);
  const run = async (fn, done) => {
    try {
      const r = await fn();
      setMsg(done(r));
    } catch (err) {
      setMsg(apiErrorOf(err).message);
    }
  };
  const download = () =>
    run(exportMyLearning, (data) => {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'gth-learning-data.json';
      a.click();
      URL.revokeObjectURL(url);
      return 'Downloaded.';
    });
  return (
    <section className={classNames('flex flex-col gap-[10px] rounded-[22px] p-[18px]', CARD_SOFT)}>
      <h2 className={classNames(HEAD, 'm-0 text-[17px] text-[#1c2a21]')}>Your learning data</h2>
      <p className="m-0 text-[13px] leading-[1.45] text-[#595959]">
        What GTH keeps: courses you opened or finished, how much of GTH-played videos you watched,
        and your short-check results. Course providers never get your name or contact details.
      </p>
      <div className="flex flex-wrap gap-[8px]">
        <Button variant="tertiary" size="sm" onClick={download}>
          Download my learning data
        </Button>
        <Button
          variant="tertiary-cream"
          size="sm"
          onClick={() =>
            run(
              () => setMyTracking(false),
              () => 'Progress tracking is off.'
            )
          }
        >
          Switch tracking off
        </Button>
        <Button
          variant="tertiary-cream"
          size="sm"
          onClick={() =>
            run(
              () => setMyTracking(true),
              () => 'Progress tracking is on.'
            )
          }
        >
          Switch tracking on
        </Button>
        {confirming ? (
          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              setConfirming(false);
              run(deleteMyLearning, (r) => `Deleted ${r?.deleted ?? 0} records.`);
            }}
          >
            Yes, delete it all
          </Button>
        ) : (
          <Button variant="tertiary-cream" size="sm" onClick={() => setConfirming(true)}>
            Delete my learning data
          </Button>
        )}
      </div>
      {msg && (
        <p className="m-0 text-[13px] text-[#2d5d33]" role="status">
          {msg}
        </p>
      )}
    </section>
  );
};

const LearningGoals = ({ learning }) => {
  const [goals, setGoals] = useState(null);
  const [agenda, setAgenda] = useState(null);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);
  const [busy, setBusy] = useState(null);

  const load = useCallback(async () => {
    try {
      const [g, a] = await Promise.all([fetchGoals(), fetchAgenda(6)]);
      setGoals(g);
      setAgenda(a);
      log('loaded', { goals: g?.goals?.length, week: a?.items?.length });
    } catch (err) {
      setError(apiErrorOf(err).message);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const act = async (career, action) => {
    setBusy(`${career}:${action}`);
    setNotice(null);
    try {
      if (action === 'primary') await setPrimaryGoal(career);
      else await setGoalStatus(career, action);
      await load();
    } catch (err) {
      const e = apiErrorOf(err);
      if (e.type === 'GOAL_CAP_REACHED') {
        const active = e.data?.active || [];
        setNotice(
          `You can have ${e.data?.maxActiveGoals || 'a few'} active goals at a time. Pause one of these first: ${active.join(', ')}.`
        );
      } else setNotice(e.message);
    } finally {
      setBusy(null);
    }
  };

  const list = goals?.goals || [];

  return (
    <section
      data-testid="learning-goals"
      className="flex min-w-0 flex-col gap-[clamp(14px,1.39vw,24px)]"
    >
      <BackRow
        label="My Learning"
        crumb="·  Career goals"
        onClick={() => learning.update({ view: null })}
      />
      <h1
        className={classNames(
          HEAD,
          'm-0 text-[clamp(26px,2.1vw,36px)] leading-[1.1] text-[#1c2a21]'
        )}
      >
        Your career goals
      </h1>

      <section
        className={classNames(
          'flex flex-col gap-[12px] rounded-[22px] bg-[#ebf1ec] p-[clamp(14px,1.27vw,22px)]'
        )}
      >
        <h2 className={classNames(HEAD, 'm-0 text-[clamp(18px,1.27vw,22px)] text-[#1c2a21]')}>
          This week
        </h2>
        {agenda ? (
          <ThisWeekList agenda={agenda} />
        ) : (
          <p className="m-0 text-[14px] text-[#595959]">Loading…</p>
        )}
        {agenda?.askAbout?.length > 0 && (
          <p className="m-0 text-[13.5px] text-[#2d5d33]">
            {agenda.askAbout.length === 1 ? 'One course' : `${agenda.askAbout.length} courses`} you
            opened earlier —{' '}
            <Link
              to={`/learning?view=course&course=${agenda.askAbout[0].courseId}`}
              className="font-semibold text-[#2d5d33]"
            >
              did you finish?
            </Link>
          </p>
        )}
      </section>

      {notice && (
        <p
          className="m-0 rounded-[14px] bg-[#faf4e8] px-[14px] py-[10px] text-[14px] text-[#5c4510]"
          role="status"
        >
          {notice}
        </p>
      )}
      {error && (
        <p className="m-0 text-[14px] text-[#9a3b2f]" role="alert">
          {error}
        </p>
      )}

      {goals && (
        <p className="m-0 text-[13px] text-[#737373]">
          {goals.activeCount} of {goals.maxActiveGoals} active goals
        </p>
      )}
      <ul className="m-0 grid list-none grid-cols-1 gap-[14px] p-0 lg:grid-cols-2">
        {list.map((g) => (
          <li
            key={g.targetCareer}
            className={classNames('flex flex-col gap-[10px] rounded-[22px] p-[18px]', CARD_SOFT)}
          >
            <div className="flex flex-wrap items-center gap-[8px]">
              <h3 className={classNames(HEAD, 'm-0 min-w-0 flex-1 text-[19px] text-[#1c2a21]')}>
                {g.targetCareer}
              </h3>
              {g.isPrimary && (
                <span className="rounded-full bg-[#ffd86b] px-[10px] py-[3px] text-[12px] font-bold text-[#1c2a21]">
                  Main goal
                </span>
              )}
              <span className="rounded-full bg-[#f8f8f4] px-[10px] py-[3px] text-[12px] font-bold text-[#595959]">
                {STATUS_LABEL[g.status] || g.status}
              </span>
            </div>
            <ProgressBar pct={g.progress?.pct} />
            <p className="m-0 text-[13px] text-[#595959]">
              {g.progress?.done || 0} of {g.progress?.total || 0} steps done
            </p>
            {g.nextStep && g.status === 'active' && (
              <Link to={stepHref(g.nextStep)} className="text-[14px] font-semibold text-[#2d5d33]">
                Next: {g.nextStep.title}
              </Link>
            )}
            <div className="flex flex-wrap gap-[8px]">
              {g.status === 'active' && !g.isPrimary && (
                <Button
                  variant="tertiary"
                  size="sm"
                  onClick={() => act(g.targetCareer, 'primary')}
                  disabled={Boolean(busy)}
                >
                  Make main goal
                </Button>
              )}
              {g.status === 'active' ? (
                <Button
                  variant="tertiary-cream"
                  size="sm"
                  onClick={() => act(g.targetCareer, 'paused')}
                  disabled={Boolean(busy)}
                >
                  Pause
                </Button>
              ) : (
                <Button
                  variant="tertiary"
                  size="sm"
                  onClick={() => act(g.targetCareer, 'active')}
                  disabled={Boolean(busy)}
                >
                  Resume
                </Button>
              )}
              {g.status !== 'achieved' && (
                <Button
                  variant="tertiary-subtle"
                  size="sm"
                  onClick={() => act(g.targetCareer, 'achieved')}
                  disabled={Boolean(busy)}
                >
                  I got there
                </Button>
              )}
            </div>
          </li>
        ))}
      </ul>
      <MyLearningData />
      {goals && !list.length && (
        <p className="m-0 text-[14.5px] text-[#595959]">
          No career goals yet. Ask Career Buddy for a learning path toward a career, and it shows up
          here.
        </p>
      )}
    </section>
  );
};

export default LearningGoals;
