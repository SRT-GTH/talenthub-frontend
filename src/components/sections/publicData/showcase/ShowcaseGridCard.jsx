import { Link } from 'react-router-dom';
import { DATA_BASE } from '../publicDataNav.js';

/*
 * ShowcaseGridCard — Figma "card · Akosua O." 8497:349505 (437x474): white, 1px #e7e7e7, r24, shadow; portrait 300 high (cover) over a p20 gap8 text block:
 * name 20/24 600 · "Volta · In-tertiary · Nursing" 14/17 #595959 · tagline 15/18 500 · two skill tags (#f2f2ee pill p 5/10, 12/14 600) · "View profile →" 14/17 600 #387440.
 * Hover (8497:349517, Kofi): 2px #387440 border + shadow 0 12px 28px. The whole card is one link. Props: profile
 */

const ShowcaseGridCard = ({ profile }) => (
  <Link
    to={`${DATA_BASE}/showcase/${profile.id}`}
    className="group flex min-w-0 flex-col overflow-hidden rounded-[24px] border border-solid border-[#e7e7e7] bg-white text-inherit no-underline shadow-[0_5px_17px_rgba(0,0,0,0.04)] transition-shadow hover:border-[#387440] hover:shadow-[0_12px_28px_rgba(0,0,0,0.12)] focus-visible:border-[#387440] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
  >
    <img
      src={profile.photo}
      alt={`Portrait of ${profile.name}`}
      width="435"
      height="300"
      loading="lazy"
      className="h-[300px] w-full object-cover object-[50%_12%]"
    />
    <span className="flex flex-col gap-[8px] p-[20px]">
      <span className="text-[20px] leading-[24px] font-semibold text-[#1c2a21]">
        {profile.name}
      </span>
      <span className="text-[14px] leading-[17px] text-[#595959]">
        {profile.region} · {profile.education}
      </span>
      <span className="text-[15px] leading-[18px] font-medium text-[#1c2a21]">
        {profile.tagline}
      </span>
      <span className="flex flex-wrap gap-[6px]">
        {profile.skills.slice(0, 2).map((skill) => (
          <span
            key={skill.id}
            className="rounded-full bg-[#f2f2ee] px-[10px] py-[5px] text-[12px] leading-[14px] font-semibold text-[#1c2a21]"
          >
            {skill.name}
          </span>
        ))}
      </span>
      <span className="pt-[4px] text-[14px] leading-[17px] font-semibold text-[#387440]">
        View profile →
      </span>
    </span>
  </Link>
);

export default ShowcaseGridCard;
