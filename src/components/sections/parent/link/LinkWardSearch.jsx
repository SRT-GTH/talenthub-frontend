import { useEffect } from 'react';
import { debug } from '../../../../utils/debug.js';
import LinkField from './LinkField.jsx';
import LinkMatchRow from './LinkMatchRow.jsx';
import LinkNoMatch from './LinkNoMatch.jsx';
import RelationChips from './RelationChips.jsx';
import { RELATIONS, SEARCH_COPY, findMatch, formatDob } from './data/linkWardData.js';

const log = debug('LinkWardSearch');

/*
 * LinkWardSearch — the search card of "Link another ward" (Figma PW-07 10034:141501, PW-07c 10052:2534; card 10034:142080): white, r24, #e7e7e7 hairline, soft shadow 0 5 17 (ink 3 %), p22, gap14.
 * Two fields side by side (name, date of birth), the Relationship chips, then the result: "1 match" + the row, or "No match yet" + the empty block.
 * Props: link (the useLinkWardState value: name, dob, rel, result, update), onSend, onOpenCode.
 * The result is derived from the typed values: nothing until the name and all 8 digits of the date are in; then a match when the mock child is found (`?result=none` forces "No match yet").
 * ⚠️ ASSUMPTION: Figma draws no explicit search button; results appear as the form completes. Below md the two fields stack.
 */
const LinkWardSearch = ({ link, onSend, onOpenCode }) => {
  const { name, dob, rel, result: forced, update } = link;
  const ready = name.trim().length > 0 && dob.length === 8;
  const match = ready && !forced ? findMatch(name, dob) : null;
  const outcome = !ready ? 'idle' : match ? 'match' : 'none';

  useEffect(() => {
    log('result', { ready, outcome, rel: rel || '(none)' });
  }, [ready, outcome, rel]);

  return (
    <section
      aria-label="Search for your ward"
      className="flex flex-col gap-[14px] rounded-[24px] border border-solid border-black-light bg-white p-[22px] shadow-[0_5px_17px_rgba(28,42,33,0.03)]"
    >
      <div className="flex flex-col gap-[14px] md:flex-row">
        <LinkField
          className="md:flex-1"
          label={SEARCH_COPY.nameLabel}
          hint={SEARCH_COPY.nameHint}
          value={name}
          autoComplete="off"
          onChange={(v) => update({ name: v }, { replace: true })}
        />
        <LinkField
          className="md:flex-1"
          label={SEARCH_COPY.dobLabel}
          hint={SEARCH_COPY.dobHint}
          value={formatDob(dob)}
          placeholder="DD / MM / YYYY"
          inputMode="numeric"
          autoComplete="off"
          onChange={(v) => update({ dob: v.replace(/\D/g, '').slice(0, 8) }, { replace: true })}
        />
      </div>

      <div className="flex flex-col gap-[8px]">
        <p className="m-0 font-sans text-[13px] leading-[16px] font-semibold text-neutral-darker">
          {SEARCH_COPY.relationLabel}
        </p>
        <RelationChips
          items={RELATIONS}
          value={rel}
          onChange={(id) => update({ rel: id }, { replace: true })}
        />
      </div>

      {outcome !== 'idle' ? (
        <div className="flex flex-col gap-[14px]" aria-live="polite">
          <h2 className="m-0 font-sans text-[20px] leading-[25px] font-semibold tracking-[-0.1px] text-[#1c2a21]">
            {outcome === 'match' ? SEARCH_COPY.matchOne : SEARCH_COPY.matchNone}
          </h2>
          {outcome === 'match' ? (
            <LinkMatchRow onSend={onSend} />
          ) : (
            <LinkNoMatch name={name.trim()} dob={dob} onHaveCode={onOpenCode} />
          )}
        </div>
      ) : null}
    </section>
  );
};

export default LinkWardSearch;
