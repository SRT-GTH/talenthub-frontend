import { debug } from '../../../../utils/debug.js';
import ParentButton from '../ParentButton.jsx';
import spotSent from '../../../../assets/parent/spot-sent.svg';
import spotSettings from '../../../../assets/parent/spot-settings.svg';
import { CLOSED, LOGGED_OUT } from './data/settingsData.js';

const log = debug('SettingsResult');

/*
 * SettingsResult — the two full-page result screens of the Settings flow: PS-06b "You’re logged out" (Figma 10056:157278) and PS-07b "Parent account closed" (10056:157684). A 34/600 page title and
 * one white card (r24, #e7e7e7 hairline, soft shadow, p44, gap14, centred): a 96px spot, a 24/600 title, a 14/400 #575755 body (max 520 / 560) and the buttons.
 * Props: kind ('logged-out' | 'closed'), onLogIn, onCareer, onUndo.
 */
const Card = ({ spot, title, body, preserve, children }) => (
  <section
    aria-label={title}
    className="flex flex-col items-center gap-[14px] rounded-[24px] border border-solid border-[#e7e7e7] bg-white p-[clamp(24px,2.55vw,44px)] text-center shadow-[0_5px_17px_rgba(28,42,33,0.03)]"
  >
    <img src={spot} alt="" aria-hidden="true" className="size-[96px] shrink-0" />
    <h2 className="m-0 text-[24px] leading-[29px] font-semibold text-[#1c2a21]">{title}</h2>
    <p
      className={`m-0 max-w-[560px] text-[14px] leading-[20px] text-[#575755] ${preserve ? 'whitespace-pre-wrap' : ''}`}
    >
      {body}
    </p>
    <div className="flex flex-wrap items-center justify-center gap-[12px] pt-[6px]">{children}</div>
  </section>
);

const SettingsResult = ({ kind, onLogIn, onCareer, onUndo }) => {
  log('render', { kind });
  const closed = kind === 'closed';
  return (
    <div className="flex flex-col gap-[24px]">
      <h1 className="m-0 text-[clamp(26px,1.97vw,34px)] leading-[1.2] font-semibold tracking-[-0.68px] text-[#1c2a21]">
        {closed ? CLOSED.page : LOGGED_OUT.page}
      </h1>
      {closed ? (
        <Card spot={spotSettings} title={CLOSED.title} body={CLOSED.body} preserve>
          <ParentButton onClick={onCareer}>{CLOSED.career}</ParentButton>
          <ParentButton variant="secondary" onClick={onUndo}>
            {CLOSED.undo}
          </ParentButton>
        </Card>
      ) : (
        <Card spot={spotSent} title={LOGGED_OUT.title} body={LOGGED_OUT.body}>
          <ParentButton onClick={onLogIn}>{LOGGED_OUT.cta}</ParentButton>
        </Card>
      )}
    </div>
  );
};

export default SettingsResult;
