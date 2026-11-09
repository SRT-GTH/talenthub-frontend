import { useEffect } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import TwoStepPanel from '../components/sections/twoStep/TwoStepPanel.jsx';
import WavyDivider from '../components/shared/WavyDivider.jsx';
import { isLoggedIn, logout, logoHomePath } from '../services/auth.api.js';
import { debug } from '../utils/debug.js';

const log = debug('TwoStepPage');

/*
 * TwoStepPage — /security/2-step: 2-step verification for any signed-in account (user stories A1, A2, F).
 *   /security/2-step                      manage it (from Settings, or the reminder banner)
 *   /security/2-step?required=1           the forced set-up: the account must use 2-step and its grace period is over, so every other
 *                                         request answers 403 MFA_ENROLMENT_REQUIRED (services/api.js sends people here). No way round it
 *                                         but "Sign out".
 *   &next=/admin                          where to go once 2-step is on (default: the account's home)
 * The page only calls /security/mfa*, which stays open to a blocked session.
 */

const safeNext = (next) =>
  next && next.startsWith('/') && !next.startsWith('//') && !next.startsWith('/security/2-step')
    ? next
    : null;

const TwoStepPage = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const required = params.get('required') === '1';
  const next = safeNext(params.get('next'));

  useEffect(() => {
    log('mount', { required, hasNext: Boolean(next) });
  }, [required, next]);

  if (!isLoggedIn()) return <Navigate to="/login" replace />;

  const leave = () => navigate(next || logoHomePath(), { replace: true });

  return (
    <div className="flex w-full justify-center px-[16px] pt-[clamp(104px,14vw,148px)] pb-[56px]">
      <div className="flex w-full max-w-[720px] flex-col gap-[24px]">
        <header className="flex flex-col items-center gap-[10px] text-center">
          <h1
            className="m-0 font-heading font-semibold tracking-[-0.01em]"
            style={{ fontSize: 'clamp(1.75rem, 3.4vw, 3rem)', lineHeight: 1.1 }}
          >
            <span className="block text-black">{required ? 'Set up' : 'Your'}</span>
            <span className="block text-brand-green">2-step verification.</span>
          </h1>
          <p className="m-0 max-w-[460px] font-sans text-[14px] leading-[20px] tracking-[0.2px] text-[#737373]">
            {required
              ? 'Your account looks after other people’s information, so it needs a second step at sign-in. It takes about two minutes.'
              : 'A second step at sign-in keeps your account safe even if someone learns your password.'}
          </p>
          <WavyDivider />
        </header>

        <TwoStepPanel autoStart={required} onEnabled={leave} />

        <div className="flex flex-wrap items-center justify-center gap-[20px] font-sans text-[14px]">
          {required ? (
            <button
              type="button"
              onClick={() => {
                log('sign out from forced set-up');
                logout();
                navigate(next && next.startsWith('/admin') ? '/admin/sign-in' : '/login', {
                  replace: true,
                });
              }}
              className="cursor-pointer border-0 bg-transparent font-semibold text-[#737373] underline-offset-2 hover:underline"
            >
              Sign out
            </button>
          ) : (
            <Link
              to={next || logoHomePath()}
              className="font-semibold text-brand-green underline-offset-2 hover:underline"
            >
              Back
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default TwoStepPage;
