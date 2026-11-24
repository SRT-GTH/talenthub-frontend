import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { debug } from '../../../../utils/debug.js';
import { apiMessage, progressOverview } from '../../../../services/institutionPortal.api.js';
import KpiStrip from '../../publicData/ui/KpiStrip.jsx';
import KpiTile from '../../publicData/ui/KpiTile.jsx';
import PublicCard from '../../publicData/ui/PublicCard.jsx';
import InstitutionButton from '../InstitutionButton.jsx';
import InstitutionPageHero from '../InstitutionPageHero.jsx';
import { COLUMNS, GROUPS, countText, countWords, pctText } from './studentDataFormat.js';

const log = debug('InstitutionAggregateView');

/*
 * InstitutionAggregateView — what the portal shows of an institution's students in the aggregate student data mode (ADR-14): totals and
 * breakdowns, never a named student. Live: GET /institution/progress/overview (backend institutionProgress.overview). A group of 1-4
 * students comes back suppressed, and smaller counts, shares and averages as null (printed "<5" and "–").
 *   variant="students"  /institution/students: the roster in numbers; Upload a class list, Add one student, Send reminders, Ask guardians
 *   variant="progress"  /institution/progress: how the counted students are doing, by year group, programme, level and home region
 *   variant="home"      the home page block: the KPI strip and the year groups, with a link to the Students page
 * Props: variant, school (short name), actions ({onUpload, onAdd, onRemind, onConsent, busy}; students only), refreshKey (reload on change).
 */

const tilesFor = (variant, t) => {
  if (variant === 'progress') {
    const few = t.avgProfile == null;
    const wait = 'Shown once 5 or more students are counted';
    return [
      {
        id: 'counted',
        eyebrow: 'Counted on GTH',
        value: countText(t.counted),
        sub:
          t.consentBasis === 'opt-out'
            ? 'Linked to GTH; under-18s once their guardian is notified'
            : 'Linked to GTH; under-18s once a guardian agrees',
      },
      {
        id: 'profile',
        eyebrow: 'Average profile',
        value: pctText(t.avgProfile),
        sub: few ? wait : 'GTH profile completion',
      },
      {
        id: 'skills',
        eyebrow: 'Evidenced skill',
        value: pctText(t.withSkillsPct),
        sub: few ? wait : 'Have at least one skill evidenced',
      },
      {
        id: 'support',
        eyebrow: 'Need support',
        value: few ? '–' : countText(t.needSupport),
        sub: few
          ? wait
          : `Profile under 50% or no activity for 30 days · ${countWords(t.inactive)} inactive`,
      },
    ];
  }
  return [
    {
      id: 'roster',
      eyebrow: 'On the roster',
      value: countText(t.roster),
      sub: t.graduates
        ? `Plus ${t.graduates} graduate${t.graduates === 1 ? '' : 's'}`
        : 'Students your institution added',
    },
    {
      id: 'gth',
      eyebrow: 'On GTH',
      value: countText(t.onGth),
      sub:
        t.onGthPct == null
          ? 'Linked their own GTH account'
          : `${t.onGthPct}% of the roster linked their GTH account`,
    },
    {
      id: 'waiting',
      eyebrow: 'Waiting to join',
      value: countText(t.waiting),
      sub: `Invited or asked to confirm · ${countWords(t.notInvited)} not invited yet`,
    },
    {
      id: 'minors',
      eyebrow: 'Under 18',
      value: countText(t.under18),
      sub:
        t.under18 === 0
          ? 'No students under 18'
          : t.consentBasis === 'opt-out'
            ? `${countWords(t.consentAgreed)} with the guardian notified · ${countWords(t.consentNeeded)} not notified yet`
            : `${countWords(t.consentAgreed)} with a guardian’s agreement · ${countWords(t.consentNeeded)} still to agree`,
    },
  ];
};

