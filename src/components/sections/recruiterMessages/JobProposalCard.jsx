import { useEffect } from 'react';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import { ProposalWatermarkIcon } from './recruiterMessagesIcons.jsx';

const log = debug('JobProposalCard');

/*
 * JobProposalCard — the "JOB PROPOSAL" card inside a thread, 299 wide.
 *   recruiter viewer (Figma 7249:84510, 151 high): light card, gradient #faf5f1 → #f1f7f4 at 200.24deg, 1px #00522b/10,
 *     r10, shadow 0 1px 2px 5%, pad 24/18/18, watermark at 59% opacity, footer "Awaiting response · not yet applied".
 *   talent viewer (Figma 7249:85274, 193 high): dark card, gradient #142916 → #2a5730, title white, company #bfbfbf,
 *     match #c8951a, a white "View & apply →" button and "Awaiting your response", watermark at 25% opacity.
 * Props: proposal (recruiterMessagesData), viewerRole 'recruiter' | 'talent', className (alignment).
 */
const JobProposalCard = ({ proposal, viewerRole, className }) => {
  const isTalentView = viewerRole === 'talent';

  useEffect(() => {
    log('mount', { viewerRole, title: proposal.title });
  }, [viewerRole, proposal.title]);

  return (
    <div
      className={classNames(
        'relative flex w-full max-w-[299px] flex-col overflow-hidden rounded-[10px] border border-[#00522b]/10 px-[18px] pb-[18px] pt-[24px] shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]',
        isTalentView ? 'gap-[14px]' : 'gap-[10px]',
        className
      )}
      style={{
        backgroundImage: isTalentView
          ? 'linear-gradient(135deg, #142916 0%, #2a5730 100%)'
          : 'linear-gradient(200.2415deg, #faf5f1 6.74%, #f1f7f4 17.33%)',
      }}
    >
      {/* Figma 7249:84519 / 85285 — 72.5x72.5, 14.8px above the top and 27.3px past the right edge. */}
      <ProposalWatermarkIcon
        opacity={isTalentView ? 0.25 : 0.59}
        className="pointer-events-none absolute -top-[14.8px] -right-[27.3px] size-[72.5px]"
      />
      <div className="relative flex flex-col gap-[2px]">
        <span
          className={classNames(
            'font-sans text-[12px] font-medium leading-[14.32px]',
            isTalentView ? 'text-[#fef1e7]' : 'text-[#387440]'
          )}
        >
          {proposal.label}
        </span>
        <div className="flex flex-col gap-[6px]">
          <div className={classNames('flex flex-col', isTalentView ? 'gap-[4px]' : 'gap-[2px]')}>
            <span
              className={classNames(
                'font-sans text-[16px] font-medium leading-[19.09px]',
                isTalentView ? 'text-white' : 'text-[#1c2a21]'
              )}
            >
              {proposal.title}
            </span>
            <span
              className={classNames(
                'font-sans text-[14px] leading-5 tracking-[0.2px]',
                isTalentView ? 'text-[#bfbfbf]' : 'text-[#999999]'
              )}
            >
              {proposal.company}
            </span>
          </div>
          <span
            className={classNames(
              'font-sans text-[14px] leading-5 tracking-[0.2px]',
              isTalentView ? 'text-[#c8951a]' : 'text-[#1d7c4d]'
            )}
          >
            {proposal.match}
          </span>
        </div>
      </div>
      {isTalentView ? (
        <div className="relative flex flex-col items-center gap-[6px]">
          <button
            type="button"
            onClick={() => log('branch', { action: 'view-and-apply', wired: false })}
            className="flex h-[30px] w-full items-center justify-center rounded-[8px] border-[2.07px] border-[#1c2a21]/25 bg-white px-[18px] font-sans text-[12px] font-medium leading-[14.32px] tracking-[0.1px] text-[#1c2a21] shadow-[0_3px_5px_0_rgba(255,255,255,0.2)] transition-opacity hover:opacity-90"
          >
            {proposal.talentActionLabel}
          </button>
          <span className="font-sans text-[12px] leading-[14.32px] tracking-[0.2px] text-[#959592]">
            {proposal.talentStatus}
          </span>
        </div>
      ) : (
        <span className="relative font-sans text-[12px] leading-[14.32px] tracking-[0.2px] text-[#959592]">
          {proposal.recruiterStatus}
        </span>
      )}
    </div>
  );
};

export default JobProposalCard;
