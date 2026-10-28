import { useNavigate } from 'react-router-dom';
import { debug } from '../../../../../utils/debug.js';
import ParentButton from '../../ParentButton.jsx';
import WardChip from '../WardChip.jsx';
import TabCard from './TabCard.jsx';
import TabRow from './TabRow.jsx';
import { ICONS, evaluationsData } from './data/tabsData.js';

const log = debug('EvaluationsTab');

/*
 * EvaluationsTab — PW-11 10049:769, content under the ward header + tabs: one 1329-wide column, gap 20.
 * Card 1 "Evaluations on Abena’s profile" (10049:1163): three rows (clipboard / user-check / users tiles) with a 32px status chip.
 * Card 2 "Add another view of Abena" (10049:1210): 13/1.45 copy + primary "Evaluate Abena" and secondary "Invite a teacher" 3D buttons.
 * Props: ward (wardsData entry).
 * ⚠️ ASSUMPTION: the two buttons only log (Figma draws no evaluate / invite screen).
 */
const EvaluationsTab = ({ ward }) => {
  const navigate = useNavigate();
  const d = evaluationsData(ward);
  log('render, ward:', ward.id, 'rows:', d.rows.length);
  return (
    <div className="flex w-full min-w-0 flex-col gap-[20px]">
      <TabCard title={d.title} id="ev-list-title">
        <ul className="m-0 flex list-none flex-col gap-[8px] p-0">
          {d.rows.map((r, i) => (
            <TabRow
              key={r.id}
              icon={ICONS[r.icon]}
              title={r.title}
              sub={r.sub}
              last={i === d.rows.length - 1}
            >
              <WardChip tone={r.chip.tone}>{r.chip.label}</WardChip>
            </TabRow>
          ))}
        </ul>
      </TabCard>
      <TabCard title={d.add.title} id="ev-add-title" gap={12}>
        <p className="m-0 font-sans text-[13px] leading-[1.45] text-[#575755]">{d.add.body}</p>
        <div className="flex flex-wrap items-center gap-[12px] py-[7px]">
          <ParentButton
            onClick={() => {
              log('evaluate', ward.id);
              navigate('/parent/evaluate');
            }}
          >
            {d.add.primary}
          </ParentButton>
          <ParentButton variant="secondary" onClick={() => log('invite a teacher', ward.id)}>
            {d.add.secondary}
          </ParentButton>
        </div>
      </TabCard>
    </div>
  );
};

export default EvaluationsTab;
