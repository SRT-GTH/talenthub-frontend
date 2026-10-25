import { useEffect, useState } from 'react';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import Button from '../../../ui/Button.jsx';
import { APPLICANTS, APPLICANTS_COPY, PIPELINE_COLUMNS } from '../data/programmesData.js';
import ProgrammeSelect from './ProgrammeSelect.jsx';
import {
  ProgrammesIconCircleCheck,
  ProgrammesIconClock,
  ProgrammesIconHourglass,
  ProgrammesIconStarSm,
  ProgrammesIconVideo,
} from './programmesIcons.jsx';
import { useProgrammesStore } from './useProgrammesStore.js';

const log = debug('ApplicantsBoard');

/*
 * ApplicantsBoard — "Applicants" pipeline (Figma 11.5.2d, 8597:395315): title 32/600 + "Move applicants from applied to funded. Names stay masked until
 * they accept an invite.", the required Programme select, and seven columns (Applied · Screening · Shortlisted · Pitch day · Grant offered · FUNDED · not selected;
 * 280 wide, gap 16, #f3f8f4 at 28 %, 1px rgba(0,82,43,.1), r12, p 24/14) that scroll sideways inside the board (the page itself never scrolls sideways).
 * Cards (250 wide, r10, p18): avatar initials + name + "Match 91% • BSc · Accra" + skill pills + "2h ago" and the rating; "Next: eligibility call" box;
 * "Invite to pitch day"; pitch cards with a status box (amber waiting / red missed / green pitched) and the actions; funded / not selected cards are plain.
 * Names are masked first name + initial. The column counts ("01" ... "03") are drawn as digits: this is the agency's own operational pipeline of masked
 * individual cards, not an aggregate, so the "<5" rule does not apply to it (listed in the report).
 * ⚠️ ASSUMPTIONS: "Invite to pitch day" moves the applicant to the Pitch day column ("Pitch day · Accra hub", date to be set); "Mark as attended" turns a missed pitch
 * into a pitched card; Reschedule / View details / View scores log only (their dialogs are not drawn). The board is local mock state.
 * Props: programmeId, onProgramme(id), programmes (options), standalone (the /agency/applicants page).
 */

const AVATAR_FALLBACK = '#e6e2d6';

const Avatar = ({ a }) => (
  <span className="grid size-[40px] shrink-0 place-items-center rounded-full border border-solid border-[#e6e2d6]">
    <span
      className="grid size-[38px] place-items-center rounded-full text-[14px] leading-[17px] font-semibold text-[#1c2a21]"
      style={{ background: a.tint ?? AVATAR_FALLBACK }}
    >
      {a.initials ?? a.name.slice(0, 1)}
    </span>
  </span>
);

const PITCH_TONES = {
  amber: { box: 'border-[#f7efdd] bg-[#faf4e8]', icon: 'text-[#785910]', title: 'text-[#785910]' },
  red: { box: 'border-[#f6e1df] bg-[#f9ebea]', icon: 'text-[#902b20]', title: 'text-[#902b20]' },
  green: { box: 'border-[#e1eae2] bg-[#ebf1ec]', icon: 'text-[#224626]', title: 'text-[#224626]' },
};

