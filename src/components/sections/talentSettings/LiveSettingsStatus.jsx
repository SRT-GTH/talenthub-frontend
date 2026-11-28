/*
 * LiveSettingsStatus — what a live Settings page shows while GET /settings/overview loads or after it failed (never the
 * drawn mock in its place). Shared by the talent Settings (`/settings/*`) and the parent Settings (`/parent/settings`).
 * Props: live (useLiveSettings(): status, reload).
 */
const LiveSettingsStatus = ({ live }) =>
  live.status === 'error' ? (
    <div
      role="alert"
      className="flex flex-col items-start gap-[12px] rounded-[20px] bg-white p-[24px]"
    >
      <p className="m-0 text-[15px] font-medium text-[#c0392b]">
        Couldn’t load your settings. Check your connection and try again.
      </p>
      <button
        type="button"
        onClick={live.reload}
        className="cursor-pointer rounded-[10px] border border-solid border-[#ccc] bg-white px-[16px] py-[8px] text-[14px] font-semibold text-[#1c2a21]"
      >
        Try again
      </button>
    </div>
  ) : (
    <p aria-live="polite" className="m-0 py-[40px] text-center text-[14px] text-[#737373]">
      Loading your settings…
    </p>
  );

export default LiveSettingsStatus;
