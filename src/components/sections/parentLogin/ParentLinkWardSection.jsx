import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../ui/Button.jsx';
import StickyActionBar from '../../ui/form/StickyActionBar.jsx';
import Captions from '../../ui/Captions.jsx';
import PreviewField from '../../ui/PreviewField.jsx';
import Toast from '../../ui/Toast.jsx';
import ClampText from '../../ui/ClampText.jsx';
import ParentInlineNotice from './ParentInlineNotice.jsx';
import ParentDefRows from './ParentDefRows.jsx';
import { useMediaQuery } from '../../../hooks/useMediaQuery.js';
import WavyDivider from '../../shared/WavyDivider.jsx';
import { ArrowRightIcon, MailIcon } from '../../shared/assets.jsx';
import { debug } from '../../../utils/debug.js';
// Placeholder ward avatar — swap for the real per-ward photo when the parent
// onboarding store is wired. Reuses an existing onboarding portrait so the
// build stays green; intended final path: src/assets/parent/ward-avatar.png
import wardAvatar from '../../../assets/hero/parent-welcome-panel-photo.webp';

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
  // Phones: the shared Toast's full-screen scrim + tall card covers the page, so
  // the same message is shown as a compact inline notice instead.
  const isTabletUp = useMediaQuery('(min-width: 1024px)');
  log('toast branch:', isTabletUp ? 'toast' : 'inline-notice', 'visible:', showToast);

  const handleConfirm = () => {
    log('confirm clicked — navigating to parent-review');
    navigate('/onboarding/parent-review');
  };

  return (
    <>
      <div className="flex flex-1 items-start justify-center overflow-y-auto max-md:overflow-visible px-6 py-12 md:py-20 max-md:px-4 max-md:py-4">
        <div className="flex w-full max-w-[702px] flex-col items-center gap-6 max-md:gap-3">
          {/* Phones: compact inline notice replaces the Toast */}
          {!isTabletUp && showToast && (
            <ParentInlineNotice
              title="Ward automatically linked Path A"
              onDismiss={() => setShowToast(false)}
            >
              Your contact matched the details Kofi provided. No further action is needed to
              establish the link.
            </ParentInlineNotice>
          )}

          {/* Step badge — Figma 2939:49709 — shared Captions (amber parent theme) */}
          <Captions
            variant="amber"
            items={[{ index: '05', label: 'Link Ward' }]}
            currentIndex={0}
            className="max-md:self-start max-md:px-3 max-md:py-0.5"
          />

          {/* Headline — Figma 2939:49718 */}
          {/* "Your ward is " regular black + italic amber "linked" */}
          <h1
            className="max-w-[554px] text-center font-display font-normal max-md:self-stretch max-md:text-left max-md:text-[24px]! max-md:leading-tight!"
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
            className="max-w-[482px] text-center font-sans max-md:self-stretch max-md:text-left max-md:text-[14px]! max-md:leading-5!"
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
          <div className="flex w-full flex-col gap-[8px] max-md:gap-2">
            {/* Ward header — Figma 2941:52472 */}
            <div
              className="flex w-full items-center justify-between rounded-[16px] border bg-white px-[21px] max-md:h-auto! max-md:gap-x-3 max-md:rounded-none max-md:border-0 max-md:border-b max-md:bg-transparent max-md:px-0 max-md:py-2"
              style={{ height: 76, borderColor: '#c1d4c4' }}
            >
              {/* Avatar + identity — Figma 2947:68504 */}
              <div className="flex min-w-0 items-center gap-[16px] max-md:gap-3">
                <span
                  className="block shrink-0 overflow-hidden rounded-full border-2 max-md:size-10!"
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
                <div className="flex min-w-0 flex-col gap-[4px] max-md:gap-0.5">
                  {/* Name — Figma 2947:68508 */}
                  <p
                    className="font-sans font-semibold max-md:leading-5!"
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
                    className="inline-flex w-fit max-w-full items-center justify-center rounded-[4px] border px-[10px] py-[3px] max-md:justify-start max-md:border-0 max-md:bg-transparent! max-md:p-0 max-md:text-left"
                    style={{ backgroundColor: '#ebf1ec', borderColor: '#c1d4c4' }}
                  >
                    <span
                      className="font-sans font-semibold max-md:leading-4! max-md:font-medium"
                      style={{
                        fontSize: 'var(--fs-10)',
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
                  style={{ fontSize: 'var(--fs-11)', color: '#1d7c4d', lineHeight: 'normal' }}
                >
                  Active
                </span>
              </span>
            </div>

            {/* Details — Figma 2943:52521 */}
            <div className="flex w-full flex-col gap-[12px] max-md:gap-1">
              {/* Header row: icon + label + divider — Figma 2943:52523 */}
              <div className="flex items-center gap-[8px]">
                <span className="flex items-center gap-[8px]" style={{ color: '#babab7' }}>
                  {/* Figma 2943:52526 — mail icon, 11px, label-grey via currentColor */}
                  <MailIcon className="h-[11px] w-[11px]" />
                  <span
                    className="font-sans font-bold uppercase"
                    style={{ fontSize: 'var(--fs-9)', color: '#babab7', letterSpacing: '1px' }}
                  >
                    Details
                  </span>
                </span>
                <span className="h-px flex-1" style={{ backgroundColor: 'rgba(0,0,0,0.06)' }} />
              </div>

              {/* Field grid — Figma 2943:52533 */}
              <ParentDefRows
                rows={[
                  { label: 'School', value: 'Achimota School' },
                  { label: 'Curriculum', value: 'GES' },
                  { label: 'Account created', value: 'Today, 09:42 AM' },
                  { label: 'Account status', value: 'Active', valueColor: '#387440' },
                ]}
              />
              <div className="flex w-full flex-col gap-[8px] max-md:hidden">
                <div className="flex w-full gap-[14px] max-md:gap-2">
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
              className="flex w-full flex-col gap-[6px] rounded-[12px] border px-[12px] py-[12px] max-md:gap-0.5 max-md:py-2"
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
              <ClampText
                lines={2}
                className="font-sans text-[12px] leading-[18px] tracking-[0.2px] text-[#b48617]"
                buttonClassName="text-[12px] font-semibold text-[#b48617]"
              >
                If you have concerns about Kofi&apos;s participation, you can remove their access
                after completing setup. Their data is preserved and the account can be reactivated.
              </ClampText>
            </div>
          </div>

          {/* CTA — Figma 2939:49726 (rendered enabled — see header note) */}
          <StickyActionBar bleed={16}>
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
          </StickyActionBar>

          {/* Footer — Figma 2939:49727 */}
          <p className="font-sans text-sm max-md:text-[13px]" style={{ color: '#737373' }}>
            Already Have an account?{' '}
            <Link
              to="/onboarding/parent-login"
              className="font-semibold underline-offset-2 hover:underline relative max-md:before:absolute max-md:before:-inset-x-1 max-md:before:-inset-y-2.5 max-md:before:content-['']"
              style={{ color: '#387440' }}
              onClick={() => log('log in instead clicked')}
            >
              Log in Instead
            </Link>
          </p>
        </div>
      </div>

      {/* Auto-link success Toast — Figma 2943:52577 */}
      {isTabletUp && showToast && (
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
