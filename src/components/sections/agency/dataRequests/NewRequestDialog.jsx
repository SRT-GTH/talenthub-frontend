import { useId, useRef, useState } from 'react';
import { debug } from '../../../../utils/debug.js';
import Button from '../../../ui/Button.jsx';
import Checkbox from '../../../ui/form/Checkbox.jsx';
import Select from '../../../ui/form/Select.jsx';
import TextInput from '../../../ui/form/TextInput.jsx';
import DataRequestModalShell from './DataRequestModalShell.jsx';
import { DataRequestIconArrowRight, DataRequestIconUpload } from './dataRequestIcons.jsx';
import { NEW_REQUEST as D, submitRequest } from './data/dataRequestsData.js';

const log = debug('NewRequestDialog');

/*
 * NewRequestDialog — /agency/data-requests/new (Figma 11.4.3b, 8597:536): "Tell us what you need and why." — optional PDF brief, What do you need? *,
 * Why do you need it? *, Data category * (select), Level of detail (fixed by the MoU), Time range *, Access for (30 days), Who will see it, Regions,
 * the MoU clause confirmation and Cancel + Send for approval. Validation: the starred fields and the confirmation are required (red field + message
 * under it, focus goes to the first). Submit → MOCK POST /agency/data-requests → the request page in the Pending state.
 * ⚠️ ASSUMPTIONS: the error copy ("Tell us …", "Tick the box to confirm.") is mine (Figma draws no error state); Level of detail / Access for are
 * read-only (the MoU fixes them); the two extra data categories; "Attach brief" only names the chosen file (no upload); "Add detail" / "Ask to
 * extend" / "View request" on a request page open this same form prefilled with that request (`prefill`).
 * Props: prefill ({ what, why, category, range, viewers, regions }), onClose(), onSent(request).
 */

const EMPTY = {
  what: '',
  why: '',
  category: '',
  range: '',
  viewers: '',
  regions: '',
  confirm: false,
};

const NewRequestDialog = ({ prefill, onClose, onSent }) => {
  const [form, setForm] = useState({ ...EMPTY, ...prefill });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [file, setFile] = useState('');
  const fileRef = useRef(null);
  const formId = useId();
  const set = (key) => (event) => setForm((f) => ({ ...f, [key]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    const next = {};
    if (!form.what.trim()) next.what = 'Tell us what you need.';
    if (!form.why.trim()) next.why = 'Tell us why you need it.';
    if (!form.category) next.category = 'Choose a data category.';
    if (!form.range.trim()) next.range = 'Enter the time range.';
    if (!form.confirm) next.confirm = 'Tick the box to confirm.';
    setErrors(next);
    const first = Object.keys(next)[0];
    if (first) {
      log('invalid', Object.keys(next));
      window.requestAnimationFrame(() =>
        document
          .querySelector(
            `#${CSS.escape(formId)} [data-field="${first}"] input, #${CSS.escape(formId)} [data-field="${first}"] button`
          )
          ?.focus()
      );
      return;
    }
    setBusy(true);
    const request = await submitRequest(form);
    log('sent (mock)', request.id);
    setBusy(false);
    onSent(request);
  };

  return (
    <DataRequestModalShell label="Tell us what you need and why." onClose={onClose}>
      <header className="flex flex-col gap-[8px] pr-[48px]">
        <h2 className="m-0 font-sans text-[26px] leading-[32px] font-semibold tracking-[-0.16px] text-[#1c2a21] md:text-[32px] md:leading-[40px]">
          {D.title[0]}
          <span className="text-[#387440]">{D.title[1]}</span>
        </h2>
        <p className="m-0 font-sans text-[15px] leading-[22px] text-[#595959]">{D.intro}</p>
      </header>

      <div className="flex flex-wrap items-center gap-[16px] rounded-[16px] border border-dashed border-[#387440] bg-[#ebf1ec] p-[18px]">
        <span className="flex size-[56px] shrink-0 items-center justify-center rounded-[16px] border border-solid border-[#1c2a21]/10 bg-white text-[#387440] shadow-[0_1px_2px_rgba(15,15,10,0.05),0_2px_8px_rgba(15,15,10,0.08)]">
          <DataRequestIconUpload className="size-[26px]" />
        </span>
        <div className="flex min-w-[180px] flex-1 flex-col gap-[3px]">
          <span className="font-sans text-[15px] leading-[18px] font-semibold text-[#1c2a21]">
            {D.attachTitle}
          </span>
          <span className="font-sans text-[13px] leading-[16px] text-[#595959]">
            {file || D.attachHint}
          </span>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="application/pdf"
          className="sr-only"
          tabIndex={-1}
          aria-label={D.attachTitle}
          onChange={(e) => setFile(e.target.files?.[0]?.name ?? '')}
        />
        <Button type="button" variant="primary" size="md" onClick={() => fileRef.current?.click()}>
          {D.attachButton}
        </Button>
      </div>

      <div className="flex items-center gap-[12px]" role="separator" aria-label={D.divider}>
        <span aria-hidden="true" className="h-px flex-1 bg-[#e7e7e7]" />
        <span className="font-sans text-[12px] leading-[14px] font-semibold text-[#595959]">
          {D.divider}
        </span>
        <span aria-hidden="true" className="h-px flex-1 bg-[#e7e7e7]" />
      </div>

      <form
        id={formId}
        noValidate
        onSubmit={submit}
        className="grid grid-cols-1 gap-x-[16px] gap-y-[20px] md:grid-cols-2"
      >
        <div data-field="what">
          <TextInput
            label="What do you need?"
            required
            placeholder="e.g. Readiness by district, ages 18–24"
            value={form.what}
            onChange={set('what')}
            error={errors.what}
            data-autofocus=""
          />
        </div>
        <div data-field="why">
          <TextInput
            label="Why do you need it?"
            required
            placeholder="e.g. Plan the 2027 YouthStart budget"
            value={form.why}
            onChange={set('why')}
            error={errors.why}
          />
        </div>
        <div data-field="category">
          <Select
            label="Data category"
            required
            options={D.categories}
            value={form.category || undefined}
            placeholder="Readiness · in your MoU"
            onChange={(value) => setForm((f) => ({ ...f, category: value }))}
            error={errors.category}
          />
        </div>
        <TextInput label="Level of detail" readOnly value={D.levelOfDetail} />
        <div data-field="range">
          <TextInput
            label="Time range"
            required
            placeholder="Oct 2024 – Oct 2026"
            value={form.range}
            onChange={set('range')}
            error={errors.range}
          />
        </div>
        <TextInput label="Access for" readOnly value={D.accessFor} />
        <TextInput
          label="Who will see it"
          optional
          placeholder="Efua Owusu, Kojo Mensah"
          value={form.viewers}
          onChange={set('viewers')}
        />
        <TextInput
          label="Regions"
          optional
          placeholder="All 16 regions"
          value={form.regions}
          onChange={set('regions')}
        />
        <div data-field="confirm" className="md:col-span-2">
          <Checkbox
            label={D.confirm}
            checked={form.confirm}
            onChange={(e) => setForm((f) => ({ ...f, confirm: e.target.checked }))}
            error={errors.confirm}
          />
        </div>
      </form>

      <div className="flex flex-wrap items-center justify-end gap-[12px] pt-[8px]">
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
    </DataRequestModalShell>
  );
};

export default NewRequestDialog;
