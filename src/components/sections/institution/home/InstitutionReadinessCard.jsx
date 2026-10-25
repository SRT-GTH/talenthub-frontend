import { useEffect } from 'react';
import { debug } from '../../../../utils/debug.js';
import InstitutionButton from '../InstitutionButton.jsx';
import { READINESS_CARD as R } from './data/institutionHomeData.js';

const log = debug('InstitutionReadinessCard');

/*
 * InstitutionReadinessCard — "Student readiness" card of the home (Figma "National view snapshot" 8585:75, 1329 x ~100, white, 1.5 #e5e5e5, r16, p 18/24, gap 24):
 * eyebrow 11/13 600 #387440 · headline 20 600 #1c2a21 · class line 14 #575755 on the left, the "Open progress" button (md) on the right.
 * Below sm the button drops under the text. The numbers are mock (GET /institution/readiness?form=3).
 */

const InstitutionReadinessCard = ({ className }) => {
  useEffect(() => {
    log('mount', { pct: R.pct });
  }, []);
  return (
    <section
      aria-label="Student readiness"
      className={`flex flex-col items-start gap-[16px] rounded-[16px] border-[1.5px] border-solid border-[#e5e5e5] bg-white px-[24px] py-[18px] shadow-[0_1px_2px_rgba(15,15,10,0.05)] sm:flex-row sm:items-center sm:gap-[24px] ${className ?? ''}`}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-[4px]">
        <p className="m-0 font-sans text-[11px] leading-[13px] font-semibold tracking-[0.2px] text-[#387440] max-lg:text-[12px]">
          {R.eyebrow}
        </p>
        <h2 className="m-0 font-sans text-[clamp(16px,1.2vw+10px,20px)] leading-[1.25] font-semibold tracking-[0.2px] text-[#1c2a21]">
          {R.title.replace('{pct}', R.pct)}
        </h2>
        <p className="m-0 font-sans text-[14px] leading-[1.45] tracking-[0.2px] text-[#575755]">
          {R.classes.map((c) => `${c.name} ${c.pct}%`).join(' · ')}
        </p>
      </div>
      <InstitutionButton size="md" to={R.to}>
        {R.action}
      </InstitutionButton>
    </section>
  );
};

export default InstitutionReadinessCard;
