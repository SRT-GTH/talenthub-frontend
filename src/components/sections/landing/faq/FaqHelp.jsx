import AccentText from '../shared/AccentText.jsx';
import Button from '../../../ui/Button.jsx';
import { ArrowRightIcon } from '../../../shared/assets.jsx';
import { FaqChatIcon, FaqMessageIcon } from './FaqIcons.jsx';
import { FAQ_HELP } from './FaqData.js';
import buddyMascot from '../../../../assets/landing/career-buddy-mascot.png';
import { debug } from '../../../../utils/debug.js';
import { Link } from 'react-router-dom';
import { isLoggedIn, logoHomePath } from '../../../../services/auth.api.js';
import { loginThen } from '../../../../utils/authNext.js';

const log = debug('FaqHelp');

// Mascot placement in its 46px circle: image 160x147 scaled to 46px tall; content centre (74, 78) moved to the circle centre (23, 23).
const MASCOT = (() => {
  const box = 46;
  const k = box / 147;
  return { w: 160 * k, h: box, left: box / 2 - 74 * k, top: box / 2 - 78 * k };
})();

/* Card tile (48x48): Career Buddy = mint circle + mascot (46px), Email = gold r14 + message, WhatsApp = peach r14 + chat; 1.5px ink border on the last two. */
const Tile = ({ id }) => {
  if (id === 'buddy') {
    return (
      <span className="flex size-12 items-center justify-center rounded-full bg-[#ebf1ec]">
        {/* The mascot PNG (160x147) is not centred in its canvas: its visible part spans x 13–135, y 17–139, so its middle is
            (74, 78) not (80, 73.5). Scale the image to the 46px height and offset it so that middle lands on the circle's centre. */}
        <span className="relative size-[46px] overflow-hidden rounded-full">
          <img
            src={buddyMascot}
            alt=""
            className="absolute max-w-none"
            style={{ width: MASCOT.w, height: MASCOT.h, left: MASCOT.left, top: MASCOT.top }}
          />
        </span>
      </span>
    );
  }
  const email = id === 'email';
  return (
    <span
      className="flex size-12 items-center justify-center rounded-[14px] border-[1.5px] border-[#1c2a21] text-[#1c2a21]"
      style={{ backgroundColor: email ? '#ffd86b' : '#f9c9b6' }}
    >
      {email ? <FaqMessageIcon size={24} /> : <FaqChatIcon size={24} />}
    </span>
  );
};

/*
 * Destinations (product owner, 2026-11-13; Figma draws none):
 *   Start chat     -> the account's Career Buddy: talent /profile/filling/career-buddy, recruiter /profile/filling/recruiter-buddy,
 *                     parent /parent?buddy=open; signed out -> log in, then the talent Buddy (utils/authNext.js)
 *   Send an email  -> mailto (FaqData href)
 *   Open WhatsApp  -> https://wa.me/<VITE_SUPPORT_WHATSAPP> in a new tab. ⚠️ No support number exists yet: until the env var is
 *                     set the button stays inert (logged) rather than pointing at an invented number.
 */
const TALENT_BUDDY = '/profile/filling/career-buddy';
const buddyPath = () => {
  if (!isLoggedIn()) return loginThen(TALENT_BUDDY);
  const home = logoHomePath();
  if (home === '/home') return TALENT_BUDDY;
  if (home === '/recruiter/home') return '/profile/filling/recruiter-buddy';
  if (home === '/parent') return '/parent?buddy=open';
  return home;
};
const WHATSAPP_NUMBER = String(import.meta.env.VITE_SUPPORT_WHATSAPP || '').replace(/\D/g, '');
const whatsappHref = WHATSAPP_NUMBER
  ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hi GTH, I need help with ')}`
  : null;

const CtaButton = ({ card }) => {
  const href = card.id === 'whatsapp' ? whatsappHref : card.href;
  const onClick = () =>
    log('help cta clicked', {
      id: card.id,
      href: href ?? (card.id === 'whatsapp' ? 'inert: VITE_SUPPORT_WHATSAPP not set' : 'inert'),
    });
  if (card.id === 'buddy') {
    const to = buddyPath();
    return (
      <Link
        to={to}
        onClick={() => log('help cta: start chat ->', to)}
        className="w-fit no-underline"
      >
        <Button size="sm" rightIcon={<ArrowRightIcon />} className="w-fit" tabIndex={-1}>
          {card.cta}
        </Button>
      </Link>
    );
  }
  const button = (
    <Button
      variant="tertiary-subtle"
      size="md"
      className="w-fit !rounded-[14px] !px-[34px] !py-[14px]"
      onClick={onClick}
      tabIndex={href ? -1 : undefined}
    >
      {card.cta}
    </Button>
  );
  const external = href?.startsWith('http');
  return href ? (
    <a
      href={href}
      onClick={onClick}
      className="w-fit no-underline"
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {button}
    </a>
  ) : (
    button
  );
};

/*
 * FaqHelp — "Section · Still need help" (Figma 7797:31793, 1728x569, #14301a, lime glow, pad 100/96, gap 40).
 * Head: gold chip + Instrument Serif 56 white. Three cards (499 wide, r26, #fffdf7, ink border + hard shadow, pad 24, gap 12): tile, Bricolage 23/600 title, 15/22 body, button.
 * Tablet / mobile: cards stack. ⚠️ Only the e-mail card has a drawn target (the address in its copy); the others are inert (log only).
 */
const FaqHelp = () => {
  log('render');
  return (
    <section className="relative isolate overflow-hidden bg-[#14301a] px-5 py-14 md:px-10 md:py-[72px] xl:px-24 xl:py-[100px]">
      <div className="pointer-events-none absolute -right-[72px] -top-[100px] -z-10 size-[600px] rounded-full bg-[#84cc16]/15 blur-[200px]" />
      <div className="mx-auto flex w-full max-w-[1536px] flex-col items-center gap-10">
        <header className="flex flex-col items-center gap-3 text-center">
          <span className="inline-flex items-center rounded-full border border-[#1c2a21] bg-[#ffd86b] px-3 py-[5px] font-sans text-[13px] font-semibold leading-[15.5px] text-[#1c2a21]">
            {FAQ_HELP.chip}
          </span>
          <h2 className="m-0 font-heading text-[32px] font-semibold leading-[1.1] md:text-[35px] xl:text-[47px] text-white">
            <AccentText accent="or Career Buddy." tone="gold">
              {FAQ_HELP.title}
            </AccentText>
          </h2>
        </header>
        <ul className="m-0 grid w-full list-none grid-cols-1 gap-5 p-0 md:grid-cols-2 xl:grid-cols-3">
          {FAQ_HELP.cards.map((card) => (
            <li
              key={card.id}
              className="flex flex-col md:last:col-span-2 xl:last:col-span-1 items-start gap-3 rounded-[26px] border-[1.4px] border-[#1c2a21]/[.32] bg-[#fffdf7] p-6 shadow-[5px_5px_0_rgba(28,42,33,0.2),0_10px_24px_rgba(28,42,33,0.06)]"
            >
              <Tile id={card.id} />
              <h3 className="m-0 font-heading text-[23px] font-semibold leading-[28.8px] text-[#1c2a21]">
                {card.title}
              </h3>
              <p className="m-0 font-sans text-[15px] leading-[22px] text-[#595959]">{card.body}</p>
              <CtaButton card={card} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default FaqHelp;
