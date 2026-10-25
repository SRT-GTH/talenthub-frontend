import PublicCard from '../../publicData/ui/PublicCard.jsx';

/* AgencyPublicProgrammesCard — "Programmes on GTH" (Figma 8611:3584): rows py14 with a 1px #e7e7e7 divider, title 16/600, summary 14 #595959, status 13/600 #387440. */
const AgencyPublicProgrammesCard = ({ programmes }) => (
  <PublicCard title={programmes.title} hint={programmes.hint}>
    <ul className="m-0 flex list-none flex-col p-0">
      {programmes.items.map((p) => (
        <li
          key={p.id}
          className="flex flex-col gap-[4px] border-t border-[#e7e7e7] py-[14px] sm:flex-row sm:items-center sm:justify-between sm:gap-[8px]"
        >
          <div className="flex min-w-0 flex-col gap-[2px]">
            <span className="text-[16px] leading-[19px] font-semibold text-[#1c2a21]">
              {p.title}
            </span>
            <span className="text-[14px] leading-[17px] text-[#595959]">{p.summary}</span>
          </div>
          <span className="shrink-0 text-[13px] leading-[16px] font-semibold text-[#387440]">
            {p.status}
          </span>
        </li>
      ))}
    </ul>
  </PublicCard>
);

export default AgencyPublicProgrammesCard;
