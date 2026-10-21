import { useId } from 'react';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import { WalletCloseIcon, WalletHintDiamondIcon } from '../../shared/assets.jsx';
import { FOCUS_RING, HelpModal } from '../talentSettings/helpUi.jsx';
import { HEADING } from './walletUi.jsx';

const log = debug('WalletDialogParts');

// Wallet modal card: Focused 1px ink-10 + soft shadow; Playful 1.5px ink-55 + 4px shelf (Figma "modal · …", r24, padding 28).
export const MODAL_CARD =
  'flex flex-col rounded-[24px] border border-solid border-[rgba(28,42,33,0.1)] bg-white p-[clamp(18px,1.62vw,28px)] shadow-[0_2px_8px_rgba(28,42,33,0.04),0_1px_2px_rgba(28,42,33,0.04)] playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:shadow-[0_10px_24px_rgba(28,42,33,0.06),4px_4px_0_rgba(28,42,33,0.45)]';

/*
 * WalletModal — scrim + centred card of the Wallet dialogs (HelpModal supplies focus trap, Esc, scroll lock, scrim click).
 * Props: width (Tailwind max-w class, from the frame: 600 / 520 / 480), labelledBy, onClose, children.
 */
// Card gap per modal, measured from the Figma nodes: [Focused, Playful] in px (static class names so Tailwind keeps them).
const GAP_F = { 14: 'gap-[14px]', 16: 'gap-[16px]', 24: 'gap-[24px]' };
const GAP_P = {
  14: 'playful:gap-[14px]',
  16: 'playful:gap-[16px]',
  18: 'playful:gap-[18px]',
  20: 'playful:gap-[20px]',
  24: 'playful:gap-[24px]',
};

export const WalletModal = ({
  width = 'max-w-[600px]',
  gaps = [16, 16],
  labelledBy,
  onClose,
  children,
}) => (
  <HelpModal
    onClose={onClose}
    labelledBy={labelledBy}
    scrim="rgba(28,42,33,0.55)"
    cardClassName={classNames(width, MODAL_CARD, GAP_F[gaps[0]], GAP_P[gaps[1]])}
  >
    {children}
  </HelpModal>
);

export const CloseButton = ({ onClick }) => (
  <button
    type="button"
    aria-label="Close"
    onClick={onClick}
    className={classNames(
      'flex size-[36px] shrink-0 cursor-pointer items-center justify-center rounded-[10px] border border-solid border-[#e6e6e6] bg-white p-0 text-[#595959]',
      FOCUS_RING
    )}
  >
    <WalletCloseIcon className="size-[16px]" />
  </button>
);

/* Title (29px) + subtitle (14px Semibold #737373) + the close button. `art` = the 96px spot illustration above the title. */
export const ModalHead = ({ id, title, subtitle, art, onClose }) => (
  <>
    {art ? (
      <div className="flex items-start justify-between">
        <img src={art} alt="" className="size-[96px]" />
        <CloseButton onClick={onClose} />
      </div>
    ) : null}
    <div className="flex items-start gap-[10px]">
      <div className="flex min-w-0 flex-1 flex-col gap-[4px]">
        <h2
          id={id}
          className={classNames(
            HEADING,
            'm-0 text-[clamp(24px,1.68vw,29px)] leading-[1.2] text-[#1c2a21]'
          )}
        >
          {title}
        </h2>
        {subtitle ? (
          <p className="m-0 font-sans text-[14px] font-semibold leading-[1.2] text-[#737373]">
            {subtitle}
          </p>
        ) : null}
      </div>
      {art ? null : <CloseButton onClick={onClose} />}
    </div>
  </>
);

