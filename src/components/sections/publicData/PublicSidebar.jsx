import { Link } from 'react-router-dom';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import gthLogo from '../../../assets/public-data/gth-logo.png';
import { PARTNER_SIGN_IN_ROUTE, PRIMARY_NAV, SECONDARY_NAV } from './publicDataNav.js';
import {
  PublicIconChart,
  PublicIconCompany,
  PublicIconHome,
  PublicIconInfo,
  PublicIconLogin,
  PublicIconMail,
  PublicIconMap,
  PublicIconOverview,
  PublicIconToggle,
  PublicIconUsers,
} from './publicDataIcons.jsx';

const log = debug('PublicSidebar');

const ICONS = {
  home: PublicIconHome,
  overview: PublicIconOverview,
  map: PublicIconMap,
  users: PublicIconUsers,
  chart: PublicIconChart,
  company: PublicIconCompany,
  info: PublicIconInfo,
  mail: PublicIconMail,
};

const FOCUS =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]';

/*
 * PublicSidebar — Figma "T8 · Public sidebar" (8514:10 expanded 288, 8513:354635 rail 80, 8515:198 drawer 300), Focused style.
 * variant: 'expanded' | 'rail'. The drawer reuses the expanded markup at 300px (the mobile frame draws it that way).
 * Props: variant, activeId, onModal(name) opens a modal item (Monthly digest), onToggle() collapses / expands (desktop),
 *        onNavigate() fires after a link is followed (closes the mobile drawer), className.
 * ⚠️ ASSUMPTION: Figma draws no control to expand the rail on desktop, so the logo tile of a desktop rail doubles as the expand button.
 */

const NavItem = ({ item, active, variant, onModal, onNavigate }) => {
  const Glyph = ICONS[item.icon];
  const rail = variant === 'rail';
  const cls = classNames(
    'flex items-center text-left transition-colors',
    FOCUS,
    rail
      ? 'size-[46px] justify-center rounded-[12px]'
      : 'h-[44px] w-full gap-[11px] rounded-[10px] px-[12px] py-[10px] font-sans text-[14px] leading-[24px] tracking-[0.2px]',
    active
      ? rail
        ? 'bg-[#ebf1ec]'
        : 'bg-[#387440] font-semibold text-white'
      : classNames('hover:bg-[#ebf1ec]', !rail && 'font-normal text-[#70706e]')
  );
  const glyph = (
    <Glyph
      className={classNames(
        rail ? 'size-[22px]' : 'size-[20px] shrink-0',
        active && !rail ? 'text-white' : 'text-[#387440]'
      )}
    />
  );
  const content = (
    <>
      {glyph}
      {rail ? (
        <span className="sr-only">{item.label}</span>
      ) : (
        <span className="min-w-0 flex-1">{item.label}</span>
      )}
    </>
  );
  if (item.modal) {
    return (
      <button
        type="button"
        className={cls}
        title={rail ? item.label : undefined}
        onClick={() => {
          log('nav modal', item.modal);
          onModal?.(item.modal);
        }}
      >
        {content}
      </button>
    );
  }
  return (
    <Link
      to={item.to}
      className={cls}
      aria-current={active ? 'page' : undefined}
      title={rail ? item.label : undefined}
      onClick={() => {
        log('nav', item.id);
        onNavigate?.();
      }}
    >
      {content}
    </Link>
  );
};

const SectionLabel = ({ children }) => (
  <p className="m-0 font-sans text-[11px] font-semibold leading-[13px] tracking-[0.88px] text-[#595959] uppercase">
    {children}
  </p>
);

const PartnerCard = ({ onNavigate }) => (
  <div className="flex flex-col gap-[8px] rounded-[16px] bg-[#ebf1ec] p-[16px]">
    <p className="m-0 font-sans text-[14px] leading-[17px] font-semibold text-[#2a5730]">
      For partners &amp; recruiters
    </p>
    <p className="m-0 font-sans text-[12px] leading-[17px] text-[#2a5730]">
      Search consented talent profiles after verification.
    </p>
    <Link
      to={PARTNER_SIGN_IN_ROUTE}
      onClick={onNavigate}
      className={classNames(
        'mt-[4px] inline-flex h-[48px] items-center justify-center rounded-[14px] border-2 border-solid border-[#1c2a21]/30 bg-white px-[22px] font-sans text-[16px] leading-[24px] font-bold tracking-[0.1px] text-[#1c2a21] shadow-[0_4px_0_rgba(28,42,33,0.3)]',
        FOCUS
      )}
    >
      Partner sign-in →
    </Link>
  </div>
);

