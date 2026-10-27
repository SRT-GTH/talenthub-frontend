import { debug } from '../../../../../utils/debug.js';
import FilterChips from './FilterChips.jsx';
import TabCard from './TabCard.jsx';
import TabRow from './TabRow.jsx';
import { ICONS, activityData } from './data/tabsData.js';

const log = debug('ActivityTab');

/*
 * ActivityTab — PW-13 10049:1713, content under the ward header + tabs: one 1329-wide column, gap 20.
 * Filter chips (All / Learning / Skills / Clubs / Volunteering), then two cards "This week" and "Earlier" (11/700 uppercase labels) of icon-tile rows without trailing chips.
 * Props: ward (wardsData entry; the rows are the same mock set for every ward).
 */
const ActivityTab = ({ ward }) => {
  const d = activityData();
  log('render, ward:', ward?.id, 'groups:', d.groups.length);
  return (
    <div className="flex w-full min-w-0 flex-col gap-[20px]">
      <FilterChips items={d.filters} label="Filter activity" />
      {d.groups.map((g) => (
        <TabCard key={g.id} title={g.label} variant="label" id={`activity-${g.id}`}>
          <ul className="m-0 flex list-none flex-col p-0">
            {g.rows.map((r, i) => (
              <TabRow
                key={r.id}
                icon={ICONS[r.icon]}
                title={r.title}
                sub={r.sub}
                last={i === g.rows.length - 1}
              />
            ))}
          </ul>
        </TabCard>
      ))}
    </div>
  );
};

export default ActivityTab;
