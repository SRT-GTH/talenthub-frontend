import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../ui/Button.jsx';
import Captions from '../../ui/Captions.jsx';
import PreviewField from '../../ui/PreviewField.jsx';
import Toast from '../../ui/Toast.jsx';
import WavyDivider from '../../shared/WavyDivider.jsx';
import { ArrowRightIcon, MailIcon } from '../../shared/assets.jsx';
import { debug } from '../../../utils/debug.js';
// Placeholder ward avatar — swap for the real per-ward photo when the parent
// onboarding store is wired. Reuses an existing onboarding portrait so the
// build stays green; intended final path: src/assets/parent/ward-avatar.png
import wardAvatar from '../../../assets/hero/parent-welcome-panel-photo.png';

const log = debug('ParentLinkWardSection');

/*
 * ParentLinkWardSection — Step 5 of 8 in the parent sign-up wizard.
 * Figma main frame: 2939:48804. Left content column only.
 * Breadcrumb, background glows, and gold right panel are provided by
 * ParentOnboardingLayout.
 *
 * The ward was auto-linked because the child supplied this parent's contact
 * details during their own registration ("Path A"). A success Toast announces
 * the auto-link on mount; the parent reviews the ward summary and confirms.
 *
 * On confirm → navigate to /onboarding/parent-review (Step 6).
 * Route: /onboarding/parent-link-ward
 *
 * NOTE: Figma renders the CTA in its grey disabled state (#bfbfbf). Since this
 * screen has nothing to gate on (the link is already established), the CTA is
 * implemented as the standard enabled green primary Button — consistent with
 * every other parent step and required for the demo flow to advance.
 */

// ── Main component ──────────────────────────────────────────────────────────

