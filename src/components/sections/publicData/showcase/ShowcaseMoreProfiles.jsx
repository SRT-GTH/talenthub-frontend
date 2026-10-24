import { Link } from 'react-router-dom';
import { DATA_BASE } from '../publicDataNav.js';

/*
 * ShowcaseMoreProfiles — Figma "More showcase profiles" 8497:1921 / "more" 8497:1922: heading 18/21 600, then the four other profiles as 328x102
 * cards (white, 1px #e7e7e7, r24, shadow; portrait 88x100 · name 15/18 600 · region 13/16 #595959 · tagline 13/16 500 #387440; text px14), gap 16.
 * Tablet (8508:352145): the four cards share 888px (210 each). Not drawn on the phone frame, so hidden below md.
 * Props: profiles (the other profiles, already excluding the current one)
 */

const ShowcaseMoreProfiles = ({ profiles }) => (
  <section
    aria-labelledby="showcase-more-title"
    className="hidden flex-col gap-[24px] font-sans md:flex"
  >
    <h2
      id="showcase-more-title"
      className="m-0 text-[18px] leading-[21px] font-semibold text-[#1c2a21]"
    >
      More showcase profiles
    </h2>
    <ul className="m-0 grid list-none grid-cols-2 gap-[16px] p-0 lg:grid-cols-4">
      {profiles.map((p) => (
        <li key={p.id} className="min-w-0">
          <Link
            to={`${DATA_BASE}/showcase/${p.id}`}
            className="flex h-[102px] items-center overflow-hidden rounded-[24px] border border-solid border-[#e7e7e7] bg-white text-inherit no-underline shadow-[0_5px_17px_rgba(0,0,0,0.04)] hover:border-[#387440] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
          >
            <img
              src={p.photo}
              alt=""
              width="88"
              height="100"
              loading="lazy"
              className="h-[100px] w-[88px] shrink-0 object-cover"
            />
            <span className="flex min-w-0 flex-col gap-[2px] px-[14px]">
              <span className="truncate text-[15px] leading-[18px] font-semibold text-[#1c2a21]">
                {p.name}
              </span>
              <span className="truncate text-[13px] leading-[16px] text-[#595959]">{p.region}</span>
              <span className="truncate text-[13px] leading-[16px] font-medium text-[#387440]">
                {p.tagline}
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  </section>
);

export default ShowcaseMoreProfiles;