/* Input · Amount (GHS): label, required star, 51px field, hint row with the diamond icon. */
export const WalletField = ({
  label,
  required = true,
  value,
  onChange,
  onBlur,
  hint,
  invalid = false,
  inputMode,
}) => {
  const id = useId();
  return (
    <div className="flex flex-col gap-[8px]">
      <label
        htmlFor={id}
        className="flex items-center gap-px font-sans text-[14px] font-medium leading-[24px] tracking-[0.2px] text-[#1c2a21]"
      >
        {label}
        {required ? (
          <span
            aria-hidden="true"
            className="font-['Instrument_Sans'] text-[14px] font-semibold leading-[21px] text-[#2e8b57]"
          >
            *
          </span>
        ) : null}
      </label>
      <input
        id={id}
        inputMode={inputMode}
        value={value}
        aria-invalid={invalid || undefined}
        aria-describedby={hint ? `${id}-hint` : undefined}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        className={classNames(
          'box-border h-[51px] w-full rounded-[10px] border border-solid bg-white py-[13px] pl-[20px] pr-[16px] font-sans text-[14px] font-medium leading-[24px] tracking-[0.2px] text-[#1c2a21] shadow-[0_2.5px_0_rgba(191,191,191,0.8)] outline-none focus-visible:border-[#387440]',
          invalid ? 'border-[#c0392b]' : 'border-[#ccc]'
        )}
      />
      {hint ? (
        <p
          id={`${id}-hint`}
          className="m-0 flex items-center gap-[8px] px-[8px] font-sans text-[12px] leading-[18px] tracking-[0.2px] text-[#575755]"
        >
          <WalletHintDiamondIcon className="size-[16px] shrink-0 text-[#387440]" />
          {hint}
        </p>
      ) : null}
    </div>
  );
};

/* Input · Amount (GHS): the WalletField with the amount label and a decimal keypad. */
export const AmountField = (props) => (
  <WalletField label="Amount (GHS)" inputMode="decimal" {...props} />
);

/* quick amounts: 12px chips; the chosen one is ink-filled. */
export const QuickChips = ({ items, active, onPick }) => (
  <div role="group" aria-label="Quick amounts" className="flex flex-wrap gap-[8px]">
    {items.map((c) => (
      <button
        key={c.id}
        type="button"
        aria-pressed={c.id === active}
        onClick={() => {
          log('quick amount', c.id);
          onPick(c);
        }}
        className={classNames(
          'inline-flex min-h-[24px] cursor-pointer items-center rounded-full border-0 px-[10px] py-[4px] font-sans text-[12px] font-semibold leading-[1.2]',
          FOCUS_RING,
          c.id === active ? 'bg-[#1c2a21] text-white' : 'bg-[#f1f1ee] text-[#575755]'
        )}
      >
        {c.label}
      </button>
    ))}
  </div>
);

/* option · … radio rows (Pay from / Send to). Selected = soft green fill + #387455 border + filled ring. */
export const OptionList = ({ label, options, value, onChange, radio = true }) => {
  const id = useId();
  return (
    <div className="contents">
      <p id={id} className="m-0 font-sans text-[13px] font-semibold leading-[1.2] text-[#575755]">
        {label}
      </p>
      <div role="radiogroup" aria-labelledby={id} className="contents">
        {options.map((o) => {
          const on = o.id === value;
          const Glyph = o.icon;
          return (
            <button
              key={o.id}
              type="button"
              role="radio"
              aria-checked={on}
              aria-label={`${o.title}, ${o.note}`}
              onClick={() => {
                log('option', o.id);
                onChange(o.id);
              }}
              className={classNames(
                'flex w-full cursor-pointer items-center gap-[12px] rounded-[14px] border border-solid p-[14px] text-left max-sm:gap-[8px] max-sm:p-[12px]',
                FOCUS_RING,
                on ? 'border-[#387455] bg-[#eef6f0]' : 'border-[#e3e5de] bg-white'
              )}
            >
              <Glyph className="size-[22px] shrink-0 text-[#387455]" />
              <span className="flex min-w-0 flex-1 flex-col gap-[2px]">
                <span className="font-sans text-[15px] font-semibold leading-[1.2] text-[#1c2a21] max-sm:text-[13px]">
                  {o.title}
                </span>
                <span
                  aria-hidden="true"
                  data-note={o.note}
                  className="font-sans text-[13px] leading-[1.2] text-[#575755] after:content-[attr(data-note)]"
                />
              </span>
              {radio ? (
                <span
                  aria-hidden="true"
                  className={classNames(
                    'box-border size-[20px] shrink-0 rounded-full border-solid',
                    on ? 'border-[6px] border-[#387455]' : 'border-[1.5px] border-[#c9ccc4]'
                  )}
                />
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
};

/* Footer: right-aligned secondary + primary button pair. */
export const ModalButtons = ({ children }) => (
  <div className="flex flex-wrap justify-end gap-[12px]">{children}</div>
);
