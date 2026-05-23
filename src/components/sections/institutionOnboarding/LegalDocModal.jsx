import { useEffect, useRef, useState } from 'react';
import Button from '../../ui/Button.jsx';
import { CloseIcon } from '../../shared/assets.jsx';
import { debug } from '../../../utils/debug.js';

const log = debug('LegalDocModal');

/*
 * LegalDocModal — shared legal document overlay for the Activate Account step.
 * Figma nodes:
 *   Terms & Conditions    2977:85514–2977:85601
 *   Privacy Policy        2992:19835–2992:19901
 *   Data Consent          2992:20197–2992:20267
 *
 * Desktop  → centered card, max-w-680, max-h-80vh, scrollable body.
 * Mobile   → bottom sheet, 80vh, drag-handle pill at top, drag-down to close.
 *
 * Props:
 *   variant   'tc' | 'privacy' | 'data-processing'
 *   onClose   () => void   — called on close button, backdrop click, Escape, drag-close
 *   onAccept  () => void   — called when "✓ I understand and Accept" is clicked
 *
 * All copy is verbatim from Figma MCP — never invented.
 */

// ─────────────────────────────────────────────────────────────────────────────
// Content (verbatim from Figma metadata — node IDs annotated inline)
// ─────────────────────────────────────────────────────────────────────────────

// Terms & Conditions  (2977:85514 – 2977:85601)
const TC_CONTENT = {
  title: 'Terms & Conditions',
  sectionLabel: 'What you are agreeing to', // 2977:85533
  // 2977:85534
  subtitle: '5 key points. This is what these terms actually mean for you as an institution admin.',
  items: [
    {
      num: 1,
      heading: 'You must be an authorised representative', // 2977:85540
      // 2977:85541
      body: 'By ticking, you confirm you are a principal, registrar, or official administrator with the authority to register this institution on GTH. You are making a binding commitment on behalf of your institution.',
    },
    {
      num: 2,
      heading: 'Upload only your enrolled students', // 2977:85546
      // 2977:85547
      body: 'You may only upload students currently enrolled at your institution. Uploading fictitious records, students from other schools, or duplicates is a breach of these T&Cs and may result in immediate account suspension.',
    },
    {
      num: 3,
      heading: 'Parental notifications for minors are mandatory', // 2977:85552
      // 2977:85553
      body: 'For every student under 18 in your upload, GTH automatically sends an opt-out notification to the parent contact you provide. This cannot be turned off. You are responsible for supplying accurate parent contact data.',
    },
    {
      num: 4,
      heading: 'Fair hiring and non-discrimination apply', // 2977:85558
      // 2977:85559
      body: "All recruitment engagement through GTH must comply with Ghana's Labour Act. Discrimination on any basis — gender, ethnicity, disability, religion — is prohibited, and violations may be held against your institution.",
    },
    {
      num: 5,
      heading: 'You may never access individual student data', // 2977:85564
      // 2977:85565
      body: 'Your dashboard shows aggregated statistics only. You will never see individual student names, scores, profiles, or any personally identifiable information. Attempting to circumvent this is a T&C violation.',
    },
  ],
  warningCard: {
    type: 'blue',
    heading: 'Account suspension', // 2977:85591
    // 2977:85592
    body: "GTH may suspend your institution's admin access immediately for T&C violations. Student accounts already created remain active only the institution's dashboard access is affected. Suspensions are reviewed on appeal.",
  },
  // 2977:85596
  summaryText: 'Summary of 5 key points. For the full legal text, read the complete document.',
};

