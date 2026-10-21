import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import { usePlayfulDialogA11y } from '../../../ui/PlayfulDialogA11y.js';
import {
  CardArrowIcon,
  CloseIcon,
  ModeAiIcon,
  ModePencilIcon,
  ModeUploadIcon,
} from './avatarIcons.jsx';
import { MODE_DIALOG } from './avatarData.js';

const log = debug('AvatarSwitchModesDialog');

/*
 * AvatarSwitchModesDialog — "How would you like to add your details" (Figma "Switch Modes", Focused 8285:4307 / Playful 3326:10936):
 * #1c2a21 @ 70% scrim, 1129x672 white card (r24, 3px #c1d4c4 border), a "Switch any time" caption, headline + lede, three option cards
 * (the middle "Chat with Career Buddy" card is highlighted with a "Most popular" badge), and a mix-and-match note. Close = the
 * 28px round button, Esc, or a scrim click. Which destination each card leads to is NOT drawn in Figma: the cards only log
 * (`onChoose(optionId)`); "Fill it in myself" is the mode the user is already in, so the page just closes the dialog for it.
 * Props: onClose, onChoose(optionId). Playful: Bricolage headings + hard card shadows.
 */
const ICONS = { manual: ModePencilIcon, chat: ModeAiIcon, cv: ModeUploadIcon };

const OptionCard = ({ option, onChoose }) => {
  const Glyph = ICONS[option.id];
  const hot = option.id === 'chat';
  return (
    <div className="relative">
      {option.badge ? (
        <span className="absolute -top-[6px] right-[12px] z-10 inline-flex items-center rounded-[8px] bg-[#387440] px-[10px] py-[4px] font-sans text-[8px] font-medium uppercase leading-[10px] tracking-[0.95px] text-white max-lg:text-[12px] max-lg:leading-[14px]">
          {option.badge}
        </span>
      ) : null}
      <button
        type="button"
        onClick={() => {
          log('choose', option.id);
          onChoose(option.id);
        }}
        className={classNames(
          'flex h-full w-full cursor-pointer flex-col items-start gap-[16px] rounded-[16px] border border-solid py-[20px] pl-[24px] pr-[16px] text-left',
          'shadow-[0_1px_2px_rgba(28,42,33,0.04),0_2px_8px_rgba(28,42,33,0.04)]',
          'playful:shadow-[4px_4px_0_rgba(28,42,33,0.45),0_10px_24px_rgba(28,42,33,0.06)]',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green',
          hot
            ? 'border-[#387440] bg-white'
            : 'border-[rgba(28,42,33,0.1)] bg-[#fffefc] playful:border-[rgba(28,42,33,0.55)] playful:border-[1.5px]'
        )}
      >
        <span
          aria-hidden="true"
          className={classNames(
            'inline-grid size-[62px] place-items-center rounded-[10px]',
            hot ? 'bg-[#ebf1ec] text-[#387440]' : 'bg-[#f8f8f4] text-[#737373]'
          )}
        >
          <Glyph className="size-[40px]" />
        </span>
        <span className="flex w-full flex-col gap-[12px]">
          <span className="flex flex-col items-start gap-[8px]">
            <span
              className={classNames(
                'inline-flex items-center rounded-[5px] border border-solid px-[6px] py-[4px] font-sans text-[10px] font-medium leading-[16px] tracking-[0.2px] [font-variant-caps:small-caps] max-lg:text-[12px]',
                hot
                  ? 'border-[#387440] bg-[#ebf1ec] text-[#387440]'
                  : 'border-[#b5b5b5] bg-[#fefcf5] text-[#575755]'
              )}
            >
              {option.meta}
            </span>
            <span
              className={classNames(
                'font-sans text-[21px] font-semibold leading-[26px] playful:font-heading',
                hot ? 'text-[#387440]' : 'text-[#1c2a21]'
              )}
            >
              {option.title}
            </span>
          </span>
          <span className="font-sans text-[14px] font-normal leading-[20px] tracking-[0.2px] text-[#737373]">
            {option.body}
          </span>
        </span>
        <span className="mt-auto flex w-full items-center justify-between border-0 border-t border-solid border-[#f1f5f9] pt-[8px]">
          <span
            className={classNames(
              'font-sans text-[12px] font-medium leading-[14px]',
              hot ? 'text-[#387440]' : 'text-[#737373]'
            )}
          >
            {option.action}
          </span>
          <CardArrowIcon
            className={classNames('size-[16px]', hot ? 'text-[#387440]' : 'text-[#737373]')}
          />
        </span>
      </button>
    </div>
  );
};

