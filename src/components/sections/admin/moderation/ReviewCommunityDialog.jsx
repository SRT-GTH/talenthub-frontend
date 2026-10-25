import cover from '../../../../assets/admin/community-cover.webp';
import face1 from '../../../../assets/admin/face-1.webp';
import face2 from '../../../../assets/admin/face-2.webp';
import face3 from '../../../../assets/admin/face-3.webp';
import AgencyDialog from '../../agency/onboarding/AgencyDialog.jsx';
import {
  AdminCheckCircleIcon,
  AdminClockSmallIcon,
  AdminClose20Icon,
  AdminInfoCircleIcon,
  AdminTargetSmallIcon,
  AdminUsersSmallIcon,
  AdminUsersTileIcon,
  AdminWarningTileIcon,
} from '../adminIcons.jsx';
import { REVIEW } from './data/adminModerationData.js';

/*
 * ReviewCommunityDialog — "Review #Agritech Innovators Ghana" (Figma 7.2.5b 8956:1000, 680 x 634, white, r24, p28, 1px ink, scrim #1c2a21 at 55 %): title 27/32 600 + 40 r10 close ·
 * left the community card preview (300 x 338: cover 150 with a yellow "CR-0412" tag, 17/600 name, member + "Submitted 2h ago" meta, 13 description, three faces + owner line) ·
 * right "Automatic checks" (five rows of a 40 tile + 14/600 title + 12.5 detail; the age row is the cream warning) · the "What you’re checking" callout (#f7f8f4, r12) ·
 * footer: "Decide within 24 hours of submission", Reject (white), "Ask for a change" (white), Approve (green).
 * Props: onClose, onReject, onChange, onApprove.
 */

const FACES = [face1, face2, face3];

const AdminReviewIcon = ({ id }) => {
  if (id === 'age') return <AdminWarningTileIcon className="size-[20px] text-[#c8951a]" />;
  if (id === 'owner') return <AdminUsersTileIcon className="size-[20px] text-[#387440]" />;
  return <AdminCheckCircleIcon className="size-[20px] text-[#387440]" />;
};

