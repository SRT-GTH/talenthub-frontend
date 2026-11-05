import SiteCopyChip from './SiteCopyChip.jsx';
import SiteCopyInfoCard from './SiteCopyInfoCard.jsx';

/*
 * SiteCopyLegendCard — "What the chips mean" (7.8.1b), shown on the right of the Talent / Parent / Recruiter / Institution lists while no section is picked.
 * Five rows: the chip in a 190 wide column and its 14/17 #1c2a21 explanation, verbatim from the frame.
 */
const ROWS = [
  { chip: { kind: 'default' }, text: 'Never edited. Shows the original text from the design.' },
  { chip: { kind: 'edited' }, text: 'Changed and live. Users see your words.' },
  {
    chip: { kind: 'draft', count: 1 },
    text: 'Has changes only staff can see. Publish to make them live.',
  },
  {
    chip: { kind: 'shared' },
    text: 'Appears on every page. Editing it changes all of them.',
  },
  { chip: { kind: 'soon' }, text: 'Not editable yet. It arrives with the next release.' },
];

const SiteCopyLegendCard = () => (
  <SiteCopyInfoCard title="What the chips mean">
    <ul className="m-0 flex list-none flex-col gap-[12px] p-0">
      {ROWS.map((r) => (
        <li
          key={r.chip.kind}
          className="flex flex-col items-start gap-[8px] sm:flex-row sm:items-center sm:gap-[14px]"
        >
          <span className="flex sm:w-[190px] sm:shrink-0">
            <SiteCopyChip kind={r.chip.kind} count={r.chip.count} />
          </span>
          <span className="min-w-0 flex-1 text-[14px] leading-[17px] text-[#1c2a21] max-sm:leading-[20px]">
            {r.text}
          </span>
        </li>
      ))}
    </ul>
  </SiteCopyInfoCard>
);

export default SiteCopyLegendCard;
