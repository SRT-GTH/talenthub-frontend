import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import Button from '../../../ui/Button.jsx';
import { LabArrowRightIcon } from '../LabPlayIcons.jsx';
import { FOCUS_RING } from '../labPlayStyles.js';

const log = debug('GameV2Footer');

/*
 * GameV2Footer — the 88px sticky footer of every Games v2 play frame (Figma "Footer" 1728x88, white, 1px #e7e7e7 top).
 * Left: the note (13/16 #6b6b6b, x=64). Right: [link] [secondary] [primary], 12px apart.
 *   note       string                                   "Your game saves as you play. You can resume within 24 hours."
 *   link       { label, onClick, disabled, size?:'lg' (15px, "How it's scored" / "Walk away") }             underlined text button ("How to play", "Done for now")
 *   secondary  { label, onClick, disabled }             tertiary Button
 *   action     { label, onClick, disabled, icon }       primary Button with the arrow (icon:false hides it)
 */
const GameV2Footer = ({ note, link, secondary, action }) => {
  log('render', { link: link?.label, secondary: secondary?.label, action: action?.label });
  return (
    <footer className="sticky bottom-0 z-10 flex min-h-[88px] flex-wrap items-center justify-between gap-x-[16px] gap-y-[8px] border-t border-solid border-[#e7e7e7] bg-white px-[clamp(16px,3.7vw,64px)] py-[12px]">
      <p className="m-0 min-w-0 font-sans text-[13px] leading-[16px] font-normal text-[#6b6b6b] max-lg:text-[12px]">
        {note}
      </p>
      <div className="ml-auto flex flex-wrap items-center justify-end gap-[12px]">
        {link ? (
          <button
            type="button"
            onClick={link.onClick}
            disabled={link.disabled}
            className={classNames(
              'min-h-[24px] cursor-pointer rounded px-[8px] font-sans font-semibold text-[#1c2a21] underline disabled:cursor-default',
              link.size === 'lg'
                ? 'text-[15px] leading-[18px]'
                : 'text-[13px] leading-[18px] max-lg:text-[12px]',
              FOCUS_RING
            )}
          >
            {link.label}
          </button>
        ) : null}
        {secondary ? (
          <Button
            variant="tertiary"
            size="md"
            onClick={secondary.onClick}
            disabled={secondary.disabled}
          >
            {secondary.label}
          </Button>
        ) : null}
        {action ? (
          <Button
            variant="primary"
            size="md"
            disabled={action.disabled}
            onClick={action.onClick}
            rightIcon={
              action.icon === false ? undefined : <LabArrowRightIcon className="size-[20px]" />
            }
          >
            {action.label}
          </Button>
        ) : null}
      </div>
    </footer>
  );
};

export default GameV2Footer;
