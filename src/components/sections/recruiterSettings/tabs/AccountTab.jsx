import { useEffect, useState } from 'react';
import { debug } from '../../../../utils/debug.js';
import TextInput from '../../../ui/form/TextInput.jsx';
import {
  RecruiterSettingsCard,
  RecruiterSettingsLink,
  RecruiterSettingsRow,
} from '../../../ui/RecruiterSettingsCard.jsx';
import { SettingsAAlertSmallIcon } from '../../../shared/assets.jsx';
import { EyeGlyph } from '../../recruiterJobs/jobIcons.jsx';
import profilePhoto from '../../../../assets/recruiter/settings/account-profile-photo-joel-adade-kofie.png';
import ImageUploadRow, { PickImageButton } from '../account/ImageUploadRow.jsx';
import SettingsFormFooter from '../account/SettingsFormFooter.jsx';
import {
  ACCOUNT_CARD,
  ACCOUNT_EMAIL_ERROR_HINT,
  ACCOUNT_EMAIL_ERROR_VALUE,
  ACCOUNT_FIELDS,
  ACCOUNT_PHOTO,
  ACCOUNT_TYPE,
  ACCOUNT_VALUES,
  ORG_DOMAIN,
} from '../account/accountData.js';

const log = debug('AccountTab');

const EMAIL_OK = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
// ⚠️ ASSUMPTION: "work email" = a well-formed address at the organisation's domain (SR-20 draws joel.kofie@gmail.com as the error).
const isWorkEmail = (value) =>
  EMAIL_OK.test(value.trim()) && value.trim().toLowerCase().endsWith(`@${ORG_DOMAIN}`);

const DIALOG_BUTTON = '!h-[48px] !py-0 max-sm:w-full';

/*
 * AccountTab - `/recruiter/settings` (?tab=account). SR-01 (10161:77483) and SR-20 "work email error" (10161:83955, `?state=email-error`).
 * The talent Account tab's job, recruiter copy: Personal details (+ photo), Account type (+ public profile link), Cancel / Save changes.
 * Figma draws the photo block in two places: inside "Personal details" with an "Upload new logo" button (SR-01) and as a "Profile photo / Change photo" row in "Account type" (SR-20).
 * The layout is picked once, from the URL the page was opened with, so typing a bad email never moves the photo around.
 * Save is enabled while something changed and the form is valid; the mock "saves" locally. Wiki: recruiter-settings-account.md.
 */
