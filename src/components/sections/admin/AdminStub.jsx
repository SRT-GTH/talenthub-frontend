import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { debug } from '../../../utils/debug.js';

const log = debug('AdminStub');

/*
 * AdminStub — placeholder body of an admin page that is not built yet (Figma canvas 8520:12). The page keeps the real chrome
 * (AdminFrame) so routes and URL state can be checked from day one; each section replaces the stub pages it owns.
 * Props: name (page title), frames (the Figma frames the page must cover).
 */
const AdminStub = ({ name, frames }) => {
  const { pathname, search } = useLocation();
  useEffect(() => {
    log('mount', { name, pathname, search });
  }, [name, pathname, search]);
  return (
    <section className="rounded-[16px] border border-dashed border-[#c1d4c4] bg-white p-[24px]">
      <p className="m-0 font-sans text-[12px] leading-[14px] font-semibold tracking-[0.72px] text-[#387440] uppercase">
        Not built yet
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

export default AdminStub;
