import { useId, useRef, useState } from 'react';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import {
  HelpArrowRightWhiteIcon,
  HelpCheck12Icon,
  HelpCheck10Icon,
  HelpFileDocumentIcon,
  HelpImageUploadIcon,
  HelpRemoveFileIcon,
} from '../../shared/assets.jsx';
import {
  FOCUS_RING,
  HEADING,
  HelpButton,
  HelpChip,
  HelpModal,
  HelpRow,
  PAGE_CARD,
  PageHeader,
} from './helpUi.jsx';
import HelpField from './helpFields.jsx';
import { CONTACT, HS_REQUESTS, SENT } from './helpData.js';
import spotSent from '../../../assets/talent-settings/help/spot-request-sent.svg';

const log = debug('HelpContactView');

/*
 * HP-05 Contact support (Playful 8230:22926→8230:22419 / Focused 8230:419651) and HP-06 Request sent
 * (modal over it, Playful 8230:22926 / Focused 8230:419936). The form starts pre-filled exactly as drawn
 * and is editable. Props: settings ({ update }), sent (true = HP-06 modal open, `?help=sent`).
 */
const SideTitle = ({ children }) => (
  <h2 className={classNames('m-0 text-[18px] leading-[1.2] text-[#1c2a21]', HEADING)}>
    {children}
  </h2>
);

const Group = ({ title, children }) => (
  <>
    <p className="m-0 font-sans text-[15px] font-semibold leading-[1.2] text-[#1c2a21]">{title}</p>
    {children}
  </>
);

const RequestSentModal = ({ onRequests, onBack }) => {
  const uid = useId();
  log('sent modal');
  return (
    <HelpModal
      onClose={onBack}
      labelledBy={`${uid}-title`}
      describedBy={`${uid}-body`}
      scrim="rgba(28,42,33,0.45)"
      cardClassName="max-w-[500px]"
    >
      <div className="flex flex-col items-center gap-[16px] rounded-[24px] bg-white p-[clamp(20px,2.2vw,32px)] shadow-[0_20px_48px_rgba(28,42,33,0.18)]">
        <img src={spotSent} alt="" aria-hidden="true" className="size-[120px]" />
        <h2
          id={`${uid}-title`}
          className={classNames(
            'm-0 w-full text-center text-[28px] leading-[1.2] text-[#1c2a21]',
            HEADING
          )}
        >
          {SENT.title}
        </h2>
        <p
          id={`${uid}-body`}
          className="m-0 w-full text-center font-sans text-[15px] leading-[22px] text-[#595959]"
        >
          {SENT.body}
        </p>
        <ol className="m-0 flex w-full list-none flex-wrap items-center justify-center gap-[8px] rounded-[14px] bg-[#f8f8f4] p-[14px]">
          {SENT.steps.map((step, i) => (
            <li key={step} className="flex items-center gap-[8px]">
              {i > 0 && <span aria-hidden="true" className="h-[2px] w-[28px] bg-[#387440]" />}
              <span className="flex items-center gap-[6px]">
                {i === 0 ? (
                  <span className="flex size-[18px] items-center justify-center rounded-full border border-solid border-[#387440] bg-[#387440]">
                    <HelpCheck10Icon className="size-[10px]" />
                  </span>
                ) : (
                  <span className="size-[18px] rounded-full border border-solid border-[#387440] bg-white" />
                )}
                <span
                  className={classNames(
                    'font-sans text-[13px] leading-[1.2]',
                    i === 0 ? 'font-semibold text-[#387440]' : 'font-medium text-[#595959]'
                  )}
                >
                  {step}
                </span>
              </span>
            </li>
          ))}
        </ol>
        <div className="flex w-full flex-wrap items-start gap-[10px]">
          <HelpButton size="lg" className="min-w-[160px] flex-1" onClick={onRequests}>
            {SENT.viewRequests}
          </HelpButton>
          <HelpButton tone="primary" size="lg" className="min-w-[160px] flex-1" onClick={onBack}>
            {SENT.back}
          </HelpButton>
        </div>
      </div>
    </HelpModal>
  );
};

