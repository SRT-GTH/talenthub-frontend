import { debug } from '../../../../utils/debug.js';
import InterestCard from './InterestCard.jsx';
import RailCard from './InterestsRail.jsx';
import { AREA_BY_ID, ROLE_MATCHES, ROLE_MATCH_TOTAL, UNLOCK_SPECIFICS } from './interestsData.js';
import { CARD, CHIP_LINE, FOCUS_RING, HEADING_FONT } from './interestsStyles.js';
import * as Icons from './interestsIcons.jsx';

const log = debug('AreasList');

/*
 * AreasList (IN-02..IN-05 left column): "Your interests" header + "N areas" chip, one InterestCard per area, the dashed-green
 * "Add another area" row and the "Roles matching your interests right now" card.
 * Props: areas [{id,specifics}], openId, onToggleOpen(id), onAddSpecific(id,text), onRemoveSpecific(id,text), onAddArea.
 */
const AreasList = ({ areas, openId, onToggleOpen, onAddSpecific, onRemoveSpecific, onAddArea }) => (
  <div className="flex flex-col gap-5">
    <div className="flex items-center gap-3">
      <h2
        className={`m-0 text-[clamp(24px,1.68vw,29px)] font-semibold leading-[1.207] text-[#1c2a21] ${HEADING_FONT}`}
      >
        Your interests
      </h2>
      <span
        className={`inline-flex items-center rounded-full bg-[#f7f8f4] px-[10px] py-[4px] font-sans text-[12px] font-semibold leading-[14px] text-[#595959] ${CHIP_LINE}`}
      >
        {areas.length} areas
      </span>
    </div>
    {areas.map((a, i) => (
      <InterestCard
        key={a.id}
        area={AREA_BY_ID[a.id]}
        specifics={a.specifics}
        primary={i === 0}
        open={openId === a.id}
        onToggle={() => onToggleOpen(a.id)}
        onAddSpecific={(t) => onAddSpecific(a.id, t)}
        onRemoveSpecific={(t) => onRemoveSpecific(a.id, t)}
      />
    ))}
    <button
      type="button"
      onClick={() => {
        log('add another area');
        onAddArea();
      }}
      className={`flex min-h-[68px] w-full cursor-pointer items-center justify-center gap-2 rounded-[20px] border-[1px] border-solid border-[#387440] bg-[#ebf1ec] px-5 py-6 font-sans text-[15px] font-semibold leading-[18px] text-[#387440] playful:border-[1.5px] ${FOCUS_RING}`}
    >
      <span className="text-[18px]">
        <Icons.PlusIcon />
      </span>
      Add another area
    </button>
    <section
      aria-labelledby="in-roles-title"
      className={`flex flex-col gap-3 px-6 py-[22px] ${CARD}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-[18px] text-[#387440]">
            <Icons.TargetIcon />
          </span>
          <h3
            id="in-roles-title"
            className="m-0 font-sans text-[16px] font-semibold leading-[19px] text-[#1c2a21]"
          >
            Roles matching your interests right now
          </h3>
        </div>
        <button
          type="button"
          onClick={() => log('see all roles (destination not drawn in Figma)')}
          className={`min-h-[24px] cursor-pointer border-0 bg-transparent p-0 font-sans text-[13px] font-semibold leading-[16px] text-[#387440] max-lg:text-[12px] ${FOCUS_RING}`}
        >
          See all {ROLE_MATCH_TOTAL} in Opportunities
        </button>
      </div>
      <ul className="m-0 grid list-none grid-cols-1 gap-3 p-0 md:grid-cols-3">
        {ROLE_MATCHES.map((r) => (
          <li
            key={r.id}
            className="flex items-center gap-[10px] rounded-[14px] border border-solid border-[#e7e7e7] bg-[#f7f8f4] py-3 pr-[14px] pl-3"
          >
            <span className="grid size-[36px] shrink-0 place-items-center rounded-[10px] border border-solid border-[#e7e7e7] bg-white text-[18px] text-[#387440]">
              <Icons.CompanyIcon />
            </span>
            <span className="flex min-w-0 flex-1 flex-col gap-px">
              <span className="font-sans text-[14px] font-semibold leading-[17px] text-[#1c2a21]">
                {r.title}
              </span>
              <span className="font-sans text-[12px] leading-[14px] text-[#595959]">
                {r.company}
              </span>
            </span>
            <span className="inline-flex h-[32px] shrink-0 items-center rounded-full border border-solid border-[#e1eae2] bg-white px-[14px] font-sans text-[13px] font-semibold leading-[16px] text-[#595959] max-lg:text-[12px]">
              {r.match}
            </span>
          </li>
        ))}
      </ul>
    </section>
  </div>
);

/*
 * MentorRail: "Mentor matching" rail card with the 8px progress bar ("N of 6 specifics · add M more to unlock").
 * Props: specificsCount.
 */
export const MentorRail = ({ specificsCount }) => {
  const pct = Math.min(1, specificsCount / UNLOCK_SPECIFICS) * 100;
  const left = UNLOCK_SPECIFICS - specificsCount;
  return (
    <RailCard
      title="Mentor matching"
      gapClass="gap-[14px]"
      rows={[
        {
          icon: 'Users',
          title: 'Meet people in your niche',
          body: 'With 6 specifics, we suggest mentors who work in the same areas.',
        },
      ]}
    >
      <div className="flex flex-col gap-[6px]">
        <div
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={UNLOCK_SPECIFICS}
          aria-valuenow={Math.min(specificsCount, UNLOCK_SPECIFICS)}
          aria-label="Specifics added"
          className="h-[8px] w-full overflow-hidden rounded-[4px] bg-[#eeeeea]"
        >
          <div className="h-full rounded-[4px] bg-[#387440]" style={{ width: `${pct}%` }} />
        </div>
        <p className="m-0 font-sans text-[12px] font-semibold leading-[14px] text-[#785910]">
          {specificsCount} of {UNLOCK_SPECIFICS} specifics
          {left > 0 ? ` · add ${left} more to unlock` : ''}
        </p>
      </div>
    </RailCard>
  );
};

export default AreasList;
