import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { classNames } from '../../../../../utils/classNames.js';
import CopyChip from '../preview/CopyChip.jsx';
import { PreviewEditIcon, PreviewInfoIcon } from '../preview/PreviewIcons.jsx';
import HistoryComparePanel from './HistoryComparePanel.jsx';
import HistoryVersionRow from './HistoryVersionRow.jsx';

/*
 * HistoryDetailPanel — the right card of the History screen (Figma 7.8.5a: white, r20, p24, gap12): breadcrumb "Public site › Home › Hero", the title
 * "History · Hero" + status chip + "Back to editor", the sentence about the last 50 versions, then the version rows newest first with the compare panel under the
 * row that is open. A section nobody edited (7.8.5e) shows the blue "No one has changed this section yet…" banner and its one live row, with the 7.8.5e colours.
 * Props: portalLabel, meta, versions (newest first), compare (version number or null), canRestore, backTo, onToggle(n), onRestore(n).
 */
const HistoryDetailPanel = ({
  portalLabel,
  meta,
  versions,
  compare,
  canRestore,
  backTo,
  onToggle,
  onRestore,
}) => {
  const edited = versions.length > 1;
  const live = versions[0]?.version;
  return (
    <section
      aria-label={`History of ${meta.label}`}
      className="flex min-w-0 flex-col gap-[12px] rounded-[20px] border border-solid border-[#1c2a21]/10 bg-white p-[clamp(16px,1.4vw,24px)]"
    >
      <div className="flex flex-col gap-[10px]">
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-[6px] font-sans text-[13px] leading-[16px] font-medium text-[#575755]"
        >
          <span>{portalLabel}</span>
          <span aria-hidden="true">›</span>
          <span>{meta.page}</span>
          <span aria-hidden="true">›</span>
          <span className="font-semibold text-[#1c2a21]" aria-current="page">
            {meta.label}
          </span>
        </nav>
        <div className="flex flex-wrap items-center gap-[10px]">
          <h2 className="m-0 font-sans text-[22px] leading-[26px] font-semibold text-[#1c2a21]">
            {`History · ${meta.label}`}
          </h2>
          <CopyChip tone={edited ? 'edited' : 'defaultPlain'}>
            {edited ? 'Edited' : 'Default'}
          </CopyChip>
          <span className="min-w-0 flex-1" />
          <Link
            to={backTo}
            className="inline-flex min-h-[34px] items-center gap-[6px] rounded-[10px] border border-solid border-[#e7e7e7] px-[12px] py-[8px] font-sans text-[13.5px] leading-[16px] font-semibold whitespace-nowrap text-[#1c2a21] no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
          >
            <PreviewEditIcon className="size-[16px] text-[#1c2a21]" />
            Back to editor
          </Link>
        </div>
      </div>
      {edited ? (
        <p className="m-0 font-sans text-[14px] leading-[21px] text-[#575755]">
          Every published version, newest first. We keep the last 50. Restoring makes an old version
          live again as a new version, so nothing is overwritten.
        </p>
      ) : (
        <div
          role="status"
          className="flex items-center gap-[12px] rounded-[16px] bg-[#eaeffb] p-[16px] font-sans text-[14px] leading-[20px] font-medium text-[#244a9f]"
        >
          <PreviewInfoIcon className="size-[18px] shrink-0" />
          No one has changed this section yet. It shows the original text from the design.
        </div>
      )}
      <ol
        className={classNames(
          'm-0 flex list-none flex-col p-0',
          edited ? 'gap-[12px]' : 'gap-[12px]'
        )}
      >
        {versions.map((v) => (
          <Fragment key={v.version}>
            <HistoryVersionRow
              version={v}
              meta={meta}
              live={v.version === live}
              plain={!edited}
              expanded={compare === v.version}
              canRestore={canRestore}
              onToggle={() => onToggle(v.version)}
              onRestore={() => onRestore(v.version)}
            />
            {compare === v.version ? (
              <li className="list-none">
                <HistoryComparePanel versions={versions} version={v.version} meta={meta} />
              </li>
            ) : null}
          </Fragment>
        ))}
      </ol>
    </section>
  );
};

export default HistoryDetailPanel;
