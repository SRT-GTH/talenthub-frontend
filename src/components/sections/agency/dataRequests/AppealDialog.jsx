import { useId, useState } from 'react';
import { debug } from '../../../../utils/debug.js';
import Button from '../../../ui/Button.jsx';
import Checkbox from '../../../ui/form/Checkbox.jsx';
import Select from '../../../ui/form/Select.jsx';
import TextInput from '../../../ui/form/TextInput.jsx';
import DataRequestModalShell from './DataRequestModalShell.jsx';
import {
  DataRequestIconArrowRight,
  DataRequestIconCheckCircle,
  DataRequestIconFile,
  DataRequestIconTrash,
} from './dataRequestIcons.jsx';
import {
  agencyAppealDataRequest,
  agencyWithdrawDataRequest,
} from '../../../../services/agency.api.js';
import { APPEAL as D, fmtDay } from './data/dataRequestsData.js';

const log = debug('AppealDialog');

/*
 * AppealDialog — ?modal=appeal on a rejected request (Figma 11.4.3i, 8609:1674): chip "Appeal this decision", the title, the decision card (file icon,
 * "Under-18 skills by school · rejected 19 Oct", reason line, View decision), What would you accept instead? *, Why you need it *, Level of detail *,
 * Policy reference, Time range *, Access for (greyed, 30 days), Link to file, Who will see it, the aggregates confirmation, the green "District totals
 * are inside your MoU" check and Withdraw request · Cancel · Send appeal. The form opens with the request's own purpose, range and viewers.
 * Send → POST /agency/data-requests/:id/appeal (a different programme manager reviews it). Withdraw → POST …/withdraw (the request is closed,
 * nothing is deleted). "View decision" closes the dialog (the decision is the request page behind it).
 * Props: request (GET /agency/data-requests/:id), onClose(), onSent(updated), onWithdraw(updated).
 */

