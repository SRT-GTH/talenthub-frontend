import PublicCard from '../ui/PublicCard.jsx';
import { PublicIconFolder } from './showcaseIcons.jsx';

/*
 * ShowcasePortfolioCard — Figma "Portfolio preview" 8497:1901 (376x327) and its variants (3 pieces 8497:2149; empty 8497:1901).
 * Header "Portfolio" · aside "Not added yet" / "3 pieces" (reproduced verbatim from the data: the Adwoa frame reads "1 pieces").
 * Pieces: 72x54 r8 thumbnail + title 14/17 600, gap 12, rows 10 apart. Empty: folder 28 + "No portfolio pieces shared yet." 14/17 500 #595959,
 * centred, gap 10. Not drawn on the phone frame (8508:99), so the whole card is hidden below md.
 * Props: profile
 */

const ShowcasePortfolioCard = ({ profile, className }) => {
  const pieces = profile.portfolio;
  return (
    <PublicCard
      id="showcase-portfolio"
      title="Portfolio"
      hint={pieces.length ? `${pieces.length} pieces` : 'Not added yet'}
      bodyClassName="px-[24px] pb-[24px]"
      className={className}
    >
      {pieces.length ? (
        <ul aria-label="Portfolio pieces" className="m-0 flex list-none flex-col gap-[10px] p-0">
          {pieces.map((piece) => (
            <li key={piece.id} className="flex items-center gap-[12px]">
              <img
                src={piece.image}
                alt=""
                width="72"
                height="54"
                loading="lazy"
                className="h-[54px] w-[72px] shrink-0 rounded-[8px] object-cover"
              />
              <span className="min-w-0 text-[14px] leading-[17px] font-semibold text-[#1c2a21]">
                {piece.title}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-center gap-[10px] pt-[8px] text-center">
          <PublicIconFolder className="size-[28px] text-[#70706e]" />
          <p className="m-0 text-[14px] leading-[17px] font-medium text-[#595959]">
            No portfolio pieces shared yet.
          </p>
        </div>
      )}
    </PublicCard>
  );
};

export default ShowcasePortfolioCard;
