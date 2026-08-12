import { useEffect, useId, useRef, useState } from 'react';
import Modal from '../../ui/Modal.jsx';
import Button from '../../ui/Button.jsx';
import TextInput from '../../ui/form/TextInput.jsx';
import Select from '../../ui/form/Select.jsx';
import Field from '../../ui/form/Field.jsx';
import { debug } from '../../../utils/debug.js';
import {
  ArrowRightIcon,
  ArrowheadDownIcon,
  ChatLinkArrowIcon,
  EyeIcon,
  EyeOffIcon,
  LockIcon,
} from '../../shared/assets.jsx';
import { MONTH_OPTIONS } from './jobPostFormData.js';
import {
  WARD_COUNTRY_CODE_OPTIONS,
  WARD_GENDER_OPTIONS,
  WARD_GHANA_CARD_MAX_BYTES,
  WARD_SETUP_DETAILS,
  WARD_SETUP_PASSWORD,
  WARD_SETUP_PLACEHOLDERS,
  emptyWardSetupForm,
  isWardDetailsComplete,
  isWardPasswordComplete,
} from './wardAccountSetupData.js';

const log = debug('WardAccountSetupModal');

const AutosaveInfoIcon = ({ className = '' }) => (
  <svg viewBox="0 0 14 14" fill="none" aria-hidden="true" className={className}>
    <circle cx="7" cy="7" r="5.25" stroke="currentColor" strokeWidth="1.2" />
    <path d="M7 6.2V9.5M7 4.6v.9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

const CloudUploadIcon = ({ className = '' }) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
    <path
      d="M7.5 17.5h9.2c2.1 0 3.8-1.6 3.8-3.6 0-1.8-1.3-3.3-3.1-3.6.1-.3.1-.6.1-.9 0-2.6-2.1-4.7-4.7-4.7-1.9 0-3.5 1.1-4.2 2.7-.4-.2-.8-.3-1.3-.3-1.7 0-3.1 1.4-3.1 3.1 0 .3 0 .6.1.8C2.9 11.3 2 12.5 2 14c0 1.9 1.6 3.5 3.5 3.5H7.5"
      stroke="#595959"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 16.5v-6M12 10.5 9.8 12.7M12 10.5l2.2 2.2"
      stroke="#595959"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/*
 * Compact Ghana Card drop zone — Figma 5132:80465 / 80471
 * (horizontal icon + copy, dashed #bfbfbf on #f8f8f8, h≈120).
 */
const GhanaCardZone = ({ title, filename, error, onFileSelect }) => {
  const inputId = useId();
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  const pick = () => inputRef.current?.click();

  const takeFile = (fileList) => {
    const file = fileList?.[0];
    if (!file) return;
    if (file.size > WARD_GHANA_CARD_MAX_BYTES) {
      log.error('ghana card too large', { name: file.name, size: file.size });
      onFileSelect?.(null, 'Maximum file size: 5MB');
      return;
    }
    log('ghana card selected:', file.name);
    onFileSelect?.(file, null);
  };

  return (
    <button
      type="button"
      onClick={pick}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        takeFile(e.dataTransfer?.files);
      }}
      className={[
        'flex h-[120px] w-full items-center justify-center gap-[10px] rounded-[10px]',
        'border border-dashed px-[16px] py-[20px] text-left transition-colors',
        error
          ? 'border-danger bg-white'
          : dragOver
            ? 'border-brand-green bg-brand-green-light'
            : filename
              ? 'border-solid border-brand-green bg-brand-green-light'
              : 'border-[#bfbfbf] bg-[#f8f8f8]',
      ].join(' ')}
      aria-describedby={error ? `${inputId}-err` : undefined}
    >
      <CloudUploadIcon className="size-6 shrink-0" />
      <span className="flex min-w-0 flex-col gap-[2px]">
        <span className="font-sans text-[14px] leading-[1.35] text-[#575755]">
          {filename ? filename : title}
        </span>
        <span className="font-sans text-[12px] leading-normal text-[#959592]">
          {filename ? 'File ready' : 'Maximum file size: 5MB'}
        </span>
        {error ? (
          <span id={`${inputId}-err`} className="font-sans text-[12px] text-danger">
            {error}
          </span>
        ) : null}
      </span>
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept="image/*,.pdf"
        className="sr-only"
        onChange={(e) => {
          takeFile(e.target.files);
          e.target.value = '';
        }}
      />
    </button>
  );
};

