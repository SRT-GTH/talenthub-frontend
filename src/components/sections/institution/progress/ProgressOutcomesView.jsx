import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { debug } from '../../../../utils/debug.js';
import OutcomesSkillsCard from '../../publicData/outcomes/OutcomesSkillsCard.jsx';
import OutcomesStoryDetail from '../../publicData/outcomes/OutcomesStoryDetail.jsx';
import { findStory, getOutcomeStories } from '../../publicData/outcomes/data/outcomesData.js';
import KpiStrip from '../../publicData/ui/KpiStrip.jsx';
import KpiTile from '../../publicData/ui/KpiTile.jsx';
import InstitutionButton from '../InstitutionButton.jsx';
import InstitutionPageHero from '../InstitutionPageHero.jsx';
import { INSTITUTION_BASE } from '../institutionNav.js';
import ProgressDownloadDialog from './ProgressDownloadDialog.jsx';
import ProgressPlacementsCard from './ProgressPlacementsCard.jsx';
import ProgressRatioCard from './ProgressRatioCard.jsx';
import ProgressStoriesSection from './ProgressStoriesSection.jsx';
import { OUTCOMES_PAGE as D } from './data/progressData.js';

const log = debug('ProgressOutcomesView');

/*
 * ProgressOutcomesView — 11.3.2d "Class outcomes" (Figma 8745:47) + 11.3.2e download dialog (?modal=download): green hero ("Class outcomes" + "Download report"),
 * the KPI strip (Placements made 401 · Scholarships surfaced GHS 184K · Skills evidenced 38 % · Organisations involved 27), Placements over time (0-50
 * axis) + Placements by type, Skills evidenced + Partner ecosystem, "Stories from your alumni". The cards are the Theme 8 outcomes cards with the
 * institution figures; the charts keep their sr-only table equivalents. Counts through formatCount (the KPI tiles / BarRow).
 * URL keys: modal=download · story=<id> (the Theme 8 story page, ⚠️ ASSUMPTION: story pages are not drawn for the institution; the story links of the
 * cards are turned into this key so no link leaves the portal). Props: data (useInstitutionState()).
 */

const ProgressOutcomesView = ({ data }) => {
  const navigate = useNavigate();
  const storyId = data.params.get('story');
  const story = storyId ? findStory(storyId) : null;

  useEffect(() => {
    log('mount', { modal: data.modal, story: storyId });
  }, [data.modal, storyId]);

  // Story links of the Theme 8 cards point to <base>/outcomes/stories/<id>: keep them inside the page.
  const onClickCapture = useCallback(
    (event) => {
      const anchor = event.target.closest?.('a[href*="/outcomes/stories/"]');
      if (!anchor) return;
      event.preventDefault();
      event.stopPropagation();
      const id = anchor.getAttribute('href').split('/outcomes/stories/')[1];
      log('story', id);
      data.update({ story: id });
    },
    [data]
  );

  const openDownload = () => data.update({ modal: 'download' });
  const closeDownload = () => data.update({ modal: null });

  return (
    <div className="flex flex-col gap-[16px] lg:gap-[30px]" onClickCapture={onClickCapture}>
      <InstitutionPageHero
        title={story ? 'Case study' : D.title}
        subtitle={D.subtitle}
        actions={
          story ? (
            <InstitutionButton size="sm" onClick={() => data.update({ story: null })}>
              Back to class outcomes
            </InstitutionButton>
          ) : (
            <InstitutionButton size="sm" onClick={openDownload}>
              {D.download}
            </InstitutionButton>
          )
        }
      />
      {story ? (
        <OutcomesStoryDetail
          story={story}
          others={getOutcomeStories().filter((s) => s.id !== story.id)}
          base={`${INSTITUTION_BASE}/progress`}
          embedded
        />
      ) : (
        <>
          <KpiStrip columns={4}>
            <KpiTile
              eyebrow="Placements made"
              eyebrowShort="Placements"
              count={D.kpis.placements.count}
              sub={D.kpis.placements.sub}
              subShort={D.kpis.placements.sub}
              className="md:min-h-[166px]"
            />
            <KpiTile
              eyebrow="Scholarships surfaced"
              eyebrowShort="Scholarships"
              value={D.kpis.scholarships.valueText}
              sub={D.kpis.scholarships.sub}
              subShort={D.kpis.scholarships.sub}
              className="md:min-h-[166px]"
            />
            <KpiTile
              eyebrow="Skills evidenced"
              value={D.kpis.skills.shareText}
              sub={D.kpis.skills.sub}
              subShort={D.kpis.skills.sub}
              className="md:min-h-[166px]"
            />
            <KpiTile
              eyebrow="Organisations involved"
              eyebrowShort="Organisations"
              count={D.kpis.organisations.count}
              sub={D.kpis.organisations.sub}
              subShort={D.kpis.organisations.sub}
              className="md:min-h-[166px]"
            />
          </KpiStrip>
          <div className="grid gap-[16px] md:gap-[24px] xl:grid-cols-[minmax(0,860fr)_minmax(0,445fr)]">
            <ProgressPlacementsCard series={D.placementsOverTime} />
            <ProgressRatioCard
              id="class-by-type"
              title="Placements by type"
              hint="Last 12 months"
              label="Placements by type"
              items={D.placementsByType}
              note={D.averageTimeNote}
            />
          </div>
          <div className="grid items-start gap-[16px] md:gap-[24px] xl:grid-cols-2">
            <OutcomesSkillsCard skills={D.skills} />
            <ProgressRatioCard
              id="class-partners"
              title="Partner ecosystem"
              hint={D.partners.hint}
              label="Organisations by type"
              items={D.partners.items}
              gap={10}
              layout="inline"
            />
          </div>
          <ProgressStoriesSection base={`${INSTITUTION_BASE}/progress`} />
        </>
      )}
      {data.modal === 'download' ? (
        <ProgressDownloadDialog
          onClose={closeDownload}
          onDone={() => {
            closeDownload();
            window.open(`${INSTITUTION_BASE}/report?page=1&print=1`, '_blank', 'noopener');
            navigate(`${INSTITUTION_BASE}/progress/class-outcomes`, { replace: true });
          }}
        />
      ) : null}
    </div>
  );
};

export default ProgressOutcomesView;
