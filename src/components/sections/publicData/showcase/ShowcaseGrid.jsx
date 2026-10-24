import { PublicIconShield } from './showcaseIcons.jsx';
import ShowcaseGridCard from './ShowcaseGridCard.jsx';
import ShowcasePartnerCta from './ShowcasePartnerCta.jsx';

/*
 * ShowcaseGrid — Figma 8.4.2b "Grid overview" (8497:349452): page header (h1 "Talent showcase" 34/41 600 -0.34 + sub 16/19 #595959) with the badge
 * "All 5 profiles shown with written consent" on the right (#ebf1ec pill, shield 16, 14/17 600 #2a5730); a 3-column grid (gap 24) of the five profile
 * cards, the sixth cell is the green "Why only five?" card with the "Partner sign-up →" button. The phone frame for this view is not drawn:
 * ⚠️ ASSUMPTION a single column on phones, two columns on tablet, three from lg (1024).
 * Props: profiles, consent, copy
 */

const ShowcaseGrid = ({ profiles, consent, copy }) => (
  <div className="flex flex-col gap-[24px] px-[16px] pt-[16px] pb-[24px] font-sans md:px-[28px] md:pt-[32px] md:pb-[48px] xl:px-[40px]">
    <header className="flex flex-wrap items-end justify-between gap-x-[16px] gap-y-[12px]">
      <div className="flex min-w-0 max-w-[760px] flex-col gap-[6px]">
        <h1 className="m-0 text-[26px] leading-[31px] font-semibold tracking-[-0.13px] text-[#1c2a21] md:text-[34px] md:leading-[41px] md:tracking-[-0.34px]">
          {copy.title}
        </h1>
        <p className="m-0 text-[14px] leading-[20px] text-[#595959] md:text-[16px] md:leading-[19px]">
          {copy.subtitle}
        </p>
      </div>
      <p className="m-0 inline-flex items-center gap-[8px] rounded-full bg-[#ebf1ec] px-[14px] py-[9px] text-[14px] leading-[17px] font-semibold text-[#2a5730]">
        <PublicIconShield className="size-[16px] shrink-0 text-[#387440]" />
        {consent.gridBadge}
      </p>
    </header>
    <ul className="m-0 grid list-none grid-cols-1 gap-[16px] p-0 md:grid-cols-2 md:gap-[24px] lg:grid-cols-3">
      {profiles.map((profile) => (
        <li key={profile.id} className="flex min-w-0 flex-col">
          <ShowcaseGridCard profile={profile} />
        </li>
      ))}
      <li className="flex min-w-0 flex-col">
        <ShowcasePartnerCta
          variant="why"
          title={copy.whyTitle}
          body={copy.whyBody}
          label={copy.whyCta}
          className="h-fit"
        />
      </li>
    </ul>
  </div>
);

export default ShowcaseGrid;
