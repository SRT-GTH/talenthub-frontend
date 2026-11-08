import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecruiterShell } from '../../../hooks/useRecruiterShell.js';
import { fetchReceivedApplications } from '../../../services/recruiterPipeline.api.js';
import { liveHero, liveJobs, livePipeline } from './liveDashboard.js';
import { debug } from '../../../utils/debug.js';
import useScopedRoundedFont from '../../../hooks/useScopedRoundedFont.js';
import BannerToast from '../../ui/BannerToast.jsx';
import Callout from '../../ui/Callout.jsx';
import FilterSelect from '../../ui/FilterSelect.jsx';
import DashboardShell from '../dashboard/DashboardShell.jsx';
import ActiveJobsWidget from './ActiveJobsWidget.jsx';
import DashHero from './DashHero.jsx';
import DashboardSkeleton from './DashboardSkeleton.jsx';
import FeedbackWidget from './FeedbackWidget.jsx';
import OrgLinkCard from './OrgLinkCard.jsx';
import OrgSwitcher from './OrgSwitcher.jsx';
import PipelineWidget from './PipelineWidget.jsx';
import SkillsWidget from './SkillsWidget.jsx';
import TalentsWidget from './TalentsWidget.jsx';
import VerificationWidget from './VerificationWidget.jsx';
import WorkspaceSidebar from './WorkspaceSidebar.jsx';
import { CloseJobDialog, PauseJobDialog } from './JobDialogs.jsx';
import { InviteDialog } from './TalentDialogs.jsx';
import StageDrawer from './StageDrawer.jsx';
import UploadDialog from './UploadDialog.jsx';
import SearchPanel from './SearchPanel.jsx';
import { LanguageMenu, RecruiterNotificationsPanel } from './TopBarPanels.jsx';
import { FeedbackDialog, MyFeedbackPanel } from './FeedbackParts.jsx';
import { dashIcons } from './recruiterDashboardIcons.js';
import {
  HERO,
  JOBS,
  JOBS_TOASTS,
  ORGS,
  ORG_TOASTS,
  PENDING_BANNER,
  PIPELINE,
  PIPELINE_FILTER,
  SKILLS,
  SKILLS_INDUSTRIES,
  SKILLS_REGIONS,
  SKILLS_STATES,
  TALENTS,
  TALENT_FILTER,
  TALENT_TOASTS,
  VERIFICATION_TOASTS,
  FEEDBACK,
  FEEDBACK_TOASTS,
  NOTIFICATIONS_PANEL,
} from './recruiterDashboardData.js';
import { useRecruiterDashboardState } from './useRecruiterDashboardState.js';

const log = debug('RecruiterDashboard');

/*
 * RecruiterDashboardSection — the recruiter dashboard (Figma file OHG2xsfCCskT8xEn356njv, canvas "Recruiter - Dashboard" 10005:38660, US-7.3-01 … 07).
 * One page, many states, every state in the URL: see useRecruiterDashboardState and wiki/recruiter-dashboard.md for the frame → URL table.
 * Chrome: DashboardShell with the org switcher in the top bar and the workspace rail (`renderSidebar`); the widgets are separate components.
 * ⚠️ ASSUMPTION: the org name in the copy ("Live roles for …", "KYB · …") follows the selected organisation; Figma keeps "MTN Ghana" in every frame, even after switching.
 */
const SWITCH_DELAY_MS = 900;

