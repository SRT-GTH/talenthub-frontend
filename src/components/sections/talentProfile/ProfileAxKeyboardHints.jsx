import { useEffect } from 'react';
import { debug } from '../../../utils/debug.js';
import { ProfileAxArrowLeftIcon } from './AxAnnotationIcons.jsx';
import { AX_SHARE } from './ProfileAxData.js';

const log = debug('ShareKeyboardHints');

const Kbd = ({ children, icon }) => (
  <kbd
    className={`inline-flex h-[21px] items-center rounded-[6px] border border-[#bfbfbf] bg-white px-[7px] py-[3px] font-[inherit] text-[11px] leading-[13px] font-semibold text-[#1c2a21] max-lg:text-[12px] ${icon ? 'gap-[5px]' : ''}`}
  >
    {children}
  </kbd>
);

/*
 * ShareKeyboardHints — the "keyboard hint" row at the bottom of the Share modal in AX-08
 * (Figma Playful 7592:5128 / Focused 8110:396539): Tab move · Enter copy / open · ← → channels · Esc close.
 */
export const ShareKeyboardHints = () => {
  useEffect(() => {
    log('mount');
  }, []);
  return (
    <div className="flex w-full flex-wrap items-center gap-x-[14px] gap-y-[6px] rounded-[12px] bg-[#f8f8f4] px-[14px] py-[10px] leading-[normal]">
      {AX_SHARE.keys.map((k) => (
        <span key={k.key} className="inline-flex items-center gap-[6px]">
          <Kbd icon={k.keys.length > 1}>
            {k.keys.map((part) =>
              part === 'arrow-left' ? (
                <ProfileAxArrowLeftIcon key={part} className="size-[13px] shrink-0" />
              ) : (
                part
              )
            )}
          </Kbd>
          <span className="text-[12px] leading-[14px] text-[#595959]">{k.label}</span>
        </span>
      ))}
    </div>
  );
};

export default ShareKeyboardHints;
