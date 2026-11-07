import { useId, useState } from 'react';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import {
  HelpArrowRightWhiteIcon,
  HelpCheck12Icon,
  HelpFileDocumentIcon,
  HelpImageUploadIcon,
  HelpRemoveFileIcon,
} from '../../../shared/assets.jsx';
import {
  FOCUS_RING,
  HEADING,
  HelpButton,
  HelpChip,
  HelpRow,
  PAGE_CARD,
  PageHeader,
} from '../../talentSettings/helpUi.jsx';
import HelpField from '../../talentSettings/helpFields.jsx';
import HelpRequestsList from '../../talentSettings/HelpRequests.jsx';
import { RequestSentModal } from '../../talentSettings/HelpContactView.jsx';
import { RECRUITER_CONTACT, RECRUITER_SENT, recruiterRequests } from './recruiterHelpData.js';

const log = debug('RecruiterContactView');

/*
 * R-HP-05 Contact support (10161:89558) and R-HP-06 Request sent (10161:89746, the modal over it) - `/recruiter/help?help=contact|sent`.
 * The form opens as drawn (topic "Payments or fees", the sample subject and details, the screenshot chip, reply "In the app", device info ticked) and is
 * editable. Mock only: "Send to support" opens the sent modal (request #GTH-2318 as drawn); no /api/support call is made from recruiter pages.
 * ⚠️ ASSUMPTION: "Browse" adds the drawn sample file (no file picker is drawn), the x on a file removes it; "Cancel" returns to the Help centre.
 * ⚠️ FIGMA INCONSISTENCY kept visible: the details counter is drawn "0 / 1000" while the box holds text; here it counts the characters live.
 * Props: settings ({ update }), sent (true = the modal is open, `?help=sent`).
 */
const SideTitle = ({ children }) => (
  <h2 className={classNames('m-0 text-[18px] leading-[1.2] text-[#1c2a21]', HEADING)}>
    {children}
  </h2>
);

