import { useState } from 'react';
import Button from '../../../ui/Button.jsx';
import { RecordsIconArrowr } from '../records/recordsIcons.jsx';
import CredentialField from './CredentialField.jsx';
import CredentialModal from './CredentialModal.jsx';
import { CredentialsIconShield } from './credentialsIcons.jsx';
import { CORRECTION_NOTE } from './data/credentialsData.js';

const pad = (n) => String(n).padStart(2, '0');
const dateText = (iso) => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? ''
    : `${pad(d.getUTCDate())} / ${pad(d.getUTCMonth() + 1)} / ${d.getUTCFullYear()}`;
};

/*
 * CredentialCorrectDialog — "Fix a typo on <first name>’s certificate" (Figma 11.2.4g 8744:436331, modal 8744:436529): the two fields that can be corrected
 * (student name, date of award) with a Was / Now table of what changes, the shield note and "Issue corrected copy →".
 * Props: credential (GET /credentials/:id), busy, onConfirm({ studentName?, date? }), onClose.
 */
const CredentialCorrectDialog = ({ credential, busy, onConfirm, onClose }) => {
  const first = credential.student.split(' ')[0];
  const oldDate = dateText(credential.issuedOn);
  const [name, setName] = useState(credential.student);
  const [date, setDate] = useState(oldDate);
  const rows = [
    name.trim() !== credential.student
      ? { id: 'name', a: 'Student name', b: credential.student, c: name.trim() }
      : null,
    date.trim() && date.replace(/\s/g, '') !== oldDate.replace(/\s/g, '')
      ? { id: 'date', a: 'Issued', b: credential.issuedLong, c: date.trim() }
      : null,
  ].filter(Boolean);
  return (
    <CredentialModal
      label="Corrected copy"
      chip="Corrected copy"
      heading={`Fix a typo on ${first}’s certificate`}
      description="The corrected copy replaces the old one. Links and QR codes keep working, and gth.com/verify shows the new version with a note that it was corrected."
      descriptionId="credential-correct-desc"
      onClose={onClose}
    >
      <form
        className="flex flex-col gap-[18px]"
        onSubmit={(e) => {
          e.preventDefault();
          if (busy || !rows.length) return;
          onConfirm({
            studentName: rows.some((r) => r.id === 'name') ? name.trim() : undefined,
            date: rows.some((r) => r.id === 'date') ? date.trim() : undefined,
          });
        }}
      >
        <div className="grid grid-cols-1 gap-x-[16px] gap-y-[18px] sm:grid-cols-2">
          <CredentialField label="Student name" required value={name} onChange={setName} />
          <CredentialField
            label="Date of award"
            required
            placeholder="DD / MM / YYYY"
            value={date}
            onChange={setDate}
          />
        </div>
        {rows.length ? (
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-0 border-b border-solid border-[#e7e7e7]">
                {['Field', 'Was', 'Now'].map((h) => (
                  <th
                    key={h}
                    className="pb-[10px] text-[12px] leading-[14px] font-medium text-[#575755]"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="text-[14px] leading-[17px] text-[#1c2a21]">
                  <th scope="row" className="py-[11px] text-left font-medium">
                    {r.a}
                  </th>
                  <td className="py-[11px]">{r.b}</td>
                  <td className="py-[11px] font-semibold">{r.c}</td>
                </tr>
              ))}
              <tr className="text-[14px] leading-[17px] text-[#1c2a21]">
                <th scope="row" className="py-[11px] text-left font-medium">
                  Credential ID
                </th>
                <td className="py-[11px]">{credential.number}</td>
                <td className="py-[11px] font-semibold">
                  {credential.number.replace(/\s*\(v\d+\)$/, '')} (v{(credential.version ?? 1) + 1})
                </td>
              </tr>
            </tbody>
          </table>
        ) : (
          <p className="m-0 text-[14px] leading-[20px] text-[#737373]">
            Change the name or the date to see what the corrected copy shows.
          </p>
        )}
        <p className="m-0 flex items-start gap-[8px] text-[13px] leading-[16px] text-[#575755]">
          <CredentialsIconShield className="size-[16px] shrink-0 text-[#575755]" />
          {CORRECTION_NOTE}
        </p>
        <div className="flex flex-wrap justify-end gap-[12px] pt-[8px]">
          <Button variant="tertiary-subtle" size="lg" className="!py-[14px]" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={busy || !rows.length}
            rightIcon={<RecordsIconArrowr className="size-[20px]" />}
          >
            {busy ? 'Issuing…' : 'Issue corrected copy'}
          </Button>
        </div>
      </form>
    </CredentialModal>
  );
};

export default CredentialCorrectDialog;
