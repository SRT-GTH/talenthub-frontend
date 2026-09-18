/*
 * communityIcons.js — icon asset map for the Talent Community Engagement screens.
 *
 * Every glyph is the exact SVG asset Figma's `get_design_context` returned for
 * the corresponding node, downloaded into `src/assets/community/`. Nothing here
 * is hand-drawn or substituted — where Figma ships separate light/dark copies
 * of the same glyph (Join vs Joined, active vs inactive nav) both files are
 * kept so the fills stay exact instead of being recoloured with `currentColor`.
 *
 * Kept as a plain `.js` module (no component exports) so the `.jsx` renderer
 * `CommunityIcon.jsx` stays react-refresh clean.
 *
 * Usage: <CommunityIcon src={icons.share} size={18} />
 */

import iconCommunityChip from '../../../assets/community/icon-community-chip.svg';
import iconJoinHero from '../../../assets/community/icon-join-hero.svg';
import iconJoinCard from '../../../assets/community/icon-join-card.svg';
import iconJoinedCard from '../../../assets/community/icon-joined-card.svg';
import iconJoinedHeader from '../../../assets/community/icon-joined-header.svg';
import iconInviteFriends from '../../../assets/community/icon-invite-friends.svg';

// icon-tab-{feed,about,members}.svg are no longer used here — each was
// frozen at one Figma-instance colour (see CommunityTabs.jsx's header
// comment), so the tab icons are now hand-built inline `currentColor` SVGs
// in that file instead, which can actually recolour between active/inactive.

import iconMagnifyingGlass from '../../../assets/community/icon-magnifying-glass.svg';
import iconCreatePost from '../../../assets/community/icon-create-post.svg';

import iconClipboardCheck from '../../../assets/community/icon-clipboard-check.svg';
import iconCloseOutline from '../../../assets/community/icon-close-outline.svg';

import iconPostMenu from '../../../assets/community/icon-post-menu.svg';
import iconThumbsUp from '../../../assets/community/icon-thumbs-up.svg';
import iconThumbsDown from '../../../assets/community/icon-thumbs-down.svg';
import iconComment from '../../../assets/community/icon-comment.svg';
import iconCommentOpen from '../../../assets/community/icon-comment-open.svg';
import iconCommentHover from '../../../assets/community/icon-comment-hover.svg';
import iconShare from '../../../assets/community/icon-share.svg';

import iconEmojiSmile from '../../../assets/community/icon-emoji-smile.svg';
import iconEmojiSmileSm from '../../../assets/community/icon-emoji-smile-sm.svg';
import iconCommentThumbsUp from '../../../assets/community/icon-comment-thumbs-up.svg';
import iconCommentThumbsDown from '../../../assets/community/icon-comment-thumbs-down.svg';
import iconChevronDown from '../../../assets/community/icon-chevron-down.svg';
import iconCommentDot from '../../../assets/community/icon-comment-dot.svg';

import iconChevronRight from '../../../assets/community/icon-chevron-right.svg';
import dotOnline from '../../../assets/community/dot-online.svg';
import dotOffline from '../../../assets/community/dot-offline.svg';

import iconImages from '../../../assets/community/icon-images.svg';
import iconAddLine from '../../../assets/community/icon-add-line.svg';
import iconModalClose from '../../../assets/community/icon-modal-close.svg';
import iconDiamondTrophy from '../../../assets/community/icon-diamond-trophy.svg';
import iconStarBadge from '../../../assets/community/icon-star-badge.svg';
import iconSelectCaret from '../../../assets/community/icon-select-caret.svg';
import radioChecked from '../../../assets/community/radio-checked.svg';
import radioUnchecked from '../../../assets/community/radio-unchecked.svg';

import navHome from '../../../assets/community/nav-home.svg';
import navTalentSearch from '../../../assets/community/nav-talent-search.svg';
import navJobPostings from '../../../assets/community/nav-job-postings.svg';
import navCommunityActive from '../../../assets/community/nav-community-active.svg';
import navApplicationPipeline from '../../../assets/community/nav-application-pipeline.svg';
import navMessages from '../../../assets/community/nav-messages.svg';
import navProfile from '../../../assets/community/nav-profile.svg';

