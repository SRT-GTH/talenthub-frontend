import { useRef, useState } from 'react';
import { debug } from '../../../../utils/debug.js';
import Checkbox from '../../../ui/form/Checkbox.jsx';
import Select from '../../../ui/form/Select.jsx';
import TextInput from '../../../ui/form/TextInput.jsx';
import InstitutionDialogActions from './InstitutionDialogActions.jsx';
import InstitutionDialogHeader from './InstitutionDialogHeader.jsx';
import InstitutionUploadBar from './InstitutionUploadBar.jsx';
import { CSV_COLUMNS } from './data/rosterData.js';
import { downloadTemplate } from './rosterTemplate.js';

const log = debug('InstitutionUploadPick');

/*
 * InstitutionUploadPick — step 1 of the CSV dialog, "CSV file. Up to 10,000 rows." (Figma 11.2.2c 8590:384612): drop zone with "Browse files" (a real file input and drag and drop),
 * "Map your columns" (Full name *, Ghana Card *, Programme * (select), Index number, Date of birth *, Year group, Guardian phone, Email: the CSV column each one comes from,
 * the placeholders are the default names), "Send every student an invite to link their profile", "Download template" (saves a real CSV) + "Check file →".
 * "Check file" with no file chosen checks the sample file drawn in Figma (form3_2026.csv, 312 rows) ⚠️ ASSUMPTION, so the whole flow can be walked without a file.
 * Props: file (File | null), onFile(file), headers (string[] of the chosen file), mapping, onMapping(next), invite, onInvite, onCheck.
 */

const InstitutionUploadPick = ({
  file,
  onFile,
  headers,
  mapping,
  onMapping,
  invite,
  onInvite,
  onCheck,
}) => {
  const inputRef = useRef(null);
  const [over, setOver] = useState(false);
  const choose = (f) => {
    if (!f) return;
    log('file', f.name, f.size);
    onFile(f);
  };
  return (
    <>
      <InstitutionDialogHeader
        chip="Upload a class list"
        title={['CSV ', 'file. Up to 10,000 rows.']}
        text="We check every row before anything is added: Ghana Card format, duplicates on your roster and students already at another institution."
      />
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          choose(e.dataTransfer.files?.[0]);
        }}
        className={over ? 'rounded-[16px] outline-2 outline-offset-2 outline-[#387440]' : undefined}
      >
        <InstitutionUploadBar
          title={file ? file.name : 'Drop your CSV here'}
          hint={
            file
              ? `${Math.max(1, Math.round(file.size / 1024))} KB · ready to check`
              : 'CSV · up to 10,000 rows · download the template first'
          }
          action="Browse files"
          onAction={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".csv,text/csv"
            className="sr-only"
            tabIndex={-1}
            aria-label="Choose a CSV file"
            data-testid="roster-csv-input"
            onChange={(e) => choose(e.target.files?.[0])}
          />
        </InstitutionUploadBar>
      </div>
      <div role="separator" aria-label="Map your columns" className="flex items-center gap-[12px]">
        <span aria-hidden="true" className="h-px flex-1 bg-[#e7e7e7]" />
        <span className="font-sans text-[12px] leading-[14px] font-semibold text-[#595959]">
          Map your columns
        </span>
        <span aria-hidden="true" className="h-px flex-1 bg-[#e7e7e7]" />
      </div>
      <div className="grid grid-cols-1 gap-x-[16px] gap-y-[20px] md:grid-cols-2">
        {CSV_COLUMNS.map((c) =>
          c.select ? (
            <Select
              key={c.id}
              label={c.label}
              required
              options={headers.length ? headers : [c.value]}
              value={
                mapping[c.id] ?? (headers.includes(c.value) ? c.value : (headers[0] ?? c.value))
              }
              onChange={(v) => onMapping({ ...mapping, [c.id]: v })}
            />
          ) : (
            <TextInput
              key={c.id}
              label={c.label}
              required={c.required}
              placeholder={c.placeholder}
              value={mapping[c.id] ?? ''}
              onChange={(e) => onMapping({ ...mapping, [c.id]: e.target.value })}
            />
          )
        )}
        <div className="md:col-span-2">
          <Checkbox
            label="Send every student an invite to link their profile"
            checked={invite}
            onChange={(e) => onInvite(e.target.checked)}
          />
        </div>
      </div>
      <InstitutionDialogActions
        cancelLabel="Download template"
        onCancel={() => {
          log('template');
          downloadTemplate();
        }}
        primaryLabel="Check file"
        onPrimary={onCheck}
      />
    </>
  );
};

export default InstitutionUploadPick;