const ReviewCommunityDialog = ({ onClose, onReject, onChange, onApprove }) => (
  <AgencyDialog
    label={REVIEW.title}
    onClose={onClose}
    scrimClassName="bg-[#1c2a21]/55"
    panelClassName="w-[min(680px,calc(100vw-32px))]"
  >
    <div className="flex flex-col gap-[18px] rounded-[24px] border border-solid border-[#1c2a21] bg-white p-[clamp(16px,1.6vw,28px)] shadow-[0_24px_64px_rgba(0,0,0,0.2)]">
      <div className="flex items-start gap-[10px]">
        <h2 className="m-0 min-w-0 flex-1 font-sans text-[27px] leading-[32px] font-semibold text-[#1c2a21]">
          {REVIEW.title}
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="grid size-[40px] shrink-0 cursor-pointer place-items-center rounded-[10px] border border-solid border-[#e6e6e6] bg-white text-[#387440] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
        >
          <AdminClose20Icon className="size-[20px]" />
        </button>
      </div>
      <div className="grid grid-cols-1 gap-[20px] sm:grid-cols-[300px_minmax(0,1fr)]">
        <article className="flex flex-col overflow-hidden rounded-[20px] border border-solid border-[#e6e6e6] bg-white">
          <div className="relative h-[150px]">
            <img src={cover} alt="" draggable="false" className="size-full object-cover" />
            <span className="absolute top-[12px] left-[11px] inline-flex items-center gap-[5px] rounded-full border border-solid border-[#1c2a21] bg-[#ffd86b] px-[10px] py-[5px] font-sans text-[11px] leading-[15px] font-bold text-[#1c2a21]">
              <AdminTargetSmallIcon className="size-[13px]" />
              {REVIEW.card.id}
            </span>
          </div>
          <div className="flex flex-col gap-[8px] p-[16px]">
            <h3 className="m-0 font-sans text-[17px] leading-[20px] font-semibold text-[#1c2a21]">
              {REVIEW.card.name}
            </h3>
            <p className="m-0 flex items-center gap-[6px] font-sans text-[12px] leading-[14px] font-medium text-[#595959]">
              <AdminUsersSmallIcon className="size-[14px]" />
              {REVIEW.card.meta[0]}
              <span className="text-[#bfbfbf]">·</span>
              <span className="text-[#387440]">{REVIEW.card.meta[1]}</span>
            </p>
            <p className="m-0 font-sans text-[13px] leading-[19px] text-[#595959]">
              {REVIEW.card.about}
            </p>
            <div className="flex items-center gap-[8px] pt-[8px]">
              <span className="flex items-center">
                {FACES.map((f, i) => (
                  <img
                    key={f}
                    src={f}
                    alt=""
                    draggable="false"
                    className={`size-[26px] rounded-full border-2 border-solid border-white object-cover ${i > 0 ? '-ml-[8px]' : ''}`}
                  />
                ))}
              </span>
              <span className="font-sans text-[11px] leading-[13px] font-medium text-[#737373]">
                {REVIEW.card.owner}
              </span>
            </div>
          </div>
        </article>
        <section aria-label={REVIEW.checksTitle} className="flex flex-col">
          <h3 className="m-0 font-sans text-[14px] leading-[17px] font-semibold text-[#1c2a21]">
            {REVIEW.checksTitle}
          </h3>
          <ul className="m-0 flex list-none flex-col p-0">
            {REVIEW.checks.map((c) => (
              <li key={c.id} className="flex items-start gap-[12px] py-[10px]">
                <span
                  className={`grid size-[40px] shrink-0 place-items-center rounded-[12px] ${c.ok ? 'bg-[#ebf1ec]' : 'bg-[#faf4e8]'}`}
                >
                  <AdminReviewIcon id={c.id} />
                </span>
                <span className="flex min-w-0 flex-col gap-[2px] pt-[2px]">
                  <span className="font-sans text-[14px] leading-[17px] font-semibold text-[#1c2a21]">
                    {c.title}
                  </span>
                  <span className="font-sans text-[12.5px] leading-[17px] text-[#737373]">
                    {c.sub}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
      <div className="flex items-start gap-[12px] rounded-[12px] border border-solid border-[#1c2a21]/10 bg-[#f7f8f4] px-[16px] py-[14px]">
        <AdminInfoCircleIcon className="mt-[1px] size-[18px] shrink-0 text-[#387440]" />
        <div className="flex flex-col gap-[2px]">
          <p className="m-0 font-sans text-[14px] leading-[17px] font-semibold text-[#1c2a21]">
            {REVIEW.checking.title}
          </p>
          <p className="m-0 font-sans text-[13px] leading-[16px] text-[#1c2a21]">
            {REVIEW.checking.body}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-[10px] pt-[4px]">
        <p className="m-0 mr-auto flex items-center gap-[6px] font-sans text-[12px] leading-[14px] font-medium text-[#737373]">
          <AdminClockSmallIcon className="size-[14px]" />
          {REVIEW.deadline}
        </p>
        {[
          { id: 'reject', label: REVIEW.reject, onClick: onReject },
          { id: 'change', label: REVIEW.change, onClick: onChange },
        ].map((b) => (
          <button
            key={b.id}
            type="button"
            onClick={b.onClick}
            className="inline-flex h-[56px] cursor-pointer items-center rounded-[14px] border-2 border-solid border-[#1c2a21]/30 bg-white px-[34px] font-sans text-[16px] leading-[24px] font-bold text-[#1c2a21] shadow-[0_4px_0_rgba(17,17,17,0.25)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
          >
            {b.label}
          </button>
        ))}
        <button
          type="button"
          data-autofocus
          onClick={onApprove}
          className="inline-flex h-[44px] cursor-pointer items-center rounded-[10px] border-2 border-solid border-[#2a5730] bg-[#387440] px-[22px] font-sans text-[16px] leading-[24px] font-bold text-white shadow-[0_4px_0_#2a5730] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
        >
          {REVIEW.approve}
        </button>
      </div>
    </div>
  </AgencyDialog>
);

export default ReviewCommunityDialog;
