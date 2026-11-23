import { useState } from 'react';
import { Link } from 'react-router-dom';
import PrivacyPolicyModal from './PrivacyPolicyModal.jsx';
import { debug } from '../../utils/debug.js';

const log = debug('AuthFooter');

/*
 * AuthFooter — the slim footer under the role-selection screen (Figma 8308:55928 Focused / same in Playful 2153:13443):
 * #f8f8f4 bar, 1px #dbdbdb border, 48px sides, 7px tall padding; "Made in Ghana · © 2026 Ghana Talent Hub" (Instrument Sans 12
 * #6b6b6b), three faded partner-logo squares + "+246 partner companies", and About · Privacy · Contact (12px brand green).
 * Under it a 5px kente stripe: green / yellow / red thirds repeating every 340px.
 * Link targets are not drawn: About -> landing home (⚠️ ASSUMPTION, there is no About page), Privacy -> the shared privacy dialog
 * (as in the landing footer), Contact -> mailto info@ghanatalenthub.com.
 */
const STRIPE = {
  backgroundImage:
    'repeating-linear-gradient(90deg, #006b3f 0 113.33px, #fcd116 113.33px 226.66px, #ce1126 226.66px 340px)',
};

const LINK =
  'text-[12px] leading-[18px] tracking-[0.2px] text-brand-green no-underline hover:underline';

const AuthFooter = () => {
  const [privacyOpen, setPrivacyOpen] = useState(false);
  log('render', { privacyOpen });
  return (
    <footer className="shrink-0">
      <div className="flex items-center justify-between gap-4 border border-[#dbdbdb] bg-[#f8f8f4] px-12 py-[7px] max-md:flex-col max-md:gap-1 max-md:px-5 max-md:py-2">
        <p className="m-0 p-[10px] font-ui text-[12px] text-[#6b6b6b] max-md:p-0">
          Made in Ghana · © 2026 Ghana Talent Hub
        </p>
        <div className="flex items-center gap-3 px-2 py-[10px] max-md:py-0">
          {['MTN', 'Unilever', 'Vodafone'].map((name) => (
            <span
              key={name}
              aria-hidden="true"
              className="size-6 rounded-[6px] border border-[rgba(28,42,33,0.09)] bg-[rgba(28,42,33,0.05)] opacity-30"
            />
          ))}
          <span className="text-[12px] leading-5 tracking-[0.2px] text-[#6b6b6b]">
            +246 partner companies
          </span>
        </div>
        <nav aria-label="Footer" className="flex items-center gap-3 py-[10px] max-md:py-0">
          <Link to="/" className={LINK} onClick={() => log('about')}>
            About
          </Link>
          <span aria-hidden="true" className="font-ui text-[12px] text-[#6b6b6b]">
            ·
          </span>
          <button
            type="button"
            className={`${LINK} cursor-pointer border-0 bg-transparent p-0`}
            onClick={() => {
              log('privacy dialog');
              setPrivacyOpen(true);
            }}
          >
            Privacy
          </button>
          <span aria-hidden="true" className="font-ui text-[12px] text-[#6b6b6b]">
            ·
          </span>
          <a href="mailto:info@ghanatalenthub.com" className={LINK} onClick={() => log('contact')}>
            Contact
          </a>
        </nav>
      </div>
      <div aria-hidden="true" className="h-[5px] w-full" style={STRIPE} />
      {privacyOpen ? (
        <PrivacyPolicyModal
          ctaLabel="Got it"
          onAccept={() => setPrivacyOpen(false)}
          onClose={() => setPrivacyOpen(false)}
        />
      ) : null}
    </footer>
  );
};

export default AuthFooter;
