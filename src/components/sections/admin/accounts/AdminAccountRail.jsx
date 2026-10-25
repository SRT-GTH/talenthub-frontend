import { classNames } from '../../../../utils/classNames.js';
import { ProfileCard, HeadLink } from '../../talentProfile/ProfileTabsUi.jsx';
import {
  AdminEyeIcon,
  AdminFile15Icon,
  AdminLock14Icon,
  AdminPhone15Icon,
  AdminShield16Icon,
  AdminTarget15Icon,
  AdminVoice15Icon,
  AdminWallet15Icon,
} from '../adminIcons.jsx';


/*
 * AdminAccountRail — the two admin cards of the account detail's right rail (Figma 7.1.2a "right rail" 425 wide, gap 20):
 *  - "Admin actions" card (#1c2a21, r20, p24, gap 12): sticker (#ebf1ec, 12/700 #1f4a2b + eye), "Account TAL-204-8812" 22/28 600 white, 14/21 #bfbfbf text, green primary.
 *  - "Account record" card (white, 1px #e6e6e6, r20, p24): title 23/600, six masked rows (icon · 14/500 #595959 · lock 14), "View full activity →".
 * Props: account (adminAccountModel.accountView), text (the rail copy), primary { label, onClick }, onActivity, activityLabel.
 */

const ICONS = {
  shield: AdminShield16Icon,
  target: AdminTarget15Icon,
  file: AdminFile15Icon,
  voice: AdminVoice15Icon,
  phone: AdminPhone15Icon,
  wallet: AdminWallet15Icon,
};

const AdminAccountRail = ({ account, text, primary, onActivity, activityLabel = 'View full activity →' }) => (
  <>
    <section
      aria-label="Admin actions"
      className="flex min-w-0 flex-col items-start gap-[12px] rounded-[20px] bg-[#1c2a21] p-[24px]"
    >
      <span className="inline-flex items-center gap-[6px] rounded-full bg-[#ebf1ec] px-[10px] py-[5px] text-[12px] leading-[14px] font-bold text-[#1f4a2b]">
        Admin actions
        <AdminEyeIcon className="size-[14px]" />
      </span>
      <h2 className="m-0 font-sans text-[22px] leading-[28px] font-semibold text-white">
        Account {account.shortId}
      </h2>
      <p className="m-0 font-sans text-[14px] leading-[21px] text-[#bfbfbf]">{text}</p>
      <button
        type="button"
        onClick={primary.onClick}
        className="inline-flex h-[48px] cursor-pointer items-center rounded-[10px] border-2 border-solid border-[#2a5730] bg-[#387440] px-[18px] font-sans text-[16px] leading-[24px] font-bold text-white shadow-[0_4px_0_#2a5730] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffd86b]"
      >
        {primary.label}
      </button>
    </section>
    <ProfileCard title="Account record" bodyClassName="flex flex-col gap-[16px]">
      <ul className="m-0 flex list-none flex-col gap-[16px] p-0">
        {account.record.map((r) => {
          const Icon = ICONS[r.icon];
          return (
            <li key={r.text} className="flex items-center gap-[10px]">
              <span
                aria-hidden="true"
                className="flex size-[16px] shrink-0 items-center justify-center text-[#595959]"
              >
                <Icon className="size-full" />
              </span>
              <span className="min-w-0 flex-1 font-sans text-[14px] leading-[normal] font-medium text-[#595959]">
                {r.text}
              </span>
              <AdminLock14Icon className={classNames('size-[14px] shrink-0 text-[#959592]')} />
            </li>
          );
        })}
      </ul>
      <HeadLink onClick={onActivity} className="self-start">
        {activityLabel}
      </HeadLink>
    </ProfileCard>
  </>
);

export default AdminAccountRail;
