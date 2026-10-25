import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAgencyState } from '../../components/sections/agency/agencyState.js';
import AgencyMouEmpty from '../../components/sections/agency/onboarding/AgencyMouEmpty.jsx';
import AgencyMouFooter from '../../components/sections/agency/onboarding/AgencyMouFooter.jsx';
import AgencyMouHeader from '../../components/sections/agency/onboarding/AgencyMouHeader.jsx';
import AgencyMouHero from '../../components/sections/agency/onboarding/AgencyMouHero.jsx';
import AgencyMouList from '../../components/sections/agency/onboarding/AgencyMouList.jsx';
import AgencyMouRail from '../../components/sections/agency/onboarding/AgencyMouRail.jsx';
import { debug } from '../../utils/debug.js';

const log = debug('AgencyMouPage');

/*
 * AgencyMouPage — /agency/mou (Figma 11.4.1b upload 8596:988 · 11.4.1b2 documents list 8596:1290). Package A.
 * Decision: like the sign-up, the MoU upload draws the onboarding page (nav · stage bar · hero · content + rail · sticky footer), NOT the rail chrome, so it does not use
 * AgencyFrame (the Figma "Focused | Playful" switch in its nav is not rendered).
 * URL: /agency/mou (nothing uploaded yet) · /agency/mou?view=list (the four documents). Mock dropzone: a picked / dropped file is listed as a "Pending check" document, nothing is uploaded.
 * ⚠️ ASSUMPTION: "Enter details manually" and the gold "Change input mode" switch to the documents list (no manual form is drawn); "Next: Review" (enabled with the list)
 * continues to the MoU status page in review (/agency/mou/status?mou=pending) because the Review step is not drawn.
 */

const AgencyMouPage = () => {
  const data = useAgencyState();
  const navigate = useNavigate();
  const [extra, setExtra] = useState([]);
  const listView = data.view === 'list' || extra.length > 0;

  useEffect(() => {
    log('mount', { listView, extra: extra.length });
  }, [listView, extra.length]);

  const add = ({ name, size }) => {
    setExtra((list) => [
      ...list,
      {
        id: `upl-${list.length + 1}`,
        title: name,
        status: 'Pending check',
        tone: 'warn',
        meta: [`Uploaded just now · ${Math.max(1, Math.round(size / 1024))}KB`],
        tags: ['Pending'],
      },
    ]);
    data.update({ view: 'list' });
  };

  return (
    <div className="flex min-h-dvh flex-col bg-[#f8f8f4] font-sans text-[#1c2a21]">
      <AgencyMouHeader
        listView={listView}
        onChangeMode={() => data.update({ view: listView ? null : 'list' })}
      />
      <main className="flex min-h-0 flex-1 flex-col" aria-label="Upload your signed MoU">
        <AgencyMouHero />
        <div className="flex flex-col gap-[32px] px-[clamp(16px,3.7vw,64px)] py-[40px] lg:flex-row lg:items-start lg:gap-[64px]">
          <div className="min-w-0 flex-1">
            {listView ? (
              <AgencyMouList
                extra={extra}
                onAdd={add}
                onManual={() => data.update({ view: 'list' })}
              />
            ) : (
              <AgencyMouEmpty onAdd={add} onManual={() => data.update({ view: 'list' })} />
            )}
          </div>
          <AgencyMouRail />
        </div>
      </main>
      <AgencyMouFooter
        canContinue={listView}
        onNext={() => navigate('/agency/mou/status?mou=pending')}
      />
    </div>
  );
};

export default AgencyMouPage;