const AccountTab = ({ settings }) => {
  const errorFrame = settings?.state === 'email-error';
  const [photoInCard] = useState(!errorFrame);
  const [saved, setSaved] = useState(ACCOUNT_VALUES);
  const [values, setValues] = useState(() =>
    errorFrame ? { ...ACCOUNT_VALUES, email: ACCOUNT_EMAIL_ERROR_VALUE } : ACCOUNT_VALUES
  );
  const [photo, setPhoto] = useState(profilePhoto);
  const [justSaved, setJustSaved] = useState(false);

  useEffect(() => {
    log('mount', { layout: photoInCard ? 'SR-01' : 'SR-20', state: settings?.state });
  }, [photoInCard, settings?.state]);

  // A deep link / client navigation into the error frame seeds the value Figma draws.
  useEffect(() => {
    if (errorFrame && isWorkEmail(values.email)) {
      log('state -> email-error, seeding the frame value');
      setValues((v) => ({ ...v, email: ACCOUNT_EMAIL_ERROR_VALUE }));
    }
    // seed only when the URL flips to the error frame
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errorFrame]);

  const emailInvalid = !isWorkEmail(values.email);
  const dirty = ACCOUNT_FIELDS.some((f) => values[f.id] !== saved[f.id]) || photo !== profilePhoto;
  const requiredOk = Boolean(values.fullName.trim() && values.jobTitle.trim());
  const canSave = dirty && requiredOk && !emailInvalid;

  const setField = (id, value) => {
    setJustSaved(false);
    setValues((v) => ({ ...v, [id]: value }));
    if (id === 'email') {
      const invalid = !isWorkEmail(value);
      log('email edited', { invalid });
      if (invalid && !errorFrame) settings?.update?.({ state: 'email-error' }, { replace: true });
      if (!invalid && errorFrame) settings?.update?.({ state: null }, { replace: true });
    }
  };

  const cancel = () => {
    log('cancel: back to the saved values');
    setValues(saved);
    setPhoto(profilePhoto);
    setJustSaved(false);
    if (errorFrame) settings?.update?.({ state: null }, { replace: true });
  };
  const save = () => {
    if (!canSave) {
      log('save blocked', { requiredOk, emailInvalid });
      return;
    }
    log('save', Object.keys(values));
    setSaved(values);
    setJustSaved(true);
  };

  const field = (def) => {
    const isEmail = def.id === 'email';
    const showError = isEmail && emailInvalid;
    return (
      <TextInput
        key={def.id}
        label={def.label}
        required={def.required}
        type={def.type}
        autoComplete={def.autoComplete}
        value={values[def.id]}
        onChange={(event) => setField(def.id, event.target.value)}
        state={showError ? 'error' : undefined}
        aria-invalid={showError ? 'true' : undefined}
        helperText={showError ? ACCOUNT_EMAIL_ERROR_HINT : undefined}
        helperIcon={
          showError ? <SettingsAAlertSmallIcon className="block size-[16px]" /> : undefined
        }
        helperIconClassName="-ml-[8px]"
        inputClassName={showError ? '!font-normal !text-[#c0392b]' : undefined}
      />
    );
  };

  return (
    <>
      <RecruiterSettingsCard title={ACCOUNT_CARD.title} description={ACCOUNT_CARD.description}>
        <div className="flex flex-col gap-[10px]">
          {photoInCard ? (
            <ImageUploadRow
              src={photo}
              alt="Your profile photo"
              title={ACCOUNT_PHOTO.title}
              description={ACCOUNT_PHOTO.description}
              buttonLabel={ACCOUNT_PHOTO.button}
              imageClassName="shadow-[0_4px_4px_rgba(213,213,213,0.17)]"
              onChange={setPhoto}
            />
          ) : null}
          <div className="grid grid-cols-2 gap-[16px] max-md:grid-cols-1">
            {ACCOUNT_FIELDS.map(field)}
          </div>
        </div>
      </RecruiterSettingsCard>

      <RecruiterSettingsCard title={ACCOUNT_TYPE.title}>
        <RecruiterSettingsRow
          title={ACCOUNT_TYPE.recruiterTitle}
          description={ACCOUNT_TYPE.recruiterDescription}
        >
          {/* ⚠️ ASSUMPTION: "Change" (account type) is not specified; it opens the Organisation tab, where the recruiter's organisation lives. */}
          <RecruiterSettingsLink onClick={() => settings?.update?.({ tab: 'organisation' })}>
            {ACCOUNT_TYPE.change}
          </RecruiterSettingsLink>
        </RecruiterSettingsRow>
        {!photoInCard ? <PhotoRow onChange={setPhoto} /> : null}
        <RecruiterSettingsRow title={ACCOUNT_TYPE.publicTitle} description={ACCOUNT_TYPE.publicUrl}>
          {/* ⚠️ ASSUMPTION: "Preview as talent" opens the recruiter's own profile page as a talent sees it (/recruiter/profile is not built yet, so it stays on a log). */}
          <RecruiterSettingsLink
            icon={<EyeGlyph size={16} />}
            onClick={() => log('preview as talent')}
          >
            {ACCOUNT_TYPE.preview}
          </RecruiterSettingsLink>
        </RecruiterSettingsRow>
      </RecruiterSettingsCard>

      <SettingsFormFooter canSave={canSave} onCancel={cancel} onSave={save} saved={justSaved} />
    </>
  );
};

// SR-20: "Profile photo" row of "Account type" with the outlined "Change photo" button (a hidden file input behind it).
const PhotoRow = ({ onChange }) => (
  <RecruiterSettingsRow
    title={ACCOUNT_PHOTO.rowTitle}
    description={ACCOUNT_PHOTO.description}
    className="max-sm:flex-wrap"
  >
    <PickImageButton label={ACCOUNT_PHOTO.rowButton} onPick={onChange} className={DIALOG_BUTTON} />
  </RecruiterSettingsRow>
);

export default AccountTab;