// Privacy Policy  (2992:19835 – 2992:19901)
const PP_CONTENT = {
  title: 'Privacy Policy',
  // 2992:19851
  subtitle:
    "6 key points. This policy covers what GTH holds about your institution and your rights under Ghana's Data Protection Act.",
  items: [
    {
      num: 1,
      heading: 'What GTH collects from your institution', // 2992:19858
      // 2992:19859
      body: 'By ticking, you confirm you are a principal, registrar, or official administrator with the authority to register this institution on GTH. You are making a binding commitment on behalf of your institution.',
    },
    {
      num: 2,
      heading: 'Why we collect it', // 2992:19864
      // 2992:19865
      body: 'You may only upload students currently enrolled at your institution. Uploading fictitious records, students from other schools, or duplicates is a breach of these T&Cs and may result in immediate account suspension.',
    },
    {
      num: 3,
      heading: 'How long we keep it', // 2992:19870
      // 2992:19871
      body: 'For every student under 18 in your upload, GTH automatically sends an opt-out notification to the parent contact you provide. This cannot be turned off. You are responsible for supplying accurate parent contact data.',
    },
    {
      num: 4,
      heading: 'Your right to access your data', // 2992:19876
      // 2992:19877
      body: "All recruitment engagement through GTH must comply with Ghana's Labour Act. Discrimination on any basis — gender, ethnicity, disability, religion — is prohibited, and violations may be held against your institution.",
    },
    {
      num: 5,
      heading: 'Your right to correct or delete your data', // 2992:19882
      // 2992:19883
      body: 'Your dashboard shows aggregated statistics only. You will never see individual student names, scores, profiles, or any personally identifiable information. Attempting to circumvent this is a T&C violation.',
    },
    {
      num: 6,
      heading: "GTH never sells your institution's data", // 2992:19974
      // 2992:19975
      body: "No advertising. No data brokers. No profiling. Your institution's information is used only to operate your GTH account.",
    },
  ],
  rightsCard: {
    heading: 'Your five rights under Ghana DPA (Act 843)', // 2992:19981
    // 2992:19982
    body: 'Access · Correction · Erasure · Portability · Complaints. You may lodge a complaint with the Data Protection Commission of Ghana at dataprotection.gov.gh if you believe GTH has handled your data unlawfully.',
  },
  // 2992:19896
  summaryText: "Summary of 6 key points. This covers your institution's data — not student data.",
  showReadFull: true,
};

// Data Consent & Use Policy  (2992:20197 – 2992:20267)
const DP_CONTENT = {
  title: 'Data Consent & Use Policy',
  // 2992:20212
  bannerTitle: 'Students own their data — your institution sees aggregated only',
  // 2992:20213
  bannerSubtitle:
    '5 key points. What GTH does with the student data you upload and exactly who can access what.',
  items: [
    {
      num: 1,
      heading: 'Student accounts are created immediately on upload', // 2992:20220
      // 2992:20221
      body: 'Each valid row in your upload creates an active GTH account. Students receive login credentials by SMS or email right away. There is no pending state — accounts are live from the moment your upload completes successfully.',
    },
    {
      num: 2,
      heading: 'Your institution sees aggregated statistics only', // 2992:20226
      // 2992:20227
      body: 'Your dashboard shows total registrations, active users, profile completion rates, and engagement trends at institution level. You will never see individual student names, scores, profiles, or any personally identifiable information.',
    },
    {
      num: 3,
      heading: 'Opt-out notifications for minors are automatic', // 2992:20232
      // 2992:20233
      body: "For every student under 18 where you provided a parent contact, GTH sends an opt-out notification immediately after upload. This cannot be turned off. If a parent opts out, the student's access is suspended within 60 seconds but their profile is preserved for potential reinstatement.",
      accent: 'green',
    },
    {
      num: 4,
      heading: 'Students own and control their own profiles', // 2992:20238
      // 2992:20239
      body: "You uploaded the data to create accounts. From that point on, only the student can edit their own information. Your institution cannot edit, update, or delete any student's profile. Parents can flag errors; only the student can correct them.",
    },
    {
      num: 5,
      heading: 'Student data is protected under Ghana DPA (Act 843)', // 2992:20244
      // 2992:20245
      body: "All student data is subject to Ghana's Data Protection Act. Students have the right to access, correct, or delete their own data at any time. Student data is anonymised 90 days after account closure. Audit logs are retained for 7 years as legally required.",
    },
  ],
  warningCard: {
    type: 'amber',
    heading: 'Minors without parent contact provided', // 2998:20344
    // 2998:20345
    body: 'If you upload a student under 18 without providing parent contact details, their account is still created and activated immediately. GTH flags the row for you to supply parent contact later. The opt-out notification will be sent as soon as a contact is provided.',
  },
  // 2992:20262
  summaryText: 'Summary of 5 key points. This covers what happens to the student data you upload.',
  showReadFull: true,
};

