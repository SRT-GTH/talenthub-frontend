import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import { AX_SHARE } from './ProfileAxData.js';
import { queryVisible, rectOf, useAxMeasure } from './ProfileAxUtils.js';

const log = debug('ProfileShareModalNotes');

const SURFACE =
  'shadow-[0_1px_2px_rgba(28,42,33,0.04),0_2px_8px_rgba(28,42,33,0.04)] playful:shadow-[4px_4px_0_rgba(28,42,33,0.45),0_10px_24px_rgba(28,42,33,0.06)]';

const measure = () => ({
  copy: rectOf(queryVisible('[data-ax="share-copy-link"]')),
  vw: window.innerWidth,
  vh: window.innerHeight,
});

/*
 * ProfileShareModalNotes — AX-08 extras around the Share modal (Figma Playful 7592:4005 / Focused 8110:395519):
 * the focus ring on "Copy link" and the dark "Dialog rules" card, both above the scrim. The keyboard-hint
 * row lives inside the modal itself (ShareProfileMain `keyboardHints`, shown when `ax=share-modal`).
 */
const ProfileShareModalNotes = ({ profile }) => {
  const m = useAxMeasure(measure);

  useEffect(() => {
    log('mount', { ax: profile?.ax, share: profile?.share });
  }, [profile?.ax, profile?.share]);

  if (!m) return null;
  const { copy, vw, vh } = m;
  // Figma: the card sits right of the 720px modal (x 1308) — only if there is room, else a bottom sheet.
  const beside = vw >= 1560;

  return createPortal(
    <div data-pf-portal="" className="pointer-events-none">
      {copy ? (
        <span
          aria-hidden="true"
          className="fixed z-[75] rounded-[14px] shadow-[0_0_0_1px_#387440,0_0_0_2px_#fff] playful:shadow-[0_0_0_3px_#387440,0_0_0_2px_#fff]"
          style={{
            left: copy.x - 4,
            top: copy.y - 4,
            width: copy.w + 8,
            height: copy.h + 8,
          }}
        />
      ) : null}
      <section
        aria-label={AX_SHARE.title}
        className={classNames(
          'fixed z-[75] flex w-[380px] max-w-[calc(100vw-24px)] flex-col gap-[8px] rounded-[16px] bg-[#1c2a21] p-[18px] leading-[normal]',
          SURFACE,
          beside ? 'right-[40px]' : 'right-[12px] bottom-[12px] max-h-[30vh] overflow-y-auto'
        )}
        style={beside ? { top: Math.min(568, vh - 220) } : undefined}
      >
        <h2 className="m-0 text-[15px] leading-[18px] font-bold text-[#ffd86b]">
          {AX_SHARE.title}
        </h2>
        {AX_SHARE.lines.map((line) => (
          <p key={line} className="m-0 text-[12px] leading-[14px] text-white">
            {line}
          </p>
        ))}
      </section>
    </div>,
    document.body
  );
};

export default ProfileShareModalNotes;
