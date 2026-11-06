import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../../ui/Button.jsx';
import BannerToast from '../../ui/BannerToast.jsx';
import InlineState from '../../ui/InlineState.jsx';
import DashboardShell from '../dashboard/DashboardShell.jsx';
import WorkspaceSidebar from '../recruiterDashboard/WorkspaceSidebar.jsx';
import useScopedRoundedFont from '../../../hooks/useScopedRoundedFont.js';
import CandidateProfileHeader from './CandidateProfileHeader.jsx';
import CandidateProfileBody from './CandidateProfileBody.jsx';
import CandidateMatchPanel from './CandidateMatchPanel.jsx';
import { InviteDialog, PipelineDialog } from './CandidateDialogs.jsx';
import useCandidateProfileState from './useCandidateProfileState.js';
import { BackArrowIcon, ChevronRightIcon } from './talentCandidateProfileIcons.jsx';
import {
  CANDIDATES,
  DEFAULT_JOB_ID,
  INVITE_ALLOWANCE,
  INVITE_SENT,
  JOBS,
  PIPELINE_DIALOG,
  PIPELINE_STAGES,
  PROFILE_COPY,
  SAVE_LISTS,
  SAVE_MENU,
} from './talentCandidateProfileData.js';
import photoKofiAmankwah from '../../../assets/recruiter/talent-search/candidate-photo-kofi-amankwah.webp';
import photoAmaBoateng from '../../../assets/recruiter/talent-search/candidate-photo-ama-boateng.webp';
import { debug } from '../../../utils/debug.js';

const log = debug('TalentCandidateProfileSection');

/*
 * TalentCandidateProfileSection — the recruiter candidate profile `/recruiter/talent-search/:candidateId` (Figma file OHG2xsfCCskT8xEn356njv, page "Recruiter - Talent Search", frames TS-11 … TS-19).
 * Opened from a result card's "View profile" (ids kofi-amankwah, ama-boateng) and from "Invite to apply" on a card (`?modal=invite`). Chrome: DashboardShell with the workspace rail (`WorkspaceSidebar`).
 * Left column: header card, About, Skills, Experience, Portfolio, Education. Right column (400px): Match, Availability and preferences, Your history, Private notes. Below `xl` the right column sits under the header, in one column.
 *
 * URL STATE (query string; reload / deep link / Back work; clicking writes the same keys)
 *   /recruiter/talent-search/kofi-amankwah                                 TS-11 10102:41537  the profile, nothing open
 *   …?modal=invite                                                          TS-12 10102:41967  "Invite Kofi to apply" dialog
 *   …?invited=senior-product-engineer&toast=invite-sent                     TS-13 10102:42428  invite sent: "Invited · …" button, "17 of 50 invites left", history line, success toast
 *   …?menu=save                                                             TS-14 10102:42870  "Save to a list" popover (first list preselected, ⚠️ ASSUMPTION)
 *   …?saved=job-shortlist&toast=saved                                       TS-15 10102:43324  "Saved" button + "Saved to “…”" toast
 *   …?menu=more                                                             TS-16 10102:43766  overflow menu
 *   …?modal=pipeline                                                        TS-17 10102:44219  "Add Kofi to a pipeline" dialog
 *   …?pipeline=shortlisted&toast=pipeline-added                             TS-18 10102:44676  added: history line + toast
 *   /recruiter/talent-search/ama-boateng                                    TS-19 10102:45118  applicant profile (Senior UX Designer)
 *   job=<jobId>  (optional) the job the match card is for; the list sends ?job=senior-product-engineer. Candidates keep their own match job (ama-boateng: senior-ux-designer).
 * Toast closing (button, timer or its action) removes `toast`. `invited` / `saved` / `pipeline` stay, so a reload shows the result without the toast.
 * Not drawn in Figma (⚠️ ASSUMPTION / not built): a profile for godfred-ansah or an unknown id (a "not available" state with a way back is shown); a menu for the applicant's "⋯" (the button logs only);
 * "Move to stage", "Share with my team", "Hide from my searches", "Report profile", "New list…" and the "2 of 12" next chevron (log only); "Copy profile link" copies the page URL, no toast is drawn.
 * Navigation: Back → /recruiter/talent-search?job=… (applicant: /recruiter/messages), Message and "Open Conversation" → /recruiter/messages, "View in Pipeline" → /recruiter/application-pipeline.
 */
const PHOTOS = { 'kofi-amankwah': photoKofiAmankwah, 'ama-boateng': photoAmaBoateng };

const TOAST_PLACEMENT =
  'fixed top-[22px] left-1/2 z-[70] max-w-[calc(100vw-32px)] -translate-x-1/2 max-md:top-[72px]';

const findJob = (id) => JOBS.find((job) => job.id === id) ?? JOBS[0];

