import { Link } from 'react-router-dom';
import { formatCount, safeShare } from '../publicDataFormat.js';
import PublicCard from '../ui/PublicCard.jsx';
import Breadcrumb from './Breadcrumb.jsx';
import {
  labelOf,
  OPPORTUNITY_TYPES,
  PARTNER_TYPES,
  partnerReachedLabel,
} from './data/directoryData.js';
import LinkButton from './LinkButton.jsx';
import Monogram from './Monogram.jsx';
import PartnerMiniMap from './PartnerMiniMap.jsx';
import TypePill from './TypePill.jsx';
import { PARTNER_SIGN_IN_ROUTE } from '../publicDataNav.js';

/*
 * PartnerDetail — Figma 8.6.1b "Partners · Partner detail" (8498:486) and the phone frame 8516:250.
 *   breadcrumb · header card (monogram 96, type pill, name 32/38, summary 16/24, [Visit website ↗] [Partner enquiries]) ·
 *   left: "Impact through GTH" (4 tiles) + "Programmes on GTH" · right: "Where they work" map + "Open opportunities".
 *   Phone: monogram 64, pill, name 26/31, short summary, 2x2 KPI cards, "Programmes" card, full-width "Visit website ↗"; no map / opportunities.
 * Sections whose data the sample does not hold (impact tiles, programmes) are left out: only Northern Skills Foundation is drawn in Figma.
 * Privacy: every count goes through formatCount() / partnerReachedLabel(); the girls share through safeShare() (never a bucket under 5).
 * ⚠️ ASSUMPTION: "Partner enquiries" leads to the sign-in route (Figma draws no destination); "Visit website" opens the sample website in a new tab.
 * Props: partner, opportunities.
 */

const Tile = ({ value, label, short }) => (
  <div className="flex min-w-0 flex-col gap-[2px] rounded-[16px] border border-solid border-[#e7e7e7] bg-white px-[14px] py-[12px] md:gap-[4px] md:border-0 md:bg-[#f2f2ee] md:p-[16px]">
    <p className="m-0 order-1 text-[22px] leading-[26px] font-bold text-[#1c2a21] md:text-[26px] md:leading-[31px]">
      {value}
    </p>
    <p className="m-0 order-0 text-[12px] leading-[14px] font-semibold tracking-[0.6px] text-[#595959] uppercase md:order-2 md:text-[13px] md:leading-[16px] md:font-medium md:tracking-normal md:normal-case">
      <span className="md:hidden">{short}</span>
      <span className="hidden md:inline">{label}</span>
    </p>
  </div>
);

