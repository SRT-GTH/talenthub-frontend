import { useId, useState } from 'react';
import { debug } from '../../../../utils/debug.js';
import { SUGGESTIONS } from './interestsData.js';
import { CARD_BASE, FOCUS_RING, SHELF_ONLY } from './interestsStyles.js';
import * as Icons from './interestsIcons.jsx';
import Button from '../../../ui/Button.jsx';

const log = debug('InterestCard');

const SpecificChip = ({ text, onRemove }) => (
  <span className="inline-flex items-center gap-[6px] rounded-full border border-solid border-[rgba(28,42,33,0.12)] bg-[#ebf1ec] py-[7px] pr-[10px] pl-[12px] font-sans text-[13px] font-semibold leading-[16px] text-[#2a5730] playful:border-[1.2px] playful:border-[#1c2a21] playful:shadow-[2px_2px_0_rgba(28,42,33,.45)] max-lg:text-[12px]">
    {text}
    <button
      type="button"
      aria-label={`Remove ${text}`}
      onClick={onRemove}
      className={`-m-[6px] grid min-h-[24px] min-w-[24px] cursor-pointer place-items-center border-0 bg-transparent p-0 text-[12px] text-[#2a5730] ${FOCUS_RING}`}
    >
      <Icons.CloseIcon />
    </button>
  </span>
);

/*
 * SpecificsEditor (IN-03 expanded block): "YOUR SPECIFICS IN …" chips with ×, the optional "Add a specific" field + Add
 * button, and (when the area has suggestions) the "SUGGESTED FOR YOU" chips. Props: area {id,label}, specifics, onAdd(text),
 * onRemove(text).
 */
