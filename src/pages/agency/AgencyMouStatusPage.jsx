import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import AgencyButton from '../../components/sections/agency/AgencyButton.jsx';
import AgencyFrame from '../../components/sections/agency/AgencyFrame.jsx';
import AgencyPageHero from '../../components/sections/agency/AgencyPageHero.jsx';
import { useAgencyState } from '../../components/sections/agency/agencyState.js';
import { useAgencySession } from '../../components/sections/agency/useAgencySession.js';
import AgencyChecklistCard from '../../components/sections/agency/home/AgencyChecklistCard.jsx';
import AgencyFeatureCards from '../../components/sections/agency/home/AgencyFeatureCards.jsx';
import AgencyQuickActions from '../../components/sections/agency/home/AgencyQuickActions.jsx';
import {
  MOU_GATES,
  MOU_UPLOAD,
} from '../../components/sections/agency/onboarding/data/agencyOnboardingData.js';
import { agencyMou } from '../../services/agency.api.js';
import { debug } from '../../utils/debug.js';

const log = debug('AgencyMouStatusPage');

/*
 * AgencyMouStatusPage — /agency/mou/status (Figma 11.4.1c pending 8596:1641 · 11.4.1c2 needs more info 8607:2710 · 11.4.1c3 not approved 8607:3192 · 11.4.1d approved 8596:2133).
 * The state is the session's MoU status (GET /api/agency/me; ?mou= overrides it in development only). The titles, quick actions and cards are the drawn copy
 * (MOU_GATES); the hero text and the "Your verification" checklist come from the agency's own documents (GET /api/agency/mou): one row per document with its
 * review state, then GTH's review (sent / decided dates and the reviewer's note).
 * No MoU documents and no approved MoU yet (status none) redirects to the upload page /agency/mou.
 */

const fill = (text, vars) => text.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '');
const day = (d) =>
  d
    ? new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(
        new Date(d)
      )
    : '';
/** n working days after d (Mon–Fri). */
const workingDaysAfter = (d, n) => {
  const x = new Date(d);
  let left = n;
  while (left > 0) {
    x.setDate(x.getDate() + 1);
    if (x.getDay() !== 0 && x.getDay() !== 6) left -= 1;
  }
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(x);
};
const LIST = { label: 'View documents', to: '/agency/mou?view=list' };

/** The hero text of each state, from the real review. */
const subtitleOf = (status, view, session) => {
  const r = view?.review;
  if (status === 'pending') {
    return r?.submittedAt
      ? `You sent your documents on ${day(r.submittedAt)}. Most reviews take 5 working days, so expect an answer by ${workingDaysAfter(r.submittedAt, 5)}.`
      : 'We’re checking your documents. Most reviews take 5 working days.';
  }
  if (status === 'needs-info' || status === 'not-approved') {
    const fix =
      status === 'needs-info'
        ? 'Fix it on the documents page and send them again.'
        : 'You can upload corrected documents and send them again.';
    return r?.note ? `${r.note} ${fix}` : fix;
  }
  if (status === 'approved') {
    const ref = view?.mou?.reference || session.mou.reference;
    const ends = view?.mou?.expiresAt;
    return `The ${session.agency.name} MoU${ref ? ` ${ref}` : ''} is active${ends ? ` until ${day(ends)}` : ''}. You can see national data, run queries and post programmes.`;
  }
  return '';
};

