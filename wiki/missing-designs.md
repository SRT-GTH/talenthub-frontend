# Missing designs: handover to design

> Screens, states and controls the app needs but the Figma file doesn't draw. Started 2026-11-13 from the screen inspection and the build notes in this wiki.
> **For the designer:** each item says where it is in the app, what's missing, and what the app does in the meantime (so you can see the gap live). Tick an item when its frames exist, and add the Figma link.
> **For developers:** when a design lands, build it, then move the item to "Done" with the date. Backend gaps live in [backend-integration-gaps.md](backend-integration-gaps.md). Many items below also need an endpoint.

**Priority**

- **P1**: a feature the page promises but can't deliver without a design (a button leads nowhere).
- **P2**: missing states of a designed screen (empty, error, loading, end states, phone layout). The app shows a guess today.
- **P3**: small things we invented to fill a gap. Please confirm or replace them.

To see an item, run the app (`npm run dev`) and open the URL given.

---

## P1: features with no design

### Landing site

- [ ] **"Share my story" flow.** `/stories`, bottom card "Got a GTH story?" ([ShareYourStory.jsx](../src/components/sections/landing/stories/ShareYourStory.jsx)).
  - **The card promises:** a 3-minute form, permission to feature the person ("you can opt out at any time"), and **+100 XP**.
  - **Needed:**
    - The form, for signed-in talents. For example: what GTH helped with, the outcome, an optional photo, and a "you may feature me" consent with opt-out.
    - The sign-in prompt for signed-out visitors.
    - A thank-you screen with the XP award.
    - The review status (pending, featured, not used) somewhere in the talent's account.
  - **Today:** the button does nothing. Also needs a backend endpoint and an admin approval queue.
- [ ] **Footer pages.** Footer on every landing page.
  - **Company:** About us, Blog, Careers, Press, Contact.
  - **Legal:** Cookie policy, Child safety, Accessibility statement.
  - **Today:** these links do nothing. Privacy policy and Terms of service open dialogs (designed).
  - **Question for you:** should Privacy and Terms also exist as full pages, so the recruiter profile menu can link to them?
  - The **Platform** column (For students, For parents, …) can point at existing pages without new design.
- [ ] **Language switch "EN · GH"** in the landing nav: no menu or language list is drawn. Today it does nothing.

### Talent

- [ ] **Wallet, payouts list** `/wallet`: "See payouts →" on Home has nothing to open (escrow and salary are single-payout screens); today it only logs.
- [ ] **Clubs, Events tab** `/community/:id` and the owner page: the tab is drawn but has no screen, so it does nothing.
- [ ] **Clubs, owner page About and Members tabs** `/community/:id/manage`: drawn as tabs, no screens; inert.
- [ ] **Career content post** `/career-content/:id` (opened from Career Buddy post cards): no frame. The app shows a plain article card (type tag, title, author, video, body, "Join the conversation", related list) in the Clubs chrome.
- [ ] **Opportunity guidance job page** `/opportunity-guidance/job`: only one demo posting is drawn. This needs the same screen fed by any job, or a decision to merge it into the jobs page.
- [ ] **Learning, lesson flow** `/learning`:
  - Only question 1 of 3 of the short check is drawn.
  - The "Transcript" and "Resources" tabs are empty.
  - The "Completed" tab has no frame.
  - "Need a hint?" and the video controls have no designed behaviour.
  - Source: [talent-my-learning.md](talent-my-learning.md).

### Parent

- [ ] **Parent dashboard destinations** `/parent`. These buttons have nothing to open:
  - The ward **Profile** and **Flags** tabs have no page.
  - **Ask Buddy** (Focused look) has no panel.
  - **Review profile**, **Evaluate**, **Top up** and **Decide** have no screens.
  - The visibility dialog has no designed trigger.
  - Source: [parent-dashboard.md](parent-dashboard.md).

### Recruiter

- [ ] **Recruiter public profile** ("View my recruiter profile", "Preview as talent" in the profile menu and settings): no canvas or route exists.
- [ ] **Invoice** (Settings › Billing › Download): no invoice view or file is drawn.
- [ ] **Leave organisation** (Settings › Security): no confirm flow is drawn.
- [ ] **Recruiter tour** ("Replay the tour"): no tour is drawn for recruiters.
- [ ] **WhatsApp us** (help pop-overs, talent and recruiter): no number and no hand-off screen. This is content (a number) more than design; please confirm what should happen.
- Source for this group: [recruiter-settings.md](recruiter-settings.md).

---

### All portals (inspection 2026-11-22)

