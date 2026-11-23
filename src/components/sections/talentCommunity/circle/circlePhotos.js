import abenaAvatar from '../../../../assets/talent-circle/people/crew-person-abena-owusu-avatar.png';
import abenaCard from '../../../../assets/talent-circle/people/crew-person-abena-owusu-card.png';
import abenaHero from '../../../../assets/talent-circle/people/crew-person-abena-owusu-hero.png';
import akosuaAvatar from '../../../../assets/talent-circle/people/crew-person-akosua-mensah-avatar.png';
import akosuaCard from '../../../../assets/talent-circle/people/crew-person-akosua-mensah-card.png';
import akosuaHero from '../../../../assets/talent-circle/people/crew-person-akosua-mensah-hero.png';
import buddyAvatar from '../../../../assets/talent-circle/people/buddy-avatar.png';
import efuaAvatar from '../../../../assets/talent-circle/people/crew-person-efua-asante-avatar.png';
import efuaCard from '../../../../assets/talent-circle/people/crew-person-efua-asante-card.png';
import efuaHero from '../../../../assets/talent-circle/people/crew-person-efua-asante-hero.png';
import kojoAvatar from '../../../../assets/talent-circle/people/crew-person-kojo-annan-avatar.png';
import kojoCard from '../../../../assets/talent-circle/people/crew-person-kojo-annan-card.png';
import kojoHero from '../../../../assets/talent-circle/people/crew-person-kojo-annan-hero.png';
import kwameAvatar from '../../../../assets/talent-circle/people/crew-person-kwame-boateng-avatar.png';
import kwameCard from '../../../../assets/talent-circle/people/crew-person-kwame-boateng-card.png';
import kwameHero from '../../../../assets/talent-circle/people/crew-person-kwame-boateng-hero.png';
import yawAvatar from '../../../../assets/talent-circle/people/crew-person-yaw-darko-avatar.png';
import yawCard from '../../../../assets/talent-circle/people/crew-person-yaw-darko-card.png';
import yawHero from '../../../../assets/talent-circle/people/crew-person-yaw-darko-hero.png';
import yawProfile from '../../../../assets/talent-circle/people/crew-person-yaw-darko-profile.png';

/*
 * Photos of the My crew screens. The current talent frames (NW-01 … NW-11, 2026-11-22) draw six portraits and reuse them for
 * other people; each file is the Figma original cut the way Figma's "fill" draws it (centred cover crop, 2x):
 *   card   = the 118x150 Focused card photo   hero = the ~329x252 Playful card photo   avatar = 56px round avatars
 *   profile = the 120px profile photo (Yaw Darko, NW-06)
 * Shared portraits, as drawn: Esi Quaye and Afia Boakye = Akosua Mensah's; Nana Yaw Mensah and Kwesi Ofori = Kojo Annan's;
 * Adwoa Sarpong = Efua Asante's; Selorm Agbeko = Yaw Darko's; Ama Kumi and Nana Ama Asante = Abena Owusu's.
 * (The recruiter canvas has its own map in recruiterCirclePhotos.js.)
 */
export const BUDDY_AVATAR = buddyAvatar;

const ABENA = { card: abenaCard, hero: abenaHero, avatar: abenaAvatar };
const YAW = { card: yawCard, hero: yawHero, avatar: yawAvatar };
const EFUA = { card: efuaCard, hero: efuaHero, avatar: efuaAvatar };
const KWAME = { card: kwameCard, hero: kwameHero, avatar: kwameAvatar };
const AKOSUA = { card: akosuaCard, hero: akosuaHero, avatar: akosuaAvatar };
const KOJO = { card: kojoCard, hero: kojoHero, avatar: kojoAvatar };

export const PERSON_PHOTOS = {
  'abena-owusu': ABENA,
  'yaw-darko': { ...YAW, profile: yawProfile },
  'efua-asante': EFUA,
  'kwame-boateng': KWAME,
  'akosua-mensah': AKOSUA,
  'kojo-annan': KOJO,
  'esi-quaye': AKOSUA,
  'nana-yaw-mensah': KOJO,
  'adwoa-sarpong': EFUA,
  'kwesi-ofori': KOJO,
  'afia-boakye': AKOSUA,
  'selorm-agbeko': YAW,
  'ama-kumi': ABENA,
  'nana-ama-asante': ABENA,
};
