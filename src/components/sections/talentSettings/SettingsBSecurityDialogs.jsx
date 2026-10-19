import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import Button from '../../ui/Button.jsx';
import {
  SettingsCheckCircleIcon,
  SettingsErrorCircleIcon,
  SettingsKeyIcon,
  SettingsPhoneIcon,
} from '../../shared/assets.jsx';
import { SettingsDialog } from './SettingsBDialogs.jsx';
import { CheckboxB, FieldB } from './SettingsBFields.jsx';
import {
  PASSWORD_COPY,
  PASSWORD_SEED,
  TWO_STEP_COPY,
  TWO_STEP_RESEND_SECONDS,
  TWO_STEP_SEED,
} from './talentSettingsBData.js';

const log = debug('SettingsBSecurityDialogs');

// ---- Change password (ST-06b) -----------------------------------------------------------------
const passwordRules = (current, next) => ({
  length: next.length >= 8,
  symbol: /[0-9]/.test(next) || /[^A-Za-z0-9]/.test(next),
  different: next.length > 0 && next !== current,
});

// 4 bars: 8+ characters, a number, a symbol, upper + lower case. Figma draws 3 of 4 + "Strong".
const passwordStrength = (next) => {
  const score = [
    next.length >= 8,
    /[0-9]/.test(next),
    /[^A-Za-z0-9]/.test(next),
    /[a-z]/.test(next) && /[A-Z]/.test(next),
  ].filter(Boolean).length;
  return score;
};

const Rule = ({ ok, children }) => (
  <li className="flex items-center gap-[8px]">
    {ok ? (
      <SettingsCheckCircleIcon className="size-[16px] shrink-0 text-[#387440]" />
    ) : (
      <SettingsErrorCircleIcon className="size-[16px] shrink-0 text-[#595959]" />
    )}
    <span
      className={classNames(
        'text-[13.5px] leading-[normal] font-medium',
        ok ? 'text-[#2a5730]' : 'text-[#595959]'
      )}
    >
      {children}
    </span>
  </li>
);

export const ChangePasswordDialog = ({ open, onClose, onSubmit }) => {
  const [current, setCurrent] = useState(PASSWORD_SEED.current);
  const [next, setNext] = useState(PASSWORD_SEED.next);
  const [confirm, setConfirm] = useState(PASSWORD_SEED.confirm);
  const [logOutOthers, setLogOutOthers] = useState(true);
  const newRef = useRef(null);
  const rulesId = useId();

  const rules = useMemo(() => passwordRules(current, next), [current, next]);
  const strength = passwordStrength(next);
  const matches = confirm.length > 0 && confirm === next;
  const valid = current.length > 0 && rules.length && rules.symbol && rules.different && matches;
  const copy = PASSWORD_COPY;

  const submit = (event) => {
    event.preventDefault();
    if (!valid) {
      log('branch', { submit: 'blocked', rules, matches });
      return;
    }
    log('dispatch update password', { logOutOthers });
    onSubmit?.({ logOutOthers });
  };

  return (
    <SettingsDialog
      open={open}
      title={copy.title}
      icon={<SettingsKeyIcon className="size-[21px] text-[#387440]" />}
      onClose={onClose}
      initialFocus={() => newRef.current}
      testId="password"
    >
      <form onSubmit={submit} className="flex w-full flex-col gap-[16px]" noValidate>
        <FieldB
          label={copy.current}
          type="password"
          value={current}
          onChange={setCurrent}
          autoComplete="current-password"
        />
        <FieldB
          label={copy.next}
          type="password"
          value={next}
          onChange={setNext}
          autoComplete="new-password"
          inputRef={newRef}
          aria-describedby={rulesId}
        />
        <ul id={rulesId} className="flex w-full flex-col gap-[6px]">
          <Rule ok={rules.length}>{copy.rules.length}</Rule>
          <Rule ok={rules.symbol}>{copy.rules.symbol}</Rule>
          <Rule ok={rules.different}>{copy.rules.different}</Rule>
        </ul>
        <div className="flex w-full items-center gap-[6px]">
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className={classNames(
                'h-[6px] min-w-px flex-[1_0_0] rounded-[3px]',
                i < strength ? 'bg-[#387440]' : 'bg-[#e7e7e7]'
              )}
            />
          ))}
          {/* Figma only draws the "Strong" label; weaker scores show the bars alone. */}
          <span className="min-w-[38px] text-[12.5px] leading-[normal] font-semibold whitespace-nowrap text-[#387440]">
            {strength >= 3 ? copy.strong : ''}
          </span>
        </div>
        <FieldB
          label={copy.confirm}
          type="password"
          value={confirm}
          onChange={setConfirm}
          autoComplete="new-password"
          invalid={confirm.length > 0 && !matches}
        />
        <CheckboxB checked={logOutOthers} onChange={setLogOutOthers}>
          {copy.logOutOthers}
        </CheckboxB>
        <div className="flex w-full items-start gap-[12px]">
          <Button variant="tertiary" size="lg" className="min-w-0 flex-1" onClick={onClose}>
            {copy.cancel}
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            className="min-w-0 flex-1"
            disabled={!valid}
          >
            {copy.submit}
          </Button>
        </div>
      </form>
    </SettingsDialog>
  );
};

