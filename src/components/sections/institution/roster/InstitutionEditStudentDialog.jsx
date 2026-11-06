import { useId, useState } from 'react';
import { debug } from '../../../../utils/debug.js';
import Select from '../../../ui/form/Select.jsx';
import TextInput from '../../../ui/form/TextInput.jsx';
import InstitutionDialogActions from './InstitutionDialogActions.jsx';
import InstitutionDialogHeader from './InstitutionDialogHeader.jsx';
import InstitutionDialogShell from './InstitutionDialogShell.jsx';
import { PROGRAMMES } from './data/rosterData.js';
import { rosterActions } from './rosterStore.js';

const log = debug('InstitutionEditStudentDialog');

/*
 * InstitutionEditStudentDialog — "Edit record" of the student record (?modal=edit&student=<id>; no frame is drawn, it reuses the add-student dialog pieces).
 * The school's own details of the student: year group, programme, index number and the guardian's name / phone / email. The student's GTH profile is theirs
 * and is not edited here. Save → PATCH /api/institution/students/:id; the record and the roster reload.
 * Props: student (roster row), detail (GET /students/:id), onClose, onSaved(detail).
 */

const YEARS = [
  { value: '1', label: 'Form 1' },
  { value: '2', label: 'Form 2' },
  { value: '3', label: 'Form 3' },
  { value: 'graduates', label: 'Graduate' },
];

const InstitutionEditStudentDialog = ({ student, detail, onClose, onSaved }) => {
  const formId = useId();
  const [form, setForm] = useState({
    form: student.form || '1',
    programme: student.programme || '',
    indexNumber: detail?.indexNumber || '',
    guardianName: detail?.guardian?.name || '',
    guardianPhone: '',
    guardianEmail: '',
  });
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState('');
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e?.target ? e.target.value : e }));
  const options = [...new Set([...PROGRAMMES, ...(student.programme ? [student.programme] : [])])];

  const save = async (e) => {
    e.preventDefault();
    if (busy) return;
    const patch = {
      form: form.form,
      programme: form.programme,
      indexNumber: form.indexNumber.trim(),
      guardianName: form.guardianName.trim(),
    };
    // the phone and email are shown masked: only send them when a new one is typed
    if (form.guardianPhone.trim()) patch.guardianPhone = form.guardianPhone.trim();
    if (form.guardianEmail.trim()) patch.guardianEmail = form.guardianEmail.trim();
    setBusy(true);
    const out = await rosterActions.updateStudent(student.id, patch);
    setBusy(false);
    if (!out.ok) {
      setProblem(out.message);
      return;
    }
    log('saved', student.id);
    rosterActions.toast(`${student.name}’s record was updated.`);
    onSaved?.(out.detail);
    onClose();
  };

  return (
    <InstitutionDialogShell label={`Edit ${student.name}’s record`} onClose={onClose} size="medium">
      <InstitutionDialogHeader
        chip="Edit record"
        title={[`${student.name}. `, 'Your school’s details.']}
        text="The student’s GTH profile is theirs. Here you change what your school keeps: class, programme, index number and guardian."
      />
      <form
        id={formId}
        noValidate
        onSubmit={save}
        className="grid grid-cols-1 gap-x-[16px] gap-y-[20px] md:grid-cols-2"
      >
        <Select
          label="Year group"
          options={YEARS.map((y) => y.label)}
          value={YEARS.find((y) => y.value === form.form)?.label}
          onChange={(v) =>
            setForm((f) => ({
              ...f,
              form: (YEARS.find((y) => y.label === (v?.target ? v.target.value : v)) || YEARS[0])
                .value,
            }))
          }
        />
        <Select
          label="Programme"
          options={options}
          value={form.programme}
          onChange={set('programme')}
        />
        <TextInput label="Index number" value={form.indexNumber} onChange={set('indexNumber')} />
        <TextInput
          label="Guardian’s name"
          value={form.guardianName}
          onChange={set('guardianName')}
        />
        <TextInput
          label="New guardian phone"
          type="tel"
          placeholder={
            detail?.guardian?.phone ? `On file: ${detail.guardian.phone}` : 'None on file'
          }
          value={form.guardianPhone}
          onChange={set('guardianPhone')}
        />
        <TextInput
          label="New guardian email"
          type="email"
          placeholder={
            detail?.guardian?.email ? `On file: ${detail.guardian.email}` : 'None on file'
          }
          value={form.guardianEmail}
          onChange={set('guardianEmail')}
        />
      </form>
      <p role="alert" className="m-0 font-sans text-[14px] leading-[20px] text-danger empty:hidden">
        {problem}
      </p>
      <InstitutionDialogActions
        cancelLabel="Cancel"
        onCancel={onClose}
        primaryLabel={busy ? 'Saving…' : 'Save changes'}
        primaryType="submit"
        primaryDisabled={busy}
        form={formId}
      />
    </InstitutionDialogShell>
  );
};

export default InstitutionEditStudentDialog;
