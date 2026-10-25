import RecordCard from './RecordCard.jsx';
import RecordChip from './RecordChip.jsx';
import RecordIcon from './RecordIcon.jsx';
import { RecordsIconCheck13 } from './recordsIcons.jsx';

/* RecordSkillsCard — "Top skills" (Figma 8593:727): 2 x 2 skill tiles (icon, name, Assessed / Skills Lab / Endorsed chip, 6px meter, note). Props: detail. */
const RecordSkillsCard = ({ detail }) => (
  <RecordCard id="record-skills" title="Top skills" link="See all 7 →">
    <ul className="m-0 grid list-none grid-cols-1 gap-[12px] p-0 md:grid-cols-2">
      {detail.skills.map((s) => (
        <li
          key={s.id}
          className="flex gap-[12px] rounded-[16px] border border-solid border-[#e6e6e6] bg-white p-[14px]"
        >
          <span className="flex size-[40px] shrink-0 items-center justify-center self-center rounded-[12px] bg-[#f8f8f4] text-[#1c2a21]">
            <RecordIcon name={s.icon} size="skill" className="size-[21px]" />
          </span>
          <div className="flex min-w-0 flex-1 flex-col gap-[6px]">
            <div className="flex flex-wrap items-center gap-[8px]">
              <span className="text-[15px] leading-[18px] font-semibold text-[#1c2a21]">
                {s.name}
              </span>
              <RecordChip
                tone={s.strong ? 'green' : 'plain'}
                icon={<RecordsIconCheck13 className="size-full" />}
              >
                {s.badge}
              </RecordChip>
            </div>
            <div
              role="img"
              aria-label={`${s.name}: ${s.note}`}
              className="h-[6px] max-w-[300px] rounded-full bg-[#e1eae2]"
            >
              <div
                className="h-full rounded-full bg-[#387440]"
                style={{ width: `${Math.round((s.fill / 300) * 100)}%` }}
              />
            </div>
            <span className="text-[12px] leading-[14px] text-[#737373]">{s.note}</span>
          </div>
        </li>
      ))}
    </ul>
  </RecordCard>
);

export default RecordSkillsCard;
