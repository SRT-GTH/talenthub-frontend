/* Defaults of the Buddy settings popover (Figma CS-01: read aloud off, English (Ghana), Balanced, both "What Buddy can use" switches on). */
export const DEFAULT_BUDDY_SETTINGS = {
  readAloud: false,
  language: 'English (Ghana)',
  answerLength: 'balanced',
  useProfile: true,
  rememberChats: true,
  // 2026-10-31: the AI model Buddy answers with. Claude by default; gpt-oss-120b is the switch and the
  // automatic fallback when Claude is down (the agent falls back on its own too).
  model: 'claude',
};
