import PublicCard from '../../publicData/ui/PublicCard.jsx';

/*
 * InstitutionPublicProgrammesCard — "Programmes on GTH" (Figma 8746:1750): rows py14 with a 1px #e7e7e7 divider, title 16/600, summary 14 #595959,
 * status 13/600 (#387440 open, #595959 closed). Props: title, hint, items [{id, title, summary, status, open}], empty (text when there are none).
 */
const InstitutionPublicProgrammesCard = ({ title, hint, items, empty }) => (
  <PublicCard title={title} hint={hint}>
    {items.length ? (
      <ul className="m-0 flex list-none flex-col p-0">
        {items.map((p) => (
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
            <span
              className={`shrink-0 text-[13px] leading-[16px] font-semibold ${p.open ? 'text-[#387440]' : 'text-[#595959]'}`}
            >
              {p.status}
            </span>
          </li>
        ))}
      </ul>
    ) : (
      <p className="m-0 border-t border-[#e7e7e7] py-[14px] text-[14px] leading-[20px] text-[#595959]">
        {empty}
      </p>
    )}
  </PublicCard>
);

export default InstitutionPublicProgrammesCard;
