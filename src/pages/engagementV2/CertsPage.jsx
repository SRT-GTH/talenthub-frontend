import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { debug } from '../../utils/debug.js';
import Button from '../../components/ui/Button.jsx';
import EngagementStageFrame from '../../components/sections/engagementShell/EngagementStageFrame.jsx';
import {
  ENGAGEMENT_STAGES,
  STAGE_BY_ID,
} from '../../components/sections/engagementShell/engagementShellData.js';
import {
  AddRow,
  EmptyState,
  EntryCard,
  ExampleCard,
  HEADING,
  Hero,
  Rail,
} from '../../components/sections/engagementV2/certs/CertsParts.jsx';
import {
  CertFormDialog,
  CompleteDialog,
  DeleteDialog,
} from '../../components/sections/engagementV2/certs/CertsDialogs.jsx';
import {
  COMPLETE_STATS,
  EXAMPLE_CERT,
  MOCK_CERTS,
  SAMPLE_REMINDER,
  buildCert,
  countStatuses,
  parseMonthYear,
} from '../../components/sections/engagementV2/certs/certsData.js';
import { useCertsState } from '../../components/sections/engagementV2/certs/certsState.js';

const log = debug('CertsPage');

/*
 * CertsPage — Engagement stage 7 "Certifications" (Figma CE-01..CE-06; Focused 8285:17367.. / Playful 7712:2..).
 * URL contract: see certsState.js. Mock data lives in certsData.js (in memory; a refresh restarts from the URL).
 */
const DONE_BEFORE = ENGAGEMENT_STAGES.slice(0, 6).map((s) => s.id);

const plural = (n, one, many) => (n === 1 ? one : many);

const CertsPage = () => {
  const navigate = useNavigate();
  const url = useCertsState();
  const [certs, setCerts] = useState(() => {
    const seeded = url.state || url.modal ? MOCK_CERTS : [];
    log('mount', { state: url.state, modal: url.modal, seeded: seeded.length });
    return seeded;
  });

  const empty = certs.length === 0;
  const counts = countStatuses(certs);
  const goals = STAGE_BY_ID.goals;
  const portfolio = STAGE_BY_ID.portfolio;

  const editTarget = url.modal === 'edit' ? certs.find((c) => c.id === (url.id ?? 'gda')) : null;
  const deleteTarget =
    url.modal === 'delete' ? certs.find((c) => c.id === (url.id ?? 'aws')) : null;
  const showAdd = url.modal === 'add';
  const showComplete = url.state === 'complete' && !empty;
  log('render', { empty, count: certs.length, modal: url.modal, state: url.state });

  const withExpiry = certs.find((c) => parseMonthYear(c.expiryDate));
  const reminder = empty
    ? SAMPLE_REMINDER
    : withExpiry
      ? {
          title: withExpiry.title,
          text: `Expires ${parseMonthYear(withExpiry.expiryDate).label}. We’ll remind you 60 days before.`,
        }
      : null;

  const closeModal = () => url.update({ modal: null, id: null });
  const sticker = empty
    ? 'STAGE 7 · PROVE IT'
    : `${counts.verified} VERIFIED · ${counts.pending} PENDING`;

  const save = (form) => {
    if (showAdd) {
      const next = buildCert(form, null);
      log('add', next.id);
      setCerts((list) => [...list, next]);
    } else if (editTarget) {
      log('edit', editTarget.id);
      setCerts((list) => list.map((c) => (c.id === editTarget.id ? buildCert(form, c) : c)));
    }
    url.update({ modal: null, id: null, state: 'list' });
  };

  const remove = () => {
    log('delete', deleteTarget.id);
    setCerts((list) => list.filter((c) => c.id !== deleteTarget.id));
    url.update({ modal: null, id: null, state: 'list' });
  };

  const summary = `${certs.length} ${plural(certs.length, 'certificate', 'certificates')}: ${counts.verified} verified, ${counts.pending} being checked and ${counts.self} self-reported. Recruiters can now filter by your credentials.`;

  return (
    <EngagementStageFrame
      stageId="certs"
      doneIds={DONE_BEFORE}
      footer={{
        skipLabel: null,
        continueLabel: 'Next: Goals',
        disabled: empty,
        onContinue: () => url.update({ state: 'complete' }),
        left: (
          <Button variant="tertiary-subtle" size="lg" onClick={() => navigate(portfolio.route)}>
            Back: Portfolio
          </Button>
        ),
      }}
    >
      <Hero sticker={sticker} />
      <div className="grid grid-cols-1 gap-x-[clamp(24px,3.7vw,64px)] gap-y-8 px-4 pt-6 pb-[50px] md:px-[clamp(20px,3.7vw,64px)] lg:grid-cols-[minmax(0,1072fr)_minmax(0,464fr)] lg:pt-[40px]">
        <div className="flex min-w-0 flex-col gap-[20px]">
          {empty ? (
            <>
              <EmptyState
                onUpload={() => url.update({ modal: 'add' })}
                onManual={() => url.update({ modal: 'add' })}
                onSkip={() => navigate(goals.route)}
              />
              <p className="m-0 mt-0 font-sans text-[11px] leading-[13px] font-bold tracking-[1.2px] text-[#595959] max-lg:text-[12px]">
                WHAT A VERIFIED CERTIFICATE LOOKS LIKE
              </p>
              <ExampleCard cert={EXAMPLE_CERT} />
            </>
          ) : (
            <>
              <div className="flex flex-wrap items-center gap-[12px]">
                <h2
                  className={`m-0 font-sans text-[clamp(24px,1.68vw,29px)] leading-[1.2] font-semibold text-[#1c2a21] ${HEADING}`}
                >
                  Your certifications
                </h2>
                <span className="inline-flex items-center rounded-full border border-solid border-[rgba(28,42,33,0.1)] bg-[#f7f8f4] px-[10px] py-[4px] font-sans text-[12px] leading-[14px] font-semibold text-[#595959] playful:border-[rgba(28,42,33,0.35)]">
                  {certs.length} {plural(certs.length, 'certificate', 'certificates')}
                </span>
              </div>
              {certs.map((c) => (
                <EntryCard
                  key={c.id}
                  cert={c}
                  onEdit={() => url.update({ modal: 'edit', id: c.id })}
                />
              ))}
              <AddRow
                onUpload={() => url.update({ modal: 'add' })}
                onManual={() => url.update({ modal: 'add' })}
              />
            </>
          )}
        </div>
        <Rail reminder={reminder} />
      </div>

      {showAdd ? <CertFormDialog key="add" mode="add" onClose={closeModal} onSave={save} /> : null}
      {editTarget ? (
        <CertFormDialog
          key={`edit-${editTarget.id}`}
          mode="edit"
          cert={editTarget}
          onClose={closeModal}
          onSave={save}
          onDelete={() => url.update({ modal: 'delete', id: editTarget.id })}
        />
      ) : null}
      {deleteTarget ? (
        <DeleteDialog
          cert={deleteTarget}
          onClose={closeModal}
          onEditInstead={() => url.update({ modal: 'edit', id: deleteTarget.id })}
          onConfirm={remove}
        />
      ) : null}
      {showComplete ? (
        <CompleteDialog
          summary={summary}
          earnedLabels={{
            focused: COMPLETE_STATS.earnedFocused,
            playful: COMPLETE_STATS.earnedPlayful,
          }}
          onClose={() => url.update({ state: 'list' })}
          onStay={() => url.update({ state: 'list' })}
          onNext={() => navigate(goals.route)}
        />
      ) : null}
    </EngagementStageFrame>
  );
};

export default CertsPage;
