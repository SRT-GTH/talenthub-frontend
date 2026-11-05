import { useEffect, useRef } from 'react';
import { debug } from '../../../../../utils/debug.js';
import { COPY_PATHS, copyUrl } from '../copyUrl.js';
import NamePageHeading from '../names/NamePageHeading.jsx';
import NamePrimaryAction from '../names/NamePrimaryAction.jsx';
import { placesOf, stampOf } from '../names/productNameRules.js';
import { useProductNames } from '../names/useProductNames.js';
import { classNames } from '../../../../../utils/classNames.js';

const log = debug('SuperAdminCopyHome');

/*
 * SuperAdminCopyHome — `/admin?role=super&copy=1` (Figma 7.8.6f "Super admin home · name change waiting"): the Super Admin's home when a Content Editor
 * has drafted a product-name change. "Good afternoon, Nana" + "4 approvals waiting · 1 product-name change", then the "Waiting for you" card with
 * the name change on top (cream, chip "Product name", "Drafted by Ama Owusu · today 14:40 · used on 280 places, emails and the assistant") and the
 * other approvals (Verification, Export), each with a green "Review". The real-data home (pages/admin/AdminHomePage.jsx) is not touched and its API
 * is not called: these rows are mock data; the name change reads the shared `product-names.renames` record, so a draft saved by the Content Editor
 * (or sitting in `?copy=1`, which seeds Ama's draft like a frame URL) shows here and a published one disappears.
 * ⚠️ ASSUMPTION: the greeting is fixed "Good afternoon" as drawn; "Review" of the two other approvals opens Verification / Reports; "4 approvals" is the persona's count.
 */
const OTHERS = [
  {
    id: 'partner',
    title: 'Approve partner: Northern Skills Foundation',
    chip: 'Verification',
    sub: 'KYB documents complete · 2 checks passed',
    to: '/admin/verification', // ⚠️ ASSUMPTION: no frame shows where it leads
  },
  {
    id: 'export',
    title: 'Export: Q3 health report (identifiable)',
    chip: 'Export',
    sub: 'Requested by Akua Sarfo · needs a second approver',
    to: '/admin/reports', // ⚠️ ASSUMPTION
  },
];

const Chip = ({ tone, children }) => (
  <span
    className={classNames(
      'inline-flex min-h-[32px] items-center rounded-full px-[14px] font-sans text-[13px] leading-[16px] font-semibold whitespace-nowrap',
      tone === 'name'
        ? 'bg-[#faf4e8] text-[#463409]'
        : 'border border-solid border-[#e1eae2] bg-white text-[#595959]'
    )}
  >
    {children}
  </span>
);

const WaitingRow = ({ tone, title, chip, sub, to, label }) => (
  <li
    className={classNames(
      'flex flex-wrap items-center gap-x-[14px] gap-y-[12px] rounded-[14px] p-[16px] sm:flex-nowrap',
      tone === 'name' ? 'bg-[#faf4e8]' : 'bg-[#f8f8f4]'
    )}
  >
    <div className="flex min-w-0 flex-1 basis-[220px] flex-col gap-[4px]">
      <div className="flex flex-wrap items-center gap-[8px]">
        <p className="m-0 font-sans text-[15px] leading-[18px] font-semibold text-[#1c2a21]">
          {title}
        </p>
        <Chip tone={tone}>{chip}</Chip>
      </div>
      <p className="m-0 font-sans text-[13px] leading-[16px] text-[#575755] max-lg:text-[13px]">
        {sub}
      </p>
    </div>
    <NamePrimaryAction to={to} aria-label={label}>
      Review
    </NamePrimaryAction>
  </li>
);

const SuperAdminCopyHome = ({ ctx, session }) => {
  const { list, renames, seed } = useProductNames();
  const seeded = useRef(false);
  const firstName = session.staff?.firstName ?? 'Nana';

  useEffect(() => {
    if (!seeded.current) {
      seeded.current = true;
      seed('draft');
    }
    log('mount', { role: ctx.role, copy: ctx.params.get('copy') });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const waiting = list
    .map((item) => ({ item, record: renames[item.id] }))
    .filter((r) => r.record?.status === 'draft');
  log('waiting name changes', waiting.length);

  return (
    <div className="flex flex-col gap-[24px] pt-[4px]">
      <NamePageHeading
        title={`Good afternoon, ${firstName}`}
        subtitle={`4 approvals waiting${waiting.length ? ` · ${waiting.length} product-name change` : ''}`}
      />
      <section
        aria-label="Waiting for you"
        className="flex flex-col gap-[12px] rounded-[20px] border border-solid border-[#1c2a21]/10 bg-white p-[16px] sm:p-[24px]"
      >
        <h2 className="m-0 font-sans text-[19px] leading-[23px] font-semibold text-[#1c2a21]">
          Waiting for you
        </h2>
        <ul className="m-0 flex list-none flex-col gap-[12px] p-0">
          {waiting.map(({ item, record }) => (
            <WaitingRow
              key={item.id}
              tone="name"
              title={`Rename ${item.name} → ${record.draft.name}`}
              chip="Product name"
              sub={`Drafted by ${record.by} · ${stampOf(record.at)} · used on ${placesOf(item.usage)} places, emails and the assistant`}
              to={copyUrl(ctx, `${COPY_PATHS.productNames}/${item.id}`)}
              label={`Review: rename ${item.name} to ${record.draft.name}`}
            />
          ))}
          {OTHERS.map((o) => (
            <WaitingRow
              key={o.id}
              tone="other"
              title={o.title}
              chip={o.chip}
              sub={o.sub}
              to={o.to}
              label={`Review: ${o.title}`}
            />
          ))}
        </ul>
      </section>
    </div>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const COPY_SCREENS = [
  {
    id: '7.8.6f',
    area: 'home',
    priority: 20,
    match: (ctx) => ctx.role === 'super' && ctx.params.get('copy') === '1',
    Component: SuperAdminCopyHome,
  },
];

export default SuperAdminCopyHome;
