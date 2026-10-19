import { useEffect, useId, useRef, useState } from 'react';
import Button from '../../ui/Button.jsx';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import { SettingsAAlertSmallIcon } from '../../shared/assets.jsx';
import {
  ACCOUNT_ACTIONS,
  ACCOUNT_EMAIL_ERROR_HINT,
  ACCOUNT_EMAIL_ERROR_VALUE,
  ACCOUNT_FIELDS,
  ACCOUNT_INTRO,
  ACCOUNT_TYPE,
} from './talentSettingsAData.js';
import { SettingsACard, SettingsALink, SettingsARow } from './SettingsAUi.jsx';

const log = debug('SettingsAccount');

const EMAIL_OK = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const baseValues = () => Object.fromEntries(ACCOUNT_FIELDS.map((f) => [f.id, f.value]));

// One labelled input (Figma "Input · …": label 14/500, 51px box, r10, soft shadow).
const SettingsAField = ({ field, value, onChange, error, hint }) => {
  const id = useId();
  const hintId = `${id}-hint`;
  return (
    <div className="flex min-w-0 flex-col gap-[8px]">
      <label
        htmlFor={id}
        className="flex h-[21px] items-center text-[14px] leading-[24px] font-medium tracking-[0.2px] text-[#1c2a21]"
      >
        {field.label}
      </label>
      <div
        className={classNames(
          'flex h-[51px] items-center rounded-[10px] bg-white py-[13px] pr-[16px] pl-[20px] focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[#387440]',
          'shadow-[0_1px_2px_rgba(28,42,33,0.04),0_2px_11px_rgba(28,42,33,0.03)] playful:shadow-[0_1px_2px_rgba(28,42,33,0.04),0_4px_16px_rgba(28,42,33,0.06)]',
          error
            ? 'border-[1.5px] border-[#ebc2bd]'
            : field.verified
              ? 'border-[1.5px] border-[#c1d4c4]'
              : 'border border-[#ccc]'
        )}
      >
        <input
          id={id}
          type={field.type}
          value={value}
          autoComplete={field.autoComplete}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={hint ? hintId : undefined}
          onChange={(e) => onChange(e.target.value)}
          className={classNames(
            'w-full min-w-0 bg-transparent text-[14px] tracking-[0.2px] outline-none',
            error
              ? 'leading-[20px] font-normal text-[#c0392b]'
              : 'leading-[24px] font-medium text-[#1c2a21]'
          )}
        />
      </div>
      {hint ? (
        <p id={hintId} className="flex items-center gap-[8px]">
          <SettingsAAlertSmallIcon className="block size-[16px] shrink-0" />
          <span className="text-[12px] leading-[18px] tracking-[0.2px] text-[#575755]">{hint}</span>
        </p>
      ) : null}
    </div>
  );
};

/*
 * SettingsAccount — ST-01 Account / ST-01b Email error (`?state=email-error`).
 * Editing the email to an invalid value flips the URL state to `email-error`; a valid value clears it.
 */
const SettingsAccount = ({ settings }) => {
  const errorState = settings?.state === 'email-error';
  const [saved, setSaved] = useState(baseValues);
  const [values, setValues] = useState(() =>
    errorState ? { ...baseValues(), email: ACCOUNT_EMAIL_ERROR_VALUE } : baseValues()
  );
  const seen = useRef(errorState);

  useEffect(() => {
    log('mount', { state: settings?.state });
  }, [settings?.state]);

  // External URL change into the error frame (e.g. a deep link): show the Figma value.
  useEffect(() => {
    if (errorState && !seen.current && EMAIL_OK.test(values.email)) {
      log('state -> email-error, seeding the frame value');
      setValues((v) => ({ ...v, email: ACCOUNT_EMAIL_ERROR_VALUE }));
    }
    seen.current = errorState;
  }, [errorState, values.email]);

  const setField = (id, value) => {
    setValues((v) => ({ ...v, [id]: value }));
    if (id === 'email') {
      const invalid = !EMAIL_OK.test(value);
      log('email edited', { invalid });
      if (invalid && !errorState) settings?.update?.({ state: 'email-error' });
      if (!invalid && errorState) settings?.update?.({ state: null });
    }
  };

  const cancel = () => {
    log('cancel -> reset to saved values');
    setValues(saved);
    if (errorState) settings?.update?.({ state: null });
  };
  const save = () => {
    if (!EMAIL_OK.test(values.email)) {
      log('save blocked: invalid email');
      return;
    }
    log('save', Object.keys(values));
    setSaved(values);
  };

  const emailInvalid = !EMAIL_OK.test(values.email);

  return (
    <>
      <SettingsACard title={ACCOUNT_INTRO.title} desc={ACCOUNT_INTRO.desc} gap="gap-[4px]">
        <div className="grid grid-cols-2 gap-x-[20px] gap-y-[16px] max-md:grid-cols-1">
          {ACCOUNT_FIELDS.map((field) => {
            const isEmail = field.id === 'email';
            const showError = isEmail && (errorState || emailInvalid);
            return (
              <SettingsAField
                key={field.id}
                field={field}
                value={values[field.id]}
                onChange={(value) => setField(field.id, value)}
                error={showError}
                hint={showError ? ACCOUNT_EMAIL_ERROR_HINT : undefined}
              />
            );
          })}
        </div>
      </SettingsACard>

      <SettingsACard title={ACCOUNT_TYPE.title}>
        {ACCOUNT_TYPE.rows.map((row, i) => (
          <SettingsARow
            key={row.id}
            title={row.title}
            desc={row.desc}
            first={i === 0 ? false : true}
          >
            {row.link ? (
              <SettingsALink onClick={() => log('change account type')}>{row.link}</SettingsALink>
            ) : null}
            {row.button ? (
              <Button
                variant="tertiary"
                size="lg"
                className="shrink-0"
                onClick={() => log('change avatar')}
              >
                {row.button}
              </Button>
            ) : null}
          </SettingsARow>
        ))}
      </SettingsACard>

      <div className="flex items-center justify-end gap-[12px]">
        <Button variant="tertiary" size="lg" onClick={cancel}>
          {ACCOUNT_ACTIONS.cancel}
        </Button>
        <Button variant="primary" size="sm" onClick={save}>
          {ACCOUNT_ACTIONS.save}
        </Button>
      </div>
    </>
  );
};

export default SettingsAccount;
