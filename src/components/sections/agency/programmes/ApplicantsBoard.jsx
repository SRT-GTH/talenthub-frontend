import { useCallback, useEffect, useState } from 'react';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import { moveApplicant, programmeApplicants } from '../../../../services/agency.api.js';
import Button from '../../../ui/Button.jsx';
import { APPLICANTS_COPY, PIPELINE_COLUMNS } from '../data/programmesData.js';
import ProgrammeSelect from './ProgrammeSelect.jsx';
import { ProgrammesIconClock, ProgrammesIconVideo } from './programmesIcons.jsx';
import { useProgrammesStore } from './useProgrammesStore.js';

const log = debug('ApplicantsBoard');

/*
 * ApplicantsBoard — "Applicants" pipeline (Figma 11.5.2d, 8597:395315): title + sentence, the required Programme select, and seven columns
 * (Applied · Screening · Shortlisted · Pitch day · Grant offered · FUNDED · not selected) that scroll sideways inside the board.
 * Server-backed: GET /agency/programmes/:id/applicants (names masked as first name + initial, match against the programme's skills, education, town);
 * each card moves on with POST /agency/programmes/:id/applicants/:appId/stage {stage} (the talent gets an in-app notice) — "Move to <next column>"
 * and "Not selected". The column counts are the agency's own operational pipeline of masked individual cards, not an aggregate, so "<5" does not apply.
 * Props: programmeId, onProgramme(id).
 */

const ORDER = ['applied', 'screening', 'shortlisted', 'pitch', 'offered', 'funded'];
const NEXT_LABEL = {
  applied: 'Move to screening',
  screening: 'Shortlist',
  shortlisted: 'Invite to pitch day',
  pitch: 'Offer the grant',
  offered: 'Mark as funded',
};

const Avatar = ({ a }) => (
  <span className="grid size-[40px] shrink-0 place-items-center rounded-full border border-solid border-[#e6e2d6]">
    <span className="grid size-[38px] place-items-center rounded-full bg-[#e6e2d6] text-[14px] leading-[17px] font-semibold text-[#1c2a21]">
      {a.initials || a.name.slice(0, 1)}
    </span>
  </span>
);

const SecondaryButton = ({ children, onClick, disabled }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className="h-[30px] w-full cursor-pointer rounded-[8px] border border-solid border-[#e5e5e5] bg-white px-[18px] font-sans text-[12px] leading-[14px] font-medium tracking-[0.1px] text-[#1c2a21] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440] disabled:cursor-default disabled:opacity-60"
  >
    {children}
  </button>
);

const ApplicantCard = ({ a, busy, onMove }) => {
  const at = ORDER.indexOf(a.stage);
  const next = at >= 0 && at < ORDER.length - 1 ? ORDER[at + 1] : null;
  return (
    <li
      className={classNames(
        'relative flex flex-col gap-[14px] rounded-[10px] border border-solid border-[#00522b]/10 bg-white p-[18px] shadow-[0_1px_2px_rgba(0,0,0,0.06)]',
        a.dim && 'opacity-65'
      )}
    >
      <Avatar a={a} />
      <div className="flex flex-col gap-[4px]">
        <span className="text-[16px] leading-[20px] font-medium text-[#152019]">{a.name}</span>
        {a.sub ? (
          <span className="text-[14px] leading-[20px] tracking-[0.2px] text-[#959592]">
            {a.sub}
          </span>
        ) : null}
      </div>
      {a.skills?.length ? (
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
        <div className="flex items-center border-0 border-t border-solid border-[#e5e5e5] pt-[12px]">
          <span className="inline-flex items-center gap-[4px] text-[13px] leading-[16px] tracking-[0.2px] text-[#959592]">
            <ProgrammesIconClock className="size-[14px]" />
            {a.ago}
          </span>
        </div>
      ) : null}
      {a.stage === 'pitch' ? (
        <div className="flex items-center gap-[8px] rounded-[8px] border-[1.2px] border-solid border-[#f7efdd] bg-[#faf4e8] px-[14px] py-[10px]">
          <ProgrammesIconVideo className="size-[16px] shrink-0 text-[#785910]" />
          <span className="text-[13px] leading-[16px] font-medium text-[#785910]">Pitch day</span>
        </div>
      ) : null}
      {next || a.stage !== 'declined' ? (
        <div className="flex flex-col gap-[6px]">
          {next ? (
            <Button
              type="button"
              variant="primary"
              size="sm"
              disabled={busy}
              onClick={() => onMove(a, next)}
              className="!w-full !rounded-[8px] !px-[18px] !py-[6px] !text-[12px] !font-medium"
            >
              {NEXT_LABEL[a.stage]}
            </Button>
          ) : null}
          {a.stage !== 'declined' && a.stage !== 'funded' ? (
            <SecondaryButton disabled={busy} onClick={() => onMove(a, 'declined')}>
              Not selected
            </SecondaryButton>
          ) : null}
        </div>
      ) : (
        <SecondaryButton disabled={busy} onClick={() => onMove(a, 'applied')}>
          Back to applied
        </SecondaryButton>
      )}
    </li>
  );
};

