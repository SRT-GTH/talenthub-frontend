# Phase 3 · Talent everyday

> What a signed-in talent uses day to day: home, notifications, streak, job postings, messages, learning, career content, wallet, settings.

11 screens · 83 documented states · click map generated 2026-11-11. Back to [all phases](README.md).

## Shared chrome (check once)

- [ ] **Ghana Talent Hub home** _(link, top bar)_ → goes to `/` · Figma ☐
- [ ] **Focused** _(radio, top bar)_ → selects / switches · Figma ☐
- [ ] **Playful** _(radio, top bar)_ → selects / switches · Figma ☐
- [ ] **Help** _(button, top bar)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐
- [ ] **Notifications, 5 unread** _(button, top bar)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐
- [ ] **Messages, 5 unread** _(button, top bar)_ → goes to `/login` · Figma ☐
- [ ] **EN** _(button, top bar)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐
- [ ] **Accessibility mode** _(button, top bar)_ → changes the view `a11y=1` · Figma ☐
- [ ] **Home** _(button, navigation)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐
- [ ] **Skills Lab** _(button, navigation)_ → goes to `/skills-lab` · Figma ☐
- [ ] **My Learning** _(button, navigation)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐
- [ ] **Profile** _(button, navigation)_ → goes to `/profile` · Figma ☐
- [ ] **Community** _(button, navigation)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐

## /career-content

### career content › ‹content›

- [ ] Screen checked · URL: `/career-content/:contentId` (needs a real id: open it from a link in this area)
- Needs a real id: reach it from a link on another screen of this phase.

No clickable controls of its own (only shared chrome).

Notes:

## /home

### home