- [ ] **Landing:** cookie policy and accessibility statement (footer links, no copy anywhere); FAQ search results; answers for the FAQ topics Assessments, Opportunities and Accessibility; a language menu for "EN · GH".
- [ ] **Clubs:** an Events screen (club and owner pages). The app shows a "No events yet" empty state. Also the owner page's About and Members tabs.
- [ ] **Parent:** Accessibility, Language and data, and Change password (the app reuses the talent versions); help articles for 5 of 6 topics (cards open the related screen); a parent inbox (top-bar messages); "Customize" home.
- [ ] **Recruiter:** a recruiter public profile (rail "Profile", "View my recruiter profile", "Preview as talent" go to Settings › Account); profile pages for dashboard talents and other applicants; a recruiter onboarding tutorial (the talent one is shown); "Customize", "Notify …", a notifications page, "View Market Report", "Help me reply", "New list…", "Share with my team", "Hide", "Report".
- [ ] **Institution:** "Watch a 2-minute video" / "Watch Tutorial" (no video); Settings › Appearance, Security and sign-in.
- [ ] **Admin:** where "Ask your Super Admin" leads (the app shows a set-up notice) and the staff handbook (the app opens Help).
- [ ] **Public data `/data`:** a search results page (Enter goes to a region page or a directory); a contact / "data team" page (opens email); a retry target for the 500 page (goes back); footer "Accessibility · Privacy" pages. **Decided 2026-11-22 (product owner):** "Partner sign-in →" stays a login button (`/login`); Figma's prototype link to the Partners directory in 8 frames is treated as a mistake. Designer: please fix the prototype link.
- [ ] **Talent, signed in:** notifications older than a week (the app groups them under "Earlier"); an error message when Save fails on a job (it silently stays unsaved).
- [ ] **Apply step 2** (`/job-postings` apply dialog): the stories describe a submission step (choose sections to share with hide warnings, contact preference, optional cover letter / CV, screening answers). Figma draws only the preview ("STEP 1 OF 2 · PREVIEW") and "Application sent". The app now labels the preview "PREVIEW" and "Continue application" sends. Also needed on the recruiter side: a way to write screening questions.
- [ ] **Skills Lab "My games history"** (Games tab): no games-history screen; the hub History tab lists lab attempts only, so the link stays inert.
- [ ] **Goals stage industry list** (`/profile/filling/goals`): Figma draws only "Fintech"; the app adds the nine interest areas so non-tech goals can be saved (⚠️ ASSUMPTION).
- [ ] **Emails / public:** a privacy-policy page (email "Privacy" links go to settings / parent help); a "subscription confirmed" screen for the public digest.

## P2: missing states of designed screens

### Landing › Opportunities `/opportunities`

We built these from the drawn pieces. Please design them properly.

- [ ] **Sort menu:** only the "Sort: Best fit" chip is drawn. We built a menu with Best fit, Highest pay and Company A–Z. "Newest" is missing because roles have no real date yet.
- [ ] **Pay range control:** Figma draws a static bar ("2,000 – 8,000"). We made it a two-handle slider. Handles, focus and value label are needed, plus the phone filter sheet version.
- [ ] **No results:** today it shows plain text, "No roles match your filters".
- [ ] **Card hover / focus,** and what a signed-out visitor sees on tapping a card or the heart (today they go straight to Log in).

### Talent

- [ ] **Sign-up, onboarding tutorial** (Watch tutorial on `/login` and sign-up): the text layers for walkthrough steps 2–4 are empty, so the app reuses the chapter text. The video view is a "coming soon" card (no video yet).- [ ] **Notifications** `/notifications`: the "Newest first" sort menu and each row's "⋯" menu are drawn as buttons with no menu; both do nothing.
- [ ] **My Learning, Recommended filters** `/learning`: Free / Under 2 hours / With certificate / Popular have no filtered frames, so they only change anything with live data.
- [ ] **Emma's profile menu** `/home?as=emma`: no frame; the app shows her name, photo and home figures without an email line.
- [ ] **Home** `/home`: per-card empty and error states (only the page skeleton is drawn). Source: [talent-home.md](talent-home.md).
- [ ] **Notifications** `/notifications`: the Jobs and Messages filters, and the quiet-hours and ping-setting controls, have no frames of their own. Source: [talent-notifications.md](talent-notifications.md).
- [ ] **Games (Skills Lab)**:
  - End screens for Tower Shift, Errand Run and Chess.
  - Time-out, lose and draw states.
  - "Resume game" for any game except Pattern Pulse.
  - Phone layouts.
  - Source: [talent-games-v2.md](talent-games-v2.md).
- [ ] **Community** `/community`:
  - The **About** and **Members** tabs of a community (only Feed is drawn).
  - The open post "…" menu.
  - The community picker on the milestone dialog.
  - Talent and parent variants of the community sidebar.
  - Source: [figma-node-map.md](figma-node-map.md) (Community section).