const ParentLinkWardSection = () => {
  log('mount');

  const navigate = useNavigate();
  // Auto-link success Toast — shown on mount, dismissible. Figma 2943:52577.
  const [showToast, setShowToast] = useState(true);

  const handleConfirm = () => {
    log('confirm clicked — navigating to parent-review');
    navigate('/onboarding/parent-review');
  };

  return (
    <>
      <div className="flex flex-1 items-start justify-center overflow-y-auto px-6 py-12 md:py-20">
        <div className="flex w-full max-w-[702px] flex-col items-center gap-6">
          {/* Step badge — Figma 2939:49709 — shared Captions (amber parent theme) */}
          <Captions
            variant="amber"
            items={[{ index: '05', label: 'Link Ward' }]}
            currentIndex={0}
          />

          {/* Headline — Figma 2939:49718 */}
          {/* "Your ward is " regular black + italic amber "linked" */}
          <h1
            className="max-w-[554px] text-center font-display font-normal"
            style={{
              fontSize: 'clamp(2rem, 4.4vw, 4rem)',
              lineHeight: 1.094,
              letterSpacing: '-0.64px',
              color: '#111',
            }}
          >
            Your ward is{' '}
            <span className="italic" style={{ color: '#c8951a' }}>
              linked
            </span>
          </h1>

          {/* Subtitle — Figma 2939:49720 */}
          <p
            className="max-w-[482px] text-center font-sans"
            style={{
              fontSize: 'clamp(0.875rem, 1.2vw, 1rem)',
              lineHeight: 1.5,
              letterSpacing: '0.2px',
              color: '#737373',
            }}
          >
            Because your ward provided your contact details during their registration, the link was
            created automatically. Please confirm the details below.
          </p>

          {/* WavyDivider — Figma 2939:49721 */}
          <WavyDivider />

          {/* ── Ward summary card group — Figma 2939:49722 ── */}
          <div className="flex w-full flex-col gap-[8px]">
            {/* Ward header — Figma 2941:52472 */}
            <div
              className="flex w-full items-center justify-between rounded-[16px] border bg-white px-[21px]"
              style={{ height: 76, borderColor: '#c1d4c4' }}
            >
              {/* Avatar + identity — Figma 2947:68504 */}
              <div className="flex items-center gap-[16px]">
                <span
                  className="block shrink-0 overflow-hidden rounded-full border-2"
                  style={{
                    width: 50,
                    height: 50,
                    borderColor: '#c1d4c4',
                    boxShadow:
                      '0px 2px 2px -1px rgba(27,36,44,0.04), 0px 2px 8px -1px rgba(27,36,44,0.08)',
                  }}
                >
                  <img
                    src={wardAvatar}
                    alt="Ward"
                    className="h-full w-full object-cover"
                    draggable={false}
                  />
                </span>
                <div className="flex flex-col gap-[4px]">
                  {/* Name — Figma 2947:68508 */}
                  <p
                    className="font-sans font-semibold"
                    style={{
                      fontSize: 16,
                      color: '#575755',
                      letterSpacing: '0.2px',
                      lineHeight: '24px',
                    }}
                  >
                    Abena Mensah
                  </p>
                  {/* Meta tag — Figma 2947:68509 */}
                  <span
                    className="inline-flex w-fit items-center justify-center rounded-[4px] border px-[10px] py-[3px]"
                    style={{ backgroundColor: '#ebf1ec', borderColor: '#c1d4c4' }}
                  >
                    <span
                      className="font-sans font-semibold"
                      style={{
                        fontSize: 10,
                        color: '#2a5730',
                        letterSpacing: '0.2px',
                        lineHeight: '16px',
                      }}
                    >
                      Age 16 · JHS 3 · Achimota School ·&nbsp; Ghanaian
                    </span>
                  </span>
                </div>
              </div>

              {/* Active status — Figma 2941:52487 / 52488 */}
              <span className="flex shrink-0 items-center gap-[6px]">
                <span
                  aria-hidden="true"
                  className="rounded-full"
                  style={{ width: 7, height: 7, backgroundColor: '#1d7c4d' }}
                />
                <span
                  className="font-sans font-bold"
                  style={{ fontSize: 11, color: '#1d7c4d', lineHeight: 'normal' }}
                >
                  Active
                </span>
              </span>
            </div>

            {/* Details — Figma 2943:52521 */}
            <div className="flex w-full flex-col gap-[12px]">
              {/* Header row: icon + label + divider — Figma 2943:52523 */}
              <div className="flex items-center gap-[8px]">
                <span className="flex items-center gap-[8px]" style={{ color: '#babab7' }}>
                  {/* Figma 2943:52526 — mail icon, 11px, label-grey via currentColor */}
                  <MailIcon className="h-[11px] w-[11px]" />
                  <span
                    className="font-sans font-bold uppercase"
                    style={{ fontSize: 9, color: '#babab7', letterSpacing: '1px' }}
                  >
                    Details
                  </span>
                </span>
                <span className="h-px flex-1" style={{ backgroundColor: 'rgba(0,0,0,0.06)' }} />
              </div>

              {/* Field grid — Figma 2943:52533 */}
              <div className="flex w-full flex-col gap-[8px]">
                <div className="flex w-full gap-[14px]">
                  {/* Figma 2943:52553 / 52557 — shared PreviewField */}
                  <PreviewField
                    className="flex-1"
                    label="School"
                    value="Achimota School"
                    valueColor="#111"
                  />
                  <PreviewField
                    className="flex-1"
                    label="Curriculum"
                    value="GES"
                    valueColor="#111"
                  />
                </div>
                <div className="flex w-full gap-[17px]">
                  {/* Figma 2943:52546 / 52549 — shared PreviewField */}
                  <PreviewField
                    className="flex-1"
                    label="Account created"
                    value="Today, 09:42 AM"
                    valueColor="#111"
                  />
                  <PreviewField
                    className="flex-1"
                    label="Account status"
                    value="Active"
                    valueColor="#387440"
                  />
                </div>
              </div>
            </div>

            {/* Opt-out notice — Figma 2943:52571 */}
            <div
              className="flex w-full flex-col gap-[6px] rounded-[12px] border px-[12px] py-[12px]"
              style={{ backgroundColor: 'rgba(250,244,232,0.4)', borderColor: '#eedeb8' }}
            >
              {/* Figma 2943:52573 */}
              <p
                className="font-sans font-bold"
                style={{
                  fontSize: 12,
                  color: '#b48617',
                  letterSpacing: '0.1px',
                  lineHeight: '20px',
                }}
              >
                You can opt-out at any time from your dashboard
              </p>
              {/* Figma 2943:52574 */}
              <p
                className="font-sans"
                style={{
                  fontSize: 12,
                  color: '#b48617',
                  letterSpacing: '0.2px',
                  lineHeight: '18px',
                }}
              >
                If you have concerns about Kofi&apos;s participation, you can remove their access
                after completing setup. Their data is preserved and the account can be reactivated.
              </p>
            </div>
          </div>

          {/* CTA — Figma 2939:49726 (rendered enabled — see header note) */}
          <Button
            type="button"
            variant="primary"
            size="lg"
            className="mt-2 w-full justify-center"
            rightIcon={<ArrowRightIcon />}
            onClick={handleConfirm}
          >
            Confirm &amp; Continue
          </Button>

          {/* Footer — Figma 2939:49727 */}
          <p className="font-sans text-sm" style={{ color: '#737373' }}>
            Already Have an account?{' '}
            <Link
              to="/onboarding/parent-login"
              className="font-semibold underline-offset-2 hover:underline"
              style={{ color: '#387440' }}
              onClick={() => log('log in instead clicked')}
            >
              Log in Instead
            </Link>
          </p>
        </div>
      </div>

      {/* Auto-link success Toast — Figma 2943:52577 */}
      {showToast && (
        <Toast
          position="top-right"
          variant="success"
          duration={8000}
          title="Ward automatically linked Path A"
          body="Your contact matched the details Kofi provided. No further action is needed to establish the link."
          onDismiss={() => {
            log('auto-link toast dismissed');
            setShowToast(false);
          }}
        />
      )}
    </>
  );
};

export default ParentLinkWardSection;
