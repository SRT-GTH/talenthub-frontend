import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInstitutionState } from '../../components/sections/institution/institutionState.js';
import { useInstitutionSession } from '../../components/sections/institution/useInstitutionSession.js';
import InstitutionAccredEmpty from '../../components/sections/institution/onboarding/InstitutionAccredEmpty.jsx';
import InstitutionAccredFooter from '../../components/sections/institution/onboarding/InstitutionAccredFooter.jsx';
import InstitutionAccredHeader from '../../components/sections/institution/onboarding/InstitutionAccredHeader.jsx';
import InstitutionAccredHero from '../../components/sections/institution/onboarding/InstitutionAccredHero.jsx';
import InstitutionAccredList from '../../components/sections/institution/onboarding/InstitutionAccredList.jsx';
import InstitutionAccredRail from '../../components/sections/institution/onboarding/InstitutionAccredRail.jsx';
import InstitutionSubmittedDialog from '../../components/sections/institution/onboarding/InstitutionSubmittedDialog.jsx';
import PageLoader from '../../components/ui/gthLoader/PageLoader.jsx';
import { fileToBase64, openApiFile } from '../../services/agency.api.js';
import {
  apiMessage,
  institutionAccreditation,
  institutionAccreditationDetails,
  institutionAccreditationFile,
  institutionAccreditationRemove,
  institutionAccreditationSubmit,
  institutionAccreditationUpload,
} from '../../services/institutionPortal.api.js';
import { debug } from '../../utils/debug.js';

const log = debug('InstitutionAccreditationPage');

/*
 * InstitutionAccreditationPage — /institution/accreditation (Figma 11.1.2a upload 8589:2399 · 11.1.2a2 documents list 8589:2700 · 11.1.2a3 submitted 8589:3051).
 * The onboarding page (nav · stage bar · hero · content + rail · sticky footer), not the rail chrome. Signed in; changes need the institution admin.
 * Live (backend services/institutionAccreditation.service.js): GET /api/institution/accreditation; a picked or dropped file is uploaded at once
 * (POST …/documents, base64, private); typed details with PUT …/details/:kind; "Next: Review" sends everything (POST …/submit), shows the
 * "Documents submitted." dialog and leads to the status page. While the documents are in review the page is read-only.
 * URL: /institution/accreditation (nothing uploaded yet) · ?view=list (the documents) · ?view=submitted (the list + the dialog).
 */

const InstitutionAccreditationPage = () => {
  const data = useInstitutionState();
  const navigate = useNavigate();
  const session = useInstitutionSession();
  const [view, setView] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const canEdit = session.admin.roleKey ? session.admin.roleKey === 'admin' : true;
  const hasDocs = Boolean(view?.docs?.length);
  const submitted = data.view === 'submitted';
  const listView = data.view === 'list' || submitted || hasDocs;

  const load = useCallback(() => {
    setLoadError(null);
    institutionAccreditation()
      .then(setView)
      .catch((err) => setLoadError(apiMessage(err)));
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
      setError(apiMessage(err));
      return false;
    } finally {
      setBusy(false);
    }
  };

  const upload = (kind, file) =>
    run('upload', async () => {
      const res = await institutionAccreditationUpload({
        kind,
        fileName: file.name,
        data: await fileToBase64(file),
      });
      data.update({ view: 'list' });
      return res;
    });
  const saveDetails = (kind, details) =>
    run('details', () => institutionAccreditationDetails(kind, details));
  const remove = (doc) => run('remove', () => institutionAccreditationRemove(doc.id));
  const open = (doc) =>
    run('open', async () => openApiFile(await institutionAccreditationFile(doc.id)));
  const submit = () =>
    run('submit', async () => {
      const res = await institutionAccreditationSubmit();
      await session.reload?.();
      data.update({ view: 'submitted' });
      return res;
    });

  if (!view && !loadError) return <PageLoader look="focused" />;

  return (
    <div className="flex min-h-dvh flex-col bg-[#f8f8f4] font-sans text-[#1c2a21]">
      <InstitutionAccredHeader
        listView={listView}
        name={session.admin.name}
        done={view?.done ?? 0}
        total={view?.total ?? 4}
        onChangeMode={() => data.update({ view: data.view === 'list' && !hasDocs ? null : 'list' })}
      />
      <main className="flex min-h-0 flex-1 flex-col" aria-label="Accreditation documents">
        <InstitutionAccredHero />
        <div className="flex flex-col gap-[32px] px-[clamp(16px,3.7vw,64px)] py-[40px] lg:flex-row lg:items-start lg:gap-[64px]">
          <div className="min-w-0 flex-1">
            {loadError ? (
              <div
                role="alert"
                className="flex flex-col items-start gap-[10px] rounded-[20px] border border-solid border-[#1c2a21]/10 bg-white p-[20px]"
              >
                <p className="m-0 text-[15px] text-[#1c2a21]">
                  We couldn’t load your documents. {loadError}
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
              <InstitutionAccredList
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
              <InstitutionAccredEmpty
                institutionName={session.institution.name}
                gesNumber={session.institution.accreditationNumber}
                busy={busy}
                error={error}
                onAdd={(file) => upload('licence', file)}
                onManual={() => data.update({ view: 'list' })}
              />
            )}
          </div>
          <InstitutionAccredRail />
        </div>
      </main>
      <InstitutionAccredFooter
        canContinue={Boolean(view && (view.canSubmit || view.inReview)) && !busy}
        nextLabel={view?.inReview ? 'See your status' : busy ? 'Saving…' : 'Next: Review'}
        savedLabel={
          view?.missing?.length ? `Still to add: ${view.missing.join(', ')}` : 'Auto-saved'
        }
        onNext={() => (view?.inReview ? navigate('/institution/accreditation/status') : submit())}
      />
      {submitted ? (
        <InstitutionSubmittedDialog
          documents={view?.docs?.length || 4}
          onClose={() => data.update({ view: 'list' })}
        />
      ) : null}
    </div>
  );
};

export default InstitutionAccreditationPage;
