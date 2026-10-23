import { useEffect, useMemo } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { debug } from '../../../utils/debug.js';
import CircleConnectDialog from '../../../components/sections/talentCommunity/circle/CircleConnectDialog.jsx';
import CircleEndorseDialog from '../../../components/sections/talentCommunity/circle/CircleEndorseDialog.jsx';
import CircleFrame from '../../../components/sections/talentCommunity/circle/CircleFrame.jsx';
import CircleInCommonCard from '../../../components/sections/talentCommunity/circle/CircleInCommonCard.jsx';
import CirclePageWrap from '../../../components/sections/talentCommunity/circle/CirclePageWrap.jsx';
import CircleProfileHero from '../../../components/sections/talentCommunity/circle/CircleProfileHero.jsx';
import CircleRecommendDialog from '../../../components/sections/talentCommunity/circle/CircleRecommendDialog.jsx';
import CircleRecommendationsCard from '../../../components/sections/talentCommunity/circle/CircleRecommendationsCard.jsx';
import CircleSkillsCard from '../../../components/sections/talentCommunity/circle/CircleSkillsCard.jsx';
import CircleToast from '../../../components/sections/talentCommunity/circle/CircleToast.jsx';
import {
  buildGenericProfile,
  CIRCLE_COPY as COPY,
  CIRCLE_PEOPLE,
  PROFILE_RESPONSE,
} from '../../../components/sections/talentCommunity/circle/circleData.js';
import {
  circleActions,
  statusOf,
  useCircleStore,
} from '../../../components/sections/talentCommunity/circle/circleStore.js';
import {
  CIRCLE_HREF,
  useCircleState,
  withRail,
} from '../../../components/sections/talentCommunity/circle/circleState.js';
import { useCircleToast } from '../../../components/sections/talentCommunity/circle/useCircleToast.js';

const log = debug('CircleProfilePage');

/*
 * CircleProfilePage — `/community/people/:personId` (Figma NW-06 connected, NW-06b not connected, NW-07 endorse, NW-08 recommend).
 * URL contract: see circleState.js. Yaw Darko is the drawn profile; any other known person gets the same layout built from their card.
 * Reached from: a name / photo on any circle card, invitation, connection row, or the "View profile" menu item.
 * Real behaviour: Link up (note dialog → "Link-up sent"), Follow, Message (→ /messages), Endorse (dialog; per-skill button preselects
 * it), Write a recommendation (dialog → toast; the person approves it first), Esc / Cancel / scrim close dialogs.
 */
const CircleProfilePage = () => {
  const { personId } = useParams();
  const circle = useCircleState();
  const navigate = useNavigate();
  const store = useCircleStore();
  const { toast, show, hide } = useCircleToast();
  const person = CIRCLE_PEOPLE[personId];

  const profile = useMemo(
    () => (person ? (PROFILE_RESPONSE[personId] ?? buildGenericProfile(person)) : null),
    [person, personId]
  );

  useEffect(() => {
    log('mount', { personId, modal: circle.modal, demoState: circle.demoState });
  }, [personId, circle.modal, circle.demoState]);

  if (!person) return <Navigate to={withRail(CIRCLE_HREF, circle.rail)} replace />;

  // Yaw is a 1st-degree connection in the frames; the "not-connected" demo state draws him as a 2nd-degree suggestion.
  const baseStatus =
    personId === 'yaw-darko' && circle.demoState !== 'not-connected' ? 'connected' : 'none';
  const status = statusOf(store, personId, baseStatus);
  const connected = status === 'connected';
  const pending = status === 'pending-sent';
  const following = store.following.includes(personId);
  const endorsed = store.endorsed[personId] ?? [];
  const sentRecommendation = store.recommended[personId]
    ? `You wrote a recommendation for ${person.firstName}. ${person.firstName} will see it first and choose whether to show it on their profile.`
    : null;
  const closeModal = () => circle.update({ modal: null, skills: null, draft: null, person: null });

  const sendLinkUp = (note) => {
    log('link up', personId, note ? 'with note' : 'no note');
    circleActions.linkUp(personId, note);
    closeModal();
    show({
      text: COPY.toast.sent(person.firstName),
      actionLabel: COPY.toast.undo,
      onAction: () => circleActions.undoLinkUp(personId),
    });
  };

  return (
    <CircleFrame circle={circle}>
      <CirclePageWrap>
        <CircleProfileHero
          person={person}
          profile={profile}
          degree={connected ? '1st' : '2nd'}
          connected={connected}
          pending={pending}
          following={following}
          onLinkUp={() => circle.update({ modal: 'connect' })}
          onMessage={() => navigate('/messages')}
          onFollow={() => circleActions.toggleFollow(personId)}
        />
        <div className="grid grid-cols-1 items-start gap-[28px] lg:grid-cols-[minmax(0,1fr)_minmax(280px,420px)]">
          <div className="flex min-w-0 flex-col gap-[28px]">
            <CircleSkillsCard
              profile={profile}
              endorsed={endorsed}
              locked={!connected}
              onEndorse={(skillId) => circle.update({ modal: 'endorse', skills: skillId })}
            />
            <CircleRecommendationsCard
              recommendations={profile.recommendations}
              sent={sentRecommendation}
              onWrite={() => circle.update({ modal: 'recommend' })}
            />
          </div>
          <CircleInCommonCard items={profile.inCommon} />
        </div>
      </CirclePageWrap>

      {circle.modal === 'connect' && (
        <CircleConnectDialog
          key="connect"
          person={person}
          initialText={circle.draft ? COPY.notes.suggestion(person) : ''}
          onSend={sendLinkUp}
          onClose={closeModal}
        />
      )}
      {circle.modal === 'endorse' && (
        <CircleEndorseDialog
          key="endorse"
          person={person}
          dialog={profile.endorseDialog}
          skills={profile.skills}
          initial={circle.skills}
          onEndorse={(ids) => {
            log('endorse', personId, ids);
            circleActions.endorse(personId, ids);
            closeModal();
            show({
              text: `You endorsed ${ids.length} ${ids.length === 1 ? 'skill' : 'skills'} for ${person.firstName}`,
            });
          }}
          onClose={closeModal}
        />
      )}
      {circle.modal === 'recommend' && (
        <CircleRecommendDialog
          key="recommend"
          person={person}
          dialog={profile.recommendDialog}
          initialText={circle.draft ? profile.recommendDialog.suggestion : ''}
          onSend={(text) => {
            log('recommend', personId);
            circleActions.recommend(personId, text);
            closeModal();
            show({ text: `Recommendation sent to ${person.firstName}` });
          }}
          onClose={closeModal}
        />
      )}
      {toast && (
        <CircleToast
          key={toast.id}
          text={toast.text}
          actionLabel={toast.actionLabel}
          onAction={toast.onAction}
          onDone={hide}
        />
      )}
    </CircleFrame>
  );
};

export default CircleProfilePage;
