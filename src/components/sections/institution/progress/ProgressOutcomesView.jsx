import { useCallback, useEffect, useState } from 'react';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import { apiMessage, progressOutcomes } from '../../../../services/institutionPortal.api.js';
import OutcomesSkillsCard from '../../publicData/outcomes/OutcomesSkillsCard.jsx';
import KpiStrip from '../../publicData/ui/KpiStrip.jsx';
import KpiTile from '../../publicData/ui/KpiTile.jsx';
import PublicCard from '../../publicData/ui/PublicCard.jsx';
import InstitutionButton from '../InstitutionButton.jsx';
import InstitutionPageHero from '../InstitutionPageHero.jsx';
import { useInstitutionSession } from '../useInstitutionSession.js';
import ProgressDownloadDialog from './ProgressDownloadDialog.jsx';
import ProgressPlacementsCard from './ProgressPlacementsCard.jsx';
import ProgressRatioCard from './ProgressRatioCard.jsx';
import { OUTCOMES_PAGE as D } from './data/progressData.js';

const log = debug('ProgressOutcomesView');

/*
 * ProgressOutcomesView — 11.3.2d "Class outcomes" (Figma 8745:47) + 11.3.2e download dialog (?modal=download).
 * Live: GET /institution/progress/outcomes?period=term|year|all (URL key ?period=, default year). The KPI strip (Placements · Applications · Skills
 * evidenced · Organisations), Applications per month (12 months), Applications by type, Skills evidenced (evidence by source) and Where students
 * applied (top organisations). Only roster students linked to GTH are counted (under-18s with a guardian's agreement); the Theme 8 cards mask counts
 * under 5. The Figma "Scholarships surfaced" KPI and "Stories from your alumni" are left out: there is no scholarship or story data yet (they come
 * with Programmes). Props: data (useInstitutionState()).
 */

// Below this many counted students the page shows no figures at all (a share or a chart of 1-4 students would point at individuals).
const MIN_GROUP = 5;

const niceMax = (values) => {
  const max = Math.max(0, ...values);
  if (max <= 5) return 5;
  const step = max <= 20 ? 5 : max <= 50 ? 10 : max <= 200 ? 50 : 100;
  return Math.ceil(max / step) * step;
};

const Empty = ({ id, title, text }) => (
  <PublicCard id={id} title={title}>
    <p className="m-0 font-sans text-[14px] leading-[20px] text-[#595959]">{text}</p>
  </PublicCard>
);

