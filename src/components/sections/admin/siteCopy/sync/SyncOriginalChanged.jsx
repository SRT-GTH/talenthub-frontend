import AgencyButton from '../../../agency/AgencyButton.jsx';
import NamePrimaryAction from '../names/NamePrimaryAction.jsx';
import { SYNC_COPY } from './releaseSyncData.js';
import { WarningIcon } from './SyncIcons.jsx';

/*
 * SyncOriginalChanged — "The original text changed since your edit" (Figma 7.8.8b "original changed": #faf4e8, r14, 16 padding, 10 gap): the warning glyph and
 * title 14/600 #463409, two white tiles (OLD ORIGINAL / NEW ORIGINAL · release 2.4, 11.5/700 label, 14/500 text) and the actions "Keep my edit" (white,
 * wide) and "Use the new original" (green).
 * Props: oldText, newText, onKeep, onUseNew.
 */
const Tile = ({ label, text }) => (
  <div className="flex min-w-0 flex-1 basis-[200px] flex-col gap-[4px] rounded-[10px] bg-white p-[12px]">
    <span className="font-sans text-[11.5px] leading-[14px] font-bold tracking-[0.23px] text-[#575755] max-lg:text-[12px]">
      {label}
    </span>
    <span className="font-sans text-[14px] leading-[17px] font-medium text-[#1c2a21]">{text}</span>
  </div>
);

const SyncOriginalChanged = ({ oldText, newText, onKeep, onUseNew }) => (
  <section
    aria-label={SYNC_COPY.changedTitle}
    className="flex flex-col gap-[10px] rounded-[14px] bg-[#faf4e8] p-[16px]"
  >
    <h3 className="m-0 flex items-center gap-[8px] font-sans text-[14px] leading-[17px] font-semibold text-[#463409]">
      <WarningIcon className="-m-[2px] size-[20px] shrink-0 text-[#8a6100]" />
      {SYNC_COPY.changedTitle}
    </h3>
    <div className="flex flex-wrap gap-[12px]">
      <Tile label={SYNC_COPY.oldOriginal} text={oldText} />
      <Tile label={SYNC_COPY.newOriginal} text={newText} />
    </div>
    <div className="flex flex-wrap gap-[10px]">
      <AgencyButton size="md" onClick={onKeep} className="!h-[44px] min-w-0 flex-[3_1_200px]">
        Keep my edit
      </AgencyButton>
      <NamePrimaryAction onClick={onUseNew} className="flex-[1_1_185px]">
        Use the new original
      </NamePrimaryAction>
    </div>
  </section>
);

export default SyncOriginalChanged;