- [ ] **Career Buddy chat history**:
  - An "Unpin" label.
  - Helper text for Short and Detailed answers.
  - The drawer on phones.
  - Source: [career-buddy-chat-history.md](career-buddy-chat-history.md).

### Recruiter

- [ ] **Application pipeline** `/recruiter/application-pipeline`:
  - Hover and focus states.
  - Validation errors, loading and error states.
  - Every screen after "Send update", "Undo" and "Close posting".
  - A board entry point for "Extend offer" and "Offer accepted / declined".
  - Source: [recruiter-application-pipeline.md](recruiter-application-pipeline.md).
- [ ] **Job screening:** the **"Don't meet"** tab (we invented three rows). Sort and Load more have no result states. Source: [recruiter-job-screening-flow.md](recruiter-job-screening-flow.md).
- [ ] **Messages inbox:** result states for sort, refresh, search and "Help me reply". Source: [recruiter-messages-inbox.md](recruiter-messages-inbox.md).
- [ ] **Settings › Hiring / Billing:**
  - Usage-limit warnings.
  - Time pickers for quiet hours.
  - The full option lists for dropdowns (only the selected value is drawn).
  - Editors for the "move forward / not progressing / role closes" messages.
  - Source: [recruiter-settings-hiring.md](recruiter-settings-hiring.md), [recruiter-settings-security.md](recruiter-settings-security.md).
- [ ] **Community (clubs, host):**
  - The "Hiring" feed filter with real posts.
  - "Clear search" on the no-results screen.
  - The owner page About / Members / Events tabs.
  - Source: [recruiter-community-clubs.md](recruiter-community-clubs.md), [recruiter-community-host.md](recruiter-community-host.md).

### Parent

- [ ] **Wallets** `/parent/wallets`:
  - Field errors for limits and amounts.
  - The other decline-reason chips (only the first is drawn).
  - A top-up entry point on the wallets page.
  - Source: [parent-wallets.md](parent-wallets.md).
- [ ] **Notifications:** where each row opens isn't drawn (milestone, certificate, payment). Source: [parent-notifications.md](parent-notifications.md).
- [ ] **Link a ward:** a search button and the empty-form state (results appear once name and date are filled). Source: [parent-link-ward.md](parent-link-ward.md).

---

### All portals (inspection 2026-11-22)

- [ ] **Landing:** signed-in users still see "Log in" / "Get started" in the nav and can reopen /login and /get-started; the complete-invite and guardian-consent error screens are plain text; `/school-links` has no app chrome.
- [ ] **Institution:** "Add students" / "Draft a scholarship" on the approval gates open pages closed before approval (bounce back); the bare `/institution/verify` form with no result is not drawn.
- [ ] **Agency:** `/agency/sign-up?state=sent` ("Thanks, your request is in") has no frame; error states for the home snapshot, Next step card and MoU checklist are plain text.
- [ ] **Parent:** the self-serve done page's "Opt-out Kofi instead" (goes to My wards); the parent help article "When your ward turns 18" shows "not designed yet".

## P3: things we added; please confirm or replace

- [ ] **"Are you a parent? Sign up as a parent"** under "Invite my parent" (`/for-parents-schools`). The button speaks as the child, so parents had no way in.
- [ ] **"Bring GTH to my school"** (`/for-parents-schools`): drawn as a benefit row. We added an underline on hover or focus so it reads as a link.
- [ ] **Landing nav after scrolling:** a translucent dark-green blurred background so the white links stay readable over light sections.
- [ ] **Landing CTA destinations**, which Figma doesn't link. Please confirm:

  | CTA                                                                    | Goes to                            |
  | ---------------------------------------------------------------------- | ---------------------------------- |
  | Hero "Hiring? See GTH for recruiters" and the For everyone tab buttons | Role picker with the role selected |
  | Schools buttons                                                        | `/institution/sign-up`             |
  | "Invite my parent"                                                     | Talent sign-up                     |

