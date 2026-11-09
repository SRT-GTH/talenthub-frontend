import { useEffect, useId, useState } from 'react';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import { openRequest, supportTypes } from '../../../services/support.api.js';
import { HelpArrowRightWhiteIcon, HelpCheck10Icon } from '../../shared/assets.jsx';
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
import HelpRequestsList from './HelpRequests.jsx';
import { useMyRequests } from './useMyRequests.js';
import { CONTACT, SENT as SENT_COPY } from './helpData.js';
import spotSent from '../../../assets/talent-settings/help/spot-request-sent.svg';

const log = debug('HelpContactView');

/*
 * HP-05 Contact support (Playful 8230:22926→8230:22419 / Focused 8230:419651) and HP-06 Request sent (modal over it), live:
 *   topics   GET /api/support/types (platformEnum support_case_type: Super / Senior Admins add or edit them in Settings › Reference data)
 *   send     POST /api/support/cases { type, subject, body, page } → the request's reference (SUP-10001) shown in the sent modal
 *   aside    Your requests (GET /api/support/cases); "Someone at risk?" → ?help=concern
 * Replies come back in the app (Your requests + a notification). Screenshots and WhatsApp / email replies aren't supported by the
 * support service yet, so the form doesn't offer them. Props: settings ({ update }), sent (true = HP-06 modal open, `?help=sent`).
 */
const SideTitle = ({ children }) => (
  <h2 className={classNames('m-0 text-[18px] leading-[1.2] text-[#1c2a21]', HEADING)}>
    {children}
  </h2>
);

/* Exported for the recruiter Help set (add-only): `copy` ({ title, body, steps, viewRequests, back }) replaces the talent copy; `reference` is then not prefixed. */
export const RequestSentModal = ({ reference, onRequests, onBack, copy }) => {
  const SENT = copy ?? SENT_COPY;
  const uid = useId();
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
          {copy
            ? copy.body
            : `${reference ? `Request ${reference}. ` : ''}A person from the GTH team will reply in the app. You’ll get a notification.`}
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
            {reference && !copy ? 'Open my request' : SENT.viewRequests}
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
  const requests = useMyRequests();
  const [types, setTypes] = useState(null);
  const [typesError, setTypesError] = useState(false);
  const [topic, setTopic] = useState(null);
  const [subject, setSubject] = useState('');
  const [details, setDetails] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [reference, setReference] = useState(null);

  useEffect(() => {
    let live = true;
    supportTypes()
      .then((rows) => live && setTypes(rows || []))
      .catch(() => live && setTypesError(true));
    return () => {
      live = false;
    };
  }, []);

  const canSend =
    Boolean(topic) && subject.trim().length >= 3 && details.trim().length >= 10 && !busy;
  const toCentre = () => settings.update({ help: null, q: null });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!canSend) return;
    setBusy(true);
    setError('');
    try {
      const res = await openRequest({
        type: topic,
        subject: subject.trim(),
        body: details.trim(),
        // The help page the request was sent from (/settings/help for talent, /recruiter/help for recruiters).
        page: typeof window !== 'undefined' ? window.location.pathname : '/settings/help',
      });
      log('sent', res?.ref);
      setReference(res?.ref || null);
      requests.reload();
      settings.update({ help: 'sent', q: null });
    } catch (err) {
      setError(err?.response?.data?.message || 'We couldn’t send that. Try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col gap-[clamp(16px,1.39vw,24px)]">
      <PageHeader
        title={CONTACT.title}
        subtitle="A real person from the GTH team replies here in the app."
      />

      <div className="flex flex-col gap-[24px] xl:flex-row xl:items-start">
        <form
          onSubmit={onSubmit}
          className={classNames(
            PAGE_CARD,
            'flex min-w-0 flex-1 flex-col items-start gap-[18px] p-[clamp(18px,1.62vw,28px)]'
          )}
        >
          <p className="m-0 font-sans text-[15px] font-semibold leading-[1.2] text-[#1c2a21]">
            {CONTACT.topicQuestion}
          </p>
          {typesError ? (
            <p role="alert" className="m-0 font-sans text-[14px] text-[#b42318]">
              We couldn’t load the topics. Refresh the page to try again.
            </p>
          ) : !types ? (
            <p className="m-0 font-sans text-[14px] text-[#595959]">Loading topics…</p>
          ) : (
            <div
              role="radiogroup"
              aria-label={CONTACT.topicQuestion}
              className="flex flex-wrap gap-[8px]"
            >
              {types.map((t) => (
                <HelpChip key={t.key} selected={t.key === topic} onClick={() => setTopic(t.key)}>
                  {t.label}
                </HelpChip>
              ))}
            </div>
          )}

          <HelpField
            id={`${uid}-subject`}
            label={CONTACT.subjectLabel}
            required
            maxLength={140}
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
          <HelpField
            id={`${uid}-details`}
            label={CONTACT.detailsLabel}
            required
            multiline
            maxLength={5000}
            counter={`${details.length} / 5000`}
            value={details}
            onChange={(e) => setDetails(e.target.value)}
          />
          {error ? (
            <p role="alert" className="m-0 font-sans text-[14px] text-[#b42318]">
              {error}
            </p>
          ) : null}

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
              {busy ? 'Sending…' : CONTACT.send}
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
              title="Someone at risk? Report a concern"
              onClick={() => settings.update({ help: 'concern', q: null })}
            />
          </section>
          <section className={classNames(PAGE_CARD, 'flex flex-col gap-[10px] p-[22px]')}>
            <SideTitle>Your requests</SideTitle>
            <HelpRequestsList
              requests={requests}
              onOpen={(ref) => settings.update({ help: 'request', ref, q: null })}
            />
          </section>
        </aside>
      </div>

      {sent && (
        <RequestSentModal
          reference={reference}
          onRequests={() =>
            reference ? settings.update({ help: 'request', ref: reference, q: null }) : toCentre()
          }
          onBack={toCentre}
        />
      )}
      <span className={classNames('sr-only', FOCUS_RING)} aria-live="polite">
        {busy ? 'Sending' : ''}
      </span>
    </div>
  );
};

export default HelpContactView;
