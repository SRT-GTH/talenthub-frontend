import { useCallback, useEffect, useMemo, useState } from 'react';
import { Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom';
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
import { isLoggedIn } from '../../../services/auth.api.js';
import { circleApi, circleErrorText } from '../../../services/circle.api.js';

const log = debug('CircleProfilePage');

/*
 * CircleProfilePage — `/community/people/:personId` (Figma NW-06 connected, NW-06b not connected, NW-07 endorse, NW-08 recommend).
 * URL contract: see circleState.js. Yaw Darko is the drawn profile; any other known person gets the same layout built from their card.
 * Reached from: a name / photo on any circle card, invitation, connection row, or the "View profile" menu item.
 * Real behaviour: Link up (note dialog → "Link-up sent"), Follow, Message (→ /messages), Endorse (dialog; per-skill button preselects
 * it), Write a recommendation (dialog → toast; the person approves it first), Esc / Cancel / scrim close dialogs.
 */
/*
 * Live profile (signed-in talent): GET /circle/people/:id — the person, what the two share, and the action for their
 * status: Link up · Link-up sent (Withdraw) · Accept / Ignore · In your circle. Skills & endorsements and Recommendations
 * (US-5.3.1-05): GET /circle/people/:id/skills and /recommendations; a connection can endorse (POST /circle/endorsements, no XP
 * sticker: ADR-04) and write one recommendation, which the person shows or keeps hidden first. Follow and Message are not shown.
 */
// The dialog chips / options in drawn order → the API's values (circle.endorse.mixin ENDORSE_WAYS / RECOMMEND_WAYS).
const ENDORSE_WAYS = [
  ['Same community project', 'community_project'],
  ['Studied together', 'studied'],
  ['Worked together', 'worked'],
  ['They mentored me', 'mentored'],
];
const RECOMMEND_WAYS = [
  ['We worked on a community project together', 'community_project'],
  ['We studied together', 'studied'],
  ['I mentored them', 'mentored'],
  ['We are in the same community', 'same_community'],
];
const valueOf = (pairs, label) => (pairs.find(([l]) => l === label) ?? pairs[0])[1];
const labelOf = (pairs, value) => (pairs.find(([, v]) => v === value) ?? pairs[0])[0];

const LiveCircleProfile = ({ personId, circle }) => {
  const navigate = useNavigate();
  const { toast, show, hide } = useCircleToast();
  const [state, setState] = useState({ status: 'loading' });
  const [busy, setBusy] = useState(false);
  const [extra, setExtra] = useState({ skills: null, recs: null });

  const load = useCallback(async () => {
    try {
      const person = await circleApi.person(personId);
      setState({ status: 'ready', person });
      // The two cards load on their own: a failure leaves that card out, never the profile.
      const [skills, recs] = await Promise.allSettled([
        circleApi.skillsOf(personId),
        circleApi.recommendationsOf(personId),
      ]);
      setExtra({
        skills: skills.status === 'fulfilled' ? skills.value : null,
        recs: recs.status === 'fulfilled' ? recs.value : null,
      });
    } catch (err) {
      log.error('person failed', err?.response?.status);
      setState({ status: err?.response?.status === 404 ? 'missing' : 'error' });
    }
  }, [personId]);
  useEffect(() => {
    load();
  }, [load]);

  if (state.status === 'missing')
    return <Navigate to={withRail(CIRCLE_HREF, circle.rail)} replace />;
  const person = state.person;
  const closeModal = () => circle.update({ modal: null, skills: null, draft: null, person: null });
  const run = (fn, done) => {
    setBusy(true);
    fn()
      .then((out) => {
        done?.(out);
        return load();
      })
      .catch((err) => show({ text: circleErrorText(err) }))
      .finally(() => setBusy(false));
  };
  const profile = person
    ? {
        ...buildGenericProfile({ ...person, town: person.town || 'Ghana' }),
        location: person.town ? `${person.town}, Ghana` : 'Ghana',
        mutualLine: person.mutual > 0 ? `${person.mutual} in your circle know them` : null,
        inCommon: (person.shares ?? []).map((sh) => ({
          kind: sh.kind,
          label: sh.label,
          note: 'Shared',
        })),
      }
    : null;
  if (profile) {
    profile.skills = extra.skills?.skills ?? [];
    profile.lockedNote = extra.skills?.lockedNote ?? null;
    if (person.status === 'self') profile.endorsePrompt = 'What your circle has endorsed';
    profile.endorseDialog = { ...profile.endorseDialog, ways: ENDORSE_WAYS.map(([l]) => l) };
    profile.recommendDialog = {
      ...profile.recommendDialog,
      relationships: RECOMMEND_WAYS.map(([l]) => l),
      whatLabel: `What should people know about working with ${person.firstName}?`,
      approval: `${person.firstName} will see it first and choose whether to show it on their profile. You can edit or remove it any time.`,
    };
  }
  const connected = person?.status === 'connected';
  const mine = extra.recs?.mine ?? null;
  const shownRecs = (extra.recs?.items ?? []).filter((r) => r.status === 'shown' && !r.mine);
  const ownProfile = person?.status === 'self';

  return (
    <CircleFrame circle={circle}>
      <CirclePageWrap>
        {!person ? (
          <div className="flex flex-col items-start gap-[12px] py-[40px]">
            <p className="m-0 font-sans text-[15px] text-[#595959]">
              {state.status === 'error' ? 'We couldn’t load this profile.' : 'Loading…'}
            </p>
            {state.status === 'error' && (
              <button
                type="button"
                onClick={() => navigate(withRail(CIRCLE_HREF, circle.rail))}
                className="cursor-pointer rounded-full border border-solid border-[#387440] bg-white px-[16px] py-[8px] font-sans text-[14px] font-semibold text-[#387440]"
              >
                Back to My circle
              </button>
            )}
          </div>
        ) : (
          <>
            <CircleProfileHero
              person={person}
              profile={profile}
              degree={person.status === 'connected' ? '1st' : null}
              connected={person.status === 'connected'}
              pending={person.status === 'pending-sent'}
              invited={person.status === 'invited'}
              busy={busy}
              onLinkUp={person.canLinkUp ? () => circle.update({ modal: 'connect' }) : undefined}
              onWithdraw={() =>
                run(
                  () => circleApi.withdraw(person.requestId),
                  () => show({ text: `Link-up to ${person.firstName} withdrawn` })
                )
              }
              onAccept={() =>
                run(
                  () => circleApi.respond(person.requestId, 'accept'),
                  () => show({ text: COPY.toast.inCircle(person.firstName) })
                )
              }
              onIgnore={() => run(() => circleApi.respond(person.requestId, 'ignore'))}
            />
            <div className="grid grid-cols-1 items-start gap-[28px] lg:grid-cols-[minmax(0,1fr)_minmax(280px,420px)]">
              <div className="flex min-w-0 flex-col gap-[28px]">
                {person.buddy && (
                  <p className="m-0 font-sans text-[15px] leading-[22px] text-[#1c2a21]">
                    {person.buddy}
                  </p>
                )}
                {extra.skills && (
                  <CircleSkillsCard
                    profile={profile}
                    endorsed={[]}
                    locked={!extra.skills.canEndorse}
                    readOnly={ownProfile}
                    onEndorse={(skillId) => circle.update({ modal: 'endorse', skills: skillId })}
                  />
                )}
                {extra.recs && (
                  <CircleRecommendationsCard
                    recommendations={shownRecs}
                    empty={`No recommendations for ${person.firstName} yet.`}
                    sent={
                      mine
                        ? `You wrote a recommendation for ${person.firstName}. ${person.firstName} sees it first and chooses whether to show it on their profile.`
                        : null
                    }
                    onWrite={
                      connected && !mine && !ownProfile
                        ? () => circle.update({ modal: 'recommend' })
                        : undefined
                    }
                    onEdit={mine ? () => circle.update({ modal: 'recommend' }) : undefined}
                    onRemove={
                      mine
                        ? () =>
                            run(
                              () => circleApi.deleteRecommendation(mine.id),
                              () => show({ text: 'Recommendation removed' })
                            )
                        : undefined
                    }
                  />
                )}
              </div>
              {profile.inCommon.length > 0 && <CircleInCommonCard items={profile.inCommon} />}
            </div>
          </>
        )}
      </CirclePageWrap>
      {person && circle.modal === 'connect' && (
        <CircleConnectDialog
          key="connect"
          person={person}
          initialText={circle.draft ? COPY.notes.suggestion(person) : ''}
          onSend={(note) =>
            run(
              () => circleApi.linkUp(person.id, note, 'profile'),
              (out) => {
                closeModal();
                show({
                  text:
                    out?.status === 'accepted'
                      ? COPY.toast.inCircle(person.firstName)
                      : COPY.toast.sent(person.firstName),
                });
              }
            )
          }
          onClose={closeModal}
        />
      )}
      {person && circle.modal === 'endorse' && extra.skills?.canEndorse && (
        <CircleEndorseDialog
          key="endorse"
          person={person}
          dialog={profile.endorseDialog}
          skills={profile.skills.filter((s) => !s.endorsedByMe)}
          initial={circle.skills}
          xp={false}
          busy={busy}
          onEndorse={(ids, way) => {
            const labels = profile.skills.filter((s) => ids.includes(s.id)).map((s) => s.label);
            run(
              () => circleApi.endorse(person.id, labels, valueOf(ENDORSE_WAYS, way)),
              () => {
                closeModal();
                show({
                  text: `You endorsed ${labels.length} ${labels.length === 1 ? 'skill' : 'skills'} for ${person.firstName}`,
                });
              }
            );
          }}
          onClose={closeModal}
        />
      )}
      {person && circle.modal === 'recommend' && (connected || mine) && (
        <CircleRecommendDialog
          key={mine ? `edit-${mine.id}` : 'recommend'}
          person={person}
          dialog={profile.recommendDialog}
          initialText={mine?.text ?? ''}
          initialHow={mine ? labelOf(RECOMMEND_WAYS, mine.relationship) : undefined}
          sendLabel={mine ? 'Save changes' : undefined}
          busy={busy}
          onSend={(text, how) =>
            run(
              () =>
                mine
                  ? circleApi.editRecommendation(mine.id, valueOf(RECOMMEND_WAYS, how), text)
                  : circleApi.recommend(person.id, valueOf(RECOMMEND_WAYS, how), text),
              () => {
                closeModal();
                show({
                  text: mine
                    ? `Saved. ${person.firstName} will see it again before it shows.`
                    : `Recommendation sent to ${person.firstName}`,
                });
              }
            )
          }
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

const CircleProfilePage = () => {
  const { personId } = useParams();
  const circle = useCircleState();
  const [params] = useSearchParams();
  const liveOn = isLoggedIn() && !circle.demoState && params.get('demo') !== '1';
  if (liveOn) return <LiveCircleProfile personId={personId} circle={circle} />;
  return <MockCircleProfile personId={personId} circle={circle} />;
};

/* The drawn mock profile (Figma frames, `&state=…` / `?demo=1`). */
const MockCircleProfile = ({ personId, circle }) => {
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
