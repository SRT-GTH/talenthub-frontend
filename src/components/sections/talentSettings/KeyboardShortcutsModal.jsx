import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import { HEADING, HelpButton, HelpModal, Kbd } from './helpUi.jsx';
import { SHORTCUTS_COPY } from './helpData.js';

const log = debug('KeyboardShortcutsModal');

/*
 * HP-08 Keyboard shortcuts — `?help=shortcuts` (Playful 8228:14879 / Focused 8230:418325, modal
 * 8228:15813 / 8230:418939). 560px, r24, p28, gap 20, scrim rgba(28,42,33,.45). Mounted by HelpPopover.
 * Props: onClose.
 */
const KeyboardShortcutsModal = ({ onClose }) => {
  log('mount');
  return (
    <HelpModal
      onClose={onClose}
      labelledBy="help-shortcuts-title"
      scrim="rgba(28,42,33,0.45)"
      cardClassName="max-w-[560px]"
    >
      <div className="flex flex-col gap-[20px] rounded-[24px] bg-white p-[clamp(18px,2vw,28px)] shadow-[0_20px_48px_rgba(28,42,33,0.18)]">
        <div className="flex flex-col gap-[4px]">
          <h2
            id="help-shortcuts-title"
            className={classNames('m-0 text-[26px] leading-[1.2] text-[#1c2a21]', HEADING)}
          >
            {SHORTCUTS_COPY.title}
          </h2>
          <p className="m-0 font-sans text-[14px] leading-[1.2] text-[#595959]">
            {SHORTCUTS_COPY.subtitle}
          </p>
        </div>
        {SHORTCUTS_COPY.groups.map((group) => (
          <section key={group.label} className="flex flex-col gap-[8px]">
            <h3 className="m-0 font-sans text-[11px] font-semibold leading-[1.2] tracking-[0.66px] max-lg:text-[12px] text-[#387440]">
              {group.label}
            </h3>
            {group.rows.map((row) => (
              <div
                key={row.label}
                className="flex items-center gap-[12px] rounded-[10px] bg-[#f8f8f4] px-[12px] py-[8px]"
              >
                <span className="min-w-0 flex-1 font-sans text-[14px] font-medium leading-[1.2] text-[#1c2a21]">
                  {row.label}
                </span>
                <span className="flex shrink-0 items-center gap-[4px]">
                  {row.keys.map((k) => (
                    <Kbd key={k}>{k}</Kbd>
                  ))}
                </span>
              </div>
            ))}
          </section>
        ))}
        <HelpButton
          tone="primary"
          size="lg"
          data-autofocus=""
          className="w-full !px-[28px] !text-[15px]"
          onClick={onClose}
        >
          {SHORTCUTS_COPY.done}
        </HelpButton>
      </div>
    </HelpModal>
  );
};

export default KeyboardShortcutsModal;