const PublicSidebar = ({
  variant = 'expanded',
  activeId,
  onModal,
  onToggle,
  onNavigate,
  className,
}) => {
  log('render', { variant, activeId });
  const rail = variant === 'rail';

  if (rail) {
    return (
      <nav
        aria-label="Public data"
        className={classNames(
          'flex h-full w-[80px] shrink-0 flex-col items-center gap-[20px] border-r border-solid border-[#e7e7e7] bg-white px-[12px] py-[24px]',
          className
        )}
      >
        <div className="flex w-full flex-col items-center gap-[22px]">
          <Link
            to="/data"
            aria-label="Ghana Talent Hub public data home"
            className={classNames('flex rounded-[8px]', FOCUS)}
            onClick={onNavigate}
          >
            <img src={gthLogo} alt="" width="42" height="39" className="h-[39px] w-[42px]" />
          </Link>
          {onToggle ? (
            <button
              type="button"
              onClick={onToggle}
              aria-label="Expand sidebar"
              className={classNames(
                'hidden size-[28px] items-center justify-center rounded-[8px] text-[#999999] hover:bg-[#ebf1ec] xl:flex',
                FOCUS
              )}
            >
              <PublicIconToggle className="h-[20px] w-[23px] rotate-180" />
            </button>
          ) : null}
          <div className="flex flex-col gap-[4px]">
            {PRIMARY_NAV.map((item) => (
              <NavItem
                key={item.id}
                item={item}
                variant="rail"
                active={item.id === activeId}
                onNavigate={onNavigate}
              />
            ))}
          </div>
          <div className="h-px w-[40px] bg-[#e7e7e7]" />
          <div className="flex flex-col gap-[4px]">
            {SECONDARY_NAV.map((item) => (
              <NavItem
                key={item.id}
                item={item}
                variant="rail"
                active={item.id === activeId}
                onModal={onModal}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        </div>
        <Link
          to={PARTNER_SIGN_IN_ROUTE}
          aria-label="Partner sign-in"
          title="Partner sign-in"
          onClick={onNavigate}
          className={classNames(
            'mt-auto flex size-[46px] items-center justify-center rounded-[12px] bg-[#ebf1ec] text-[#387440]',
            FOCUS
          )}
        >
          <PublicIconLogin className="size-[22px]" />
        </Link>
      </nav>
    );
  }

  return (
    <nav
      aria-label="Public data"
      className={classNames(
        'flex h-full w-[288px] shrink-0 flex-col gap-[20px] border-r border-solid border-[#e7e7e7] bg-white px-[26px] py-[24px]',
        className
      )}
    >
      <div className="relative flex flex-col gap-[22px]">
        <Link
          to="/data"
          onClick={onNavigate}
          className={classNames('flex items-center gap-[12px] rounded-[8px]', FOCUS)}
        >
          <img src={gthLogo} alt="" width="42" height="39" className="h-[39px] w-[42px] shrink-0" />
          <span className="flex flex-col">
            <span className="font-sans text-[16px] leading-[19px] font-bold text-[#1c2a21]">
              Ghana Talent Hub
            </span>
            <span className="font-sans text-[12px] leading-[14px] font-medium text-[#595959]">
              Public data
            </span>
          </span>
        </Link>
        {onToggle ? (
          <button
            type="button"
            onClick={onToggle}
            aria-label="Collapse sidebar"
            className={classNames(
              'absolute top-[10px] right-0 hidden size-[28px] items-center justify-center rounded-[8px] text-[#999999] hover:bg-[#ebf1ec] xl:flex',
              FOCUS
            )}
          >
            <PublicIconToggle className="h-[20px] w-[23px]" />
          </button>
        ) : null}
        <div className="flex flex-col gap-[4px]">
          <SectionLabel>Explore</SectionLabel>
          {PRIMARY_NAV.map((item) => (
            <NavItem
              key={item.id}
              item={item}
              variant="expanded"
              active={item.id === activeId}
              onNavigate={onNavigate}
            />
          ))}
        </div>
        <div className="h-px w-full bg-[#e7e7e7]" />
        <div className="flex flex-col gap-[4px]">
          <SectionLabel>About the data</SectionLabel>
          {SECONDARY_NAV.map((item) => (
            <NavItem
              key={item.id}
              item={item}
              variant="expanded"
              active={item.id === activeId}
              onModal={onModal}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      </div>
      <div className="mt-auto">
        <PartnerCard onNavigate={onNavigate} />
      </div>
    </nav>
  );
};

export default PublicSidebar;
