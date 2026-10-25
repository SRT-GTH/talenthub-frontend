import { useEffect, useId } from 'react';
import { debug } from '../../../../utils/debug.js';
import Button from '../../../ui/Button.jsx';
import { RecordsIconArrowr } from '../records/recordsIcons.jsx';
import CredentialField from './CredentialField.jsx';
import CredentialModal from './CredentialModal.jsx';
import { CredentialsIconUpload } from './credentialsIcons.jsx';
import { TEMPLATES } from './data/credentialsData.js';

const log = debug('CredentialIssueDialog');

/*
 * CredentialIssueDialog — "One student. Signed by your institution." (Figma 11.2.4b 8593:388993, modal 8593:389543, 820 wide) over the credentials list.
 * The dashed upload panel ("Issuing for a whole class?" · Choose students) switches to the bulk dialog; the form below issues one credential:
 * Student · Credential type · Template (select) · Title on the certificate · Date of award · Grade or result (optional) · Signed by · Second signatory · "Email <first name> when it’s issued",
 * then Cancel and "Preview certificate →". The form values live in the credentials store (the preview page and "Back to editing" read them).
 * Props: form, onChange(patch), onPreview(), onClass(), onCancel().
 */
const CredentialIssueDialog = ({ form, onChange, onPreview, onClass, onCancel }) => {
  const emailId = useId();
  const firstName = form.student.split(' ')[0] || 'the student';

  useEffect(() => {
    log('open');
  }, []);

  return (
    <CredentialModal
      label="Issue a credential"
      chip="Issue a credential"
      heading={
        <>
          One <span className="text-[#387440]">student. Signed by your institution.</span>
        </>
      }
      description="We sign every credential with your institution’s key. Students can share it, and anyone can check it’s real at gth.com/verify."
      descriptionId="credential-issue-desc"
      onClose={onCancel}
    >
      <div className="flex flex-wrap items-center gap-[16px] rounded-[16px] border border-dashed border-[#387440] bg-[#ebf1ec] p-[18px]">
        <span className="flex size-[56px] shrink-0 items-center justify-center rounded-[16px] border border-solid border-[#1c2a21]/10 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.06),0_2px_8px_rgba(0,0,0,0.06)]">
          <CredentialsIconUpload className="size-[26px] text-[#387440]" />
        </span>
        <div className="flex min-w-[200px] flex-1 flex-col gap-[3px]">
          <p className="m-0 text-[15px] leading-[18px] font-semibold text-[#1c2a21]">
            Issuing for a whole class?
          </p>
          <p className="m-0 text-[13px] leading-[16px] text-[#595959]">
            Pick students from your roster and issue up to 500 at once
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={onClass}>
          Choose students
        </Button>
      </div>
      <div className="flex items-center gap-[12px]" role="separator" aria-label="or issue one">
        <span className="h-px flex-1 bg-[#e7e7e7]" />
        <span className="text-[12px] leading-[14px] font-semibold text-[#595959]">
          or issue one
        </span>
        <span className="h-px flex-1 bg-[#e7e7e7]" />
      </div>
      <form
        className="flex flex-col gap-[20px]"
        onSubmit={(e) => {
          e.preventDefault();
          onPreview();
        }}
      >
        <div className="grid grid-cols-1 gap-x-[16px] gap-y-[20px] sm:grid-cols-2">
          <CredentialField
            label="Student"
            required
            autoFocus
            value={form.student}
            onChange={(v) => onChange({ student: v })}
          />
          <CredentialField
            label="Credential type"
            required
            value={form.type}
            onChange={(v) => onChange({ type: v })}
          />
          <CredentialField
            label="Template"
            required
            options={TEMPLATES}
            value={form.template}
            onChange={(v) => onChange({ template: v })}
          />
          <CredentialField
            label="Title on the certificate"
            value={form.title}
            onChange={(v) => onChange({ title: v })}
          />
          <CredentialField
            label="Date of award"
            required
            value={form.date}
            onChange={(v) => onChange({ date: v })}
          />
          <CredentialField
            label="Grade or result"
            optional
            placeholder="e.g. Distinction"
            value={form.grade}
            onChange={(v) => onChange({ grade: v })}
          />
          <CredentialField
            label="Signed by"
            value={form.signedBy}
            onChange={(v) => onChange({ signedBy: v })}
          />
          <CredentialField
            label="Second signatory"
            value={form.second}
            onChange={(v) => onChange({ second: v })}
          />
        </div>
        <label
          htmlFor={emailId}
          className="flex w-fit cursor-pointer items-center gap-[10px] text-[14px] leading-[17px] font-medium text-[#1c2a21]"
        >
          <input
            id={emailId}
            type="checkbox"
            checked={form.email}
            onChange={(e) => onChange({ email: e.target.checked })}
            className="size-[20px] shrink-0 cursor-pointer rounded-[6px] accent-[#387440]"
          />
          Email {firstName} when it’s issued
        </label>
        <div className="flex flex-wrap justify-end gap-[12px] pt-[8px]">
          <Button variant="tertiary-subtle" size="lg" className="!py-[14px]" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="md"
            rightIcon={<RecordsIconArrowr className="size-[20px]" />}
          >
            Preview certificate
          </Button>
        </div>
      </form>
    </CredentialModal>
  );
};

export default CredentialIssueDialog;