const RecruiterDashboardSection = () => {
  // Figma draws the dashboard in SF Pro Rounded (bundled as `GTH Parent Rounded`); scoped to this screen.
  useScopedRoundedFont('data-recruiter-ui');
  const state = useRecruiterDashboardState();
  const { loading, panel, toast, set, get } = state;
  const navigate = useNavigate();
  // Signed-in recruiter: the page shows their own organisation, jobs and counts (null = demo, the Figma states).
  const shell = useRecruiterShell();
  const isLive = Boolean(shell);
  const [apps, setApps] = useState([]);
  useEffect(() => {
    if (!isLive) return undefined;
    let alive = true;
    fetchReceivedApplications()
      .then((list) => alive && setApps(list))
      .catch((err) => log.error('applications failed:', err?.response?.status || err?.message));
    return () => {
      alive = false;
    };
  }, [isLive]);
  const liveOrg = isLive
    ? {
        id: shell.orgId || 'live',
        name: shell.orgName || '\u2014',
        meta: `Recruiter \u00b7 ${shell.plan?.label || 'Free'} plan`,
        logo: 'personal',
        logoUrl: shell.logoUrl,
        status: 'active',
      }
    : null;
  const org = liveOrg || state.org;
  const single = isLive || state.single;
  const pending = isLive ? false : state.pending;
  const noOrg = isLive ? Boolean(shell.fullName) && !shell.orgName : state.noOrg;
  const hero = useMemo(() => (isLive ? liveHero(shell, apps) : HERO), [isLive, shell, apps]);
  const jobsLive = useMemo(
    () => (isLive ? liveJobs(shell.jobList, apps) : null),
    [isLive, shell, apps]
  );
  const pipelineLive = useMemo(
    () => (isLive ? livePipeline(shell.applicantsByStage) : null),
    [isLive, shell]
  );
  const switchTimer = useRef(null);

  useEffect(() => {
    log('mount', { org: org.id, single, pending, noOrg, loading, panel, toast });
  }, [org.id, single, pending, noOrg, loading, panel, toast]);

  useEffect(() => () => window.clearTimeout(switchTimer.current), []);

  const handleSelectOrg = (orgId) => {
    log('branch: switch org ->', orgId);
    set({ panel: '', org: orgId, loading: '1', toast: '' });
    window.clearTimeout(switchTimer.current);
    switchTimer.current = window.setTimeout(() => {
      set({ loading: '', toast: orgId === 'hubtel' || orgId === 'mtn' ? 'switched' : '' });
    }, SWITCH_DELAY_MS);
  };

  // Two copies exist (top bar at lg+, in the page content below lg); each keys its own open state so only the visible one reacts to clicks.
  const renderOrgSwitcher = (key) => (
    <OrgSwitcher
      org={org}
      single={single}
      open={panel === key}
      onOpenChange={(open) => set({ panel: open ? key : '' })}
      onSelect={handleSelectOrg}
      onRequest={() => {
        log('request affiliation (no screen drawn in this canvas)');
        set({ panel: '' });
      }}
    />
  );
  const orgSwitcher = renderOrgSwitcher('org');

  const sortValue = get('sort', 'urgent');
  const menuJobId = get('jobMenu');
  const dialog = get('dialog');
  const dialogJob = JOBS.find((job) => job.id === get('job', 'marketing-intern')) ?? JOBS[1];
  const pausedIds = get('paused') ? get('paused').split(',').filter(Boolean) : [];
  const jobsState = ['empty', 'suspended', 'error'].includes(get('jobs')) ? get('jobs') : '';

  const handleRowAction = (action, jobId) => {
    log('branch: job row action', { action, jobId });
    if (isLive) {
      // The job postings page owns the live pause / close dialogs.
      const modal = { pause: 'pause', close: 'close-applicants' }[action];
      if (modal) navigate(`/recruiter/job-postings?modal=${modal}&posting=${jobId}`);
      else if (action === 'view') navigate(`/recruiter/application-pipeline?posting=${jobId}`);
      else if (action === 'edit') navigate(`/recruiter/job-postings/${jobId}/edit`);
      set({ jobMenu: '' });
      return;
    }
    if (action === 'pause' || action === 'close') {
      set({ jobMenu: '', dialog: action, job: jobId });
    } else {
      set({ jobMenu: '' });
    }
  };

  const talentsJob = get('talentsJob', 'junior-accountant');
  const talentsJobOption =
    TALENT_FILTER.options.find((option) => option.value === talentsJob) ?? TALENT_FILTER.options[1];
  const talentOptions = TALENT_FILTER.options.map((option) => ({
    ...option,
    icon: dashIcons.jobFilterOptionBriefcase,
  }));
  const talentsState = ['loading', 'empty'].includes(get('talents')) ? get('talents') : '';
  const savedIds = get('saved') ? get('saved').split(',').filter(Boolean) : [];
  const inviteTalent =
    TALENTS.cards.find((card) => card.id === get('talent', 'akua')) ?? TALENTS.cards[0];

  const handleSave = (id) => {
    const already = savedIds.includes(id);
    log('branch: talent save toggled', { id, already });
    set({
      saved: (already ? savedIds.filter((x) => x !== id) : [...savedIds, id]).join(','),
      toast: already ? '' : 'saved',
    });
  };

  const pipelineJob = get('pipelineJob', 'all');
  const pipelineJobOption =
    PIPELINE_FILTER.options.find((option) => option.value === pipelineJob) ??
    PIPELINE_FILTER.options[0];
  const pipelineOptions = PIPELINE_FILTER.options.map((option) => ({
    ...option,
    icon: dashIcons.jobFilterOptionBriefcase,
  }));
  const pipelineState = ['empty', 'loading'].includes(get('pipeline')) ? get('pipeline') : '';
  const drawerStage = PIPELINE.stages.find((stage) => stage.id === get('stage')) ?? null;

  const region = get('region', 'accra');
  const industry = get('industry', 'all');
  const regionOptions = SKILLS_REGIONS.options.map((option) =>
    option.icon ? { ...option, icon: dashIcons[option.icon] } : option
  );
  const industryOptions = SKILLS_INDUSTRIES.options.map((option) => ({
    ...option,
    icon: dashIcons[option.icon],
  }));
  const skillsState =
    region === 'upper-west'
      ? 'sparse'
      : region === 'tamale' && industry === 'agriculture'
        ? 'none'
        : '';
  const regionLabel =
    skillsState === 'none'
      ? SKILLS_STATES.none.regionLabel
      : (regionOptions.find((option) => option.value === region)?.label ?? SKILLS.region);
  const industryLabel =
    skillsState === 'none'
      ? SKILLS_STATES.none.industryLabel
      : (industryOptions.find((option) => option.value === industry)?.label ?? SKILLS.industry);

  const feedbackCandidate =
    FEEDBACK.pending.find((item) => item.id === get('candidate', 'elena')) ?? FEEDBACK.pending[0];
  const feedbackInitial = get('draft') === 'short' ? { rating: 4, text: 'Good interview.' } : {};

  const handlePaused = () => {
    log('branch: job paused', dialogJob.id);
    set({
      dialog: '',
      job: '',
      toast: 'paused',
      paused: [...new Set([...pausedIds, dialogJob.id])].join(','),
    });
  };

  const toastCopy = toast
    ? (ORG_TOASTS[toast] ??
      JOBS_TOASTS[toast] ??
      TALENT_TOASTS[toast] ??
      VERIFICATION_TOASTS[toast] ??
      FEEDBACK_TOASTS[toast] ??
      (toast === 'offline' ? NOTIFICATIONS_PANEL.offline : null))
    : null;

  return (
    <DashboardShell
      orgSlot={orgSwitcher}
      panels={{
        searchQuery: get('q'),
        onSearchInput: (value) => set({ panel: 'search', q: value }),
        onSearchFocus: () => {
          if (panel !== 'search') set({ panel: 'search' });
        },
        search:
          panel === 'search' ? (
            <SearchPanel query={get('q')} onClose={() => set({ panel: '', q: '' })} />
          ) : null,
        onNotifications: () =>
          set({
            panel:
              panel === 'notifications' || panel === 'notifications-empty' ? '' : 'notifications',
          }),
        notifications:
          panel === 'notifications' || panel === 'notifications-empty' ? (
            <RecruiterNotificationsPanel
              empty={panel === 'notifications-empty'}
              onClose={() => set({ panel: '' })}
              onNavigate={(action) => {
                log('notifications panel action (no destination in this canvas):', action);
                if (action === 'search-talents') set({ panel: '' });
              }}
            />
          ) : null,
        onLanguage: () => set({ panel: panel === 'language' ? '' : 'language' }),
        language:
          panel === 'language' ? (
            <LanguageMenu onClose={() => set({ panel: '' })} onChange={() => set({ panel: '' })} />
          ) : null,
        a11yOpen: panel === 'a11y',
        onA11y: (open) => set({ panel: open ? 'a11y' : '' }),
      }}
      renderSidebar={({ collapsed, onToggle }) =>
        collapsed ? null : <WorkspaceSidebar onToggle={onToggle} />
      }
    >
      <div className="flex w-full flex-col gap-[16px] py-[28px] pl-[clamp(16px,2.3vw,40px)] pr-[clamp(16px,3.24vw,56px)] max-md:gap-[12px] max-md:py-[12px]">
        <div className="lg:hidden">{renderOrgSwitcher('org-inline')}</div>

        {loading ? (
          <DashboardSkeleton org={org.name} />
        ) : (
          <>
            {pending ? (
              <Callout
                icon={dashIcons.clockPendingBanner}
                title={PENDING_BANNER.title}
                action={
                  <button
                    type="button"
                    onClick={() => handleSelectOrg('none')}
                    className="inline-flex h-[34px] shrink-0 cursor-pointer items-center gap-[6px] rounded-[10px] border border-solid border-[#1c2a21]/30 bg-white px-[12px] font-sans text-[12px] leading-[20px] font-medium tracking-[0.2px] text-[#1c2a21] shadow-[0_2px_0_rgba(17,17,17,0.25)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
                  >
                    <img
                      src={dashIcons.userSwitchPersonal}
                      alt=""
                      aria-hidden="true"
                      className="size-[14px]"
                    />
                    {PENDING_BANNER.action}
                  </button>
                }
              >
                {PENDING_BANNER.body}
              </Callout>
            ) : null}

            <DashHero
              data={hero}
              summary={isLive ? hero.summary : noOrg ? HERO.noOrg : HERO.summary(org.name)}
              onQuickAction={(id) => {
                const to = {
                  search: '/recruiter/talent-search',
                  post: '/recruiter/job-postings/new',
                  edit: '/recruiter/settings',
                }[id];
                if (isLive && to) navigate(to);
                else log('quick action (no destination in this canvas):', id);
              }}
              onCustomize={() => log('customize (no screen drawn in this canvas)')}
            />

            {noOrg ? (
              <OrgLinkCard
                onRequest={() => log('request affiliation (no screen drawn in this canvas)')}
                onCreate={() => log('create organisation (no screen drawn in this canvas)')}
                onFreelancer={() => log('continue as freelancer (no screen drawn in this canvas)')}
              />
            ) : (
              <>
                <div className="grid grid-cols-[minmax(0,900fr)_minmax(0,413fr)] items-stretch gap-[16px] max-xl:grid-cols-1">
                  <ActiveJobsWidget
                    org={org.name}
                    {...(jobsLive
                      ? {
                          jobs: jobsLive,
                          chip: `${jobsLive.length} active`,
                          onViewAll: () => navigate('/recruiter/job-postings'),
                        }
                      : {})}
                    readOnly={pending}
                    sort={{
                      value: sortValue,
                      onChange: (value) => set({ sort: value === 'urgent' ? '' : value }),
                      open: get('menu') === 'sort',
                      onOpenChange: (open) => set({ menu: open ? 'sort' : '' }),
                    }}
                    menuJobId={menuJobId}
                    onMenu={(id) => set({ jobMenu: id })}
                    onRowAction={handleRowAction}
                    pausedIds={pausedIds}
                    jobsState={isLive && !jobsLive.length ? 'empty' : jobsState}
                    onStateAction={(kind) => {
                      log('state action (no destination in this canvas):', kind);
                      if (kind === 'error') set({ jobs: '' });
                    }}
                  />
                  <VerificationWidget
                    org={org.name}
                    live={isLive ? shell.kyb || { documents: [] } : null}
                    readOnly={pending}
                    variant={
                      isLive
                        ? shell.kyb?.verified
                          ? 'verified'
                          : ''
                        : ['verified', 'rejected', 'owner'].includes(get('verify'))
                          ? get('verify')
                          : ''
                    }
                    onUpload={() => set({ dialog: 'upload', step: 'choose' })}
                    onNotifyOwner={() =>
                      log('notify the org owner (no screen drawn in this canvas)')
                    }
                  />
                </div>

                <div className="grid grid-cols-[minmax(0,900fr)_minmax(0,413fr)] items-stretch gap-[16px] max-xl:grid-cols-1">
                  <PipelineWidget
                    live={pipelineLive}
                    readOnly={pending}
                    state={
                      isLive
                        ? !pipelineLive
                          ? 'loading'
                          : pipelineLive.empty
                            ? 'empty'
                            : ''
                        : pipelineState
                    }
                    selectedStage={get('stage')}
                    window={get('window', '30d')}
                    onWindowChange={(value) => set({ window: value === '30d' ? '' : value })}
                    jobFilter={
                      isLive ? null : (
                        <FilterSelect
                          label={pipelineJobOption.label}
                          icon={dashIcons.briefcaseFilter}
                          options={pipelineOptions}
                          value={pipelineJob}
                          onChange={(value) => set({ pipelineJob: value === 'all' ? '' : value })}
                          open={get('menu') === 'pipeline'}
                          onOpenChange={(open) => set({ menu: open ? 'pipeline' : '' })}
                          menuLabel={PIPELINE_FILTER.label}
                          width={260}
                          ariaLabel="Filter pipeline by opportunity"
                        />
                      )
                    }
                    onStage={(id) => set({ stage: get('stage') === id ? '' : id })}
                    onInvite={() =>
                      log('invite recommended talents (scrolls to the talents widget)')
                    }
                  />
                  {/* Feedback, recommended talents and the skills map have no backend yet: signed in they are left out rather than showing sample people. */}
                  {isLive ? null : (
                    <FeedbackWidget
                      readOnly={pending}
                      tab={get('feedback', 'give')}
                      onTabChange={(value) => set({ feedback: value === 'give' ? '' : value })}
                      mine={<MyFeedbackPanel />}
                      withdrewId={get('withdrew')}
                      onLeaveFeedback={(id) => set({ dialog: 'feedback', candidate: id })}
                    />
                  )}
                </div>

                {isLive ? null : (
                  <TalentsWidget
                    readOnly={pending}
                    state={talentsState}
                    savedIds={savedIds}
                    hintId={get('hint')}
                    onHint={(id) => set({ hint: id })}
                    jobFilter={
                      <FilterSelect
                        label={`Job: ${talentsJobOption.label}`}
                        icon={dashIcons.briefcaseFilter}
                        options={talentOptions}
                        value={talentsJob}
                        onChange={(value) =>
                          set({ talentsJob: value === 'junior-accountant' ? '' : value })
                        }
                        open={get('menu') === 'talents'}
                        onOpenChange={(open) => set({ menu: open ? 'talents' : '' })}
                        menuLabel={TALENT_FILTER.label}
                        width={260}
                        ariaLabel="Filter recommended talents by job"
                      />
                    }
                    onInvite={(id) => set({ dialog: 'invite', talent: id })}
                    onSave={handleSave}
                    onView={(id) => log('view talent (profile screen is not in this canvas):', id)}
                    onRefine={() => log('edit job descriptions (no screen drawn in this canvas)')}
                  />
                )}

                {isLive ? null : (
                  <SkillsWidget
                    readOnly={pending}
                    national={region === 'national'}
                    state={skillsState}
                    onSwitchNational={() => set({ region: 'national' })}
                    onClearIndustry={() => set({ industry: '' })}
                    filters={
                      <>
                        <FilterSelect
                          label={regionLabel}
                          icon={dashIcons.mapPinRegion}
                          options={regionOptions}
                          value={region}
                          onChange={(value) => set({ region: value === 'accra' ? '' : value })}
                          open={get('menu') === 'region'}
                          onOpenChange={(open) => set({ menu: open ? 'region' : '' })}
                          width={260}
                          ariaLabel="Region"
                        />
                        <FilterSelect
                          label={industryLabel}
                          icon={dashIcons.buildingIndustry}
                          options={industryOptions}
                          value={industry}
                          onChange={(value) => set({ industry: value === 'all' ? '' : value })}
                          open={get('menu') === 'industry'}
                          onOpenChange={(open) => set({ menu: open ? 'industry' : '' })}
                          width={220}
                          ariaLabel="Industry"
                        />
                      </>
                    }
                  />
                )}
              </>
            )}
          </>
        )}
      </div>

      {dialog === 'pause' ? (
        <PauseJobDialog
          job={dialogJob}
          onCancel={() => set({ dialog: '', job: '' })}
          onConfirm={handlePaused}
        />
      ) : null}
      {dialog === 'close' ? (
        <CloseJobDialog
          job={dialogJob}
          onCancel={() => set({ dialog: '', job: '' })}
          onConfirm={(result) => {
            log('branch: job closed', { job: dialogJob.id, ...result });
            set({ dialog: '', job: '' });
          }}
        />
      ) : null}

      {dialog === 'invite' ? (
        <InviteDialog
          talent={inviteTalent}
          onCancel={() => set({ dialog: '', talent: '' })}
          onConfirm={() => {
            log('branch: invite sent', inviteTalent.id);
            set({ dialog: '', talent: '', toast: 'invited' });
          }}
        />
      ) : null}

      {drawerStage ? <StageDrawer stage={drawerStage} onClose={() => set({ stage: '' })} /> : null}

      {dialog === 'upload' ? (
        <UploadDialog
          org={org.name}
          step={get('step') === 'uploading' ? 'uploading' : 'choose'}
          onCancel={() => set({ dialog: '', step: '' })}
          onDone={() => set({ dialog: '', step: '', toast: 'uploaded' })}
        />
      ) : null}

      {dialog === 'feedback' ? (
        <FeedbackDialog
          candidate={{
            name: feedbackCandidate.name.split(' · ')[0],
            role: feedbackCandidate.name.split(' · ')[1],
            date: feedbackCandidate.due.replace(/^Interviewed /, '').split(' · ')[0],
          }}
          initial={feedbackInitial}
          onCancel={() => set({ dialog: '', candidate: '', draft: '' })}
          onSubmit={() => {
            log('branch: feedback sent', feedbackCandidate.id);
            set({ dialog: '', candidate: '', draft: '', toast: 'sent' });
          }}
        />
      ) : null}

      {toastCopy ? (
        <BannerToast
          tone={toastCopy.tone}
          title={toastCopy.title}
          message={typeof toastCopy.body === 'function' ? toastCopy.body(org.name) : toastCopy.body}
          actionLabel={toastCopy.action}
          onAction={() => {
            if (toast === 'paused') set({ paused: '' });
            else if (toast === 'saved') set({ saved: '' });
            else handleSelectOrg(ORGS[0].id);
          }}
          onClose={() => set({ toast: '' })}
        />
      ) : null}
    </DashboardShell>
  );
};

export default RecruiterDashboardSection;
