import { useState } from 'react';
import Button from '../../../ui/Button.jsx';
import { RecordsIconArrowr } from '../records/recordsIcons.jsx';
import CredentialField from './CredentialField.jsx';
import CredentialModal from './CredentialModal.jsx';
import { CredentialsIconInfocircle } from './credentialsIcons.jsx';
import { BULK_NOTE, CREDENTIAL_TYPES, todayText } from './data/credentialsData.js';

const TONES = {
  plain: { box: 'bg-[#f8f8f4]', value: 'text-[#1c2a21]' },
  green: { box: 'bg-[#ebf1ec]', value: 'text-[#387440]' },
  amber: { box: 'bg-[#faf4e8]', value: 'text-[#967014]' },
};

/*
 * CredentialBulkDialog — "Issue completion certificates to <year group>" (Figma 11.2.4h 8744:436854, modal 8744:437052, 820 wide): the year group, the three
 * stat tiles (in the year group / on GTH now / get it when they link), the certificate fields and the second-approver note, then "Issue <n> certificates →".
 * Props: options (GET /credentials/options), busy, onConfirm(payload), onClose.
 */
const CredentialBulkDialog = ({ options, busy, onConfirm, onClose }) => {
  const forms = options?.forms ?? [];
  const [f, setF] = useState(() => ({
    form: forms.find((x) => x.id === '3')?.id ?? forms[0]?.id ?? '',
    type: CREDENTIAL_TYPES[0].value,
    title: '',
    date: todayText(),
    signedBy: options?.signedBy ?? '',
    second: '',
  }));
  const set = (patch) => setF((x) => ({ ...x, ...patch }));
  const group = forms.find((x) => x.id === f.form);
  const count = group?.students ?? 0;
  const over = options?.secondApproverOver ?? 50;
  const stats = [
    {
      id: 'in',
      value: String(count),
      label: `In ${group?.label ?? 'the year group'}`,
      tone: 'plain',
    },
    { id: 'get', value: String(group?.linked ?? 0), label: 'On GTH now', tone: 'green' },
    {
      id: 'wait',
      value: String(count - (group?.linked ?? 0)),
      label: 'Get it when they link',
      tone: 'amber',
    },
  ];
  return (
    <CredentialModal
      label="Bulk issue"
      chip="Bulk issue"
      heading={`Issue certificates to ${group?.label ?? 'a year group'}`}
      description="One certificate per student, signed with your institution key. Students who haven’t linked their profile get it when they do."
      descriptionId="credential-bulk-desc"
      onClose={onClose}
    >
      {forms.length ? (
        <form
          className="flex flex-col gap-[18px]"
          onSubmit={(e) => {
            e.preventDefault();
            if (busy || !count) return;
            const type = CREDENTIAL_TYPES.find((t) => t.value === f.type) ?? CREDENTIAL_TYPES[0];
            onConfirm({ ...f, type: type.value, kind: type.kind, second: f.second || undefined });
          }}
        >
          <ul className="m-0 grid list-none grid-cols-1 gap-[12px] p-0 sm:grid-cols-3">
            {stats.map((s) => (
              <li
                key={s.id}
                className={`flex flex-col gap-[4px] rounded-[14px] px-[16px] py-[14px] ${TONES[s.tone].box}`}
              >
                <span className={`text-[26px] leading-[31px] font-semibold ${TONES[s.tone].value}`}>
                  {s.value}
                </span>
                <span className="text-[12px] leading-[14px] font-medium text-[#575755]">
                  {s.label}
                </span>
              </li>
            ))}
          </ul>
          <div className="grid grid-cols-1 gap-x-[16px] gap-y-[18px] sm:grid-cols-2">
            <CredentialField
              label="Year group"
              required
              options={forms.map((x) => ({
                value: x.id,
                label: `${x.label} · ${x.students} ${x.students === 1 ? 'student' : 'students'}`,
              }))}
              value={f.form}
              onChange={(v) => set({ form: v })}
            />
            <CredentialField
              label="Credential type"
              required
              options={CREDENTIAL_TYPES}
              value={f.type}
              onChange={(v) => set({ type: v })}
            />
            <CredentialField
              label="Title on the certificate"
              required
              placeholder="e.g. WASSCE class of 2026"
              value={f.title}
              onChange={(v) => set({ title: v })}
            />
            <CredentialField
              label="Date of award"
              required
              placeholder="DD / MM / YYYY"
              value={f.date}
              onChange={(v) => set({ date: v })}
            />
            <CredentialField
              label="Signed by"
              required
              value={f.signedBy}
              onChange={(v) => set({ signedBy: v })}
            />
            <CredentialField
              label="Second signatory"
              optional
              value={f.second}
              onChange={(v) => set({ second: v })}
            />
          </div>
          <p className="m-0 flex items-start gap-[8px] text-[13px] leading-[16px] text-[#575755]">
            <CredentialsIconInfocircle className="size-[16px] shrink-0 text-[#575755]" />
            {BULK_NOTE(over)}
          </p>
          <div className="flex flex-wrap justify-end gap-[12px] pt-[8px]">
            <Button variant="tertiary-subtle" size="lg" className="!py-[14px]" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={busy || !count}
              rightIcon={<RecordsIconArrowr className="size-[20px]" />}
            >
              {busy ? 'Issuing…' : `Issue ${count} ${count === 1 ? 'certificate' : 'certificates'}`}
            </Button>
          </div>
        </form>
      ) : (
        <p className="m-0 text-[14px] leading-[20px] text-[#595959]">
          {options
            ? 'Your roster is empty. Add students under Progress first.'
            : 'Loading your roster…'}
        </p>
      )}
    </CredentialModal>
  );
};

export default CredentialBulkDialog;
