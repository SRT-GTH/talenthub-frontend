import { useState } from 'react';
import { debug } from '../../../../utils/debug.js';
import AgencyButton from '../../agency/AgencyButton.jsx';
import AgencyPageHero from '../../agency/AgencyPageHero.jsx';
import BarList from '../../publicData/ui/BarList.jsx';
import BarRow from '../../publicData/ui/BarRow.jsx';
import CardSubhead from '../../publicData/ui/CardSubhead.jsx';
import ColumnBars from '../../publicData/ui/ColumnBars.jsx';
import HeroMetric from '../../publicData/ui/HeroMetric.jsx';
import KpiStrip from '../../publicData/ui/KpiStrip.jsx';
import KpiTile from '../../publicData/ui/KpiTile.jsx';
import PublicCard from '../../publicData/ui/PublicCard.jsx';
import StackedBar from '../../publicData/ui/StackedBar.jsx';
import TodayStrip from '../../publicData/ui/TodayStrip.jsx';
import { LIVE } from './data/adminLiveOpsData.js';

const log = debug('AdminLiveOps');

/*
 * AdminLiveOps — /admin/live-ops (Figma 7.3.3a): green hero "Live ops" + "Pause updates" · filter strip · KPI row (People online now + three tiles) · "Active users by region" +
 * "What people are doing" · Devices + Alerts · "LIVE · NOW" strip. Reuses the Theme 8 hero / KPI / bar / stacked-bar / column blocks.
 * ⚠️ ASSUMPTION: the filter chips and "Mute alerts" are inert (logged); the map is a tile schematic with the drawn bins.
 * Props: onOpenAlert() — the Volta tile opens the anomaly alert dialog (7.3.3b).
 */

const maxOf = (rows) => Math.max(1, ...rows.map((r) => r[1]));

