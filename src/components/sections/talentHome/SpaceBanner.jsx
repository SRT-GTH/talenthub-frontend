import { useLocation, useNavigate } from 'react-router-dom';
import { debug } from '../../../utils/debug.js';

const log = debug('SpaceBanner');

/*
 * SpaceBanner — "toast · switched to My career" (Figma 10036:1295 on TC-01): a dark #1c2a21 pill, r16, p12/16, gap 12, 543 wide, drawn at the top of the page under the nav, centred over the content:
 * a white user glyph, "You’re in My career" 14/600 over a 12/400 line (80 %), and "Back to Parent view" 13/600 #f2c74a on the right. Shown while the talent home is `?as=emma` (a parent who is also a talent).
 * Props: persona (emmaPersona.js EMMA). "Back to Parent view" goes to /parent.
 */
const SpaceBanner = ({ persona }) => {
  const navigate = useNavigate();
  const { search } = useLocation();
  // TC-02 (the switch menu open) draws no banner.
  if (new URLSearchParams(search).get('menu') === 'switch') return null;
  const { title, body, back } = persona.banner;
  return (
    <div
      role="status"
      className="pointer-events-none fixed top-[98px] left-1/2 lg:left-[calc(50%+151px)] z-40 flex w-max min-w-[min(543px,calc(100vw-24px))] max-w-[calc(100vw-24px)] -translate-x-1/2 max-lg:top-[88px]"
    >
      <div className="pointer-events-auto flex w-full items-center gap-[12px] rounded-[16px] bg-[#1c2a21] px-[16px] py-[12px] font-sans shadow-[0_8px_24px_rgba(28,42,33,0.2)]">
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
          className="shrink-0"
        >
          <circle cx="10" cy="6.5" r="3" stroke="#fff" strokeWidth="1.5" />
          <path
            d="M3.8 17c.5-3 3-4.7 6.2-4.7s5.7 1.7 6.2 4.7"
            stroke="#fff"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        <div className="flex min-w-0 flex-1 flex-col gap-[2px]">
          <span className="text-[14px] leading-[17px] font-semibold text-white">{title}</span>
          <span className="text-[12px] leading-[14px] text-white/80 lg:whitespace-nowrap">
            {body}
          </span>
        </div>
        <button
          type="button"
          onClick={() => {
            log('back to Parent view');
            navigate('/parent');
          }}
          className="shrink-0 cursor-pointer border-0 bg-transparent p-0 text-[13px] leading-[16px] font-semibold whitespace-nowrap text-[#f2c74a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f2c74a]"
        >
          {back}
        </button>
      </div>
    </div>
  );
};

export default SpaceBanner;
