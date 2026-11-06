import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { debug } from '../../../../../utils/debug.js';
import { copyUrl, COPY_PATHS } from '../copyUrl.js';
import { HistoryIcon, LockIcon } from '../fields/FieldsIcons.jsx';
import PagesTreeCard from '../fieldsHost/PagesTreeCard.jsx';
import PortalTabsRow from '../fieldsHost/PortalTabsRow.jsx';
import TreeStatusChip from '../fieldsHost/TreeStatusChip.jsx';
import { PUBLIC_PAGES } from '../fieldsHost/pagesTreeData.js';
import { SETTINGS_ROLE_LABELS } from '../roles/settingsMockData.js';

const log = debug('ReadOnlySiteCopy');

/*
 * ReadOnlySiteCopy — Platform Admin 7.8.7c "Read-only view · Support agent can look, not edit" (Figma 7.8.7c).
 *   /admin/site-copy?role=support&view=readonly          Home › Hero as a Support Agent sees it (also works for ?role=moderator)
 * Drawn exactly as the frame, inside a screen of its own so it wins for that URL only (priority 50): the sub copy "Read-only · Support Agent", the portal tabs + search, the "Pages" tree, and the
 * card "Hero" with the grey banner "You can view site copy but not change it. Ask a content editor if something needs updating.", the four fields as plain boxes (Headline, Supporting line,
 * Main button text, Second button text) and only "History" (no Preview, no Publish bar). It is shown when the role has Read but not Edit (`session.copy.edit === false`).
 * ⚠️ ASSUMPTION: mock content (the four values are as drawn); for a role with Edit this URL still shows the read-only view (the URL asks for it); the tree links go to the real editor routes.
 */
const HERO_ID = 'public.home.hero';
const FIELDS = [
  { id: 'headline', label: 'Headline', value: 'Find work that fits you' },
  {
    id: 'supporting',
    label: 'Supporting line',
    value: 'Show what you can do, get verified skills and connect with employers across Ghana.',
  },
  { id: 'main-button', label: 'Main button text', value: 'Create my profile' },
  { id: 'second-button', label: 'Second button text', value: 'See how it works' },
];

const ReadOnlySiteCopy = ({ ctx, session }) => {
  const roleLabel = SETTINGS_ROLE_LABELS[session.role] ?? SETTINGS_ROLE_LABELS.support;

  useEffect(() => {
    log('mount', { role: session.role, edit: session.copy?.edit });
  }, [session.role, session.copy?.edit]);

  return (
    <div className="flex flex-col gap-[24px] pt-[16px]">
      <header className="flex flex-col gap-[3px]">
        <h1 className="m-0 font-sans text-[clamp(28px,1.97vw,34px)] leading-[41px] font-semibold tracking-[-0.68px] text-[#1c2a21]">
          Site copy
        </h1>
        <p className="m-0 font-sans text-[16px] leading-[24px] tracking-[0.2px] text-[#595959] max-sm:text-[14px]">
          Read-only · {roleLabel}
        </p>
      </header>

      <div className="flex flex-col gap-[24px]">
        <PortalTabsRow ctx={ctx} active="public" />
        <div className="flex items-start gap-[24px] max-lg:flex-col max-lg:gap-[16px]">
          <PagesTreeCard
            pages={PUBLIC_PAGES}
            selectedId={HERO_ID}
            hrefFor={(id) =>
              id === HERO_ID
                ? copyUrl(ctx, COPY_PATHS.siteCopy, { view: 'readonly' })
                : copyUrl(ctx, COPY_PATHS.section(id))
            }
          />
          <section
            aria-label="Hero section (read-only)"
            className="flex min-w-0 flex-1 flex-col gap-[20px] rounded-[20px] border border-solid border-[#1c2a21]/10 bg-white p-[24px] max-sm:p-[16px] max-lg:w-full"
          >
            <div className="flex flex-col gap-[10px]">
              <nav
                aria-label="Breadcrumb"
                className="flex flex-wrap items-center gap-[6px] font-sans text-[13px] leading-[16px] font-medium text-[#575755]"
              >
                <span>Public site</span>
                <span aria-hidden="true">›</span>
                <span>Home</span>
                <span aria-hidden="true">›</span>
                <span aria-current="page" className="font-semibold text-[#1c2a21]">
                  Hero
                </span>
              </nav>
              <div className="flex flex-wrap items-center gap-[10px]">
                <h2 className="m-0 font-sans text-[22px] leading-[26px] font-semibold text-[#1c2a21]">
                  Hero
                </h2>
                <TreeStatusChip status="edited" />
                <span className="flex-1" />
                <Link
                  to={copyUrl(ctx, COPY_PATHS.history(HERO_ID))}
                  className="inline-flex min-h-[34px] items-center gap-[6px] rounded-[10px] border border-solid border-[#e7e7e7] px-[12px] py-[8px] font-sans text-[13.5px] leading-[16px] font-semibold text-[#1c2a21] no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
                >
                  <HistoryIcon className="size-[16px]" />
                  History
                </Link>
              </div>
            </div>

            <div
              role="note"
              className="flex items-start gap-[12px] rounded-[16px] bg-[#f8f8f4] p-[16px]"
            >
              <LockIcon className="mt-[1px] size-[18px] shrink-0 text-[#387440]" />
              <p className="m-0 min-w-0 font-sans text-[14px] leading-[20px] font-medium text-[#575755]">
                You can view site copy but not change it. Ask a content editor if something needs
                updating.
              </p>
            </div>

            <dl className="m-0 flex flex-col gap-[20px]">
              {FIELDS.map((f) => (
                <div key={f.id} className="flex flex-col gap-[6px]">
                  <dt className="font-sans text-[13px] leading-[16px] font-semibold text-[#575755]">
                    {f.label}
                  </dt>
                  <dd className="m-0 rounded-[12px] bg-[#f8f8f4] px-[14px] py-[12px] font-sans text-[15px] leading-[18px] break-words text-[#1c2a21]">
                    {f.value}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        </div>
      </div>
    </div>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const COPY_SCREENS = [
  {
    id: '7.8.7c',
    area: 'site-copy',
    priority: 50,
    match: (ctx) => ctx.segments.length === 0 && ctx.params.get('view') === 'readonly',
    Component: ReadOnlySiteCopy,
  },
];

export default ReadOnlySiteCopy;
