import { useEffect, useState } from 'react';
import ParentButton from '../../ParentButton.jsx';
import TabCard from './TabCard.jsx';
import TabRow from './TabRow.jsx';
import { ICONS } from './data/tabsData.js';
import { fetchParentEvaluations, parentError } from '../../../../../services/parent.api.js';
import { shortDay } from '../../live/parentLiveView.js';

/*
 * LiveEvaluationsTab — the ward page's Evaluations tab for a signed-in parent: this parent's evaluations of this ward
 * (GET /parent/evaluations), newest first. A draft opens the question screens where it stopped; a sent one opens its
 * result. The ward's own review of each item (accept / flag) shows once the ward-side review screen exists.
 */
const STATUS = {
  pending: 'Draft · not sent',
  submitted: 'Sent · waiting for review',
  approved: 'On their profile',
  rejected: 'Hidden by them',
};

const LiveEvaluationsTab = ({ ward }) => {
  const [rows, setRows] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    fetchParentEvaluations()
      .then((all) => setRows((all.evaluations || []).filter((e) => e.wardId === ward.id)))
      .catch((err) => setError(parentError(err)));
  }, [ward.id]);

  return (
    <TabCard title="Evaluations" variant="label" id="tab-evaluations">
      {error ? <p className="m-0 font-sans text-[14px] text-[#c0392b]">{error}</p> : null}
      {!rows && !error ? (
        <p className="m-0 font-sans text-[14px] text-[#575755]">Loading…</p>
      ) : null}
      {rows && rows.length === 0 ? (
        <p className="m-0 font-sans text-[14px] text-[#575755]">
          You haven’t evaluated {ward.firstName} yet. {ward.firstName} reviews each evaluation
          before it shows on their profile.
        </p>
      ) : null}
      {rows && rows.length ? (
        <ul className="m-0 flex list-none flex-col gap-[8px] p-0">
          {rows.map((e, i) => (
            <TabRow
              key={e.id}
              icon={ICONS.clipboard}
              title={e.kindLabel}
              sub={[STATUS[e.status] || e.status, shortDay(e.submittedAt || e.createdAt)]
                .filter(Boolean)
                .join(' · ')}
              last={i === rows.length - 1}
            >
              <ParentButton
                variant="secondary"
                to={
                  e.status === 'pending'
                    ? `/parent/evaluate/questions?id=${e.id}`
                    : `/parent/evaluate/result?id=${e.id}`
                }
              >
                {e.status === 'pending' ? 'Continue' : 'Open'}
              </ParentButton>
            </TabRow>
          ))}
        </ul>
      ) : null}
      <div>
        <ParentButton to="/parent/evaluate">Evaluate {ward.firstName}</ParentButton>
      </div>
    </TabCard>
  );
};

export default LiveEvaluationsTab;