const SecondaryButton = ({ children, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="h-[30px] w-full cursor-pointer rounded-[8px] border border-solid border-[#e5e5e5] bg-white px-[18px] font-sans text-[12px] leading-[14px] font-medium tracking-[0.1px] text-[#1c2a21] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
  >
    {children}
  </button>
);

const PrimaryButton = ({ children, onClick }) => (
  <Button
    type="button"
    variant="primary"
    size="sm"
    onClick={onClick}
    className="!w-full !rounded-[8px] !px-[18px] !py-[6px] !text-[12px] !font-medium"
  >
    {children}
  </Button>
);

const ApplicantCard = ({ a, onInvite, onAttended }) => {
  const pitch = a.pitch ? PITCH_TONES[a.pitch.tone] : null;
  return (
    <li
      className={classNames(
        'relative flex flex-col gap-[14px] rounded-[10px] border border-solid border-[#00522b]/10 bg-white p-[18px] shadow-[0_1px_2px_rgba(0,0,0,0.06)]',
        a.dim && 'opacity-65'
      )}
    >
      {a.badge ? (
        <span
          aria-hidden="true"
          className={classNames(
            'absolute top-[-7px] right-[-10px] grid size-[24px] place-items-center rounded-full',
            a.badge === 'hourglass' && 'bg-[#967014] text-white',
            a.badge === 'alert' &&
              'bg-[#b23b3b] text-[10px] font-bold text-white max-lg:text-[12px]',
            a.badge === 'done' && 'bg-white text-[#387440]'
          )}
        >
          {a.badge === 'hourglass' ? <ProgrammesIconHourglass className="size-[24px]" /> : null}
          {a.badge === 'alert' ? '!' : null}
          {a.badge === 'done' ? <ProgrammesIconCircleCheck className="size-[24px]" /> : null}
        </span>
      ) : null}
      {a.initials ? <Avatar a={a} /> : null}
      <div className="flex flex-col gap-[4px]">
        <span className="text-[16px] leading-[20px] font-medium text-[#152019]">{a.name}</span>
        <span
          className={classNames(
            'text-[14px] leading-[20px] tracking-[0.2px]',
            a.subTone === 'amber' ? 'text-[#967014]' : 'text-[#959592]'
          )}
        >
          {a.sub}
        </span>
      </div>
      {a.skills ? (
        <ul className="m-0 flex list-none flex-wrap gap-[4px] p-0">
          {a.skills.map((s) => (
            <li
              key={s}
              className="rounded-[8px] bg-[#f3f8f4] px-[10px] py-[6px] text-[12px] leading-[14px] font-medium text-[#2a5730]"
            >
              {s}
            </li>
          ))}
        </ul>
      ) : null}
      {a.ago ? (
        <div className="flex items-center justify-between border-0 border-t border-solid border-[#e5e5e5] pt-[12px]">
          <span className="inline-flex items-center gap-[4px] text-[13px] leading-[16px] tracking-[0.2px] text-[#bfbfbf]">
            <ProgrammesIconClock className="size-[14px]" />
            {a.ago}
          </span>
          <span className="inline-flex items-center gap-[4px] text-[13px] leading-[15px] font-semibold text-[#1c2a21]">
            <ProgrammesIconStarSm className="h-[11px] w-[12px] text-[#f59e0b]" />
            {a.rating}
          </span>
        </div>
      ) : null}
      {a.next ? (
        <div className="flex flex-col gap-[6px] rounded-[8px] bg-[#ebf1ec] px-[14px] py-[10px]">
          <span className="text-[12px] leading-[14px] font-medium text-[#224626]">
            {a.next.title}
          </span>
          <span className="text-[14px] leading-[20px] tracking-[0.2px] text-[#959592]">
            {a.next.when}
          </span>
        </div>
      ) : null}
      {a.invite ? <PrimaryButton onClick={onInvite}>{a.invite}</PrimaryButton> : null}
      {pitch ? (
        <div className="flex flex-col gap-[8px]">
          <div
            className={classNames(
              'flex items-center gap-[8px] rounded-[8px] border-[1.2px] border-solid px-[14px] py-[10px]',
              pitch.box
            )}
          >
            <ProgrammesIconVideo className={classNames('size-[16px] shrink-0', pitch.icon)} />
            <div className="flex flex-col gap-[4px]">
              <span className={classNames('text-[13px] leading-[16px] font-medium', pitch.title)}>
                {a.pitch.title}
              </span>
              <span className="text-[14px] leading-[17px] tracking-[0.2px] text-[#737373]">
                {a.pitch.place}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-[6px]">
            {a.secondary ? (
              <SecondaryButton onClick={() => log('not drawn:', a.secondary, a.id)}>
                {a.secondary}
              </SecondaryButton>
            ) : null}
            {a.primary ? <PrimaryButton onClick={onAttended}>{a.primary}</PrimaryButton> : null}
          </div>
        </div>
      ) : null}
    </li>
  );
};

const ApplicantsBoard = ({ programmeId, onProgramme }) => {
  const { programmes } = useProgrammesStore();
  const [people, setPeople] = useState(APPLICANTS);
  const [announce, setAnnounce] = useState('');

  useEffect(() => {
    log('mount', { programmeId, count: people.length });
  }, [programmeId, people.length]);

  const invite = (id) => {
    setPeople((list) =>
      list.map((p) =>
        p.id === id
          ? {
              ...p,
              stage: 'pitch',
              sub: 'Date to be set',
              invite: null,
              skills: null,
              pitch: { tone: 'amber', title: 'Pitch day', place: 'Accra hub' },
              secondary: 'View details',
              badge: 'hourglass',
            }
          : p
      )
    );
    setAnnounce('Invited to pitch day.');
  };

  const attended = (id) => {
    setPeople((list) =>
      list.map((p) =>
        p.id === id
          ? {
              ...p,
              pitch: { tone: 'green', title: 'Pitched', place: p.pitch.place },
              primary: null,
              secondary: 'View scores',
              badge: 'done',
            }
          : p
      )
    );
    setAnnounce('Marked as attended.');
  };

  return (
    <div className="flex min-w-0 flex-col gap-[28px] font-sans">
      <header className="flex flex-col gap-[3px]">
        <h1 className="m-0 text-[28px] leading-[36px] font-semibold tracking-[-0.16px] text-[#1c2a21] md:text-[32px] md:leading-[40px]">
          {APPLICANTS_COPY.title}
        </h1>
        <p className="m-0 text-[16px] leading-[24px] tracking-[0.2px] text-[#999999]">
          {APPLICANTS_COPY.sentence}
        </p>
      </header>
      <ProgrammeSelect value={programmeId} onChange={onProgramme} options={programmes} large />
      <section aria-label="Applicant pipeline" className="min-w-0">
        <div
          className="-mx-[2px] overflow-x-auto px-[2px] pb-[8px] [scrollbar-width:thin]"
          tabIndex={0}
        >
          <ul className="m-0 flex w-max list-none gap-[16px] p-0">
            {PIPELINE_COLUMNS.map((col) => {
              const cards = people.filter((p) => p.stage === col.id);
              const headingId = `col-${col.id}`;
              return (
                <li key={col.id} className="w-[280px] shrink-0">
                  <section
                    aria-labelledby={headingId}
                    className="flex min-h-[930px] max-md:min-h-[320px] flex-col gap-[16px] rounded-[12px] border border-solid border-[#00522b]/10 bg-[#f3f8f4]/[0.28] px-[14px] pt-[24px] pb-[24px]"
                  >
                    <div className="flex items-center justify-between">
                      <h2
                        id={headingId}
                        className="m-0 text-[16px] leading-[20px] font-semibold text-[#1c2a21]"
                      >
                        {col.label}
                      </h2>
                      <span className="rounded-full border-[1.2px] border-solid border-[#00522b]/10 bg-white px-[8px] py-[6px] text-[14px] leading-[17px] font-medium text-[#737373]">
                        {String(cards.length).padStart(2, '0')}
                      </span>
                    </div>
                    <ul className="m-0 flex list-none flex-col gap-[12px] p-0">
                      {cards.map((a) => (
                        <ApplicantCard
                          key={a.id}
                          a={a}
                          onInvite={() => invite(a.id)}
                          onAttended={() => attended(a.id)}
                        />
                      ))}
                    </ul>
                  </section>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
      <p role="status" aria-live="polite" className="sr-only">
        {announce}
      </p>
    </div>
  );
};

export default ApplicantsBoard;
