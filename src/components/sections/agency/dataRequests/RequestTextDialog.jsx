import { useState } from 'react';
import { debug } from '../../../../utils/debug.js';
import Button from '../../../ui/Button.jsx';
import Textarea from '../../../ui/form/Textarea.jsx';
import {
  agencyDataRequestDetail,
  agencyExtendDataRequest,
} from '../../../../services/agency.api.js';
import DataRequestModalShell from './DataRequestModalShell.jsx';
import { fmtDateTime } from './data/dataRequestsData.js';

const log = debug('RequestTextDialog');

/*
 * RequestTextDialog — the request page's small dialogs (?modal=detail | extend | view):
 *   detail  answer the DPO's question → POST /agency/data-requests/:id/detail (the request goes back to the DPO)
 *   extend  ask for up to 30 more days, with a reason → POST …/extend (a new linked request; uses one of the quarter's requests)
 *   view    read-only summary of what was asked for: purpose, category, range, regions, viewers, the details and appeals added since
 * Props: mode, request (GET /agency/data-requests/:id), onClose(), onDone(result).
 */

const COPY = {
  detail: {
    title: 'Add detail for the reviewer',
    intro:
      'Answer the question below. Your answer goes straight back to the data protection officer.',
    label: 'Your answer',
    submit: 'Send detail',
  },
  extend: {
    title: 'Ask to extend access',
    intro:
      'An extension is a new request for up to 30 more days. Both reviewers look at it again, and it uses one of this quarter’s MoU requests.',
    label: 'Why do you need more time?',
    submit: 'Send for approval',
  },
};

const Row = ({ label, children }) => (
  <div className="flex flex-col gap-[2px] border-0 border-b border-solid border-[#eeeeea] py-[10px]">
    <dt className="font-sans text-[12px] leading-[16px] font-semibold tracking-[0.4px] text-[#737373] uppercase">
      {label}
    </dt>
    <dd className="m-0 font-sans text-[15px] leading-[22px] text-[#1c2a21]">{children}</dd>
  </div>
);

const RequestTextDialog = ({ mode, request, onClose, onDone }) => {
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const copy = COPY[mode];

  const submit = async (event) => {
    event.preventDefault();
    if (text.trim().length < 10) {
      setError('Write at least 10 characters.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      const result =
        mode === 'detail'
          ? await agencyDataRequestDetail(request.id, text.trim())
          : await agencyExtendDataRequest(request.id, text.trim());
      log(mode, 'sent', result.id);
      onDone(result);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Something went wrong.');
    } finally {
      setBusy(false);
    }
  };

  if (mode === 'view') {
    return (
      <DataRequestModalShell label="Your request" onClose={onClose}>
        <header className="flex flex-col gap-[6px] pr-[48px]">
          <h2 className="m-0 font-sans text-[26px] leading-[32px] font-semibold text-[#1c2a21]">
            {request.title}
          </h2>
          <p className="m-0 font-sans text-[14px] leading-[20px] text-[#595959]">
            Sent {fmtDateTime(request.createdAt)} by {request.createdBy}
          </p>
        </header>
        <dl className="m-0 flex flex-col">
          <Row label="Why">{request.why}</Row>
          <Row label="Data category">{request.categoryLabel}</Row>
          <Row label="Time range">{request.range}</Row>
          <Row label="Regions">{request.regionsLabel}</Row>
          <Row label="Who will see it">
            {request.viewers?.length ? request.viewers.join(', ') : 'Only you'}
          </Row>
          {request.briefName ? <Row label="Research brief">{request.briefName}</Row> : null}
          {request.details?.map((d) => (
            <Row key={d.at} label={`Detail added ${fmtDateTime(d.at)}`}>
              {d.text}
            </Row>
          ))}
          {request.appeals?.map((a) => (
            <Row key={a.at} label={`Appeal sent ${fmtDateTime(a.at)}`}>
              {a.why} · {a.detail}
            </Row>
          ))}
        </dl>
        <div className="flex justify-end pt-[8px]">
          <Button type="button" variant="primary" size="lg" onClick={onClose} data-autofocus="">
            Close
          </Button>
        </div>
      </DataRequestModalShell>
    );
  }

  return (
    <DataRequestModalShell label={copy.title} onClose={onClose}>
      <header className="flex flex-col gap-[8px] pr-[48px]">
        <h2 className="m-0 font-sans text-[26px] leading-[32px] font-semibold text-[#1c2a21]">
          {copy.title}
        </h2>
        <p className="m-0 font-sans text-[15px] leading-[22px] text-[#595959]">{copy.intro}</p>
        {mode === 'detail' && request.question ? (
          <p className="m-0 rounded-[12px] border border-solid border-[#eedeb8] bg-[#faf4e8] px-[14px] py-[10px] font-sans text-[14px] leading-[20px] text-[#1c2a21]">
            <strong>The DPO asked:</strong> {request.question}
          </p>
        ) : null}
      </header>
      <form noValidate onSubmit={submit} className="flex flex-col gap-[16px]">
        <Textarea
          label={copy.label}
          required
          rows={5}
          maxLength={2000}
          showCounter
          value={text}
          onChange={(e) => setText(e.target.value)}
          error={error || undefined}
          data-autofocus=""
        />
        <div className="flex flex-wrap items-center justify-end gap-[12px]">
          <Button type="button" variant="tertiary-subtle" size="lg" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="lg" disabled={busy}>
            {busy ? 'Sending…' : copy.submit}
          </Button>
        </div>
      </form>
    </DataRequestModalShell>
  );
};

export default RequestTextDialog;
