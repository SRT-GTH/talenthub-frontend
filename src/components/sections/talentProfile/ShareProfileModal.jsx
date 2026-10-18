import { debug } from '../../../utils/debug.js';
import ShareProfileMain from './ShareProfileMain.jsx';
import ShareProfileLink from './ShareProfileLink.jsx';
import ShareProfilePdf from './ShareProfilePdf.jsx';
import ShareProfileCard from './ShareProfileCard.jsx';

const log = debug('ShareProfileModal');

/*
 * ShareProfileModal — dispatcher for the Share profile flow (Figma SH-01 … SH-05, SH-03b-e). The page mounts
 * it for every `?share=` value except `whatsapp` (WhatsAppStatusSheet). Frame ↔ state:
 *   open → SH-01   copied → SH-02   link → SH-04   link-available → SH-04b   pdf → SH-05
 *   card → SH-03   card-midnight → SH-03b   card-sunshine → SH-03c   card-making → SH-03d   card-saved → SH-03e
 * Navigation between states is `profile.update({ share })`; opening the full card builder is
 * `profile.update({ share: null, card: 'pick' })` (the Card agent's ShareCardBuilder).
 */
const ShareProfileModal = ({ profile }) => {
  const share = profile?.share;
  log('render', { share });

  if (share === 'link' || share === 'link-available') return <ShareProfileLink profile={profile} />;
  if (share === 'pdf') return <ShareProfilePdf profile={profile} />;
  if (share && share.startsWith('card')) return <ShareProfileCard profile={profile} />;
  return <ShareProfileMain profile={profile} copied={share === 'copied'} />;
};

export default ShareProfileModal;
