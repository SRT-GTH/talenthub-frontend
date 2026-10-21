import { useState } from 'react';
import { debug } from '../../../../utils/debug.js';
import Button from '../../../ui/Button.jsx';
import AreaOptionCard from './AreaOptionCard.jsx';
import InterestsDialogShell from './InterestsDialogShell.jsx';
import { AREAS, MAX_AREAS } from './interestsData.js';
import { HEADING_FONT } from './interestsStyles.js';
import * as Icons from './interestsIcons.jsx';

const log = debug('AddAreaDialog');

/*
 * AddAreaDialog (IN-04, Figma "Modal · Add an area" 7706:185205): chip, "What else pulls you in?", the area grid (areas already
 * in the list read "Added"), the "N of 6 areas after this…" line, Cancel + "Add N area(s)".
 * Props: existingIds, initialPick (area id preselected, used by ?pick=), onClose, onAdd(ids). Mount it only while open.
 */
const AddAreaDialog = ({ existingIds, initialPick, onClose, onAdd }) => {
  const [picked, setPicked] = useState(() =>
    initialPick && !existingIds.includes(initialPick) ? [initialPick] : []
  );
  const room = MAX_AREAS - existingIds.length;
  const toggle = (id) => {
    log('toggle', id);
    setPicked((p) =>
      p.includes(id) ? p.filter((x) => x !== id) : p.length < room ? [...p, id] : p
    );
  };
  const n = picked.length;
  return (
    <InterestsDialogShell
      open
      onClose={onClose}
      labelledBy="in-add-title"
      widthClass="max-w-[820px]"
      cardClassName="flex flex-col gap-5 px-5 pt-9 pb-8 sm:px-10"
      closeClassName="top-4 right-4 sm:top-6 sm:right-6"
    >
      <div className="flex flex-col gap-2 pr-10">
        <span className="inline-flex h-[32px] w-fit items-center rounded-full border border-solid border-[#c1d4c4] bg-[#ebf1ec] px-[14px] font-sans text-[13px] font-semibold leading-[16px] text-[#387440] max-lg:text-[12px]">
          Add an area
        </span>
        <h2
          id="in-add-title"
          className={`m-0 text-[clamp(24px,1.85vw,32px)] font-semibold leading-[1.194] text-[#111] ${HEADING_FONT}`}
        >
          <span className="text-[#1c2a21]">What else </span>
          <span className="text-[#387440]">pulls you in?</span>
        </h2>
        <p className="m-0 font-sans text-[15px] leading-[22px] text-[#595959]">
          You can have up to 6 areas. Areas you’ve already added are ticked.
        </p>
      </div>
      <div
        role="group"
        aria-label="Areas"
        className="grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 md:grid-cols-3"
      >
        {AREAS.map((a) => (
          <AreaOptionCard
            key={a.id}
            variant="dialog"
            area={a}
            added={existingIds.includes(a.id)}
            selected={picked.includes(a.id)}
            disabled={n >= room}
            onToggle={toggle}
          />
        ))}
      </div>
      {n > 0 ? (
        <div className="flex items-center gap-2 rounded-[12px] bg-[#f7f8f4] px-[14px] py-3">
          <span className="text-[16px] text-[#387440]">
            <Icons.InfoCircleIcon />
          </span>
          <p className="m-0 font-sans text-[13px] font-medium leading-[16px] text-[#595959] max-lg:text-[12px]">
            {existingIds.length + n} of 6 areas after this. Add specifics inside it next.
          </p>
        </div>
      ) : null}
      <div className="flex flex-wrap justify-end gap-3 pt-2">
        <Button variant="tertiary-subtle" size="lg" onClick={onClose}>
          Cancel
        </Button>
        <Button
          size="md"
          disabled={n === 0}
          rightIcon={<Icons.ArrowRightIcon />}
          onClick={() => onAdd(picked)}
        >
          Add {n || ''} {n === 1 || n === 0 ? 'area' : 'areas'}
        </Button>
      </div>
    </InterestsDialogShell>
  );
};

export default AddAreaDialog;
