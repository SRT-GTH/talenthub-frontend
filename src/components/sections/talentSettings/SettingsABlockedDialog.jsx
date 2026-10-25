import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Button from '../../ui/Button.jsx';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import {
  SettingsABlockIcon,
  SettingsACloseIcon,
  SettingsACompanyIcon,
  SettingsAPlusSmallIcon,
  SettingsAUserTileIcon,
} from '../../shared/assets.jsx';
import { PRIVACY_BLOCKED } from './talentSettingsAData.js';
import { HEAD } from './SettingsAUi.jsx';

const log = debug('SettingsABlockedDialog');

/*
 * SettingsABlockedDialog — ST-02c "Modal · Blocked recruiters and companies" (Playful 7856:18417,
 * Focused 8110:49745) over the rgba(28,42,33,.55) scrim. Esc / scrim / close / Done close it
 * (`?state=blocked` is removed by the caller). Unblock removes a row from the local list.
 */
/* `onBlockCompany(name)` (live pages): "Block someone else" opens a company-name field; resolves true when blocked. */
const SettingsABlockedDialog = ({ people, onUnblock, onClose, onBlockCompany }) => {
  const [adding, setAdding] = useState(false);
  const [company, setCompany] = useState('');
  const [addError, setAddError] = useState(null);
  const submitCompany = async () => {
    const name = company.trim();
    if (!name || !onBlockCompany) return;
    setAddError(null);
    const ok = await onBlockCompany(name);
    if (ok) {
      setCompany('');
      setAdding(false);
    } else setAddError('Could not block. Try again.');
  };
  const dialogRef = useRef(null);
  const copy = PRIVACY_BLOCKED.dialog;

  useEffect(() => {
    log('open', { people: people.length });
    const previous = document.activeElement;
    dialogRef.current?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') {
        log('esc -> close');
        onClose();
      }
    };
    document.addEventListener('keydown', onKey);
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
      if (previous && typeof previous.focus === 'function') previous.focus();
    };
    // Mount-only: focus handling must not re-run when the list shrinks.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return createPortal(
    <div className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto px-[12px] pt-[clamp(24px,7.4vw,128px)] pb-[24px]">
      <button
        type="button"
        aria-label={copy.done}
        tabIndex={-1}
        onClick={onClose}
        className="fixed inset-0 cursor-default bg-[rgba(28,42,33,0.55)]"
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-a-blocked-title"
        tabIndex={-1}
        style={{ outline: 'none' }}
        className="relative flex w-[540px] max-w-full flex-col gap-[16px] rounded-[24px] border border-[rgba(28,42,33,0.1)] bg-white p-[28px] shadow-[0_2px_4px_rgba(28,42,33,0.04),0_1px_1px_rgba(28,42,33,0.04)] outline-none max-sm:p-[16px] playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:shadow-[0_10px_12px_rgba(28,42,33,0.06),4px_4px_0_rgba(28,42,33,0.45)]"
      >
        <div className="flex items-center gap-[12px]">
          <span className="flex size-[44px] shrink-0 items-center justify-center rounded-[13px] bg-[#f9ebea]">
            <SettingsABlockIcon className="block size-[21px]" />
          </span>
          <h2
            id="settings-a-blocked-title"
            className={classNames(
              HEAD,
              'min-w-0 flex-1 text-[24px] leading-[1.2] tracking-[-0.24px] text-[#1c2a21] max-sm:text-[20px]'
            )}
          >
            {copy.title}
          </h2>
          <button
            type="button"
            aria-label={copy.done}
            onClick={onClose}
            className="flex shrink-0 cursor-pointer rounded-full bg-[#f8f8f4] p-[6px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
          >
            <SettingsACloseIcon className="block size-[18px]" />
          </button>
        </div>
        <p className="text-[14px] leading-[1.45] text-[#595959]">{copy.desc}</p>

        {people.map((p) => {
          const Tile = p.kind === 'company' ? SettingsACompanyIcon : SettingsAUserTileIcon;
          return (
            <div
              key={p.id}
              className="flex items-center gap-[12px] rounded-[14px] bg-[#f8f8f4] p-[12px]"
            >
              <span className="flex size-[40px] shrink-0 items-center justify-center rounded-[12px] bg-white">
                <Tile className="block size-[19px]" />
              </span>
              <div className="flex min-w-0 flex-1 flex-col gap-[2px]">
                <p className="leading-[18px] truncate text-[15px] font-semibold text-[#1c2a21]">
                  {p.name}
                </p>
                <p className="leading-[16px] truncate text-[13px] text-[#595959] max-sm:text-[12px]">
                  {p.meta}
                </p>
              </div>
              <Button
                variant="tertiary"
                size="lg"
                className="shrink-0"
                onClick={() => {
                  log('unblock', p.id);
                  onUnblock(p.id);
                }}
              >
                {copy.unblock}
              </Button>
            </div>
          );
        })}

        {adding ? (
          <div className="flex w-full flex-col gap-[6px]">
            <div className="flex w-full items-center gap-[8px]">
              <input
                autoFocus
                aria-label="Company to block"
                placeholder="Company name, for example Sample Ventures Ltd"
                value={company}
                maxLength={80}
                onChange={(e) => setCompany(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && submitCompany()}
                className="h-[44px] min-w-0 flex-1 rounded-[10px] border border-solid border-[#ccc] bg-white px-[14px] text-[14px] text-[#1c2a21] outline-none focus:border-[#387440]"
              />
              <Button
                variant="tertiary"
                size="sm"
                disabled={!company.trim()}
                onClick={submitCompany}
              >
                Block
              </Button>
            </div>
            {addError ? (
              <p role="alert" className="m-0 text-[13px] text-[#c0392b]">
                {addError}
              </p>
            ) : null}
          </div>
        ) : null}
        <button
          type="button"
          onClick={() => {
            log('block someone else');
            if (onBlockCompany) setAdding(true);
          }}
          className="flex cursor-pointer items-center gap-[8px] self-start text-[14px] font-semibold text-[#387440] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
        >
          <SettingsAPlusSmallIcon className="block size-[18px] shrink-0" />
          <span className="underline decoration-solid">{copy.add}</span>
        </button>

        <Button variant="primary" size="sm" className="w-full" onClick={onClose}>
          {copy.done}
        </Button>
      </div>
    </div>,
    document.body
  );
};

export default SettingsABlockedDialog;
