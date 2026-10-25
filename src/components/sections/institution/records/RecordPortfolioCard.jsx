import line from '../../../../assets/institution/records/portfolio-clean-water.svg';
import bars from '../../../../assets/institution/records/portfolio-malaria-survey.svg';
import dots from '../../../../assets/institution/records/portfolio-medicine-essay.svg';
import RecordCard from './RecordCard.jsx';

const COVERS = { bars, line, dots };

/* RecordPortfolioCard — "Portfolio" (Figma 8593:800): three 264 x 150 covers (Figma exports, the type sticker is part of the art) with title 15/600 and meta 12. Props: detail. */
const RecordPortfolioCard = ({ detail }) => (
  <RecordCard id="record-portfolio" title="Portfolio" link="See all 3 →">
    <ul className="m-0 grid list-none grid-cols-1 gap-[16px] p-0 sm:grid-cols-3">
      {detail.portfolio.map((p) => (
        <li key={p.id} className="flex min-w-0 flex-col gap-[8px]">
          <img
            src={COVERS[p.cover]}
            alt={`${p.title} cover`}
            className="aspect-[264/150] w-full rounded-[14px] object-cover"
          />
          <span className="text-[15px] leading-[18px] font-semibold text-[#1c2a21]">{p.title}</span>
          <span className="text-[12px] leading-[14px] text-[#737373]">{p.meta}</span>
        </li>
      ))}
    </ul>
  </RecordCard>
);

export default RecordPortfolioCard;