import navHomeCollapsed from '../../../assets/community/nav-home-collapsed.svg';
import navTalentSearchCollapsed from '../../../assets/community/nav-talent-search-collapsed.svg';
import navJobPostingsCollapsed from '../../../assets/community/nav-job-postings-collapsed.svg';
import navCommunityActiveCollapsed from '../../../assets/community/nav-community-active-collapsed.svg';
import navApplicationPipelineCollapsed from '../../../assets/community/nav-application-pipeline-collapsed.svg';

import iconLinkOutlined from '../../../assets/community/icon-link-outlined.svg';
import iconLinkOutlinedLg from '../../../assets/community/icon-link-outlined-lg.svg';
import iconArrowUpLeft from '../../../assets/community/icon-arrow-up-left.svg';
import iconCollapseLeft from '../../../assets/community/icon-collapse-left.svg';
import iconCollapseRight from '../../../assets/community/icon-collapse-right.svg';
import iconNewBadge from '../../../assets/community/icon-new-badge.svg';
import dotProgress from '../../../assets/community/dot-progress.svg';

import iconNavSearch from '../../../assets/community/icon-nav-search.svg';
import iconStreakFire from '../../../assets/community/icon-streak-fire.svg';
import iconNavHelp from '../../../assets/community/icon-nav-help.svg';
import iconNavNotification from '../../../assets/community/icon-nav-notification.svg';
import iconNavMessage from '../../../assets/community/icon-nav-message.svg';
import iconNavGlobe from '../../../assets/community/icon-nav-globe.svg';
import iconNavCaret from '../../../assets/community/icon-nav-caret.svg';
import iconNavAccessibility from '../../../assets/community/icon-nav-accessibility.svg';
import iconNavChipCaret from '../../../assets/community/icon-nav-chip-caret.svg';

export const icons = {
  communityChip: iconCommunityChip,
  joinHero: iconJoinHero,
  joinCard: iconJoinCard,
  joinedCard: iconJoinedCard,
  joinedHeader: iconJoinedHeader,
  inviteFriends: iconInviteFriends,

  search: iconMagnifyingGlass,
  createPost: iconCreatePost,

  clipboardCheck: iconClipboardCheck,
  closeOutline: iconCloseOutline,

  postMenu: iconPostMenu,
  thumbsUp: iconThumbsUp,
  thumbsDown: iconThumbsDown,
  comment: iconComment,
  commentOpen: iconCommentOpen,
  commentHover: iconCommentHover,
  share: iconShare,

  emojiSmile: iconEmojiSmile,
  emojiSmileSm: iconEmojiSmileSm,
  commentThumbsUp: iconCommentThumbsUp,
  commentThumbsDown: iconCommentThumbsDown,
  chevronDown: iconChevronDown,
  commentDot: iconCommentDot,

  chevronRight: iconChevronRight,
  dotOnline,
  dotOffline,

  images: iconImages,
  addLine: iconAddLine,
  modalClose: iconModalClose,
  diamondTrophy: iconDiamondTrophy,
  starBadge: iconStarBadge,
  selectCaret: iconSelectCaret,
  radioChecked,
  radioUnchecked,

  navHome,
  navTalentSearch,
  navJobPostings,
  navCommunityActive,
  navApplicationPipeline,
  navMessages,
  navProfile,

  navHomeCollapsed,
  navTalentSearchCollapsed,
  navJobPostingsCollapsed,
  navCommunityActiveCollapsed,
  navApplicationPipelineCollapsed,

  linkOutlined: iconLinkOutlined,
  linkOutlinedLg: iconLinkOutlinedLg,
  arrowUpLeft: iconArrowUpLeft,
  collapseLeft: iconCollapseLeft,
  collapseRight: iconCollapseRight,
  newBadge: iconNewBadge,
  dotProgress,

  navSearch: iconNavSearch,
  streakFire: iconStreakFire,
  navHelp: iconNavHelp,
  navNotification: iconNavNotification,
  navMessage: iconNavMessage,
  navGlobe: iconNavGlobe,
  navCaret: iconNavCaret,
  navAccessibility: iconNavAccessibility,
  navChipCaret: iconNavChipCaret,
};
