import { useEffect, useState } from 'react';
import { useInstitutionState } from '../../components/sections/institution/institutionState.js';
import InstitutionAccredEmpty from '../../components/sections/institution/onboarding/InstitutionAccredEmpty.jsx';
import InstitutionAccredFooter from '../../components/sections/institution/onboarding/InstitutionAccredFooter.jsx';
import InstitutionAccredHeader from '../../components/sections/institution/onboarding/InstitutionAccredHeader.jsx';
import InstitutionAccredHero from '../../components/sections/institution/onboarding/InstitutionAccredHero.jsx';
import InstitutionAccredList from '../../components/sections/institution/onboarding/InstitutionAccredList.jsx';
import InstitutionAccredRail from '../../components/sections/institution/onboarding/InstitutionAccredRail.jsx';
import InstitutionSubmittedDialog from '../../components/sections/institution/onboarding/InstitutionSubmittedDialog.jsx';
import { debug } from '../../utils/debug.js';

const log = debug('InstitutionAccreditationPage');

/*
 * InstitutionAccreditationPage — /institution/accreditation (Figma 11.1.2a upload 8589:2399 · 11.1.2a2 documents list 8589:2700 · 11.1.2a3 submitted 8589:3051). Package A.
 * Decision: like the sign-up, the upload draws the onboarding page (nav · stage bar · hero · content + rail · sticky footer), NOT the rail chrome, so it does not use
 * InstitutionFrame (the Figma "Focused | Playful" switch in its nav is not rendered).
 * URL: /institution/accreditation (nothing uploaded yet) · ?view=list (the four documents) · ?view=submitted (the list with the "Documents submitted." dialog).
 * Mock dropzone: a picked / dropped file is listed as a "Pending check" document, nothing is uploaded.
 * ⚠️ ASSUMPTION: "Enter details manually" and the gold "Change input mode" switch to the documents list (no manual form is drawn); "Next: Review" (enabled with the list)
 * opens the submitted dialog, whose buttons lead to the status page in review (the Review step is not drawn).
 */

const InstitutionAccreditationPage = () => {
  const data = useInstitutionState();
  const [extra, setExtra] = useState([]);
  const submitted = data.view === 'submitted';
  const listView = data.view === 'list' || submitted || extra.length > 0;

  useEffect(() => {
    log('mount', { listView, submitted, extra: extra.length });
  }, [listView, submitted, extra.length]);

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
      <InstitutionAccredHeader
        listView={listView}
        onChangeMode={() => data.update({ view: listView ? null : 'list' })}
      />
      <main className="flex min-h-0 flex-1 flex-col" aria-label="Accreditation documents">
        <InstitutionAccredHero />
        <div className="flex flex-col gap-[32px] px-[clamp(16px,3.7vw,64px)] py-[40px] lg:flex-row lg:items-start lg:gap-[64px]">
          <div className="min-w-0 flex-1">
            {listView ? (
              <InstitutionAccredList
                extra={extra}
                onAdd={add}
                onManual={() => data.update({ view: 'list' })}
              />
            ) : (
              <InstitutionAccredEmpty onAdd={add} onManual={() => data.update({ view: 'list' })} />
            )}
          </div>
          <InstitutionAccredRail />
        </div>
      </main>
      <InstitutionAccredFooter
        canContinue={listView}
        onNext={() => data.update({ view: 'submitted' })}
      />
      {submitted ? (
        <InstitutionSubmittedDialog onClose={() => data.update({ view: 'list' })} />
      ) : null}
    </div>
  );
};

export default InstitutionAccreditationPage;
