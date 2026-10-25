import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { debug } from '../../../utils/debug.js';

const log = debug('AgencyStub');

/*
 * AgencyStub — placeholder body of an agency page that is not built yet (Figma canvas 8605:395409). The page keeps the real chrome
 * (AgencyFrame) so routes and URL state can be checked from day one; each work package replaces the stub pages it owns.
 * Props: name (page title), owner (package letter A-E), frames (the Figma frames the page must cover).
 */
const PACKAGES = {
  A: 'Package A · home, sign-up, MoU, welcome',
  B: 'Package B · national data, regions, compare, outcomes, methodology, demand & outcomes',
  C: 'Package C · queries, programmes, applicants, districts',
  D: 'Package D · data requests, briefing packs, report print',
  E: 'Package E · settings, profile menu, public agency page',
};

const AgencyStub = ({ name, owner, frames }) => {
  const { pathname, search } = useLocation();
  useEffect(() => {
    log('mount', { name, owner, pathname, search });
  }, [name, owner, pathname, search]);
  return (
    <section className="rounded-[16px] border border-dashed border-[#c1d4c4] bg-white p-[24px]">
      <p className="m-0 font-sans text-[12px] leading-[14px] font-semibold tracking-[0.72px] text-[#387440] uppercase">
        Not built yet · {PACKAGES[owner] ?? owner}
      </p>
      <h1 className="mt-[8px] mb-0 font-sans text-[20px] leading-[24px] font-semibold text-[#1c2a21]">
        {name}
      </h1>
      <p className="mt-[8px] mb-0 font-sans text-[14px] leading-[20px] text-[#595959]">{frames}</p>
      <p className="mt-[8px] mb-0 font-sans text-[12px] leading-[16px] text-[#595959]">
        {pathname}
        {search}
      </p>
    </section>
  );
};

export default AgencyStub;