/*
 * WardAccountSetupModal — Figma 5132:80134 (details) → 5132:80489 (password).
 * `step` is controlled by CareerBuddySection so DemoNavigator can seed either.
 */
const WardAccountSetupModal = ({
  open,
  step = 'details',
  onStepChange,
  onClose,
  onLater,
  onCreate,
  resetKey = 0,
}) => {
  const [form, setForm] = useState(emptyWardSetupForm);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [frontError, setFrontError] = useState(null);
  const [backError, setBackError] = useState(null);
  const [triedNext, setTriedNext] = useState(false);
  const [triedCreate, setTriedCreate] = useState(false);

  useEffect(() => {
    if (!open) return;
    log('mount', { open: true, step });
  }, [open, step]);

  useEffect(() => {
    setForm(emptyWardSetupForm());
    setShowPassword(false);
    setShowConfirm(false);
    setFrontError(null);
    setBackError(null);
    setTriedNext(false);
    setTriedCreate(false);
    log('branch', { formReset: true, resetKey });
  }, [resetKey]);

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const detailsOk = isWardDetailsComplete(form);
  const passwordOk = isWardPasswordComplete(form);

  const detailsHeader = (
    <header className="flex flex-col gap-[10px] px-[clamp(20px,3vw,36px)] pb-[8px] pt-[clamp(24px,3vw,36px)] pr-[56px]">
      <h2
        className="font-display leading-[normal] text-[#111]"
        style={{ fontSize: 'clamp(1.75rem, 2.8vw, 2.5rem)' }}
      >
        {WARD_SETUP_DETAILS.titleBefore}
        <span className="italic text-brand-green">{WARD_SETUP_DETAILS.titleAccent}</span>
        {WARD_SETUP_DETAILS.titleAfter}
      </h2>
      <p className="max-w-[600px] font-sans text-[14px] leading-normal text-[#575755]">
        {WARD_SETUP_DETAILS.subtitle}
      </p>
    </header>
  );

  const detailsFooter = (
    <div className="flex items-center justify-between gap-[16px] border-t border-[#f0ece4] bg-[#fefdfa] px-[clamp(20px,3vw,34px)] py-[16px]">
      <span className="inline-flex items-center gap-[8px] font-sans text-[12px] text-[#70706e]">
        <AutosaveInfoIcon className="size-[14px] text-brand-green" />
        {WARD_SETUP_DETAILS.autosave}
      </span>
      <Button
        type="button"
        variant="primary"
        size="sm"
        rightIcon={<ArrowRightIcon />}
        onClick={() => {
          setTriedNext(true);
          if (!detailsOk) {
            log('branch', { nextBlocked: true });
            return;
          }
          log('branch', { nextToPassword: true });
          onStepChange?.('password');
        }}
      >
        {WARD_SETUP_DETAILS.nextCta}
      </Button>
    </div>
  );

  if (step === 'password') {
    return (
      <Modal
        isOpen={open}
        onClose={onClose}
        size="md"
        ariaLabel="Set a password for your ward's account"
        showClose
        className="!bg-[rgba(17,17,17,0.7)] !backdrop-blur-none"
        contentClassName="!max-w-[528px] !rounded-[24px] !overflow-hidden"
      >
        <div className="flex flex-col items-center gap-[36px] px-[clamp(24px,4vw,48px)] py-[clamp(32px,5vw,48px)]">
          <div className="flex w-full flex-col items-center gap-[10px] text-center">
            <h2 className="font-display text-[28px] font-normal leading-normal text-[#111]">
              {WARD_SETUP_PASSWORD.titleBefore}
              <span className="italic text-brand-green">{WARD_SETUP_PASSWORD.titleAccent}</span>
              {WARD_SETUP_PASSWORD.titleAfter}
            </h2>
            <p className="max-w-[432px] font-sans text-[16px] leading-[1.5] text-[#575755]">
              {WARD_SETUP_PASSWORD.subtitle}
            </p>
          </div>

          <div className="flex w-full flex-col gap-[14px]">
            <TextInput
              label="Password"
              required
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={(e) => setField('password', e.target.value)}
              placeholder={WARD_SETUP_PASSWORD.passwordPlaceholder}
              leftIcon={<LockIcon />}
              rightIconInteractive
              rightIcon={
                <button
                  type="button"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword((v) => !v)}
                  className="text-content-secondary hover:text-[#111]"
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              }
              error={
                triedCreate && form.password.length < 8 ? 'Use at least 8 characters' : undefined
              }
            />
            <TextInput
              label="Confirm Password"
              required
              type={showConfirm ? 'text' : 'password'}
              value={form.confirmPassword}
              onChange={(e) => setField('confirmPassword', e.target.value)}
              placeholder={WARD_SETUP_PASSWORD.confirmPlaceholder}
              leftIcon={<LockIcon />}
              rightIconInteractive
              rightIcon={
                <button
                  type="button"
                  aria-label={showConfirm ? 'Hide password' : 'Show password'}
                  onClick={() => setShowConfirm((v) => !v)}
                  className="text-content-secondary hover:text-[#111]"
                >
                  {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              }
              error={
                triedCreate && form.confirmPassword && form.password !== form.confirmPassword
                  ? 'Passwords do not match'
                  : undefined
              }
            />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-[8px]">
            <Button
              type="button"
              variant="primary"
              size="sm"
              rightIcon={<ArrowRightIcon />}
              onClick={() => {
                setTriedCreate(true);
                if (!passwordOk) {
                  log('branch', { createBlocked: true });
                  return;
                }
                log('branch', { createWard: true });
                onCreate?.(form);
              }}
            >
              {WARD_SETUP_PASSWORD.createCta}
            </Button>
            <Button
              type="button"
              variant="tertiary"
              size="sm"
              rightIcon={<ChatLinkArrowIcon className="size-[16px]" />}
              onClick={() => {
                log('branch', { doLater: true });
                onLater?.();
              }}
              className="!rounded-[14px] !gap-[6px]"
            >
              {WARD_SETUP_PASSWORD.laterCta}
            </Button>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      size="xl"
      ariaLabel="Let's set up your ward's account"
      showClose
      header={detailsHeader}
      footer={detailsFooter}
      className="!bg-[rgba(17,17,17,0.7)] !backdrop-blur-none"
      contentClassName="!max-w-[850px] !h-[min(90vh,820px)] !rounded-[24px]"
    >
      <div className="flex flex-col gap-[15px] px-[clamp(20px,3vw,36px)] pb-[16px] pt-[clamp(8px,1vw,16px)]">
        <div className="grid grid-cols-1 gap-[14px] md:grid-cols-2">
          <TextInput
            label="First Name"
            required
            value={form.firstName}
            onChange={(e) => setField('firstName', e.target.value)}
            error={triedNext && !form.firstName.trim() ? 'Required' : undefined}
          />
          <TextInput
            label="Last Name"
            required
            value={form.lastName}
            onChange={(e) => setField('lastName', e.target.value)}
            error={triedNext && !form.lastName.trim() ? 'Required' : undefined}
          />
        </div>

        <div className="grid grid-cols-1 gap-[14px] md:grid-cols-2">
          <TextInput
            label="Other Name(s)"
            optional
            optionalClassName="text-brand-green"
            value={form.otherNames}
            onChange={(e) => setField('otherNames', e.target.value)}
            placeholder={WARD_SETUP_PLACEHOLDERS.otherNames}
          />
          <Field label="Date of Birth" required>
            <div className="flex items-center gap-[6px]">
              <TextInput
                size="sm"
                className="!max-w-[90px] !flex-1"
                value={form.dobDay}
                onChange={(e) => setField('dobDay', e.target.value)}
                placeholder="DD"
                aria-label="Day of birth"
              />
              <Select
                size="sm"
                className="!min-w-0 !flex-1"
                value={form.dobMonth}
                onChange={(val) => setField('dobMonth', val)}
                options={MONTH_OPTIONS}
                placeholder="Month"
                chevronIcon={<ArrowheadDownIcon className="text-brand-green" />}
              />
              <TextInput
                size="sm"
                className="!max-w-[90px] !flex-1"
                value={form.dobYear}
                onChange={(e) => setField('dobYear', e.target.value)}
                placeholder="YYYY"
                aria-label="Year of birth"
              />
            </div>
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-[14px] md:grid-cols-2">
          <TextInput
            label="Email Address"
            required
            type="email"
            value={form.email}
            onChange={(e) => setField('email', e.target.value)}
            error={triedNext && !form.email.trim() ? 'Required' : undefined}
          />
          <Field
            label="Phone"
            required
            error={triedNext && !form.phone.trim() ? 'Required' : undefined}
          >
            <div className="flex items-center gap-[6px]">
              <Select
                size="sm"
                className="!w-[120px] shrink-0"
                value={form.countryCode}
                onChange={(val) => setField('countryCode', val)}
                options={WARD_COUNTRY_CODE_OPTIONS}
                chevronIcon={<ArrowheadDownIcon className="text-brand-green" />}
              />
              <TextInput
                size="sm"
                className="!min-w-0 !flex-1"
                value={form.phone}
                onChange={(e) => setField('phone', e.target.value)}
                placeholder={WARD_SETUP_PLACEHOLDERS.phone}
                aria-label="Ward phone number"
              />
            </div>
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-[14px] md:grid-cols-2">
          <TextInput
            label="Address"
            required
            value={form.address}
            onChange={(e) => setField('address', e.target.value)}
            placeholder={WARD_SETUP_PLACEHOLDERS.address}
            error={triedNext && !form.address.trim() ? 'Required' : undefined}
          />
          <Select
            label="Gender"
            required
            value={form.gender}
            onChange={(val) => setField('gender', val)}
            options={WARD_GENDER_OPTIONS}
            placeholder={WARD_SETUP_PLACEHOLDERS.gender}
            chevronIcon={<ArrowheadDownIcon className="text-brand-green" />}
            error={triedNext && !form.gender ? 'Required' : undefined}
          />
        </div>

        <Field
          label="Ghana Card Upload"
          required
          error={
            triedNext && (!form.ghanaFrontName || !form.ghanaBackName)
              ? 'Upload front and back of Ghana Card'
              : undefined
          }
        >
          <div className="grid grid-cols-1 gap-[15px] sm:grid-cols-2">
            <GhanaCardZone
              title="Upload front of Ghana Card"
              filename={form.ghanaFrontName}
              error={frontError}
              onFileSelect={(file, err) => {
                setFrontError(err);
                setField('ghanaFrontName', file?.name ?? '');
              }}
            />
            <GhanaCardZone
              title="Upload back of Ghana Card"
              filename={form.ghanaBackName}
              error={backError}
              onFileSelect={(file, err) => {
                setBackError(err);
                setField('ghanaBackName', file?.name ?? '');
              }}
            />
          </div>
        </Field>
      </div>
    </Modal>
  );
};

export default WardAccountSetupModal;
