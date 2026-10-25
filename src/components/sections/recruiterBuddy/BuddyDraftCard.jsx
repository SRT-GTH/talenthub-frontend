/*
 * BuddyDraftCard — a change Career Buddy prepared for a recruiter (stage move or interview), shown
 * inside the Buddy's chat bubble. Nothing happens until the recruiter presses the primary button,
 * which calls POST /applications/agent-drafts/confirm with their own login (useRecruiterBuddyLive).
 * Not in Figma yet: it uses the recruiter board's card and button styles.
 *
 *   draft  { title, lines[], warnings[], confirmLabel, expiresInMinutes }
 *   state  'open' | 'busy' | 'done' | 'cancelled'
 */
const BTN_PRIMARY =
  'inline-flex h-[36px] cursor-pointer items-center justify-center whitespace-nowrap rounded-[8px] border-2 border-brand-green-dark bg-brand-green px-[16px] font-sans text-[13px] font-medium text-white shadow-[0_4px_0_0_#224626] transition-all duration-300 ease-in hover:bg-brand-green-hover active:translate-y-[4px] active:shadow-none disabled:cursor-not-allowed disabled:opacity-60';
const BTN_SECONDARY =
  'inline-flex h-[36px] cursor-pointer items-center justify-center whitespace-nowrap rounded-[8px] border border-[#e5e5e5] bg-white px-[16px] font-sans text-[13px] font-medium text-black transition-colors hover:bg-neutral disabled:cursor-not-allowed disabled:opacity-60';

const BuddyDraftCard = ({ draft, state, error, onConfirm, onCancel }) => (
  <article
    aria-label={draft.title}
    className="flex w-full  flex-col gap-[10px] rounded-[12px] border border-[#00522b]/10 bg-white p-[16px] shadow-[0_1px_2px_0_rgba(0,0,0,0.08)]"
  >
    <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.4px] text-brand-green-dark">
      For you to confirm
    </span>
    <h3 className="m-0 font-sans text-[15px] font-semibold leading-[19px] text-[#1c1c1a]">
      {draft.title}
    </h3>
    <div className="flex flex-col gap-[2px] font-sans text-[14px] leading-[20px] text-[#1c1c1a]">
      {draft.lines.map((l, i) => (
        <p key={i} className="m-0">
          {l}
        </p>
      ))}
    </div>
    {draft.warnings?.length ? (
      <div className="flex flex-col gap-[2px] rounded-[8px] bg-[#faf4e8] px-[10px] py-[8px] font-sans text-[13px] text-[#785910]">
        {draft.warnings.map((w, i) => (
          <p key={i} className="m-0">
            {w}
          </p>
        ))}
      </div>
    ) : null}
    {state === 'done' ? (
      <p role="status" className="m-0 font-sans text-[13px] font-semibold text-[#224626]">
        ✓ Done
      </p>
    ) : state === 'cancelled' ? (
      <p className="m-0 font-sans text-[13px] text-content-helper">Cancelled. Nothing changed.</p>
    ) : (
      <div className="flex flex-wrap items-center gap-[8px] pt-[4px]">
        <button
          type="button"
          className={BTN_PRIMARY}
          disabled={state === 'busy'}
          onClick={onConfirm}
        >
          {state === 'busy' ? 'Working…' : draft.confirmLabel}
        </button>
        <button
          type="button"
          className={BTN_SECONDARY}
          disabled={state === 'busy'}
          onClick={onCancel}
        >
          Cancel
        </button>
        <span className="font-sans text-[12px] text-content-helper">
          {`Valid for ${draft.expiresInMinutes} minutes`}
        </span>
      </div>
    )}
    {error ? (
      <p role="alert" className="m-0 font-sans text-[13px] text-[#b42318]">
        {error}
      </p>
    ) : null}
  </article>
);

export default BuddyDraftCard;