// ---- Two-step code (ST-06c) -------------------------------------------------------------------
const DIGITS = 6;
const toCells = (seed) => Array.from({ length: DIGITS }, (_, i) => seed[i] ?? '');
const formatClock = (seconds) =>
  `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;

export const TwoStepDialog = ({ open, onClose, onVerified }) => {
  const [cells, setCells] = useState(() => toCells(TWO_STEP_SEED));
  const [seconds, setSeconds] = useState(TWO_STEP_RESEND_SECONDS);
  const refs = useRef([]);
  const copy = TWO_STEP_COPY;
  const firstEmpty = Math.max(
    0,
    cells.findIndex((c) => c === '')
  );

  useEffect(() => {
    if (!open) return undefined;
    const timer = window.setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => window.clearInterval(timer);
  }, [open]);

  const setCell = (index, value) => {
    setCells((prev) => prev.map((c, i) => (i === index ? value : c)));
  };

  const onChange = (index, raw) => {
    const digits = raw.replace(/\D/g, '');
    if (!digits) {
      setCell(index, '');
      return;
    }
    setCells((prev) => {
      const nextCells = [...prev];
      digits
        .slice(0, DIGITS - index)
        .split('')
        .forEach((d, i) => {
          nextCells[index + i] = d;
        });
      return nextCells;
    });
    const target = Math.min(index + digits.length, DIGITS - 1);
    refs.current[target]?.focus();
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
    }
  };

  const complete = cells.every(Boolean);
  const verify = () => {
    if (!complete) {
      log('branch', { verify: 'incomplete', focus: firstEmpty });
      refs.current[firstEmpty]?.focus();
      return;
    }
    log('dispatch verify two-step', { digits: cells.length });
    onVerified?.();
  };

  const resend = () => {
    log('dispatch resend code');
    setSeconds(TWO_STEP_RESEND_SECONDS);
  };

  return (
    <SettingsDialog
      open={open}
      title={copy.title}
      icon={<SettingsPhoneIcon className="size-[21px] text-[#1c2a21]" />}
      iconTone="bg-[#ffd86b]"
      onClose={onClose}
      widthClass="w-[480px]"
      gap="gap-[24px]"
      initialFocus={() => refs.current[firstEmpty]}
      testId="two-step"
    >
      <p className="w-full text-[15px] leading-[1.45] text-[#595959]">{copy.body}</p>
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
              'h-[64px] min-w-0 max-w-[56px] flex-1 rounded-[12px] border bg-white text-center font-sans text-[26px] leading-[1.2] font-semibold tracking-[-0.26px] text-[#1c2a21] outline-none playful:font-heading max-lg:h-[52px]',
              'border-[rgba(28,42,33,0.1)] playful:border-[rgba(28,42,33,0.2)]',
              'focus:border-[#387440] playful:focus:border-2'
            )}
          />
        ))}
      </div>
      <p className="flex w-full justify-center gap-[6px] text-[14px] leading-[normal] whitespace-nowrap text-[#595959]">
        <span>{copy.didNotGet}</span>
        {seconds > 0 ? (
          <span className="font-semibold">{`${copy.resend} ${formatClock(seconds)}`}</span>
        ) : (
          <button type="button" className="cursor-pointer font-semibold underline" onClick={resend}>
            {copy.resend.trim()}
          </button>
        )}
      </p>
      <div className="flex w-full items-start gap-[12px]">
        <Button variant="tertiary" size="lg" className="min-w-0 flex-1" onClick={onClose}>
          {copy.another}
        </Button>
        <Button variant="primary" size="sm" className="min-w-0 flex-1" onClick={verify}>
          {copy.verify}
        </Button>
      </div>
    </SettingsDialog>
  );
};
