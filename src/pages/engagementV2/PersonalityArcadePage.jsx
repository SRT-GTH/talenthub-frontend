import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EngagementStageFrame from '../../components/sections/engagementShell/EngagementStageFrame.jsx';
import ArcadeHub from '../../components/sections/engagementV2/arcade/ArcadeHub.jsx';
import {
  ArchetypeModal,
  GameDetailsModal,
} from '../../components/sections/engagementV2/arcade/ArcadeModals.jsx';
import {
  GAME_BY_ID,
  GAME_ROUTE,
  HUB,
  UNLOCK_AT,
} from '../../components/sections/engagementV2/arcade/arcadeData.js';
import { useArcadePlayed } from '../../components/sections/engagementV2/arcade/arcadePlayed.js';
import { useArcadeState } from '../../components/sections/engagementV2/arcade/arcadeState.js';
import {
  PERSONALITY_ROUTE,
  hasPersonalitySnapshot,
} from '../../components/sections/engagementV2/personality/personalityData.js';
import {
  PageFooter,
  StageTrail,
} from '../../components/sections/engagementV2/personality/PersonalityParts.jsx';
import { fetchMyProfile, isLiveProfile } from '../../services/profileStages.api.js';
import { debug } from '../../utils/debug.js';

const log = debug('PersonalityArcadePage');

/*
 * /profile/filling/personality/arcade — the Personality Arcade (Figma PA-01 hub, PA-02 details, PA-13 archetype unlocked).
 * URL state: see arcadeState.js. Playing a game goes to /profile/filling/personality/arcade/:gameId, which renders the existing game (GamePage).
 * Games played are remembered in this browser (arcadePlayed.js) for everyone. Live (signed in): a talent whose profile already
 * has a personalitySnapshot gets the result unlocked ("See my result" enabled) whatever this browser remembers; nothing on this
 * page writes the profile (read-only). Demo (signed out): unlocks at UNLOCK_AT played games only.
 */
const PersonalityArcadePage = () => {
  const navigate = useNavigate();
  const { modal, game, filter, playedOverride, update } = useArcadeState();
  const { played: saved } = useArcadePlayed();
  const played = playedOverride ?? saved;
  const [resultSaved, setResultSaved] = useState(false);
  const done = played.length >= UNLOCK_AT || (playedOverride === null && resultSaved);

  useEffect(() => {
    if (!isLiveProfile()) return undefined;
    let cancelled = false;
    fetchMyProfile()
      .then((profile) => {
        if (!cancelled && hasPersonalitySnapshot(profile)) {
          log('personality already saved: result unlocked');
          setResultSaved(true);
        }
      })
      .catch((err) => log.error('profile load failed (unlock by games only):', err?.message));
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    log('mount', { modal, game, filter, played });
  }, [modal, game, filter, played]);

  const play = (id) => {
    log('play', id);
    navigate(`${GAME_ROUTE(id)}`);
  };

  return (
    <EngagementStageFrame stageId="personality" footer={false}>
      <StageTrail progressPct={done ? 28 : 22} fillPx={done ? 93 : 73} />
      <ArcadeHub
        played={played}
        filter={filter}
        onFilter={(f) => update({ filter: f })}
        onPlay={(g) =>
          g.id === 'makola-haggle' ? update({ modal: 'details', game: g.id }) : play(g.id)
        }
        onFeatured={() => update({ modal: 'details', game: 'makola-haggle' })}
        onSuggest={() => log('suggest a game (not drawn)')}
      />
      <PageFooter
        note={HUB.footer.note}
        skip={{
          label: HUB.footer.quiz,
          onClick: () => navigate(`${PERSONALITY_ROUTE}?step=quiz`),
        }}
        primary={
          done
            ? {
                label: HUB.footer.result,
                onClick: () => navigate(`${PERSONALITY_ROUTE}?step=result`),
              }
            : { label: HUB.footer.result, disabled: true }
        }
      />
      {modal === 'details' ? (
        <GameDetailsModal
          gameId={game}
          onBack={() => update({ modal: null, game: null })}
          onStart={() => play(GAME_BY_ID[game] ? game : 'makola-haggle')}
        />
      ) : null}
      {modal === 'archetype' ? (
        <ArchetypeModal
          played={played}
          onMore={() => update({ modal: null })}
          onReveal={() => navigate(`${PERSONALITY_ROUTE}?step=result`)}
        />
      ) : null}
    </EngagementStageFrame>
  );
};

export default PersonalityArcadePage;
