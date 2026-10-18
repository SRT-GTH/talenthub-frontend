import { useCallback, useEffect, useState } from 'react';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import Button from '../../ui/Button.jsx';
import {
  ProfileGhanaFlagIcon,
  ShareArrowheadDownSmallIcon,
  SharePhoneFieldDotIcon,
} from '../../shared/assets.jsx';
import {
  ShareCheck,
  ShareDialog,
  ShareFieldLabel,
  ShareHead,
  ShareSwitch,
} from './ShareProfileParts.jsx';
import { FOCUS_RING, SHARE_INPUT_CLASS } from './ShareProfileUi.js';
import { downloadCvPdf } from './ShareProfileFile.js';
import { CARD_PERSON, SHARE_PDF } from './talentProfileShareData.js';

const log = debug('ShareProfilePdf');

/* Format thumbnail (Figma `thumb`): 70 × 92 page with either a green band + grey lines or dark lines. */
const THUMB_LINES = [46, 54, 38, 54, 30, 50];
const FormatThumb = ({ ats }) => (
  <span
    aria-hidden="true"
    className="flex h-[92px] w-[70px] shrink-0 flex-col items-start gap-[4px] overflow-hidden rounded-[6px] border border-solid border-[#ccc] bg-white p-[8px]"
  >
    {ats ? null : <span className="h-[18px] w-[54px] shrink-0 rounded-[3px] bg-brand-green" />}
    {THUMB_LINES.map((w, i) => (
      <span
        key={i}
        className={classNames(
          'h-[4px] shrink-0 rounded-[2px]',
          ats ? 'bg-[#595959]' : 'bg-[#bfbfbf]'
        )}
        style={{ width: w }}
      />
    ))}
  </span>
);

