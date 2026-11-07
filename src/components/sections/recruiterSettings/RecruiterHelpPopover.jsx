import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { debug } from '../../../utils/debug.js';
import HelpPopoverFlow from '../talentSettings/HelpPopoverFlow.jsx';
import KeyboardShortcutsModal from '../talentSettings/KeyboardShortcutsModal.jsx';
import SendFeedbackDialog from '../talentSettings/SendFeedbackDialog.jsx';
import InviteFriendDialog from '../talentSettings/InviteFriendDialog.jsx';
import { useRecruiterHelpState } from './help/useRecruiterHelpState.js';
import {
  RECRUITER_FEEDBACK,
  RECRUITER_HELP_PAGE_VALUES,
  RECRUITER_HELP_POPOVER_VALUES,
  RECRUITER_HELP_ROUTE,
  RECRUITER_INVITE,
  RECRUITER_SHORTCUTS_COPY,
  recruiterPopoverData,
} from './help/recruiterHelpData.js';

const log = debug('RecruiterHelpPopover');

/*
 * RecruiterHelpPopover - the recruiter top-bar "?" pop-over and its companions, rendered into `DashboardTopNav panels.help` (anchored under the "?" button)
 * by `/recruiter/settings` and, through `useRecruiterHelpPanels()`, by `/recruiter/job-postings` (where Figma draws it). State is the URL:
 *   ?help=page|searching|none   R-HP-01 / 02 / 03  the 400px pop-over (talent `HelpPopoverFlow` with the recruiter data)
 *   ?help=shortcuts             R-HP-08            keyboard-shortcuts modal (the "?" key opens it too)
 *   ?help=article|report|contact|sent   pages of the Help centre: redirected to /recruiter/help?help=<same> when opened elsewhere
 *   ?modal=feedback | ?modal=invite     R-FB-01 / R-IV-01  dialogs (talent SendFeedbackDialog / InviteFriendDialog with the recruiter copy)
 * Props: none required (`settings` from the Settings page is ignored: the Help set reads the URL itself). Wiki: recruiter-settings-help.md.
 * Not drawn / not wired: "Ask Hiring Assistant", "WhatsApp us" and "Replay the recruiter tour" only log (no destination exists).
 */
const RecruiterHelpPopover = () => {
  const state = useRecruiterHelpState();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const anchorRef = useRef(null);
  const cardRef = useRef(null);
  const [pos, setPos] = useState({ top: 74, right: 24 });
  const { help, modal } = state;

  const isPage = RECRUITER_HELP_PAGE_VALUES.includes(help);
  const isShortcuts = help === 'shortcuts';
  const isPopover = Boolean(help) && !isPage && !isShortcuts;
  // `?help=page|searching|none` as drawn; any other non-empty value (the "?" button's open flag) shows the default pop-over.
  const flow = RECRUITER_HELP_POPOVER_VALUES.includes(help) ? help : 'page';
  const data = useMemo(() => recruiterPopoverData(pathname), [pathname]);

  const close = () => {
    log('close');
    state.update({ help: null, q: null });
  };
  const closeModal = () => {
    log('close dialog', modal);
    state.update({ modal: null });
  };

  // Anchor: top = the top bar's bottom - 14, right edge = the "?" button's right edge (like the talent pop-over).
  useLayoutEffect(() => {
    if (!isPopover) return undefined;
    const place = () => {
      const btn = anchorRef.current?.parentElement
        ?.querySelector('button')
        ?.getBoundingClientRect();
      const bar = anchorRef.current?.closest('header')?.getBoundingClientRect();
      if (!btn || !bar) return;
      const next = { top: bar.bottom - 14, right: Math.max(12, window.innerWidth - btn.right) };
      log('anchor', next);
      setPos(next);
    };
    place();
    window.addEventListener('resize', place);
    return () => window.removeEventListener('resize', place);
  }, [isPopover]);

  useEffect(() => {
    if (!isPopover) return undefined;
    log('open', { flow, q: state.q, pathname });
    const onKey = (e) => {
      if (e.key === 'Escape') {
        log('escape');
        state.update({ help: null, q: null });
      }
    };
    document.addEventListener('keydown', onKey);
    cardRef.current?.focus();
    return () => document.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPopover]);

  // "Press ? any time" opens the shortcuts modal (R-HP-08), except while typing.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== '?' || e.metaKey || e.ctrlKey || e.altKey) return;
      const el = e.target;
      const tag = el?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || el?.isContentEditable)
        return;
      log('? pressed -> shortcuts');
      state.update({ help: 'shortcuts', q: null });
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [state]);

  // article / report / contact / sent are pages of the Help centre.
  useEffect(() => {
    if (!isPage || pathname === RECRUITER_HELP_ROUTE) return;
    log('branch: redirect to the Help centre', help);
    navigate(`${RECRUITER_HELP_ROUTE}?help=${help}`, { replace: true });
  }, [isPage, help, pathname, navigate]);

  return (
    <>
      <span ref={anchorRef} hidden />
      {isShortcuts && <KeyboardShortcutsModal copy={RECRUITER_SHORTCUTS_COPY} onClose={close} />}
      {isPopover && (
        <HelpPopoverFlow
          home={state}
          flow={flow}
          q={state.q}
          pos={pos}
          cardRef={cardRef}
          close={close}
          data={data}
        />
      )}
      {modal === 'feedback' && (
        <SendFeedbackDialog copy={RECRUITER_FEEDBACK} onClose={closeModal} />
      )}
      {modal === 'invite' && (
        <InviteFriendDialog
          copy={RECRUITER_INVITE}
          linkClassName="font-sans text-[16px]"
          onClose={closeModal}
        />
      )}
    </>
  );
};

export default RecruiterHelpPopover;
