import { classNames } from '../../../utils/classNames.js';
import Modal from '../../ui/Modal.jsx';
import EntryMethodCard from '../../cards/EntryMethodCard.jsx';

/*
 * EntryMethodModal — "How would you like to add your details?" modal.
 * Source: Figma frame (Information Entry Category modal) shown on the
 * Profile Engagement page.
 *
 * Three side-by-side option cards — type, chat, or upload — under a
 * compact header (category chip + title + lede). The middle card is
 * highlighted with a brand-green border and a "MOST POPULAR" ribbon.
 *
 * At the bottom there's a soft brand-green info ribbon reassuring the
 * user that the options aren't mutually exclusive — they can mix and
 * match across stages.
 *
 * Icons are inline SVG placeholders sized to the design (24×24 inside
 * a 48×48 tile). Swap them for design-system icons when the Figma
 * iconography lands as assets.
 */

const PencilIcon = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
  >
    <path d="M14.5 4l5.5 5.5L9 20.5 3.5 21l.5-5.5L14.5 4z" />
    <path d="M13 5.5l5.5 5.5" />
  </svg>
);

const SparkleAiIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
    <path
      d="M12 3l1.6 4.4 4.4 1.6-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    <path
      d="M18.5 14l.9 2.6 2.6.9-2.6.9-.9 2.6-.9-2.6L15 17.5l2.6-.9.9-2.6z"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinejoin="round"
    />
  </svg>
);

const UploadIcon = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
  >
    <path d="M12 4v12" />
    <path d="M7 9l5-5 5 5" />
    <path d="M5 18h14" />
    <path d="M5 18v2" />
    <path d="M19 18v2" />
  </svg>
);

const CategoryTag = () => (
  <span
    className={classNames(
      'inline-flex items-center gap-1.5 rounded-md border border-brand-green-light-active',
      'bg-brand-green-light px-2.5 py-1',
      'font-sans font-semibold text-[11px] leading-4 tracking-[0.2px] text-brand-green-dark'
    )}
  >
    <span aria-hidden="true" className="inline-block size-1.5 rounded-full bg-brand-green" />
    Information Entry Category
  </span>
);

const EntryMethodModal = ({ isOpen, onClose, onFillManually, onChatWithAi, onUploadCv }) => (
  <Modal isOpen={isOpen} onClose={onClose} size="xl" ariaLabel="Choose how to add your details">
    <div className="px-[clamp(20px,3vw,40px)] py-[clamp(24px,3vw,40px)]">
      {/* Header */}
      <div className="flex flex-col items-center text-center gap-3">
        <CategoryTag />
        <h2 className="font-display text-[clamp(28px,3vw,36px)] leading-[1.1] tracking-[-0.5px] text-content-primary">
          How would you like to add your details
        </h2>
        <p className="max-w-[520px] font-sans text-[14px] leading-[22px] tracking-[0.2px] text-neutral-darker">
          Three ways to do this — pick whatever feels right today. You can switch anytime,
          mix-and-match, or come back later. Nothing&apos;s locked in.
        </p>
      </div>

      {/* Three option cards */}
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        <EntryMethodCard
          icon={<PencilIcon className="size-6" />}
          duration="~3 min"
          title="Fill it in myself"
          description="Enter each role one at a time. Full control, no surprises."
          actionLabel="Start Typing"
          onClick={onFillManually}
        />

        <EntryMethodCard
          highlighted
          mostPopular
          icon={<SparkleAiIcon className="size-6" />}
          duration="~5 min · Feels like a chat"
          title="Chat with Career Ai"
          description="Career Buddy asks, you answer, she fills the form."
          actionLabel="Say Hi to Career Buddy"
          onClick={onChatWithAi}
        />

        <EntryMethodCard
          icon={<UploadIcon className="size-6" />}
          duration="~30 sec to confirm"
          title="Upload my CV"
          description="Drop your CV; we’ll extract roles, dates, education, and skills for your review."
          actionLabel="Drop File"
          onClick={onUploadCv}
        />
      </div>

      {/* Mix-and-match info ribbon */}
      <div
        className={classNames(
          'mt-6 rounded-xl border border-brand-green-light-active bg-brand-green-light/50',
          'px-4 py-3 text-center',
          'font-sans text-[13px] leading-[20px] tracking-[0.2px] text-brand-green-dark'
        )}
      >
        Don’t worry you can mix and match. Upload a CV, then add freelance gigs by chat, then edit a
        date manually.
      </div>
    </div>
  </Modal>
);

export default EntryMethodModal;
