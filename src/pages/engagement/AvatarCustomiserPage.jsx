import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AvatarStepLayout from '../../components/sections/engagement/AvatarStepLayout.jsx';
import AvatarStylePanel from '../../components/sections/engagement/avatar/AvatarStylePanel.jsx';
import EntryMethodModal from '../../components/sections/engagement/EntryMethodModal.jsx';
import { AvatarSelectionProvider } from '../../providers/AvatarSelectionProvider.jsx';
import avatarHeroStage from '../../assets/engagement/avatar-hero-stage.png';
import { debug } from '../../utils/debug.js';

const log = debug('AvatarCustomiserPage');

/*
 * AvatarCustomiserPage â€” Step 1 of 9 (Avatar â€” Style tab).
 * Source: Figma frame (Avatar â€” Pick your vibe).
 *
 * The page wraps everything in `AvatarSelectionProvider` so selections
 * made here persist across the Skin / Hair / Extras / Outfit steps.
 *
 * The LEFT side still uses the flat hero PNG (Phase 2 — wire a layered
 * avatar preview that morphs with selections — needs per-part art).
 * The RIGHT side is now the real React `AvatarStylePanel`, replacing
 * the previous PNG: clicking a base style tile or a skin-tone swatch
 * fires state updates that show as the selected-ring on the tile/swatch
 * and stay set when the user navigates between steps.
 *
 * EntryMethodModal pops on first mount (matches the engagement hub).
 *
 * Continue button advances to Skin Tone.
 */

const TAB_TO_ROUTE = {
  style: '/profile/engagement/avatar',
  skin: '/profile/engagement/avatar/skin',
  hair: '/profile/engagement/avatar/hair',
  extras: '/profile/engagement/avatar/extras',
  outfit: '/profile/engagement/avatar/outfit',
};

const AvatarCustomiserPageInner = () => {
  const navigate = useNavigate();
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(true);
  const closeEntryModal = () => setIsEntryModalOpen(false);

  const handleFillManually = () => {
    log('entry method: fill manually');
    closeEntryModal();
  };
  const handleChatWithAi = () => {
    log('entry method: chat with AI');
    closeEntryModal();
  };
  const handleUploadCv = () => {
    log('entry method: upload CV');
    closeEntryModal();
  };

  const handleTabSelect = (tabId) => {
    const route = TAB_TO_ROUTE[tabId];
    if (route && route !== '/profile/engagement/avatar') {
      log('tab → navigate', tabId, route);
      navigate(route);
    }
  };

  const handleNext = () => {
    log('looks good, next â†’ skin tone');
    navigate('/profile/engagement/avatar/skin');
  };

  return (
    <AvatarStepLayout
      heroSrc={avatarHeroStage}
      heroAlt="Your avatar preview on the customiser stage — pick your vibe"
      panel={<AvatarStylePanel activeTab="style" onTabSelect={handleTabSelect} />}
      continueLabel="Looks good, next"
      onContinue={handleNext}
    >
      <EntryMethodModal
        isOpen={isEntryModalOpen}
        onClose={closeEntryModal}
        onFillManually={handleFillManually}
        onChatWithAi={handleChatWithAi}
        onUploadCv={handleUploadCv}
      />
    </AvatarStepLayout>
  );
};

const AvatarCustomiserPage = () => {
  log('mount');
  return (
    <AvatarSelectionProvider>
      <AvatarCustomiserPageInner />
    </AvatarSelectionProvider>
  );
};

export default AvatarCustomiserPage;