const Value = ({ kind, value }) => {
  if (kind === 'pct')
    return value == null ? <span title="Too few students to show">–</span> : `${value}%`;
  if (value == null) {
    return (
      <abbr title="fewer than 5" className="no-underline">
        &lt;5
      </abbr>
    );
  }
  return Number(value).toLocaleString('en-GB');
};

const GroupTable = ({ group, columns }) => (
  <PublicCard
    id={`students-by-${group.id}`}
    title={`By ${group.label.toLowerCase()}`}
    hint={group.note}
  >
    <div className="overflow-x-auto">
      <table className="w-full min-w-[520px] border-collapse font-sans text-[14px] leading-[20px] text-[#1c2a21]">
        <caption className="sr-only">
          Students by {group.label.toLowerCase()}. Groups of fewer than 5 students are hidden.
        </caption>
        <thead>
          <tr className="border-0 border-b border-solid border-[#e7e7e7] text-[12px] leading-[14px] tracking-[0.06em] text-[#595959] uppercase">
            <th scope="col" className="py-[10px] pr-[12px] text-left font-semibold">
              {group.label}
            </th>
            {columns.map(([k, heading]) => (
              <th key={k} scope="col" className="px-[10px] py-[10px] text-right font-semibold">
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {group.rows.length ? (
            group.rows.map((r) => (
              <tr
                key={r.key}
                className="border-0 border-b border-solid border-[#f1f1f1] last:border-b-0"
              >
                <th scope="row" className="py-[12px] pr-[12px] text-left font-semibold">
                  {r.label}
                </th>
                {r.suppressed ? (
                  <td
                    colSpan={columns.length}
                    className="px-[10px] py-[12px] text-right text-[#737373]"
                  >
                    Fewer than 5 students · hidden so no one can be picked out
                  </td>
                ) : (
                  columns.map(([k, , kind]) => (
                    <td key={k} className="px-[10px] py-[12px] text-right tabular-nums">
                      <Value kind={kind} value={r[k]} />
                    </td>
                  ))
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length + 1} className="py-[12px] text-[#595959]">
                No students to show yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </PublicCard>
);

export const AggregateNote = ({ school }) => (
  <p className="m-0 rounded-[16px] border border-solid border-[#e1eae2] bg-[#f3f8f4] px-[16px] py-[12px] font-sans text-[14px] leading-[21px] text-[#1c2a21]">
    <strong className="font-semibold">Totals only.</strong> {school || 'Your institution'} sees
    student data as totals, as set by the GTH team. Groups of fewer than 5 students show as “&lt;5”
    so no one can be picked out.{' '}
    <Link
      to="/institution/settings/data"
      className="font-semibold text-[#387440] underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
    >
      About this
    </Link>
  </p>
);

const InstitutionAggregateView = ({ variant = 'students', school, actions = {}, refreshKey }) => {
  const [o, setO] = useState(null);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setError('');
    try {
      const out = await progressOverview();
      log('loaded', { variant, roster: out?.totals?.roster, groups: out?.groups?.length });
      setO(out);
    } catch (err) {
      setError(apiMessage(err));
    }
  }, [variant]);

  useEffect(() => {
    load();
  }, [load, refreshKey]);

  const t = o?.totals;
  // Opt-out model (ADR-13): a delivered guardian notice is stored as agreed with basis opt-out, so the column says "notified".
  const columns = (COLUMNS[variant] ?? COLUMNS.students).map((c) =>
    c[0] === 'consentAgreed' && t?.consentBasis === 'opt-out'
      ? [c[0], 'Guardian notified', c[2]]
      : c
  );
  const groups = (o?.groups ?? []).filter((g) => (GROUPS[variant] ?? []).includes(g.id));
  const empty = t && t.roster === 0 && !t.graduates;

  const body = error ? (
    <p
      role="alert"
      className="m-0 rounded-[16px] border border-solid border-[#ebc2bd] bg-[#f9ebea] p-[16px] font-sans text-[14px] text-[#902b20]"
    >
      Could not load your student totals: {error}{' '}
      <button type="button" onClick={load} className="cursor-pointer font-semibold underline">
        Try again
      </button>
    </p>
  ) : !o ? (
    <p role="status" className="m-0 font-sans text-[14px] text-[#595959]">
      Loading student totals…
    </p>
  ) : empty ? (
    <p className="m-0 rounded-[22px] border border-solid border-[#e1eae2] bg-white p-[24px] font-sans text-[15px] leading-[22px] text-[#1c2a21]">
      No students on your roster yet. Upload a class list or add students one by one; they link
      their own GTH profiles.
    </p>
  ) : (
    <>
      <KpiStrip columns={4}>
        {tilesFor(variant, t).map((k) => (
          <KpiTile key={k.id} eyebrow={k.eyebrow} value={k.value} sub={k.sub} />
        ))}
      </KpiStrip>
      {groups.map((g) => (
        <GroupTable key={g.id} group={g} columns={columns} />
      ))}
    </>
  );

  if (variant === 'home') {
    return (
      <section aria-labelledby="home-students-totals" className="flex flex-col gap-[16px]">
        <div className="flex flex-wrap items-center justify-between gap-[12px]">
          <h2
            id="home-students-totals"
            className="m-0 font-sans text-[22px] leading-[28px] font-semibold text-[#1c2a21]"
          >
            Your students in numbers
          </h2>
          <InstitutionButton size="sm" to="/institution/students">
            All student totals
          </InstitutionButton>
        </div>
        <AggregateNote school={school} />
        {body}
      </section>
    );
  }

  if (variant === 'progress') {
    return (
      <div className="flex flex-col gap-[16px] lg:gap-[24px]">
        <InstitutionPageHero
          title="Progress"
          subtitle={`How ${school || 'your'} students are doing on GTH, as totals${o?.term ? ` · ${o.term}` : ''}.`}
          actions={
            <>
              <InstitutionButton size="sm" to="/institution/progress/class-outcomes">
                Class outcomes
              </InstitutionButton>
              <InstitutionButton size="sm" to="/institution/report">
                Board report
              </InstitutionButton>
            </>
          }
        />
        <AggregateNote school={school} />
        {body}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[24px]">
      <header className="flex flex-col gap-[3px]">
        <div className="flex flex-wrap items-center gap-[12px]">
          <h1 className="m-0 font-sans text-[34px] leading-[41px] font-semibold tracking-[-0.68px] text-[#1c2a21] max-sm:text-[28px] max-sm:leading-[34px]">
            Students
          </h1>
          {t ? (
            <span className="inline-flex h-[26px] items-center rounded-full bg-[#ebf1ec] px-[11px] font-sans text-[13px] leading-[16px] font-bold text-[#1f4a2b]">
              {countText(t.roster)} on roster
            </span>
          ) : null}
        </div>
        <p className="m-0 font-sans text-[16px] leading-[24px] tracking-[0.2px] text-[#737373]">
          Everyone enrolled at {school || 'your institution'}, as totals. Students link their own
          GTH profiles.
        </p>
      </header>
      <div className="flex flex-wrap gap-[10px]">
        <InstitutionButton size="md" onClick={actions.onUpload}>
          Upload a class list
        </InstitutionButton>
        <InstitutionButton size="md" onClick={actions.onAdd}>
          Add one student
        </InstitutionButton>
        {t && !empty ? (
          <>
            <InstitutionButton size="md" onClick={actions.onRemind} disabled={actions.busy}>
              Remind everyone not linked
            </InstitutionButton>
            {t.under18 !== 0 ? (
              <InstitutionButton size="md" onClick={actions.onConsent} disabled={actions.busy}>
                Send guardian notices
              </InstitutionButton>
            ) : null}
          </>
        ) : null}
      </div>
      <AggregateNote school={school} />
      {body}
    </div>
  );
};

export default InstitutionAggregateView;
