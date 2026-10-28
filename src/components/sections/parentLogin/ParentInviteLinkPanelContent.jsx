import { debug } from '../../../utils/debug.js';

import { useWardDisplay } from '../../../services/parentInvite.api.js';

const log = debug('ParentInviteLinkPanelContent');

/*
 * WardLinkPanelContent — centered content for the SIMPLE right-panel variant on
 * the Flow B Link Ward step. Figma 2864:37681.
 *
 * Heading + subtitle + a vertical "You → Kofi" link diagram (amber parent
 * avatar connected to the green ward avatar).
 */

const PersonGlyph = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
    <circle cx="11" cy="8" r="3.6" stroke="#ffffff" strokeWidth="1.6" />
    <path
      d="M4.5 18c1-3.2 3.6-5 6.5-5s5.5 1.8 6.5 5"
      stroke="#ffffff"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);

const WardLinkPanelContent = () => {
  const ward = useWardDisplay();
  log('render');
  return (
    <div className="flex w-full max-w-[300px] flex-col items-center text-center">
      {/* Heading — Figma 2864:37685 */}
      <h2
        className="font-heading font-semibold"
        style={{ fontSize: 30, color: '#ffffff', letterSpacing: '-0.02em', lineHeight: '36px' }}
      >
        Ward linked
        <br />
        automatically.
      </h2>

      {/* Subtitle — Figma 2864:37686 */}
      <p
        className="mt-[16px] font-sans"
        style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: '21.45px' }}
      >
        Because {ward.firstName} gave your contact during registration, your link already points to
        them.
      </p>

      {/* Link diagram — Figma 2864:37687 … 37697 */}
      <div className="mt-[28px] flex flex-col items-center">
        {/* You — amber avatar */}
        <span
          className="flex size-[52px] items-center justify-center rounded-full"
          style={{ backgroundColor: '#c8951a', boxShadow: '0px 3px 0px rgba(0,0,0,0.15)' }}
        >
          <PersonGlyph />
        </span>
        <span
          className="mt-[8px] font-sans font-semibold"
          style={{ fontSize: 12, color: '#ffffff' }}
        >
          You
        </span>

        {/* Connector */}
        <span
          className="my-[8px] h-[30px] w-[2px] rounded-full"
          style={{ backgroundColor: 'rgba(255,255,255,0.35)' }}
        />

        {/* Kofi Mensah — green avatar */}
        <span
          className="mb-[8px] font-sans font-semibold"
          style={{ fontSize: 12, color: '#ffffff' }}
        >
          {ward.fullName}
        </span>
        <span
          className="flex size-[52px] items-center justify-center rounded-full"
          style={{ backgroundColor: '#387440', boxShadow: '0px 3px 0px #2a5730' }}
        >
          <PersonGlyph />
        </span>
      </div>
    </div>
  );
};

export default WardLinkPanelContent;
