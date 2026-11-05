import { useEffect, useState } from 'react';
import { debug } from '../../../../utils/debug.js';
import {
  fetchWardLearningSettings,
  setWardLearningSetting,
  apiErrorOf,
} from '../../../../services/learningPath.api.js';

const log = debug('WardLearningSettings');

/*
 * WardLearningSettings — a parent's learning switches for a ward under 18 (learning path iteration 4,
 * design note C4 / Ghana Data Protection Act s.37). Live only, on the ward Overview.
 *   Progress tracking   GTH notes video watch time and course click-outs (off until switched on)
 *   Paid courses        paid courses appear in the ward's Learning Hub and paths (hidden until on)
 * The backend checks the parent-ward link and records each change as a consent record.
 */
const CARD =
  'rounded-[24px] border border-solid border-[#e7e7e7] bg-white p-[22px] shadow-[0_5px_8.5px_rgba(28,42,33,0.03)]';

const ROWS = [
  {
    key: 'learning_progress_tracking',
    field: 'tracking',
    title: 'Progress tracking',
    on: 'GTH notes how much of each course video they watch and which courses they open.',
    off: 'Off. They can still say when they finish a course or take a short check.',
  },
  {
    key: 'paid_courses_minor',
    field: 'paidCourses',
    title: 'Paid courses',
    on: 'Paid courses can appear in their Learning Hub and learning paths.',
    off: 'Off. They only see free courses.',
  },
];

const Switch = ({ checked, onChange, disabled, label }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    disabled={disabled}
    onClick={() => onChange(!checked)}
    className={`relative h-[28px] w-[48px] shrink-0 cursor-pointer rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440] ${
      checked ? 'bg-[#387440]' : 'bg-[#c9c9c4]'
    }`}
  >
    <span
      className={`absolute top-[3px] size-[22px] rounded-full bg-white shadow transition-[left] ${checked ? 'left-[23px]' : 'left-[3px]'}`}
    />
  </button>
);

const WardLearningSettings = ({ wardId, firstName }) => {
  const [state, setState] = useState(null);
  const [busy, setBusy] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    fetchWardLearningSettings(wardId)
      .then((s) => alive && setState(s))
      .catch((err) => alive && setError(apiErrorOf(err).message));
    return () => {
      alive = false;
    };
  }, [wardId]);

  // Adults manage their own settings; the card only shows for wards under 18.
  if (state && state.ageBand === 'adult') return null;

  const toggle = async (row, allow) => {
    setBusy(row.key);
    setError(null);
    try {
      await setWardLearningSetting(wardId, row.key, allow);
      setState((s) => ({ ...s, [row.field]: allow }));
      log('switched', { setting: row.key, allow });
    } catch (err) {
      setError(apiErrorOf(err).message);
    } finally {
      setBusy(null);
    }
  };

  return (
    <section data-testid="ward-learning-settings" className={`flex flex-col gap-[14px] ${CARD}`}>
      <h3 className="m-0 font-sans text-[18px] leading-normal font-semibold text-[#1c2a21]">
        Learning settings{firstName ? ` for ${firstName}` : ''}
      </h3>
      {!state && !error && <p className="m-0 font-sans text-[13px] text-[#575755]">Loading…</p>}
      {state &&
        ROWS.map((row) => {
          const on = Boolean(state[row.field]);
          return (
            <div key={row.key} className="flex items-start gap-[14px]">
              <div className="flex min-w-0 flex-1 flex-col gap-[2px]">
                <p className="m-0 font-sans text-[15px] font-semibold text-[#1c2a21]">
                  {row.title}
                </p>
                <p className="m-0 font-sans text-[13px] leading-normal text-[#575755]">
                  {on ? row.on : row.off}
                </p>
              </div>
              <Switch
                checked={on}
                disabled={busy === row.key}
                label={row.title}
                onChange={(v) => toggle(row, v)}
              />
            </div>
          );
        })}
      <p className="m-0 font-sans text-[12px] leading-normal text-[#737373]">
        Videos made for children are never tracked. Course providers never get{' '}
        {firstName ? `${firstName}’s` : 'their'} name or contact details.
      </p>
      {error && (
        <p className="m-0 font-sans text-[13px] text-[#9a3b2f]" role="alert">
          {error}
        </p>
      )}
    </section>
  );
};

export default WardLearningSettings;
