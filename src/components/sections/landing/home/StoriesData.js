import avatarKwame from '../../../../assets/landing/student-avatar-e.webp';
import avatarAbena from '../../../../assets/landing/student-avatar-b.webp';
import avatarEmmanuel from '../../../../assets/landing/student-avatar-c.webp';

/* S8 Stories copy — verbatim from Figma 7797:14810 (desktop) / 7815:271387 (tablet) / 7815:279204 (mobile). */

export const STORIES_HEAD = {
  chip: 'Stories',
  title: 'Meet people who found their path.',
  note: 'Sample stories for layout. Replace with real, consented quotes before launch.',
};

/* tilt = card rotation in deg (Figma rad * 57.3); sticker colour is the Figma sticker fill. */
export const STORIES = [
  {
    id: 'kwame',
    tilt: 1.72,
    quote:
      'I finished my profile in an evening. Three weeks later I had an interview with a telco graduate team. GTH showed me strengths I didn’t know I had.',
    name: 'Kwame A.',
    role: 'Computer Science · KNUST L300',
    avatar: avatarKwame,
    sticker: { label: 'GOT THE INTERVIEW', bg: '#ffd86b' },
    stickerPos:
      '-top-3 right-1 md:left-[201px] md:right-auto md:-top-[15px] xl:left-auto xl:right-[56px] xl:-top-3',
  },
  {
    id: 'abena',
    tilt: -1.72,
    quote:
      'I’m from a small school in the Northern Region. Before GTH I had no way to show big companies what I can do. Now they find me.',
    name: 'Abena K.',
    role: 'Science · SHS3, Tamale',
    avatar: avatarAbena,
    sticker: { label: 'NOW DISCOVERABLE', bg: '#84cc16' },
    stickerPos:
      '-top-5 right-[11px] md:left-[173px] md:right-auto md:-top-[22px] xl:left-auto xl:right-[51px] xl:-top-5',
  },
  {
    id: 'emmanuel',
    tilt: 1.15,
    quote:
      'We searched by verified skills and found three strong candidates for our graduate scheme in one afternoon.',
    name: 'Emmanuel D.',
    role: 'HR Manager · Accra',
    avatar: avatarEmmanuel,
    sticker: { label: 'HIRED 3', bg: '#f9c9b6' },
    stickerPos: '-top-[15px] right-9 md:left-[285px] md:right-auto xl:left-auto xl:right-[115px]',
  },
];
