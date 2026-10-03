import { useEffect } from 'react';
import Toast from '../../ui/Toast.jsx';
import { debug } from '../../../utils/debug.js';
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

  if (!open) return null;

  return (
    <Toast
      id="community-guidelines"
      position="top-center"
      // DashboardTopNav is a fixed ~68-90px-tall bar; the default top-center
      // offset (24px) sat underneath/overlapping it, so this clears it.
      offsetClassName="!top-[100px]"
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
