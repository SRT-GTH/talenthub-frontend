import { debug } from '../../../utils/debug.js';
import StatusToast from '../../ui/StatusToast.jsx';
import { WalletArrowDownLeftIcon, WalletStarIcon } from '../../shared/assets.jsx';
import { FOCUS_RING } from '../talentSettings/helpUi.jsx';
import { CYCLES_TOAST } from './walletCyclesData.js';
import { SALARY_TOAST } from './walletCreditData.js';
import { classNames } from '../../../utils/classNames.js';

const log = debug('WalletToasts');

const ICONS = { star: WalletStarIcon, in: WalletArrowDownLeftIcon };

/*
 * Dark notification toast (Figma `Toast · Cycles earned` 8822:1905, `Toast · Salary received` 8826:470657): 420 / 399 x 68 at the top right
 * (frame x1260 / x1281, y160 → 108px below the top nav in the app), r18, #1c2a21, a 40px tile, two lines and a yellow action; a variant of `ui/StatusToast`.
 * `?toast=cycles|salary` shows it; the action (or Esc) dismisses it.
 */
const TOASTS = {
  cycles: { ...CYCLES_TOAST, icon: 'star', width: 420, tile: 'bg-[#f5c344] text-[#1c2a21]' },
  salary: { ...SALARY_TOAST, icon: 'in', width: 399, tile: 'bg-[#387440] text-white' },
};

const WalletToast = ({ kind, wallet }) => {
  const t = TOASTS[kind];
  if (!t) return null;
  const Icon = ICONS[t.icon];
  const dismiss = () => {
    log('dismiss', kind);
    wallet.update({ toast: null });
  };
  return (
    <StatusToast
      resetKey={kind}
      wrapperClassName="pointer-events-none fixed right-[clamp(12px,2.78vw,48px)] top-[108px] z-[65] max-w-[calc(100vw-24px)]"
      faceClassName="pointer-events-auto flex items-center gap-[14px] rounded-[18px] bg-[#1c2a21] py-[14px] pl-[14px] pr-[18px] shadow-[0_8px_12px_rgba(0,0,0,0.18)]"
      style={{ width: t.width }}
    >
      <span
        className={classNames(
          'flex size-[40px] shrink-0 items-center justify-center rounded-[12px]',
          t.tile
        )}
      >
        <Icon className="size-[20px]" />
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-[2px]">
        <span className="font-sans text-[15px] font-semibold leading-[1.2] text-white">
          {t.title}
        </span>
        <span className="font-sans text-[13px] leading-[1.2] text-[#c9d6cc]">{t.text}</span>
      </span>
      <button
        type="button"
        onClick={dismiss}
        aria-label={`${t.action}, dismiss notification`}
        className={classNames(
          'min-h-[24px] shrink-0 cursor-pointer whitespace-nowrap border-0 bg-transparent p-0 font-sans text-[14px] font-semibold leading-[1.2] text-[#f5c344]',
          FOCUS_RING
        )}
      >
        {t.action}
      </button>
    </StatusToast>
  );
};

export default WalletToast;