- [ ] Screen checked · URL: `/home` (http://localhost:5173/home)
- Probed at the demo URL `/home?as=emma` (the base URL needs a signed-in session).
- Wiki: [career-buddy-chat-history](../career-buddy-chat-history.md), [parent-settings](../parent-settings.md), [parent-spaces](../parent-spaces.md), [recruiter-job-prospecting](../recruiter-job-prospecting.md), [talent-assessment](../talent-assessment.md), [talent-community-create](../talent-community-create.md), [talent-home](../talent-home.md), [talent-my-circle](../talent-my-circle.md), [talent-notifications](../talent-notifications.md)

<details><summary>17 documented states to open and compare with Figma</summary>

- [ ] `/home?as=emma`
- [ ] `/home?as=emma&menu=switch`
- [ ] `/home?as=emma&new=welcome`
- [ ] `/home?edit=1`
- [ ] `/home?loading=1`
- [ ] `/home?new=chat`
- [ ] `/home?new=gate`
- [ ] `/home?new=tour`
- [ ] `/home?new=welcome`
- [ ] `/home?notif=open`
- [ ] `/home?search=1`
- [ ] `/home?state=complete`
- [ ] `/home?state=day1&new=chat`
- [ ] `/home?state=discoverable`
- [ ] `/home?state=top`
- [ ] `/home?tab=assessment`
- [ ] `/home?tab=recruiter`

</details>

Controls:

- [ ] **Switch space** _(button, top bar)_ → goes to `/parent` · Figma ☐
- [ ] **Streak, 1 days** _(button, top bar)_ → opens dialog “Your streak” `streak=open` (buttons: Do a 5-min lesson · See streak details →) · Figma ☐
- [ ] **Profile menu, Emma M.** _(button, top bar)_ → opens a menu: View my profile · Preview as recruiter · My applications · Saved jobs · Settings · Accessibility · Language · Help and support · Send feedback · Invite a friend · Log out · Privacy · Figma ☐
- [ ] **Switch space** _(button, page)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐
- [ ] **Continue: Portfolio →** _(button, page)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐
- [ ] **Parent view · 4 to review →** _(button, page)_ → goes to `/parent` · Figma ☐
- [ ] **My Assessment** _(button, navigation)_ → goes to `/login` · Figma ☐
- [ ] **Opportunities 18** _(button, navigation)_ → goes to `/job-postings` · Figma ☐
- [ ] **Wallet** _(button, navigation)_ → goes to `/wallet` · Figma ☐
- [ ] **Clubs** _(button, navigation)_ → goes to `/login` · Figma ☐
- [ ] **Messages** _(button, navigation)_ → goes to `/login` · Figma ☐
- [ ] **Preview as recruiter** _(button, page)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐
- [ ] **Collapse sidebar** _(button, page)_ → changes the view `collapsed=1` · Figma ☐
- [ ] **Back to Parent view** _(button, page)_ → goes to `/parent` · Figma ☐
- [ ] **Continue: Portfolio** _(button, page)_ → goes to `/profile/filling/career-buddy` · Figma ☐
- [ ] **Preview my profile** _(button, page)_ → goes to `/profile?view=recruiter` · Figma ☐
- [ ] **Journey map** _(button, page)_ → goes to `/profile/engagement` · Figma ☐
- [ ] **Minimize** _(button, page)_ → changes the view `journey=min` · Figma ☐
- [ ] **See all 18** _(button, page)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐
- [ ] **View role** _(button, page, 3 on screen)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐
- [ ] **Browse 18 matches** _(button, page)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐
- [ ] **Add my project** _(button, sidebar)_ → goes to `/profile/filling/career-buddy` · Figma ☐
- [ ] **Ask Buddy** _(button, page)_ → opens dialog “Career Buddy” `new=chat` (buttons: History · Maximize · Close · Continue: Interests About 2 min · +50 pts · Suggest my interests · Which roles pay well in Accra? · Show me around · Send) · Figma ☐

Fields to try: Search opportunities, skills, communities...

Notes:

## /job-postings

### job postings

- [ ] Screen checked · URL: `/job-postings` (http://localhost:5173/job-postings)
- Wiki: [recruiter-application-pipeline](../recruiter-application-pipeline.md), [recruiter-job-prospecting](../recruiter-job-prospecting.md), [recruiter-talent-search](../recruiter-talent-search.md), [talent-jobs](../talent-jobs.md)

Controls:

- [ ] **Streak, 12 days** _(button, top bar)_ → opens dialog “Your streak” `streak=open` (buttons: Do a 5-min lesson · See streak details →) · Figma ☐
- [ ] **Profile menu, Kofi A.** _(button, top bar)_ → opens a menu: View my profile · Preview as recruiter · My applications · Saved jobs · Settings · Accessibility · Language · Help and support · Send feedback · Invite a friend · Log out · Privacy · Figma ☐
- [ ] **Continue setup →** _(button, page)_ → goes to `/profile/engagement` · Figma ☐
- [ ] **My Assessment 142** _(button, navigation)_ → goes to `/login` ⚠ page looks empty · Figma ☐
- [ ] **Job Postings 2** _(button, navigation)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Messages 6** _(button, navigation)_ → goes to `/messages` ⚠ page looks empty · Figma ☐
- [ ] **Preview as recruiter** _(button, page)_ → goes to `/profile?view=recruiter` · Figma ☐
- [ ] **Collapse sidebar** _(button, page)_ → changes the view `rail=collapsed` · Figma ☐
- [ ] **Matched to you, 6** _(button, navigation)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Browse all, 142** _(button, navigation)_ → changes the view `tab=browse` · Figma ☐
- [ ] **Saved, 3** _(button, navigation)_ → changes the view `tab=saved` · Figma ☐
- [ ] **Applied, 4** _(button, navigation)_ → changes the view `tab=applied` · Figma ☐
- [ ] **All** _(button, page)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **80%+ match** _(button, page)_ → changes the view `sub=80%+ match` · Figma ☐
- [ ] **Remote / Hybrid** _(button, page)_ → changes the view `sub=Remote / Hybrid` · Figma ☐
- [ ] **Internships** _(button, page)_ → changes the view `sub=Internships` · Figma ☐
- [ ] **Accra** _(button, page)_ → changes the view `sub=Accra` · Figma ☐
- [ ] **Cards** _(radio, page)_ → changes the view `view=cards` · Figma ☐
- [ ] **List** _(radio, page)_ → changes the view `view=list` · Figma ☐
- [ ] **Match alerts · 75%+** _(button, page)_ → opens dialog “Match alerts” `modal=alerts` (buttons: In GTH · Email · Push on my phone · Cancel · Save alerts) · Figma ☐
- [ ] **Save Data Science Intern** _(button, page)_ → selects / switches · Figma ☐
- [ ] **View opportunity** _(button, page, 6 on screen)_ → changes the view `job=data-science-intern` · Figma ☐
- [ ] **Save Data Analyst** _(button, page)_ → selects / switches · Figma ☐
- [ ] **Save Junior Product Analyst** _(button, page)_ → selects / switches · Figma ☐
- [ ] **Save Graduate Data Analyst** _(button, page)_ → selects / switches · Figma ☐
- [ ] **Save BI Intern** _(button, page)_ → selects / switches · Figma ☐
- [ ] **Save Junior Data Engineer** _(button, page)_ → selects / switches · Figma ☐
- [ ] **Browse all 142 roles →** _(button, page)_ → changes the view `tab=browse` · Figma ☐
- [ ] **Ask Buddy** _(button, page)_ → opens dialog “Career Buddy” `new=chat` (buttons: History · Maximize · Close · Continue: Interests About 2 min · +50 pts · Suggest my interests · Which roles pay well in Accra? · Show me around · Send) · Figma ☐

Fields to try: Search opportunities, skills, communities...

Notes:

## /learning

### learning

- [ ] Screen checked · URL: `/learning` (http://localhost:5173/learning)
- Wiki: [talent-my-learning](../talent-my-learning.md), [talent-streak](../talent-streak.md)

Controls:

- [ ] **Streak, – days** _(button, top bar)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐
- [ ] **Notifications, 0 unread** _(button, top bar)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐
- [ ] **Messages, unread** _(button, top bar)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐
- [ ] **Profile menu,** _(button, top bar)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐
- [ ] **My Assessment** _(button, navigation)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐
- [ ] **Job Postings** _(button, navigation)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐
- [ ] **Wallet** _(button, navigation)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐
- [ ] **Messages** _(button, navigation)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐
- [ ] **Preview as recruiter** _(button, page)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐
- [ ] **In progress, 0** _(tab, navigation)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐
- [ ] **Recommended, 0** _(tab, navigation)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐
- [ ] **Saved, 0** _(tab, navigation)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐
- [ ] **Completed, 0** _(tab, navigation)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐
- [ ] **Certificates, 0** _(tab, navigation)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐
- [ ] **Ask Buddy** _(button, page)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐

Fields to try: Search opportunities, skills, communities...

Notes:

## /messages

### messages

- [ ] Screen checked · URL: `/messages` (http://localhost:5173/messages)
- ⚠ Without a signed-in session this URL redirects to `/login`: sign in with a test account and check it by hand.
- Wiki: [talent-messages](../talent-messages.md)

<details><summary>50 documented states to open and compare with Figma</summary>

- [ ] `/messages?a11y=1`
- [ ] `/messages?a11y=1&rail=collapsed`
- [ ] `/messages?c=applied`
- [ ] `/messages?c=applied&rail=collapsed`
- [ ] `/messages?c=closed`
- [ ] `/messages?c=closed&rail=collapsed`
- [ ] `/messages?c=interview`
- [ ] `/messages?c=interview&rail=collapsed`
- [ ] `/messages?c=interview&state=confirmed`
- [ ] `/messages?c=interview&state=confirmed&rail=collapsed`
- [ ] `/messages?c=owura`
- [ ] `/messages?calm=1&read=1&explain=1&large=1`
- [ ] `/messages?calm=1&read=playing&explain=1`
- [ ] `/messages?demo=1`
- [ ] `/messages?explain=open`
- [ ] `/messages?help=1`
- [ ] `/messages?lang=dagbani`
- [ ] `/messages?lang=ewe`
- [ ] `/messages?lang=ga`
- [ ] `/messages?lang=hausa`
- [ ] `/messages?lang=menu`
- [ ] `/messages?lang=toast`
- [ ] `/messages?lang=twi`
- [ ] `/messages?menu=options`
- [ ] `/messages?menu=options&rail=collapsed`
- [ ] `/messages?modal=not-interested`
- [ ] `/messages?modal=not-interested&rail=collapsed`
- [ ] `/messages?modal=pre-apply`
- [ ] `/messages?modal=pre-apply&rail=collapsed`
- [ ] `/messages?rail=collapsed`
- [ ] `/messages?reply=draft`
- [ ] `/messages?reply=draft&rail=collapsed`
- [ ] `/messages?reply=ideas`
- [ ] `/messages?reply=ideas&rail=collapsed`
- [ ] `/messages?reply=placed`
- [ ] `/messages?reply=placed&rail=collapsed`
- [ ] `/messages?reply=writing`
- [ ] `/messages?reply=writing&rail=collapsed`
- [ ] `/messages?state=empty`
- [ ] `/messages?state=empty&rail=collapsed`
- [ ] `/messages?state=loading`
- [ ] `/messages?state=loading&rail=collapsed`
- [ ] `/messages?state=offline`
- [ ] `/messages?state=offline&rail=collapsed`
- [ ] `/messages?tab=requests&c=confidential`
- [ ] `/messages?tab=requests&c=confidential&rail=collapsed`
- [ ] `/messages?tab=requests&c=request`
- [ ] `/messages?tab=requests&c=request&rail=collapsed`
- [ ] `/messages?tab=requests&c=request&state=accepted`
- [ ] `/messages?tab=requests&c=request&state=accepted&rail=collapsed`

</details>

No clickable controls of its own (only shared chrome).

Notes:

### messages › ‹conversation›

- [ ] Screen checked · URL: `/messages/:conversationId` (needs a real id: open it from a link in this area)
- Needs a real id: reach it from a link on another screen of this phase.

No clickable controls of its own (only shared chrome).

Notes:

## /notifications

### notifications

- [ ] Screen checked · URL: `/notifications` (http://localhost:5173/notifications)
- ⚠ Without a signed-in session this URL redirects to `/login`: sign in with a test account and check it by hand.
- Wiki: [talent-notifications](../talent-notifications.md)

<details><summary>1 documented states to open and compare with Figma</summary>

- [ ] `/notifications?filter=unread&read=all`

</details>

No clickable controls of its own (only shared chrome).

Notes:

## /settings

### settings

- [ ] Screen checked · URL: `/settings` (http://localhost:5173/settings)
- ⚠ Without a signed-in session this URL redirects to `/login`: sign in with a test account and check it by hand.
- Wiki: [career-buddy-chat-history](../career-buddy-chat-history.md), [talent-settings](../talent-settings.md)

No clickable controls of its own (only shared chrome).

Notes:

### settings › ‹section›

- [ ] Screen checked · URL: `/settings/help` (http://localhost:5173/settings/help)
- ⚠ Without a signed-in session this URL redirects to `/login`: sign in with a test account and check it by hand.
- Wiki: [parent-settings](../parent-settings.md), [recruiter-settings](../recruiter-settings.md), [talent-games-v2](../talent-games-v2.md), [talent-settings](../talent-settings.md)

<details><summary>14 documented states to open and compare with Figma</summary>

- [ ] `/settings/accessibility?state=saved`
- [ ] `/settings/accessibility?state=unsaved`
- [ ] `/settings/account?demo=1`
- [ ] `/settings/account?state=email-error`
- [ ] `/settings/data?state=delete`
- [ ] `/settings/data?state=download`
- [ ] `/settings/data?state=paused`
- [ ] `/settings/guardian?state=invite`
- [ ] `/settings/notifications?state=paused`
- [ ] `/settings/privacy?state=blocked`
- [ ] `/settings/privacy?state=hidden`
- [ ] `/settings/security?state=device-logged-out`
- [ ] `/settings/security?state=password`
- [ ] `/settings/security?state=two-step`

</details>

No clickable controls of its own (only shared chrome).

Notes:

## /streak

### streak

- [ ] Screen checked · URL: `/streak` (http://localhost:5173/streak)
- Wiki: [talent-streak](../talent-streak.md)

<details><summary>1 documented states to open and compare with Figma</summary>

- [ ] `/streak?milestone=15`

</details>

Controls:

- [ ] **Streak, 12 days** _(button, top bar)_ → opens dialog “Your streak” `streak=open` (buttons: Do a 5-min lesson · See streak details →) · Figma ☐
- [ ] **Profile menu, Kofi A.** _(button, top bar)_ → opens a menu: View my profile · Preview as recruiter · My applications · Saved jobs · Settings · Accessibility · Language · Help and support · Send feedback · Invite a friend · Log out · Privacy · Figma ☐
- [ ] **Continue setup →** _(button, page)_ → goes to `/profile/engagement` · Figma ☐
- [ ] **My Assessment 142** _(button, navigation)_ → goes to `/login` ⚠ page looks empty · Figma ☐
- [ ] **Job Postings 2** _(button, navigation)_ → goes to `/job-postings` · Figma ☐
- [ ] **Messages 6** _(button, navigation)_ → goes to `/login` ⚠ page looks empty · Figma ☐
- [ ] **Preview as recruiter** _(button, page)_ → goes to `/profile?view=recruiter` · Figma ☐
- [ ] **Collapse sidebar** _(button, page)_ → changes the view `rail=collapsed` · Figma ☐
- [ ] **Daily nudge at** _(switch, page)_ → selects / switches · Figma ☐
- [ ] **Warn me before my streak ends** _(switch, page)_ → selects / switches · Figma ☐
- [ ] **Ask Buddy** _(button, page)_ → opens dialog “Career Buddy” `new=chat` (buttons: History · Maximize · Close · Continue: Interests About 2 min · +50 pts · Suggest my interests · Which roles pay well in Accra? · Show me around · Send) · Figma ☐

Fields to try: Search opportunities, skills, communities...

Notes:

## /wallet

### wallet

- [ ] Screen checked · URL: `/wallet` (http://localhost:5173/wallet)
- Wiki: [talent-wallet](../talent-wallet.md)

Controls:

- [ ] **Streak, 12 days** _(button, top bar)_ → opens dialog “Your streak” `streak=open` (buttons: Do a 5-min lesson · See streak details →) · Figma ☐
- [ ] **Profile menu, Kofi A.** _(button, top bar)_ → opens a menu: View my profile · Preview as recruiter · My applications · Saved jobs · Settings · Accessibility · Language · Help and support · Send feedback · Invite a friend · Log out · Privacy · Figma ☐
- [ ] **Continue setup →** _(button, page)_ → goes to `/profile/engagement` · Figma ☐
- [ ] **My Assessment 142** _(button, navigation)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐
- [ ] **Job Postings 2** _(button, navigation)_ → goes to `/job-postings` · Figma ☐
- [ ] **Wallet** _(button, navigation)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Messages 4** _(button, navigation)_ → goes to `/login` ⚠ page looks empty · Figma ☐
- [ ] **Preview as recruiter** _(button, page)_ → goes to `/profile?view=recruiter` · Figma ☐
- [ ] **Collapse sidebar** _(button, page)_ → changes the view `rail=collapsed` · Figma ☐
- [ ] **Overview** _(button, navigation)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Transactions, 24** _(button, navigation)_ → changes the view `tab=transactions` · Figma ☐
- [ ] **Cycles, 340** _(button, navigation)_ → changes the view `tab=cycles` · Figma ☐
- [ ] **Financing** _(button, navigation)_ → changes the view `tab=financing` · Figma ☐
- [ ] **Credit score** _(button, navigation)_ → changes the view `tab=credit` · Figma ☐
- [ ] **Top up** _(button, page)_ → opens dialog “Top up your wallet” `view=topup` (buttons: Close · GHS 20 · GHS 50 · GHS 100 · GHS 200 · MTN MoMo, 024 ••• 3456 · linked · Telecel Cash, Add a number · AT Money, Add a number · Bank card or transfer, Visa, Mastercard or GhIPSS · Cancel · Top up GHS 200) · Figma ☐
- [ ] **Withdraw** _(button, page)_ → opens dialog “Withdraw money” `view=withdraw` (buttons: Close · GHS 50 · GHS 100 · GHS 300 · All · MTN MoMo · Kofi Agyekum, 024 ••• 3456 · arrives in minutes · GCB Bank · ••• 7781, 1 working day · GHS 2.00 fee · + Add a new account · Cancel · Continue) · Figma ☐
- [ ] **Redeem Cycles** _(button, page)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **See payouts →** _(button, page)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **All transactions →** _(button, page)_ → changes the view `tab=transactions` · Figma ☐
- [ ] **Internship stipend · Accra Tech, 30 Sep · September stipend, + GHS 1,200.00, Completed** _(button, page)_ → opens dialog “Receipt” `tab=transactions&tx=stipend-sep` (buttons: Close · Download PDF · Share · Something wrong with this payment? Report a problem) · Figma ☐
- [ ] **Laptop fund** _(button, page)_ → changes the view `view=savings` · Figma ☐
- [ ] **View your score →** _(button, page)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Ask Buddy** _(button, page)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐

Fields to try: Search opportunities, skills, communities...

Notes:
