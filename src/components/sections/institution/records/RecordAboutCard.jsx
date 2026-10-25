import RecordCard from './RecordCard.jsx';
import RecordChip from './RecordChip.jsx';
import RecordIcon from './RecordIcon.jsx';

/* RecordAboutCard — "About" (Figma 8593:715): 15/23 text + the "My vibe" chips. Props: detail. */
const RecordAboutCard = ({ detail }) => (
  <RecordCard id="record-about" title="About" link="Read more →">
    <p className="m-0 text-[15px] leading-[23px] text-[#1c2a21]">{detail.about}</p>
    <div className="flex flex-wrap items-center gap-[8px]">
      <span className="pr-[2px] text-[12px] leading-[14px] font-semibold text-[#737373]">
        My vibe
      </span>
      {detail.vibe.map((v) => (
        <RecordChip key={v.id} icon={<RecordIcon name={v.icon} size="chip" />}>
          {v.label}
        </RecordChip>
      ))}
    </div>
  </RecordCard>
);

export default RecordAboutCard;