const ProgressOutcomesView = ({ data }) => {
  const session = useInstitutionSession();
  const period = D.periods.some((p) => p.id === data.params.get('period'))
    ? data.params.get('period')
    : 'year';
  const [o, setO] = useState(null);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setError('');
    setO(null);
    try {
      setO(await progressOutcomes(period));
    } catch (err) {
      setError(apiMessage(err));
    }
  }, [period]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    log('mount', { modal: data.modal, period });
  }, [data.modal, period]);

  const openDownload = () => data.update({ modal: 'download' });
  const closeDownload = () => data.update({ modal: null });
  const k = o?.kpis;
  const yMax = o ? niceMax(o.perMonth.map((m) => m.value)) : 5;
  const evidenceTotal = o ? o.skills.sources.reduce((a, s) => a + s.count, 0) : 0;

  return (
    <div className="flex flex-col gap-[16px] lg:gap-[30px]">
      <InstitutionPageHero
        title={D.title}
        subtitle={D.subtitle(session.institution.short || session.institution.name)}
        actions={
          <InstitutionButton size="sm" onClick={openDownload}>
            {D.download}
          </InstitutionButton>
        }
      />
      <div
        role="radiogroup"
        aria-label="Period"
        className="flex flex-wrap gap-[2px] self-start rounded-[10px] bg-[#efefea] p-[3px]"
      >
        {D.periods.map((p) => {
          const on = p.id === period;
          return (
            <button
              key={p.id}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() =>
                data.update({ period: p.id === 'year' ? null : p.id }, { replace: true })
              }
              className={classNames(
                'cursor-pointer rounded-[8px] border-0 px-[12px] py-[6px] font-sans text-[13px] leading-[16px] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#387440]',
                on
                  ? 'bg-white font-semibold text-[#1c2a21] shadow-[0_1px_3px_rgba(0,0,0,0.12)]'
                  : 'bg-transparent font-medium text-[#575755]'
              )}
            >
              {p.label}
            </button>
          );
        })}
      </div>
      {error ? (
        <p
          role="alert"
          className="m-0 rounded-[16px] border border-solid border-[#ebc2bd] bg-[#f9ebea] p-[16px] font-sans text-[14px] text-[#902b20]"
        >
          Could not load class outcomes: {error}{' '}
          <button type="button" onClick={load} className="cursor-pointer font-semibold underline">
            Try again
          </button>
        </p>
      ) : !o ? (
        <p className="m-0 font-sans text-[14px] text-[#595959]">Loading class outcomes…</p>
      ) : k.students < MIN_GROUP ? (
        <p className="m-0 rounded-[16px] border border-solid border-[#eedeb8] bg-[#faf4e8] p-[16px] font-sans text-[14px] leading-[20px] text-[#1c2a21]">
          {k.students === 0
            ? 'No students are counted yet. Students show here once they link their GTH account (under-18s once a guardian agrees).'
            : `Only ${k.students} ${k.students === 1 ? 'student is' : 'students are'} counted so far. Class outcomes appear once at least ${MIN_GROUP} students are linked, so no one can be picked out. Each student’s own progress is on the Progress page.`}
        </p>
      ) : (
        <>
          <KpiStrip columns={4}>
            <KpiTile
              eyebrow="Placements made"
              eyebrowShort="Placements"
              count={k.placements}
              sub={`Offers accepted · ${o.periodLabel.toLowerCase()}.`}
              subShort="Offers accepted."
              className="md:min-h-[166px]"
            />
            <KpiTile
              eyebrow="Applications"
              count={k.applications}
              sub={`From ${k.applicants} of ${k.students} students counted.`}
              subShort={`${k.applicants} students applied.`}
              className="md:min-h-[166px]"
            />
            <KpiTile
              eyebrow="Skills evidenced"
              value={`${Math.round(k.skillsShare * 100)}%`}
              sub="of students counted have at least one evidenced skill."
              subShort="with ≥1 evidenced skill."
              className="md:min-h-[166px]"
            />
            <KpiTile
              eyebrow="Organisations involved"
              eyebrowShort="Organisations"
              count={k.organisations}
              sub="Employers and providers your students applied to."
              subShort="Applied to."
              className="md:min-h-[166px]"
            />
          </KpiStrip>
          <div className="grid gap-[16px] md:gap-[24px] xl:grid-cols-[minmax(0,860fr)_minmax(0,445fr)]">
            <ProgressPlacementsCard series={o.perMonth} yMax={yMax} />
            {o.byType.length ? (
              <ProgressRatioCard
                id="class-by-type"
                title="Applications by type"
                hint={o.periodLabel}
                label="Applications by type"
                items={o.byType}
                note={
                  k.games
                    ? `${k.games} Skills Lab ${k.games === 1 ? 'game' : 'games'} completed by ${k.gamePlayers} ${k.gamePlayers === 1 ? 'student' : 'students'}.`
                    : undefined
                }
              />
            ) : (
              <Empty
                id="class-by-type"
                title="Applications by type"
                text="No applications in this period yet."
              />
            )}
          </div>
          <div className="grid items-start gap-[16px] md:gap-[24px] xl:grid-cols-2">
            {evidenceTotal ? (
              <OutcomesSkillsCard
                skills={{
                  count: o.skills.count,
                  caption: `students with ≥1 evidenced skill · ${Math.round(k.skillsShare * 100)}% of students counted`,
                  sourcesTitle: 'Where the evidence comes from',
                  sources: o.skills.sources.filter((s) => s.count > 0),
                }}
              />
            ) : (
              <Empty
                id="outcomes-skills"
                title="Skills evidenced"
                text="No skill evidence in this period yet. Assessments, Skills Lab games and Career Buddy chats add it."
              />
            )}
            {o.organisations.length ? (
              <ProgressRatioCard
                id="class-partners"
                title="Where students applied"
                hint={`${k.organisations} organisations`}
                label="Applications by organisation"
                items={o.organisations}
                gap={10}
                layout="inline"
              />
            ) : (
              <Empty
                id="class-partners"
                title="Where students applied"
                text="No applications in this period yet."
              />
            )}
          </div>
        </>
      )}
      {data.modal === 'download' ? (
        <ProgressDownloadDialog
          period={period}
          canNames={['admin', 'records'].includes(session.admin.roleKey)}
          onClose={closeDownload}
        />
      ) : null}
    </div>
  );
};

export default ProgressOutcomesView;