const HelpContactView = ({ settings, sent }) => {
  const uid = useId();
  const fileInput = useRef(null);
  const [topic, setTopic] = useState(CONTACT.topicValue);
  const [subject, setSubject] = useState(CONTACT.subjectValue);
  const [details, setDetails] = useState(CONTACT.detailsValue);
  const [files, setFiles] = useState(CONTACT.files);
  const [reply, setReply] = useState(CONTACT.replyValue);
  const [device, setDevice] = useState(true);
  log('mount', { sent, topic, reply, files: files.length });

  const canSend = subject.trim().length > 0 && details.trim().length > 0;
  const toCentre = () => settings.update({ help: null, q: null });

  const onFiles = (e) => {
    const picked = Array.from(e.target.files ?? []).filter((f) => {
      const ok = /^image\/(png|jpe?g)$/.test(f.type) && f.size <= 5 * 1024 * 1024;
      if (!ok) log('file rejected', f.name, f.type, f.size);
      return ok;
    });
    setFiles((cur) => [
      ...cur,
      ...picked.map((f) => ({
        name: f.name,
        size: `${Math.max(1, Math.round(f.size / 1024))} KB`,
      })),
    ]);
    e.target.value = '';
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!canSend) {
      log('branch: blocked, subject/details empty');
      return;
    }
    log('send to support', { topic, reply, device, files: files.length });
    settings.update({ help: 'sent', q: null });
  };

  return (
    <div className="flex flex-col gap-[clamp(16px,1.39vw,24px)]">
      <PageHeader title={CONTACT.title} subtitle={CONTACT.subtitle} />

      <div className="flex flex-col gap-[24px] xl:flex-row xl:items-start">
        <form
          onSubmit={onSubmit}
          className={classNames(
            PAGE_CARD,
            'flex min-w-0 flex-1 flex-col items-start gap-[18px] p-[clamp(18px,1.62vw,28px)]'
          )}
        >
          <Group title={CONTACT.topicQuestion}>
            <div
              role="radiogroup"
              aria-label={CONTACT.topicQuestion}
              className="flex flex-wrap gap-[8px]"
            >
              {CONTACT.topics.map((t) => (
                <HelpChip key={t} selected={t === topic} onClick={() => setTopic(t)}>
                  {t}
                </HelpChip>
              ))}
            </div>
          </Group>

          <HelpField
            id={`${uid}-subject`}
            label={CONTACT.subjectLabel}
            required
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
          <HelpField
            id={`${uid}-details`}
            label={CONTACT.detailsLabel}
            required
            multiline
            maxLength={CONTACT.detailsMax}
            counter={`${details.length} / ${CONTACT.detailsMax}`}
            value={details}
            onChange={(e) => setDetails(e.target.value)}
          />

          <div className="flex w-full flex-wrap items-center gap-[14px] rounded-[14px] border border-dashed border-[rgba(28,42,33,0.1)] bg-[#f8f8f4] p-[16px] playful:border-[rgba(28,42,33,0.25)]">
            <HelpImageUploadIcon className="size-[24px] shrink-0" />
            <div className="flex min-w-[180px] flex-1 flex-col gap-[2px] leading-[1.2]">
              <span className="font-sans text-[14px] font-semibold text-[#1c2a21]">
                {CONTACT.uploadTitle}
              </span>
              <span className="font-sans text-[12px] text-[#595959]">{CONTACT.uploadHint}</span>
            </div>
            <input
              ref={fileInput}
              type="file"
              accept="image/png,image/jpeg"
              multiple
              onChange={onFiles}
              className="hidden"
              aria-label={CONTACT.uploadTitle}
            />
            <HelpButton size="sm" onClick={() => fileInput.current?.click()}>
              {CONTACT.browse}
            </HelpButton>
          </div>

          {files.length > 0 && (
            <ul className="m-0 flex list-none flex-wrap gap-[8px] p-0">
              {files.map((f, i) => (
                <li
                  key={`${f.name}-${i}`}
                  className="flex items-center gap-[10px] rounded-[10px] border border-solid border-[rgba(28,42,33,0.1)] bg-white py-[8px] pl-[12px] pr-[10px] playful:border-[rgba(28,42,33,0.15)]"
                >
                  <HelpFileDocumentIcon className="size-[16px] shrink-0" />
                  <span className="font-sans text-[13px] font-medium leading-[1.2] text-[#1c2a21]">
                    {f.name}
                  </span>
                  <span className="font-sans text-[12px] leading-[1.2] text-[#595959]">
                    {f.size}
                  </span>
                  <button
                    type="button"
                    aria-label={`Remove ${f.name}`}
                    onClick={() => setFiles((cur) => cur.filter((_, j) => j !== i))}
                    className={classNames('flex cursor-pointer rounded-full', FOCUS_RING)}
                  >
                    <HelpRemoveFileIcon className="size-[14px]" />
                  </button>
                </li>
              ))}
            </ul>
          )}

          <Group title={CONTACT.replyQuestion}>
            <div
              role="radiogroup"
              aria-label={CONTACT.replyQuestion}
              className="flex flex-wrap gap-[8px]"
            >
              {CONTACT.replyOptions.map((r) => (
                <HelpChip key={r} selected={r === reply} onClick={() => setReply(r)}>
                  {r}
                </HelpChip>
              ))}
            </div>
          </Group>

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
              {CONTACT.deviceInfo}
            </span>
          </label>

          <div className="flex w-full items-start gap-[10px]">
            <HelpButton size="lg" onClick={toCentre}>
              {CONTACT.cancel}
            </HelpButton>
            <span className="h-px min-w-px flex-1" />
            <HelpButton
              tone="primary"
              size="lg"
              disabled={!canSend}
              onClick={(e) => e.currentTarget.form?.requestSubmit()}
              iconAfter={<HelpArrowRightWhiteIcon className="size-[20px]" />}
            >
              {CONTACT.send}
            </HelpButton>
          </div>
        </form>

        <aside className="flex w-full shrink-0 flex-col gap-[20px] xl:w-[340px]">
          <section className={classNames(PAGE_CARD, 'flex flex-col gap-[10px] p-[22px]')}>
            <SideTitle>{CONTACT.beforeTitle}</SideTitle>
            <p className="m-0 font-sans text-[13px] leading-[1.2] text-[#595959]">
              {CONTACT.beforeBody}
            </p>
            <HelpRow
              icon="shield"
              title={CONTACT.before[0]}
              onClick={() => settings.update({ help: 'article', q: null })}
            />
            <HelpRow
              icon="shield"
              title={CONTACT.before[1]}
              onClick={() => log('before you send (no article drawn)', CONTACT.before[1])}
            />
          </section>
          <section className={classNames(PAGE_CARD, 'flex flex-col gap-[10px] p-[22px]')}>
            <SideTitle>Your requests</SideTitle>
            {HS_REQUESTS.map((r) => (
              <div key={r.id} className="flex items-center gap-[10px]">
                <div className="flex min-w-0 flex-1 flex-col gap-[2px] leading-[1.2]">
                  <span className="font-sans text-[14px] font-semibold text-[#1c2a21]">
                    {r.title}
                  </span>
                  <span className="font-sans text-[12px] text-[#595959]">{r.meta}</span>
                </div>
                <HelpChip soft>{r.status}</HelpChip>
              </div>
            ))}
          </section>
        </aside>
      </div>

      {sent && <RequestSentModal onRequests={toCentre} onBack={toCentre} />}
    </div>
  );
};

export default HelpContactView;
