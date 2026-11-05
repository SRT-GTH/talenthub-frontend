import { useEffect, useRef } from 'react';
import { classNames } from '../../../../utils/classNames.js';
import { CODE_LENGTH } from './data/linkWardData.js';

/*
 * LinkCodeBoxes — the six link-code boxes (Figma "code" 10052:2479: 56 x 64, gap10, r14, 26/600 characters). Box outline: #e7e7e7 1px; the box waiting for the next character #387440 2px;
 * tone 'error' = every box #c0392b (the box in focus 2px). Six real inputs: typing moves forward, Backspace moves back, paste fills all boxes.
 * Props: value (string, up to 6 characters, upper case), onChange(value), tone ('default' | 'error'), highlight (index drawn green; default = the first empty box).
 * ⚠️ Figma PW-07f draws all six characters but keeps the fifth box green: `highlight={4}` reproduces it.
 */
const LinkCodeBoxes = ({ value, onChange, tone = 'default', highlight }) => {
  const refs = useRef([]);
  const active = highlight ?? (value.length < CODE_LENGTH ? value.length : -1);

  useEffect(() => {
    refs.current[Math.min(value.length, CODE_LENGTH - 1)]?.focus();
    // focus only when the dialog first opens or the code is cleared
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value.length === 0]);

  const clean = (s) => s.toUpperCase().replace(/[^A-Z0-9]/g, '');

  const handleChange = (i, raw) => {
    const chars = clean(raw);
    if (!chars) return;
    const next = (value.slice(0, i) + chars).slice(0, CODE_LENGTH);
    onChange(next);
    refs.current[Math.min(next.length, CODE_LENGTH - 1)]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      if (i < value.length) onChange(value.slice(0, i) + value.slice(i + 1));
      else onChange(value.slice(0, -1));
      refs.current[Math.max(0, i - (i >= value.length ? 1 : 0))]?.focus();
    } else if (e.key === 'ArrowLeft') refs.current[Math.max(0, i - 1)]?.focus();
    else if (e.key === 'ArrowRight') refs.current[Math.min(CODE_LENGTH - 1, i + 1)]?.focus();
  };

  return (
    <div role="group" aria-label="Link code" className="flex justify-center gap-[10px]">
      {Array.from({ length: CODE_LENGTH }, (_, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          type="text"
          inputMode="text"
          autoComplete="off"
          autoCapitalize="characters"
          maxLength={CODE_LENGTH}
          data-autofocus={i === Math.min(value.length, CODE_LENGTH - 1) ? '' : undefined}
          aria-label={`Character ${i + 1} of ${CODE_LENGTH}`}
          aria-invalid={tone === 'error' || undefined}
          value={value[i] ?? ''}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          className={classNames(
            'h-[64px] w-[56px] min-w-0 rounded-[14px] border-solid bg-white p-0 text-center font-sans text-[26px] leading-normal font-semibold text-[#1c2a21] caret-transparent outline-none selection:bg-transparent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green max-[420px]:h-[56px] max-[420px]:w-[44px]',
            tone === 'error'
              ? i === active || i === 4
                ? 'border-2 border-danger'
                : 'border border-danger'
              : i === active
                ? 'border-2 border-brand-green'
                : 'border border-black-light'
          )}
        />
      ))}
    </div>
  );
};

export default LinkCodeBoxes;
