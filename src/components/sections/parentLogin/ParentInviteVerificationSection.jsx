import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Upload from '../../ui/form/Upload.jsx';
import { ArrowRightIcon } from '../../shared/assets.jsx';
import { debug } from '../../../utils/debug.js';

const log = debug('ParentInviteVerificationSection');

/*
 * ParentInviteVerificationSection — Verification step of parent onboarding
 * FLOW B (ward-invited). Figma main frame 2864:37219 (left 2864:37224).
 * Route: /onboarding/parent-invited-verification.
 *
 * Both uploads are OPTIONAL for parents — the screen can be skipped. Card
 * layout + sticky Back/Continue footer; simple step-list panel from the layout.
 */

// ── hand-crafted glyphs (bounding box + stroke colour only) ─────────────────
const IdCardGlyph = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <rect x="1.5" y="3.5" width="15" height="11" rx="2" stroke="currentColor" strokeWidth="1.3" />
    <circle cx="6" cy="8.5" r="1.6" stroke="currentColor" strokeWidth="1.3" />
    <path d="M10 7h4M10 10h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

const ProfileGlyph = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <circle cx="9" cy="6" r="3" stroke="currentColor" strokeWidth="1.3" />
    <path
      d="M3.5 15c.8-3 3-4.5 5.5-4.5s4.7 1.5 5.5 4.5"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
    />
  </svg>
);

const InfoGlyph = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
    <circle cx="6" cy="6" r="5" stroke="#967014" strokeWidth="1.2" />
    <path d="M6 5.4v3" stroke="#967014" strokeWidth="1.3" strokeLinecap="round" />
    <circle cx="6" cy="3.5" r="0.7" fill="#967014" />
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

// ── main component ──────────────────────────────────────────────────────────
const ParentInviteVerificationSection = () => {
  log('mount');
  const navigate = useNavigate();
  const [ghanaCard, setGhanaCard] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);

  const goNext = () => {
    log('continue → parent-invited-contact', {
      hasGhanaCard: !!ghanaCard,
      hasPhoto: !!profilePhoto,
    });
    navigate('/onboarding/parent-invited-contact');
  };

  return (
    <div className="flex min-h-full flex-1 flex-col">
      {/* ── Scrollable body ── */}
      <div className="flex-1 px-6 py-10 md:px-14">
        <div className="mx-auto flex w-full max-w-full flex-col gap-[20px]">
          {/* Header (centered) — Figma 2864:37225 / 37226 / 37227 */}
          <div className="flex flex-col items-center gap-[6px] text-center">
            <span
              className="font-sans font-bold uppercase"
              style={{ fontSize: 10, color: '#c8951a', letterSpacing: '1.3px' }}
            >
              Step 2 of 7 — Verification
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
              Verify your{' '}
              <span className="italic" style={{ color: '#c8951a' }}>
                identity.
              </span>
            </h1>
            <p
              className="max-w-[440px] font-sans"
              style={{ fontSize: 14, color: '#70706e', lineHeight: '23px' }}
            >
              Both fields are optional — you can skip this step and verify later. Adding an ID and
              photo builds trust with the platform.
            </p>
          </div>

          {/* Note banner — Figma 2864:37228 */}
          <div
            className="flex w-full items-start gap-[12px] rounded-[16px] border px-[15px] py-[13px]"
            style={{ backgroundColor: '#faf4e8', borderColor: '#eedeb8' }}
          >
            <span
              className="mt-[1px] flex size-[26px] shrink-0 items-center justify-center rounded-[8px] bg-white"
              style={{ boxShadow: '0px 2px 0px #eedeb8' }}
            >
              <InfoGlyph />
            </span>
            <p className="font-sans" style={{ fontSize: 13, lineHeight: '20px' }}>
              <span className="font-bold" style={{ color: '#111' }}>
                Both fields are optional for parents
              </span>
              <span style={{ color: '#575755' }}>
                {' '}
                Unlike talent accounts, parent verification is not required to access the platform.
                You can always add these details later from your dashboard.
              </span>
            </p>
          </div>

          {/* Upload cards — Figma 2864:37235 / 37245 (reused Upload, amber) */}
          <div className="grid grid-cols-1 gap-[16px] sm:grid-cols-2">
            <Upload
              variant="amber"
              height={160}
              icon={<IdCardGlyph />}
              title="Ghana Card ID"
              receivedTitle="Ghana Card ID"
              badge="Optional"
              receivedBadge="ADDED"
              acceptLabels={['GHA-XXXXXXXXX-X format', 'Front of card only']}
              accept="image/*"
              filename={ghanaCard ? `${ghanaCard.name} · Added` : undefined}
              onFileSelect={(f) => {
                log('ghana card selected:', f.name);
                setGhanaCard(f);
              }}
            />
            <Upload
              variant="amber"
              height={160}
              icon={<ProfileGlyph />}
              title="Profile Photo"
              receivedTitle="Profile Photo"
              badge="Optional"
              receivedBadge="ADDED"
              acceptLabels={['JPG or PNG · Max 5MB', 'Clear face photo']}
              accept="image/jpeg,image/png"
              filename={profilePhoto ? `${profilePhoto.name} · Added` : undefined}
              onFileSelect={(f) => {
                log('profile photo selected:', f.name);
                setProfilePhoto(f);
              }}
            />
          </div>

          {/* Skip row — Figma 2864:37254 */}
          <div className="flex items-center justify-center gap-[6px]">
            <span className="font-sans" style={{ fontSize: 12, color: '#70706e' }}>
              Prefer to skip for now?
            </span>
            <button
              type="button"
              onClick={() => {
                log('continue without verification');
                goNext();
              }}
              className="font-sans font-bold"
              style={{ fontSize: 12, color: '#c8951a', borderBottom: '1px solid #eedeb8' }}
            >
              Continue without verification
            </button>
          </div>
        </div>
      </div>

      {/* ── Sticky footer: Back + Continue (Figma 2864:37257) ── */}
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
          <button
            type="button"
            onClick={goNext}
            className="flex h-[48px] flex-1 items-center justify-center gap-[8px] rounded-[10px] border-2 text-white transition-transform active:translate-y-[2px]"
            style={{
              backgroundColor: '#c8951a',
              borderColor: '#967014',
              boxShadow: '0px 3px 0px #967014',
            }}
          >
            <span className="font-sans font-bold" style={{ fontSize: 15 }}>
              Continue
            </span>
            <ArrowRightIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParentInviteVerificationSection;
