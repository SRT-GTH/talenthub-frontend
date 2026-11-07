import { useRef, useState } from 'react';
import Button from '../../../ui/Button.jsx';
import IconTileDialog from '../../../ui/IconTileDialog.jsx';
import Textarea from '../../../ui/form/Textarea.jsx';
import { debug } from '../../../../utils/debug.js';
import { MessageIcon, PlusIcon } from './hiringIcons.jsx';
import { AUTO_MESSAGE_DIALOG as COPY, AUTO_MESSAGES } from './hiringData.js';

const log = debug('AutoMessageDialog');

// Fill the {tokens} with the sample candidate / recruiter of the preview ("AS AMA SEES IT").
const fillTokens = (text) =>
  Object.entries(COPY.sample).reduce((out, [token, value]) => out.split(token).join(value), text);

/*
 * AutoMessageDialog - "When someone applies" editor (Figma SR-09 10161:80292, "Modal · When someone applies" 10161:80627), on `ui/IconTileDialog` (600px, #0b1a0f 45 % scrim, the message tile).
 * A "Message *" textarea with its counter inside the box, the "Insert" token chips (they add the {token} at the cursor), the live "PREVIEW · AS AMA SEES IT" card,
 * "Reset to default" (the message's own default text) and Cancel / Save message.
 * Props: id (a key of AUTO_MESSAGES), text (the message now), onCancel, onSave(id, text).
 * ⚠️ ASSUMPTION: only "applied" is drawn; the other three messages open this same dialog with their own title, subtitle and default text (hiringData.js).
 */
const AutoMessageDialog = ({ id, text, onCancel, onSave }) => {
  const meta = AUTO_MESSAGES.find((m) => m.id === id) ?? AUTO_MESSAGES[0];
  const [value, setValue] = useState(text);
  const areaRef = useRef(null);
  const canSave = value.trim().length > 0 && value.length <= COPY.maxLength;
  log('render', { id: meta.id, length: value.length, canSave });

  const insert = (token) => {
    const el = areaRef.current;
    const start = el?.selectionStart ?? value.length;
    const end = el?.selectionEnd ?? value.length;
    const next = `${value.slice(0, start)}${token}${value.slice(end)}`.slice(0, COPY.maxLength);
    log('insert token', { token, at: start });
    setValue(next);
    requestAnimationFrame(() => {
      el?.focus();
      el?.setSelectionRange(start + token.length, start + token.length);
    });
  };

  return (
    <IconTileDialog
      icon={<MessageIcon className="size-[22px]" />}
      title={meta.title}
      body={meta.subtitle}
      onClose={onCancel}
      footer={
        <div className="flex flex-wrap items-center justify-between gap-x-[10px] gap-y-[12px]">
          <button
            type="button"
            onClick={() => {
              log('reset to default', { id: meta.id });
              setValue(meta.text);
            }}
            className="min-h-[24px] cursor-pointer border-0 bg-transparent p-0 text-[14px] leading-[24px] font-medium tracking-[0.2px] whitespace-nowrap text-[#387440] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
          >
            {COPY.reset}
          </button>
          <div className="flex items-center gap-[10px] max-sm:w-full max-sm:justify-end">
            <Button variant="tertiary" onClick={onCancel}>
              {COPY.cancel}
            </Button>
            <Button
              variant="primary"
              size="sm"
              disabled={!canSave}
              onClick={() => {
                log('save message', { id: meta.id, length: value.length });
                onSave(meta.id, value);
              }}
            >
              {COPY.save}
            </Button>
          </div>
        </div>
      }
    >
      <Textarea
        ref={areaRef}
        required
        label={COPY.messageLabel}
        maxLength={COPY.maxLength}
        showCounter
        counterInside
        rows={2}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        boxClassName="!rounded-[10px] !border !border-[#cccccc] !bg-white !shadow-[0_2.5px_0_0_rgba(191,191,191,0.8)]"
        textareaClassName="!resize-none !px-[16px] !pt-[12px] !pb-[8px] !leading-[24px]"
      />
      <p className="m-0 text-[12px] leading-[20px] font-medium tracking-[0.2px] text-[#575755]">
        {COPY.insert}
      </p>
      <div className="flex flex-wrap gap-[8px]">
        {COPY.tokens.map((token) => (
          <button
            key={token}
            type="button"
            aria-label={`Insert ${token}`}
            onClick={() => insert(token)}
            className="inline-flex min-h-[26px] cursor-pointer items-center gap-[4px] rounded-full border-0 bg-[#ebf1ec] px-[8px] py-[3px] text-[12px] leading-[20px] font-medium tracking-[0.2px] whitespace-nowrap text-[#2a5730] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440] max-sm:min-h-[32px]"
          >
            <PlusIcon className="size-[12px]" />
            {token}
          </button>
        ))}
      </div>
      <section
        aria-label={COPY.preview}
        className="flex flex-col gap-[6px] rounded-[16px] border border-solid border-[#e5e8e3] bg-[#fffefc] p-[16px]"
      >
        <h3 className="m-0 text-[12px] leading-[20px] font-semibold tracking-[0.2px] text-[#575755]">
          {COPY.preview}
        </h3>
        <p className="m-0 text-[14px] leading-[24px] tracking-[0.2px] text-[#111]">
          {fillTokens(value)}
        </p>
      </section>
    </IconTileDialog>
  );
};

export default AutoMessageDialog;