const CONTENT_MAP = {
  tc: TC_CONTENT,
  privacy: PP_CONTENT,
  'data-processing': DP_CONTENT,
};

// ─────────────────────────────────────────────────────────────────────────────
// Small internal icons  (inline SVG — DO NOT render Figma SVG data)
// ─────────────────────────────────────────────────────────────────────────────

const CheckAcceptIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path
      d="M3 8.5L6.5 12L13 5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// ─────────────────────────────────────────────────────────────────────────────
// Item number circle
// ─────────────────────────────────────────────────────────────────────────────

const ItemNumber = ({ num, accent }) => {
  const isGreen = accent === 'green';
  return (
    <div
      className={[
        'shrink-0 inline-flex items-center justify-center size-[26px] rounded-[13px] border',
        isGreen ? 'bg-[#ebf1ec] border-[#c1d4c4]' : 'bg-[#f8f8f4] border-[#c6c6c3]',
      ].join(' ')}
    >
      <span
        className="font-sans font-bold text-[11px] leading-none"
        style={{ color: isGreen ? '#2a5730' : '#70706e' }}
      >
        {num}
      </span>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Item row
// ─────────────────────────────────────────────────────────────────────────────

const ItemRow = ({ item, isLast }) => (
  <div
    className={[
      'flex items-start gap-3 py-[13px]',
      !isLast ? 'border-b border-[rgba(0,0,0,0.06)]' : '',
    ].join(' ')}
  >
    <ItemNumber num={item.num} accent={item.accent} />
    <div className="flex flex-col gap-[4px] min-w-0">
      <p
        className="font-sans font-bold"
        style={{
          fontSize: '13px',
          lineHeight: '1.23',
          color: item.accent === 'green' ? '#387440' : '#111',
        }}
      >
        {item.heading}
      </p>
      <p
        className="font-sans font-normal text-[#737373]"
        style={{ fontSize: '12px', lineHeight: '19.8px' }}
      >
        {item.body}
      </p>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Warning card — blue (T&C) or amber (DP)
// ─────────────────────────────────────────────────────────────────────────────

const WarningCard = ({ card }) => {
  const isBlue = card.type === 'blue';

  const containerCls = isBlue
    ? 'bg-[rgba(234,239,251,0.4)] border-[#bdd7f0]'
    : 'bg-[rgba(255,248,230,0.7)] border-[rgba(200,149,26,0.25)]';
  const iconBg = isBlue ? '#3062d4' : '#c8951a';
  const headingColor = isBlue ? '#3062d4' : '#7a4f00';
  const bodyColor = isBlue ? '#3062d4' : '#5a3c00';

  return (
    <div className={`flex items-start gap-3 rounded-[12px] border p-4 ${containerCls}`}>
      <div
        className="shrink-0 flex items-center justify-center size-[22px] rounded-[6px]"
        style={{ background: iconBg, boxShadow: '0px 1px 0px rgba(0,0,0,0.1)' }}
        aria-hidden="true"
      >
        {/* simple "!" glyph — avoids embedding Figma SVG data */}
        <span
          className="font-sans font-bold text-white select-none"
          style={{ fontSize: '12px', lineHeight: 1 }}
        >
          !
        </span>
      </div>
      <div className="flex flex-col gap-[4px]">
        <p
          className="font-sans font-bold"
          style={{ fontSize: '13px', lineHeight: '1.23', color: headingColor }}
        >
          {card.heading}
        </p>
        <p
          className="font-sans font-normal"
          style={{ fontSize: '12px', lineHeight: '19.8px', color: bodyColor }}
        >
          {card.body}
        </p>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Rights card — green (PP only)
// ─────────────────────────────────────────────────────────────────────────────

const RightsCard = ({ card }) => (
  <div className="flex items-start gap-3 rounded-[12px] border border-[#c1d4c4] bg-[rgba(235,241,236,0.5)] p-4">
    <div
      className="shrink-0 flex items-center justify-center size-[22px] rounded-[6px]"
      style={{ background: '#387440', boxShadow: '0px 1px 0px rgba(0,0,0,0.1)' }}
      aria-hidden="true"
    >
      <span
        className="font-sans font-bold text-white select-none"
        style={{ fontSize: '10px', lineHeight: 1 }}
      >
        ✓
      </span>
    </div>
    <div className="flex flex-col gap-[4px]">
      <p
        className="font-sans font-bold text-[#165d3a]"
        style={{ fontSize: '13px', lineHeight: '1.23' }}
      >
        {card.heading}
      </p>
      <p
        className="font-sans font-normal text-[#165d3a]"
        style={{ fontSize: '12px', lineHeight: '19.8px' }}
      >
        {card.body}
      </p>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// DP intro banner
// ─────────────────────────────────────────────────────────────────────────────

const DPBanner = ({ title, subtitle }) => (
  <div className="flex items-start gap-3 rounded-[12px] border border-[#c1d4c4] bg-[rgba(235,241,236,0.5)] p-4 mb-3">
    <div
      className="shrink-0 flex items-center justify-center size-[34px] rounded-[8px]"
      style={{ background: '#387440', boxShadow: '0px 2px 0px rgba(0,0,0,0.1)' }}
      aria-hidden="true"
    >
      <span className="font-display italic text-white text-[16px] leading-none select-none">g</span>
    </div>
    <div className="flex flex-col gap-[4px]">
      <p
        className="font-sans font-bold text-[#111]"
        style={{ fontSize: '13px', lineHeight: '1.3' }}
      >
        {title}
      </p>
      <p
        className="font-sans font-normal text-[#737373]"
        style={{ fontSize: '12px', lineHeight: '1.6' }}
      >
        {subtitle}
      </p>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Section label badge (T&C "What you are agreeing to")
// ─────────────────────────────────────────────────────────────────────────────

const SectionLabel = ({ text }) => (
  <div className="mb-2">
    <span className="inline-flex items-center rounded-[4px] border border-[#c6c6c3] bg-[rgba(248,248,244,0.5)] px-2 h-[21px]">
      <span
        className="font-sans font-bold uppercase text-[#70706e]"
        style={{ fontSize: '10px', letterSpacing: '0.6px' }}
      >
        {text}
      </span>
    </span>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────

const LegalDocModal = ({ variant, onClose, onAccept }) => {
  const content = CONTENT_MAP[variant];

  // ── Mobile drag-to-close state ──────────────────────────────────────────
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const isDraggingRef = useRef(false);
  const dragStartY = useRef(0);

  log('mount', { variant });
  log('render', { dragY, isDragging });

  // ── Keyboard dismiss ────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        log('Escape pressed — closing');
        onClose?.();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  // ── Body scroll lock ────────────────────────────────────────────────────
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    log('body scroll locked');
    return () => {
      document.body.style.overflow = prev;
      log('body scroll unlocked');
    };
  }, []);

  // ── Pointer drag handlers (mobile drag-to-close) ────────────────────────
  const handlePointerDown = (e) => {
    isDraggingRef.current = true;
    setIsDragging(true);
    dragStartY.current = e.clientY;
    e.currentTarget.setPointerCapture(e.pointerId);
    log('drag start', { startY: e.clientY });
  };

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current) return;
    const delta = e.clientY - dragStartY.current;
    setDragY(Math.max(0, delta));
  };

  const handlePointerUp = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsDragging(false);
    log('drag end', { dragY });
    if (dragY > 120) {
      log('drag threshold exceeded — closing');
      onClose?.();
    } else {
      setDragY(0);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      log('backdrop click — closing');
      onClose?.();
    }
  };

  const handleAccept = () => {
    log('accept clicked');
    onAccept?.();
  };

  if (!content) {
    log('error: unknown variant:', variant);
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-modal-title"
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center md:p-4"
      style={{ background: 'rgba(0,0,0,0.5)' }}
      onClick={handleBackdropClick}
    >
      {/* ── Sheet (mobile) / Card (desktop) ── */}
      <div
        className="relative flex flex-col w-full md:max-w-[680px] rounded-t-[20px] md:rounded-[24px] bg-white overflow-hidden"
        style={{
          height: '80vh',
          maxHeight: '80vh',
          transform: `translateY(${dragY}px)`,
          transition: isDragging ? 'none' : 'transform 0.25s cubic-bezier(0.32,0.72,0,1)',
          boxShadow: '0 -4px 40px rgba(0,0,0,0.18)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Mobile drag handle (hidden on md+) ── */}
        <div
          className="flex md:hidden items-center justify-center py-3 shrink-0 cursor-grab active:cursor-grabbing select-none"
          style={{ touchAction: 'none' }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          aria-label="Drag down to close"
          role="button"
          tabIndex={-1}
        >
          {/* Drag pill — 36×4px rounded, bg-black/20 (Figma: 2992:19831) */}
          <div className="w-9 h-1 rounded-full bg-black/20" />
        </div>

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 pt-3 md:pt-6 pb-4 shrink-0 border-b border-[rgba(0,0,0,0.06)]">
          <h2
            id="legal-modal-title"
            className="font-display font-normal text-black"
            style={{
              fontSize: 'clamp(1.25rem, 2.5vw, 1.625rem)',
              lineHeight: 1.15,
              letterSpacing: '-0.4px',
            }}
          >
            {content.title}
          </h2>
          <button
            type="button"
            aria-label="Close"
            onClick={() => {
              log('close button clicked');
              onClose?.();
            }}
            className="ml-4 shrink-0 inline-flex size-[28px] items-center justify-center rounded-[20px] bg-[#ebf1ec] text-[#387440] transition-colors duration-100 hover:bg-[#d4e4d6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:ring-offset-2"
          >
            <CloseIcon />
          </button>
        </div>

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {/* T&C: section label + subtitle */}
          {variant === 'tc' && (
            <>
              <SectionLabel text={content.sectionLabel} />
              <p
                className="font-sans font-normal text-[#737373] mb-4"
                style={{ fontSize: '12px', lineHeight: '1.6' }}
              >
                {content.subtitle}
              </p>
            </>
          )}

          {/* PP: subtitle only */}
          {variant === 'privacy' && (
            <p
              className="font-sans font-normal text-[#737373] mb-4"
              style={{ fontSize: '12px', lineHeight: '1.6' }}
            >
              {content.subtitle}
            </p>
          )}

          {/* DP: intro banner */}
          {variant === 'data-processing' && content.bannerTitle && (
            <DPBanner title={content.bannerTitle} subtitle={content.bannerSubtitle} />
          )}

          {/* ── Items list ── */}
          <div>
            {content.items.map((item, i) => {
              log('render item', { num: item.num, heading: item.heading });
              return <ItemRow key={item.num} item={item} isLast={i === content.items.length - 1} />;
            })}
          </div>

          {/* Warning card (T&C blue / DP amber) */}
          {content.warningCard && (
            <div className="mt-4">
              <WarningCard card={content.warningCard} />
            </div>
          )}

          {/* Rights card (PP green) */}
          {content.rightsCard && (
            <div className="mt-4">
              <RightsCard card={content.rightsCard} />
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="shrink-0 border-t border-[rgba(0,0,0,0.06)] px-6 pt-4 pb-6 md:pb-6">
          {/* Summary text + optional Read full document link */}
          <div className="flex items-center justify-between gap-4 mb-4">
            <p
              className="font-sans font-normal text-[#959592]"
              style={{ fontSize: '12px', lineHeight: '1.5' }}
            >
              {content.summaryText}
            </p>
            {content.showReadFull && (
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  log('read full document clicked');
                }}
                className="shrink-0 inline-flex items-center gap-1 font-sans font-semibold text-brand-green hover:opacity-80 transition-opacity"
                style={{ fontSize: '12px', whiteSpace: 'nowrap' }}
              >
                Read full document
                {/* small right-arrow icon */}
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                  <path
                    d="M2 5h6M5.5 2.5L8 5l-2.5 2.5"
                    stroke="currentColor"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            )}
          </div>

          {/* Accept CTA */}
          <Button
            type="button"
            variant="primary"
            size="lg"
            leftIcon={<CheckAcceptIcon />}
            onClick={handleAccept}
            className="w-full"
          >
            I understand and Accept
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LegalDocModal;
