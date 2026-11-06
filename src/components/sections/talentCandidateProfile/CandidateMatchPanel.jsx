import { useState } from 'react';
import Chip from '../../ui/Chip.jsx';
import Select from '../../ui/form/Select.jsx';
import Textarea from '../../ui/form/Textarea.jsx';
import { ArrowheadDownIcon } from '../../shared/assets.jsx';
import ProfileCard from './ProfileCard.jsx';
import { EyeIcon } from './talentCandidateProfileIcons.jsx';
import { JOBS, PROFILE_COPY } from './talentCandidateProfileData.js';
import { debug } from '../../../utils/debug.js';

const log = debug('CandidateMatchPanel');

/*
 * CandidateMatchPanel — the right column of the profile: the green Match card (Figma "Match" 10102:41711), Availability and preferences (10102:41732), Your history with <name> (10102:41749) and Private notes (10102:41755).
 * Props: candidate, jobId (the job the match card is for), historyLine (the first line of the history card, changes with the invite / pipeline state), onJobChange.
 * ⚠️ ASSUMPTION: the job dropdown lists only the job the match is computed for (one option per candidate); Figma draws a closed dropdown and no menu.
 */
const LABEL = 'font-sans text-[12px] leading-[20px] font-semibold tracking-[0.2px] text-[#575755]';

const CandidateMatchPanel = ({ candidate, jobId, historyLine, onJobChange }) => {
  const { match, availability, history } = candidate;
  const [note, setNote] = useState('');
  const jobOptions = JOBS.filter((job) => job.id === match.jobId).map((job) => ({
    value: job.id,
    label: job.title,
  }));
  log('render', {
    candidate: candidate.id,
    jobId,
    percent: match.percent,
    noteLength: note.length,
  });

  return (
    <>
      <section
        aria-label="Match"
        className="flex min-w-0 flex-col gap-[12px] rounded-[16px] bg-[#2a5730] p-[24px] shadow-[0_1px_2px_rgba(15,15,10,0.05),0_6px_16px_-4px_rgba(15,15,10,0.07)] max-sm:p-[16px]"
      >
        <div className="flex h-[28px] items-center justify-between gap-[12px]">
          <h2 className="m-0 font-sans text-[12px] leading-[20px] font-semibold tracking-[0.2px] text-white">
            {PROFILE_COPY.matchFor}
          </h2>
          <span className="inline-flex h-[28px] items-center rounded-full border border-solid border-[#dbded9] bg-white px-[8px] font-sans text-[12px] leading-[20px] font-medium tracking-[0.2px] text-[#111]">
            {match.verdict}
          </span>
        </div>
        <div className="lg:pt-[29px] lg:pb-[23px]">
          <Select
            verified
            chevronIcon={<ArrowheadDownIcon className="size-[20px] text-[#387440]" />}
            aria-label={PROFILE_COPY.matchFor}
            options={jobOptions}
            value={jobId}
            onChange={(value) => onJobChange?.(value)}
          />
        </div>
        <p className="m-0 font-heading text-[56px] leading-[67px] font-semibold tracking-[-1.12px] text-white max-sm:text-[44px] max-sm:leading-[54px]">
          {match.percent}%
        </p>
        <dl className="m-0 flex flex-col gap-[10px] rounded-[16px] bg-[#387440] p-[16px]">
          {match.rows.map((row) => (
            <div key={row.id} className="flex items-center justify-between gap-[12px]">
              <dt className="font-sans text-[14px] leading-[24px] tracking-[0.2px] text-white">
                {row.label}
              </dt>
              <dd className="m-0 text-right font-sans text-[14px] leading-[24px] font-semibold tracking-[0.1px] text-[#c8951a]">
                {row.value}
              </dd>
            </div>
          ))}
        </dl>
        <p className="m-0 font-sans text-[12px] leading-[20px] tracking-[0.2px] text-white">
          {match.note}
        </p>
      </section>

      <ProfileCard as="section" gapClassName="gap-[10px]" aria-label="Availability and preferences">
        <h2 className={`m-0 ${LABEL}`}>{PROFILE_COPY.availabilityHeading}</h2>
        <dl className="m-0 flex flex-col gap-[10px]">
          {availability.map((row) => (
            <div key={row.id} className="flex items-center justify-between gap-[12px]">
              <dt className="font-sans text-[12px] leading-[20px] tracking-[0.2px] text-[#575755]">
                {row.label}
              </dt>
              <dd className="m-0 text-right font-sans text-[12px] leading-[20px] font-medium tracking-[0.2px] text-[#111]">
                {row.value}
              </dd>
            </div>
          ))}
        </dl>
      </ProfileCard>

      <ProfileCard as="section" gapClassName="gap-[10px]" aria-label={history.heading}>
        <h2 className={`m-0 ${LABEL}`}>{history.heading}</h2>
        <p className="m-0 font-sans text-[12px] leading-[20px] tracking-[0.2px] text-[#111]">
          {historyLine}
        </p>
        <Chip tone="neutral" className="self-start">
          <EyeIcon className="size-[12px] shrink-0" />
          {history.viewedBy}
        </Chip>
      </ProfileCard>

      <ProfileCard as="section" gapClassName="gap-[10px]" aria-label="Private notes">
        <h2 className={`m-0 ${LABEL}`}>{PROFILE_COPY.privateNotesHeading}</h2>
        <Textarea
          rows={1}
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder={PROFILE_COPY.privateNotesPlaceholder}
          aria-label="Private note for your team"
          boxClassName="!min-h-[70px] !rounded-[10px] !border !border-[#dbded9] !bg-white !shadow-[0_3px_0_0_rgba(34,70,38,0.8)]"
          textareaClassName="!resize-none !px-[16px] !py-[12px] !leading-[24px] placeholder:!text-[#babab7]"
        />
      </ProfileCard>
    </>
  );
};

export default CandidateMatchPanel;
