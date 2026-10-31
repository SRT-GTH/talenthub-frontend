import { useEffect, useState } from 'react';
import { debug } from '../../../utils/debug.js';
import { classNames } from '../../../utils/classNames.js';
import { fetchAgenda } from '../../../services/learningPath.api.js';
import { FOCUS, HEAD } from './CourseUi.jsx';
import { ThisWeekList } from './LearningGoals.jsx';

const log = debug('LearningThisWeek');

/*
 * LearningThisWeek — the "This week" strip on My Learning (live only): the top steps across the
 * talent's active career goals, with a link to the goals screen. Hidden when there are no goals.
 */
const LearningThisWeek = ({ learning }) => {
  const [agenda, setAgenda] = useState(null);
  useEffect(() => {
    let alive = true;
    fetchAgenda(3)
      .then((a) => alive && setAgenda(a))
      .catch((err) => log.error('agenda failed:', err?.response?.status || err?.message));
    return () => {
      alive = false;
    };
  }, []);
  if (!agenda || !(agenda.goals || []).length) return null;
  return (
    <section
      data-testid="learning-this-week"
      className="flex flex-col gap-[10px] rounded-[22px] bg-[#ebf1ec] p-[clamp(14px,1.27vw,20px)]"
    >
      <div className="flex items-center gap-[8px]">
        <h2
          className={classNames(
            HEAD,
            'm-0 min-w-0 flex-1 text-[clamp(17px,1.2vw,20px)] text-[#1c2a21]'
          )}
        >
          This week
        </h2>
        <button
          type="button"
          onClick={() => learning.update({ view: 'goals', tab: null })}
          className={classNames(
            'shrink-0 cursor-pointer text-[13.5px] font-semibold text-[#2d5d33]',
            FOCUS
          )}
        >
          Your career goals →
        </button>
      </div>
      <ThisWeekList agenda={agenda} compact />
    </section>
  );
};

export default LearningThisWeek;
