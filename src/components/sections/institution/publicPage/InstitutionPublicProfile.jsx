import { PUBLIC_PAGE_COPY as COPY, regionIdOf } from './data/institutionPublicData.js';
import InstitutionPublicHeader from './InstitutionPublicHeader.jsx';
import InstitutionPublicImpactCard from './InstitutionPublicImpactCard.jsx';
import InstitutionPublicProgrammesCard from './InstitutionPublicProgrammesCard.jsx';
import InstitutionPublicSideCards from './InstitutionPublicSideCards.jsx';

/*
 * InstitutionPublicProfile — the body of a school's public page (Figma 11.6.1h, 8746:1675): header card, "Programmes through GTH" impact
 * tiles, "Programmes on GTH", and the right column ("Where we are" map + "Open programmes"). One component for both places it shows:
 * the owner preview inside the portal (/institution/public-page, owner = true: "See all programmes" opens the portal's Programmes) and the
 * public page anyone can open (/institutions/:slug, owner = false: no portal links). Props: page (GET /institution-public/:slug), owner.
 */

const zero = (n) => (n === 0 ? '0' : n);

const captionOf = (page) =>
  [page.town, page.region && `${page.region} Region`].filter(Boolean).join(' · ') || 'Ghana';

const InstitutionPublicProfile = ({ page, owner = false }) => (
  <>
    <InstitutionPublicHeader institution={page} />
    <div className="grid min-w-0 grid-cols-1 items-start gap-[24px] xl:grid-cols-[minmax(0,1fr)_456px]">
      <div className="flex min-w-0 flex-col gap-[24px]">
        <InstitutionPublicImpactCard
          impact={{
            title: COPY.impactTitle,
            hint: page.impact.hint,
            tiles: page.impact.tiles.map((t) => ({ ...t, value: zero(t.value) })),
          }}
        />
        <InstitutionPublicProgrammesCard
          title={COPY.programmesTitle}
          hint={page.programmes.hint}
          items={page.programmes.items}
          empty={COPY.noProgrammes}
        />
      </div>
      <div className="flex min-w-0 flex-col gap-[24px]">
        <InstitutionPublicSideCards
          copy={COPY}
          caption={captionOf(page)}
          region={regionIdOf(page.region)}
          open={page.open}
          allLink={owner ? '/institution/programmes' : null}
        />
      </div>
    </div>
  </>
);

export default InstitutionPublicProfile;