/** "Your verification": the account, one row per document, then GTH's review. */
const checklistOf = (status, view) => {
  const rows = view?.required || [];
  const verified = rows.filter((r) => r.doc?.status === 'verified').length;
  const r = view?.review;
  const items = [
    { id: 'account', title: 'Account and agency', state: 'done', trailing: 'Done' },
    ...rows.map((s) => {
      const st = s.doc ? s.doc.status : 'none';
      const label = (MOU_UPLOAD.list.status[st] || MOU_UPLOAD.list.status.none).label;
      const fix =
        st === 'none' ||
        st === 'needs-info' ||
        st === 'rejected' ||
        (st === 'draft' && status !== 'pending');
      return {
        id: s.kind,
        title: s.title,
        sub: s.doc?.note
          ? `${label} · ${s.doc.note}`
          : s.doc?.reviewedAt
            ? `${label} · ${day(s.doc.reviewedAt)}`
            : label,
        state: st === 'verified' ? 'done' : 'todo',
        trailing: st === 'verified' ? 'Done' : undefined,
        action:
          fix && status !== 'approved'
            ? { label: st === 'none' ? 'Add' : 'Fix', to: LIST.to }
            : undefined,
      };
    }),
  ];
  if (r) {
    items.push({
      id: 'review',
      title: 'GTH review',
      sub:
        r.status === 'pending'
          ? `Sent ${day(r.submittedAt)}${r.submittedByName ? ` by ${r.submittedByName}` : ''}`
          : `${r.status === 'approved' ? 'Approved' : r.status === 'needs-info' ? 'More information asked' : 'Not approved'} · ${day(r.decidedAt)}${r.decidedByName ? ` by ${r.decidedByName}` : ''}`,
      state: r.status === 'approved' ? 'done' : 'todo',
      trailing: r.status === 'approved' ? 'Done' : r.status === 'pending' ? 'In review' : undefined,
    });
  }
  const total = rows.length || 4;
  const word =
    {
      pending: 'in review',
      'needs-info': 'action needed',
      'not-approved': 'not approved',
      approved: 'MoU active',
    }[status] || '';
  return {
    badge: `${verified} of ${total} verified${word ? ` · ${word}` : ''}`,
    pct: Math.round((verified / total) * 100),
    items,
  };
};

const AgencyMouStatusPage = () => {
  const data = useAgencyState();
  const session = useAgencySession();
  const status = session.mou.status;
  const [view, setView] = useState(null);

  useEffect(() => {
    let live = true;
    agencyMou()
      .then((v) => live && setView(v))
      .catch((err) => log('mou failed', err?.response?.status));
    return () => {
      live = false;
    };
  }, []);

  useEffect(() => {
    log('mount', { status, docs: view?.docs?.length });
  }, [status, view?.docs?.length]);

  if (status === 'none') return <Navigate to="/agency/mou" replace />;

  const gate = MOU_GATES[status] || MOU_GATES.pending;
  const vars = { first: session.analyst.firstName, agency: session.agency.name };
  const danger = gate.tone === 'danger';
  const renewal = status === 'approved' && view?.review && view.review.status !== 'approved';
  const list = checklistOf(status, view);
  const action =
    status === 'needs-info' || status === 'not-approved'
      ? { label: 'Fix my documents', to: LIST.to }
      : status === 'pending'
        ? LIST
        : gate.hero.action;

  return (
    <AgencyFrame data={data} title="MoU status">
      <AgencyPageHero
        title={fill(gate.hero.title, vars)}
        subtitle={subtitleOf(status, view, session) || fill(gate.hero.subtitle, vars)}
        actions={<AgencyButton to={action.to}>{action.label}</AgencyButton>}
        className={`[&_h1]:text-[22px] [&_h1]:leading-[28px] ${danger ? '!bg-[#c0392b]' : ''}`}
      />
      {renewal ? (
        <p
          role="status"
          className="m-0 rounded-[14px] border border-solid border-[#ecd9a3] bg-[#faf4e8] px-[16px] py-[12px] font-sans text-[14px] leading-[20px] text-[#785910]"
        >
          {view.review.status === 'pending'
            ? `Your new MoU documents are in review (sent ${day(view.review.submittedAt)}). Your access stays open meanwhile.`
            : `About your new MoU documents: ${view.review.note || view.review.status}. Your current MoU stays active.`}
        </p>
      ) : null}
      <AgencyQuickActions actions={gate.actions} />
      <AgencyChecklistCard
        {...gate.checklist}
        badge={view ? list.badge : 'Loading…'}
        pct={view ? list.pct : 0}
        items={view ? list.items : []}
        headingId="mou-status-checks"
      />
      <AgencyFeatureCards {...gate.cards} headingId="mou-status-cards" />
    </AgencyFrame>
  );
};

export default AgencyMouStatusPage;
