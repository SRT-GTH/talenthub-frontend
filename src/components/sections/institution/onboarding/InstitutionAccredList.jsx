import { useRef, useState } from 'react';
import { debug } from '../../../../utils/debug.js';
import InstitutionAccredDocCard from './InstitutionAccredDocCard.jsx';
import { ACCREDITATION as U } from './data/institutionOnboardingData.js';
import { PlusIcon } from './institutionOnboardingIcons.jsx';

const log = debug('InstitutionAccredList');

/*
 * InstitutionAccredList — "Your documents" (Figma 11.1.2a2 8589:2700): 28/34 600 title + "3 of 4 documents" chip, the four document cards (GES licence and head’s Ghana Card
 * verified; Letter on letterhead pending check; Ministry registration needs more info) and the two dashed actions "Upload a document" / "Enter details manually"
 * (white, 1.5 dashed #387440, r16, 15/18 600 #387440).
 * Mock: "Upload a document" picks a file and lists it as a pending document (nothing is uploaded); the pencil buttons log the intent (⚠️ ASSUMPTION: no edit form is drawn).
 * Props: extra (documents added in this session), onAdd({ name, size }), onManual.
 */

const DASHED =
  'inline-flex min-h-[56px] flex-1 items-center justify-center gap-[8px] rounded-[16px] border-[1.5px] border-dashed border-[#387440] bg-[#ebf1ec]/60 px-[16px] font-sans text-[15px] leading-[18px] font-semibold text-[#387440] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]';

const InstitutionAccredList = ({ extra = [], onAdd, onManual }) => {
  const fileRef = useRef(null);
  const [error, setError] = useState(null);
  const docs = [...U.list.docs, ...extra];

  const take = (file) => {
    if (!file) return;
    if (!/\.(pdf|jpe?g|png)$/i.test(file.name) || file.size > 10 * 1024 * 1024) {
      setError('Use a PDF, JPG or PNG up to 10 MB.');
      return;
    }
    setError(null);
    log('added', { name: file.name });
    onAdd({ name: file.name, size: file.size });
  };

  return (
    <section aria-labelledby="accred-docs" className="flex flex-col gap-[16px]">
      <div className="flex items-center gap-[12px]">
        <h2
          id="accred-docs"
          className="m-0 font-sans text-[28px] leading-[34px] font-semibold text-[#1c2a21]"
        >
          {U.list.title}
        </h2>
        <span className="inline-flex rounded-full border border-solid border-[#1c2a21]/10 bg-[#ebf1ec] px-[10px] py-[4px] font-sans text-[12px] leading-[14px] font-semibold text-[#595959]">
          {extra.length ? `${3 + extra.length} of ${docs.length} documents` : U.list.count}
        </span>
      </div>
      <ul className="m-0 flex list-none flex-col gap-[16px] p-0">
        {docs.map((d) => (
          <InstitutionAccredDocCard
            key={d.id}
            title={d.title}
            status={d.status}
            tone={d.tone}
            meta={d.meta}
            tags={d.tags}
            verified={d.tone === 'ok'}
            pending={d.tone !== 'ok'}
            link={
              d.link ? { label: d.link, onClick: () => log('view file', { id: d.id }) } : undefined
            }
            onEdit={() => log('edit', { id: d.id })}
          />
        ))}
      </ul>
      <div className="flex flex-col gap-[16px] sm:flex-row">
        <button type="button" onClick={() => fileRef.current?.click()} className={DASHED}>
          <PlusIcon className="size-[18px]" />
          {U.list.upload}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
          aria-label="Choose a document"
          className="sr-only"
          tabIndex={-1}
          onChange={(e) => {
            take(e.target.files?.[0]);
            e.target.value = '';
          }}
        />
        <button type="button" onClick={onManual} className={DASHED}>
          {U.list.manual}
        </button>
      </div>
      <p role="alert" className="m-0 font-sans text-[14px] leading-[17px] text-danger empty:hidden">
        {error}
      </p>
    </section>
  );
};

export default InstitutionAccredList;
