import { classNames } from '../../../../../utils/classNames.js';
import { compareRows, wordDiff } from '../preview/previewModel.js';

/*
 * HistoryComparePanel — "What changed in version N" under a version row (Figma 7.8.5b: white, r20, 1 px ink@10, p20, gap14): per changed field the caps label
 * (13/700 ls .26 #575755) and two columns, "VERSION 4 · BEFORE" on #f8f8f4 and "VERSION 5 · AFTER" on #f9ebea@50 where the changed words are red (#b42318) and
 * underlined, then "Only fields that changed are shown. 3 other fields are the same.". The original version (no version before it) shows its text in one column.
 * Props: versions (all versions, any order), version (the one compared), meta (sectionMeta).
 */
const Column = ({ tone, label, children }) => (
  <div
    className={classNames(
      'flex min-w-0 flex-col gap-[6px] rounded-[12px] p-[14px]',
      tone === 'after' ? 'bg-[#f9ebea]/50' : 'bg-[#f8f8f4]'
    )}
  >
    <span
      className={classNames(
        'font-sans text-[12px] leading-[14px] font-bold',
        tone === 'after' ? 'text-[#c0392b]' : 'text-[#575755]'
      )}
    >
      {label}
    </span>
    <span className="font-sans text-[16px] leading-[22px] font-semibold break-words text-[#1c2a21]">
      {children}
    </span>
  </div>
);

const HistoryComparePanel = ({ versions, version, meta }) => {
  const v = versions.find((x) => x.version === version);
  const previous = versions
    .filter((x) => x.version < version)
    .sort((a, b) => b.version - a.version)[0];
  const { rows, same } = compareRows(versions, version, meta);
  const original = Boolean(v?.original) || !previous;
  return (
    <section
      aria-label={`What changed in version ${version}`}
      className="flex flex-col gap-[14px] rounded-[20px] border border-solid border-[#1c2a21]/10 bg-white p-[20px]"
    >
      <h3 className="m-0 font-sans text-[17px] leading-[20px] font-semibold text-[#1c2a21]">
        {original ? `Original text in version ${version}` : `What changed in version ${version}`}
      </h3>
      {rows.map((r) => (
        <div key={r.key} className="flex flex-col gap-[8px]">
          <span className="font-sans text-[13px] leading-[16px] font-bold tracking-[0.26px] text-[#575755] uppercase">
            {r.label}
          </span>
          {original ? (
            <Column tone="before" label={`VERSION ${version} · ORIGINAL`}>
              {r.after}
            </Column>
          ) : (
            <div className="grid grid-cols-1 gap-[12px] sm:grid-cols-2">
              <Column tone="before" label={`VERSION ${previous.version} · BEFORE`}>
                {r.before}
              </Column>
              <Column tone="after" label={`VERSION ${version} · AFTER`}>
                {wordDiff(r.before, r.after).map((w, i) =>
                  w.changed ? (
                    <span key={i} className="text-[#b42318] underline">
                      {w.text}
                    </span>
                  ) : (
                    <span key={i}>{w.text}</span>
                  )
                )}
              </Column>
            </div>
          )}
        </div>
      ))}
      {original ? null : (
        <p className="m-0 font-sans text-[13px] leading-[16px] text-[#575755]">
          {`Only fields that changed are shown. ${same} other ${same === 1 ? 'field is' : 'fields are'} the same.`}
        </p>
      )}
    </section>
  );
};

export default HistoryComparePanel;