const AdminLiveOps = ({ onOpenAlert }) => {
  const [paused, setPaused] = useState(false);
  const binColor = (id) => LIVE.map.bins.find((b) => b.id === id)?.color;
  const activityMax = maxOf(LIVE.activity.rows);
  const alertsMax = maxOf(LIVE.alerts.rows);
  const inert = (what) => () => log('inert (no backend in the mock):', what);
  return (
    <div className="flex flex-col gap-[30px]">
      <AgencyPageHero
        title={LIVE.title}
        subtitle={LIVE.subtitle}
        actions={
          <AgencyButton
            onClick={() => {
              log('pause toggled', !paused);
              setPaused((v) => !v);
            }}
          >
            {paused ? LIVE.resume : LIVE.pause}
          </AgencyButton>
        }
      />
      <div className="flex flex-wrap items-center gap-[10px] font-sans text-[14px] leading-[17px] text-[#1c2a21]">
        {LIVE.filters.map((f) => (
          <button
            key={f}
            type="button"
            onClick={inert(`filter ${f}`)}
            className="cursor-pointer rounded-full border border-solid border-[#e7e7e7] bg-white px-[14px] py-[9px] font-medium"
          >
            {f}
          </button>
        ))}
        <span className="ml-auto font-semibold">{LIVE.online}</span>
        <button
          type="button"
          onClick={inert('clear all')}
          className="cursor-pointer border-0 bg-transparent font-semibold text-[#387440]"
        >
          {LIVE.clear}
        </button>
        <button
          type="button"
          onClick={inert('mute alerts')}
          className="cursor-pointer border-0 bg-transparent font-semibold text-[#387440]"
        >
          {LIVE.mute}
        </button>
      </div>
      <KpiStrip
        columns={3}
        hero={
          <HeroMetric
            eyebrow={LIVE.hero.eyebrow}
            count={LIVE.hero.count}
            label={LIVE.hero.label}
            change={LIVE.hero.change}
            note={LIVE.hero.note}
            series={LIVE.hero.series}
            seriesLabel="People online over the last hours"
          />
        }
      >
        {LIVE.kpis.map((k) => (
          <KpiTile key={k.id} eyebrow={k.eyebrow} value={k.value} sub={k.sub} />
        ))}
      </KpiStrip>
      <div className="grid grid-cols-1 gap-[24px] xl:grid-cols-2">
        <PublicCard title={LIVE.map.title} hint={LIVE.map.hint}>
          <ul className="m-0 grid list-none grid-cols-2 gap-[8px] p-0 sm:grid-cols-3">
            {LIVE.map.regions.map((r) => {
              const hot = r.bin === 'o300' || r.bin === 'b300';
              const isAlert = r.id === 'volta';
              const Tag = isAlert ? 'button' : 'div';
              return (
                <li key={r.id}>
                  <Tag
                    {...(isAlert ? { type: 'button', onClick: onOpenAlert } : {})}
                    className="flex h-[64px] w-full flex-col justify-center rounded-[12px] border-0 px-[12px] text-left font-sans"
                    style={{
                      background: binColor(r.bin),
                      color: hot ? '#fff' : '#1c2a21',
                      cursor: isAlert ? 'pointer' : 'default',
                    }}
                  >
                    <span className="text-[12px] leading-[14px] font-medium">{r.name}</span>
                    <span className="text-[18px] leading-[22px] font-bold">
                      {r.bin === 'hid' ? '—' : r.count}
                    </span>
                  </Tag>
                </li>
              );
            })}
          </ul>
          <ul
            aria-label="Map legend"
            className="m-0 mt-[16px] flex list-none flex-wrap gap-x-[14px] gap-y-[6px] p-0 font-sans text-[12px] leading-[14px] text-[#595959]"
          >
            {LIVE.map.bins.map((b) => (
              <li key={b.id} className="inline-flex items-center gap-[6px]">
                <span
                  aria-hidden="true"
                  className="size-[10px] rounded-[3px] border border-solid border-[#e7e7e7]"
                  style={{ background: b.color }}
                />
                {b.label}
              </li>
            ))}
          </ul>
        </PublicCard>
        <PublicCard title={LIVE.activity.title} hint={LIVE.activity.hint}>
          <BarList label={LIVE.activity.title} gap={10}>
            {LIVE.activity.rows.map(([label, count]) => (
              <BarRow key={label} label={label} count={count} ratio={count / activityMax} />
            ))}
          </BarList>
        </PublicCard>
        <PublicCard
          title={LIVE.devices.title}
          hint={LIVE.devices.hint}
          bodyClassName="flex flex-col gap-[20px] px-[16px] pb-[24px] md:px-[24px]"
        >
          <StackedBar
            segments={LIVE.devices.platforms}
            height={28}
            showShare
            ariaLabel="Platforms right now"
          />
          <CardSubhead label={LIVE.devices.responseTitle} aside={LIVE.devices.responseAside} />
          <ColumnBars
            items={LIVE.devices.response}
            total={100}
            ariaLabel="Response time by service"
          />
        </PublicCard>
        <PublicCard
          title={LIVE.alerts.title}
          hint={LIVE.alerts.hint}
          bodyClassName="flex flex-col gap-[20px] px-[16px] pb-[24px] md:px-[24px]"
        >
          <BarList label={LIVE.alerts.title} gap={10}>
            {LIVE.alerts.rows.map(([label, pct]) => (
              <BarRow
                key={label}
                label={label}
                valueText={`${pct}%`}
                ratio={pct / alertsMax}
                layout="inline"
              />
            ))}
          </BarList>
          <CardSubhead label={LIVE.alerts.statusTitle} />
          <StackedBar
            segments={LIVE.alerts.status}
            height={12}
            radius={4}
            legend="shares"
            ariaLabel="Alert status"
          />
        </PublicCard>
      </div>
      <TodayStrip title="Today on GTH" eyebrow={LIVE.today.eyebrow} stats={LIVE.today.stats} />
    </div>
  );
};

export default AdminLiveOps;
