import { useEffect, useId, useRef, useState } from 'react';
import Button from '../../../ui/Button.jsx';
import { debug } from '../../../../utils/debug.js';
import {
  EXPORT_OPTIONS,
  EXPORT_PURPOSE_DEFAULT,
  EXPORT_PURPOSE_MAX,
  buildExportCsv,
} from '../data/queriesData.js';
import ShareDialogShell from '../../publicData/share/ShareDialogShell.jsx';
import ShareRadioCard from '../../publicData/share/ShareRadioCard.jsx';
import { PRIMARY_BUTTON, TERTIARY_BUTTON } from '../../publicData/share/shareButtonClasses.js';

const log = debug('ExportCsvDialog');

/*
 * ExportCsvDialog — "Export as CSV" (Figma 11.5.1d, 8597:393645 "Modal · Download a PDF" re-used: 600 wide, header 22/26 + 14/20 sentence + close,
 * three radio cards This query · By district · By month, "Purpose (logged)" field with its counter "44 / 200", Cancel + "Download CSV").
 * Theme 8's ShareDialogShell / ShareRadioCard carry the chrome (Esc, Tab trap, scrim, scroll lock). The CSV is built client side from the mock
 * (aggregates only, counts under 5 written "<5"); a purpose is required (the export is logged with name and purpose) and the export uses 1 query
 * of the MoU quota (⚠️ ASSUMPTION: the frame prints no quota line). Focus returns to the opener on close.
 * Props: result (runQuery), onExported({ kind, purpose, fileName }), onClose.
 */

const ExportCsvDialog = ({ result, onExported, onClose }) => {
  const [kind, setKind] = useState('query');
  const [purpose, setPurpose] = useState(EXPORT_PURPOSE_DEFAULT);
  const inputId = useId();
  const openerRef = useRef(typeof document === 'undefined' ? null : document.activeElement);

  useEffect(() => {
    const opener = openerRef.current;
    log('open');
    return () => {
      if (opener && document.contains(opener)) opener.focus({ preventScroll: true });
    };
  }, []);

  const canSubmit = purpose.trim().length > 0;

  const submit = () => {
    if (!canSubmit) return;
    const csv = buildExportCsv(kind, result);
    const fileName = `nya-query-${kind}-2026-10-18.csv`;
    try {
      const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) {
      log.error('download failed', error);
    }
    onExported({ kind, purpose: purpose.trim(), fileName });
  };

  return (
    <ShareDialogShell
      title="Export as CSV"
      description="Aggregates only. Groups under 5 show as “<5”. Every export is logged with your name and purpose."
      onClose={onClose}
      width={600}
      footer={
        <>
          <Button
            type="button"
            variant="tertiary"
            size="md"
            onClick={onClose}
            className={TERTIARY_BUTTON}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
            size="sm"
            className={PRIMARY_BUTTON}
            disabled={!canSubmit}
            onClick={submit}
          >
            Download CSV
          </Button>
        </>
      }
    >
      <fieldset className="m-0 flex min-w-0 flex-col gap-[12px] border-0 p-0">
        <legend className="sr-only">What to export</legend>
        {EXPORT_OPTIONS(result).map((o) => (
          <ShareRadioCard
            key={o.id}
            name="export-kind"
            value={o.id}
            checked={kind === o.id}
            onChange={setKind}
            title={o.title}
            detail={o.sub}
          />
        ))}
      </fieldset>
      <div className="flex flex-col gap-[6px]">
        <label
          htmlFor={inputId}
          className="font-sans text-[13px] leading-[16px] font-semibold text-[#1c2a21]"
        >
          Purpose (logged)
        </label>
        <div className="flex items-center gap-[8px] rounded-[12px] border border-solid border-[#e7e7e7] bg-white px-[14px] py-[12px] focus-within:border-[#387440]">
          <input
            id={inputId}
            type="text"
            value={purpose}
            maxLength={EXPORT_PURPOSE_MAX}
            required
            onChange={(e) => setPurpose(e.target.value)}
            className="min-w-0 flex-1 border-0 bg-transparent p-0 font-sans text-[15px] leading-[18px] text-[#1c2a21] outline-none"
          />
          <span className="shrink-0 font-sans text-[13px] leading-[16px] font-medium text-[#595959]">
            {purpose.length} / {EXPORT_PURPOSE_MAX}
          </span>
        </div>
      </div>
    </ShareDialogShell>
  );
};

export default ExportCsvDialog;