const AppealDialog = ({ request, onClose, onSent, onWithdraw }) => {
  const [form, setForm] = useState({
    accept: '',
    why: request.why || '',
    detail: D.levels[1],
    policy: '',
    range: request.range || '',
    link: '',
    viewers: (request.viewers || []).join(', '),
    confirm: false,
  });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [failure, setFailure] = useState('');
  const rejected = (request.steps || []).find((s) => s.status === 'rejected') || {};
  const formId = useId();
  const set = (key) => (event) => setForm((f) => ({ ...f, [key]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    const next = {};
    if (!form.accept.trim()) next.accept = 'Tell us what you would accept.';
    if (form.why.trim().length < 10) next.why = 'Tell us why you need it (at least 10 characters).';
    if (!form.detail) next.detail = 'Choose a level of detail.';
    if (!form.range.trim()) next.range = 'Enter the time range.';
    if (!form.confirm) next.confirm = 'Tick the box to confirm.';
    setErrors(next);
    if (Object.keys(next).length) {
      log('invalid', Object.keys(next));
      return;
    }
    setBusy(true);
    setFailure('');
    try {
      const updated = await agencyAppealDataRequest(request.id, {
        why: form.why.trim(),
        detail: [
          `Would accept: ${form.accept.trim()}`,
          `Level of detail: ${form.detail}`,
          form.policy.trim() ? `Policy reference: ${form.policy.trim()}` : '',
        ]
          .filter(Boolean)
          .join(' · '),
        range: form.range.trim(),
        link: form.link.trim() || undefined,
        viewers: form.viewers,
        confirm: true,
      });
      log('appeal sent', request.id);
      onSent(updated);
    } catch (err) {
      setFailure(err?.response?.data?.message || err?.message || 'Something went wrong.');
    } finally {
      setBusy(false);
    }
  };

  const withdraw = async () => {
    setBusy(true);
    setFailure('');
    try {
      const updated = await agencyWithdrawDataRequest(request.id);
      log('withdrawn', request.id);
      onWithdraw(updated);
    } catch (err) {
      setFailure(err?.response?.data?.message || err?.message || 'Something went wrong.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <DataRequestModalShell label="Appeal this decision" onClose={onClose}>
      <header className="flex flex-col gap-[8px] pr-[48px]">
        <span className="w-fit rounded-full border border-solid border-[#c1d4c4] bg-[#ebf1ec] px-[14px] py-[7px] font-sans text-[13px] leading-[16px] font-semibold text-[#387440]">
          {D.chip}
        </span>
        <h2 className="m-0 font-sans text-[26px] leading-[32px] font-semibold tracking-[-0.16px] text-[#1c2a21] md:text-[32px] md:leading-[40px]">
          {D.title[0]}
          <span className="text-[#387440]">{D.title[1]}</span>
        </h2>
        <p className="m-0 font-sans text-[15px] leading-[22px] text-[#595959]">{D.intro}</p>
      </header>

      <div className="flex flex-wrap items-center gap-[14px] rounded-[16px] border border-solid border-[#e7e7e7] bg-[#f8f8f4] py-[14px] pr-[16px] pl-[14px]">
        <span className="flex size-[44px] shrink-0 items-center justify-center rounded-[12px] bg-[#ebf1ec] text-[#387440]">
          <DataRequestIconFile className="size-[22px]" />
        </span>
        <div className="flex min-w-[200px] flex-1 flex-col gap-[2px]">
          <span className="font-sans text-[15px] leading-[18px] font-semibold text-[#1c2a21]">
            {request.title} · rejected {fmtDay(rejected.at)}
          </span>
          <span className="flex items-center gap-[6px] font-sans text-[13px] leading-[16px] font-medium text-[#387440]">
            <DataRequestIconCheckCircle className="size-[13px]" />
            Reason: {request.rejectionReason || rejected.note || 'not given'}
          </span>
        </div>
        <Button type="button" variant="tertiary-subtle" size="lg" onClick={onClose}>
          {D.viewButton}
        </Button>
      </div>

      <form
        id={formId}
        noValidate
        onSubmit={submit}
        className="grid grid-cols-1 gap-x-[16px] gap-y-[20px] md:grid-cols-2"
      >
        <TextInput
          label="What would you accept instead?"
          required
          placeholder="e.g. Regional totals only"
          value={form.accept}
          onChange={set('accept')}
          error={errors.accept}
          data-autofocus=""
        />
        <TextInput
          label="Why you need it"
          required
          value={form.why}
          onChange={set('why')}
          error={errors.why}
        />
        <Select
          label="Level of detail"
          required
          options={D.levels}
          value={form.detail}
          onChange={(value) => setForm((f) => ({ ...f, detail: value }))}
          error={errors.detail}
        />
        <TextInput
          label="Policy reference"
          optional
          placeholder="e.g. Cabinet memo CM/2026/114"
          value={form.policy}
          onChange={set('policy')}
        />
        <TextInput
          label="Time range"
          required
          value={form.range}
          onChange={set('range')}
          error={errors.range}
        />
        <TextInput label="Access for" disabled value="30 days" />
        <TextInput
          label="Link to file"
          optional
          placeholder="Link to a supporting letter"
          value={form.link}
          onChange={set('link')}
        />
        <TextInput
          label="Who will see it"
          optional
          value={form.viewers}
          onChange={set('viewers')}
        />
        <div className="md:col-span-2">
          <Checkbox
            label={D.confirm}
            checked={form.confirm}
            onChange={(e) => setForm((f) => ({ ...f, confirm: e.target.checked }))}
            error={errors.confirm}
          />
        </div>
      </form>

      <p
        role="status"
        className="m-0 flex items-center gap-[10px] rounded-[14px] border border-solid border-[#1c2a21]/10 bg-[#e8f2ed] px-[14px] py-[12px] font-sans text-[14px] leading-[17px] font-semibold text-[#165d3a]"
      >
        <DataRequestIconCheckCircle className="size-[18px] text-[#1d7c4d]" />
        {D.verified}
      </p>

      {failure ? (
        <p
          role="alert"
          className="m-0 rounded-[12px] bg-[#fdecea] px-[14px] py-[10px] font-sans text-[14px] leading-[20px] text-[#902b20]"
        >
          {failure}
        </p>
      ) : null}
      <div className="flex flex-wrap items-center justify-between gap-[12px] pt-[8px]">
        <button
          type="button"
          disabled={busy}
          onClick={withdraw}
          className="inline-flex cursor-pointer items-center gap-[6px] border-0 bg-transparent p-[4px] font-sans text-[14px] leading-[17px] font-semibold text-[#902b20] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
        >
          <DataRequestIconTrash className="size-[16px] text-[#c0392b]" />
          {D.withdraw}
        </button>
        <div className="flex flex-wrap items-center gap-[12px]">
          <Button type="button" variant="tertiary-subtle" size="lg" onClick={onClose}>
            {D.cancel}
          </Button>
          <Button
            type="submit"
            form={formId}
            variant="primary"
            size="lg"
            disabled={busy}
            rightIcon={<DataRequestIconArrowRight />}
          >
            {D.submit}
          </Button>
        </div>
      </div>
    </DataRequestModalShell>
  );
};

export default AppealDialog;
