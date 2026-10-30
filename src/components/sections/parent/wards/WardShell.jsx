import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { debug } from '../../../../utils/debug.js';
import ParentButton from '../ParentButton.jsx';
import UnderlineTabs from '../../../ui/UnderlineTabs.jsx';
import WardChip from './WardChip.jsx';
import Turning18Notice from './Turning18Notice.jsx';
import { WARDS_TITLE, WARD_TABS } from './data/wardsData.js';

const log = debug('WardShell');

/*
 * WardShell — the ward page frame (Figma PW-02 10034:3257 Abena, PW-02b 10041:3643 Elliot; notice PW-10 10041:4106). Renders ONLY the main column.
 * Column 1329 wide, gap 24: "My wards" 34/600, "Ward header" card (white r24 p22 h100: avatar 72 + name 28/600 + Active chip + meta 14 #575755, four 3D buttons: Review profile / Evaluate X / Unlink / Opt out (red)),
 * tab bar (the shared ui/UnderlineTabs), then children.
 * Props: ward (from wardsData WARDS), tab ('overview' | 'profile' | 'flags' | 'evaluations' | 'wallet' | 'activity' | 'crew'; ?tab= value), notice ('turning18' | undefined),
 *   onOpenVisibility(), onOpenUnlink(), onOpenOptOut() (the red "Opt out" button, PO-01 in parent/optout), reviewProfileTo (optional: where "Review profile" goes, e.g. { search: '?tab=profile' }; without it the button only logs), children.
 * Tab links are react-router <Link to={{ search: '?tab=..' }}> (same path). The Profile and Flags pages come from the Flags and corrections canvas (parent/flags/).
 * notice="turning18": PW-10 is a modal ("Abena turns 18 on 12 March", scrim rgba(28,42,33,.55)) over the Abena overview; "Got it" / close / Esc dismiss it, "Send Abena a note" logs and dismisses.
 * ⚠️ ASSUMPTION: Figma draws no trigger for the "Who can find Abena" dialog (PW-14), so a small green text button sits beside the Active chip of the header. "Review profile", "Evaluate X", "Opt out" only log.
 */
const WardShell = ({
  ward,
  tab = 'overview',
  notice,
  onOpenVisibility,
  onOpenUnlink,
  onOpenOptOut,
  reviewProfileTo,
  children,
}) => {
  const [dismissed, setDismissed] = useState(null);
  const navigate = useNavigate();
  const noticeOpen = notice === 'turning18' && Boolean(ward.turning18) && dismissed !== ward.id;
  log('render', { ward: ward.id, tab, notice, noticeOpen });

  return (
    <div className="mx-auto flex w-full max-w-[1329px] flex-col gap-[24px] pt-[clamp(0px,0.7vw,12px)]">
      <h1 className="m-0 font-sans text-[clamp(26px,1.97vw,34px)] leading-[1.2] font-semibold tracking-[-0.68px] text-[#1c2a21]">
        {WARDS_TITLE}
      </h1>

      <div className="flex flex-col gap-[20px]">
        <section
          aria-label={`${ward.name} header`}
          className="flex flex-wrap items-center gap-x-[18px] gap-y-[16px] rounded-[24px] border border-solid border-[#e7e7e7] bg-white px-[22px] py-[13px] shadow-[0_5px_8.5px_rgba(28,42,33,0.03)]"
        >
          <img
            src={ward.photo}
            alt=""
            width="72"
            height="72"
            className="size-[72px] shrink-0 rounded-full object-cover"
          />
          <div className="flex min-w-[260px] flex-1 flex-col gap-[4px]">
            <div className="flex flex-wrap items-center gap-[10px]">
              <h2 className="m-0 font-sans text-[28px] leading-[1.25] font-semibold tracking-[-0.14px] text-[#1c2a21]">
                {ward.name}
              </h2>
              <WardChip tone="active">Active</WardChip>
              <button
                type="button"
                onClick={() => {
                  log('open visibility dialog:', ward.id);
                  onOpenVisibility?.();
                }}
                className="cursor-pointer rounded-[4px] border-0 bg-transparent p-0 font-sans text-[13px] leading-normal font-semibold text-[#387440] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
              >
                Who can find {ward.firstName}
              </button>
            </div>
            <div>
              <p className="m-0 font-sans text-[14px] leading-normal text-[#575755]">
                {/* Parts a live ward hasn't filled in yet are left out (no empty " · · "). */}
                {[ward.relation, ward.age, ward.grade, ward.school, `on GTH since ${ward.since}`]
                  .filter((v) => v !== null && v !== undefined && v !== '')
                  .join(' · ')}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-[10px]">
            <ParentButton
              variant="secondary"
              to={reviewProfileTo}
              onClick={() => log('Review profile:', ward.id)}
            >
              Review profile
            </ParentButton>
            <ParentButton
              variant="secondary"
              onClick={() => {
                log('Evaluate:', ward.id);
                navigate('/parent/evaluate');
              }}
            >
              Evaluate {ward.firstName}
            </ParentButton>
            <ParentButton
              variant="secondary"
              onClick={() => {
                log('open unlink dialog:', ward.id);
                onOpenUnlink?.();
              }}
            >
              Unlink
            </ParentButton>
            <ParentButton
              variant="secondary"
              className="[&_span]:!text-[#c0392b]"
              onClick={() => {
                log('open opt-out dialog:', ward.id);
                onOpenOptOut?.();
              }}
            >
              Opt out
            </ParentButton>
          </div>
        </section>

        <UnderlineTabs
          label={`${ward.firstName} sections`}
          activeId={tab}
          tabs={WARD_TABS.map((t) => ({
            id: t.id,
            label: t.label,
            count: t.count ? ward.tabCounts?.[t.count] : undefined,
            to: t.routed ? { search: `?tab=${t.id}` } : undefined,
            onClick: () => log(t.routed ? 'tab:' : 'tab (no page designed yet):', t.id),
          }))}
        />

        {children}
      </div>

      {noticeOpen && (
        <Turning18Notice
          ward={ward}
          onClose={() => {
            log('turning18 notice dismissed');
            setDismissed(ward.id);
          }}
          onPrimary={() => log('Send note:', ward.id)}
        />
      )}
    </div>
  );
};

export default WardShell;
