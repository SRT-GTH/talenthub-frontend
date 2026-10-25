import { Link } from 'react-router-dom';
import InstitutionButton from '../../components/sections/institution/InstitutionButton.jsx';
import InstitutionFrame from '../../components/sections/institution/InstitutionFrame.jsx';
import InstitutionPageHero from '../../components/sections/institution/InstitutionPageHero.jsx';
import { useInstitutionState } from '../../components/sections/institution/institutionState.js';
import { PUBLIC_INSTITUTION } from '../../components/sections/institution/publicPage/data/institutionPublicData.js';
import InstitutionPublicHeader from '../../components/sections/institution/publicPage/InstitutionPublicHeader.jsx';
import InstitutionPublicImpactCard from '../../components/sections/institution/publicPage/InstitutionPublicImpactCard.jsx';
import InstitutionPublicProgrammesCard from '../../components/sections/institution/publicPage/InstitutionPublicProgrammesCard.jsx';
import InstitutionPublicSideCards from '../../components/sections/institution/publicPage/InstitutionPublicSideCards.jsx';
import { debug } from '../../utils/debug.js';

const log = debug('InstitutionPublicPage');

/*
 * InstitutionPublicPage — /institution/public-page (Figma 11.6.1h "Institution page · Public view", 8746:1675). The frame draws the INSTITUTION chrome
 * (rail, top bar, green "Your institution page" hero with "Edit institution page"), i.e. the owner's preview of the public directory page, so it is built
 * inside InstitutionFrame (no rail item is highlighted, as drawn). Aggregates only, no student records. Hero title uses Bricolage as drawn (font-heading).
 */
const InstitutionPublicPage = () => {
  const data = useInstitutionState();
  const s = PUBLIC_INSTITUTION;
  log('render');
  return (
    <InstitutionFrame data={data} title="Institution public page" active="none">
      <InstitutionPageHero
        className="[&_h1]:font-heading"
        title={s.hero.title}
        subtitle={s.hero.subtitle}
        actions={
          <InstitutionButton to="/institution/settings/profile" size="sm">
            Edit institution page
          </InstitutionButton>
        }
      />
      <nav aria-label="Breadcrumb" className="text-[14px] leading-[17px]">
        <ol className="m-0 flex list-none flex-wrap items-center gap-[8px] p-0">
          {s.breadcrumb.map((b) => (
            <li key={b} className="flex items-center gap-[8px]">
              <Link
                to="/institution/public-page"
                className="inline-flex min-h-[24px] items-center font-semibold text-[#387440] no-underline hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
              >
                {b}
              </Link>
              <span aria-hidden="true" className="text-[#595959]">
                ›
              </span>
            </li>
          ))}
          <li aria-current="page" className="font-medium text-[#1c2a21]">
            {s.name}
          </li>
        </ol>
      </nav>
      <InstitutionPublicHeader institution={s} />
      <div className="grid min-w-0 grid-cols-1 items-start gap-[24px] xl:grid-cols-[minmax(0,1fr)_456px]">
        <div className="flex min-w-0 flex-col gap-[24px]">
          <InstitutionPublicImpactCard impact={s.impact} />
          <InstitutionPublicProgrammesCard programmes={s.programmes} />
        </div>
        <div className="flex min-w-0 flex-col gap-[24px]">
          <InstitutionPublicSideCards reach={s.reach} open={s.open} />
        </div>
      </div>
    </InstitutionFrame>
  );
};

export default InstitutionPublicPage;
