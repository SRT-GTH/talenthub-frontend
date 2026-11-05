import { useEffect, useId, useRef, useState } from 'react';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import { fetchMyProfile, saveProfileFields } from '../../../services/profileStages.api.js';
import ProfileFormModal, {
  ChoiceChip,
  FieldLabel,
  FOCUS_RING,
  INPUT_BASE,
} from './ProfileFormModal.jsx';
import {
  JOB_TYPES,
  LANGUAGE_LEVELS,
  LOCATION_SUGGESTIONS,
  START_OPTIONS,
  workStyleFields,
  workStyleForm,
  workStyleProblem,
} from './workStyle.js';

const log = debug('WorkStyleModal');

/*
 * Edit work style (2026-11-01): Looking for, Where, Start and Languages (the About tab card's rows). Opened with
 * `?modal=workstyle`; the card's pencil and its "Add ..." prompts open it. Saves one PATCH /profiles/fields.
 */
const WorkStyleModal = ({ profile, onSaved }) => {
  const uid = useId();
  const firstRef = useRef(null);
  const [status, setStatus] = useState('loading');
  const [form, setForm] = useState(() => workStyleForm({}));
  const [place, setPlace] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;
    fetchMyProfile()
      .then((p) => {
        if (!alive) return;
        setForm(workStyleForm(p || {}));
        setStatus('ready');
      })
      .catch((err) => {
        log.error('load failed', err?.response?.status || err?.message);
        if (alive) setStatus('failed');
      });
    return () => {
      alive = false;
    };
  }, []);

  const close = () => profile.update({ modal: null, item: null });
  const patch = (p) => setForm((f) => ({ ...f, ...p }));
  const toggleType = (t) =>
    patch({
      types: form.types.includes(t) ? form.types.filter((x) => x !== t) : [...form.types, t],
    });
  const addPlace = (name) => {
    const v = String(name || '').trim();
    if (!v || form.places.some((x) => x.toLowerCase() === v.toLowerCase())) return;
    patch({ places: [...form.places, v] });
  };
  const setLang = (i, p) =>
    patch({ languages: form.languages.map((l, n) => (n === i ? { ...l, ...p } : l)) });

  const save = async () => {
    const problem = workStyleProblem(form);
    if (problem) {
      setError(problem);
      return;
    }
    setSaving(true);
    setError('');
    try {
      const fields = workStyleFields(form);
      await saveProfileFields(fields);
      log('saved', {
        types: fields.preferredJobTypes.length,
        places: fields.preferredJobLocations.length,
        start: fields.availableToStart?.status || null,
        languages: fields.languages.length,
      });
      onSaved?.();
      close();
    } catch (err) {
      log.error('save failed', err?.response?.status || err?.message);
      setSaving(false);
      setError('That wasn’t saved. Check your connection and try again.');
    }
  };

  const suggestions = LOCATION_SUGGESTIONS.filter(
    (s) => !form.places.some((x) => x.toLowerCase() === s.toLowerCase())
  );

  return (
    <ProfileFormModal
      title="Work style"
      subtitle="What you’re looking for, where and when. Recruiters and your matches use this."
      onClose={close}
      onSubmit={() => (status === 'ready' ? save() : undefined)}
      initialFocus={() => firstRef.current?.querySelector('button')}
      error={error}
      saving={saving}
      submitLabel="Save"
    >
      {status !== 'ready' ? (
        <p role="status" className="text-[14px] leading-[1.5] text-[#595959]">
          {status === 'loading'
            ? 'Loading…'
            : 'We couldn’t load your profile. Check your connection and try again.'}
        </p>
      ) : (
        <>
          <fieldset className="flex flex-col gap-[8px]">
            <legend className="mb-[8px] text-[14px] leading-[24px] font-medium text-[#1c2a21]">
              Looking for
            </legend>
            <div ref={firstRef} className="flex flex-wrap gap-[8px]">
              {JOB_TYPES.map((t) => (
                <ChoiceChip key={t} on={form.types.includes(t)} onClick={() => toggleType(t)}>
                  {t}
                </ChoiceChip>
              ))}
            </div>
          </fieldset>

          <div className="flex flex-col gap-[8px]">
            <FieldLabel htmlFor={`${uid}-place`}>Where</FieldLabel>
            {form.places.length ? (
              <ul className="flex flex-wrap gap-[8px]" aria-label="Places you picked">
                {form.places.map((p) => (
                  <li key={p}>
                    <button
                      type="button"
                      aria-label={`${p}, remove`}
                      onClick={() => patch({ places: form.places.filter((x) => x !== p) })}
                      className={classNames(
                        'inline-flex h-[32px] cursor-pointer items-center gap-[6px] rounded-full border border-[#c1d4c4] bg-[#ebf1ec] px-[14px] text-[13px] font-semibold text-[#387440]',
                        FOCUS_RING
                      )}
                    >
                      {p}
                      <span aria-hidden="true">×</span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
            <input
              id={`${uid}-place`}
              type="text"
              value={place}
              placeholder="Type a town or region and press Enter"
              onChange={(e) => setPlace(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addPlace(place);
                  setPlace('');
                }
              }}
              onBlur={() => {
                if (place.trim()) {
                  addPlace(place);
                  setPlace('');
                }
              }}
              className={INPUT_BASE}
            />
            {suggestions.length ? (
              <div className="flex flex-wrap gap-[8px]">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => addPlace(s)}
                    className={classNames(
                      'cursor-pointer rounded-full border border-dashed border-[#bfbfbf] bg-transparent px-[12px] py-[6px] text-[12px] leading-[normal] font-semibold text-[#2d5d33]',
                      FOCUS_RING
                    )}
                  >
                    + {s}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <fieldset className="flex flex-col gap-[8px]">
            <legend className="mb-[8px] text-[14px] leading-[24px] font-medium text-[#1c2a21]">
              When can you start?
            </legend>
            <div
              role="radiogroup"
              aria-label="When can you start?"
              className="flex flex-wrap gap-[8px]"
            >
              {START_OPTIONS.map((o) => (
                <ChoiceChip
                  key={o.id}
                  role="radio"
                  on={form.start === o.id}
                  onClick={() => patch({ start: form.start === o.id ? '' : o.id })}
                >
                  {o.label}
                </ChoiceChip>
              ))}
            </div>
            {form.start === 'from_date' ? (
              <div className="flex flex-col gap-[8px] pt-[4px]">
                <FieldLabel htmlFor={`${uid}-from`}>From</FieldLabel>
                <input
                  id={`${uid}-from`}
                  type="month"
                  value={form.from}
                  onChange={(e) => patch({ from: e.target.value })}
                  className={classNames(INPUT_BASE, 'max-w-[240px]')}
                />
              </div>
            ) : null}
          </fieldset>

          <fieldset className="flex flex-col gap-[10px]">
            <legend className="mb-[8px] text-[14px] leading-[24px] font-medium text-[#1c2a21]">
              Languages
            </legend>
            {form.languages.map((l, i) => (
              <div key={i} className="flex flex-wrap items-center gap-[8px]">
                <input
                  type="text"
                  aria-label={`Language ${i + 1}`}
                  value={l.name}
                  placeholder="e.g. Twi"
                  onChange={(e) => setLang(i, { name: e.target.value })}
                  className={classNames(INPUT_BASE, '!w-auto min-w-[120px] flex-1 basis-[160px]')}
                />
                <select
                  aria-label={`How well you speak ${l.name || `language ${i + 1}`}`}
                  value={l.level}
                  onChange={(e) => setLang(i, { level: e.target.value })}
                  className={classNames(
                    INPUT_BASE,
                    '!w-[178px] shrink-0 cursor-pointer appearance-auto'
                  )}
                >
                  <option value="">How well?</option>
                  {LANGUAGE_LEVELS.map((x) => (
                    <option key={x.id} value={x.id}>
                      {x.word[0].toUpperCase() + x.word.slice(1)}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  aria-label={`Remove ${l.name || `language ${i + 1}`}`}
                  onClick={() => patch({ languages: form.languages.filter((_, n) => n !== i) })}
                  className={classNames(
                    'cursor-pointer rounded-[10px] border border-[#e6e6e6] bg-transparent px-[12px] py-[8px] text-[13px] font-semibold text-[#595959]',
                    FOCUS_RING
                  )}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                patch({ languages: [...form.languages, { name: '', level: '', source: null }] })
              }
              className={classNames(
                'self-start cursor-pointer rounded-full border border-dashed border-[#bfbfbf] bg-transparent px-[12px] py-[6px] text-[12px] leading-[normal] font-semibold text-[#2d5d33]',
                FOCUS_RING
              )}
            >
              + Add a language
            </button>
          </fieldset>
        </>
      )}
    </ProfileFormModal>
  );
};

export default WorkStyleModal;
