import { useEffect, useRef } from 'react';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import { A11yPanelSparkleIcon } from '../../shared/assets.jsx';
import { LANGUAGE_MENU_COPY as COPY, LANGUAGES } from './LanguageData.js';
import { findNavButton, useNavPopoverPos } from './MessagesA11yAnchor.js';
import { CheckIcon } from './dIcons.jsx';

const log = debug('LanguageMenu');

/*
 * LanguageMenu — Figma "GTH · Language switcher" menu (7477:85605; frame L-01 7497:6381 Playful / 8110:455947 Focused).
 * 280px card hung 8px under the top-nav EN button, right-aligned with it. English (Ghana) is the selected default;
 * Twi / Ga / Ewe / Dagbani / Hausa carry a yellow "Soon" pill and open the coming-soon modal.
 *
 * Props: onClose(), onPick(languageId) (-> lead: messages.update({ lang: id })), onSuggest() optional.
 * Mounted by MessagesOverlays when messages.lang === 'menu'.
 */
const LanguageMenu = ({ onClose, onPick, onSuggest }) => {
  const ref = useRef(null);
  const pos = useNavPopoverPos('language');

  useEffect(() => {
    log('mount');
    const onKey = (e) => {
      if (e.key === 'Escape') {
        log('Esc -> close');
        onClose?.();
      }
    };
    const onDown = (e) => {
      if (ref.current?.contains(e.target)) return;
      if (findNavButton('language')?.contains(e.target)) return;
      log('outside click -> close');
      onClose?.();
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onDown);
    ref.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onDown);
    };
  }, [onClose]);

  return (
    <div
      ref={ref}
      role="dialog"
      aria-labelledby="messages-lang-title"
      tabIndex={-1}
      style={{ top: pos.top, right: pos.right }}
      className="fixed z-50 w-[280px] max-w-[calc(100vw-24px)] overflow-hidden rounded-[24px] border border-[rgba(28,42,33,0.1)] bg-[#fffefc] shadow-[0_1px_2px_rgba(28,42,33,0.04),0_4px_16px_rgba(28,42,33,0.06)] outline-none"
    >
      <div className="relative flex flex-col gap-[4px] overflow-hidden bg-[#ebf1ec] px-[20px] pt-[18px] pb-[14px]">
        <div className="flex items-center gap-[10px]">
          <h2
            id="messages-lang-title"
            className="text-[23px] leading-[28px] font-semibold text-[#1c2a21] playful:font-heading"
          >
            {COPY.title}
          </h2>
          <span
            aria-hidden="true"
            className="rounded-full border border-[rgba(28,42,33,0.12)] bg-[#ffd86b] px-[10px] py-[4px] text-[11.5px] max-lg:text-[12px] leading-[14px] font-bold text-[#1c2a21] playful:rotate-5 playful:border-[1.2px] playful:border-[#1c2a21] playful:shadow-[2px_2px_0_#1c2a21]"
          >
            {COPY.sticker}
          </span>
        </div>
        <p className="text-[12.5px] leading-[15px] text-[#595959]">{COPY.subtitle}</p>
        <A11yPanelSparkleIcon className="absolute top-[14px] left-[234px] hidden size-[16px] playful:block" />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-[-16px] left-[246px] hidden size-[44px] rounded-full border-2 border-[#c1d4c4] playful:block"
        />
      </div>

      <ul className="m-0 flex list-none flex-col gap-[2px] px-[8px] pt-[8px] pb-[4px]">
        <li>
          <button
            type="button"
            aria-label={`${COPY.current.name}, ${COPY.current.note}, selected`}
            aria-current="true"
            onClick={() => {
              log('pick English -> close');
              onClose?.();
            }}
            className="flex min-h-[51px] w-full cursor-pointer items-center gap-[10px] rounded-[14px] border-[1.2px] border-[#387440] bg-[#ebf1ec] px-[16px] py-[10px] text-left"
          >
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="text-[14px] leading-[17px] font-bold text-[#2a5730]">
                {COPY.current.name}
              </span>
              <span
                aria-hidden="true"
                data-t={COPY.current.note}
                className="text-[12px] leading-[14px] text-[#737373] after:content-[attr(data-t)]"
              />
            </span>
            <span
              aria-hidden="true"
              className="flex size-[22px] shrink-0 items-center justify-center rounded-full border-[1.2px] border-[#1c2a21] bg-[#387440] text-white playful:shadow-[1.5px_1.5px_0_#1c2a21]"
            >
              <CheckIcon className="size-[12px]" />
            </span>
          </button>
        </li>
        {LANGUAGES.map((l) => (
          <li key={l.id}>
            <button
              type="button"
              aria-label={`${l.name}, ${l.native}, coming soon`}
              onClick={() => {
                log('pick', l.id);
                onPick?.(l.id);
              }}
              className={classNames(
                'flex min-h-[51px] w-full cursor-pointer items-center gap-[10px] rounded-[14px] px-[16px] py-[10px] text-left transition-colors hover:bg-[#f8f8f4] focus-visible:bg-[#f8f8f4]'
              )}
            >
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="text-[14px] leading-[17px] font-semibold text-[#1c2a21]">
                  {l.name}
                </span>
                <span
                  aria-hidden="true"
                  data-t={l.native}
                  className="text-[12px] leading-[14px] text-[#737373] after:content-[attr(data-t)]"
                />
              </span>
              <span
                aria-hidden="true"
                className="rounded-full border border-[rgba(28,42,33,0.12)] bg-[#ffd86b] px-[8px] py-[3px] text-[10px] max-lg:text-[12px] leading-[12px] font-bold text-[#1c2a21] playful:border-[#1c2a21] playful:shadow-[1.5px_1.5px_0_#1c2a21] after:content-[attr(data-t)]"
                data-t={COPY.soon}
              />
            </button>
          </li>
        ))}
      </ul>

      <div className="h-px w-full bg-[#e1eae2]" />
      <div className="flex flex-col items-start gap-[10px] px-[16px] pt-[10px] pb-[12px]">
        <p className="text-[11px] max-lg:text-[12px] leading-[13px] text-[#737373]">
          {COPY.footnote}
        </p>
        <button
          type="button"
          onClick={() => {
            log('suggest a language');
            onSuggest?.();
          }}
          className="inline-flex cursor-pointer items-center rounded-full border border-[rgba(28,42,33,0.12)] bg-white px-[14px] py-[7px] text-[12px] leading-[14px] font-semibold text-[#2d5d33] playful:border-[1.2px] playful:border-[#1c2a21] playful:shadow-[2px_2px_0_#1c2a21]"
        >
          {COPY.suggest}
        </button>
      </div>
    </div>
  );
};

export default LanguageMenu;
