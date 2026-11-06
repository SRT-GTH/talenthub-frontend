import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { debug } from '../../../../utils/debug.js';
import Button from '../../../ui/Button.jsx';
import { Select } from '../../../ui/form';
import TextInput from '../../../ui/form/TextInput.jsx';
import { SettingsACard, SettingsARow } from '../../talentSettings/SettingsAUi.jsx';
import {
  apiMessage,
  institutionSettings,
  institutionUpdateProfile,
  uploadInstitutionCrest,
} from '../../../../services/institutionPortal.api.js';
import { REGIONS } from '../onboarding/signUpValidation.js';
import { useInstitutionSession } from '../useInstitutionSession.js';
import { TOASTS } from './data/institutionSettingsData.js';

const log = debug('InstitutionProfileTab');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?[0-9 ()-]{7,}$/;
const FIELDS = ['name', 'email', 'phone', 'region', 'town'];
const day = (iso) =>
  iso
    ? new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(
        new Date(iso)
      )
    : '';

/*
 * InstitutionProfileTab — Figma 11.6.1a "Settings · Institution profile" (8597:395887): "Institution details" 2x3 fields, "Institution type" rows, Cancel / Save.
 * Live: GET /institution/settings fills the form; Save sends the changed fields (PATCH /institution/settings/profile, admins only). Changing the name of a
 * verified institution sends it back to review (the backend reopens it and the note says so). "Accredited" shows the accreditation state. The crest uploads
 * at once (media upload, then PATCH crestUrl). Other staff see the form read-only.
 * Props: onToast(toast).
 */
