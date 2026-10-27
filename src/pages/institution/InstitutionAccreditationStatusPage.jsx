import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import AgencyChecklistCard from '../../components/sections/agency/home/AgencyChecklistCard.jsx';
import AgencyFeatureCards from '../../components/sections/agency/home/AgencyFeatureCards.jsx';
import AgencyQuickActions from '../../components/sections/agency/home/AgencyQuickActions.jsx';
import InstitutionButton from '../../components/sections/institution/InstitutionButton.jsx';
import InstitutionFrame from '../../components/sections/institution/InstitutionFrame.jsx';
import InstitutionPageHero from '../../components/sections/institution/InstitutionPageHero.jsx';
import { useInstitutionState } from '../../components/sections/institution/institutionState.js';
import { useInstitutionSession } from '../../components/sections/institution/useInstitutionSession.js';
import {
  ACCREDITATION,
  GATES,
} from '../../components/sections/institution/onboarding/data/institutionOnboardingData.js';
import { institutionAccreditation } from '../../services/institutionPortal.api.js';
import { debug } from '../../utils/debug.js';

const log = debug('InstitutionAccreditationStatusPage');

/*
 * InstitutionAccreditationStatusPage — /institution/accreditation/status (Figma 11.1.2b under review 8589:3478 · c approved 8589:3962 · d needs more info 8589:4444 ·
 * e not approved 8589:4918). The state is the session's accreditation status (GET /api/institution/me; ?verify= overrides it in development only).
 * Titles, quick actions and cards are the drawn copy (GATES); the hero text and the "Your verification" checklist come from the institution's own
 * documents (GET /api/institution/accreditation): one row per document with its review state, then GTH's review (sent / decided dates, the reviewer's note).
 * No documents sent yet (status none) redirects to the upload page /institution/accreditation.
 */

const fill = (text, vars) => text.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '');
const day = (d) =>
  d
    ? new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(
        new Date(d)
      )
    : '';
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
const LIST = '/institution/accreditation?view=list';

const subtitleOf = (status, view, session) => {
  const r = view?.review || {};
  if (status === 'under-review') {
    return r.submittedAt
      ? `You sent your documents on ${day(r.submittedAt)}${r.reviewStartedAt ? `; a reviewer started on ${day(r.reviewStartedAt)}` : ''}. Most checks take 1–2 working days, so expect an answer by ${workingDaysAfter(r.submittedAt, 2)}.`
      : '';
  }
  if (status === 'needs-info' || status === 'not-approved') {
    const fix =
      status === 'needs-info'
        ? 'Fix it on the documents page and send them again.'
        : 'You can upload corrected documents and send them again.';
    return r.note ? `${r.note} ${fix}` : fix;
  }
  if (status === 'approved') {
    return `${session.institution.name} is a verified institution${r.renewalDue ? ` until ${day(r.renewalDue)}` : ''}. You can add students, verify records and issue credentials.`;
  }
  return '';
};

const checklistOf = (status, view) => {
  const rows = view?.required || [];
  const verified = rows.filter((r) => r.doc?.status === 'verified').length;
  const r = view?.review || {};
  const items = [
    { id: 'account', title: 'Account and institution', state: 'done', trailing: 'Done' },
    ...rows.map((s) => {
      const st = s.doc ? s.doc.status : 'none';
      const label = (ACCREDITATION.list.status[st] || ACCREDITATION.list.status.none).label;
      const fix =
        ['none', 'needs-info', 'rejected'].includes(st) ||
        (st === 'draft' && status !== 'under-review');
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
            ? { label: st === 'none' ? 'Add' : 'Fix', to: LIST }
            : undefined,
      };
    }),
  ];
  if (r.submittedAt) {
    items.push({
      id: 'review',
      title: 'GTH review',
      sub:
        status === 'under-review'
          ? `Sent ${day(r.submittedAt)}${r.submittedByName ? ` by ${r.submittedByName}` : ''}`
          : `${status === 'approved' ? 'Approved' : status === 'needs-info' ? 'More information asked' : 'Not approved'}${r.decidedAt ? ` · ${day(r.decidedAt)}` : ''}${r.decidedByName ? ` by ${r.decidedByName}` : ''}`,
      state: status === 'approved' ? 'done' : 'todo',
      trailing:
        status === 'approved' ? 'Done' : status === 'under-review' ? 'In review' : undefined,
    });
  }
  const total = rows.length || 4;
  const word =
    {
      'under-review': 'in review',
      'needs-info': 'action needed',
      'not-approved': 'not approved',
      approved: 'verified',
    }[status] || '';
  return {
    badge: `${verified} of ${total} verified${word ? ` · ${word}` : ''}`,
    pct: Math.round((verified / total) * 100),
    items,
  };
};

const InstitutionAccreditationStatusPage = () => {
  const data = useInstitutionState();
  const session = useInstitutionSession();
  const status = session.verify.status;
  const [view, setView] = useState(null);

  useEffect(() => {
    let live = true;
    institutionAccreditation()
      .then((v) => live && setView(v))
      .catch((err) => log('accreditation failed', err?.response?.status));
    return () => {
      live = false;
    };
  }, []);
  useEffect(() => {
    log('mount', { status, docs: view?.docs?.length });
  }, [status, view?.docs?.length]);

  if (status === 'none') return <Navigate to="/institution/accreditation" replace />;

  const gate = GATES[status] || GATES['under-review'];
  const vars = { first: session.admin.firstName, institution: session.institution.short };
  const danger = gate.tone === 'danger';
  const action =
    status === 'needs-info' || status === 'not-approved'
      ? { label: 'Fix my documents', to: LIST }
      : status === 'under-review'
        ? { label: 'View documents', to: LIST }
        : gate.hero.action;
  const list = checklistOf(status, view);

  return (
    <InstitutionFrame data={data} title="Verification status">
      <InstitutionPageHero
        title={fill(gate.hero.title, vars)}
        subtitle={subtitleOf(status, view, session) || fill(gate.hero.subtitle, vars)}
        actions={
          action.to ? (
            <InstitutionButton to={action.to}>{action.label}</InstitutionButton>
          ) : (
            <InstitutionButton
              onClick={() => {
                log('contact support');
                window.location.href = action.href;
              }}
            >
              {action.label}
            </InstitutionButton>
          )
        }
        className={`[&_h1]:text-[22px] [&_h1]:leading-[28px] ${danger ? '!bg-[#c0392b]' : ''}`}
      />
      <AgencyQuickActions actions={gate.actions} />
      <AgencyChecklistCard
        {...gate.checklist}
        badge={view ? list.badge : 'Loading…'}
        pct={view ? list.pct : 0}
        items={view ? list.items : []}
        headingId="verify-status-checks"
      />
      <AgencyFeatureCards {...gate.cards} headingId="verify-status-cards" />
    </InstitutionFrame>
  );
};

export default InstitutionAccreditationStatusPage;