const ApplicantsBoard = ({ programmeId, onProgramme }) => {
  const { programmes, loading: listLoading } = useProgrammesStore();
  const [board, setBoard] = useState({ items: [], loading: false, error: '' });
  const [busyId, setBusyId] = useState(null);
  const [announce, setAnnounce] = useState('');
  const options = programmes.filter((p) => p.status !== 'draft');

  const load = useCallback(() => {
    if (!programmeId) return Promise.resolve();
    setBoard((b) => ({ ...b, loading: true, error: '' }));
    return programmeApplicants(programmeId)
      .then((res) => setBoard({ items: res?.items ?? [], loading: false, error: '' }))
      .catch((err) =>
        setBoard({
          items: [],
          loading: false,
          error: err?.response?.data?.message || err?.message || 'Could not load the applicants.',
        })
      );
  }, [programmeId]);

  useEffect(() => {
    log('mount', { programmeId });
    load();
  }, [programmeId, load]);

  const onMove = async (a, stage) => {
    setBusyId(a.id);
    try {
      await moveApplicant(programmeId, a.id, stage);
      const label = PIPELINE_COLUMNS.find((c) => c.id === stage)?.label ?? stage;
      setAnnounce(`${a.name} moved to ${label}.`);
      await load();
    } catch (err) {
      setAnnounce(err?.response?.data?.message || err?.message || 'Could not move the applicant.');
    } finally {
      setBusyId(null);
    }
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
      {options.length ? (
        <ProgrammeSelect value={programmeId ?? ''} onChange={onProgramme} options={options} large />
      ) : (
        <p className="m-0 rounded-[14px] border border-solid border-[#e6e2d6] bg-white p-[24px] text-[14px] leading-[20px] text-[#737373]">
          {listLoading
            ? 'Loading programmes…'
            : 'No published programmes yet. Applicants appear here once a programme is live.'}
        </p>
      )}
      {board.error ? (
        <p role="alert" className="m-0 text-[14px] leading-[20px] text-[#902b20]">
          {board.error}
        </p>
      ) : null}
      {announce ? (
        <p className="m-0 text-[14px] leading-[20px] text-[#387440]">{announce}</p>
      ) : null}
      {programmeId ? (
        <section aria-label="Applicant pipeline" aria-busy={board.loading} className="min-w-0">
          <div
            className="-mx-[2px] overflow-x-auto px-[2px] pb-[8px] [scrollbar-width:thin]"
            tabIndex={0}
          >
            <ul className="m-0 flex w-max list-none gap-[16px] p-0">
              {PIPELINE_COLUMNS.map((col) => {
                const cards = board.items.filter((p) => p.stage === col.id);
                const headingId = `col-${col.id}`;
                return (
                  <li key={col.id} className="w-[280px] shrink-0">
                    <section
                      aria-labelledby={headingId}
                      className="flex min-h-[480px] flex-col gap-[16px] rounded-[12px] border border-solid border-[#00522b]/10 bg-[#f3f8f4]/[0.28] px-[14px] pt-[24px] pb-[24px] max-md:min-h-[320px]"
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
                      {col.id === 'applied' && !board.loading && !board.items.length ? (
                        <p className="m-0 text-[14px] leading-[20px] text-[#959592]">
                          No applications yet.
                        </p>
                      ) : null}
                      <ul className="m-0 flex list-none flex-col gap-[12px] p-0">
                        {cards.map((a) => (
                          <ApplicantCard key={a.id} a={a} busy={busyId === a.id} onMove={onMove} />
                        ))}
                      </ul>
                    </section>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      ) : null}
      <p role="status" aria-live="polite" className="sr-only">
        {announce}
      </p>
    </div>
  );
};

export default ApplicantsBoard;
