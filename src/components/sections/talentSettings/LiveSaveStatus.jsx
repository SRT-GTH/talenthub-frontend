import { classNames } from '../../../utils/classNames.js';

/* "Saved" / error line next to a live settings Save button (no Figma frame: plain and on-brand). */
const LiveSaveStatus = ({ status, className }) =>
  status ? (
    <p
      role={status.tone === 'error' ? 'alert' : 'status'}
      className={classNames(
        'm-0 text-[14px] font-medium',
        status.tone === 'error' ? 'text-[#c0392b]' : 'text-[#387440]',
        className
      )}
    >
      {status.text}
    </p>
  ) : null;

export default LiveSaveStatus;
