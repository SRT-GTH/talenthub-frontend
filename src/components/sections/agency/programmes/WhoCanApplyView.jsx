import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { debug } from '../../../../utils/debug.js';
import {
  DEFAULT_RULES,
  POLICY_FINDING,
  SUPPLY_INSIGHTS,
  computeAudience,
} from '../data/programmesData.js';
import AudiencePreviewCard from './AudiencePreviewCard.jsx';
import EligibilityRules from './EligibilityRules.jsx';
import ProgrammeConfirmDialog from './ProgrammeConfirmDialog.jsx';
import ProgrammesHeader from './ProgrammesHeader.jsx';
import ProgrammeSelect from './ProgrammeSelect.jsx';
import { useProgrammesStore } from './useProgrammesStore.js';

const log = debug('WhoCanApplyView');

/*
 * WhoCanApplyView — "Who can apply" (Figma 11.5.2a 8597:393686, 11.5.2h audience under 5 8610:402145, 11.5.2i policy block 8610:402716):
 * header ("Who can" + the coloured "apply") with the tab row, the required "Programme" select (431 wide), "ELIGIBILITY · AUTOMATED" with the rule cards (left) and
 * the live Audience preview (right), and "SUPPLY INSIGHTS" (three cards). The audience recomputes with every rule (queries mock computeAudience); under 5 matches
 * the preview prints "<5", says why and "Save and continue" stays disabled. "Save and continue" runs the policy check (a phone number in the description blocks
 * publishing; in the mock the NSS draft has one: the "Remove contact details to publish" dialog), then opens the talent preview (?view=preview). "Save as Template" announces the save (mock).
 * URL keys: programme=<id> (selected programme) · template=<id> (chosen template, not mapped further) · state=audience-under-5 (the Under-18s rule on) |
 * policy-block (the policy dialog open over the form).
 * ⚠️ ASSUMPTIONS: "Remove details" removes the phone number and continues to the preview; "Edit description" closes the dialog (the description editor is not drawn).
 * Props: data (useAgencyState()).
 */

const SectionLabel = ({ children, tag }) => (
  <div className="flex items-center gap-[16px]">
    <h2 className="m-0 text-[16px] leading-[20px] font-medium tracking-[0.2px] text-[#387440]">
      {children}
    </h2>
    {tag ? (
      <span className="rounded-[6px] border-[1.2px] border-solid border-[#e8e8e4] bg-white px-[12px] py-[4px] text-[14px] leading-[20px] font-medium tracking-[0.2px] text-[#737373]">
        {tag}
      </span>
    ) : null}
  </div>
);

const WhoCanApplyView = ({ data }) => {
  const navigate = useNavigate();
  const { programmes } = useProgrammesStore();
  const forceUnder5 = data.state === 'audience-under-5';
  const policyOpen = data.state === 'policy-block';
  const [programmeId, setProgrammeId] = useState(data.params.get('programme') ?? programmes[0].id);
  const [rules, setRules] = useState(() => ({ ...DEFAULT_RULES, under18: forceUnder5 }));
  const [announce, setAnnounce] = useState('');
  const [phoneRemoved, setPhoneRemoved] = useState(false);

  useEffect(() => {
    log('mount', { programmeId, state: data.state });
  }, [programmeId, data.state]);

  // the frame URL ?state=audience-under-5 switches the Under-18s rule on
  useEffect(() => {
    if (forceUnder5) setRules((r) => ({ ...r, under18: true }));
  }, [forceUnder5]);

  const audience = useMemo(() => computeAudience(rules, { forceUnder5: rules.under18 }), [rules]);

  const patch = (p) => setRules((r) => ({ ...r, ...p }));

  const goPreview = () => {
    navigate(`/agency/programmes/new?view=preview&programme=${programmeId}`);
  };

  const onContinue = () => {
    // ⚠️ ASSUMPTION: the check runs on the saved description; in the mock only the NSS draft's description contains a phone number
    if (programmeId === 'nss-2027' && !phoneRemoved) {
      data.update({ state: 'policy-block' }, { replace: true });
      return;
    }
    goPreview();
  };

  return (
    <div className="flex flex-col gap-[28px] font-sans">
      <ProgrammesHeader
        title="Who can"
        accent="apply"
        sentence="Choose who sees this programme. The same rules as every organisation on GTH: only matching talents get it in their feed."
        tab="apply"
      />
      <div className="flex flex-col gap-[32px] pb-[24px]">
        <ProgrammeSelect value={programmeId} onChange={setProgrammeId} options={programmes} />
        <div className="flex flex-col gap-[18px]">
          <SectionLabel tag="AUTOMATED">ELIGIBILITY</SectionLabel>
          <div className="grid grid-cols-1 items-start gap-[32px] xl:grid-cols-[minmax(0,862fr)_minmax(0,435fr)]">
            <EligibilityRules rules={rules} onChange={patch} />
            <AudiencePreviewCard
              audience={audience}
              onContinue={onContinue}
              onTemplate={() => setAnnounce('Saved as a template.')}
            />
          </div>
        </div>
        <section aria-labelledby="supply-title" className="flex flex-col gap-[18px]">
          <h2
            id="supply-title"
            className="m-0 text-[16px] leading-[20px] font-medium tracking-[0.2px] text-[#387440]"
          >
            SUPPLY INSIGHTS
          </h2>
          <ul className="m-0 grid list-none grid-cols-1 gap-[24px] p-0 sm:grid-cols-3 xl:max-w-[866px]">
            {SUPPLY_INSIGHTS.map((s) => (
              <li
                key={s.id}
                className="flex flex-col gap-[8px] rounded-[12px] border border-solid border-[#e6e2d6] bg-white px-[24px] pt-[23px] pb-[24px]"
              >
                <span className="text-[16px] leading-[24px] tracking-[0.2px] text-[#999999]">
                  {s.label}
                </span>
                <span className="text-[32px] leading-[40px] font-semibold tracking-[-0.16px] text-[#1c2a21]">
                  {s.value}
                </span>
                <span className="text-[16px] leading-[24px] tracking-[0.2px] text-[#999999]">
                  {s.note}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
      <p role="status" aria-live="polite" className="sr-only">
        {announce}
      </p>
      {policyOpen ? (
        <ProgrammeConfirmDialog
          title={POLICY_FINDING.title}
          body={POLICY_FINDING.sentence}
          confirmLabel="Remove details"
          cancelLabel="Edit description"
          width={565}
          onConfirm={() => {
            setPhoneRemoved(true);
            data.update({ state: null }, { replace: true });
            goPreview();
          }}
          onCancel={() => data.update({ state: null }, { replace: true })}
        />
      ) : null}
    </div>
  );
};

export default WhoCanApplyView;
