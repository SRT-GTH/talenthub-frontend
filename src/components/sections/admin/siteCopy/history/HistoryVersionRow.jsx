import { classNames } from '../../../../../utils/classNames.js';
import CopyChip from '../preview/CopyChip.jsx';
import { AVATAR_FALLBACK, AVATAR_TINTS } from '../preview/previewHistoryData.js';
import { changedLabels, initials } from '../preview/previewModel.js';

/*
 * HistoryVersionRow — one version of the history list (Figma 7.8.5a: r14, 1 px #e7e7e7, p14, gap14): the "v5" pill (live = #387440 / white, others #f8f8f4),
 * the 34 px avatar with the editor's initials (a "·" for the original), the reason as the title 15/600 (+ "Live now" / "Restored from version N" chips) and
 * the "who · when · changed fields" line 12.5/400 #575755, then Compare (white) and Restore (ink) — the live version has neither. The whole left cluster toggles the
 * compare panel (aria-expanded), so the live row can be compared too (7.8.5b). Restore needs `canRestore` (`session.copy.publish`).
 * Props: version, meta (sectionMeta), live, plain (7.8.5e colours of a never-edited section), expanded, canRestore, onToggle, onRestore.
 */
const HistoryVersionRow = ({
  version,
  meta,
  live,
  plain,
  expanded,
  canRestore,
  onToggle,
  onRestore,
}) => {
  const original = Boolean(version.original);
  const line = original
    ? `${version.when} · ${version.release ?? 'Release 2.0'} · All fields`
    : [version.who, version.when, changedLabels(version, meta).join(', ')]
        .filter(Boolean)
        .join(' · ');
  return (
    <li
      className={classNames(
        'flex flex-wrap items-center gap-x-[14px] gap-y-[10px] rounded-[14px] border border-solid p-[14px]',
        live ? 'bg-[#ebf1ec]/50' : 'bg-transparent',
        expanded ? 'border-2 border-[#387440]' : 'border-[#e7e7e7]'
      )}
    >
      <button
        type="button"
        aria-expanded={expanded}
        aria-label={`Version ${version.version}: ${version.why}. ${expanded ? 'Hide' : 'Show'} what changed`}
        onClick={onToggle}
        className="flex min-w-0 flex-1 basis-[260px] cursor-pointer items-center gap-[14px] border-0 bg-transparent p-0 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#387440]"
      >
        <span
          className={classNames(
            'inline-flex min-h-[28px] shrink-0 items-center rounded-full px-[10px] py-[6px] font-sans text-[13px] leading-[16px] font-bold',
            live ? 'bg-[#387440] text-white' : 'bg-[#f8f8f4] text-[#1c2a21]'
          )}
        >
          {`v${version.version}`}
        </span>
        <span
          aria-hidden="true"
          className={classNames(
            'inline-flex size-[34px] shrink-0 items-center justify-center rounded-full font-sans text-[12px] leading-[14px] font-bold text-[#1c2a21]',
            AVATAR_TINTS[version.who] ?? AVATAR_FALLBACK
          )}
        >
          {initials(version.who)}
        </span>
        <span className="flex min-w-0 flex-col gap-[3px]">
          <span className="flex flex-wrap items-center gap-[8px]">
            <span className="font-sans text-[15px] leading-[18px] font-semibold text-[#1c2a21]">
              {version.why}
            </span>
            {live ? <CopyChip tone={plain ? 'livePlain' : 'live'}>Live now</CopyChip> : null}
            {version.restoredFrom ? (
              <CopyChip tone="restored">{`Restored from version ${version.restoredFrom}`}</CopyChip>
            ) : null}
          </span>
          <span className="font-sans text-[12.5px] leading-[15px] text-[#575755]">{line}</span>
        </span>
      </button>
      {live ? null : (
        <span className="flex shrink-0 items-center gap-[10px]">
          <button
            type="button"
            aria-expanded={expanded}
            aria-label={`Compare version ${version.version}`}
            onClick={onToggle}
            className="inline-flex min-h-[34px] cursor-pointer items-center rounded-[10px] border border-solid border-[#e7e7e7] bg-white px-[12px] py-[8px] font-sans text-[13.5px] leading-[16px] font-semibold text-[#1c2a21] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
          >
            Compare
          </button>
          <button
            type="button"
            disabled={!canRestore}
            aria-label={`Restore version ${version.version}`}
            title={canRestore ? undefined : 'Your role can read the history but not publish'}
            onClick={onRestore}
            className="inline-flex min-h-[32px] cursor-pointer items-center rounded-[10px] border-0 bg-[#1c2a21] px-[12px] py-[8px] font-sans text-[13.5px] leading-[16px] font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Restore
          </button>
        </span>
      )}
    </li>
  );
};

export default HistoryVersionRow;
