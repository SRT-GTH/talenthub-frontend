import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import Button from '../../../ui/Button.jsx';
import {
  apiMessage,
  moveProgrammeApplicant,
  programmeApplicants,
} from '../../../../services/institutionPortal.api.js';
import { APPLICANTS_COPY, PIPELINE_COLUMNS, nextStep } from './data/programmesData.js';
import ProgrammeSelect from './ProgrammeSelect.jsx';
import { ProgrammesIconClock } from './programmesIcons.jsx';
import { loadProgrammes, useProgrammesStore } from './useProgrammesStore.js';

const log = debug('ApplicantsBoard');

/*
 * ApplicantsBoard — "Applicants" board (Figma 11.3.1d, 8597:395315): title + "Move students from signed up to completed. They’re your students, so you see
 * their names.", the required Programme select, and seven columns (Signed up · Guardian OK · Confirmed · Session 1 · Attending · Completed · Withdrawn;
 * 280 wide, gap 16, #f3f8f4 at 28 %, 1px rgba(0,82,43,.1), r12, p 24/14) that scroll sideways inside the board.
 * Live: GET /api/institution/programmes/:id/applicants (the school's own students who signed up from their GTH feed, by name, with their form, programme
 * of study and guardian state). Each card's button moves the student to the next column (POST .../applicants/:appId/stage; the student gets an in-app
 * notice and the move is logged); "Withdraw" moves them out, "Put back" returns a withdrawn student. An under-18 can only pass "Guardian OK" once their
 * guardian agreed on the roster. The column counts are the school's own operational list, not an aggregate, so they are plain digits.
 * Props: programmeId, onProgramme(id).
 */

const Avatar = ({ initials }) => (
  <span className="grid size-[40px] shrink-0 place-items-center rounded-full border border-solid border-[#e6e2d6]">
    <span className="grid size-[38px] place-items-center rounded-full bg-[#ebf1ec] text-[14px] leading-[17px] font-semibold text-[#1c2a21]">
      {initials || '·'}
    </span>
  </span>
);

const SecondaryButton = ({ children, onClick, disabled }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className="h-[30px] w-full cursor-pointer rounded-[8px] border border-solid border-[#e5e5e5] bg-white px-[18px] font-sans text-[12px] leading-[14px] font-medium tracking-[0.1px] text-[#1c2a21] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440] disabled:cursor-not-allowed disabled:opacity-50"
  >
    {children}
  </button>
);

const ApplicantCard = ({ a, busy, onMove }) => {
  const next = nextStep(a);
  const done = a.stage === 'completed';
  const out = a.stage === 'withdrawn';
  return (
    <li
      className={classNames(
        'relative flex flex-col gap-[14px] rounded-[10px] border border-solid border-[#00522b]/10 bg-white p-[18px] shadow-[0_1px_2px_rgba(0,0,0,0.06)]',
        out && 'opacity-65'
      )}
    >
      <div className="flex items-center gap-[12px]">
        <Avatar initials={a.initials} />
        <div className="flex min-w-0 flex-col gap-[4px]">
          {a.rosterId ? (
            <Link
              to={`/institution/progress/students/${a.rosterId}`}
              className="text-[16px] leading-[20px] font-medium text-[#152019] no-underline hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
            >
              {a.name}
            </Link>
          ) : (
            <span className="text-[16px] leading-[20px] font-medium text-[#152019]">{a.name}</span>
          )}
          <span className="text-[14px] leading-[20px] tracking-[0.2px] text-[#959592]">
            {a.sub}
          </span>
        </div>
      </div>
      {a.tags?.length ? (
        <ul className="m-0 flex list-none flex-wrap gap-[4px] p-0">
          {a.tags.map((s) => (
            <li
              key={s}
              className={classNames(
                'rounded-[8px] px-[10px] py-[6px] text-[12px] leading-[14px] font-medium',
                s === 'Guardian pending'
                  ? 'bg-[#faf4e8] text-[#785910]'
                  : 'bg-[#f3f8f4] text-[#2a5730]'
              )}
            >
              {s}
            </li>
          ))}
        </ul>
      ) : null}
      {a.ago ? (
        <span className="inline-flex items-center gap-[4px] border-0 border-t border-solid border-[#e5e5e5] pt-[12px] text-[13px] leading-[16px] tracking-[0.2px] text-[#8c8c8c]">
          <ProgrammesIconClock className="size-[14px]" />
          {a.ago}
        </span>
      ) : null}
      {done ? (
        <span className="rounded-[8px] bg-[#ebf1ec] px-[14px] py-[10px] text-[13px] leading-[16px] font-medium text-[#224626]">
          Completed the programme
        </span>
      ) : null}
      <div className="flex flex-col gap-[6px]">
        {next ? (
          <Button
            type="button"
            variant="primary"
            size="sm"
            disabled={busy || next.disabled}
            onClick={() => onMove(a, next.to)}
            className="!w-full !rounded-[8px] !px-[18px] !py-[6px] !text-[12px] !font-medium"
          >
            {next.label}
          </Button>
        ) : null}
        {out ? (
          <SecondaryButton disabled={busy} onClick={() => onMove(a, 'signed-up')}>
            Put back
          </SecondaryButton>
        ) : !done ? (
          <SecondaryButton disabled={busy} onClick={() => onMove(a, 'withdrawn')}>
            Withdraw
          </SecondaryButton>
        ) : null}
      </div>
    </li>
  );
};

