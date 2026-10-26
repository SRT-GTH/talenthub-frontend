import AdminLoadNotice from '../../AdminLoadNotice.jsx';
import { useAdminData } from '../../useAdminData.js';
import { insightsAccessibility } from '../../../../../services/admin.api.js';
import { Note } from '../refdata/shared.jsx';
import { fmt, pctOf, roleLabel, when } from './insightsFormat.js';
import { Bars, Card, Kpi, Kpis } from './insightsUi.jsx';

/*
 * AccessibilityTab — Settings › Accessibility (Senior and Super Admin), read only, from
 * GET /api/admin/insights/accessibility: how many people saved accessibility and language settings
 * (users.metadata.settings, set in each person's own Settings) and which options they use. Counts only.
 */

const peopleCount = (n) => `${fmt(n)} ${n === 1 ? 'person' : 'people'}`;

const AccessibilityTab = () => {
  const q = useAdminData(() => insightsAccessibility(), []);
  const s = q.data;
  const people = s ? Object.values(s.people).reduce((a, b) => a + b, 0) : 0;
  const savedAny = s ? Object.values(s.saved).reduce((a, b) => a + b.settings, 0) : 0;

  return (
    <AdminLoadNotice loading={q.loading} error={q.error} status={q.status} onRetry={q.reload}>
      {s ? (
        <>
          <Note>
            People choose these in their own Settings › Accessibility and Language. This page counts
            them so the team knows what to design for. No one is named.
          </Note>
          <Card title="Who has set preferences">
            <Kpis>
              <Kpi
                label="People"
                value={fmt(people)}
                hint={Object.entries(s.people)
                  .map(([t, n]) => `${fmt(n)} ${roleLabel(t).toLowerCase()}`)
                  .join(' · ')}
              />
              <Kpi
                label="Saved any settings"
                value={fmt(savedAny)}
                hint={pctOf(savedAny, people)}
              />
              <Kpi
                label="Turned on accessibility options"
                value={fmt(s.withAccessibility)}
                hint={pctOf(s.withAccessibility, people)}
              />
            </Kpis>
          </Card>

          <Card
            title="Accessibility options in use"
            sub={`Share of the ${peopleCount(s.withAccessibility)} who saved accessibility settings.`}
          >
            <Bars
              rows={s.options.map((o) => ({ label: o.label, count: o.count }))}
              total={s.withAccessibility}
              empty="No one has saved accessibility settings yet."
            />
          </Card>

          <div className="grid grid-cols-2 gap-[20px] max-lg:grid-cols-1">
            <Card title="Text size">
              <Bars
                rows={s.textSize.map((r) => ({ label: `${r.value}%`, count: r.count }))}
                total={s.withAccessibility}
                empty="No one has changed text size."
              />
            </Card>
            <Card title="Extra time on timed tasks">
              <Bars
                rows={s.extraTime.map((r) => ({ label: String(r.value), count: r.count }))}
                total={s.withAccessibility}
                empty="No one has asked for extra time."
              />
            </Card>
          </div>

          <Card
            title="Language and data"
            sub={`From the ${peopleCount(s.data.saved)} who saved language settings.`}
          >
            <Bars
              rows={s.language.map((r) => ({ label: r.label, count: r.count }))}
              total={s.data.saved}
              empty="No one has chosen a language yet."
            />
            <Kpis>
              <Kpi
                label="Data saver on"
                value={fmt(s.data.dataSaver)}
                hint={pctOf(s.data.dataSaver, s.data.saved)}
              />
              <Kpi
                label="Download on Wi-Fi only"
                value={fmt(s.data.wifiOnly)}
                hint={pctOf(s.data.wifiOnly, s.data.saved)}
              />
            </Kpis>
            <h3 className="m-0 font-sans text-[15px] font-semibold text-[#1c2a21]">Videos</h3>
            <Bars
              rows={s.videos.map((r) => ({ label: String(r.value), count: r.count }))}
              total={s.data.saved}
              empty="No video preference saved yet."
            />
          </Card>
          <p className="m-0 font-sans text-[12px] text-[#737373]">Updated {when(s.generatedAt)}.</p>
        </>
      ) : null}
    </AdminLoadNotice>
  );
};

export default AccessibilityTab;
