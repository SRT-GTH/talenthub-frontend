import { useId, useState } from 'react';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import { reportConcern } from '../../../services/support.api.js';
import { HelpButton, PAGE_CARD, PageHeader } from './helpUi.jsx';
import HelpField from './helpFields.jsx';

const log = debug('HelpConcernView');

/*
 * Report a concern — /settings/help?help=concern (POST /api/support/concerns): someone, often a young person, may be at risk.
 * It goes straight to the senior safeguarding team (urgent, first reply within the hour, seen only by Senior / Super Admins).
 * ?help=concern-sent is the confirmation. Emergencies go to the police or the Cyber Security Authority's 292 line first.
 * Props: settings ({ update }), sent (boolean).
 */

const HelpConcernView = ({ settings, sent }) => {
  const uid = useId();
  const [about, setAbout] = useState('');
  const [body, setBody] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [ref, setRef] = useState(null);
  const ok = body.trim().length >= 10;
  const back = () => settings.update({ help: null });

  const submit = async (e) => {
    e.preventDefault();
    if (!ok || busy) return;
    setBusy(true);
    setError('');
    try {
      const res = await reportConcern({
        body: body.trim(),
        about: about.trim(),
        page: '/settings/help',
      });
      log('sent', res?.ref);
      setRef(res?.ref || null);
      settings.update({ help: 'concern-sent' });
    } catch (err) {
      setError(err?.response?.data?.message || 'We couldn’t send that. Try again, or call 292.');
    } finally {
      setBusy(false);
    }
  };

  if (sent) {
    return (
      <div className="flex flex-col gap-[16px]">
        <PageHeader
          title="Thank you. We’re on it."
          subtitle={`${ref ? `${ref}. ` : ''}A senior member of the GTH safeguarding team will look at this within the hour. You can follow it under Your requests.`}
        />
        <p className="m-0 font-sans text-[14px] text-[#595959]">
          If someone is in danger right now, call the police on 191 or 18555, or the Cyber Security
          Authority on 292.
        </p>
        <div>
          <HelpButton tone="primary" onClick={back}>
            Back to Help centre
          </HelpButton>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[clamp(16px,1.39vw,24px)]">
      <PageHeader
        title="Report a concern"
        subtitle="Worried that someone, especially a young person, is being harmed, pressured or put at risk? Tell us. Only our senior safeguarding team sees this."
      />
      <form
        onSubmit={submit}
        className={classNames(
          PAGE_CARD,
          'flex flex-col items-start gap-[16px] p-[clamp(18px,1.62vw,28px)]'
        )}
      >
        <div className="w-full rounded-[12px] bg-[#faf4e8] px-[14px] py-[10px] font-sans text-[14px] text-[#463409]">
          In an emergency, call the police on 191 or 18555, or the Cyber Security Authority on 292,
          first.
        </div>
        <HelpField
          id={`${uid}-about`}
          label="Who or what is it about? (optional)"
          value={about}
          maxLength={200}
          onChange={(e) => setAbout(e.target.value)}
        />
        <HelpField
          id={`${uid}-body`}
          label="What happened"
          required
          multiline
          maxLength={5000}
          counter={`${body.length} / 5000`}
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        {error ? (
          <p role="alert" className="m-0 font-sans text-[14px] text-[#b42318]">
            {error}
          </p>
        ) : null}
        <div className="flex w-full items-start gap-[10px]">
          <HelpButton size="lg" onClick={back}>
            Cancel
          </HelpButton>
          <span className="h-px min-w-px flex-1" />
          <HelpButton
            tone="primary"
            size="lg"
            disabled={!ok || busy}
            onClick={(e) => e.currentTarget.form?.requestSubmit()}
          >
            {busy ? 'Sending…' : 'Send to the safeguarding team'}
          </HelpButton>
        </div>
      </form>
    </div>
  );
};

export default HelpConcernView;
