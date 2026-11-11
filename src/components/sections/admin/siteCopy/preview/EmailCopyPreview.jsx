import { useEffect, useState } from 'react';
import { debug } from '../../../../../utils/debug.js';
import { emailCopyPreview } from '../../../../../services/siteCopy.api.js';
import { COPY_SECTIONS } from '../../../../../copy/copyRegistry.js';
import { flushSection } from '../live/copyLive.js';

const log = debug('EmailCopyPreview');

/*
 * EmailCopyPreview — Site copy → Emails → Preview: the designed email as the backend renders it (sample data), with your draft text
 * ("My draft") or the published text ("What everyone sees now"). GET /api/admin/copy/emails/:name/preview → { subject, html }.
 * Props: sectionId, view ('draft' | 'published'), device.
 */
const WIDTH = { desktop: '100%', tablet: 700, phone: 390 };

const EmailCopyPreview = ({ sectionId, view, device }) => {
  const name = COPY_SECTIONS[sectionId]?.preview?.email;
  const [state, setState] = useState({ status: 'loading' });

  useEffect(() => {
    let alive = true;
    setState({ status: 'loading' });
    Promise.resolve(view === 'draft' ? flushSection(sectionId) : null)
      .then(() => emailCopyPreview(name, view))
      .then(
        (r) =>
          alive && setState({ status: 'ready', subject: r?.subject ?? '', html: r?.html ?? '' })
      )
      .catch((e) => {
        log('preview failed', e?.message);
        if (alive) setState({ status: 'error' });
      });
    return () => {
      alive = false;
    };
  }, [name, sectionId, view]);

  if (state.status === 'loading') {
    return <p className="m-0 p-6 font-sans text-[15px] text-[#595959]">Rendering the email…</p>;
  }
  if (state.status === 'error') {
    return (
      <p className="m-0 p-6 font-sans text-[15px] text-[#8a1c1c]">
        Couldn’t render this email. Try again.
      </p>
    );
  }
  return (
    <div className="flex flex-col gap-3 p-4">
      <p className="m-0 font-sans text-[14px] text-[#1c2a21]">
        <span className="font-semibold">Subject: </span>
        {state.subject}
      </p>
      <iframe
        title="Email preview"
        sandbox=""
        srcDoc={state.html}
        className="mx-auto block border-0 bg-white"
        style={{ width: WIDTH[device] ?? '100%', maxWidth: '100%', height: 900 }}
      />
      <p className="m-0 font-sans text-[12.5px] text-[#575755]">
        Sample names and numbers. Real emails fill in each person’s own.
      </p>
    </div>
  );
};

export default EmailCopyPreview;
