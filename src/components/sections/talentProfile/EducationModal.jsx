import { useEffect, useId, useRef, useState } from 'react';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import { fetchMyProfile, saveProfileFields } from '../../../services/profileStages.api.js';
import ProfileFormModal, {
  FieldLabel,
  FOCUS_RING,
  INPUT_BASE,
  Switch,
} from './ProfileFormModal.jsx';
import {
  LEVEL_OPTIONS,
  applyEducationEdit,
  educationEntryFromForm,
  educationFormErrors,
  educationFormFromEntry,
  emptyEducationForm,
  entryKey,
} from './educationEdit.js';

const log = debug('EducationModal');

/*
 * Add / edit / remove a school (2026-11-01). Opened from the Experience tab with `?modal=education&item=<key|new>`.
 * Loads the saved list first and writes the whole list back (PATCH /profiles/fields { education }), so a failed load
 * never overwrites it. Signed-in only; the demo keeps its drawn modal.
 */
const EducationModal = ({ profile, onSaved }) => {
  const uid = useId();
  const schoolRef = useRef(null);
  const key = profile.item || 'new';
  const adding = key === 'new';
  const [status, setStatus] = useState(adding ? 'ready' : 'loading');
  const [original, setOriginal] = useState(null);
  const [form, setForm] = useState(emptyEducationForm);
  const [touched, setTouched] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [confirmRemove, setConfirmRemove] = useState(false);

  useEffect(() => {
    if (adding) return undefined;
    let alive = true;
    fetchMyProfile()
      .then((p) => {
        if (!alive) return;
        const list = Array.isArray(p?.education) ? p.education : [];
        const found = list.find((e, i) => entryKey(e, i) === key);
        if (!found) {
          setStatus('missing');
          return;
        }
        setOriginal(found);
        setForm(educationFormFromEntry(found));
        setStatus('ready');
      })
      .catch((err) => {
        log.error('load failed', err?.response?.status || err?.message);
        if (alive) setStatus('failed');
      });
    return () => {
      alive = false;
    };
  }, [adding, key]);

  const close = () => profile.update({ modal: null, item: null });
  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));
  const errors = educationFormErrors(form);
  const show = (k) => (touched ? errors[k] : '');

  const save = async (remove = false) => {
    setTouched(true);
    if (!remove && Object.keys(errors).length) {
      // Focus the first field that needs fixing.
      const first = ['institution', 'startYear', 'endYear'].find((k) => errors[k]);
      document.getElementById(`${uid}-${first}`)?.focus();
      return;
    }
    setSaving(true);
    setError('');
    try {
      const saved = await fetchMyProfile();
      const list = Array.isArray(saved?.education) ? saved.education : [];
      const current = adding ? null : list.find((e, i) => entryKey(e, i) === key) || original;
      const next = applyEducationEdit(
        list,
        key,
        remove ? null : educationEntryFromForm(form, current || {})
      );
      if (!next) throw new Error('entry no longer on the profile');
      await saveProfileFields({ education: next });
      log(remove ? 'removed' : adding ? 'added' : 'updated', { count: next.length });
      onSaved?.();
      close();
    } catch (err) {
      log.error('save failed', err?.response?.status || err?.message);
      setSaving(false);
      setError('That wasn’t saved. Check your connection and try again.');
    }
  };

  const loadingNote =
    status === 'loading'
      ? 'Loading this school…'
      : status === 'missing'
        ? 'We couldn’t find this school on your profile any more. Close this and try again.'
        : status === 'failed'
          ? 'We couldn’t load your profile. Check your connection and try again.'
          : '';

  const input = (k, props = {}) => (
    <input
      id={`${uid}-${k}`}
      type="text"
      value={form[k]}
      aria-invalid={show(k) ? true : undefined}
      aria-describedby={show(k) ? `${uid}-${k}-err` : undefined}
      onChange={(e) => set(k)(e.target.value)}
      className={INPUT_BASE}
      {...props}
    />
  );
  const err = (k) =>
    show(k) ? (
      <p id={`${uid}-${k}-err`} className="text-[13px] leading-[normal] font-medium text-[#c0392b]">
        {show(k)}
      </p>
    ) : null;

  return (
    <ProfileFormModal
      title={adding ? 'Add education' : 'Edit education'}
      subtitle="School, college, university or training. Recruiters see this on your profile."
      onClose={close}
      onSubmit={() => (status === 'ready' ? save(false) : undefined)}
      initialFocus={() => schoolRef.current}
      error={error}
      saving={saving}
      submitLabel={adding ? 'Add to profile' : 'Save changes'}
      footerNote={
        adding ? 'Nothing is saved until you hit Add' : 'Nothing is saved until you hit Save'
      }
      extraAction={
        !adding && status === 'ready' ? (
          <button
            type="button"
            onClick={() => (confirmRemove ? save(true) : setConfirmRemove(true))}
            disabled={saving}
            className={classNames(
              'cursor-pointer border-0 bg-transparent px-[6px] py-[6px] text-[13px] leading-[normal] font-semibold text-[#c0392b]',
              FOCUS_RING
            )}
          >
            {confirmRemove ? 'Tap again to remove' : 'Remove'}
          </button>
        ) : null
      }
    >
      {loadingNote ? (
        <p role="status" className="text-[14px] leading-[1.5] text-[#595959]">
          {loadingNote}
        </p>
      ) : (
        <>
          <div className="flex flex-col gap-[8px]">
            <FieldLabel htmlFor={`${uid}-institution`} required>
              School, college or university
            </FieldLabel>
            {input('institution', {
              ref: schoolRef,
              placeholder: 'e.g. KNUST, Prempeh College, Accra Technical University',
              'aria-required': 'true',
            })}
            {err('institution')}
          </div>

          <div className="grid grid-cols-1 gap-[14px] sm:grid-cols-2">
            <div className="flex flex-col gap-[8px]">
              <FieldLabel htmlFor={`${uid}-level`} hint="Optional">
                Level
              </FieldLabel>
              <select
                id={`${uid}-level`}
                value={form.level}
                onChange={(e) => set('level')(e.target.value)}
                className={classNames(INPUT_BASE, 'cursor-pointer appearance-auto')}
              >
                <option value="">Choose a level</option>
                {LEVEL_OPTIONS.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-[8px]">
              <FieldLabel htmlFor={`${uid}-qualification`} hint="Optional">
                Qualification
              </FieldLabel>
              {input('qualification', { placeholder: 'e.g. BSc, HND, Diploma, WASSCE' })}
            </div>
          </div>

          <div className="flex flex-col gap-[8px]">
            <FieldLabel htmlFor={`${uid}-fieldOfStudy`} hint="Optional">
              Programme or field of study
            </FieldLabel>
            {input('fieldOfStudy', { placeholder: 'e.g. Computer Science, General Science' })}
          </div>

          <div className="flex items-center gap-[10px]">
            <Switch
              on={form.isCurrent}
              onToggle={() => set('isCurrent')(!form.isCurrent)}
              labelledBy={`${uid}-now`}
            />
            <span
              id={`${uid}-now`}
              className="text-[14px] leading-[normal] font-medium text-[#1c2a21]"
            >
              I’m still studying here
            </span>
          </div>

          <div className="grid grid-cols-2 gap-[14px]">
            <div className="flex flex-col gap-[8px]">
              <FieldLabel htmlFor={`${uid}-startYear`} hint="Optional">
                Start year
              </FieldLabel>
              {input('startYear', { inputMode: 'numeric', placeholder: '2021', maxLength: 4 })}
              {err('startYear')}
            </div>
            <div className="flex flex-col gap-[8px]">
              <FieldLabel htmlFor={`${uid}-endYear`} hint="Optional">
                {form.isCurrent ? 'Expected end year' : 'End year'}
              </FieldLabel>
              {input('endYear', { inputMode: 'numeric', placeholder: '2025', maxLength: 4 })}
              {err('endYear')}
            </div>
          </div>

          <div className="flex flex-col gap-[8px]">
            <FieldLabel htmlFor={`${uid}-result`} hint="Optional">
              {form.isCurrent ? 'Result so far' : 'Result'}
            </FieldLabel>
            {input('result', { placeholder: 'e.g. Second Class Upper, CGPA 3.6, Aggregate 9' })}
          </div>
        </>
      )}
    </ProfileFormModal>
  );
};

export default EducationModal;