const AvatarSwitchModesDialog = ({ onClose, onChoose }) => {
  const ref = useRef(null);
  useEffect(() => {
    log('mount');
  }, []);
  usePlayfulDialogA11y({
    open: true,
    dialogRef: ref,
    onEscape: onClose,
    initialFocus: () => ref.current,
    lockScroll: true,
  });
  return createPortal(
    <div
      data-pf-portal=""
      className="fixed inset-0 z-[70] flex overflow-y-auto bg-[rgba(28,42,33,0.7)] p-[12px] sm:p-[16px]"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="avatar-modes-title"
        tabIndex={-1}
        style={{ border: '3px solid #c1d4c4' }}
        className="relative m-auto w-full max-w-[1129px] rounded-[24px] bg-white px-[clamp(16px,7.8vw,88px)] py-[clamp(24px,7.8vw,88px)] shadow-[0_5px_11px_-2px_rgba(27,36,44,0.06),0_2px_2px_-1px_rgba(27,35,44,0.04)] outline-none"
      >
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute right-[clamp(12px,3.3vw,36px)] top-[clamp(12px,3.3vw,28px)] inline-grid size-[28px] cursor-pointer place-items-center rounded-full border-0 bg-[#ebf1ec] p-0 text-[#387440] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
        >
          <CloseIcon className="size-[16px]" />
        </button>
        <div className="mx-auto flex max-w-[951px] flex-col items-center gap-[20px]">
          <div className="flex w-full max-w-[395px] flex-col items-center gap-[16px] text-center">
            <span className="inline-flex items-center gap-[6px] rounded-[6px] border border-solid border-[#c1d4c4] bg-[#ebf1ec] px-[10px] py-[3px]">
              <span
                aria-hidden="true"
                className="size-[8px] rounded-full border-[1.5px] border-solid border-[#1d7c4d] bg-[#c1d4c4]"
              />
              <span className="font-sans text-[12px] font-normal leading-[18px] tracking-[0.2px] text-[#999999]">
                {MODE_DIALOG.caption}
              </span>
            </span>
            <div className="flex flex-col gap-[4px]">
              <h2
                id="avatar-modes-title"
                className="m-0 font-sans text-[29px] font-semibold leading-[35px] tracking-[-0.58px] text-[#1c2a21] playful:font-heading max-lg:text-[24px] max-lg:leading-[30px]"
              >
                {MODE_DIALOG.title}
              </h2>
              <p className="m-0 font-sans text-[12px] font-normal leading-[18px] tracking-[0.2px] text-[#959592] max-lg:text-[12px]">
                {MODE_DIALOG.lede}
              </p>
            </div>
          </div>
          <div className="grid w-full grid-cols-1 gap-[20px] pt-[8px] md:grid-cols-3 md:gap-[30px]">
            {MODE_DIALOG.options.map((o) => (
              <OptionCard key={o.id} option={o} onChoose={onChoose} />
            ))}
          </div>
          <p className="m-0 w-full rounded-[10px] border border-solid border-[#c1d4c4] bg-[#f8f8f4] px-[20px] py-[16px] text-center font-sans text-[12px] font-medium leading-[20px] tracking-[0.2px] text-[#387440] max-lg:text-[12px]">
            {MODE_DIALOG.footnote}
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default AvatarSwitchModesDialog;
