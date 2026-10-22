import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EngagementStageFrame from '../../components/sections/engagementShell/EngagementStageFrame.jsx';
import { nextStageRoute } from '../../components/sections/engagementShell/engagementShellData.js';
import AddAreaDialog from '../../components/sections/engagementV2/interests/AddAreaDialog.jsx';
import AreasList, {
  MentorRail,
} from '../../components/sections/engagementV2/interests/AreasList.jsx';
import InterestsFooter from '../../components/sections/engagementV2/interests/InterestsFooter.jsx';
import InterestsHero from '../../components/sections/engagementV2/interests/InterestsHero.jsx';
import RailCard from '../../components/sections/engagementV2/interests/InterestsRail.jsx';
import PickAreasPanel from '../../components/sections/engagementV2/interests/PickAreasPanel.jsx';
import StageCompleteDialog from '../../components/sections/engagementV2/interests/StageCompleteDialog.jsx';
import {
  MAX_AREAS,
  MIN_AREAS,
  PAGE_DONE_IDS,
  POPULAR_RAIL,
  SWEET_SPOT_RAIL,
  WHY_RAIL,
} from '../../components/sections/engagementV2/interests/interestsData.js';
import { useInterestsState } from '../../components/sections/engagementV2/interests/interestsState.js';
import { PAGE_X } from '../../components/sections/engagementV2/interests/interestsStyles.js';
import { useInterestsDraft } from '../../components/sections/engagementV2/interests/useInterestsDraft.js';
import { useUiStyle } from '../../hooks/useUiStyle.js';
import { debug } from '../../utils/debug.js';

const log = debug('InterestsPage');

/*
 * InterestsPage (stage 2, Figma IN-01..IN-05, Focused default + Playful). Route /profile/filling/interests; URL state is
 * documented at the top of interestsState.js. Pick 2-6 areas -> your areas (specifics editor per area, add an area) -> the
 * stage-complete dialog. Live (signed in): the areas load from and save to the profile `interests` (useInterestsDraft; every
 * pick / specific is saved, debounced; Continue / Next: Personality wait for the save and only move on when it worked). Until
 * the profile has loaded the lists are inert, the dialogs (incl. ?modal= / ?state= deep links) are not rendered and the footer
 * is disabled; a failed load shows a status line and blocks every save. A failed save shows an inline status line above the
 * footer. Demo (signed out): the Figma seed, with the draft kept in localStorage. Rails and role
 * matches are static copy (interestsData.js) in both modes.
 */
const InterestsPage = () => {
  const navigate = useNavigate();
  const { uiStyle } = useUiStyle();
  const st = useInterestsState();
  const { draft, status, saveError, save, setAreas, addAreas, addSpecific, removeSpecific } =
    useInterestsDraft(st.step);
  const ready = status === 'ready';
  const [advancing, setAdvancing] = useState(false);
  const statusText =
    status === 'error'
      ? 'We couldn’t load your profile. Refresh to try again.'
      : status === 'loading'
        ? 'Loading your interests…'
        : saveError;
  const picking = st.step === 'pick';
  const specificsCount = draft.areas.reduce((n, a) => n + a.specifics.length, 0);
  const openId =
    st.step === 'specifics'
      ? draft.areas.some((a) => a.id === st.area)
        ? st.area
        : draft.areas[0]?.id
      : null;

  useEffect(() => {
    log('mount', {
      step: st.step,
      modal: st.modal,
      complete: st.complete,
      areas: draft.areas.length,
    });
  }, [st.step, st.modal, st.complete, draft.areas.length]);

  const sticker =
    picking || (st.step === 'areas' && !st.modal && !st.complete)
      ? 'STEP 1: BROAD AREAS'
      : `${draft.areas.length} AREAS · ${specificsCount} SPECIFICS`;

  const selected = draft.areas.map((a) => a.id);
  const toggleArea = (id) => {
    if (selected.includes(id)) setAreas(selected.filter((x) => x !== id));
    else if (selected.length >= MAX_AREAS) log('area limit reached', MAX_AREAS);
    else setAreas([...selected, id]);
  };
  const canContinue = selected.length >= MIN_AREAS && selected.length <= MAX_AREAS;

  return (
    <EngagementStageFrame stageId="interests" doneIds={PAGE_DONE_IDS} footer={false}>
      <InterestsHero sticker={sticker} />
      <div className={`flex-1 pt-4 pb-8 ${PAGE_X}`}>
        <div className="mx-auto grid max-w-[1728px] items-start gap-6 lg:grid-cols-[minmax(0,1072fr)_minmax(0,464fr)] lg:gap-[clamp(24px,3.7vw,64px)]">
          <div
            className={ready ? 'min-w-0' : 'min-w-0 pointer-events-none opacity-60'}
            inert={!ready || undefined}
            aria-busy={status === 'loading' || undefined}
          >
            {picking ? (
              <PickAreasPanel selected={selected} onToggle={toggleArea} />
            ) : (
              <AreasList
                areas={draft.areas}
                openId={openId}
                onToggleOpen={(id) =>
                  st.update({
                    step: openId === id ? 'areas' : 'specifics',
                    area: openId === id ? null : id,
                  })
                }
                onAddSpecific={addSpecific}
                onRemoveSpecific={removeSpecific}
                onAddArea={() => st.update({ modal: 'add-area' })}
              />
            )}
          </div>
          <div className="flex flex-col gap-5">
            {picking ? (
              <RailCard title="Why interests matter" rows={WHY_RAIL} />
            ) : (
              <>
                <MentorRail specificsCount={specificsCount} />
                {st.step === 'specifics' ? (
                  <RailCard
                    title="Popular in Ghana"
                    rows={POPULAR_RAIL}
                    gapClass="gap-[14px] playful:gap-6"
                  />
                ) : (
                  <RailCard
                    title="The sweet spot"
                    rows={SWEET_SPOT_RAIL}
                    gapClass="gap-[14px] playful:gap-6"
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
      {statusText ? (
        <p
          role="status"
          className={`m-0 pb-3 text-right font-sans text-[13px] font-medium leading-[18px] ${
            status === 'loading' ? 'text-[#595959]' : 'text-[#b42318]'
          } ${PAGE_X}`}
        >
          {statusText}
        </p>
      ) : null}
      <InterestsFooter
        variant={picking ? 'pick' : 'areas'}
        disabled={!ready || advancing || (picking && !canContinue)}
        onSkip={() => navigate(nextStageRoute('interests'))}
        onBack={() => navigate('/profile/engagement/avatar')}
        onContinue={async () => {
          if (!ready || advancing) return;
          setAdvancing(true);
          const ok = await save();
          setAdvancing(false);
          if (!ok) {
            log('save failed: staying on', st.step);
            return;
          }
          if (picking) {
            log('continue to your areas', selected);
            st.update({ step: 'areas', area: null });
          } else {
            log('stage complete', selected);
            st.update({ state: 'complete' });
          }
        }}
      />
      {ready && st.modal === 'add-area' ? (
        <AddAreaDialog
          existingIds={selected}
          initialPick={st.pick}
          onClose={() => st.update({ modal: null, pick: null })}
          onAdd={(ids) => {
            addAreas(ids);
            st.update({ modal: null, pick: null, step: 'specifics', area: ids[0] });
          }}
        />
      ) : null}
      {ready && st.complete ? (
        <StageCompleteDialog
          areas={draft.areas}
          specificsCount={specificsCount}
          uiStyle={uiStyle}
          onClose={() => st.update({ state: null })}
          onNext={() => navigate('/profile/filling/personality')}
        />
      ) : null}
    </EngagementStageFrame>
  );
};

export default InterestsPage;
