import Button from '../../../components/ui/Button.jsx';
import ApiErrorNote from '../../../components/shared/ApiErrorNote.jsx';

/* Error / loading blocks for the live Community pages (no Figma frame: kept plain and on-brand). */
export const LiveError = ({ message, onRetry }) => (
  <div role="alert" className="flex flex-col items-start gap-[12px] rounded-[16px] border border-solid border-[#e6e6e6] bg-white p-[20px]">
    <ApiErrorNote message={message} />
    {onRetry ? (
      <Button variant="tertiary" size="sm" onClick={onRetry}>
        Try again
      </Button>
    ) : null}
  </div>
);

export const LiveLoading = ({ label = 'Loading…' }) => (
  <p aria-live="polite" className="m-0 py-[40px] text-center font-sans text-[14px] text-[#737373]">
    {label}
  </p>
);
