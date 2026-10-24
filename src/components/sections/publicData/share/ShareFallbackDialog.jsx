import { useEffect, useRef } from 'react';
import Button from '../../../ui/Button.jsx';
import { TERTIARY_BUTTON } from './shareButtonClasses.js';
import ShareDialogShell from './ShareDialogShell.jsx';

/*
 * ShareFallbackDialog — Figma 8.1.2c "Copy the link" (8500:2226), shown when the Clipboard API is missing or refuses.
 * The link sits in a read-only field that is focused and fully selected on open (drawn as the blue "selected" state), so Ctrl/⌘ + C copies it.
 * Props: url, onClose().
 */

const KEY = 'font-sans text-[13px] leading-[16px] font-bold text-[#1c2a21]';

const ShareFallbackDialog = ({ url, onClose }) => {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  return (
    <ShareDialogShell
      title="Copy the link"
      description="Your browser blocked automatic copying. Select the link below and copy it."
      onClose={onClose}
      width={560}
      footer={
        <Button
          type="button"
          variant="tertiary"
          size="md"
          onClick={onClose}
          className={TERTIARY_BUTTON}
        >
          Close
        </Button>
      }
    >
      <input
        ref={inputRef}
        type="text"
        readOnly
        value={url}
        aria-label="Link to copy"
        data-autofocus=""
        onFocus={(event) => event.target.select()}
        className="w-full rounded-[12px] border-2 border-solid border-[#2a78d6] bg-[#eaeffb] px-[14px] py-[12px] font-sans text-[15px] leading-[18px] font-medium text-[#1c2a21] outline-none"
      />
      <p className="m-0 font-sans text-[14px] leading-[17px] text-[#595959]">
        Press <kbd className={KEY}>Ctrl + C</kbd> (Windows) or <kbd className={KEY}>⌘ + C</kbd>{' '}
        (Mac). On a phone, long-press the link.
      </p>
    </ShareDialogShell>
  );
};

export default ShareFallbackDialog;
