import WidgetCard from '../../ui/WidgetCard.jsx';
import { dashIcons } from './recruiterDashboardIcons.js';
import { LINK_ORG } from './recruiterDashboardData.js';

/*
 * OrgLinkCard — "Link your profile to an organisation" (Figma 10066:39556, D07 "No affiliation yet"): replaces every widget when the recruiter has no organisation.
 * A dashed empty state with the building glyph, copy, "Request affiliation" (primary), "Create organisation" (secondary) and "Continue as freelancer" (link).
 * Props: onRequest, onCreate, onFreelancer.
 */
const OrgLinkCard = ({ onRequest, onCreate, onFreelancer }) => (
  <WidgetCard
    id="dash-link-org"
    icon={dashIcons.tileLinkOrganisation}
    title={LINK_ORG.title}
    subtitle={LINK_ORG.subtitle}
  >
    <div className="flex flex-col items-center gap-[24px] rounded-[16px] border border-dashed border-[#c1d4c4] px-[24px] py-[56px] text-center max-sm:py-[32px]">
      <div className="flex flex-col items-center gap-[12px]">
        <span className="flex size-[52px] items-center justify-center rounded-[14px] bg-[#ebf1ec]">
          <img
            src={dashIcons.emptyOrganisationBuilding}
            alt=""
            aria-hidden="true"
            className="size-[26px]"
          />
        </span>
        <h2 className="m-0 font-sans text-[16px] leading-[28px] font-semibold text-[#111]">
          {LINK_ORG.emptyTitle}
        </h2>
        <p className="m-0 max-w-[420px] font-sans text-[12px] leading-[20px] tracking-[0.2px] text-[#575755]">
          {LINK_ORG.emptyBody}
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-[16px]">
        <button
          type="button"
          onClick={onRequest}
          className="inline-flex min-h-[44px] cursor-pointer items-center gap-[8px] rounded-[10px] border-0 bg-[#387440] px-[18px] font-sans text-[14px] leading-[24px] font-medium tracking-[0.2px] text-white shadow-[0_3px_0_#2a5730] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
        >
          <img
            src={dashIcons.searchRequestAffiliation}
            alt=""
            aria-hidden="true"
            className="size-[16px]"
          />
          {LINK_ORG.request}
        </button>
        <button
          type="button"
          onClick={onCreate}
          className="inline-flex h-[36px] cursor-pointer items-center gap-[6px] rounded-[10px] border border-solid border-[#1c2a21]/30 bg-white px-[12px] font-sans text-[12px] leading-[20px] font-medium tracking-[0.2px] text-[#1c2a21] shadow-[0_2px_0_rgba(17,17,17,0.25)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
        >
          <img
            src={dashIcons.plusCreateOrganisation}
            alt=""
            aria-hidden="true"
            className="size-[16px]"
          />
          {LINK_ORG.create}
        </button>
        <button
          type="button"
          onClick={onFreelancer}
          className="inline-flex cursor-pointer items-center gap-[6px] border-0 bg-transparent p-0 font-sans text-[14px] leading-[24px] font-medium tracking-[0.2px] text-[#387440] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
        >
          {LINK_ORG.freelancer}
          <img
            src={dashIcons.arrowRightFreelancer}
            alt=""
            aria-hidden="true"
            className="size-[16px]"
          />
        </button>
      </div>
    </div>
  </WidgetCard>
);

export default OrgLinkCard;
