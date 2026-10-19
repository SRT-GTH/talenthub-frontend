import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import NotifButton from './NotifButton.jsx';
import { HELP_COPY as HELP_COPY_DEFAULT, HELP_COPY_PROFILE } from './notificationsData.js';
import { JobsHelpCopy } from '../talentJobs/talentJobsData.js';
import { STREAK_HELP_COPY } from '../talentStreak/talentStreakData.js';
import { SKILLS_LAB_HELP_COPY } from '../talentSkillsLab/skillsLabData.js';
import { ASSESSMENT_HELP_COPY } from '../talentAssessment/assessmentData.js';
import rowHelp from '../../../assets/notifications/help/row-help.svg';
import rowShield from '../../../assets/notifications/help/row-shield.svg';
import rowInfo from '../../../assets/notifications/help/row-info.svg';
import rowVerified from '../../../assets/notifications/help/row-verified.svg';
import rowChevron from '../../../assets/notifications/help/row-chevron.svg';
import iconClose from '../../../assets/notifications/help/close.svg';
import iconSearch from '../../../assets/notifications/help/search.svg';
import iconBulb from '../../../assets/notifications/help/bulb.svg';
import iconWhatsapp from '../../../assets/notifications/help/whatsapp.svg';
import iconPlay from '../../../assets/notifications/help/play.svg';
import iconArrow from '../../../assets/notifications/help/arrow-right.svg';

const log = debug('HelpPopover');

/*
 * HelpPopover — Figma "HP · Help pop-over overlay" (Playful 8376:10396, Focused 8376:10516;
 * component `GTH · Help pop-over` 8376:10399). 400px card, r20, p20/20/16/20, gap 24, anchored under
 * the top-nav Help button (top = nav bottom − 14, like the notification pop-up). The Figma frame
 * also draws an invisible full-viewport "Click outside to close" layer — implemented as a
 * transparent backdrop here. Opened by `?help=1`.
 *
 * Props: home (useTalentHomeState object), anchorRef (Help button wrapper ref).
 */
const ROW_ICONS = { help: rowHelp, shield: rowShield, info: rowInfo, verified: rowVerified };

const HelpRow = ({ label, icon }) => (
  <button
    type="button"
    onClick={() => log('help row', label)}
    className="flex w-full items-center gap-[10px] rounded-[12px] border border-solid border-[#387440] bg-[#f7f8f4] py-[10px] pl-[12px] pr-[10px] text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
  >
    <img src={ROW_ICONS[icon]} alt="" aria-hidden="true" className="size-[16px] shrink-0" />
    <span className="min-w-0 flex-1 font-sans text-[14px] font-medium leading-[17px] text-[#1c2a21]">
      {label}
    </span>
    <img src={rowChevron} alt="" aria-hidden="true" className="size-[16px] shrink-0" />
  </button>
);

const Section = ({ label, rows }) => (
  <div className="flex flex-col gap-[8px]">
    <span className="font-sans text-[11px] font-semibold leading-[13px] tracking-[0.66px] text-[#387440] max-lg:text-[12px]">
      {label}
    </span>
    {rows.map((r) => (
      <HelpRow key={r.label} {...r} />
    ))}
  </div>
);

