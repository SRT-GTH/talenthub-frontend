import { useEffect } from 'react';
import { debug } from '../../../../utils/debug.js';
import { LabHeaderBar, LabProgressStrip, LabTopBar } from '../LabPlayChrome.jsx';
import { useLabText } from '../labFormat.js';
import { useGameV2Params } from './gamesV2State.js';
import GameV2Footer from './GameV2Footer.jsx';
import { GameV2OfflineBanner, GameV2QuitDialog, GameV2TimeUpCard } from './GameV2Dialogs.jsx';

const log = debug('GameV2Shell');

/*
 * GameV2Shell — the page every Games v2 play / result frame sits in (Figma "Games v2 · 2 … 14", e.g. GV-04 Playful 9612:50427 /
 * Focused 9612:56786). Same bands as a lab frame, so it reuses LabPlayChrome's pieces:
 *
 *   LabTopBar      logo · Switch Modes · Save & Exit · Help · avatar              (nav 90)
 *   LabHeaderBar   dark green bar: close ×, "Skills Lab · <name>", subtitle, RANKED / PRACTICE sticker (Playful), XP + streak pills (80)
 *   LabProgressStrip  count + summary · dots · "Best so far: 82"                  (72; omitted when `progress` is null)
 *   <main>         1040px column, gap 22: the game's head + board (children)
 *   GameV2Footer   note · link · secondary · primary                              (88, sticky)
 *
 * Props:
 *   name*              "Memory Match"                       header title is "Skills Lab · {name}"
 *   subtitle           full header subtitle (overrides subtitleLead + suffix; Crisis Room / Makola Haggle draw none)
 *   sticker            Playful sticker text; default RANKED / PRACTICE, `null` hides it, "EARLY READ" for Makola Haggle
 *   subtitleLead*      "Working memory · 4×4 cards"         the shell adds " · Ranked play counts to your profile" or
 *                                                           " · Practice doesn’t count to your profile" (Figma, both modes)
 *   progress           LabProgressStrip props { countLabel, summary, dots:[{state,label}], passMark } or null
 *   footer             { note?, link?, secondary?, action? }  `note: null` = no note; defaults to the ranked / practice sentence from Figma
 *   timeUp             { summary } → `?modal=timeup` lays the Time's up card over the board
 *   onSeeResult        called by the Time's up card ("See my result")
 *   overlay            extra overlay nodes (game dialogs)
 *   contentClassName   extra classes for the column
 * Header quirks (kept as drawn): XP "240 XP" / "240 pts" and "7-day streak" are mock values (⚠️ ASSUMPTION: static).
 * Leaving: × and Save & Exit ask first in a ranked game (GV-06); practice leaves straight away (⚠️ ASSUMPTION, only GV-06 is drawn).
 */
const RANKED_NOTE = 'Your game saves as you play. You can resume within 24 hours.';
const PRACTICE_NOTE = 'Practice games are never shown to recruiters.';

const GameV2Shell = ({
  name,
  subtitleLead,
  subtitle: subtitleOverride,
  sticker: stickerOverride,
  progress,
  footer,
  timeUp,
  onSeeResult,
  overlay,
  contentClassName,
  children,
}) => {
  const { t } = useLabText();
  const g = useGameV2Params();
  const { ranked, modal } = g;

  useEffect(() => {
    log('mount', { game: g.gameId, mode: g.mode, level: g.level, frame: g.frame, modal });
  }, [g.gameId, g.mode, g.level, g.frame, modal]);

  const leave = () => {
    if (ranked) {
      log('leave → quit dialog (ranked)');
      g.openModal('quit');
    } else {
      log('leave → games tab (practice)');
      g.exit();
    }
  };
  const openHelp = () => g.update({ help: '1' });
  const subtitle =
    subtitleOverride ??
    `${subtitleLead} · ${
      ranked ? 'Ranked play counts to your profile' : 'Practice doesn’t count to your profile'
    }`;
  const sticker = stickerOverride !== undefined ? stickerOverride : ranked ? 'RANKED' : 'PRACTICE';

  return (
    <div className="flex min-h-screen min-h-dvh flex-col bg-[#f8f8f4] playful:bg-[linear-gradient(180deg,#fbf6ea_0%,#f4f6ec_100%)]">
      <LabTopBar onSaveExit={leave} onHelp={openHelp} />
      <LabHeaderBar
        title={`Skills Lab · ${name}`}
        subtitle={subtitle}
        sticker={sticker}
        xp={t('240 {xp}')}
        streak="7-day streak"
        onExit={leave}
      />
      {progress ? <LabProgressStrip {...progress} /> : null}
      <main className="flex-1 px-[clamp(16px,3.7vw,64px)] pt-[clamp(20px,2.3vw,40px)] pb-[clamp(24px,3.3vw,56px)]">
        <div
          className={`relative mx-auto flex w-full max-w-[1040px] flex-col gap-[22px] ${contentClassName ?? ''}`}
        >
          {modal === 'offline' ? <GameV2OfflineBanner onRetry={g.closeModal} /> : null}
          {children}
          {modal === 'timeup' ? (
            <GameV2TimeUpCard summary={timeUp?.summary} onSeeResult={onSeeResult} />
          ) : null}
        </div>
      </main>
      {footer ? (
        <GameV2Footer
          note={'note' in footer ? footer.note : ranked ? RANKED_NOTE : PRACTICE_NOTE}
          link={footer.link}
          secondary={footer.secondary}
          action={footer.action}
        />
      ) : null}
      {modal === 'quit' ? (
        <GameV2QuitDialog ranked={ranked} onKeep={g.closeModal} onLeave={g.exit} />
      ) : null}
      {overlay}
    </div>
  );
};

export default GameV2Shell;
