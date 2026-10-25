import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { debug } from '../../../../utils/debug.js';
import Button from '../../../ui/Button.jsx';
import TextInput from '../../../ui/form/TextInput.jsx';
import { SettingsACard, SettingsARow } from '../../talentSettings/SettingsAUi.jsx';
import { INSTITUTION_PROFILE, TOASTS } from './data/institutionSettingsData.js';

const log = debug('InstitutionProfileTab');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?[0-9 ()-]{7,}$/;

/*
 * InstitutionProfileTab — Figma 11.6.1a "Settings · Institution profile" (8597:395887): "Institution details" 2x3 fields, "Institution type" rows,
 * Cancel / Save changes. Edits are local state; Save validates (name required, valid email and phone) and calls onToast(saved); Cancel restores the saved
 * values. "Accredited" ("09 / 1998", a leftover label of the talent form in Figma) is read-only (⚠️ ASSUMPTION: it comes from the GES accreditation).
 * "Change" opens the verification status (⚠️ ASSUMPTION: the page that explains accreditation), "Upload crest" opens a file picker and previews the chosen
 * image (⚠️ ASSUMPTION: nothing is uploaded). Props: onToast(toast).
 */
const InstitutionProfileTab = ({ onToast }) => {
  const [saved, setSaved] = useState(INSTITUTION_PROFILE);
  const [form, setForm] = useState(INSTITUTION_PROFILE);
  const [errors, setErrors] = useState({});
  const [crest, setCrest] = useState(null);
  const fileRef = useRef(null);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'Enter your institution name';
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

  const pickCrest = (e) => {
    const file = e.target.files?.[0];
    log('crest', file?.name);
    if (file) setCrest(URL.createObjectURL(file));
  };

  return (
    <>
      <SettingsACard
        title="Institution details"
        desc="This is how your institution appears to students and on credentials."
      >
        <div className="grid grid-cols-1 gap-x-[20px] gap-y-[16px] md:grid-cols-2">
          <TextInput
            label="Institution name"
            id="institution-name"
            value={form.name}
            onChange={set('name')}
            error={errors.name}
            aria-invalid={errors.name ? 'true' : undefined}
          />
          <TextInput
            label="Contact email"
            id="institution-email"
            type="email"
            value={form.email}
            onChange={set('email')}
            error={errors.email}
            aria-invalid={errors.email ? 'true' : undefined}
          />
          <TextInput
            label="Office phone"
            id="institution-phone"
            type="tel"
            value={form.phone}
            onChange={set('phone')}
            error={errors.phone}
            aria-invalid={errors.phone ? 'true' : undefined}
          />
          <TextInput
            label="Accredited"
            id="institution-accredited"
            value={form.accredited}
            readOnly
          />
          <TextInput
            label="Region"
            id="institution-region"
            value={form.region}
            onChange={set('region')}
          />
          <TextInput label="Town" id="institution-town" value={form.town} onChange={set('town')} />
        </div>
      </SettingsACard>

      <SettingsACard title="Institution type">
        <SettingsARow first title={form.type} desc={form.typeNote}>
          <Link
            to="/institution/accreditation/status"
            className="inline-flex min-h-[24px] shrink-0 items-center text-[14px] font-semibold text-[#387440] underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
          >
            Change
          </Link>
        </SettingsARow>
        <SettingsARow title="School crest" desc="Shown on every credential, programme and message.">
          {crest ? (
            <img src={crest} alt="" className="size-[40px] rounded-[8px] object-cover" />
          ) : null}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="sr-only"
            tabIndex={-1}
            aria-label="School crest file"
            onChange={pickCrest}
          />
          <Button
            variant="tertiary"
            size="lg"
            className="shrink-0"
            onClick={() => fileRef.current?.click()}
          >
            Upload crest
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

export default InstitutionProfileTab;
