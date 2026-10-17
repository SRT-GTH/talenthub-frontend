import { debug } from '../../../utils/debug.js';
import { classNames } from '../../../utils/classNames.js';
import {
  TalentHomeQuestBellIcon,
  TalentHomeQuestBulbIcon,
  TalentHomeQuestCheckWhiteIcon,
  TalentHomeQuestFireIcon,
  TalentHomeQuestHeartIcon,
} from '../../shared/assets.jsx';
import { CARD_INK, DualPill, HEAD, Points } from './coreUi.jsx';
import { FIRST_QUESTS } from './talentHomeCoreData.js';

const log = debug('FirstQuestsCard');

const QUEST_ICON = {
  check: TalentHomeQuestCheckWhiteIcon,
  heart: TalentHomeQuestHeartIcon,
  bulb: TalentHomeQuestBulbIcon,
  bell: TalentHomeQuestBellIcon,
};

// Day 1 only ("Start a streak today"); later states fold quests into the streak card.
const FirstQuestsCard = ({ home }) => {
  log('render', { state: home.stateKey });
  if (home.stateKey !== 'day1') return null;
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
          const Icon = QUEST_ICON[q.icon];
          return (
            <li
              key={q.id}
              className={classNames(
                'flex items-center gap-[12px] rounded-[14px] border px-[14px] py-[12px]',
                q.done ? 'border-[#bfdccb] bg-[#e8f2ed]' : 'border-[#e7e7e7] bg-white'
              )}
            >
              <span
                aria-hidden="true"
                className={classNames(
                  'flex size-[32px] shrink-0 items-center justify-center rounded-[10px]',
                  q.done ? 'bg-[#387440]' : 'bg-[#ebf1ec]'
                )}
              >
                <Icon className="size-[16px]" />
              </span>
              <span className="flex min-w-0 flex-1 flex-col gap-px leading-[normal]">
                <span className="truncate text-[14px] font-semibold text-[#1c2a21]">{q.title}</span>
                <span className="text-[12px] text-[#595959]">{q.meta}</span>
              </span>
              <DualPill focused={q.done ? 'white' : 'amber'} playful="white">
                <Points n={q.pts} />
              </DualPill>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default FirstQuestsCard;
