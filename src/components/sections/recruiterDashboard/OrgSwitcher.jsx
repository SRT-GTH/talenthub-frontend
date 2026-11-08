import { useEffect, useRef } from 'react';
import { classNames } from '../../../utils/classNames.js';
import { dashIcons, orgMarks } from './recruiterDashboardIcons.js';
import { ORGS, ORG_SWITCHER } from './recruiterDashboardData.js';

/*
 * OrgSwitcher — "Recruiting on behalf of" control in the top bar (Figma "Org switcher" 10049:59479 + menu 10049:60984).
 * Trigger: 50px high, 10px radius, #fffefc face, 1px #dbded9 border, the org mark (24px, 6px radius), a 10px caption and the 14/600 org name, then a chevron.
 * `single` (D05) drops the chevron and the menu: one affiliation means nothing to switch.
 * Menu (340px): "Your organisations", one row per org (mark, name, plan line, check on the current one, a "Pending" chip for Zeepay), a divider and
 * "Request affiliation with an organisation". Props: org (current), open, single, onOpenChange, onSelect(orgId), onRequest.
 */
const Mark = ({ org, size }) => (
  <img
    src={org.logoUrl || orgMarks[org.logo]}
    alt=""
    aria-hidden="true"
    style={{ width: size, height: size }}
    className={classNames(
      'shrink-0 object-cover',
      org.logo === 'personal' ? 'rounded-full' : 'rounded-[6px]'
    )}
  />
);

const OrgSwitcher = ({
  org,
  open,
  single = false,
  onOpenChange,
  onSelect,
  onRequest,
  className,
}) => {
  const rootRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) onOpenChange?.(false);
    };
    const onKey = (event) => {
      if (event.key === 'Escape') onOpenChange?.(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, onOpenChange]);

  const trigger = (
    <>
      <Mark org={org} size={24} />
      <span className="flex min-w-0 flex-col text-left">
        <span className="font-sans text-[10px] leading-[16px] tracking-[0.2px] whitespace-nowrap text-[#575755] max-lg:text-[12px]">
          {ORG_SWITCHER.caption}
        </span>
        <span className="truncate font-sans text-[14px] leading-[24px] font-semibold text-[#111]">
          {org.name}
        </span>
      </span>
    </>
  );

  const base =
    'flex h-[50px] min-w-0 items-center gap-[12px] rounded-[10px] border border-solid border-[#dbded9] bg-[#fffefc] px-[12px] py-[4px]';

  if (single) {
    return (
      <div className={classNames(base, 'pr-[16px]', className)} data-testid="org-switcher-single">
        {trigger}
      </div>
    );
  }

  return (
    <div ref={rootRef} className={classNames('relative', className)}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => onOpenChange?.(!open)}
        className={classNames(
          base,
          'w-full cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green',
          open && 'border-[#387440]'
        )}
      >
        {trigger}
        <img
          src={dashIcons.chevronDown}
          alt=""
          aria-hidden="true"
          className="ml-auto size-[14px] shrink-0"
        />
      </button>

      {open ? (
        <div
          role="menu"
          aria-label={ORG_SWITCHER.heading}
          className="absolute top-[calc(100%+8px)] right-0 z-40 flex w-[340px] max-w-[calc(100vw-32px)] flex-col rounded-[14px] border border-solid border-[#e5e8e3] bg-white p-[12px] shadow-[0_16px_40px_-8px_rgba(15,15,10,0.2),0_2px_6px_rgba(15,15,10,0.06)]"
        >
          <div className="px-[8px] pt-[4px] pb-[8px] font-sans text-[12px] leading-[20px] font-medium tracking-[0.2px] text-[#575755]">
            {ORG_SWITCHER.heading}
          </div>
          {ORGS.map((item) => {
            const current = item.id === org.id;
            const pendingOrg = item.status === 'pending';
            return (
              <div key={item.id}>
                {item.id === 'none' ? (
                  <hr className="mx-0 my-[6px] h-px border-0 bg-[#e5e8e3]" />
                ) : null}
                <button
                  type="button"
                  role="menuitemradio"
                  aria-checked={current}
                  onClick={() => onSelect?.(item.id)}
                  className={classNames(
                    'flex w-full cursor-pointer items-center gap-[12px] rounded-[10px] border-0 px-[8px] py-[8px] text-left focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-brand-green',
                    current ? 'bg-[#ebf1ec]' : 'bg-transparent hover:bg-[#f8f8f4]'
                  )}
                >
                  <Mark org={item} size={30} />
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span
                      className={classNames(
                        'font-sans text-[14px] leading-[17px] tracking-[0.1px] text-[#111]',
                        item.id === 'none' ? 'font-normal' : 'font-medium'
                      )}
                    >
                      {item.name}
                    </span>
                    <span className="font-sans text-[12px] leading-[16px] tracking-[0.2px] text-[#575755]">
                      {item.meta}
                    </span>
                  </span>
                  {current ? (
                    <img
                      src={dashIcons.checkActive}
                      alt=""
                      aria-hidden="true"
                      className="size-[16px] shrink-0"
                    />
                  ) : null}
                  {pendingOrg ? (
                    <span className="inline-flex h-[24px] shrink-0 items-center gap-[4px] rounded-full border border-solid border-[#eedeb8] bg-[#faf4e8] px-[8px] font-sans text-[12px] leading-[14px] font-medium text-[#785910]">
                      <img
                        src={dashIcons.clockInReview}
                        alt=""
                        aria-hidden="true"
                        className="size-[12px]"
                      />
                      {item.badge}
                    </span>
                  ) : null}
                </button>
              </div>
            );
          })}
          <hr className="mx-0 my-[6px] h-px border-0 bg-[#e5e8e3]" />
          <button
            type="button"
            role="menuitem"
            onClick={onRequest}
            className="flex w-full cursor-pointer items-center gap-[10px] rounded-[10px] border-0 bg-transparent px-[8px] py-[12px] text-left font-sans text-[14px] max-sm:gap-[6px] max-sm:px-[4px] max-sm:text-[13px] leading-[24px] text-[#111] hover:bg-[#f8f8f4] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-brand-green"
          >
            <img
              src={dashIcons.plusPostOpportunity}
              alt=""
              aria-hidden="true"
              className="size-[18px]"
            />
            {ORG_SWITCHER.request}
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default OrgSwitcher;
