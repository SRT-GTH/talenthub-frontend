import { useEffect } from 'react';
import Toast from '../../ui/Toast.jsx';
import { debug } from '../../../utils/debug.js';
import { useMediaQuery } from '../../../hooks/useMediaQuery.js';
import CommunityIcon from './CommunityIcon.jsx';
import { icons } from './communityIcons.js';
import { COMMUNITY_GUIDELINES } from './communityData.js';

const log = debug('GuidelinesToast');

/*
 * GuidelinesToast — the community guidelines banner.
 * Source: Figma `Component 31` = node 7062:54239.
 *
 * NOTE ON THAT NODE ID: it was flagged in the brief as suspicious because its
 * first segment (7062) differs from every neighbouring 7025:xxxxx id. It
 * resolves cleanly — it is a separate shared component definition living
 * inside the same file, parented under `Group 14139` (7062:54227) which
 * floats above frame 7025:86093. Not a typo.
 *
 * Figma geometry: 445x79, #ebf1ec fill, 1px #387440 BOTTOM border only, r12,
 * drop-shadow 0 2px 2.8px rgba(56,116,64,.24), pl16 pr14 py12, gap 48.
 * That is exactly the shared Toast system's `compact` + `variant="success"`
 * styling (Figma 5132:45989).
 *
 * Corrected 2026-09-18, second pass: a first pass rendered `ToastItem`
 * directly (no portal), reasoning that Figma's own frame shows this banner
 * sitting inline above the hero, pushing it down. Product feedback overrode
 * that: every toast in this app is a floating, portaled notification with
 * its own dim scrim (see Toast.jsx's own docs), and this one should be no
 * exception — it must not reserve layout space or shift the hero down. Now
 * renders through the real `Toast` default export (portals to
 * `#toast-root`, fixed-positioned, `position="top-center"`), not just the
 * raw `ToastItem` primitive. `icon` still overrides the variant's default
 * check glyph with this banner's own clipboard-check icon.
 *
 * Frame 7025:86093 shows this toast; the otherwise identical frame
 * 7025:86728 does not — i.e. it is the dismissible first-visit state.
 */

const GuidelinesToast = ({ open, onDismiss, className }) => {
  useEffect(() => {
    log('visibility:', open ? 'shown' : 'hidden');
  }, [open]);

  const isPhone = useMediaQuery('(max-width: 767.98px)');

  if (!open) return null;

  // Phones: the floating, scrim-backed toast sat on top of the hero title until
  // dismissed. Here it is a slim in-flow banner (title + two lines) with a
  // dismiss button, so nothing is covered.
  if (isPhone) {
    return (
      <div
        role="status"
        className={`flex w-full items-start gap-[8px] rounded-[10px] border border-b-[2px] border-brand-green-light-active border-b-brand-green bg-brand-green-light px-[10px] py-[8px] ${className ?? ''}`}
      >
        <span className="mt-[1px] shrink-0">
          <CommunityIcon src={icons.clipboardCheck} size={18} />
        </span>
        <p className="min-w-0 flex-1 font-sans text-[12px] leading-4 text-[#2a5730]">
          <span className="font-semibold">{COMMUNITY_GUIDELINES.title}. </span>
          <span className="line-clamp-2">{COMMUNITY_GUIDELINES.body}</span>
        </p>
        <button
          type="button"
          aria-label="Dismiss guidelines"
          onClick={() => {
            log('dismissed by user (phone banner)');
            onDismiss?.();
          }}
          className="relative -mr-[2px] grid size-[24px] shrink-0 place-items-center text-[#2a5730] after:absolute after:-inset-2.5"
        >
          <span aria-hidden="true" className="text-[16px] leading-none">
            ×
          </span>
        </button>
      </div>
    );
  }

  return (
    <Toast
      id="community-guidelines"
      position="top-center"
      // DashboardTopNav is a fixed ~68-90px-tall bar; the default top-center
      // offset (24px) sat underneath/overlapping it, so this clears it.
      offsetClassName="!top-[100px] max-lg:!top-[80px]"
      variant="success"
      compact
      stacked
      duration={0}
      icon={<CommunityIcon src={icons.clipboardCheck} size={22} />}
      title={COMMUNITY_GUIDELINES.title}
      body={<span className="block max-w-[470px] leading-[1.3]">{COMMUNITY_GUIDELINES.body}</span>}
      onDismiss={() => {
        log('dismissed by user');
        onDismiss?.();
      }}
      className={`w-[min(445px,calc(100vw-32px))] ${className ?? ''}`}
    />
  );
};

export default GuidelinesToast;