const PartnerDetail = ({ partner, opportunities }) => {
  const typeLabel = labelOf(PARTNER_TYPES, partner.type);
  const impact = partner.impact;
  const girls = impact ? safeShare(impact.girlsPct, 100) : null;
  const tiles = impact
    ? [
        {
          value: partnerReachedLabel(impact.reached),
          label: 'Talents reached',
          short: 'Talents reached',
        },
        {
          value: formatCount(impact.completed),
          label: 'Completed a programme',
          short: 'Completed',
        },
        { value: formatCount(impact.placed), label: 'Placed or progressed', short: 'Placed' },
        {
          value: girls === null ? '<5' : `${girls}%`,
          label: 'Girls in programmes',
          short: 'Girls',
        },
      ]
    : null;
  const programmes = partner.programmes ?? [];

  return (
    <div className="flex flex-col gap-[16px] md:gap-[24px]">
      <Breadcrumb
        items={[
          { label: 'Directory', to: '/data/partners' },
          { label: 'Partners', to: '/data/partners' },
          { label: partner.name },
        ]}
      />
      <section
        aria-labelledby="partner-name"
        className="flex flex-col gap-[16px] rounded-[24px] md:flex-row md:items-center md:gap-[24px] md:border md:border-solid md:border-[#e7e7e7] md:bg-white md:p-[28px] md:shadow-[0_5px_17px_rgba(0,0,0,0.04)]"
      >
        <Monogram initials={partner.monogram} color={partner.color} size="detail" />
        <div className="flex min-w-0 flex-1 flex-col gap-[8px]">
          <TypePill type={partner.type} label={typeLabel} />
          <h1
            id="partner-name"
            className="m-0 font-sans text-[26px] leading-[31px] font-semibold text-[#1c2a21] md:text-[32px] md:leading-[38px] md:tracking-[-0.32px]"
          >
            {partner.name}
          </h1>
          {partner.summary && (
            <>
              <p className="m-0 font-sans text-[15px] leading-[22px] text-[#595959] md:hidden">
                {partner.summaryShort ?? partner.summary}
              </p>
              <p className="m-0 hidden max-w-[760px] font-sans text-[16px] leading-[24px] text-[#595959] md:block">
                {partner.summary}
              </p>
            </>
          )}
        </div>
        <div className="hidden shrink-0 items-center gap-[12px] md:flex">
          {partner.website && (
            <LinkButton href={partner.website} variant="outline">
              Visit website ↗
            </LinkButton>
          )}
          <LinkButton to={PARTNER_SIGN_IN_ROUTE} variant="primary">
            Partner enquiries
          </LinkButton>
        </div>
      </section>

      <div className="grid grid-cols-1 items-start gap-[16px] md:gap-[24px] xl:grid-cols-[minmax(0,1fr)_456px]">
        <div className="flex min-w-0 flex-col gap-[16px] md:gap-[24px]">
          {tiles && (
            <>
              <div className="grid grid-cols-2 gap-[10px] md:hidden">
                {tiles.map((t) => (
                  <Tile key={t.short} {...t} />
                ))}
              </div>
              <PublicCard
                title="Impact through GTH"
                hint="Aggregated · since March 2025"
                className="hidden md:block"
                bodyClassName="px-[24px] pb-[24px]"
                id="partner-impact"
              >
                <div className="grid grid-cols-2 gap-[12px] lg:grid-cols-4">
                  {tiles.map((t) => (
                    <Tile key={t.short} {...t} />
                  ))}
                </div>
              </PublicCard>
            </>
          )}
          {programmes.length > 0 && (
            <>
              <PublicCard
                as="section"
                id="partner-programmes-m"
                className="md:hidden"
                bodyClassName="px-[16px] pb-[16px]"
                title="Programmes"
                hint={`${programmes.length} active`}
              >
                <ul className="m-0 flex list-none flex-col gap-[12px] p-0">
                  {programmes.map((p) => (
                    <li key={p.id} className="flex flex-col gap-[2px]">
                      <span className="font-sans text-[15px] leading-[18px] font-semibold text-[#1c2a21]">
                        {p.title}
                      </span>
                      <span className="font-sans text-[12px] leading-[14px] font-semibold text-[#387440]">
                        {p.statusShort}
                      </span>
                    </li>
                  ))}
                </ul>
              </PublicCard>
              <PublicCard
                id="partner-programmes"
                className="hidden md:block"
                bodyClassName="px-[24px] pb-[16px]"
                title="Programmes on GTH"
                hint={`${programmes.length} active`}
              >
                <ul className="m-0 flex list-none flex-col p-0">
                  {programmes.map((p) => (
                    <li
                      key={p.id}
                      className="flex items-center justify-between gap-[8px] border-t border-solid border-[#e7e7e7] py-[14px] font-sans"
                    >
                      <div className="flex min-w-0 flex-col gap-[2px]">
                        <span className="text-[16px] leading-[19px] font-semibold text-[#1c2a21]">
                          {p.title}
                        </span>
                        <span className="text-[14px] leading-[17px] text-[#595959]">{p.blurb}</span>
                      </div>
                      <span className="shrink-0 text-[13px] leading-[16px] font-semibold text-[#387440]">
                        {p.status}
                      </span>
                    </li>
                  ))}
                </ul>
              </PublicCard>
            </>
          )}
          {partner.website && (
            <LinkButton href={partner.website} variant="outline" className="md:hidden">
              Visit website ↗
            </LinkButton>
          )}
        </div>

        <div className="hidden min-w-0 flex-col gap-[24px] md:flex">
          <section
            aria-labelledby="partner-where"
            className="flex flex-col gap-[12px] rounded-[24px] border border-solid border-[#e7e7e7] bg-white p-[24px] shadow-[0_5px_17px_rgba(0,0,0,0.04)]"
          >
            <h3
              id="partner-where"
              className="m-0 font-sans text-[18px] leading-[21px] font-semibold text-[#1c2a21]"
            >
              Where they work
            </h3>
            <PartnerMiniMap
              regionIds={partner.regionIds}
              label={`Map of Ghana: ${partner.regionLabel}`}
              className="h-[321px] w-[220px] max-w-full"
            />
            <p className="m-0 font-sans text-[14px] leading-[17px] font-medium text-[#1c2a21]">
              {partner.regionLabel}
            </p>
          </section>
          {opportunities.length > 0 && (
            <section
              aria-labelledby="partner-opps"
              className="flex flex-col gap-[10px] rounded-[24px] border border-solid border-[#e7e7e7] bg-white p-[24px] shadow-[0_5px_17px_rgba(0,0,0,0.04)]"
            >
              <h3
                id="partner-opps"
                className="m-0 font-sans text-[18px] leading-[21px] font-semibold text-[#1c2a21]"
              >
                Open opportunities
              </h3>
              <ul className="m-0 flex list-none flex-col gap-[10px] p-0">
                {opportunities.map((o) => (
                  <li key={o.id}>
                    <Link
                      to={`/data/opportunities/${o.id}`}
                      className="flex flex-col gap-[2px] rounded-[12px] bg-[#f2f2ee] px-[14px] py-[12px] no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
                    >
                      <span className="font-sans text-[15px] leading-[18px] font-semibold text-[#1c2a21]">
                        {o.title}
                      </span>
                      <span className="font-sans text-[13px] leading-[16px] text-[#595959]">
                        {labelOf(OPPORTUNITY_TYPES, o.type)} · {o.closes.charAt(0).toLowerCase()}
                        {o.closes.slice(1)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                to={`/data/opportunities?q=${encodeURIComponent(partner.name)}`}
                className="mt-[4px] w-fit rounded-[4px] font-sans text-[14px] leading-[17px] font-semibold text-[#387440] no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
              >
                See all in Opportunities →
              </Link>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default PartnerDetail;
