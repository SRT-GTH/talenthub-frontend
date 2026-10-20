import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { debug } from '../../utils/debug.js';
import { HubHeader, HubTabs } from '../../components/sections/talentSkillsLab/HubChrome.jsx';
import {
  HubAllTab,
  HubEmptyTab,
  HubHistoryTab,
  HubLoadingTab,
  HubProgressTab,
  HubVerifiedTab,
} from '../../components/sections/talentSkillsLab/HubScreens.jsx';
import SkillsLabDialogs from '../../components/sections/talentSkillsLab/SkillsLabDialogs.jsx';
import SkillsLabFrame from '../../components/sections/talentSkillsLab/SkillsLabFrame.jsx';
import { useSkillsLabState } from '../../components/sections/talentSkillsLab/skillsLabState.js';
import { HUB_COPY, HUB_LABS_RESPONSE } from '../../components/sections/talentSkillsLab/skillsLabData.js';
import HubDataProvider from '../../components/sections/talentSkillsLab/SkillsLabHubDataProvider.jsx';
import {
  isSkillsLabDemo,
  useLiveHub,
} from '../../components/sections/talentSkillsLab/skillsLabHubData.js';
import GamesTabSlot from '../../components/sections/talentSkillsLab/HubGamesSlot.jsx';

const log = debug('SkillsLabHubPage');

/*
 * SkillsLabHubPage — `/skills-lab`: SL-01 hub, SL-01b/c In progress / Verified, SL-07 History, SL-01d filtered,
 * SL-01e search, SL-G01 Games (slot), SL-08 empty (?state=empty), SL-09 loading (?state=loading).
 * Dialogs / toasts (modal=how|add|suggest|weekly, toast=…) are mounted by the lead; this page only sets the URL keys.
 */
const SkillsLabHubPage = () => {
  const skills = useSkillsLabState();
  const [params] = useSearchParams();
  // Live by default (GET /skills-lab/labs …); `?demo=1` keeps the drawn mock.
  const live = useLiveHub({ enabled: !isSkillsLabDemo(params) });
  const summary = live ? live.response.summary : HUB_LABS_RESPONSE.summary;
  const loading = skills.state === 'loading' || live?.status === 'loading';
  const empty = skills.state === 'empty';

  useEffect(() => {
    log('mount', { tab: skills.tab, state: skills.state, cat: skills.cat, q: skills.q });
  }, [skills.tab, skills.state, skills.cat, skills.q]);

  const tabs = loading
    ? [
        { id: 'all', label: 'All labs' },
        { id: 'progress', label: 'In progress' },
        { id: 'verified', label: 'Verified' },
        { id: 'history', label: 'History' },
      ]
    : empty
      ? [
          { id: 'all', label: 'All labs', count: summary.labsTotal },
          { id: 'progress', label: 'In progress', count: 0 },
          { id: 'verified', label: 'Verified', count: 0 },
          { id: 'history', label: 'History' },
        ]
      : [
          { id: 'all', label: 'All labs', count: summary.labsTotal },
          { id: 'progress', label: 'In progress', count: summary.inProgress },
          { id: 'verified', label: 'Verified', count: summary.verified },
          { id: 'history', label: 'History' },
          { id: 'games', label: 'Games', count: summary.games },
        ];

  const onTab = (tab) =>
    skills.update({ tab: tab === 'all' ? null : tab, cat: null, q: null, search: null });

  let body;
  if (loading) body = <HubLoadingTab />;
  else if (empty) body = <HubEmptyTab skills={skills} />;
  else if (skills.tab === 'progress') body = <HubProgressTab skills={skills} />;
  else if (skills.tab === 'verified') body = <HubVerifiedTab skills={skills} />;
  else if (skills.tab === 'history') body = <HubHistoryTab skills={skills} />;
  else if (skills.tab === 'games') body = <GamesTabSlot skills={skills} />;
  else body = <HubAllTab skills={skills} />;

  const sticker = loading ? null : empty ? 'New here' : `${summary.verified} verified`;
  const subtitle =
    skills.tab === 'history' && !loading && !empty ? HUB_COPY.historySubtitle : HUB_COPY.subtitle;

  return (
    <HubDataProvider value={live}>
    <SkillsLabFrame skills={skills}>
      <div className="mx-auto flex w-full max-w-[1433px] flex-col gap-[24px] px-[clamp(12px,3vw,52px)] pt-[clamp(16px,1.85vw,32px)] pb-[24px]">
        <HubHeader
          sticker={sticker}
          subtitle={subtitle}
          xp={loading || empty ? null : summary.xp}
          onHow={() => skills.update({ modal: 'how' })}
        />
        <HubTabs
          tabs={tabs}
          tab={empty || loading ? 'all' : skills.tab}
          onTab={onTab}
          disabled={loading}
        />
        {live?.status === 'error' ? (
          <p role="alert" className="m-0 rounded-[12px] bg-[#fdecea] p-[12px] font-sans text-[14px] text-[#8a1c1c]">
            Could not load your labs. Check your connection and refresh.
          </p>
        ) : null}
        {body}
      </div>
      <SkillsLabDialogs skills={skills} />
    </SkillsLabFrame>
    </HubDataProvider>
  );
};

export default SkillsLabHubPage;
