import { Link } from 'react-router-dom';
import { SECTION_BY_PATH } from './landingSections.js';
import { rememberSection } from './lastVisit.js';

/*
 * LandingExploreCards — "Explore the data" (Figma 8514:227: h2 28/33 600, four white r24 cards 325x278: photo 323x170, then title 18/21 600,
 * sentence 14/20 #595959, link text 14/17 600 #387440 "Explore regions →"). The whole card is the link (stretched over the card from the
 * CTA text). Not drawn on the phone frame (8515:2666 stops at the stats), so it is hidden below md. Tablet (no frame): two columns.
 * Props: cards (landingData EXPLORE_CARDS)
 */

const LandingExploreCards = ({ cards }) => (
  <section
    aria-labelledby="explore-title"
    className="flex flex-col gap-[20px] px-[28px] pt-[48px] max-md:hidden xl:px-[40px]"
  >
    <h2
      id="explore-title"
      className="m-0 font-sans text-[28px] leading-[33px] font-semibold text-[#1c2a21]"
    >
      Explore the data
    </h2>
    <ul className="m-0 grid list-none grid-cols-2 gap-[20px] p-0 xl:grid-cols-4">
      {cards.map((card) => (
        <li
          key={card.key}
          className="group relative flex min-w-0 flex-col overflow-hidden rounded-[24px] border border-solid border-[#e7e7e7] bg-white shadow-[0_5px_17px_rgba(0,0,0,0.04)]"
        >
          <img src={card.image} alt="" loading="lazy" className="h-[170px] w-full object-cover" />
          <div className="flex flex-col gap-[6px] px-[20px] py-[18px]">
            <h3 className="m-0 font-sans text-[18px] leading-[21px] font-semibold text-[#1c2a21]">
              {card.title}
            </h3>
            <p className="m-0 font-sans text-[14px] leading-[20px] text-[#595959]">{card.text}</p>
            <Link
              to={card.to}
              onClick={() => rememberSection(SECTION_BY_PATH[card.to])}
              className="inline-flex min-h-[24px] w-fit items-center font-sans text-[14px] leading-[17px] font-semibold text-[#387440] after:absolute after:inset-0 after:rounded-[24px] after:content-[''] hover:underline focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-[#387440]"
            >
              {card.cta}
            </Link>
          </div>
        </li>
      ))}
    </ul>
  </section>
);

export default LandingExploreCards;
