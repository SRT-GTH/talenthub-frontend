import { STREAK_MILESTONE_MODAL } from './talentStreakData.js';

/*
 * Milestone modal copy for a live milestone (GET /streak → milestoneModal { id, label, xp, freeze }). Figma only draws
 * the 15-day modal (S-08); the other milestones reuse its layout. ⚠️ ASSUMPTION: per-milestone body lines are invented
 * in the same voice; the freeze reward chip shows only when a freeze was earned that day.
 */
const BODY = {
  3: 'Three days in a row. That’s a habit starting. Keep the flame going.',
  7: 'A full week of showing up. Your first streak freeze is in the bank.',
  15: STREAK_MILESTONE_MODAL.body,
  30: 'A whole month. Consistency like this is what recruiters look for.',
  60: 'Sixty days. You are the main character of your own learning story.',
  100: 'One hundred days. Legendary. Thank you for showing up.',
};

export const milestoneModalContent = ({ id, label, xp, freeze }) => ({
  ...STREAK_MILESTONE_MODAL,
  badgeDays: String(id),
  sticker: `Badge unlocked: ${label}`,
  title: `${id}-day streak!`,
  body: BODY[id] ?? STREAK_MILESTONE_MODAL.body,
  rewards: [
    { id: 'points', label: { playful: `+${xp} XP`, focused: `+${xp} pts` }, tone: 'gold' },
    ...(freeze
      ? [
          {
            id: 'freeze',
            label: { playful: '+1 streak freeze', focused: '+1 streak freeze' },
            tone: 'blue',
            shield: true,
          },
        ]
      : []),
    { id: 'badge', label: { playful: 'Badge on profile', focused: 'Badge on profile' }, tone: 'mint' },
  ],
});