const SpecificsEditor = ({ area, specifics, onAdd, onRemove }) => {
  const [text, setText] = useState('');
  const inputId = useId();
  const suggestions = (SUGGESTIONS[area.id] ?? []).filter(
    (s) => !specifics.some((x) => x.toLowerCase() === s.toLowerCase())
  );
  const submit = () => {
    if (onAdd(text)) setText('');
  };
  return (
    <div className="flex flex-col gap-3 border-0 border-t border-solid border-[#e7e7e7] pt-4">
      <p className="m-0 font-sans text-[11px] font-bold uppercase leading-[13px] tracking-[1.2px] text-[#595959] max-lg:text-[12px]">
        Your specifics in {area.label}
      </p>
      {specifics.length ? (
        <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
          {specifics.map((s) => (
            <li key={s}>
              <SpecificChip text={s} onRemove={() => onRemove(s)} />
            </li>
          ))}
        </ul>
      ) : null}
      <form
        className="flex items-end gap-[10px]"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex items-baseline justify-between gap-3">
            <label
              htmlFor={inputId}
              className="font-sans text-[14px] font-medium leading-[24px] tracking-[0.2px] text-[#1c2a21]"
            >
              Add a specific
            </label>
            <span className="font-sans text-[12px] leading-[18px] tracking-[0.2px] text-[#595959]">
              Optional
            </span>
          </div>
          <input
            id={inputId}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="e.g. Mobile development, Cloud infrastructure, Cybersecurity"
            className={`h-[51px] w-full min-w-0 rounded-[10px] border border-solid border-[#ccc] bg-white px-4 pl-5 font-sans text-[14px] leading-[20px] tracking-[0.2px] text-[#1c2a21] shadow-[4px_4px_0_rgba(28,42,33,.45),0_10px_24px_rgba(28,42,33,.06)] placeholder:text-[#595959] ${FOCUS_RING}`}
          />
        </div>
        <Button type="submit" size="sm">
          Add
        </Button>
      </form>
      {suggestions.length ? (
        <>
          <p className="m-0 font-sans text-[11px] font-bold uppercase leading-[13px] tracking-[1.2px] text-[#595959] max-lg:text-[12px]">
            Suggested for you
          </p>
          <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
            {suggestions.map((s) => (
              <li key={s}>
                <button
                  type="button"
                  onClick={() => {
                    log('add suggestion', s);
                    onAdd(s);
                  }}
                  className={`inline-flex min-h-[32px] cursor-pointer items-center gap-[5px] rounded-full border border-solid border-[#e7e7e7] bg-white py-[7px] pr-[12px] pl-[10px] font-sans text-[13px] font-medium leading-[16px] text-[#1c2a21] max-lg:text-[12px] ${FOCUS_RING}`}
                >
                  <span className="text-[13px] text-[#387440]">
                    <Icons.PlusIcon />
                  </span>
                  {s}
                </button>
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </div>
  );
};

/*
 * InterestCard: one area in "Your interests" (Figma "Interest · …"): tile (green + ink for the Primary area), name,
 * "Primary" chip, specifics summary (amber when empty) and the Edit/Add specifics toggle (reads "Close" when open).
 * Props: area {id,label,icon}, specifics, primary, open, onToggle, onAddSpecific, onRemoveSpecific.
 */
const InterestCard = ({
  area,
  specifics,
  primary,
  open,
  onToggle,
  onAddSpecific,
  onRemoveSpecific,
}) => {
  const Glyph = Icons[`${area.icon}Icon`];
  const panelId = useId();
  const empty = specifics.length === 0;
  const summary = empty
    ? 'No specifics yet. Add 2–3 to sharpen your matches.'
    : `${specifics.length} specific${specifics.length === 1 ? '' : 's'} · ${specifics.join(' · ')}`;
  return (
    <section
      aria-label={area.label}
      className={`flex flex-col gap-[14px] rounded-[20px] py-5 pr-[22px] pl-5 ${CARD_BASE} ${SHELF_ONLY}`}
    >
      <div className="flex flex-wrap items-center gap-[14px]">
        <span
          className={`grid size-[48px] shrink-0 place-items-center rounded-[14px] text-[22px] ${
            primary
              ? `border border-solid border-[rgba(28,42,33,0.1)] bg-[#387440] text-white playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] ${SHELF_ONLY}`
              : 'bg-[#ebf1ec] text-[#387440]'
          }`}
        >
          <Glyph />
        </span>
        <div className="flex min-w-[200px] flex-1 flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="m-0 font-sans text-[18px] font-semibold leading-[21px] text-[#1c2a21]">
              {area.label}
            </h3>
            {primary ? (
              <span
                className={`inline-flex items-center rounded-full border border-solid border-[rgba(28,42,33,0.12)] bg-[#387440] px-[10px] py-[4px] font-sans text-[11px] font-semibold leading-[13px] text-[#1c2a21] playful:border-[#1c2a21] max-lg:text-[12px]`}
              >
                Primary
              </span>
            ) : null}
          </div>
          <p
            className={`m-0 font-sans text-[13px] leading-[16px] max-lg:text-[12px] ${
              empty ? 'text-[#785910]' : 'text-[#595959]'
            }`}
          >
            {summary}
          </p>
        </div>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          className={`inline-flex min-h-[34px] cursor-pointer items-center gap-[6px] rounded-[10px] border border-solid border-[#e7e7e7] bg-transparent px-3 py-2 font-sans text-[13px] font-semibold leading-[16px] text-[#387440] max-lg:text-[12px] ${FOCUS_RING}`}
        >
          {open ? 'Close' : empty ? 'Add specifics' : 'Edit specifics'}
          <span className={`text-[14px] ${open ? 'rotate-180' : ''}`}>
            <Icons.ChevronDownIcon />
          </span>
        </button>
      </div>
      {open ? (
        <div id={panelId}>
          <SpecificsEditor
            area={area}
            specifics={specifics}
            onAdd={(t) => onAddSpecific(t)}
            onRemove={(t) => onRemoveSpecific(t)}
          />
        </div>
      ) : null}
    </section>
  );
};

export default InterestCard;
