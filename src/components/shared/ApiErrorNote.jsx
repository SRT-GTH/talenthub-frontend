/*
 * ApiErrorNote — one-line backend error shown above a page's primary action.
 * Pass the message from getApiErrorMessage(); renders nothing when empty.
 */
const ApiErrorNote = ({ message, className = '' }) => {
  if (!message) return null;
  return (
    <p
      role="alert"
      data-testid="api-error"
      className={`w-full max-w-[420px] rounded-[10px] border border-[#F2C4BE] bg-[#FDF2F1] px-3 py-2 text-center text-[13px] leading-5 text-[#B42318] ${className}`}
    >
      {message}
    </p>
  );
};

export default ApiErrorNote;
