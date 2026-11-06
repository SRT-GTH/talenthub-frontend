import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAgencyState } from '../../components/sections/agency/agencyState.js';
import { useAgencySessionState } from '../../components/sections/agency/agencySessionStore.js';
import { useAgencySession } from '../../components/sections/agency/useAgencySession.js';
import AgencyMouEmpty from '../../components/sections/agency/onboarding/AgencyMouEmpty.jsx';
import AgencyMouFooter from '../../components/sections/agency/onboarding/AgencyMouFooter.jsx';
import AgencyMouHeader from '../../components/sections/agency/onboarding/AgencyMouHeader.jsx';
import AgencyMouHero from '../../components/sections/agency/onboarding/AgencyMouHero.jsx';
import AgencyMouList from '../../components/sections/agency/onboarding/AgencyMouList.jsx';
import AgencyMouRail from '../../components/sections/agency/onboarding/AgencyMouRail.jsx';
import PageLoader from '../../components/ui/gthLoader/PageLoader.jsx';
import {
  agencyMou,
  agencyMouDetails,
  agencyMouFile,
  agencyMouRemove,
  agencyMouSubmit,
  agencyMouUpload,
  fileToBase64,
  openApiFile,
} from '../../services/agency.api.js';
import { debug } from '../../utils/debug.js';

const log = debug('AgencyMouPage');

/*
 * AgencyMouPage — /agency/mou (Figma 11.4.1b upload 8596:988 · 11.4.1b2 documents list 8596:1290), signed in (agency admin to change anything).
 * Like the sign-up it draws the onboarding page (nav · stage bar · hero · content + rail · sticky footer), not the rail chrome.
 * Live (backend services/agencyMou.service.js): GET /api/agency/mou; a picked or dropped file is uploaded at once (POST /mou/documents, base64, private);
 * typed details are saved with PUT /mou/details/:kind; "Next: Review" sends everything (POST /mou/submit) and opens the MoU status page.
 * URL: /agency/mou (nothing uploaded yet: the empty state) · /agency/mou?view=list (the documents). While the documents are in review the page is read-only.
 */

const errText = (err) =>
  err?.response?.data?.message || err?.message || 'Something went wrong. Try again.';

const AgencyMouPage = () => {
  const data = useAgencyState();
  const navigate = useNavigate();
  const sessionCtx = useAgencySessionState();
  const session = useAgencySession();
  const [view, setView] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  // the server refuses changes from analysts and viewers too; this only hides the buttons
  const canEdit = session?.analyst?.role !== 'Analyst';
  const hasDocs = Boolean(view?.docs?.length);
  const listView = data.view === 'list' || hasDocs;

  const load = useCallback(() => {
    setLoadError(null);
    agencyMou()
      .then(setView)
      .catch((err) => setLoadError(errText(err)));
  }, []);
  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    log('mount', { listView, docs: view?.docs?.length ?? 0, status: view?.status });
  }, [listView, view?.docs?.length, view?.status]);

  /** Runs one change; the response is the new state of the page. Returns true when it worked. */
  const run = async (what, fn) => {
    setBusy(true);
    setError(null);
    try {
      const next = await fn();
      if (next && next.required) setView(next);
      log(what, 'ok');
      return true;
    } catch (err) {
      log(what, 'failed', err?.response?.status);
      setError(errText(err));
      return false;
    } finally {
      setBusy(false);
    }
  };

  const upload = (kind, file) =>
    run('upload', async () => {
      const b64 = await fileToBase64(file);
      const res = await agencyMouUpload({ kind, fileName: file.name, data: b64 });
      data.update({ view: 'list' });
      return res;
    });
  const saveDetails = (kind, details) => run('details', () => agencyMouDetails(kind, details));
  const remove = (doc) => run('remove', () => agencyMouRemove(doc.id));
  const open = (doc) => run('open', async () => openApiFile(await agencyMouFile(doc.id)));
  const submit = () =>
    run('submit', async () => {
      const res = await agencyMouSubmit();
      await sessionCtx?.reload?.();
      navigate('/agency/mou/status');
      return res;
    });

  if (!view && !loadError) return <PageLoader look="focused" />;

  return (
    <div className="flex min-h-dvh flex-col bg-[#f8f8f4] font-sans text-[#1c2a21]">
      <AgencyMouHeader
        listView={listView}
        name={session?.analyst?.name}
        done={view?.done ?? 0}
        total={view?.total ?? 4}
        onChangeMode={() => data.update({ view: data.view === 'list' && !hasDocs ? null : 'list' })}
      />
      <main className="flex min-h-0 flex-1 flex-col" aria-label="Upload your signed MoU">
        <AgencyMouHero />
        <div className="flex flex-col gap-[32px] px-[clamp(16px,3.7vw,64px)] py-[40px] lg:flex-row lg:items-start lg:gap-[64px]">
          <div className="min-w-0 flex-1">
            {loadError ? (
              <div
                role="alert"
                className="flex flex-col items-start gap-[10px] rounded-[20px] border border-solid border-[#1c2a21]/10 bg-white p-[20px]"
              >
                <p className="m-0 text-[15px] text-[#1c2a21]">
                  We couldn’t load your MoU documents. {loadError}
                </p>
                <button
                  type="button"
                  onClick={load}
                  className="font-semibold text-[#387440] underline"
                >
                  Try again
                </button>
              </div>
            ) : listView ? (
              <AgencyMouList
                view={view}
                busy={busy}
                canEdit={canEdit}
                error={error}
                onUpload={upload}
                onSaveDetails={saveDetails}
                onRemove={remove}
                onOpen={open}
              />
            ) : (
              <AgencyMouEmpty
                agencyName={session?.agency?.name}
                busy={busy}
                error={error}
                onAdd={(file) => upload('mou', file)}
                onManual={() => data.update({ view: 'list' })}
              />
            )}
          </div>
          <AgencyMouRail />
        </div>
      </main>
      <AgencyMouFooter
        canContinue={Boolean(view && (view.canSubmit || view.inReview)) && !busy}
        nextLabel={view?.inReview ? 'See your MoU status' : busy ? 'Saving…' : 'Next: Review'}
        savedLabel={
          view?.missing?.length ? `Still to add: ${view.missing.join(', ')}` : 'Auto-saved'
        }
        onNext={() => (view?.inReview ? navigate('/agency/mou/status') : submit())}
      />
    </div>
  );
};

export default AgencyMouPage;
