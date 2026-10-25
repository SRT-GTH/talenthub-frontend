/*
 * AdminLoadNotice — inline notice for a loading / failed / restricted (403) admin section; renders children once loaded.
 */

/** Inline notice for a load error or an empty / restricted section. */
const AdminLoadNotice = ({ loading, error, status, onRetry, children }) => {
  if (loading) {
    return (
      <p role="status" className="m-0 rounded-[20px] border border-solid border-[#e1eae2] bg-white px-[18px] py-[16px] font-sans text-[14px] text-[#737373]">
        Loading…
      </p>
    );
  }
  if (error) {
    const restricted = status === 403;
    return (
      <div role="alert" className="flex flex-wrap items-center gap-[12px] rounded-[20px] border border-solid border-[#eedeb8] bg-[#faf4e8] px-[18px] py-[14px] font-sans text-[14px] leading-[20px] text-[#1c2a21]">
        <span className="flex-1">
          {restricted ? 'Your role can’t see this. ' : 'Couldn’t load this. '}
          <span className="text-[#737373]">{error}</span>
        </span>
        {!restricted && onRetry ? (
          <button
            type="button"
            onClick={onRetry}
            className="cursor-pointer rounded-full border border-solid border-[#1c2a21] bg-white px-[14px] py-[6px] font-sans text-[13px] font-semibold text-[#1c2a21]"
          >
            Try again
          </button>
        ) : null}
      </div>
    );
  }
  return children ?? null;
};

export default AdminLoadNotice;
