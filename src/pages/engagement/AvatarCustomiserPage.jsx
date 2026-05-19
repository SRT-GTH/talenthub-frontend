import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AvatarStepLayout from '../../components/sections/engagement/AvatarStepLayout.jsx';
import EntryMethodModal from '../../components/sections/engagement/EntryMethodModal.jsx';
import avatarHeroStage from '../../assets/engagement/avatar-hero-stage.png';
import avatarCustomiserPanel from '../../assets/engagement/avatar-customiser-panel.png';
import { debug } from '../../utils/debug.js';

const log = debug('AvatarCustomiserPage');

/*
 * AvatarCustomiserPage â€” Step 1 of 9 (Avatar â€” Style tab).
 * Source: Figma frame (Avatar â€” Pick your vibe).
 *
 * The page itself is a thin wrapper around AvatarStepLayout, plus the
 * EntryMethodModal which pops up on first mount (matches the
 * Profile Engagement hub behaviour â€” gives the user three quick ways
 * to populate their profile).
 *
 * Continue button advances to the next avatar step (Skin Tone).
 */

const AvatarCustomiserPage = () => {
  log('mount');
  const navigate = useNavigate();

  // Entry-method modal: open on first visit; closes on any selection.
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

  const handleNext = () => {
    log('looks good, next â†’ skin tone');
    navigate('/profile/engagement/avatar/skin');
  };

  return (
    <AvatarStepLayout
      heroSrc={avatarHeroStage}
      heroAlt="Your avatar preview on the customiser stage â€” pick your vibe"
      panelSrc={avatarCustomiserPanel}
      panelAlt="Avatar customiser panel: style, skin, hair, extras, outfit"
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

export default AvatarCustomiserPage;
