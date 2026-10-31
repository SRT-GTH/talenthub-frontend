import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import InstitutionButton from '../../components/sections/institution/InstitutionButton.jsx';
import InstitutionFrame from '../../components/sections/institution/InstitutionFrame.jsx';
import InstitutionPageHero from '../../components/sections/institution/InstitutionPageHero.jsx';
import { useInstitutionState } from '../../components/sections/institution/institutionState.js';
import { useInstitutionSession } from '../../components/sections/institution/useInstitutionSession.js';
import { PUBLIC_PAGE_COPY as COPY } from '../../components/sections/institution/publicPage/data/institutionPublicData.js';
import InstitutionPublicProfile from '../../components/sections/institution/publicPage/InstitutionPublicProfile.jsx';
import { apiMessage, institutionPublicPage } from '../../services/institutionPortal.api.js';
import { debug } from '../../utils/debug.js';

const log = debug('InstitutionPublicPage');

/*
 * InstitutionPublicPage — /institution/public-page (Figma 11.6.1h "Institution page · Public view", 8746:1675). The frame draws the INSTITUTION chrome
 * (rail, top bar, green "Your institution page" hero with "Edit institution page"), i.e. the owner's preview of the public directory page, so it is built
 * inside InstitutionFrame (no rail item is highlighted, as drawn). The content comes from the PUBLIC endpoint GET /institution-public/:slug, so the
 * owner sees exactly what anyone sees; until the school is accredited (and while paused) that endpoint answers 404 and the preview says why.
 * Aggregates only, no student records. Hero title uses Bricolage as drawn (font-heading).
 */

const InstitutionPublicPage = () => {
  const data = useInstitutionState();
  const session = useInstitutionSession();
  const slug = session.institution.slug;
  const [page, setPage] = useState(null);
  const [state, setState] = useState('loading');
  const [error, setError] = useState('');

  const load = useCallback(() => {
    if (!slug) return;
    setState('loading');
    institutionPublicPage(slug)
      .then((res) => {
        log('loaded', { slug });
        setPage(res);
        setState('ready');
      })
      .catch((err) => {
        if (err?.response?.status === 404) {
          setState('not-public');
          return;
        }
        setError(apiMessage(err));
        setState('error');
      });
  }, [slug]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <InstitutionFrame data={data} title="Institution public page" active="none">
      <InstitutionPageHero
        className="[&_h1]:font-heading"
        title={COPY.hero.title}
        subtitle={COPY.hero.subtitle}
        actions={
          <>
            {state === 'ready' && page ? (
              <InstitutionButton to={`/institutions/${encodeURIComponent(page.slug)}`} size="sm">
                Open public page
              </InstitutionButton>
            ) : null}
            <InstitutionButton to="/institution/settings/profile" size="sm">
              Edit institution page
            </InstitutionButton>
          </>
        }
      />
      <nav aria-label="Breadcrumb" className="text-[14px] leading-[17px]">
        <ol className="m-0 flex list-none flex-wrap items-center gap-[8px] p-0">
          {COPY.breadcrumb.map((b) => (
            <li key={b} className="flex items-center gap-[8px]">
              <Link
                to="/institution/public-page"
                className="inline-flex min-h-[24px] items-center font-semibold text-[#387440] no-underline hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
              >
                {b}
              </Link>
              <span aria-hidden="true" className="text-[#595959]">
                ›
              </span>
            </li>
          ))}
          <li aria-current="page" className="font-medium text-[#1c2a21]">
            {page?.name || session.institution.name}
          </li>
        </ol>
      </nav>
      {state === 'loading' ? (
        <p aria-busy="true" className="m-0 text-[14px] leading-[20px] text-[#595959]">
          Loading your public page…
        </p>
      ) : null}
      {state === 'not-public' ? (
        <p
          role="status"
          className="m-0 rounded-[16px] border border-[#e7e7e7] bg-[#faf4e8] px-[20px] py-[16px] text-[15px] leading-[22px] text-[#1c2a21]"
        >
          {COPY.notPublic}{' '}
          <Link to="/institution/accreditation" className="font-semibold text-[#387440]">
            Check your accreditation
          </Link>
        </p>
      ) : null}
      {state === 'error' ? (
        <p role="alert" className="m-0 text-[14px] leading-[20px] text-[#902b20]">
          Could not load your public page. {error}{' '}
          <button
            type="button"
            onClick={load}
            className="cursor-pointer border-0 bg-transparent p-0 font-semibold text-[#387440] underline"
          >
            Try again
          </button>
        </p>
      ) : null}
      {state === 'ready' && page ? <InstitutionPublicProfile page={page} owner /> : null}
    </InstitutionFrame>
  );
};

export default InstitutionPublicPage;
