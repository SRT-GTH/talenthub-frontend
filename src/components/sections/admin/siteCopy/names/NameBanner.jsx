import { classNames } from '../../../../../utils/classNames.js';
import { InfoIcon, WarningIcon } from './NameIcons.jsx';

/*
 * NameBanner — the 16 px-radius notice bars of the Product names screens:
 *   blue   #eaeffb, info glyph #1f5fa8, text 14/500 #244a9f — "Names in page text are “name chips”…" under the list (7.8.6a)
 *   amber  #faf4e8, warning glyph #8a6100, text 14/500 #463409 — "Ask a super admin to publish name changes…" (7.8.6e), with an action on the
 *          right; also the info variant (`icon="info"`) inside the rename drawer: "You can draft this rename. A super admin publishes it." (7.8.6b)
 * Props: tone ('blue' | 'amber'), icon ('info' | 'warning', default by tone), action (node, right side; wraps under the text on phones), children.
 */
const TONES = {
  blue: { bg: 'bg-[#eaeffb]', ink: 'text-[#244a9f]', glyph: 'text-[#1f5fa8]', icon: 'info' },
  amber: { bg: 'bg-[#faf4e8]', ink: 'text-[#463409]', glyph: 'text-[#8a6100]', icon: 'warning' },
};

const NameBanner = ({ tone = 'blue', icon, action, children, role }) => {
  const t = TONES[tone];
  const Glyph = (icon ?? t.icon) === 'warning' ? WarningIcon : InfoIcon;
  return (
    <div
      role={role}
      className={classNames(
        'flex flex-wrap items-center gap-x-[12px] gap-y-[12px] rounded-[16px] p-[16px] md:flex-nowrap',
        t.bg
      )}
    >
      <span className="flex min-w-0 flex-1 basis-[240px] items-start md:basis-0 gap-[12px]">
        <Glyph className={classNames('-m-[1px] size-[20px] shrink-0', t.glyph)} />
        <span
          className={classNames(
            'font-sans text-[14px] leading-[20px] font-medium max-lg:text-[14px]',
            t.ink
          )}
        >
          {children}
        </span>
      </span>
      {action ? <span className="shrink-0 max-md:w-full md:flex-1">{action}</span> : null}
    </div>
  );
};

export default NameBanner;
