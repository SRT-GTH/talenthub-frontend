import { classNames } from '../../../../utils/classNames.js';
import RecordCard from './RecordCard.jsx';
import RecordChip from './RecordChip.jsx';
import RecordIcon from './RecordIcon.jsx';

/* RecordExperienceCard — "Experience" (Figma 8593:773): 48px icon tile (blue / cream, 1.5px #1c2a21), role 16/600, meta 13, body 14, tag chips, a #e6e6e6 divider between entries. Props: detail. */
const RecordExperienceCard = ({ detail }) => (
  <RecordCard id="record-experience" title="Experience" link="See all 2 →">
    <ul className="m-0 flex list-none flex-col gap-[16px] p-0">
      {detail.experience.map((e, i) => (
        <li
          key={e.id}
          className={classNames(
            'flex gap-[16px]',
            i > 0 && 'border-0 border-t border-solid border-[#e6e6e6] pt-[16px]'
          )}
        >
          <span
            className={classNames(
              'flex size-[48px] shrink-0 items-center justify-center rounded-[14px] border-[1.5px] border-solid border-[#1c2a21] text-[#1c2a21]',
              e.tone === 'blue' ? 'bg-[#eaeffb]' : 'bg-[#faf4e8]'
            )}
          >
            <RecordIcon name={e.icon} size="exp" className="size-[23px]" />
          </span>
          <div className="flex min-w-0 flex-col gap-[4px]">
            <h3 className="m-0 text-[16px] leading-[19px] font-semibold text-[#1c2a21]">
              {e.role}
            </h3>
            <p className="m-0 text-[13px] leading-[16px] text-[#737373]">{e.meta}</p>
            <p className="m-0 text-[14px] leading-[17px] text-[#595959]">{e.body}</p>
            <div className="flex flex-wrap gap-[6px] pt-[6px]">
              {e.tags.map((t) => (
                <RecordChip key={t}>{t}</RecordChip>
              ))}
            </div>
          </div>
        </li>
      ))}
    </ul>
  </RecordCard>
);

export default RecordExperienceCard;
