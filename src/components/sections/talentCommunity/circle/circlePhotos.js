import abenaOwusuAvatar from '../../../../assets/talent-circle/people/abena-owusu-avatar.png';
import abenaOwusuCard from '../../../../assets/talent-circle/people/abena-owusu-card.png';
import abenaOwusuHero from '../../../../assets/talent-circle/people/abena-owusu-hero.png';
import adwoaSarpongAvatar from '../../../../assets/talent-circle/people/adwoa-sarpong-avatar.png';
import adwoaSarpongCard from '../../../../assets/talent-circle/people/adwoa-sarpong-card.png';
import adwoaSarpongHero from '../../../../assets/talent-circle/people/adwoa-sarpong-hero.png';
import afiaBoakyeCard from '../../../../assets/talent-circle/people/afia-boakye-card.png';
import afiaBoakyeHero from '../../../../assets/talent-circle/people/afia-boakye-hero.png';
import akosuaMensahAvatar from '../../../../assets/talent-circle/people/akosua-mensah-avatar.png';
import akosuaMensahCard from '../../../../assets/talent-circle/people/akosua-mensah-card.png';
import akosuaMensahHero from '../../../../assets/talent-circle/people/akosua-mensah-hero.png';
import buddyAvatar from '../../../../assets/talent-circle/people/buddy-avatar.png';
import efuaAsanteAvatar from '../../../../assets/talent-circle/people/efua-asante-avatar.png';
import efuaAsanteCard from '../../../../assets/talent-circle/people/efua-asante-card.png';
import efuaAsanteHero from '../../../../assets/talent-circle/people/efua-asante-hero.png';
import esiQuayeAvatar from '../../../../assets/talent-circle/people/esi-quaye-avatar.png';
import kojoAnnanAvatar from '../../../../assets/talent-circle/people/kojo-annan-avatar.png';
import kojoAnnanCard from '../../../../assets/talent-circle/people/kojo-annan-card.png';
import kojoAnnanHero from '../../../../assets/talent-circle/people/kojo-annan-hero.png';
import kwameBoatengAvatar from '../../../../assets/talent-circle/people/kwame-boateng-avatar.png';
import kwameBoatengCard from '../../../../assets/talent-circle/people/kwame-boateng-card.png';
import kwameBoatengHero from '../../../../assets/talent-circle/people/kwame-boateng-hero.png';
import kwesiOforiCard from '../../../../assets/talent-circle/people/kwesi-ofori-card.png';
import kwesiOforiHero from '../../../../assets/talent-circle/people/kwesi-ofori-hero.png';
import nanaYawMensahAvatar from '../../../../assets/talent-circle/people/nana-yaw-mensah-avatar.png';
import selormAgbekoCard from '../../../../assets/talent-circle/people/selorm-agbeko-card.png';
import selormAgbekoHero from '../../../../assets/talent-circle/people/selorm-agbeko-hero.png';
import yawDarkoAvatar from '../../../../assets/talent-circle/people/yaw-darko-avatar.png';
import yawDarkoCard from '../../../../assets/talent-circle/people/yaw-darko-card.png';
import yawDarkoHero from '../../../../assets/talent-circle/people/yaw-darko-hero.png';
import yawDarkoProfile from '../../../../assets/talent-circle/people/yaw-darko-profile.png';

/*
 * Figma image exports for the people of the My circle screens (2x PNG).
 *   card   = the 118x150 Focused card photo   hero = the ~254x181 Playful card photo   avatar = round list/feed avatar
 * Where Figma draws a person only in some places the other crops fall back to the nearest export (a 56px avatar is the card photo
 * cropped to the face with object-cover). Mutual-friend face piles (18-22px) reuse these same exports.
 */
export const BUDDY_AVATAR = buddyAvatar;

export const PERSON_PHOTOS = {
  'abena-owusu': { card: abenaOwusuCard, hero: abenaOwusuHero, avatar: abenaOwusuAvatar },
  'yaw-darko': {
    card: yawDarkoCard,
    hero: yawDarkoHero,
    avatar: yawDarkoAvatar,
    profile: yawDarkoProfile,
  },
  'efua-asante': { card: efuaAsanteCard, hero: efuaAsanteHero, avatar: efuaAsanteAvatar },
  'kwame-boateng': { card: kwameBoatengCard, hero: kwameBoatengHero, avatar: kwameBoatengAvatar },
  'akosua-mensah': { card: akosuaMensahCard, hero: akosuaMensahHero, avatar: akosuaMensahAvatar },
  'kojo-annan': { card: kojoAnnanCard, hero: kojoAnnanHero, avatar: kojoAnnanAvatar },
  'esi-quaye': { card: esiQuayeAvatar, hero: esiQuayeAvatar, avatar: esiQuayeAvatar },
  'nana-yaw-mensah': {
    card: nanaYawMensahAvatar,
    hero: nanaYawMensahAvatar,
    avatar: nanaYawMensahAvatar,
  },
  'adwoa-sarpong': { card: adwoaSarpongCard, hero: adwoaSarpongHero, avatar: adwoaSarpongAvatar },
  'kwesi-ofori': { card: kwesiOforiCard, hero: kwesiOforiHero, avatar: kwesiOforiCard },
  'afia-boakye': { card: afiaBoakyeCard, hero: afiaBoakyeHero, avatar: afiaBoakyeCard },
  'selorm-agbeko': { card: selormAgbekoCard, hero: selormAgbekoHero, avatar: selormAgbekoCard },
};
