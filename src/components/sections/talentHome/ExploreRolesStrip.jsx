import { debug } from '../../../utils/debug.js';
import { classNames } from '../../../utils/classNames.js';
import { TalentHomeExploreCompassIcon, TalentHomePlusIcon } from '../../shared/assets.jsx';
import { CARD_DASHED, Chip } from './coreUi.jsx';
import { CORE_CONTENT, EXPLORE } from './talentHomeCoreData.js';

const log = debug('ExploreRolesStrip');

// Day 1: "Just want to look around first?" strip. Complete / Top Talent: "Customize home" strip.
const ExploreRolesStrip = ({ home }) => {
  log('render', { state: home.stateKey });
  if (home.stateKey === 'day1') {
    return (
      <div className="flex flex-wrap items-center justify-center gap-x-[12px] gap-y-[10px] rounded-[18px] bg-[#f7f8f4] px-[20px] py-[16px]">
        <p className="text-[14px] leading-[normal] text-[#595959]">{EXPLORE.text}</p>
        <Chip
          as="button"
          type="button"
          tone="green"
          icon={<TalentHomeExploreCompassIcon className="size-[14px]" />}
          onClick={() => log('explore roles')}
        >
          {EXPLORE.chip}
        </Chip>
      </div>
    );
  }
  if ((home.stateKey === 'complete' || home.stateKey === 'top') && !home.editOpen) {
    const { customize } = CORE_CONTENT[home.stateKey];
    return (
      <div
        className={classNames(
          'flex flex-wrap items-center justify-center gap-[8px] rounded-[20px] px-[20px] py-[24px]',
          CARD_DASHED
        )}
      >
        <TalentHomePlusIcon className="size-[16px]" />
        <p className="text-[14px] leading-[normal] font-medium text-[#595959]">{customize.text}</p>
        <button
          type="button"
          onClick={() => home.update({ edit: true })}
          className="cursor-pointer text-[14px] leading-[normal] font-semibold text-[#387440] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
        >
          {customize.link}
        </button>
      </div>
    );
  }
  return null;
};

export default ExploreRolesStrip;
