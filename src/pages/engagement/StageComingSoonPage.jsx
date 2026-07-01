import { useNavigate, useLocation } from 'react-router-dom';
import EngagementTopNav from '../../components/sections/engagement/EngagementTopNav.jsx';
import EngagementTopBar from '../../components/sections/engagement/EngagementTopBar.jsx';
import { PROFILE_STAGES } from '../../constants/profileStages.js';
import { debug } from '../../utils/debug.js';

const log = debug('StageComingSoonPage');

/*
 * StageComingSoonPage — placeholder for engagement stages that don't
 * have a real page yet. Renders the stage name + a "back to map"
 * button so the user knows their click registered even though the
 * feature isn't built.
 *
 * Route → stage id mapping is derived from the URL. If a user hits
 * a URL not in the mapping, we still render a generic stub.
 */

const PATH_TO_STAGE_ID = {
  '/profile/engagement/interests': 'personal-interests',
  '/profile/engagement/personality': 'personality',
  '/profile/engagement/skills': 'skills',
  '/profile/engagement/work': 'work-experience',
  '/profile/engagement/portfolio': 'project-portfolio',
  '/profile/engagement/certifications': 'certifications',
  '/profile/engagement/goals': 'desired-career',
  '/profile/engagement/pitch': 'talent-pitch',
};

const StageComingSoonPage = () => {
  log('mount');
  const navigate = useNavigate();
  const location = useLocation();

  const stageId = PATH_TO_STAGE_ID[location.pathname];
  const stage = PROFILE_STAGES.find((s) => s.id === stageId);
  const title = stage?.title || 'Stage';
  const trailLabel = stage?.trailLabel || 'Stage';
  const currentIndex = stage ? PROFILE_STAGES.findIndex((s) => s.id === stage.id) : 0;

  const handleBackToMap = () => {
    log('back to identity map');
    navigate('/profile/engagement/identity');
  };

  const handleSaveExit = () => {
    navigate('/');
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-default">
      <EngagementTopNav onSaveExit={handleSaveExit} />
      <EngagementTopBar currentStageIndex={currentIndex} completionPct={0} />

      <main className="flex-1 flex flex-col items-center justify-center gap-6 px-6 py-16">
        <div className="max-w-md w-full text-center flex flex-col items-center gap-4 bg-white rounded-2xl border border-border-default shadow-sm px-8 py-12">
          <span className="inline-flex items-center gap-2 rounded-pill bg-brand-green-light-active/60 text-brand-green-dark font-sans font-bold text-[11px] tracking-[0.12em] uppercase px-3 py-1">
            {trailLabel}
          </span>
          <h1 className="font-display text-[clamp(24px,3vw,32px)] leading-[1.15] tracking-[-0.3px] text-content-primary">
            {title} — coming soon
          </h1>
          <p className="font-sans text-[14px] leading-6 text-neutral-darker">
            This step is currently being built by the team. Your click landed here so you know
            navigation works — the real page will slot in when it&apos;s ready.
          </p>
          <button
            type="button"
            onClick={handleBackToMap}
            className="mt-2 inline-flex items-center gap-2 rounded-pill bg-brand-green text-white shadow-sm px-5 py-2 font-sans font-semibold text-[14px] transition-colors duration-150 hover:bg-brand-green-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
          >
            <svg viewBox="0 0 20 20" fill="none" className="size-4" aria-hidden="true">
              <path
                d="M16 10H4M10 4l-6 6 6 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Back to Identity Map
          </button>
        </div>
      </main>
    </div>
  );
};

export default StageComingSoonPage;
