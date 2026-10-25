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
 * Validation (rosterValidation.js): required fields, Ghana Card format, a real past date, a guardian phone under 18; the first invalid field gets focus. Submit → MOCK POST
 * /institution/students → the roster store; the dialog closes with a status line (and, for an under-18, an "Ask for consent" action that opens the consent dialog).
 * ⚠️ ASSUMPTION: error copy is mine; the invite checkbox starts unticked as drawn; a student added here is "Not linked" until they link their own GTH profile.
 * Props: onClose, onUpload (switch to the CSV dialog), onConsent (open the consent dialog).
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
  invite: false,
};

const InstitutionAddStudentDialog = ({ onClose, onUpload, onConsent }) => {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const formId = useId();
  const set = (key) => (event) => setForm((f) => ({ ...f, [key]: event.target.value }));

  const submit = (event) => {
    event.preventDefault();
    const { errors: next, under18 } = validateStudent(form);
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
    const student = rosterActions.addStudent({ ...form, under18 });
    log('added (mock)', student.id);
    rosterActions.toast({
      message: `${student.name} was added to your roster.`,
      action: under18 ? { label: 'Ask for consent', onClick: onConsent } : undefined,
    });
    onClose();
  };

  return (
    <InstitutionDialogShell label="Add a student" onClose={onClose}>
      <InstitutionDialogHeader
        chip="Add a student"
        title={['One student. ', 'We check their Ghana Card.']}
        text="We check the Ghana Card against NIA before the student joins your roster. Students under 18 need a parent or guardian phone."
      />
      <InstitutionUploadBar
        title="Have a class list? Upload a CSV instead"
        hint="Up to 10,000 rows per file · we check every Ghana Card"
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
            label="Ghana Card number"
            required
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
            options={PROGRAMMES}
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
        <div className="md:col-span-2">
          <Checkbox
            label="Send the student an invite to link their profile"
            checked={form.invite}
            onChange={(e) => setForm((f) => ({ ...f, invite: e.target.checked }))}
          />
        </div>
      </form>
      <InstitutionDialogActions
        cancelLabel="Cancel"
        onCancel={onClose}
        primaryLabel="Add student"
        primaryType="submit"
        form={formId}
      />
    </InstitutionDialogShell>
  );
};

export default InstitutionAddStudentDialog;
