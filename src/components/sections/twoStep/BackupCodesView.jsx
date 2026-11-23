import { useState } from 'react';
import Button from '../../ui/Button.jsx';
import { Checkbox } from '../../ui/form';
import { debug } from '../../../utils/debug.js';

const log = debug('BackupCodesView');

/*
 * BackupCodesView — the 10 backup codes, shown once (user story A1 / screen 4): a two-column grid, "Download", "Copy" and "Print",
 * and an "I saved these" tick before Continue. The codes live only in this component's props; nothing is logged or stored.
 * Props: codes (string[]), onDone(), doneLabel (default "Continue").
 */

const fileText = (codes) =>
  [
    'Ghana Talent Hub — backup codes for 2-step verification',
    `Made ${new Date().toLocaleString('en-GB')}`,
    '',
    'Each code works once. Keep them somewhere safe, away from your phone.',
    '',
    ...codes.map((c, i) => `${String(i + 1).padStart(2, ' ')}. ${c}`),
    '',
  ].join('\n');

const BackupCodesView = ({ codes, onDone, doneLabel = 'Continue' }) => {
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  const download = () => {
    log('download');
    const url = URL.createObjectURL(new Blob([fileText(codes)], { type: 'text/plain' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'gth-backup-codes.txt';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const copy = async () => {
    log('copy');
    try {
      await navigator.clipboard.writeText(fileText(codes));
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  const print = () => {
    log('print');
    const w = window.open('', '_blank', 'noopener=no,width=480,height=640');
    if (!w) return;
    const esc = (s) =>
      String(s).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]);
    w.document.write(
      `<!doctype html><title>Backup codes</title><pre style="font:16px/1.7 ui-monospace,monospace;padding:24px">${esc(fileText(codes))}</pre>`
    );
    w.document.close();
    w.focus();
    w.print();
  };

  return (
    <div className="flex w-full flex-col gap-[16px]">
      <p className="m-0 font-sans text-[14px] leading-[20px] text-[#595959]">
        If you lose your phone, each of these codes lets you sign in once. This is the only time we
        show them.
      </p>
      <ol
        aria-label="Backup codes"
        className="m-0 grid list-none grid-cols-2 gap-[8px] rounded-[14px] bg-[#f6f7f4] p-[14px] max-sm:grid-cols-1"
      >
        {codes.map((c) => (
          <li
            key={c}
            className="rounded-[8px] bg-white px-[10px] py-[8px] text-center font-mono text-[15px] leading-[20px] font-semibold tracking-[0.06em] text-[#1c2a21]"
          >
            {c}
          </li>
        ))}
      </ol>
      <div className="flex flex-wrap gap-[10px]">
        <Button variant="tertiary" size="sm" onClick={download}>
          Download
        </Button>
        <Button variant="tertiary" size="sm" onClick={copy}>
          {copied ? 'Copied' : 'Copy'}
        </Button>
        <Button variant="tertiary" size="sm" onClick={print}>
          Print
        </Button>
      </div>
      <Checkbox
        label="I saved these codes somewhere safe"
        checked={saved}
        onChange={(e) => setSaved(Boolean(e?.target ? e.target.checked : e))}
      />
      <Button variant="primary" size="lg" disabled={!saved} onClick={onDone} className="w-full">
        {doneLabel}
      </Button>
    </div>
  );
};

export default BackupCodesView;