const InstitutionProfileTab = ({ onToast }) => {
  const session = useInstitutionSession();
  const [loaded, setLoaded] = useState(null);
  const [form, setForm] = useState(null);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [crestBusy, setCrestBusy] = useState(false);
  const fileRef = useRef(null);

  const fromResponse = (r) => {
    const p = r.profile || {};
    return {
      name: p.name || '',
      email: p.email || '',
      phone: p.phone || '',
      region: p.region || '',
      town: p.town || '',
    };
  };

  const load = useCallback(async () => {
    setLoadError('');
    try {
      const r = await institutionSettings();
      setLoaded(r);
      setForm(fromResponse(r));
    } catch (err) {
      setLoadError(apiMessage(err));
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loadError) {
    return (
      <SettingsACard title="Institution details">
        <p role="alert" className="m-0 text-[14px] text-[#902b20]">
          Could not load your institution: {loadError}{' '}
          <button type="button" className="cursor-pointer font-semibold underline" onClick={load}>
            Try again
          </button>
        </p>
      </SettingsACard>
    );
  }
  if (!form) {
    return (
      <SettingsACard title="Institution details">
        <p className="m-0 text-[14px] text-[#595959]">Loading…</p>
      </SettingsACard>
    );
  }

  const canEdit = Boolean(loaded?.canEdit);
  const profile = loaded?.profile || {};
  const verify = session.verify;
  const saved = fromResponse(loaded);
  const dirty = FIELDS.filter((k) => form[k] !== saved[k]);
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e?.target ? e.target.value : e }));

  const validate = () => {
    const next = {};
    if (form.name.trim().length < 3) next.name = 'Enter your institution name';
    if (form.email.trim() && !EMAIL_RE.test(form.email.trim()))
      next.email = 'Enter a valid email address';
    if (form.phone.trim() && !PHONE_RE.test(form.phone.trim()))
      next.phone = 'Enter a valid phone number';
    return next;
  };

  const save = async () => {
    const next = validate();
    setErrors(next);
    log('save', { errors: Object.keys(next), dirty });
    if (Object.keys(next).length) {
      requestAnimationFrame(() => document.querySelector('[aria-invalid="true"]')?.focus());
      return;
    }
    if (!dirty.length) {
      onToast({ title: 'Nothing to save' });
      return;
    }
    const patch = Object.fromEntries(dirty.map((k) => [k, form[k].trim()]));
    const reopens = patch.name !== undefined && verify.approved;
    setBusy(true);
    try {
      const r = await institutionUpdateProfile(patch);
      setLoaded(r);
      setForm(fromResponse(r));
      session.reload?.();
      onToast(
        reopens
          ? { title: 'Saved', body: 'The name changed, so GTH checks your accreditation again.' }
          : TOASTS.saved
      );
    } catch (err) {
      onToast({ ...TOASTS.failed, body: apiMessage(err) });
    } finally {
      setBusy(false);
    }
  };

  const cancel = () => {
    log('cancel');
    setForm(saved);
    setErrors({});
  };

  const pickCrest = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!/^image\//.test(file.type) || file.size > 2 * 1024 * 1024) {
      onToast({ ...TOASTS.failed, body: 'Use a PNG or JPG image under 2 MB.' });
      return;
    }
    setCrestBusy(true);
    try {
      const crestUrl = await uploadInstitutionCrest(file);
      const r = await institutionUpdateProfile({ crestUrl });
      setLoaded(r);
      session.reload?.();
      onToast({ title: 'Crest updated' });
    } catch (err) {
      onToast({ ...TOASTS.failed, body: apiMessage(err) });
    } finally {
      setCrestBusy(false);
    }
  };

  const accredited = verify.approved
    ? `Verified${verify.decided ? ` ${day(verify.decided)}` : ''}${verify.renewalDue ? ` · renew by ${day(verify.renewalDue)}` : ''}`
    : verify.label;

  return (
    <>
      <SettingsACard
        title="Institution details"
        desc={
          canEdit
            ? 'This is how your institution appears to students and on credentials.'
            : 'Only your school’s admins can change these details.'
        }
      >
        <div className="grid grid-cols-1 gap-x-[20px] gap-y-[16px] md:grid-cols-2">
          <TextInput
            label="Institution name"
            id="institution-name"
            value={form.name}
            onChange={set('name')}
            readOnly={!canEdit}
            error={errors.name}
            aria-invalid={errors.name ? 'true' : undefined}
          />
          <TextInput
            label="Contact email"
            id="institution-email"
            type="email"
            value={form.email}
            onChange={set('email')}
            readOnly={!canEdit}
            error={errors.email}
            aria-invalid={errors.email ? 'true' : undefined}
          />
          <TextInput
            label="Office phone"
            id="institution-phone"
            type="tel"
            value={form.phone}
            onChange={set('phone')}
            readOnly={!canEdit}
            error={errors.phone}
            aria-invalid={errors.phone ? 'true' : undefined}
          />
          <TextInput label="Accredited" id="institution-accredited" value={accredited} readOnly />
          {canEdit ? (
            <Select label="Region" options={REGIONS} value={form.region} onChange={set('region')} />
          ) : (
            <TextInput label="Region" id="institution-region" value={form.region} readOnly />
          )}
          <TextInput
            label="Town"
            id="institution-town"
            value={form.town}
            onChange={set('town')}
            readOnly={!canEdit}
          />
        </div>
      </SettingsACard>

      <SettingsACard title="Institution type">
        <SettingsARow
          first
          title={profile.type || 'Not set'}
          desc={
            verify.approved
              ? `Verified${verify.decided ? ` ${day(verify.decided)}` : ''}. Changing type sends you back through accreditation.`
              : 'Checked as part of your accreditation.'
          }
        >
          <Link
            to="/institution/accreditation/status"
            className="inline-flex min-h-[24px] shrink-0 items-center text-[14px] font-semibold text-[#387440] underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
          >
            Accreditation
          </Link>
        </SettingsARow>
        <SettingsARow title="School crest" desc="Shown on every credential, programme and message.">
          {profile.crestUrl ? (
            <img
              src={profile.crestUrl}
              alt="Current crest"
              className="size-[40px] rounded-[8px] object-cover"
            />
          ) : null}
          {canEdit ? (
            <>
              <input
                ref={fileRef}
                type="file"
                accept="image/png,image/jpeg"
                className="sr-only"
                tabIndex={-1}
                aria-label="School crest file"
                onChange={pickCrest}
              />
              <Button
                variant="tertiary"
                size="lg"
                className="shrink-0"
                disabled={crestBusy}
                onClick={() => fileRef.current?.click()}
              >
                {crestBusy ? 'Uploading…' : profile.crestUrl ? 'Change crest' : 'Upload crest'}
              </Button>
            </>
          ) : null}
        </SettingsARow>
      </SettingsACard>

      {canEdit ? (
        <div className="flex flex-wrap items-center justify-end gap-[12px]">
          <Button variant="tertiary" size="lg" onClick={cancel} disabled={busy || !dirty.length}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={save} disabled={busy}>
            {busy ? 'Saving…' : 'Save changes'}
          </Button>
        </div>
      ) : null}
    </>
  );
};

export default InstitutionProfileTab;
