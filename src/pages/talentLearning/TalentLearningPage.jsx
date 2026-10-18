import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/talentA11y.css';
import { debug } from '../../utils/debug.js';
import { ensurePlayfulFont } from '../../utils/ensurePlayfulFont.js';
import DashboardShell from '../../components/sections/dashboard/DashboardShell.jsx';
import UiStyleScope from '../../components/shared/UiStyleScope.jsx';
import { useTalentLearningState } from '../../components/sections/talentLearning/talentLearningState.js';
import AskBuddyFab from '../../components/sections/talentHome/AskBuddyFab.jsx';
import LearningHub from '../../components/sections/talentLearning/LearningHub.jsx';
import LearningInProgress from '../../components/sections/talentLearning/LearningInProgress.jsx';
import LearningRecommended from '../../components/sections/talentLearning/LearningRecommended.jsx';
import LearningEmptyState from '../../components/sections/talentLearning/LearningEmptyState.jsx';
import LearningLoading from '../../components/sections/talentLearning/LearningLoading.jsx';
import LearningSavedTab from '../../components/sections/talentLearning/LearningSavedTab.jsx';
import LearningSavedToast from '../../components/sections/talentLearning/LearningSavedToast.jsx';
import CourseDetail from '../../components/sections/talentLearning/CourseDetail.jsx';
import LessonPlayer from '../../components/sections/talentLearning/LessonPlayer.jsx';
import CourseComplete from '../../components/sections/talentLearning/CourseComplete.jsx';
import LearningCertificates from '../../components/sections/talentLearning/LearningCertificates.jsx';
import ExploreCourses from '../../components/sections/talentLearning/ExploreCourses.jsx';

const log = debug('TalentLearningPage');

/*
 * TalentLearningPage — `/learning`, Figma "Talent – My Learning" (Focused + Playful in one build).
 * Frame <-> URL table and file ownership: wiki/talent-my-learning.md. State is chosen from the URL
 * (talentLearningState.js). The hub views (progress / saved / empty / loading) share LearningHub's
 * header + tabs; the other views are full-body screens inside the same talent shell.
 */
const TalentLearningPage = () => {
  const learning = useTalentLearningState();
  const navigate = useNavigate();

  useEffect(() => {
    ensurePlayfulFont();
  }, []);

  // Marks <html> while mounted so talentA11y.css (focus ring, reduced motion) covers portaled dialogs.
  useEffect(() => {
    document.documentElement.setAttribute('data-talent-home', '');
    return () => document.documentElement.removeAttribute('data-talent-home');
  }, []);

  useEffect(() => {
    log('mount', {
      view: learning.view,
      tab: learning.tab,
      quick: learning.quick,
      ex: learning.ex,
    });
  }, [learning.view, learning.tab, learning.quick, learning.ex]);

  const renderHubBody = () => {
    if (learning.loading) return <LearningLoading learning={learning} />;
    if (learning.tab === 'saved') return <LearningSavedTab learning={learning} />;
    if (learning.empty) return <LearningEmptyState learning={learning} />;
    return <LearningInProgress learning={learning} />;
  };

  const renderBody = () => {
    switch (learning.view) {
      case 'course':
        return <CourseDetail learning={learning} />;
      case 'lesson':
        return <LessonPlayer learning={learning} />;
      case 'complete':
        return <CourseComplete learning={learning} />;
      case 'certificates':
        return <LearningCertificates learning={learning} />;
      case 'recommended':
        return <LearningRecommended learning={learning} />;
      case 'explore':
        return <ExploreCourses learning={learning} />;
      default:
        return <LearningHub learning={learning}>{renderHubBody()}</LearningHub>;
    }
  };

  return (
    <DashboardShell role="talent" activeNav="learning" talentHome={learning}>
      <UiStyleScope enabled />
      <div className="flex flex-col gap-[clamp(12px,0.926vw,16px)] pl-[clamp(12px,2.315vw,40px)] pr-[clamp(12px,3.241vw,56px)] py-[clamp(12px,1.2vw,20px)]">
        {renderBody()}
      </div>
      {learning.toast === 'saved' && <LearningSavedToast learning={learning} />}
      {/* Figma: the Ask Buddy FAB sits bottom-right on every talent dashboard screen; the chat overlay lives on /home. */}
      <AskBuddyFab
        home={learning}
        onClick={() => {
          log('Ask Buddy -> /home?new=chat');
          navigate('/home?new=chat');
        }}
      />
    </DashboardShell>
  );
};

export default TalentLearningPage;
