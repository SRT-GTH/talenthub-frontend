import mtnGhana from '../../../../assets/recruiter-onboarding/organisation/logo-mtn-ghana.png';
import mtnFoundation from '../../../../assets/recruiter-onboarding/organisation/logo-mtn-ghana-foundation.png';
import mtnMomo from '../../../../assets/recruiter-onboarding/organisation/logo-mtn-mobile-money.png';
import silverRock from '../../../../assets/recruiter-onboarding/organisation/logo-silver-rock-technologies.png';
import { classNames } from '../../../../utils/classNames.js';

// Figma bitmaps 7374:4811 / 4818 / 4825 / 5052 (exported @3x). Unknown orgs keep an initials tile.
const LOGOS = {
  'MTN Ghana': mtnGhana,
  'MTN Ghana Foundation': mtnFoundation,
  'MTN Mobile Money Ltd': mtnMomo,
  'Silver Rock Technologies': silverRock,
};

/*
 * OrgLogo - 40x40 r10 tile for an organisation.
 * Figma "Logo" frames are bitmaps, exported to src/assets/recruiter-onboarding/organisation/logo-*.png.
 */
export const OrgLogo = ({ name, className }) => {
  const logo = LOGOS[name];
  if (logo)
    return (
      <img
        src={logo}
        alt=""
        aria-hidden="true"
        draggable={false}
        className={classNames('size-10 shrink-0 rounded-[10px] object-cover', className)}
      />
    );
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
  return (
    <span
      aria-hidden="true"
      className={classNames(
        'inline-flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-brand-green-light text-[13px] font-semibold text-brand-green',
        className
      )}
    >
      {initials}
    </span>
  );
};

/*
 * OrgResultRow - one organisation row inside the results / suggestion / selected card.
 * Figma "Org result" 7374:4810 (681x74, gap 12, p 16/12, r10): logo 40, name
 * 16/28 medium #111, sub-line 12/20 #babab7, badge pill (#ebf1ec, text #2a5730 12/20,
 * px8 py4). `active` = keyboard/hover highlight, `tinted` = fill #ebf1ec @50%
 * (best match / selected rows).
 * Rendered as role="option" so the parent listbox owns the semantics.
 */
const OrgResultRow = ({
  id,
  name,
  subline,
  badge,
  tinted = false,
  active = false,
  selected,
  onSelect,
  onHover,
}) => (
  <div
    id={id}
    role="option"
    aria-selected={selected ?? active}
    tabIndex={-1}
    onMouseEnter={onHover}
    onClick={onSelect}
    className={classNames(
      'flex cursor-pointer items-center gap-3 rounded-[10px] px-4 py-3 text-left transition-colors duration-100',
      'max-md:items-start max-md:px-3',
      tinted ? 'bg-brand-green-light/50' : 'hover:bg-brand-green-light/50',
      active &&
        'bg-brand-green-light/50 outline-2 -outline-offset-2 outline-brand-green-light-active'
    )}
  >
    <OrgLogo name={name} />
    <span className="flex min-w-0 flex-1 flex-col gap-0.5">
      <span
        className="font-sans text-[16px] font-medium leading-7 text-[#111111] max-md:leading-6"
        style={{ letterSpacing: '0.2px' }}
      >
        {name}
      </span>
      <span
        className="font-sans text-[12px] leading-5 text-[#babab7]"
        style={{ letterSpacing: '0.2px' }}
      >
        {subline}
      </span>
    </span>
    {badge && (
      <span
        className="inline-flex shrink-0 items-center rounded-full bg-brand-green-light px-2 py-1 font-sans text-[12px] font-medium leading-5 text-brand-green-dark"
        style={{ letterSpacing: '0.2px' }}
      >
        {badge}
      </span>
    )}
  </div>
);

export default OrgResultRow;
