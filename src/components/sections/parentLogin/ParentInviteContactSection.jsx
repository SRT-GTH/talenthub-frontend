import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import PhoneInput from '../../ui/form/PhoneInput.jsx';
import TextInput from '../../ui/form/TextInput.jsx';
import { ArrowRightIcon, MailIcon } from '../../shared/assets.jsx';
import { debug } from '../../../utils/debug.js';

const log = debug('ParentInviteContactSection');

/*
 * ParentInviteContactSection — Contact step of parent onboarding FLOW B
 * (ward-invited). Figma main frame 2864:37344 (left 2864:37349).
 * Route: /onboarding/parent-invited-contact.
 *
 * Phone (required, SMS verification) + WhatsApp (optional) + Email (required,
 * Email verification). Card layout + sticky Back / Send Verification Code
 * footer; simple step-list panel from the layout.
 */

const schema = z.object({
  phone: z.string().min(1, 'Phone number is required'),
  whatsapp: z.string().optional().or(z.literal('')),
  email: z.string().min(1, 'Email is required').email('Enter a valid email'),
});

// ── label row (label + required */optional + right-side hint) ───────────────
const LabelRow = ({ children, required, optional, trailing }) => (
  <div className="mb-[8px] flex items-center justify-between">
    <span
      className="flex items-center gap-[3px] font-sans font-bold"
      style={{ fontSize: 13, color: '#111' }}
    >
      {children}
      {required && <span style={{ color: '#c0392b' }}>*</span>}
      {optional && (
        <span className="font-normal" style={{ fontSize: 12, color: '#babab7' }}>
          (optional)
        </span>
      )}
    </span>
    {trailing && (
      <span className="font-sans" style={{ fontSize: 12, color: '#70706e' }}>
        {trailing}
      </span>
    )}
  </div>
);

const InfoMini = () => (
  <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
    <circle cx="5.5" cy="5.5" r="4.6" stroke="#babab7" strokeWidth="1" />
    <path d="M5.5 5v2.6" stroke="#babab7" strokeWidth="1.1" strokeLinecap="round" />
    <circle cx="5.5" cy="3.3" r="0.6" fill="#babab7" />
  </svg>
);

const ChevronLeft = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
    <path
      d="M8 3 4.5 6.5 8 10"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ParentInviteContactSection = () => {
  log('mount');
  const navigate = useNavigate();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: { phone: '', whatsapp: '', email: '' },
  });

  const onSubmit = async (data) => {
    log('submit — contact (flow B)', { hasWhatsapp: !!data.whatsapp });
    await new Promise((r) => setTimeout(r, 400));
    log('continue → parent-invited-security');
    navigate('/onboarding/parent-invited-security');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex min-h-full flex-1 flex-col">
      {/* ── Scrollable body ── */}
      <div className="flex-1 px-6 py-10 md:px-14">
        <div className="mx-auto flex w-full max-w-full flex-col gap-[20px]">
          {/* Header (centered) — Figma 2864:37350 / 37351 / 37352 */}
          <div className="flex flex-col items-center gap-[6px] text-center">
            <span
              className="font-sans font-bold uppercase"
              style={{ fontSize: 10, color: '#c8951a', letterSpacing: '1.3px' }}
            >
              Step 3 of 7 — Contact Information
            </span>
            <h1
              className="font-display font-normal"
              style={{
                fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
                letterSpacing: '-1px',
                color: '#111',
                lineHeight: 1.1,
              }}
            >
              How do we{' '}
              <span className="italic" style={{ color: '#c8951a' }}>
                reach you?
              </span>
            </h1>
            <p
              className="max-w-[440px] font-sans"
              style={{ fontSize: 14, color: '#70706e', lineHeight: '23px' }}
            >
              We&apos;ll send a quick code to confirm it&apos;s really you — keeping your account
              secure and your ward&apos;s profile protected.
            </p>
          </div>

          {/* Phone — Figma 2864:37353 */}
          <div className="flex flex-col">
            <LabelRow required trailing="SMS verification">
              Phone Number
            </LabelRow>
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <PhoneInput
                  placeholder="24 123 4567"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  error={errors.phone?.message}
                />
              )}
            />
          </div>

          {/* WhatsApp — Figma 2864:37365 */}
          <div className="flex flex-col">
            <LabelRow optional>WhatsApp</LabelRow>
            <Controller
              name="whatsapp"
              control={control}
              render={({ field }) => (
                <PhoneInput
                  placeholder="Leave blank if same as above"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                />
              )}
            />
            <span
              className="mt-[8px] flex items-center gap-[8px] font-sans"
              style={{ fontSize: 12, color: '#babab7' }}
            >
              <InfoMini />
              Leave blank if same as your phone number above
            </span>
          </div>

          {/* Email — Figma 2864:37380 */}
          <div className="flex flex-col">
            <LabelRow required trailing="Email verification">
              Email Address
            </LabelRow>
            <TextInput
              leftIcon={<MailIcon className="size-[15px]" />}
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register('email')}
            />
          </div>
        </div>
      </div>

      {/* ── Sticky footer — Figma 2864:37391 ── */}
      <div
        className="sticky bottom-0 bg-white px-6 py-[15px] md:px-14"
        style={{ borderTop: '1px solid rgba(0,0,0,0.07)' }}
      >
        <div className="mx-auto flex w-full max-w-full items-center gap-[10px]">
          <button
            type="button"
            onClick={() => {
              log('back clicked');
              navigate(-1);
            }}
            className="flex h-[48px] items-center gap-[8px] rounded-[10px] border px-[21px] font-sans font-semibold"
            style={{ borderColor: '#c6c6c3', color: '#111', fontSize: 14 }}
          >
            <ChevronLeft />
            Back
          </button>

          {isValid ? (
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex h-[48px] flex-1 items-center justify-center gap-[8px] rounded-[10px] border-2 text-white transition-transform active:translate-y-[2px]"
              style={{
                backgroundColor: '#c8951a',
                borderColor: '#967014',
                boxShadow: '0px 3px 0px #967014',
              }}
            >
              <span className="font-sans font-bold" style={{ fontSize: 15 }}>
                {isSubmitting ? 'Sending…' : 'Send Verification Code'}
              </span>
              <ArrowRightIcon />
            </button>
          ) : (
            <div
              className="flex h-[48px] flex-1 items-center justify-center gap-[8px] rounded-[10px] border-2"
              style={{ backgroundColor: '#e6e6e3', borderColor: '#d8d8d4', cursor: 'not-allowed' }}
              aria-disabled="true"
            >
              <span className="font-sans font-bold" style={{ fontSize: 15, color: '#a6a6a3' }}>
                Send Verification Code
              </span>
              <span style={{ color: '#a6a6a3' }}>
                <ArrowRightIcon />
              </span>
            </div>
          )}
        </div>
      </div>
    </form>
  );
};

export default ParentInviteContactSection;
