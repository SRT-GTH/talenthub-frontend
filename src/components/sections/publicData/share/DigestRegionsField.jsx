import { useEffect, useId, useRef, useState } from 'react';
import { classNames } from '../../../../utils/classNames.js';
import { REGIONS } from '../regionsList.js';
import { digestRegionsLabel } from './data/shareData.js';

/*
 * DigestRegionsField — the "Regions of interest" field of the digest form (Figma 8504:2620): a select-like button showing
 * "National + Volta ▾". ⚠️ ASSUMPTION: Figma draws the closed state only; the open state is a checkbox list of the 16 regions (the label always
 * starts with National), opening upwards inside the dialog, closed with Esc / outside click / the button.
 * Props: value (array of region ids), onChange(ids).
 */

const FIELD =
  'flex w-full min-h-[44px] cursor-pointer items-center gap-[8px] rounded-[12px] border border-solid border-[#e7e7e7] bg-white px-[14px] py-[12px] text-left font-sans text-[15px] leading-[18px] text-[#1c2a21] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]';

const DigestRegionsField = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const labelId = useId();
  const rootRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onPointer = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onPointer);
    return () => document.removeEventListener('mousedown', onPointer);
  }, [open]);

  const toggle = (id) =>
    onChange(value.includes(id) ? value.filter((r) => r !== id) : [...value, id]);

  return (
    <div
      ref={rootRef}
      className="relative flex min-w-0 flex-1 flex-col gap-[6px]"
      onKeyDown={(event) => {
        if (event.key === 'Escape' && open) {
          event.stopPropagation();
          setOpen(false);
        }
      }}
    >
      <span
        id={labelId}
        className="font-sans text-[13px] leading-[16px] font-semibold text-[#1c2a21]"
      >
        Regions of interest
      </span>
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        aria-labelledby={labelId}
        onClick={() => setOpen((v) => !v)}
        className={FIELD}
      >
        <span className="min-w-0 flex-1 truncate">{digestRegionsLabel(value)}</span>
        <span
          aria-hidden="true"
          className="font-sans text-[13px] leading-[16px] font-medium text-[#595959]"
        >
          ▾
        </span>
      </button>
      {open ? (
        <div
          role="group"
          aria-label="Regions of interest"
          className="absolute right-0 bottom-[calc(100%-22px)] left-0 z-10 max-h-[220px] overflow-y-auto rounded-[12px] border border-solid border-[#e7e7e7] bg-white p-[8px] shadow-[0_10px_24px_rgba(0,0,0,0.12)]"
        >
          {REGIONS.map((region) => (
            <label
              key={region.id}
              className={classNames(
                'flex min-h-[32px] cursor-pointer items-center gap-[10px] rounded-[8px] px-[8px] font-sans text-[14px] leading-[17px] text-[#1c2a21] hover:bg-[#f8f8f4] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-[#387440]'
              )}
            >
              <input
                type="checkbox"
                checked={value.includes(region.id)}
                onChange={() => toggle(region.id)}
                className="size-[16px] accent-[#387440]"
              />
              {region.name}
            </label>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default DigestRegionsField;
