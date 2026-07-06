import Modal from '../../ui/Modal.jsx';
import { debug } from '../../../utils/debug.js';
import { CheckIcon, ArrowRightSmIcon, PlusIcon, SparkleIcon } from '../../shared/assets.jsx';

const log = debug('InterestsCompleteModal');

/*
 * InterestsCompleteModal — celebration popup shown when the user completes the interests stage.
 * Figma frame 3576:101711.
 *
 * Shell:    Modal primitive (size="sm") — handles portal, ESC, scroll lock, overlay dismiss.
 * Header:   🏆 trophy + "Interests c_omplete._" + stats subtext.
 * Body:     3 stat rows (green check, dark arrow, yellow plus).
 * Footer:   progress bar + "Continue to Personality stage" golden CTA.
 */

const StatRow = ({ iconBg, iconBorder, icon, title, description }) => (
  <div className="flex items-start py-3 gap-[12px]">
    <div
      className="size-[32px] shrink-0 rounded-full flex items-center justify-center"
      style={{ background: iconBg, border: iconBorder }}
    >
      {icon}
    </div>
    <div className="flex-1 min-w-0 pt-[1px]">
      <p className="font-sans font-semibold text-[14px] text-[#2a5730] leading-normal">{title}</p>
      <p className="font-sans text-[12px] text-[#96a090] leading-[18px] mt-[2px]">{description}</p>
    </div>
  </div>
);

const InterestsCompleteModal = ({
  isOpen,
  onClose,
  onContinue,
  categoryCount = 5,
  specificCount = 11,
  roleMatchCount = 142,
}) => {
  log('render', { isOpen, categoryCount, specificCount, roleMatchCount });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      ariaLabel="Interests complete"
      contentClassName="!rounded-[24px] !shadow-[0px_24px_64px_0px_rgba(0,0,0,0.12),0px_4px_0px_0px_rgba(0,0,0,0.07),0px_0px_0px_1px_rgba(0,0,0,0.04)] overflow-hidden"
    >
      {/* Body — Figma 3576:101711 */}
      <div className="px-[clamp(24px,5.47vw,40px)] pt-[40px] pb-[32px] flex flex-col gap-[20px]">
        {/* Header — Figma 3576:101717 / 101720 / 101721 */}
        <div className="flex flex-col items-center gap-[10px] text-center">
          <div className="text-[48px] leading-none select-none" aria-label="trophy">
            🏆
          </div>

          <h2 className="font-display text-[clamp(24px,2.31vw,32px)] leading-[1.1] tracking-[-1.2px]">
            <span className="not-italic text-[#111]">Interests c</span>
            <span className="italic text-[#387440]">omplete.</span>
          </h2>

          <p className="font-sans text-[12px] text-[#959592] tracking-[0.2px] leading-[18px] max-w-[340px]">
            {categoryCount} categories, {specificCount} specifics, {roleMatchCount} role matches.
            Mentor matching is live for Technology and Creative Arts. You&apos;re in the top 15%.
          </p>
        </div>

        {/* Stat rows */}
        <div className="flex flex-col divide-y divide-[#EBEBEB] ">
          {/* Row 1 — Interests stage complete — Figma 3576:101725 / 101729 / 101730 */}
          <StatRow
            iconBg="#cce5cc"
            iconBorder="1px solid #2a5730"
            icon={<CheckIcon className="size-[18px] text-[#2a5730]" />}
            title="Interests stage complete!"
            description={`You're in the top 15% for matching precision with ${roleMatchCount} role matches. Mentor matching is live for Technology and Creative Arts.`}
          />

          {/* Row 2 — Category breadth — Figma 3576:101733 / 101738 / 101739 */}
          <StatRow
            iconBg="#1a1a1a"
            iconBorder="none"
            icon={<ArrowRightSmIcon className="size-[18px] text-white" />}
            title={`${categoryCount} categories covering 91% of the market`}
            description="Technology, Creative Arts, Business, Development & NGO, Startups & VC. Broad yet focused to capture your range."
          />

          {/* Row 3 — Role matches — Figma 3576:101742 / 101747 / 101748 */}
          <StatRow
            iconBg="#ffffff"
            iconBorder="2px solid #c8951a"
            icon={<PlusIcon className="size-[16px] text-[#c8951a]" />}
            title={`${roleMatchCount} role matches and climbing`}
            description="Your interests continuously feed the matching engine. New roles are scored against your categories automatically."
          />
        </div>

        {/* Progress bar — Figma 3576:101751 (~16% of full profile) */}
        <div className="bg-[#ebf1ec] rounded-[2px] h-[6px] overflow-hidden">
          <div className="h-full bg-[#387440] rounded-[6px]" style={{ width: '16%' }} />
        </div>

        {/* CTA button — Figma 3576:101753 */}
        <button
          type="button"
          onClick={onContinue}
          className="w-full flex items-center justify-center gap-[8px] px-[40px] py-[16px] rounded-[14px] font-sans font-bold text-[16px] tracking-[0.1px] text-[#faf4e8] bg-[#c8951a] hover:opacity-90 transition-opacity duration-150 whitespace-nowrap"
          style={{
            borderTop: '1px solid #967014',
            borderRight: '2px solid #967014',
            borderBottom: '2px solid #967014',
            borderLeft: '2px solid #967014',
            filter: 'drop-shadow(0px 4px 0px #967014)',
          }}
        >
          <SparkleIcon className="size-[18px] shrink-0" />
          Continue to Personality stage
          <ArrowRightSmIcon className="size-[18px] shrink-0" />
        </button>
      </div>
    </Modal>
  );
};

export default InterestsCompleteModal;
