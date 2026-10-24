import { Link } from 'react-router-dom';
import { PublicIconInfo } from '../publicDataIcons.jsx';
import { PublicIconEyeoff, PublicIconRefresh, PublicIconShield } from './landingIcons.jsx';

/*
 * LandingTrustStrip — Figma 8514:254 (1360x60: white, 1px #e7e7e7, r20, p 20/28, gap 28): shield "No personal data on public pages" · eye-off
 * "Counts under 5 hidden as “<5”" · refresh "Live data, refreshed every 5 minutes" · info "Open methodology" (a link), 14/17 500, icons 18px #387440.
 * Not drawn on the phone. Wraps on narrow tablets.
 * Props: items (landingData TRUST_ITEMS)
 */

const ICONS = {
  shield: PublicIconShield,
  eyeoff: PublicIconEyeoff,
  refresh: PublicIconRefresh,
  info: PublicIconInfo,
};

const TEXT =
  'inline-flex min-h-[24px] items-center font-sans text-[14px] leading-[17px] font-medium text-[#1c2a21]';

const LandingTrustStrip = ({ items }) => (
  <section
    aria-label="How we protect privacy"
    className="px-[28px] pt-[20px] pb-[56px] max-md:hidden xl:px-[40px]"
  >
    <ul className="m-0 flex list-none flex-wrap items-center gap-x-[28px] gap-y-[12px] rounded-[20px] border border-solid border-[#e7e7e7] bg-white px-[28px] py-[20px]">
      {items.map((item) => {
        const Icon = ICONS[item.icon];
        return (
          <li key={item.key} className="flex items-center gap-[8px]">
            <Icon className="size-[18px] shrink-0 text-[#387440]" />
            {item.to ? (
              <Link
                to={item.to}
                className={`${TEXT} hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]`}
              >
                {item.text}
              </Link>
            ) : (
              <span className={TEXT}>{item.text}</span>
            )}
          </li>
        );
      })}
    </ul>
  </section>
);

export default LandingTrustStrip;
