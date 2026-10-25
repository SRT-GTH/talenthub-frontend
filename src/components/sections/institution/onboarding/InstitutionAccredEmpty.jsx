import { useRef, useState } from 'react';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import InstitutionAccredDocCard from './InstitutionAccredDocCard.jsx';
import { ACCREDITATION as U } from './data/institutionOnboardingData.js';
import {
  ArrowRightIcon,
  CheckFillIcon,
  EyeIcon,
  FileIcon,
  FileCheckIcon,
  UploadIcon,
} from './institutionOnboardingIcons.jsx';

const log = debug('InstitutionAccredEmpty');
const HOW = { upload: UploadIcon, eye: EyeIcon, checkFill: CheckFillIcon };

/*
 * InstitutionAccredEmpty — "Nothing uploaded yet." (Figma 11.1.2a 8596:1097 "Empty state" 1072 x 478: white, 1px ink@.10, r24, p 44/48/36/48, gap 24) + the "What we need from you"
 * entry (8596:1133). Illustration of three tiles (the middle one gold), 32/40 600 headline, 16/24 #595959 text, the green "Upload a document" + mint "Enter details manually"
 * buttons, the help link and the 3-step "how it works" row.
 * Mock dropzone: the card accepts a dragged file or the "Upload a document" file picker (PDF / JPG / PNG up to 10 MB); only the name and size are read, nothing is uploaded.
 * Props: onAdd({ name, size }), onManual, onReject(message).
 */

const InstitutionAccredEmpty = ({ onAdd, onManual }) => {
  const fileRef = useRef(null);
  const [over, setOver] = useState(false);
  const [error, setError] = useState(null);

  const take = (file) => {
    if (!file) return;
    if (!/\.(pdf|jpe?g|png)$/i.test(file.name) || file.size > 10 * 1024 * 1024) {
      log('rejected', { name: file.name, size: file.size });
      setError('Use a PDF, JPG or PNG up to 10 MB.');
      return;
    }
    log('accepted', { name: file.name });
    setError(null);
    onAdd({ name: file.name, size: file.size });
  };

  return (
    <div className="flex flex-col gap-[20px]">
      <section
        aria-label="Upload documents"
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          take(e.dataTransfer.files?.[0]);
        }}
        className={classNames(
          'flex flex-col items-center gap-[24px] rounded-[24px] border border-solid bg-white px-[clamp(16px,4.4vw,48px)] pt-[44px] pb-[36px] shadow-[0_1px_2px_rgba(15,15,10,0.05),0_2px_8px_rgba(15,15,10,0.08)]',
          over ? 'border-[#387440] bg-[#f3f8f4]' : 'border-[#1c2a21]/10'
        )}
      >
        <div aria-hidden="true" className="flex items-center">
          <span className="grid size-[64px] translate-y-[8px] place-items-center rounded-[22px] border border-solid border-[#1c2a21]/10 bg-[#ebf1ec] text-[#387440] shadow-[0_1px_2px_rgba(15,15,10,0.05),0_2px_8px_rgba(15,15,10,0.08)]">
            <FileIcon className="size-[28px]" />
          </span>
          <span className="relative z-10 -mx-[7px] grid size-[80px] place-items-center rounded-[22px] border border-solid border-[#1c2a21]/10 bg-[#c8951a] text-white shadow-[0_1px_2px_rgba(15,15,10,0.05),0_2px_8px_rgba(15,15,10,0.08)]">
            <FileCheckIcon className="size-[36px]" />
          </span>
          <span className="grid size-[64px] translate-y-[8px] place-items-center rounded-[22px] border border-solid border-[#1c2a21]/10 bg-[#ebf1ec] text-[#387440] shadow-[0_1px_2px_rgba(15,15,10,0.05),0_2px_8px_rgba(15,15,10,0.08)]">
            <FileIcon className="size-[31px]" />
          </span>
        </div>
        <h2 className="m-0 text-center font-sans text-[clamp(26px,2.9vw,32px)] leading-[1.25] font-semibold tracking-[-0.16px] text-[#1c2a21]">
          {U.empty.title[0]}
          <span className="text-[#387440]">{U.empty.title[1]}</span>
        </h2>
        <p className="m-0 max-w-[640px] text-center font-sans text-[16px] leading-[24px] text-[#595959]">
          {U.empty.text}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-[12px]">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="inline-flex min-h-[52px] items-center gap-[8px] rounded-[10px] border-2 border-solid border-[#2a5730] bg-[#387440] px-[28px] py-[14px] font-sans text-[16px] leading-[24px] font-bold tracking-[0.1px] text-white shadow-[0_4px_0_#2a5730] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
          >
            {U.empty.upload}
            <ArrowRightIcon className="size-[20px]" />
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
          <button
            type="button"
            onClick={onManual}
            className="inline-flex min-h-[52px] items-center rounded-[14px] border-2 border-solid border-[#c1d4c4] bg-[#e1eae2] px-[34px] py-[14px] font-sans text-[16px] leading-[24px] font-bold tracking-[0.1px] text-[#165d3a] shadow-[0_1px_2px_rgba(15,15,10,0.05)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
          >
            {U.empty.manual}
          </button>
        </div>
        <p
          role="alert"
          className="m-0 min-h-0 font-sans text-[14px] leading-[17px] text-danger empty:hidden"
        >
          {error}
        </p>
        <a
          href="mailto:institutions@ghanatalenthub.example"
          className="font-sans text-[14px] leading-[17px] font-semibold text-[#595959] underline underline-offset-2"
        >
          {U.empty.help}
        </a>
        <ul className="m-0 grid w-full list-none grid-cols-1 gap-[16px] border-t border-solid border-[#e7e7e7] p-0 pt-[22px] md:grid-cols-3">
          {U.empty.how.map((h) => {
            const Icon = HOW[h.icon];
            return (
              <li key={h.id} className="flex items-center gap-[12px]">
                <span
                  aria-hidden="true"
                  className="grid size-[36px] shrink-0 place-items-center rounded-[10px] bg-[#ebf1ec] text-[#387440]"
                >
                  <Icon className="size-[18px]" />
                </span>
                <span className="flex flex-col gap-[3px]">
                  <span className="font-sans text-[15px] leading-[18px] font-semibold text-[#1c2a21]">
                    {h.title}
                  </span>
                  <span className="font-sans text-[13px] leading-[19px] text-[#595959]">
                    {h.text}
                  </span>
                </span>
              </li>
            );
          })}
        </ul>
      </section>
      <section aria-labelledby="accred-need" className="flex flex-col gap-[14px]">
        <h2
          id="accred-need"
          className="m-0 font-sans text-[11px] max-lg:text-[12px] leading-[13px] font-bold tracking-[1.2px] text-[#595959]"
        >
          {U.empty.needLabel}
        </h2>
        <ul className="m-0 p-0">
          <InstitutionAccredDocCard
            title={U.empty.need.title}
            status={U.empty.need.badge}
            tone="required"
            meta={U.empty.need.meta}
            tags={U.empty.need.tags}
            link={{ label: U.empty.need.action, onClick: () => fileRef.current?.click() }}
          />
        </ul>
      </section>
    </div>
  );
};

export default InstitutionAccredEmpty;
