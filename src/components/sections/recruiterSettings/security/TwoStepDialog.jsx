import { useEffect, useRef, useState } from 'react';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import Button from '../../../ui/Button.jsx';
import CenteredIconDialog from '../../../ui/CenteredIconDialog.jsx';
import { ShieldCheckIcon } from './SettingsIcons.jsx';
import { TWO_STEP_COPY, TWO_STEP_RESEND_SECONDS, TWO_STEP_SEED } from './securityData.js';

const log = debug('TwoStepDialog');

/*
 * TwoStepDialog - SR-24 "Security · two-step verification code" (Figma 10161:85278, modal 10161:85596): `ui/CenteredIconDialog` (480 wide, p32): a 56px shield-check tile, a Bricolage 28/600 "Enter the 6-digit code",
 * "We sent a code to •••• 3456. It expires in 5 minutes.", six 52x60 digit boxes (typed digits: #387540 1.5px ring, Bricolage 26/600; empty: #dbded9 1px), "Resend code in 0:42" (14/500 green) and Cancel / Verify.
 * Verify is the grey disabled button until all six digits are in. The code is seeded with the 4 8 2 9 of the frame; typing, Backspace, the arrow keys and paste move between the boxes.
 * Props: onClose, onVerified.
 */
const DIGITS = 6;
const DIALOG_BUTTON = '!h-[48px] !py-0';
const toCells = (seed) => Array.from({ length: DIGITS }, (_, i) => seed[i] ?? '');
const clock = (seconds) => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;

const TwoStepDialog = ({ onClose, onVerified }) => {
  const [cells, setCells] = useState(() => toCells(TWO_STEP_SEED));
  const [seconds, setSeconds] = useState(TWO_STEP_RESEND_SECONDS);
  const refs = useRef([]);
  const copy = TWO_STEP_COPY;
  const complete = cells.every(Boolean);

  useEffect(() => {
    log('mount', { seeded: cells.filter(Boolean).length });
    const timer = window.setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => window.clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setCell = (index, value) =>
    setCells((prev) => prev.map((c, i) => (i === index ? value : c)));

  const onChange = (index, raw) => {
    const digits = raw.replace(/\D/g, '');
    if (!digits) {
      setCell(index, '');
      return;
    }
    setCells((prev) => {
      const next = [...prev];
      digits
        .slice(0, DIGITS - index)
        .split('')
        .forEach((d, i) => {
          next[index + i] = d;
        });
      return next;
    });
    refs.current[Math.min(index + digits.length, DIGITS - 1)]?.focus();
  };

  const onKeyDown = (index, event) => {
    if (event.key === 'Backspace' && !cells[index] && index > 0) {
      event.preventDefault();
      setCell(index - 1, '');
      refs.current[index - 1]?.focus();
    } else if (event.key === 'ArrowLeft' && index > 0) {
      refs.current[index - 1]?.focus();
    } else if (event.key === 'ArrowRight' && index < DIGITS - 1) {
      refs.current[index + 1]?.focus();
    } else if (event.key === 'Enter' && complete) {
      verify();
    }
  };

  const verify = () => {
    if (!complete) {
      log('branch: verify blocked, code incomplete');
      return;
    }
    log('dispatch verify two-step', { digits: cells.length });
    onVerified();
  };

  const resend = () => {
    log('dispatch resend code');
    setSeconds(TWO_STEP_RESEND_SECONDS);
  };

  return (
    <CenteredIconDialog
      icon={<ShieldCheckIcon className="size-[28px]" />}
      title={copy.title}
      onClose={onClose}
      widthClassName="!max-w-[480px]"
      footer={
        <>
          <Button variant="tertiary" className={DIALOG_BUTTON} onClick={onClose}>
            {copy.cancel}
          </Button>
          <Button
            variant="primary"
            size="sm"
            className={DIALOG_BUTTON}
            disabled={!complete}
            onClick={verify}
          >
            {copy.verify}
          </Button>
        </>
      }
    >
      <p className="m-0 text-center font-sans text-[14px] leading-[24px] tracking-[0.2px] text-[#575755]">
        {copy.body}
      </p>
      <div className="flex w-full items-start justify-center gap-[clamp(6px,2vw,10px)]">
        {cells.map((cell, i) => (
          <input
            key={i}
            ref={(el) => {
              refs.current[i] = el;
            }}
            value={cell}
            inputMode="numeric"
            autoComplete={i === 0 ? 'one-time-code' : 'off'}
            maxLength={DIGITS}
            aria-label={`Digit ${i + 1} of ${DIGITS}`}
            onChange={(event) => onChange(i, event.target.value)}
            onKeyDown={(event) => onKeyDown(i, event)}
            onFocus={(event) => event.target.select()}
            className={classNames(
              'h-[60px] min-w-0 max-w-[52px] flex-1 rounded-[10px] bg-white p-0 text-center font-heading text-[26px] leading-[31px] font-semibold tracking-[-0.52px] text-[#111] outline-none max-sm:h-[52px]',
              cell
                ? 'border-[1.5px] border-solid border-[#387540]'
                : 'border border-solid border-[#dbded9]',
              'focus:border-[1.5px] focus:border-[#387540]'
            )}
          />
        ))}
      </div>
      <div className="flex w-full justify-center">
        {seconds > 0 ? (
          <p className="m-0 text-[14px] leading-[24px] font-medium tracking-[0.2px] text-[#387440]">
            {`${copy.resend} ${clock(seconds)}`}
          </p>
        ) : (
          <button
            type="button"
            onClick={resend}
            className="min-h-[24px] cursor-pointer border-0 bg-transparent p-0 text-[14px] leading-[24px] font-medium tracking-[0.2px] text-[#387440] underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
          >
            {copy.resendNow}
          </button>
        )}
      </div>
      <span className="sr-only" aria-live="polite">
        {complete ? '' : `${cells.filter(Boolean).length} of ${DIGITS} digits entered`}
      </span>
    </CenteredIconDialog>
  );
};

export default TwoStepDialog;
