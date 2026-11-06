import { useId, useState } from 'react';
import { debug } from '../../../../utils/debug.js';
import Checkbox from '../../../ui/form/Checkbox.jsx';
import Select from '../../../ui/form/Select.jsx';
import TextInput from '../../../ui/form/TextInput.jsx';
import InstitutionDialogActions from './InstitutionDialogActions.jsx';
import InstitutionDialogHeader from './InstitutionDialogHeader.jsx';
import InstitutionDialogShell from './InstitutionDialogShell.jsx';
import InstitutionUploadBar from './InstitutionUploadBar.jsx';
import { PROGRAMMES } from './data/rosterData.js';
import { rosterActions } from './rosterStore.js';
import { validateStudent } from './rosterValidation.js';

const log = debug('InstitutionAddStudentDialog');

/*
 * InstitutionAddStudentDialog — "One student. We check their Ghana Card." (Figma 11.2.2b 8590:383922, ?modal=add-student or /institution/students/new).
 * Upload strip ("Have a class list? Upload a CSV instead" → switches to the upload dialog) · "or add one student" · Full name *, Ghana Card number *, Programme * (General Science),
 * Index number, Date of birth *, Year group, Student email (Optional), Parent or guardian phone · "Send the student an invite to link their profile" · Cancel + "Add student →".
 * Validation (rosterValidation.js, repeated by the server); the first invalid field gets focus. Submit → POST /api/institution/students: a student who
 * already has a GTH account (same email) gets a "Is this your school?" request, anyone else an email invite when "Send the student an invite" is ticked.
 * The dialog closes with a status line (and, for an under-18, an "Ask for consent" action that opens the consent dialog). A server problem (duplicate, already
 * at another school) is shown above the buttons. The Ghana Card number is optional and never stored: only a hash to spot duplicates.
 * Props: onClose, onUpload (switch to the CSV dialog), onConsent (open the consent dialog), programmes (the roster's programmes, merged with the usual SHS ones).
 */

const EMPTY = {
  name: '',
  card: '',
  programme: 'General Science',
  index: '',
  dob: '',
  year: '',
  email: '',
  guardian: '',
  guardianEmail: '',
  invite: true,
};

