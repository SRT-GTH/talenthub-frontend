import { Link } from 'react-router-dom';
import AgencyFrame from '../../components/sections/agency/AgencyFrame.jsx';
import AgencyButton from '../../components/sections/agency/AgencyButton.jsx';
import AgencyPageHero from '../../components/sections/agency/AgencyPageHero.jsx';
import { useAgencyState } from '../../components/sections/agency/agencyState.js';
import { PUBLIC_AGENCY } from '../../components/sections/agency/publicPage/data/agencyPublicData.js';
import AgencyPublicHeader from '../../components/sections/agency/publicPage/AgencyPublicHeader.jsx';
import AgencyPublicImpactCard from '../../components/sections/agency/publicPage/AgencyPublicImpactCard.jsx';
import AgencyPublicProgrammesCard from '../../components/sections/agency/publicPage/AgencyPublicProgrammesCard.jsx';
import AgencyPublicSideCards from '../../components/sections/agency/publicPage/AgencyPublicSideCards.jsx';
import { debug } from '../../utils/debug.js';

const log = debug('AgencyPublicPage');

/*
 * AgencyPublicPage — /agency/public-page (Figma 11.6.1i "Agency page · Public view", 8611:3509). The frame draws the AGENCY chrome (rail, top bar, green
 * "Your agency page" hero with "Edit agency page"), i.e. the owner's preview of the public directory page, so it is built inside AgencyFrame.
 * Aggregates only, no MoU data. Hero title uses Bricolage as drawn (font-heading).
 */
const AgencyPublicPage = () => {
  const data = useAgencyState();
  const a = PUBLIC_AGENCY;
  log('render');
  return (
    <AgencyFrame data={data} title="Agency public page">
      <AgencyPageHero
        className="[&_h1]:font-heading"
        title={a.hero.title}
        subtitle={a.hero.subtitle}
        actions={
          <AgencyButton to="/agency/settings" size="sm">
            Edit agency page
          </AgencyButton>
        }
      />
      <nav aria-label="Breadcrumb" className="text-[14px] leading-[17px]">
        <ol className="m-0 flex list-none flex-wrap items-center gap-[8px] p-0">
          {a.breadcrumb.map((b) => (
            <li key={b} className="flex items-center gap-[8px]">
              <Link
                to="/agency/public-page"
                className="font-semibold text-[#387440] no-underline hover:underline"
              >
                {b}
              </Link>
              <span aria-hidden="true" className="text-[#595959]">
                ›
              </span>
            </li>
          ))}
          <li aria-current="page" className="font-medium text-[#1c2a21]">
            {a.name}
          </li>
        </ol>
      </nav>
      <AgencyPublicHeader agency={a} />
      <div className="grid min-w-0 grid-cols-1 items-start gap-[24px] xl:grid-cols-[minmax(0,1fr)_456px]">
        <div className="flex min-w-0 flex-col gap-[24px]">
          <AgencyPublicImpactCard impact={a.impact} />
          <AgencyPublicProgrammesCard programmes={a.programmes} />
        </div>
        <div className="flex min-w-0 flex-col gap-[24px]">
          <AgencyPublicSideCards reach={a.reach} open={a.open} />
        </div>
      </div>
    </AgencyFrame>
  );
};

export default AgencyPublicPage;