const TalentCandidateProfileSection = () => {
  // Figma draws the recruiter pages in SF Pro Rounded.
  useScopedRoundedFont('data-recruiter-ui');
  const navigate = useNavigate();
  const { candidateId } = useParams();
  const { get, set } = useCandidateProfileState();
  const candidate = CANDIDATES[candidateId];

  const modal = get('modal');
  const menu = get('menu');
  const invited = get('invited');
  const savedListId = get('saved');
  const pipelineStage = get('pipeline');
  const toast = get('toast');

  useEffect(() => {
    log('mount', { candidateId, found: Boolean(candidate), kind: candidate?.kind });
  }, [candidateId, candidate]);

  useEffect(() => {
    log('state', { modal, menu, invited, savedListId, pipelineStage, toast });
  }, [modal, menu, invited, savedListId, pipelineStage, toast]);

  const shell = (children) => (
    <DashboardShell
      renderSidebar={({ collapsed, onToggle }) =>
        collapsed ? null : <WorkspaceSidebar onToggle={onToggle} />
      }
    >
      <div className="flex w-full flex-col gap-[24px] pt-[32px] pb-[16px] pl-[clamp(16px,2.3vw,40px)] pr-[clamp(16px,3.24vw,56px)] max-md:gap-[16px] max-md:pt-[16px]">
        {children}
      </div>
    </DashboardShell>
  );

  if (!candidate) {
    log('branch: no profile for', candidateId);
    return shell(
      <InlineState
        title={PROFILE_COPY.notFoundTitle}
        actions={
          <Button variant="tertiary" to={`/recruiter/talent-search?job=${DEFAULT_JOB_ID}`}>
            {PROFILE_COPY.notFoundBack}
          </Button>
        }
      >
        {PROFILE_COPY.notFoundBody}
      </InlineState>
    );
  }

  const isApplicant = candidate.kind === 'applicant';
  const jobId = candidate.match.jobId;
  const job = findJob(jobId);
  const invitesLeft = invited ? INVITE_ALLOWANCE.left - 1 : INVITE_ALLOWANCE.left;
  const stageLabel = PIPELINE_STAGES.find((stage) => stage.value === pipelineStage)?.label;

  const closeAll = { modal: '', menu: '' };
  const backTo = isApplicant
    ? '/recruiter/messages'
    : `/recruiter/talent-search?job=${get('job') || DEFAULT_JOB_ID}`;

  let historyLine = candidate.history.line;
  if (!isApplicant && stageLabel) {
    historyLine = PIPELINE_DIALOG.historyLine(stageLabel, job.title, candidate.firstName);
  } else if (!isApplicant && invited) {
    historyLine = INVITE_SENT.historyLine(findJob(invited).title);
  }

  const handleToggleMenu = (menuId) => {
    if (isApplicant) {
      // ⚠️ not drawn: no overflow menu exists for an applicant.
      log('branch: applicant overflow', { drawn: false });
      return;
    }
    log('branch: toggle menu', menuId, 'was', menu);
    set({ menu: menu === menuId ? '' : menuId, toast: '' });
  };

  const handleSelectList = (listId) => {
    log('branch: save to list', listId);
    set({ saved: listId, menu: '', toast: 'saved' });
  };

  const handleOverflowSelect = (itemId) => {
    log('branch: overflow item', itemId);
    if (itemId === 'add-to-pipeline') {
      set({ menu: '', modal: 'pipeline' }, { push: true });
      return;
    }
    if (itemId === 'copy-link') {
      navigator.clipboard?.writeText(window.location.origin + window.location.pathname);
    }
    set({ menu: '' });
  };

  const handleInviteConfirm = ({ jobId: invitedJobId, message }) => {
    log('branch: invite sent', { invitedJobId, messageLength: message.length });
    set({ modal: '', invited: invitedJobId, toast: 'invite-sent' });
  };

  const handlePipelineConfirm = ({ stage, notify }) => {
    log('branch: added to pipeline', { stage, notify });
    set({ modal: '', pipeline: stage, toast: 'pipeline-added' });
  };

  const renderToast = () => {
    if (toast === 'invite-sent') {
      return (
        <BannerToast
          title={INVITE_SENT.toast.title}
          message={INVITE_SENT.toast.message(candidate.name)}
          actionLabel={INVITE_SENT.toast.action}
          onAction={() => navigate('/recruiter/messages')}
          onClose={() => set({ toast: '' })}
          placement={`${TOAST_PLACEMENT} ${INVITE_SENT.toast.width}`}
        />
      );
    }
    if (toast === 'saved') {
      const list = SAVE_LISTS.find((item) => item.id === savedListId) ?? SAVE_LISTS[0];
      return (
        <BannerToast
          title={SAVE_MENU.toast.title}
          message={SAVE_MENU.toast.message(list.title)}
          actionLabel={SAVE_MENU.toast.action}
          onAction={() =>
            log('branch: view list', { listId: list.id, destination: 'none-in-figma' })
          }
          onClose={() => set({ toast: '' })}
          placement={`${TOAST_PLACEMENT} ${SAVE_MENU.toast.width}`}
        />
      );
    }
    if (toast === 'pipeline-added') {
      return (
        <BannerToast
          title={PIPELINE_DIALOG.toast.title}
          message={PIPELINE_DIALOG.toast.message(candidate.firstName, stageLabel ?? '', job.title)}
          actionLabel={PIPELINE_DIALOG.toast.action}
          onAction={() => navigate('/recruiter/application-pipeline')}
          onClose={() => set({ toast: '' })}
          placement={`${TOAST_PLACEMENT} ${PIPELINE_DIALOG.toast.width}`}
        />
      );
    }
    return null;
  };

  return shell(
    <>
      <nav aria-label="Breadcrumb" className="flex min-h-[36px] items-center gap-[12px]">
        <div className="flex min-w-0 items-center gap-[8px]">
          <button
            type="button"
            onClick={() => navigate(backTo)}
            className="inline-flex shrink-0 cursor-pointer items-center gap-[6px] border-0 bg-transparent p-0 font-sans text-[14px] leading-[24px] font-medium tracking-[0.2px] text-[#387440] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
          >
            <BackArrowIcon className="size-[16px]" />
            {candidate.crumb.backLabel}
          </button>
          <span className="truncate font-sans text-[12px] leading-[20px] tracking-[0.2px] text-[#575755] max-md:hidden">
            {`·  ${candidate.crumb.trail}`}
          </span>
        </div>
        <div className="ml-auto flex shrink-0 items-center gap-[8px]">
          {candidate.crumb.position ? (
            <span className="font-sans text-[12px] leading-[20px] tracking-[0.2px] text-[#575755]">
              {candidate.crumb.position}
            </span>
          ) : null}
          <button
            type="button"
            aria-label={PROFILE_COPY.nextCandidate}
            onClick={() => log('branch: next candidate', { drawn: 'chevron only' })}
            className="flex size-[36px] cursor-pointer items-center justify-center rounded-[10px] border border-solid border-[#dbded9] bg-white p-0 text-[#111] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
          >
            <ChevronRightIcon className="size-[18px]" />
          </button>
        </div>
      </nav>

      <div className="grid min-w-0 gap-x-[24px] gap-y-[20px] xl:grid-cols-[minmax(0,1fr)_clamp(340px,23.15vw,400px)] xl:grid-rows-[auto_1fr]">
        <div className="min-w-0 xl:col-start-1 xl:row-start-1">
          <CandidateProfileHeader
            candidate={candidate}
            photoSrc={PHOTOS[candidate.id]}
            invited={Boolean(invited)}
            invitedRole={invited ? findJob(invited).title : ''}
            invitesLeft={invitesLeft}
            savedListId={savedListId}
            menu={menu}
            onInvite={() => set({ modal: 'invite', menu: '', toast: '' }, { push: true })}
            onMessage={() => navigate('/recruiter/messages')}
            onToggleMenu={handleToggleMenu}
            onCloseMenu={() => set({ menu: '' })}
            onSelectList={handleSelectList}
            onNewList={() => {
              log('branch: new list', { drawn: false });
              set({ menu: '' });
            }}
            onOverflowSelect={handleOverflowSelect}
            onViewPipeline={() => navigate('/recruiter/application-pipeline')}
            onMoveToStage={() => log('branch: move to stage', { drawn: false })}
            onOpenApplication={() => log('branch: open application', { drawn: false })}
          />
        </div>
        <aside
          aria-label="Match and notes"
          className="flex min-w-0 flex-col gap-[20px] xl:col-start-2 xl:row-span-2 xl:row-start-1"
        >
          <CandidateMatchPanel
            candidate={candidate}
            jobId={jobId}
            historyLine={historyLine}
            onJobChange={(value) => set({ job: value })}
          />
        </aside>
        <div className="flex min-w-0 flex-col gap-[20px] xl:col-start-1 xl:row-start-2">
          <CandidateProfileBody candidate={candidate} />
        </div>
      </div>

      {!isApplicant && modal === 'invite' ? (
        <InviteDialog
          candidate={candidate}
          job={job}
          invitesLeft={invitesLeft}
          onCancel={() => set(closeAll)}
          onConfirm={handleInviteConfirm}
        />
      ) : null}
      {!isApplicant && modal === 'pipeline' ? (
        <PipelineDialog
          candidate={candidate}
          job={job}
          onCancel={() => set(closeAll)}
          onConfirm={handlePipelineConfirm}
        />
      ) : null}
      {renderToast()}
    </>
  );
};

export default TalentCandidateProfileSection;
