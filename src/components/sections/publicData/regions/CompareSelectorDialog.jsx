import { useMemo, useState } from 'react';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import Button from '../../../ui/Button.jsx';
import ShareDialogShell from '../share/ShareDialogShell.jsx';
import {
  COMPARE_COLOURS,
  COMPARE_COLOUR_NAMES,
  COMPARE_MAX,
  COMPARE_MIN,
  listRegions,
} from './data/regionsData.js';
import { RegionsIconCheckSmall } from './regionsIcons.jsx';

const log = debug('CompareSelectorDialog');

/*
 * CompareSelectorDialog — "Choose regions to compare" (Figma 8.3.3c 8495:347727, 640x555, r24): title 22/26 600, "Pick up to 3. Each region keeps its colour across
 * every chart.", a 3-column grid of the 16 regions in A–Z order (184x40 options: r12, 1px #e7e7e7; selected #ebf1ec + 1px #387440 with its colour dot at the
 * right), the status line (13/16 500 #595959: "2 of 3 selected · colours: Greater Accra green, Ashanti orange, next region blue"), footer: "Clear" (text
 * button 14/17 600 #387440) and the primary button "Compare 2 regions".
 * The shell (focus trap, Esc, scrim click, scroll lock) is the shared ShareDialogShell. Each option is a native checkbox (keyboard: Tab / Space); with three
 * picked the other options are disabled. The choice is a draft: "Compare N regions" writes it to the URL (?regions=a,b,c), closing discards it.
 * ⚠️ ASSUMPTION: the status line generalises the drawn sentence to 1 and 3 selections; "Compare N regions" is disabled below two regions.
 * Props: selected (ids, in colour order), onApply(ids), onClose().
 */

const CompareSelectorDialog = ({ selected, onApply, onClose }) => {
  const [draft, setDraft] = useState(selected);
  const regions = useMemo(
    () => [...listRegions()].sort((a, b) => a.name.localeCompare(b.name)),
    []
  );
  const nameOf = (id) => regions.find((r) => r.id === id)?.name ?? id;
  const full = draft.length >= COMPARE_MAX;
  const ready = draft.length >= COMPARE_MIN;

  const toggle = (id) => {
    setDraft((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= COMPARE_MAX) return prev;
      return [...prev, id];
    });
  };

  const parts = [];
  for (let i = 0; i < COMPARE_MAX && i <= draft.length; i += 1) {
    parts.push(
      i < draft.length
        ? `${nameOf(draft[i])} ${COMPARE_COLOUR_NAMES[i]}`
        : `next region ${COMPARE_COLOUR_NAMES[i]}`
    );
  }
  const status = `${draft.length} of ${COMPARE_MAX} selected · colours: ${parts.join(', ')}`;

  return (
    <ShareDialogShell
      title="Choose regions to compare"
      description="Pick up to 3. Each region keeps its colour across every chart."
      onClose={onClose}
      width={640}
      bodyClassName="!gap-[14px]"
      footer={
        <>
          <button
            type="button"
            onClick={() => {
              log('clear');
              setDraft([]);
            }}
            className="cursor-pointer border-0 bg-transparent px-[4px] py-[6px] font-sans text-[14px] leading-[17px] font-semibold text-[#387440] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
          >
            Clear
          </button>
          <Button
            type="button"
            variant="primary"
            size="sm"
            disabled={!ready}
            onClick={() => {
              log('apply', draft);
              onApply(draft);
            }}
          >
            {`Compare ${Math.max(draft.length, COMPARE_MIN)} regions`}
          </Button>
        </>
      }
    >
      <fieldset className="m-0 min-w-0 border-0 p-0">
        <legend className="sr-only">Regions</legend>
        <div className="grid grid-cols-2 gap-[10px] sm:grid-cols-3">
          {regions.map((r) => {
            const index = draft.indexOf(r.id);
            const on = index >= 0;
            const blocked = !on && full;
            return (
              <label
                key={r.id}
                className={classNames(
                  'relative flex min-h-[40px] items-center gap-[10px] rounded-[12px] border border-solid px-[12px] py-[10px] font-sans text-[14px] leading-[17px] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[#387440]',
                  on
                    ? 'border-[#387440] bg-[#ebf1ec] font-semibold'
                    : 'border-[#e7e7e7] bg-white font-medium',
                  blocked ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
                  'text-[#1c2a21]'
                )}
              >
                <input
                  type="checkbox"
                  checked={on}
                  disabled={blocked}
                  onChange={() => toggle(r.id)}
                  className="peer sr-only"
                />
                <span
                  aria-hidden="true"
                  className={classNames(
                    'flex size-[16px] shrink-0 items-center justify-center rounded-[4px] border border-solid',
                    on ? 'border-[#387440] bg-[#387440] text-white' : 'border-[#c9c9c4] bg-white'
                  )}
                >
                  {on && <RegionsIconCheckSmall className="h-[7px] w-[9px]" />}
                </span>
                <span className="min-w-0 flex-1 truncate">{r.name}</span>
                {on && (
                  <span
                    aria-hidden="true"
                    className="size-[8px] shrink-0 rounded-full"
                    style={{ background: COMPARE_COLOURS[index] }}
                  />
                )}
              </label>
            );
          })}
        </div>
      </fieldset>
      <p
        role="status"
        className="m-0 font-sans text-[13px] leading-[16px] font-medium text-[#595959]"
      >
        {status}
      </p>
    </ShareDialogShell>
  );
};

export default CompareSelectorDialog;