const HelpPopover = ({ home, anchorRef }) => {
  const open = Boolean(home?.helpOpen);
  // /profile (Figma HP 8376:19219 / 8376:19339) swaps only the page section; `home.helpPage` is set by the shell.
  const HELP_COPY =
    home?.helpPage === 'profile'
      ? HELP_COPY_PROFILE
      : home?.helpPage === 'jobs'
        ? JobsHelpCopy
        : home?.helpPage === 'streak'
          ? STREAK_HELP_COPY
          : home?.helpPage === 'skills-lab'
            ? SKILLS_LAB_HELP_COPY
            : home?.helpPage === 'assessment'
              ? ASSESSMENT_HELP_COPY
              : HELP_COPY_DEFAULT;
  const ref = useRef(null);
  const [pos, setPos] = useState({ top: 74, right: 24 });
  const close = () => {
    log('close');
    home.update({ help: null });
  };

  useLayoutEffect(() => {
    if (!open) return undefined;
    const place = () => {
      const btn = anchorRef?.current?.getBoundingClientRect();
      const bar = anchorRef?.current?.closest('header')?.getBoundingClientRect();
      if (!btn || !bar) return;
      setPos({ top: bar.bottom - 14, right: Math.max(12, window.innerWidth - btn.right) });
    };
    place();
    window.addEventListener('resize', place);
    return () => window.removeEventListener('resize', place);
  }, [open, anchorRef]);

  useEffect(() => {
    if (!open) return undefined;
    log('mount');
    const onKey = (e) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKey);
    ref.current?.focus();
    return () => document.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) return null;

  return (
    <>
      <div aria-hidden="true" className="fixed inset-0 z-40 max-lg:hidden" onMouseDown={close} />
      <div
        ref={ref}
        role="dialog"
        aria-label="Help"
        tabIndex={-1}
        className={classNames(
          'fixed z-50 flex w-[400px] outline-none max-lg:hidden max-w-[calc(100vw-24px)] flex-col gap-[24px] rounded-[20px] border border-solid border-[rgba(28,42,33,0.12)] bg-white pb-[16px] pl-[20px] pr-[20px] pt-[20px]',
          'shadow-[0_16px_40px_rgba(28,42,33,0.16),0_2px_6px_rgba(28,42,33,0.06)]'
        )}
        style={{ top: pos.top, right: pos.right }}
      >
        <div className="flex items-start gap-[12px]">
          <div className="flex min-w-0 flex-1 flex-col gap-[2px]">
            <h2 className="m-0 font-heading text-[22px] font-semibold leading-[26px] text-[#1c2a21]">
              {HELP_COPY.title}
            </h2>
            <p className="m-0 font-sans text-[13px] leading-[16px] text-[#595959]">
              {HELP_COPY.subtitle}
            </p>
          </div>
          <button
            type="button"
            aria-label="Close help"
            onClick={close}
            className="flex size-[34px] shrink-0 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
          >
            <img src={iconClose} alt="" aria-hidden="true" className="size-[18px]" />
          </button>
        </div>

        <label className="flex h-[48px] items-center gap-[12px] rounded-[8px] border border-solid border-[#dfdfdc] bg-white py-[10px] pl-[14px] pr-[12px] shadow-[0_1px_2px_rgba(28,42,33,0.04)]">
          <img src={iconSearch} alt="" aria-hidden="true" className="size-[20px] shrink-0" />
          <input
            type="search"
            placeholder={HELP_COPY.search}
            aria-label="Search help"
            className="min-w-0 flex-1 border-0 bg-transparent font-sans text-[14px] leading-[20px] tracking-[0.2px] text-[#1c2a21] outline-none placeholder:text-[#bfbfbf]"
          />
        </label>

        <Section label={HELP_COPY.pageLabel} rows={HELP_COPY.page} />
        <Section label={HELP_COPY.popularLabel} rows={HELP_COPY.popular} />

        <div className="flex gap-[8px]">
          <NotifButton
            size="help"
            tone="primary"
            icon={iconBulb}
            className="flex-1"
            onClick={() => log('ask buddy')}
          >
            {HELP_COPY.buddy}
          </NotifButton>
          <NotifButton
            size="help"
            tone="secondary"
            icon={iconWhatsapp}
            className="flex-1"
            onClick={() => log('whatsapp')}
          >
            {HELP_COPY.whatsapp}
          </NotifButton>
        </div>

        <div className="-mt-[8px] flex items-center justify-between gap-[8px] border-t border-solid border-[rgba(28,42,33,0.08)] pt-[24px]">
          <button
            type="button"
            className="inline-flex items-center gap-[6px] font-sans text-[13px] font-semibold leading-[16px] text-[#387440] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
          >
            <img src={iconPlay} alt="" aria-hidden="true" className="size-[16px]" />
            {HELP_COPY.replay}
          </button>
          <span className="inline-flex items-center gap-[6px] font-sans text-[13px] font-medium leading-[16px] text-[#595959]">
            {HELP_COPY.shortcuts}
            <kbd className="rounded-[6px] border border-solid border-[rgba(28,42,33,0.2)] bg-white px-[7px] py-[2px] font-sans text-[12px] font-semibold leading-[14px] text-[#1c2a21] shadow-[0_1.5px_0_rgba(28,42,33,0.18)]">
              ?
            </kbd>
          </span>
          <button
            type="button"
            className="inline-flex items-center gap-[4px] font-sans text-[13px] font-semibold leading-[16px] text-[#387440] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
          >
            {HELP_COPY.help}
            <img src={iconArrow} alt="" aria-hidden="true" className="size-[14px]" />
          </button>
        </div>
      </div>
    </>
  );
};

export default HelpPopover;
