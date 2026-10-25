import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { debug } from '../../../../utils/debug.js';
import Button from '../../../ui/Button.jsx';
import TextInput from '../../../ui/form/TextInput.jsx';
import { SettingsACard, SettingsARow } from '../../talentSettings/SettingsAUi.jsx';
import { AGENCY_PROFILE, TOASTS } from './data/agencySettingsData.js';

const log = debug('AgencyProfileTab');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?[0-9 ()-]{7,}$/;

/*
 * AgencyProfileTab — Figma 11.6.1a "Settings · Agency profile" (8611:8): "Agency details" 2x3 fields, "Agency type" rows, Cancel / Save changes.
 * Edits are local state; Save validates (name required, valid email and phone) and calls onToast(saved); Cancel restores the saved values.
 * "MoU signed" is read-only (⚠️ ASSUMPTION: it comes from the MoU). "Change" opens MoU and access (⚠️ ASSUMPTION), "Upload seal" opens a
 * file picker and previews the chosen image (⚠️ ASSUMPTION: nothing is uploaded).
 */
const AgencyProfileTab = ({ onToast }) => {
  const [saved, setSaved] = useState(AGENCY_PROFILE);
  const [form, setForm] = useState(AGENCY_PROFILE);
  const [errors, setErrors] = useState({});
  const [seal, setSeal] = useState(null);
  const fileRef = useRef(null);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'Enter your agency name';
    if (!EMAIL_RE.test(form.email.trim())) next.email = 'Enter a valid email address';
    if (!PHONE_RE.test(form.phone.trim())) next.phone = 'Enter a valid phone number';
    return next;
  };

  const save = () => {
    const next = validate();
    setErrors(next);
    log('save', { errors: Object.keys(next) });
    if (Object.keys(next).length) {
      document.querySelector('[aria-invalid="true"]')?.focus();
      return;
    }
    setSaved(form);
    onToast(TOASTS.saved);
  };

  const cancel = () => {
    log('cancel');
    setForm(saved);
    setErrors({});
  };

  const pickSeal = (e) => {
    const file = e.target.files?.[0];
    log('seal', file?.name);
    if (file) setSeal(URL.createObjectURL(file));
  };

  return (
    <>
      <SettingsACard
        title="Agency details"
        desc="This is how your agency appears on programmes and in the public directory."
      >
        <div className="grid grid-cols-1 gap-x-[20px] gap-y-[16px] md:grid-cols-2">
          <TextInput
            label="Agency name"
            id="agency-name"
            value={form.name}
            onChange={set('name')}
            error={errors.name}
            aria-invalid={errors.name ? 'true' : undefined}
          />
          <TextInput
            label="Contact email"
            id="agency-email"
            type="email"
            value={form.email}
            onChange={set('email')}
            error={errors.email}
            aria-invalid={errors.email ? 'true' : undefined}
          />
          <TextInput
            label="Office phone"
            id="agency-phone"
            type="tel"
            value={form.phone}
            onChange={set('phone')}
            error={errors.phone}
            aria-invalid={errors.phone ? 'true' : undefined}
          />
          <TextInput label="MoU signed" id="agency-mou-signed" value={form.mouSigned} readOnly />
          <TextInput
            label="Head office region"
            id="agency-region"
            value={form.region}
            onChange={set('region')}
          />
          <TextInput label="Town" id="agency-town" value={form.town} onChange={set('town')} />
        </div>
      </SettingsACard>

      <SettingsACard title="Agency type">
        <SettingsARow first title={form.type} desc={form.typeNote}>
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

      <div className="flex flex-wrap items-center justify-end gap-[12px]">
        <Button variant="tertiary" size="lg" onClick={cancel}>
          Cancel
        </Button>
        <Button variant="primary" size="sm" onClick={save}>
          Save changes
        </Button>
      </div>
    </>
  );
};

export default AgencyProfileTab;
