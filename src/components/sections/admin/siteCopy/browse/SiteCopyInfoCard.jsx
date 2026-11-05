import { classNames } from '../../../../../utils/classNames.js';
import { BrowseInfoIcon, BrowseLockBannerIcon } from './SiteCopyBrowseIcons.jsx';

/*
 * SiteCopyInfoCard — the white card on the right of the Site copy list that explains the current view (Figma "hint": r20, p28, gap 14, 1px ink@.10): a 19/600
 * title, a 14/21 #575755 paragraph, then an optional banner (blue with the info icon, or grey with a lock) and / or an action (the buttons of 7.8.1f / 7.8.1i).
 * Props: title, text, banner { tone: 'blue' | 'grey', text }, action (node), children, className.
 */
const BANNERS = {
  blue: { box: 'bg-[#eaeffb] text-[#244a9f]', Icon: BrowseInfoIcon, icon: 'text-[#1f5fa8]' },
  grey: { box: 'bg-[#f8f8f4] text-[#575755]', Icon: BrowseLockBannerIcon, icon: 'text-[#575755]' },
};

export const SiteCopyBanner = ({ tone = 'blue', children, className }) => {
  const def = BANNERS[tone] ?? BANNERS.blue;
  const Glyph = def.Icon;
  return (
    <div
      className={classNames(
        'flex items-center gap-[12px] rounded-[16px] p-[16px] font-sans text-[14px] leading-[20px] font-medium',
        def.box,
        className
      )}
    >
      <Glyph className={classNames('size-[18px] shrink-0', def.icon)} />
      <span className="min-w-0 flex-1">{children}</span>
    </div>
  );
};

const SiteCopyInfoCard = ({ title, text, banner, action, children, className }) => (
  <section
    className={classNames(
      'flex min-w-0 flex-1 flex-col gap-[14px] rounded-[20px] border border-solid border-[#1c2a21]/10 bg-white p-[clamp(20px,2.2vw,28px)] font-sans',
      'self-start max-lg:w-full',
      className
    )}
  >
    <h2 className="m-0 text-[19px] leading-[23px] font-semibold text-[#1c2a21]">{title}</h2>
    {text ? <p className="m-0 text-[14px] leading-[21px] text-[#575755]">{text}</p> : null}
    {banner ? <SiteCopyBanner tone={banner.tone}>{banner.text}</SiteCopyBanner> : null}
    {action ? <div className="flex flex-wrap items-center gap-[12px]">{action}</div> : null}
    {children}
  </section>
);

export default SiteCopyInfoCard;
