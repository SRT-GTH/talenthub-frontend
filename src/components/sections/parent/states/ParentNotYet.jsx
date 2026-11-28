import { debug } from '../../../../utils/debug.js';
import ParentButton from '../ParentButton.jsx';
import TabCard from '../wards/tabs/TabCard.jsx';

const log = debug('ParentNotYet');

/*
 * ParentNotYet — what a signed-in parent sees on a page whose backend does not exist yet (Ward wallets, Evaluate my child): the page title and one ward-tab
 * card (wards/tabs/TabCard) with a plain line, instead of the drawn mock persona's numbers. The same wording pattern as the live ward page's Wallet /
 * Evaluations tabs (pages/parent/ParentWardPage.jsx NOT_YET). No Figma frame draws it.
 * Props: title (page h1), body (the line), action ({ label, to }, optional).
 */
const ParentNotYet = ({ title, body, action }) => {
  log('render', { title });
  return (
    <div className="mx-auto flex w-full max-w-[1329px] flex-col gap-[24px]">
      <h1 className="m-0 font-sans text-[clamp(26px,1.97vw,34px)] leading-[1.2] font-semibold tracking-[-0.68px] text-[#1c2a21]">
        {title}
      </h1>
      <TabCard gap={16}>
        <p className="m-0 font-sans text-[14px] leading-normal text-[#575755]">{body}</p>
        {action ? (
          <div>
            <ParentButton variant="secondary" to={action.to}>
              {action.label}
            </ParentButton>
          </div>
        ) : null}
      </TabCard>
    </div>
  );
};

export default ParentNotYet;
