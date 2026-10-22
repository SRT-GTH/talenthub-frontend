import AccentText from '../shared/AccentText.jsx';
import Button from '../../../ui/Button.jsx';
import { ArrowRightIcon } from '../../../shared/assets.jsx';
import { FaqChatIcon, FaqMessageIcon } from './FaqIcons.jsx';
import { FAQ_HELP } from './FaqData.js';
import buddyMascot from '../../../../assets/landing/career-buddy-mascot.png';
import { debug } from '../../../../utils/debug.js';

const log = debug('FaqHelp');

/* Card tile (48x48): Career Buddy = mint circle + mascot (46px), Email = gold r14 + message, WhatsApp = peach r14 + chat; 1.5px ink border on the last two. */
const Tile = ({ id }) => {
  if (id === 'buddy') {
    return (
      <span className="flex size-12 items-center justify-center rounded-full bg-[#ebf1ec]">
        <img src={buddyMascot} alt="" className="size-[46px] rounded-full object-cover" />
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

const CtaButton = ({ card }) => {
  const onClick = () => log('help cta clicked', { id: card.id, href: card.href ?? 'inert' });
  if (card.id === 'buddy') {
    return (
      <Button size="sm" rightIcon={<ArrowRightIcon />} className="w-fit" onClick={onClick}>
        {card.cta}
      </Button>
    );
  }
  const button = (
    <Button
      variant="tertiary-subtle"
      size="md"
      className="w-fit !rounded-[14px] !px-[34px] !py-[14px]"
      onClick={onClick}
      tabIndex={card.href ? -1 : undefined}
    >
      {card.cta}
    </Button>
  );
  return card.href ? (
    <a href={card.href} className="w-fit no-underline">
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