const InstitutionAddStudentDialog = ({ onClose, onUpload, onConsent, programmes = [] }) => {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState('');
  const options = [...new Set([...PROGRAMMES, ...programmes])];
  const formId = useId();
  const set = (key) => (event) => setForm((f) => ({ ...f, [key]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    if (busy) return;
    const { errors: next, under18, dob } = validateStudent(form);
    setErrors(next);
    const first = Object.keys(next)[0];
    if (first) {
      log('invalid', Object.keys(next));
      window.requestAnimationFrame(() =>
        document
          .querySelector(
            `#${CSS.escape(formId)} [data-field="${first}"] input, #${CSS.escape(formId)} [data-field="${first}"] button`
          )
          ?.focus()
      );
      return;
    }
    setBusy(true);
    setProblem('');
    const out = await rosterActions.addStudent({
      name: form.name.trim(),
      ghanaCard: form.card.trim() || undefined,
      programme: form.programme,
      indexNumber: form.index.trim() || undefined,
      dateOfBirth: dob ? dob.toISOString().slice(0, 10) : undefined,
      form: form.year.trim().replace(/\D/g, '') || '1',
      email: form.email.trim() || undefined,
      guardianPhone: form.guardian.trim() || undefined,
      guardianEmail: form.guardianEmail.trim() || undefined,
      invite: form.invite,
    });
    setBusy(false);
    if (!out.ok) {
      setProblem(out.message);
      return;
    }
    const s = out.student || {};
    log('added', s.id, s.status);
    const how =
      s.status === 'invited'
        ? ' We emailed them an invite to link their profile.'
        : s.status === 'pending-confirmation'
          ? ' They already have a GTH profile: we asked them to confirm your school.'
          : s.status === 'linked'
            ? ' Their GTH profile is linked.'
            : '';
    rosterActions.toast({
      message: `${s.name || form.name.trim()} was added to your roster.${how}`,
      action: under18 ? { label: 'Ask for consent', onClick: onConsent } : undefined,
    });
    onClose();
  };

  return (
    <InstitutionDialogShell label="Add a student" onClose={onClose}>
      <InstitutionDialogHeader
        chip="Add a student"
        title={['One student. ', 'They link their own profile.']}
        text="The student links their own GTH profile from the invite. Students under 18 need a parent or guardian phone or email."
      />
      <InstitutionUploadBar
        title="Have a class list? Upload a CSV instead"
        hint="Up to 2,000 rows per file · we check every row before importing"
        action="Upload CSV"
        onAction={onUpload}
      />
      <div
        role="separator"
        aria-label="or add one student"
        className="flex items-center gap-[12px]"
      >
        <span aria-hidden="true" className="h-px flex-1 bg-[#e7e7e7]" />
        <span className="font-sans text-[12px] leading-[14px] font-semibold text-[#595959]">
          or add one student
        </span>
        <span aria-hidden="true" className="h-px flex-1 bg-[#e7e7e7]" />
      </div>
      <form
        id={formId}
        noValidate
        onSubmit={submit}
        className="grid grid-cols-1 gap-x-[16px] gap-y-[20px] md:grid-cols-2"
      >
        <div data-field="name">
          <TextInput
            label="Full name"
            required
            placeholder="e.g. Abena Mahama"
            value={form.name}
            onChange={set('name')}
            error={errors.name}
            data-autofocus=""
          />
        </div>
        <div data-field="card">
          <TextInput
            label={
              <>
                Ghana Card number{' '}
                <span className="ml-[6px] text-[12px] leading-[18px] font-normal text-[#595959]">
                  Optional · spots duplicates
                </span>
              </>
            }
            placeholder="GHA-000000000-0"
            value={form.card}
            onChange={set('card')}
            error={errors.card}
          />
        </div>
        <div data-field="programme">
          <Select
            label="Programme"
            required
            options={options}
            value={form.programme}
            onChange={(v) => setForm((f) => ({ ...f, programme: v?.target ? v.target.value : v }))}
            error={errors.programme}
          />
        </div>
        <div data-field="index">
          <TextInput
            label="Index number"
            placeholder="From the student’s admission letter"
            value={form.index}
            onChange={set('index')}
          />
        </div>
        <div data-field="dob">
          <TextInput
            label="Date of birth"
            required
            placeholder="DD / MM / YYYY"
            value={form.dob}
            onChange={set('dob')}
            error={errors.dob}
          />
        </div>
        <div data-field="year">
          <TextInput
            label="Year group"
            placeholder="Form 1, 2 or 3"
            value={form.year}
            onChange={set('year')}
            error={errors.year}
          />
        </div>
        <div data-field="email">
          <TextInput
            label={
              <>
                Student email{' '}
                <span className="ml-[6px] text-[12px] leading-[18px] font-normal text-[#595959]">
                  Optional
                </span>
              </>
            }
            type="email"
            placeholder="name@email.com"
            value={form.email}
            onChange={set('email')}
            error={errors.email}
          />
        </div>
        <div data-field="guardian">
          <TextInput
            label="Parent or guardian phone"
            type="tel"
            placeholder="Needed for students under 18"
            value={form.guardian}
            onChange={set('guardian')}
            error={errors.guardian}
          />
        </div>
        <div data-field="guardianEmail">
          <TextInput
            label={
              <>
                Parent or guardian email{' '}
                <span className="ml-[6px] text-[12px] leading-[18px] font-normal text-[#595959]">
                  Optional
                </span>
              </>
            }
            type="email"
            placeholder="For the consent request"
            value={form.guardianEmail}
            onChange={set('guardianEmail')}
            error={errors.guardianEmail}
          />
        </div>
        <div className="md:col-span-2">
          <Checkbox
            label="Send the student an invite to link their profile"
            checked={form.invite}
            onChange={(e) => setForm((f) => ({ ...f, invite: e.target.checked }))}
          />
        </div>
      </form>
      <p role="alert" className="m-0 font-sans text-[14px] leading-[20px] text-danger empty:hidden">
        {problem}
      </p>
      <InstitutionDialogActions
        cancelLabel="Cancel"
        onCancel={onClose}
        primaryDisabled={busy}
        primaryLabel={busy ? 'Adding…' : 'Add student'}
        primaryType="submit"
        form={formId}
      />
    </InstitutionDialogShell>
  );
};

export default InstitutionAddStudentDialog;