const RecruiterContactView = ({ settings, sent }) => {
  const uid = useId();
  const C = RECRUITER_CONTACT;
  const [topic, setTopic] = useState(C.topicValue);
  const [subject, setSubject] = useState(C.subjectValue);
  const [details, setDetails] = useState(C.detailsValue);
  const [files, setFiles] = useState(C.files);
  const [reply, setReply] = useState(C.replyValue);
  const [device, setDevice] = useState(true);
  log('mount', { sent, topic, reply });

  const canSend = subject.trim().length >= 3 && details.trim().length >= 10;
  const toCentre = () => settings.update({ help: null, q: null });

  const onSubmit = (e) => {
    e.preventDefault();
    if (!canSend) {
      log('branch: blocked, subject or details too short');
      return;
    }
    log('send to support', { topic, reply, device, files: files.length });
    settings.update({ help: 'sent', q: null });
  };

  return (
    <div className="flex flex-col gap-[clamp(16px,1.39vw,24px)]">
      <PageHeader title={C.title} subtitle={C.subtitle} />

      <div className="flex flex-col gap-[24px] xl:flex-row xl:items-start">
        <form
          onSubmit={onSubmit}
          className={classNames(
            PAGE_CARD,
            'flex min-w-0 flex-1 flex-col items-start gap-[18px] p-[clamp(18px,1.62vw,28px)]'
          )}
        >
          <p className="m-0 font-sans text-[15px] font-semibold leading-[1.2] text-[#1c2a21]">
            {C.topicQuestion}
          </p>
          <div role="radiogroup" aria-label={C.topicQuestion} className="flex flex-wrap gap-[8px]">
            {C.topics.map((t) => (
              <HelpChip key={t} selected={t === topic} onClick={() => setTopic(t)}>
                {t}
              </HelpChip>
            ))}
          </div>

          <HelpField
            id={`${uid}-subject`}
            label={C.subjectLabel}
            required
            maxLength={140}
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
          <HelpField
            id={`${uid}-details`}
            label={C.detailsLabel}
            required
            multiline
            maxLength={C.detailsMax}
            counter={`${details.length} / ${C.detailsMax}`}
            value={details}
            onChange={(e) => setDetails(e.target.value)}
          />

          <div className="flex w-full items-center gap-[14px] rounded-[14px] border border-solid border-[rgba(28,42,33,0.1)] bg-[#f8f8f4] p-[16px]">
            <HelpImageUploadIcon className="size-[24px] shrink-0" />
            <div className="flex min-w-0 flex-1 flex-col gap-[2px]">
              <span className="font-sans text-[14px] font-semibold leading-[1.2] text-[#1c2a21]">
                {C.uploadTitle}
              </span>
              <span className="font-sans text-[12px] leading-[1.2] text-[#595959]">
                {C.uploadHint}
              </span>
            </div>
            <HelpButton
              size="sm"
              className="!text-[13px]"
              onClick={() => {
                log('browse (sample file)');
                setFiles((cur) => (cur.length ? cur : C.files));
              }}
            >
              {C.browse}
            </HelpButton>
          </div>

          {files.map((f) => (
            <div
              key={f.name}
              className="flex items-center gap-[10px] rounded-[10px] border border-solid border-[rgba(28,42,33,0.1)] bg-white py-[8px] pl-[12px] pr-[10px]"
            >
              <HelpFileDocumentIcon className="size-[16px] shrink-0" />
              <span className="font-sans text-[13px] font-medium leading-[1.2] text-[#1c2a21]">
                {f.name}
              </span>
              <span className="font-sans text-[12px] leading-[1.2] text-[#595959]">{f.size}</span>
              <button
                type="button"
                aria-label={`Remove ${f.name}`}
                onClick={() => setFiles((cur) => cur.filter((x) => x.name !== f.name))}
                className={classNames(
                  'flex min-h-[24px] min-w-[24px] cursor-pointer items-center justify-center',
                  FOCUS_RING
                )}
              >
                <HelpRemoveFileIcon className="size-[14px]" />
              </button>
            </div>
          ))}

          <p className="m-0 font-sans text-[15px] font-semibold leading-[1.2] text-[#1c2a21]">
            {C.replyQuestion}
          </p>
          <div role="radiogroup" aria-label={C.replyQuestion} className="flex flex-wrap gap-[8px]">
            {C.replyOptions.map((o) => (
              <HelpChip key={o} selected={o === reply} onClick={() => setReply(o)}>
                {o}
              </HelpChip>
            ))}
          </div>

          <label className="flex min-h-[24px] cursor-pointer items-center gap-[10px]">
            <input
              type="checkbox"
              checked={device}
              onChange={(e) => setDevice(e.target.checked)}
              className="peer sr-only"
            />
            <span
              aria-hidden="true"
              className={classNames(
                'flex size-[18px] shrink-0 items-center justify-center rounded-[5px] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand-green',
                device ? 'bg-[#387440]' : 'border border-solid border-[#ccc] bg-white'
              )}
            >
              {device && <HelpCheck12Icon className="size-[12px]" />}
            </span>
            <span className="font-sans text-[13px] leading-[1.2] text-[#1c2a21]">
              {C.deviceInfo}
            </span>
          </label>

          <div className="flex w-full items-start gap-[10px]">
            <HelpButton size="lg" onClick={toCentre}>
              {C.cancel}
            </HelpButton>
            <span className="h-px min-w-px flex-1" />
            <HelpButton
              tone="primary"
              size="lg"
              disabled={!canSend}
              onClick={(e) => e.currentTarget.form?.requestSubmit()}
              iconAfter={<HelpArrowRightWhiteIcon className="size-[20px]" />}
            >
              {C.send}
            </HelpButton>
          </div>
        </form>

        <aside className="flex w-full shrink-0 flex-col gap-[20px] xl:w-[340px]">
          <section className={classNames(PAGE_CARD, 'flex flex-col gap-[10px] p-[22px]')}>
            <SideTitle>{C.beforeTitle}</SideTitle>
            <p className="m-0 font-sans text-[13px] leading-[1.2] text-[#595959]">{C.beforeBody}</p>
            {C.before.map((row, i) => (
              <HelpRow
                key={row.title}
                icon={row.icon}
                title={row.title}
                onClick={() =>
                  i === 0
                    ? settings.update({ help: 'article', q: null })
                    : log('related (no article drawn)', row.title)
                }
              />
            ))}
          </section>
          <section className={classNames(PAGE_CARD, 'flex flex-col gap-[10px] p-[22px]')}>
            <SideTitle>Your requests</SideTitle>
            <HelpRequestsList
              requests={recruiterRequests()}
              chipTone="soft"
              onOpen={(ref) => log('request row (no request view drawn)', ref)}
            />
          </section>
        </aside>
      </div>

      {sent && (
        <RequestSentModal
          reference="#GTH-2318"
          copy={RECRUITER_SENT}
          onRequests={toCentre}
          onBack={toCentre}
        />
      )}
    </div>
  );
};

export default RecruiterContactView;