- [ ] **Talent sign-up, Done page for under-18s** `/onboarding/talent/done`: the hero line ("We've emailed your parent or guardian about GTH.") and the "Parent or guardian" summary row are our wording; only the general Done screen is drawn. 🔶 LIKELY
- [ ] **Talent sign-up, Done page after a real sign-up:** we hide the demo score, XP, badges and rank (none exist before the profile is built), and "Go to dashboard" goes to login because activation doesn't sign you in.
- [ ] **Talent login, "Watch tutorial"**: hidden in Figma (`visible:false`) but kept, since it's the only way to open the tutorial.
- [ ] **Talent sign-up, Review page:** the Talent Score strip is left out (no score exists yet). Confirm it can go, or say what it shows before activation.
- [ ] **Opportunities, Saved / Applied sort** `/job-postings?tab=saved|applied`: Figma draws a "Best match ▾" / "Most recent ▾" dropdown; the app shows a fixed "Sorted by …" label because each tab's order is fixed. Keep the label or build the dropdown?
- [ ] **Streak, "Any one of these keeps your flame alive" chips** `/streak`: drawn as plain labels. Should they link to My Learning, Skills Lab and My Assessment?
- [ ] **My Assessment library** `/my-assessment/library`: no entry point on the drawn overview; only the live overview links to it.
- [ ] **My crew right column** `/community?view=circle`: the newer frames draw a "Grow your crew" card, "Mentors to learn from", "You both know" and new endorse / recommend helper lines. Not built yet (the recruiter network cards could be reused). This is a build item, listed so design knows it isn't live.
- [ ] **Journey map stage pop-ups** `/profile/engagement`: Figma draws the hover pop-up only on Skills. Every stage now opens the same pop-up; the lines for the other eight stages, the "Counts towards <milestone>" pill and the Start / Continue / Edit button labels are ours. Please confirm or replace the copy.
- [ ] **Destinations we chose (no prototype link in Figma), 2026-11-21:** please confirm or link them in the prototype:
  - Home Evaluations "Review" → My Assessment; profile Badges "All 9" → Skills Lab Verified tab; Home "All badges" → profile Badges card. No badges or evaluations screen exists in the file.
  - Notifications "Newest first" → Newest / Oldest; row "⋯" → Mark as read / Notification settings; "Prep" → Career Buddy.
  - Job detail Share → share sheet / copy link; "Learn it" → course search; "I have it" → skills stage.
  - Wallet under-18 "Redeem Cycles" → redeem dialog; financing declined "Fund a smaller course" → financing courses.
  - Learning "Request this course" and library "Remind me" → confirm in place ("Request sent", "Reminder set").
  - Streak chips → Learning / Skills Lab Games / My Assessment.
  - My Assessment rows React Speedrun / Design Thinking Sprint / Leadership Chess → JavaScript / UI-UX design / strategic thinking labs (no lab or game has those names).
  - Recruiter view "Message" → Messages; Skills Lab "Preview" → My Assessment recruiter view.
  - Club New post "Help me write it" → Career Buddy; My crew invitations "Manage" → Sent tab; crew profile "Learn from" replaces Follow.
- [ ] **Post thread, expanded replies** `/community/frontend-devs-ghana/post/yaa-first-pr`: "View 4 replies" and "View 10 more comments" have no drawn replies, so the demo can't expand them (live does).
- [ ] **Font:** the landing site falls back to Nunito where SF Pro Rounded isn't installed (most Windows PCs), so text is narrower than in Figma. This is a development fix. It's listed here so you know why widths can differ in review.

---

- [ ] **Destinations we chose, all portals (inspection 2026-11-22).** Figma's prototype links are empty or missing on almost every frame read (landing, admin, institution, recruiter dashboard, parent, emails), so these are app patterns or assumptions. The full tables are in each portal's wiki page (landing-site, talent-profile, parent-wiring, recruiter-dashboard, institution, agency, admin, talent-emails, parent-emails). Main ones to confirm:
  - **Landing footer:** For students / recruiters → role picker; For parents / schools / Child safety → sections of /for-parents-schools; About us → How it works; Blog → Stories; Careers / Press / Contact → email.
  - **Profile:** "Who's looking: see all" → Notifications; milestone "Share it" → the share-card builder; empty-profile chips → the matching stages.
  - **Parent:** top-bar EN / accessibility / profile → Settings tabs; "How evaluations work" → Help.
  - **Recruiter:** "Edit profile" / rail "Profile" → Settings › Account; notification "Shortlist" / "See Details" → pipeline.
  - **Institution:** "See regional data" → the public region page; Settings › Accessibility → the accessibility panel.
  - **Emails:** Unsubscribe → notification settings; PE-04 report → ward Evaluations tab; PE-07 "View conversation" → ward Activity tab.

## Done

_(move items here with the date and Figma link when the design exists)_

- [x] **Talent sign-up, contact code states and address errors** (2026-11-21): **built from the flow's existing patterns**, no new frames needed. The code pop-up's wrong-attempt and expired states and the Playful "Something went wrong" lockout pop-up reuse the drawn pop-up pieces. Address errors use the same field errors as the other steps ("Please select your region", "Please select your district", "Town/City is required", shown once a field is left empty). Review in the app if you want changes.
