import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import InstitutionPublicProfile from '../../components/sections/institution/publicPage/InstitutionPublicProfile.jsx';
import PublicDataFrame from '../../components/sections/publicData/PublicDataFrame.jsx';
import { usePublicDataState } from '../../components/sections/publicData/publicDataState.js';
import { apiMessage, institutionPublicPage } from '../../services/institutionPortal.api.js';
import { debug } from '../../utils/debug.js';

const log = debug('InstitutionSchoolPublicPage');

/*
 * InstitutionSchoolPublicPage — /institutions/:slug, a school's PUBLIC page (Figma 11.6.1h body; no sign-in). It wears the Theme 8 public
 * chrome ("Directory"), like the public credential check, and shows the same body as the owner preview in the portal (InstitutionPublicProfile,
 * without portal links). Live: GET /api/institution-public/:slug, which answers 404 for an unknown slug and for schools that are not
 * accredited, paused or inactive (one "not found" state for all of them, so nothing leaks about schools that are not public).
 * The document title is the school's name. Aggregates only, no student records.
 */

const NotFound = () => (
  <div className="flex flex-col items-start gap-[10px] rounded-[24px] border border-[#e7e7e7] bg-white p-[28px]">
    <h1 className="m-0 font-heading text-[26px] leading-[32px] font-semibold text-[#1c2a21]">
      School not found
    </h1>
    <p className="m-0 max-w-[560px] text-[15px] leading-[22px] text-[#595959]">
      There is no public page at this address. The link may be mistyped, or the school is not listed
      on Ghana Talent Hub yet.
    </p>
    <Link to="/" className="text-[15px] font-semibold text-[#387440]">
      Go to Ghana Talent Hub
    </Link>
  </div>
);

const InstitutionSchoolPublicPage = () => {
  const { slug } = useParams();
  const data = usePublicDataState();
  const [page, setPage] = useState(null);
  const [state, setState] = useState('loading');
  const [error, setError] = useState('');

  const load = useCallback(() => {
    setState('loading');
    institutionPublicPage(slug)
      .then((res) => {
        log('loaded', { slug });
        setPage(res);
        setState('ready');
      })
      .catch((err) => {
        if (err?.response?.status === 404) {
          setState('not-found');
          return;
        }
        setError(apiMessage(err));
        setState('error');
      });
  }, [slug]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const before = document.title;
    if (page?.name) document.title = `${page.name} · Ghana Talent Hub`;
    else if (state === 'not-found') document.title = 'School not found · Ghana Talent Hub';
    return () => {
      document.title = before;
    };
  }, [page, state]);

  return (
    <PublicDataFrame data={data} title="Directory" active="directory">
      <div className="flex min-w-0 flex-col gap-[24px]">
        {state === 'loading' ? (
          <p aria-busy="true" className="m-0 text-[14px] leading-[20px] text-[#595959]">
            Loading the school’s page…
          </p>
        ) : null}
        {state === 'not-found' ? <NotFound /> : null}
        {state === 'error' ? (
          <p role="alert" className="m-0 text-[14px] leading-[20px] text-[#902b20]">
            Could not load this page. {error}{' '}
            <button
              type="button"
              onClick={load}
              className="cursor-pointer border-0 bg-transparent p-0 font-semibold text-[#387440] underline"
            >
              Try again
            </button>
          </p>
        ) : null}
        {state === 'ready' && page ? (
          <>
            <h1 className="sr-only">{page.name}</h1>
            <InstitutionPublicProfile page={page} />
          </>
        ) : null}
      </div>
    </PublicDataFrame>
  );
};

export default InstitutionSchoolPublicPage;