/* SH-05 Download PDF / CV. */
const ShareProfilePdf = ({ profile }) => {
  const [format, setFormat] = useState('ats-cv');
  const [include, setInclude] = useState(() =>
    Object.fromEntries(SHARE_PDF.include.map((item) => [item.id, item.on]))
  );
  const [contact, setContact] = useState(true);
  const [phone, setPhone] = useState(SHARE_PDF.phone);
  const [email, setEmail] = useState(SHARE_PDF.email);

  const back = useCallback(() => profile.update({ share: 'open' }), [profile]);
  const close = useCallback(() => profile.update({ share: null }), [profile]);

  useEffect(() => {
    log('mount', { format, include, contact });
  }, [format, include, contact]);

  const download = () => {
    const lines = [CARD_PERSON.fullName, CARD_PERSON.headline];
    SHARE_PDF.include.filter((item) => include[item.id]).forEach((item) => lines.push(item.label));
    if (contact) lines.push(`${SHARE_PDF.phoneCode} ${phone}`, email);
    log('download cv', { format, lines: lines.length });
    downloadCvPdf({ lines, filename: `kofi-agyekum-${format}.pdf` });
  };

  return (
    <ShareDialog onClose={close} titleId="share-pdf-title" maxWidth={760}>
      <ShareHead
        titleId="share-pdf-title"
        title={SHARE_PDF.title}
        subtitle={SHARE_PDF.subtitle}
        onBack={back}
        onClose={close}
        gap={12}
      />

      <div
        role="radiogroup"
        aria-label="Format"
        className="grid w-full grid-cols-1 gap-[16px] md:grid-cols-2"
      >
        {SHARE_PDF.formats.map((item) => {
          const selected = format === item.id;
          return (
            <button
              key={item.id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => {
                log('format', { id: item.id });
                setFormat(item.id);
              }}
              className={classNames(
                'flex min-w-0 cursor-pointer items-center gap-[14px] rounded-[16px] border border-solid p-[16px] text-left leading-[normal]',
                selected
                  ? 'border-brand-green bg-brand-green-light shadow-[0_2px_8px_rgba(28,42,33,0.04),0_1px_2px_rgba(28,42,33,0.04)]'
                  : 'border-[#e6e6e6] bg-white',
                FOCUS_RING
              )}
            >
              <FormatThumb ats={item.id === 'ats-cv'} />
              <span className="flex min-w-0 flex-1 flex-col items-start gap-[4px]">
                {item.badge ? (
                  <span className="flex h-[32px] items-center rounded-full border border-solid border-brand-green-light-hover bg-white px-[14px] text-[13px] font-semibold whitespace-nowrap text-[#595959]">
                    {item.badge}
                  </span>
                ) : null}
                <span className="text-[15px] font-semibold text-[#1c2a21]">{item.title}</span>
                <span className="text-[12px] leading-[1.4] text-[#595959]">{item.body}</span>
              </span>
              <span
                aria-hidden="true"
                className={classNames(
                  'size-[20px] shrink-0 rounded-full border-solid bg-white',
                  selected ? 'border border-brand-green' : 'border-[1.5px] border-[#bfbfbf]'
                )}
              />
            </button>
          );
        })}
      </div>

      <div className="flex w-full flex-col gap-[12px]">
        <p className="m-0 text-[14px] font-medium text-[#1c2a21]">{SHARE_PDF.includeLabel}</p>
        <div className="grid w-full grid-cols-2 gap-x-[12px] gap-y-[16px] sm:grid-cols-4">
          {SHARE_PDF.include.map((item) => (
            <ShareCheck
              key={item.id}
              checked={include[item.id]}
              onChange={(next) => {
                log('include', { id: item.id, next });
                setInclude((prev) => ({ ...prev, [item.id]: next }));
              }}
              className="min-w-0"
            >
              {item.label}
            </ShareCheck>
          ))}
        </div>
      </div>

      <div className="flex w-full flex-col gap-[12px]">
        <div className="flex w-full items-center gap-[10px]">
          <div className="flex min-w-0 flex-1 flex-col gap-[2px]">
            <p id="share-contact-label" className="m-0 text-[14px] font-medium text-[#1c2a21]">
              {SHARE_PDF.contactTitle}
            </p>
            <p className="m-0 text-[12px] text-[#737373]">{SHARE_PDF.contactHint}</p>
          </div>
          <ShareSwitch checked={contact} onChange={setContact} labelledBy="share-contact-label" />
        </div>

        <div
          className={classNames(
            'grid w-full grid-cols-1 gap-[12px] sm:grid-cols-2',
            !contact && 'opacity-50'
          )}
        >
          <div className="flex min-w-0 flex-col gap-[8px]">
            <ShareFieldLabel htmlFor="share-phone-input" required>
              {SHARE_PDF.phoneLabel}
            </ShareFieldLabel>
            <div className="flex h-[51px] w-full">
              <span className="flex h-[51px] w-[96px] shrink-0 items-center gap-[8px] rounded-l-[10px] border border-solid border-[#ccc] bg-white pr-[16px] pl-[9px] shadow-[0_1px_2px_rgba(28,42,33,0.04),0_2px_11px_rgba(28,42,33,0.03)]">
                <span className="flex items-center gap-[4px]">
                  <span className="flex size-[20px] shrink-0">
                    <ProfileGhanaFlagIcon className="size-full" />
                  </span>
                  <ShareArrowheadDownSmallIcon className="size-[8px] shrink-0" />
                </span>
                <span className="text-[14px] leading-6 font-medium tracking-[0.2px] whitespace-nowrap text-[#575755]">
                  {SHARE_PDF.phoneCode}
                </span>
              </span>
              <span className="flex h-[51px] min-w-0 flex-1 items-center gap-[8px] rounded-r-[10px] border-y border-r border-solid border-[#ccc] bg-white pr-[16px] pl-[20px] shadow-[0_1px_2px_rgba(28,42,33,0.04),0_2px_11px_rgba(28,42,33,0.03)]">
                <input
                  id="share-phone-input"
                  type="tel"
                  inputMode="tel"
                  value={phone}
                  disabled={!contact}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-full min-w-0 flex-1 border-0 bg-transparent p-0 text-[14px] leading-6 font-medium tracking-[0.2px] text-[#1c2a21] outline-none"
                />
                <SharePhoneFieldDotIcon className="h-[19px] w-[20px] shrink-0" />
              </span>
            </div>
          </div>
          <div className="flex min-w-0 flex-col gap-[8px]">
            <ShareFieldLabel htmlFor="share-email-input">{SHARE_PDF.emailLabel}</ShareFieldLabel>
            <input
              id="share-email-input"
              type="email"
              value={email}
              disabled={!contact}
              onChange={(e) => setEmail(e.target.value)}
              className={classNames(SHARE_INPUT_CLASS, 'border border-[#ccc]')}
            />
          </div>
        </div>
      </div>

      <div className="flex min-h-[71px] w-full items-center gap-[10px] max-sm:flex-wrap max-sm:justify-end">
        <p className="m-0 min-w-0 flex-1 text-[12px] text-[#737373] max-sm:basis-full">
          {SHARE_PDF.fileNote}
        </p>
        <Button variant="tertiary" size="sm" onClick={back}>
          {SHARE_PDF.cancel}
        </Button>
        <Button variant="primary" size="sm" onClick={download}>
          {SHARE_PDF.download}
        </Button>
      </div>
    </ShareDialog>
  );
};

export default ShareProfilePdf;
