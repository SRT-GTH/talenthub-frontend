import { classNames } from '../../../utils/classNames.js';
import ProfileStageCard from '../../cards/ProfileStageCard.jsx';
import { PROFILE_STAGES } from '../../../constants/profileStages.js';
import { debug } from '../../../utils/debug.js';

const log = debug('ProfileStagesList');

/*
 * ProfileStagesList — main column of the Profile Engagement page.
 * Source: Figma frame 3384:81936 ("Main") + 3384:81941 ("Frame 350").
 *
 *   ├─ kicker row    "YOUR 9 PROFILE STAGES" + horizontal divider
 *   ├─ headline      "Nine moves. Pick any order."
 *   ├─ helper copy   "Most people knock out 2-3, save, and come back…"
 *   └─ stage cards   ProfileStageCard × 9 (stacked vertically with gap-4)
 */

const ProfileStagesList = ({ onStageSelect, className }) => {
  log('render', { stageCount: PROFILE_STAGES.length });

  return (
    <section className={classNames('flex flex-col gap-6', className)}>
      <div className="flex items-center gap-3">
        <p className="font-sans font-semibold text-[10px] leading-3 tracking-[1px] uppercase text-neutral-darker shrink-0">
          Your 9 profile stages
        </p>
        <span className="flex-1 h-px bg-border-default" aria-hidden="true" />
      </div>

      <div className="flex flex-col gap-1">
        <h2 className="font-display text-[clamp(28px,3vw,36px)] leading-[1.05] tracking-[-0.5px] text-content-primary">
          Nine moves. Pick any order.
        </h2>
        <p className="font-sans text-[12px] leading-[18px] tracking-[0.2px] text-neutral-dark-hover">
          Most people knock out 2–3, save, and come back. The data flows together at the end.
        </p>
      </div>

      <ul className="flex flex-col gap-4" role="list">
        {PROFILE_STAGES.map((stage) => (
          <li key={stage.id}>
            <ProfileStageCard stage={stage} onSelect={onStageSelect} />
          </li>
        ))}
      </ul>
    </section>
  );
};

export default ProfileStagesList;
