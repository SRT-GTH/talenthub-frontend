import hiringAssistantAvatar from '../../../../assets/recruiter/community/network-hiring-assistant-avatar.png';
import invitationAvatarAdwoaSarpong from '../../../../assets/recruiter/community/network-invitation-avatar-adwoa-sarpong.png';
import invitationAvatarEsiQuaye from '../../../../assets/recruiter/community/network-invitation-avatar-esi-quaye.png';
import invitationAvatarNanaYawMensah from '../../../../assets/recruiter/community/network-invitation-avatar-nana-yaw-mensah.png';
import profilePhotoYawDarko from '../../../../assets/recruiter/community/network-profile-photo-yaw-darko.png';
import cardAbenaOwusu from '../../../../assets/recruiter/community/network-talent-card-abena-owusu.png';
import cardAkosuaMensah from '../../../../assets/recruiter/community/network-talent-card-akosua-mensah.png';
import cardEfuaAsante from '../../../../assets/recruiter/community/network-talent-card-efua-asante.png';
import cardKojoAnnan from '../../../../assets/recruiter/community/network-talent-card-kojo-annan.png';
import cardKwameBoateng from '../../../../assets/recruiter/community/network-talent-card-kwame-boateng.png';
import cardYawDarko from '../../../../assets/recruiter/community/network-talent-card-yaw-darko.png';

/*
 * Figma image exports for the recruiter My network screens (2x PNG, file OHG2xsfCCskT8xEn356njv). The recruiter canvas re-cast the
 * talent portraits (e.g. Abena Owusu is the woman in the pink top, Yaw Darko the red-lit portrait), so the talent photo map
 * (circlePhotos.js) is NOT reused. Figma reuses one export for several people: Ama Kumi = Abena's photo, Adwoa Sarpong (card) =
 * Efua's, Kwesi Ofori = Kojo's, Afia Boakye = Akosua's, Selorm Agbeko = Yaw's, so they share one file each (same bytes).
 * `card` = the 118x150 card photo, `avatar` = round list avatars (card photo cropped to the face with object-cover),
 * `profile` = the 120px profile photo.
 */
export const HIRING_ASSISTANT_AVATAR = hiringAssistantAvatar;

export const NETWORK_PERSON_PHOTOS = {
  'abena-owusu': { card: cardAbenaOwusu, avatar: cardAbenaOwusu },
  'yaw-darko': { card: cardYawDarko, avatar: cardYawDarko, profile: profilePhotoYawDarko },
  'efua-asante': { card: cardEfuaAsante, avatar: cardEfuaAsante },
  'kwame-boateng': { card: cardKwameBoateng, avatar: cardKwameBoateng },
  'akosua-mensah': { card: cardAkosuaMensah, avatar: cardAkosuaMensah },
  'kojo-annan': { card: cardKojoAnnan, avatar: cardKojoAnnan },
  'esi-quaye': { card: invitationAvatarEsiQuaye, avatar: invitationAvatarEsiQuaye },
  'nana-yaw-mensah': {
    card: invitationAvatarNanaYawMensah,
    avatar: invitationAvatarNanaYawMensah,
  },
  'adwoa-sarpong': { card: cardEfuaAsante, avatar: invitationAvatarAdwoaSarpong },
  'kwesi-ofori': { card: cardKojoAnnan, avatar: cardKojoAnnan },
  'afia-boakye': { card: cardAkosuaMensah, avatar: cardAkosuaMensah },
  'selorm-agbeko': { card: cardYawDarko, avatar: cardYawDarko },
  'ama-kumi': { card: cardAbenaOwusu, avatar: cardAbenaOwusu },
};
