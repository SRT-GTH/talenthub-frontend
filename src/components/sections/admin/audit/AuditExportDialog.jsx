import { useState } from 'react';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import AgencyDialog from '../../agency/onboarding/AgencyDialog.jsx';
import { AdminClose20Icon } from '../adminIcons.jsx';
import { EXPORT } from './data/adminAuditData.js';

const log = debug('AuditExportDialog');

/*
 * AuditExportDialog — "Export the audit log" (Figma 7.5.3c 8639:5521, 600 wide, r24, scrim #121712 at 48 %): header (22/600 title, 14 #595959 sub, 34 round close) · body with
 * three radio options (r14, 15/600 + 13 #595959; selected = #ebf1ec with a #387440 ring and a 6px green ring on the dot) and a "Reason (logged)" field with a 36 / 200 counter ·
 * footer hairline with the white Cancel and the green "Export CSV".
 * Props: onClose, onSubmit({ option, reason }).
 * ⚠️ ASSUMPTION: the export is a mock (it logs the option and closes); the reason is editable and capped at 200.
 */

const AuditExportDialog = ({ onClose, onSubmit }) => {
  const [option, setOption] = useState(EXPORT.options[0].id);
  const [reason, setReason] = useState(EXPORT.reason);

  const submit = (e) => {
    e.preventDefault();
    log('export (mock)', { option, reasonLength: reason.length });
    onSubmit?.({ option, reason });
  };

  return (
    <AgencyDialog
      label={EXPORT.title}
      onClose={onClose}
      scrimClassName="bg-[#121712]/48"
      panelClassName="w-[min(600px,calc(100vw-32px))]"
    >
      <form
        onSubmit={submit}
        className="flex flex-col overflow-hidden rounded-[24px] bg-white shadow-[0_24px_64px_rgba(0,0,0,0.2)]"
      >
        <header className="flex items-start gap-[8px] px-[28px] pt-[24px] pb-[8px]">
          <div className="flex min-w-0 flex-1 flex-col gap-[4px]">
            <h2 className="m-0 font-sans text-[22px] leading-[26px] font-semibold text-[#1c2a21]">
              {EXPORT.title}
            </h2>
            <p className="m-0 font-sans text-[14px] leading-[20px] text-[#595959] sm:whitespace-nowrap">
              {EXPORT.sub}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid size-[34px] shrink-0 cursor-pointer place-items-center rounded-full border-0 bg-[#f2f2ee] text-[#1a1a18] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
          >
            <AdminClose20Icon className="size-[18px]" />
          </button>
        </header>

        <div className="flex flex-col gap-[16px] px-[28px] pt-[16px] pb-[20px]">
          <div role="radiogroup" aria-label="What to export" className="flex flex-col gap-[16px]">
            {EXPORT.options.map((o) => {
              const on = option === o.id;
              return (
                <button
                  key={o.id}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => setOption(o.id)}
                  className={classNames(
                    'flex w-full cursor-pointer items-center gap-[14px] rounded-[14px] border border-solid px-[14px] py-[16px] text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]',
                    on ? 'border-[#387440] bg-[#ebf1ec]' : 'border-[#e7e7e7] bg-white'
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={classNames(
                      'size-[20px] shrink-0 rounded-full bg-white',
                      on
                        ? 'border-[6px] border-solid border-[#387440]'
                        : 'border-[1.5px] border-solid border-[#b5b5b1]'
                    )}
                  />
                  <span className="flex min-w-0 flex-col gap-[2px]">
                    <span className="font-sans text-[15px] leading-[18px] font-semibold text-[#1c2a21]">
                      {o.title}
                    </span>
                    <span className="font-sans text-[13px] leading-[16px] text-[#595959]">
                      {o.meta}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          <label className="flex flex-col gap-[6px]">
            <span className="font-sans text-[13px] leading-[16px] font-semibold text-[#1c2a21]">
              {EXPORT.reasonLabel}
            </span>
            <span className="flex h-[44px] items-center gap-[8px] rounded-[12px] border border-solid border-[#e7e7e7] bg-white px-[14px]">
              <input
                type="text"
                value={reason}
                maxLength={EXPORT.reasonMax}
                onChange={(e) => setReason(e.target.value)}
                className="min-w-0 flex-1 border-0 bg-transparent p-0 font-sans text-[15px] leading-[18px] text-[#1c2a21] outline-none"
              />
              <span className="font-sans text-[13px] leading-[16px] font-medium text-[#595959]">
                {reason.length} / {EXPORT.reasonMax}
              </span>
            </span>
          </label>
        </div>

        <footer className="flex items-center justify-end gap-[12px] border-0 border-t border-solid border-[#e7e7e7] px-[28px] py-[18px]">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-[48px] cursor-pointer items-center rounded-[14px] border-2 border-solid border-[#1c2a21] bg-white px-[22px] font-sans text-[16px] leading-[24px] font-bold text-[#1c2a21] shadow-[0_4px_0_rgba(17,17,17,0.25)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
          >
            {EXPORT.cancel}
          </button>
          <button
            type="submit"
            data-autofocus
            className="inline-flex h-[48px] cursor-pointer items-center rounded-[10px] border-2 border-solid border-[#2a5730] bg-[#387440] px-[18px] font-sans text-[16px] leading-[24px] font-bold text-white shadow-[0_4px_0_#2a5730] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
          >
            {EXPORT.submit}
          </button>
        </footer>
      </form>
    </AgencyDialog>
  );
};

export default AuditExportDialog;