const ApplicantsBoard = ({ programmeId, onProgramme }) => {
  const { programmes } = useProgrammesStore();
  const [board, setBoard] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(null);
  const [announce, setAnnounce] = useState('');

  const load = useCallback(async () => {
    setError('');
    try {
      const res = await programmeApplicants(programmeId);
      setBoard(res);
      log('loaded', { programmeId, count: res.items?.length });
    } catch (err) {
      setError(apiMessage(err));
    }
  }, [programmeId]);

  useEffect(() => {
    setBoard(null);
    load();
  }, [load]);

  const move = async (a, stage) => {
    setBusy(a.id);
    setAnnounce('');
    try {
      await moveProgrammeApplicant(programmeId, a.id, stage);
      await load();
      loadProgrammes(true);
      const label = PIPELINE_COLUMNS.find((c) => c.id === stage)?.label ?? stage;
      setAnnounce(`${a.name} moved to ${label}.`);
    } catch (err) {
      setAnnounce(apiMessage(err));
    } finally {
      setBusy(null);
    }
  };

  const options = programmes.filter((p) => p.status !== 'draft' && !p.isTemplate);
  const items = board?.items ?? [];

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
      <ProgrammeSelect
        value={programmeId}
        onChange={onProgramme}
        options={
          options.some((p) => p.id === programmeId) || !board
            ? options
            : [{ id: programmeId, optionLabel: board.programme.title }, ...options]
        }
        large
      />
      {error ? (
        <p role="alert" className="m-0 text-[14px] leading-[20px] text-[#902b20]">
          {error}
        </p>
      ) : null}
      {announce ? (
        <p
          role="status"
          className="m-0 rounded-[12px] border border-solid border-[#e1eae2] bg-[#f3f8f4] px-[16px] py-[12px] text-[14px] leading-[20px] text-[#224626]"
        >
          {announce}
        </p>
      ) : null}
      {board && !items.length ? (
        <p className="m-0 rounded-[14px] border border-solid border-[#e6e2d6] bg-white p-[20px] text-[14px] leading-[20px] text-[#737373]">
          {APPLICANTS_COPY.empty}
        </p>
      ) : null}
      <section aria-label="Applicant pipeline" className="min-w-0">
        <div
          className="-mx-[2px] overflow-x-auto px-[2px] pb-[8px] [scrollbar-width:thin]"
          tabIndex={0}
        >
          <ul className="m-0 flex w-max list-none gap-[16px] p-0">
            {PIPELINE_COLUMNS.map((col) => {
              const cards = items.filter((p) => p.stage === col.id);
              const headingId = `col-${col.id}`;
              return (
                <li key={col.id} className="w-[280px] shrink-0">
                  <section
                    aria-labelledby={headingId}
                    className="flex min-h-[420px] flex-col gap-[16px] rounded-[12px] border border-solid border-[#00522b]/10 bg-[#f3f8f4]/[0.28] px-[14px] pt-[24px] pb-[24px] max-md:min-h-[320px]"
                  >
                    <div className="flex items-center justify-between">
                      <h2
                        id={headingId}
                        className="m-0 text-[16px] leading-[20px] font-semibold text-[#1c2a21]"
                      >
                        {col.label}
                      </h2>
                      <span className="rounded-full border-[1.2px] border-solid border-[#00522b]/10 bg-white px-[8px] py-[6px] text-[14px] leading-[17px] font-medium text-[#737373]">
                        {board ? String(cards.length).padStart(2, '0') : '··'}
                      </span>
                    </div>
                    <ul className="m-0 flex list-none flex-col gap-[12px] p-0">
                      {cards.map((a) => (
                        <ApplicantCard key={a.id} a={a} busy={busy === a.id} onMove={move} />
                      ))}
                    </ul>
                  </section>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </div>
  );
};

export default ApplicantsBoard;
