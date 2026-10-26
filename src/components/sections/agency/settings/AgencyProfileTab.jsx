import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { agencySettings, agencyUpdateProfile } from '../../../../services/agency.api.js';
import { debug } from '../../../../utils/debug.js';
import Button from '../../../ui/Button.jsx';
import TextInput from '../../../ui/form/TextInput.jsx';
import { SettingsACard, SettingsARow } from '../../talentSettings/SettingsAUi.jsx';
import { useAgencyResource } from '../useAgencyResource.js';
import { TOASTS } from './data/agencySettingsData.js';

const log = debug('AgencyProfileTab');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?[0-9 ()-]{7,}$/;
const fmtMonth = (d) =>
  d
    ? new Date(d)
        .toLocaleDateString('en-GB', { month: '2-digit', year: 'numeric' })
        .replace('/', ' / ')
    : '—';

/*
 * AgencyProfileTab — Figma 11.6.1a "Settings · Agency profile" (8611:8): "Agency details" 2x3 fields, "Agency type" rows, Cancel / Save changes.
 * Live: GET /agency/settings → profile; Save → PATCH /agency/settings/profile (contact email, office phone, region, town; agency admins only —
 * analysts see the fields read-only). The agency name and type are set with GTH under the MoU, so they are read-only here ("Change" opens
 * MoU and access). "Upload seal" previews the chosen image on this page only (seal upload is not stored yet).
 */
const AgencyProfileTab = ({ onToast }) => {
  const res = useAgencyResource(agencySettings, []);
  const s = res.data;
  const [form, setForm] = useState(null);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [seal, setSeal] = useState(null);
  const fileRef = useRef(null);
  const admin = s?.role === 'admin';

  useEffect(() => {
    if (s) setForm({ ...s.profile });
  }, [s]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const validate = () => {
    const next = {};
    if (!EMAIL_RE.test((form.email || '').trim())) next.email = 'Enter a valid email address';
    if (!PHONE_RE.test((form.phone || '').trim())) next.phone = 'Enter a valid phone number';
    return next;
  };

  const save = async () => {
    const next = validate();
    setErrors(next);
    log('save', { errors: Object.keys(next) });
    if (Object.keys(next).length) {
      document.querySelector('[aria-invalid="true"]')?.focus();
      return;
    }
    setBusy(true);
    try {
      await agencyUpdateProfile({
        email: form.email.trim(),
        phone: form.phone.trim(),
        region: (form.region || '').trim(),
        town: (form.town || '').trim(),
      });
      res.reload();
      onToast(TOASTS.saved);
    } catch (err) {
      onToast({ title: 'Not saved', body: err?.response?.data?.message || err?.message });
    } finally {
      setBusy(false);
    }
  };

  const cancel = () => {
    log('cancel');
    setForm({ ...s.profile });
    setErrors({});
  };

  const pickSeal = (e) => {
    const file = e.target.files?.[0];
    log('seal', file?.name);
    if (file) setSeal(URL.createObjectURL(file));
  };

  if (!form) {
    return (
      <p role="status" className="m-0 p-[16px] font-sans text-[15px] text-[#737373]">
        {res.error ? 'We couldn’t load your agency details.' : 'Loading your agency details…'}
      </p>
    );
  }

  return (
    <>
      <SettingsACard
        title="Agency details"
        desc={
          admin
            ? 'This is how your agency appears on programmes and in the public directory.'
            : 'Only your agency admin can change these details.'
        }
      >
        <div className="grid grid-cols-1 gap-x-[20px] gap-y-[16px] md:grid-cols-2">
          <TextInput label="Agency name" id="agency-name" value={form.name} readOnly />
          <TextInput
            label="Contact email"
            id="agency-email"
            type="email"
            value={form.email}
            onChange={set('email')}
            readOnly={!admin}
            error={errors.email}
            aria-invalid={errors.email ? 'true' : undefined}
          />
          <TextInput
            label="Office phone"
            id="agency-phone"
            type="tel"
            value={form.phone}
            onChange={set('phone')}
            readOnly={!admin}
            error={errors.phone}
            aria-invalid={errors.phone ? 'true' : undefined}
          />
          <TextInput
            label="MoU signed"
            id="agency-mou-signed"
            value={fmtMonth(form.mouSigned)}
            readOnly
          />
          <TextInput
            label="Head office region"
            id="agency-region"
            value={form.region}
            onChange={set('region')}
            readOnly={!admin}
          />
          <TextInput
            label="Town"
            id="agency-town"
            value={form.town}
            onChange={set('town')}
            readOnly={!admin}
          />
        </div>
      </SettingsACard>

      <SettingsACard title="Agency type">
        <SettingsARow
          first
          title={form.type}
          desc="Your agency name and type are set in your MoU. Changing them sends you back through MoU review."
        >
          <Link
            to="/agency/settings/mou"
            className="shrink-0 text-[14px] font-semibold text-[#387440] underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
          >
            Change
          </Link>
        </SettingsARow>
        <SettingsARow title="Agency seal" desc="Shown on every programme and briefing pack.">
          {seal ? (
            <img src={seal} alt="" className="size-[40px] rounded-[8px] object-cover" />
          ) : null}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="sr-only"
            tabIndex={-1}
            aria-label="Agency seal file"
            onChange={pickSeal}
          />
          <Button
            variant="tertiary"
            size="lg"
            className="shrink-0"
            onClick={() => fileRef.current?.click()}
          >
            Upload seal
          </Button>
        </SettingsARow>
      </SettingsACard>

      {admin ? (
        <div className="flex flex-wrap items-center justify-end gap-[12px]">
          <Button variant="tertiary" size="lg" onClick={cancel} disabled={busy}>
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

export default AgencyProfileTab;
