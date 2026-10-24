import ShowcaseAssessmentCard from './ShowcaseAssessmentCard.jsx';
import ShowcaseConsentBanner from './ShowcaseConsentBanner.jsx';
import ShowcaseMoreProfiles from './ShowcaseMoreProfiles.jsx';
import ShowcasePartnerCta from './ShowcasePartnerCta.jsx';
import ShowcasePortfolioCard from './ShowcasePortfolioCard.jsx';
import ShowcaseProfileHeader from './ShowcaseProfileHeader.jsx';
import ShowcaseProfileNav from './ShowcaseProfileNav.jsx';
import ShowcaseSkillsCard from './ShowcaseSkillsCard.jsx';

/*
 * ShowcaseProfileView — the body of one showcase profile (Figma 8.4.1a/b/c/d, 8.4.2a): consent banner · profile nav · header ·
 * row (Verified skills 560 | Assessment results 376 | Portfolio 376, gap 24) · partner CTA · "More showcase profiles".
 * Body padding 24/40/48 (desktop), 24/28/48 (tablet), 16 on phones. Tablet stacks the three cards in a column (8508:352084).
 * Props: resolved (resolveProfile() result), consent, consentOpen, onToggleConsent, forceNextHover
 */

const ShowcaseProfileView = ({
  resolved,
  consent,
  consentOpen,
  onToggleConsent,
  forceNextHover,
}) => {
  const { profile, index, total, previous, next, others } = resolved;
  return (
    <div className="flex flex-col gap-[16px] px-[16px] pt-[16px] pb-[24px] md:gap-[24px] md:px-[28px] md:pt-[24px] md:pb-[48px] xl:px-[40px]">
      <ShowcaseConsentBanner consent={consent} expanded={consentOpen} onToggle={onToggleConsent} />
      <ShowcaseProfileNav
        variant="desktop"
        profile={profile}
        index={index}
        total={total}
        previous={previous}
        next={next}
        forceNextHover={forceNextHover}
      />
      <ShowcaseProfileHeader profile={profile} />
      <div className="grid gap-[16px] md:gap-[24px] xl:grid-cols-[560fr_376fr_376fr]">
        <ShowcaseSkillsCard profile={profile} />
        <ShowcaseAssessmentCard profile={profile} />
        <ShowcasePortfolioCard profile={profile} className="hidden md:block" />
      </div>
      <ShowcasePartnerCta
        title={`Want to reach talents like ${profile.firstName}?`}
        body="Verified partners and recruiters can search consented profiles across all 16 regions."
        className="hidden md:flex"
      />
      <ShowcaseMoreProfiles profiles={others} />
      <ShowcaseProfileNav
        variant="mobile"
        profile={profile}
        index={index}
        total={total}
        previous={previous}
        next={next}
      />
    </div>
  );
};

export default ShowcaseProfileView;
