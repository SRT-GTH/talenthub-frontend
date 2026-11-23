# Phase 2 · Talent sign-up and profile building

> A new talent signs up, then builds a profile with Career Buddy or by hand: onboarding steps, interests, skills, work, portfolio, certificates, goals, pitch, personality games, CV, engagement milestones.

41 screens · 56 documented states · click map generated 2026-11-11. Back to [all phases](README.md).

## Shared chrome (check once)

- [ ] **Ghana Talent Hub home** _(link, top bar)_ → goes to `/` · Figma ☐
- [ ] **Focused** _(radio, top bar)_ → selects / switches · Figma ☐
- [ ] **Playful** _(radio, top bar)_ → selects / switches · Figma ☐
- [ ] **Save & Exit** _(button, top bar)_ → goes to `/login` · Figma ☐
- [ ] **Help** _(button, top bar)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Change input mode** _(button, top bar)_ → opens dialog “How would you like to add your details” `modal=switch-modes` (buttons: Close · ~3 min Fill it in myself Enter each role one at a time. Full · ~5 min · feels like a chat Chat with Career Buddy Career Bud · ~30 sec to confirm Upload my CV Drop your CV; we'll extract ) · Figma ☐

## /onboarding/talent

### onboarding › talent › address

- [ ] Screen checked · URL: `/onboarding/talent/address` (http://localhost:5173/onboarding/talent/address)

Controls:

- [ ] **Log In** _(link, top bar)_ → ⚠ not tested, try it by hand (it could not be clicked, maybe covered by something) · Figma ☐
- [ ] **Select Region** _(combobox, page)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐
- [ ] **Select District** _(combobox, page)_ → disabled here · Figma ☐
- [ ] **Confirm Address** _(button, page)_ → disabled here · Figma ☐
- [ ] **Log in Instead** _(link, page)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐

Fields to try: Select a district first · Eg. GA-123-4567 · Eg. Amasaman · Eg. Opposite the police station

Notes:

### onboarding › talent › contact

- [ ] Screen checked · URL: `/onboarding/talent/contact` (http://localhost:5173/onboarding/talent/contact)

Controls:

- [ ] **Log In** _(link, top bar)_ → goes to `/login` · Figma ☐

Notes:

### onboarding › talent › dob

- [ ] Screen checked · URL: `/onboarding/talent/dob` (http://localhost:5173/onboarding/talent/dob)

Controls:

- [ ] **Log In** _(link, top bar)_ → goes to `/login` · Figma ☐

Notes:

### onboarding › talent › done

- [ ] Screen checked · URL: `/onboarding/talent/done` (http://localhost:5173/onboarding/talent/done)
- Wiki: [onboarding-redesign](../onboarding-redesign.md)

Controls:

- [ ] **Log In** _(link, top bar)_ → goes to `/login` ⚠ page looks empty · Figma ☐
- [ ] **Copy link** _(button, page)_ → changes something on the page · Figma ☐
- [ ] **Go to my dashboard** _(button, page)_ → goes to `/` · Figma ☐
- [ ] **Invite a friend to Ghana Talent Hub** _(button, page)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Privacy Policy** _(button, footer)_ → opens dialog “Privacy Policy” (buttons: Close · Got it) · Figma ☐
- [ ] **Terms of Use** _(button, footer)_ → opens dialog “Terms & Conditions” (buttons: Close · Got it) · Figma ☐

Notes:

### onboarding › talent › education

- [ ] Screen checked · URL: `/onboarding/talent/education` (http://localhost:5173/onboarding/talent/education)

Controls:

- [ ] **Log In** _(link, top bar)_ → goes to `/login` · Figma ☐
- [ ] **Select your level** _(combobox, page)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐
- [ ] **Select grade** _(combobox, page)_ → disabled here · Figma ☐
- [ ] **yyyy** _(combobox, page)_ → disabled here · Figma ☐
- [ ] **Continue** _(button, page)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐
- [ ] **Log in Instead** _(link, page)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐

Fields to try: Search school or university

Notes:

### onboarding › talent › parent info

- [ ] Screen checked · URL: `/onboarding/talent/parent-info` (http://localhost:5173/onboarding/talent/parent-info)

Controls:

- [ ] **Log In** _(link, top bar)_ → goes to `/login` · Figma ☐

Notes:

### onboarding › talent › personal info

- [ ] Screen checked · URL: `/onboarding/talent/personal-info` (http://localhost:5173/onboarding/talent/personal-info)

Controls:

- [ ] **Log In** _(link, top bar)_ → goes to `/login` · Figma ☐
- [ ] **Upload photo** _(button, page)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Select your gender** _(combobox, page)_ → opens a menu: Female · Male · Non-binary · Prefer not to say · Figma ☐
- [ ] **Select your Nationality** _(combobox, page)_ → opens a menu: Ghanaian · Nigerian · Ivorian · Togolese · Beninese · Burkinabé · Other · Figma ☐
- [ ] **Fill In Your Details** _(button, page)_ → disabled here · Figma ☐
- [ ] **Log in Instead** _(link, page)_ → goes to `/login` · Figma ☐

Fields to try: Enter your first name · Enter your middle name · Enter your last name · GHA- 0000-000-000 · Create a password · Type your password again

Notes:

### onboarding › talent › review

- [ ] Screen checked · URL: `/onboarding/talent/review` (http://localhost:5173/onboarding/talent/review)

Controls:

- [ ] **Log In** _(link, top bar)_ → goes to `/login` · Figma ☐
- [ ] **Edit profile** _(button, page)_ → goes to `/onboarding/talent/personal-info` · Figma ☐
- [ ] **EDIT** _(link, page, 2 on screen)_ → goes to `/onboarding/talent/personal-info` · Figma ☐
- [ ] **EDIT** _(link, page)_ → goes to `/onboarding/talent/contact` · Figma ☐
- [ ] **EDIT** _(link, page)_ → goes to `/onboarding/talent/address` · Figma ☐
- [ ] **EDIT** _(link, page)_ → goes to `/onboarding/talent/education` · Figma ☐
- [ ] **I agree to Ghana Talent Hub's Terms & Conditions and Privacy Policy.** _(checkbox, page)_ → ⚠ not tested, try it by hand (it could not be clicked, maybe covered by something) · Figma ☐
- [ ] **Terms & Conditions** _(button, page)_ → opens dialog “Terms & Conditions” (buttons: Close · I understand and Accept) · Figma ☐
- [ ] **Privacy Policy** _(button, page)_ → opens dialog “Privacy Policy” (buttons: Close · I understand and Accept) · Figma ☐
- [ ] **I consent to Ghana Talent Hub processing my data for career matching and guidance. Learn more about data processing.** _(checkbox, page)_ → ⚠ not tested, try it by hand (it could not be clicked, maybe covered by something) · Figma ☐
- [ ] **Learn more about data processing** _(button, page)_ → opens dialog “Data Processing Consent” (buttons: Close · Read full document · I understand and Accept) · Figma ☐
- [ ] **Accept All Three To Continue** _(button, page)_ → disabled here · Figma ☐
- [ ] **Log in Instead** _(link, page)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐

Notes:

### onboarding › talent › welcome

- [ ] Screen checked · URL: `/onboarding/talent/welcome` (http://localhost:5173/onboarding/talent/welcome)

Controls:

- [ ] **Log In** _(link, top bar)_ → goes to `/login` · Figma ☐
- [ ] **Let's Begin** _(button, page)_ → goes to `/onboarding/talent/dob` · Figma ☐
- [ ] **Log in Instead** _(link, page)_ → goes to `/login` · Figma ☐
- [ ] **Dismiss notification** _(button, sidebar)_ → changes something on the page · Figma ☐

Notes:

## /opportunity-guidance

### opportunity guidance › job

- [ ] Screen checked · URL: `/opportunity-guidance/job` (http://localhost:5173/opportunity-guidance/job)
- Probed at the demo URL `/opportunity-guidance/job?job=ipmc-junior-python-instructor` (the base URL needs a signed-in session).
- Wiki: [career-buddy-chat-history](../career-buddy-chat-history.md)

<details><summary>1 documented states to open and compare with Figma</summary>

- [ ] `/opportunity-guidance/job?job=ipmc-junior-python-instructor`

</details>

Controls:

- [ ] **Streak, 12 days** _(button, top bar)_ → opens dialog “Your streak” `streak=open` (buttons: Do a 5-min lesson · See streak details →) · Figma ☐
- [ ] **Notifications, 5 unread** _(button, top bar)_ → opens dialog “Notifications” `notif=open` (buttons: Mark all read · Expand to full view · All · Unread · Jobs · Messages · Try again · Settings · See everything) · Figma ☐
- [ ] **Messages, 5 unread** _(button, top bar)_ → goes to `/login` ⚠ page looks empty · Figma ☐
- [ ] **EN** _(button, top bar)_ → opens a menu: English (Ghana) · Twi · Ga · Ewe · Dagbani · Hausa · Figma ☐
- [ ] **Accessibility mode** _(button, top bar)_ → changes the view `a11y=1` · Figma ☐
- [ ] **Profile menu, Kofi A.** _(button, top bar)_ → opens a menu: View my profile · Preview as recruiter · My applications · Saved jobs · Settings · Accessibility · Language · Help and support · Send feedback · Invite a friend · Log out · Privacy · Figma ☐
- [ ] **Continue setup →** _(button, page)_ → goes to `/profile/engagement` · Figma ☐
- [ ] **Home** _(button, navigation)_ → goes to `/login` · Figma ☐
- [ ] **My Assessment 142** _(button, navigation)_ → goes to `/login` · Figma ☐
- [ ] **Job Postings 2** _(button, navigation)_ → goes to `/job-postings` · Figma ☐
- [ ] **Community** _(button, navigation)_ → goes to `/login` ⚠ page looks empty · Figma ☐
- [ ] **Messages 6** _(button, navigation)_ → goes to `/login` · Figma ☐
- [ ] **Skills Lab** _(button, navigation)_ → goes to `/skills-lab` · Figma ☐
- [ ] **My Learning** _(button, navigation)_ → goes to `/login` · Figma ☐
- [ ] **Profile** _(button, navigation)_ → goes to `/profile` · Figma ☐
- [ ] **Preview as recruiter** _(button, page)_ → goes to `/profile?view=recruiter` · Figma ☐
- [ ] **Collapse sidebar** _(button, page)_ → changes the view `rail=collapsed` · Figma ☐
- [ ] **Back to Matched to you** _(button, page)_ → goes to `/job-postings` · Figma ☐
- [ ] **Save Junior Python Instructor** _(button, page)_ → selects / switches · Figma ☐
- [ ] **Share Junior Python Instructor** _(button, page)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Apply with my GTH profile** _(button, page)_ → opens dialog “This is what IPMC Ghana will see” `apply=preview` (buttons: Close · Edit profile · Edit visibility · Cancel · Continue application) · Figma ☐
- [ ] **Save for later** _(button, page)_ → selects / switches · Figma ☐
- [ ] **Report posting** _(button, page)_ → opens dialog “Report this posting” `modal=report` (buttons: Cancel · Send report) · Figma ☐
- [ ] **How is this worked out?** _(button, page)_ → opens dialog “How your 82% works” `modal=how-match` · Figma ☐
- [ ] **I have it · add skill** _(button, page)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Learn it** _(button, page)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Ask Buddy** _(button, page)_ → opens dialog “Career Buddy” `new=chat` (buttons: History · Maximize · Close · Continue: Interests About 2 min · +50 pts · Suggest my interests · Which roles pay well in Accra? · Show me around · Send) · Figma ☐

Fields to try: Search opportunities, skills, communities...

Notes:

## /profile

### profile

- [ ] Screen checked · URL: `/profile` (http://localhost:5173/profile)
- Wiki: [parent-flags](../parent-flags.md), [talent-assessment](../talent-assessment.md), [talent-my-circle](../talent-my-circle.md), [talent-profile](../talent-profile.md)

Controls:

- [ ] **Streak, 12 days** _(button, top bar)_ → opens dialog “Your streak” `streak=open` (buttons: Do a 5-min lesson · See streak details →) · Figma ☐
- [ ] **Notifications, 5 unread** _(button, top bar)_ → opens dialog “Notifications” `notif=open` (buttons: Mark all read · Expand to full view · All · Unread · Jobs · Messages · Try again · Settings · See everything) · Figma ☐
- [ ] **Messages, 5 unread** _(button, top bar)_ → goes to `/login` · Figma ☐
- [ ] **EN** _(button, top bar)_ → opens a menu: English (Ghana) · Twi · Ga · Ewe · Dagbani · Hausa · Figma ☐
- [ ] **Accessibility mode** _(button, top bar)_ → changes the view `ax=panel` · Figma ☐
- [ ] **Profile menu, Kofi A.** _(button, top bar)_ → opens a menu: View my profile · Preview as recruiter · My applications · Saved jobs · Settings · Accessibility · Language · Help and support · Send feedback · Invite a friend · Log out · Privacy · Figma ☐
- [ ] **Finish profile →** _(button, page)_ → goes to `/profile/engagement` · Figma ☐
- [ ] **Home** _(button, navigation)_ → goes to `/login` · Figma ☐
- [ ] **My Assessment 142** _(button, navigation)_ → goes to `/login` · Figma ☐
- [ ] **Job Postings 2** _(button, navigation)_ → goes to `/job-postings` · Figma ☐
- [ ] **Community** _(button, navigation)_ → goes to `/login` ⚠ page looks empty · Figma ☐
- [ ] **Messages 4** _(button, navigation)_ → goes to `/login` ⚠ page looks empty · Figma ☐
- [ ] **Skills Lab** _(button, navigation)_ → goes to `/skills-lab` · Figma ☐
- [ ] **My Learning** _(button, navigation)_ → goes to `/login` · Figma ☐
- [ ] **Profile** _(button, navigation)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Preview as recruiter** _(button, page, 2 on screen)_ → changes the view `view=recruiter` · Figma ☐
- [ ] **Watch my 60-sec pitch 0:58 · 112 plays** _(button, page)_ → changes the view `tab=about` · Figma ☐
- [ ] **Change photo** _(button, page)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Share profile** _(button, page)_ → opens dialog “Share your profile” `share=open` (buttons: Close · Copy link · Customise your link · WhatsApp · LinkedIn · Status / Story · X · Email · More · Make a share card For WhatsApp status, IG story or LinkedIn · Download PNG ↓ · Anyone with the link · Download PDF / CV) · Figma ☐
- [ ] **Overview** _(tab, navigation)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Skills, 7** _(tab, navigation)_ → changes the view `tab=skills` · Figma ☐
- [ ] **Experience, 2** _(tab, navigation)_ → changes the view `tab=experience` · Figma ☐
- [ ] **Portfolio, 3** _(tab, navigation)_ → changes the view `tab=portfolio` · Figma ☐
- [ ] **Certs, 2** _(tab, navigation)_ → changes the view `tab=certs` · Figma ☐
- [ ] **About me** _(tab, navigation)_ → changes the view `tab=about` · Figma ☐
- [ ] **Read more →** _(button, top bar)_ → changes the view `tab=about` · Figma ☐
- [ ] **Edit About** _(button, top bar)_ → changes the view `edit=about` · Figma ☐
- [ ] **See all 7 →** _(button, top bar)_ → changes the view `tab=skills` · Figma ☐
- [ ] **Edit skills** _(button, top bar)_ → changes the view `tab=skills` · Figma ☐
- [ ] **See all 2 →** _(button, top bar)_ → changes the view `tab=experience` · Figma ☐
- [ ] **Edit experience** _(button, top bar)_ → changes the view `tab=experience` · Figma ☐
- [ ] **See all 3 →** _(button, top bar)_ → changes the view `tab=portfolio` · Figma ☐
- [ ] **Edit portfolio** _(button, top bar)_ → changes the view `tab=portfolio` · Figma ☐
- [ ] **Add a portfolio link** _(button, page)_ → goes to `/profile/filling/portfolio` · Figma ☐
- [ ] **Finish my profile** _(button, page)_ → goes to `/profile/filling/portfolio` · Figma ☐
- [ ] **See all →** _(button, top bar)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Edit goal** _(button, top bar)_ → changes the view `tab=about` · Figma ☐
- [ ] **All 9 →** _(button, top bar)_ → ⚠ nothing visible happens · Figma ☐

Fields to try: Search opportunities, skills, communities...

Notes:

### profile › engagement

- [ ] Screen checked · URL: `/profile/engagement` (http://localhost:5173/profile/engagement)
- Wiki: [responsive-plan](../responsive-plan.md), [talent-engagement-revamp](../talent-engagement-revamp.md)

<details><summary>3 documented states to open and compare with Figma</summary>

- [ ] `/profile/engagement?done=3`
- [ ] `/profile/engagement?hover=interests`
- [ ] `/profile/engagement?modal=add-work`

</details>

Controls:

- [ ] **Continue Interests** _(button, page)_ → goes to `/profile/filling/interests` · Figma ☐
- [ ] **Chat with Career Buddy** _(button, page)_ → goes to `/profile/filling/career-buddy` · Figma ☐
- [ ] **Finish later and go to my dashboard** _(button, page)_ → goes to `/login` · Figma ☐

Notes:

### profile › engagement › avatar

- [ ] Screen checked · URL: `/profile/engagement/avatar` (http://localhost:5173/profile/engagement/avatar)
- Wiki: [talent-engagement-revamp](../talent-engagement-revamp.md)

<details><summary>1 documented states to open and compare with Figma</summary>

- [ ] `/profile/engagement/avatar?modal=switch-modes`

</details>

Controls:

- [ ] **Journey map** _(button, page)_ → goes to `/profile/engagement` · Figma ☐
- [ ] **Undo last change** _(button, page)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Edit name** _(button, page)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐
- [ ] **Shuffle avatar** _(button, page)_ → selects / switches · Figma ☐
- [ ] **Style** _(tab, sidebar)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Skin** _(tab, sidebar)_ → goes to `/profile/engagement/avatar/skin` · Figma ☐
- [ ] **Hair** _(tab, sidebar)_ → goes to `/profile/engagement/avatar/hair` · Figma ☐
- [ ] **Extras** _(tab, sidebar)_ → goes to `/profile/engagement/avatar/extras` · Figma ☐
- [ ] **Outfit** _(tab, sidebar)_ → goes to `/profile/engagement/avatar/outfit` · Figma ☐
- [ ] **Style 1** _(radio, sidebar)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Style 2** _(radio, sidebar)_ → selects / switches · Figma ☐
- [ ] **Style 3** _(radio, sidebar)_ → selects / switches · Figma ☐
- [ ] **Style 4** _(radio, sidebar)_ → selects / switches · Figma ☐
- [ ] **Style 5** _(radio, sidebar)_ → selects / switches · Figma ☐
- [ ] **Style 6** _(radio, sidebar)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐
- [ ] **Style 7** _(radio, sidebar)_ → selects / switches · Figma ☐
- [ ] **Style 8** _(radio, sidebar)_ → selects / switches · Figma ☐
- [ ] **Style 9** _(radio, sidebar)_ → selects / switches · Figma ☐
- [ ] **Style 10** _(radio, sidebar)_ → selects / switches · Figma ☐
- [ ] **Soft Almond** _(radio, sidebar)_ → selects / switches · Figma ☐
- [ ] **Warm Sand** _(radio, sidebar)_ → selects / switches · Figma ☐
- [ ] **Honey** _(radio, sidebar)_ → selects / switches · Figma ☐
- [ ] **Caramel** _(radio, sidebar)_ → selects / switches · Figma ☐
- [ ] **Bronze** _(radio, sidebar)_ → selects / switches · Figma ☐
- [ ] **Cocoa Light** _(radio, sidebar)_ → selects / switches · Figma ☐
- [ ] **Cocoa** _(radio, sidebar)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Mahogany** _(radio, sidebar)_ → selects / switches · Figma ☐
- [ ] **Go back** _(button, sidebar)_ → goes to `/profile/engagement` · Figma ☐
- [ ] **Looks good, next** _(button, sidebar)_ → goes to `/profile/engagement/avatar/skin` · Figma ☐

Notes:

### profile › engagement › avatar › extras

- [ ] Screen checked · URL: `/profile/engagement/avatar/extras` (http://localhost:5173/profile/engagement/avatar/extras)
- Wiki: [talent-engagement-revamp](../talent-engagement-revamp.md)

Controls:

- [ ] **Journey map** _(button, page)_ → goes to `/profile/engagement` · Figma ☐
- [ ] **Undo last change** _(button, page)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Edit name** _(button, page)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Shuffle avatar** _(button, page)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Style** _(tab, sidebar)_ → goes to `/profile/engagement/avatar` · Figma ☐
- [ ] **Skin** _(tab, sidebar)_ → goes to `/profile/engagement/avatar/skin` · Figma ☐
- [ ] **Hair** _(tab, sidebar)_ → goes to `/profile/engagement/avatar/hair` · Figma ☐
- [ ] **Extras** _(tab, sidebar)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Outfit** _(tab, sidebar)_ → goes to `/profile/engagement/avatar/outfit` · Figma ☐
- [ ] **None** _(radio, sidebar, 3 on screen)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Round** _(radio, sidebar)_ → selects / switches · Figma ☐
- [ ] **Square** _(radio, sidebar)_ → selects / switches · Figma ☐
- [ ] **Cat-eye** _(radio, sidebar)_ → selects / switches · Figma ☐
- [ ] **Goatee** _(radio, sidebar)_ → selects / switches · Figma ☐
- [ ] **Stubble** _(radio, sidebar)_ → selects / switches · Figma ☐
- [ ] **Full Beard** _(radio, sidebar)_ → selects / switches · Figma ☐
- [ ] **Stud** _(radio, sidebar)_ → selects / switches · Figma ☐
- [ ] **Hoop** _(radio, sidebar)_ → selects / switches · Figma ☐
- [ ] **Drop** _(radio, sidebar)_ → selects / switches · Figma ☐
- [ ] **Freckles** _(checkbox, sidebar)_ → selects / switches · Figma ☐
- [ ] **Adinkra mark** _(checkbox, sidebar)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐
- [ ] **Bold brows** _(checkbox, sidebar)_ → selects / switches · Figma ☐
- [ ] **Beauty mark** _(checkbox, sidebar)_ → selects / switches · Figma ☐
- [ ] **Blush** _(checkbox, sidebar)_ → selects / switches · Figma ☐
- [ ] **Black** _(radio, sidebar)_ → selects / switches · Figma ☐
- [ ] **Dark Brown** _(radio, sidebar)_ → selects / switches · Figma ☐
- [ ] **Brown** _(radio, sidebar)_ → selects / switches · Figma ☐
- [ ] **Auburn** _(radio, sidebar)_ → selects / switches · Figma ☐
- [ ] **Rose Gold** _(radio, sidebar)_ → selects / switches · Figma ☐
- [ ] **Gold** _(radio, sidebar)_ → selects / switches · Figma ☐
- [ ] **Violet** _(radio, sidebar)_ → selects / switches · Figma ☐
- [ ] **Pink** _(radio, sidebar)_ → selects / switches · Figma ☐
- [ ] **Green** _(radio, sidebar)_ → selects / switches · Figma ☐
- [ ] **Go back** _(button, sidebar)_ → goes to `/profile/engagement/avatar/hair` · Figma ☐
- [ ] **Save extras, next** _(button, sidebar)_ → goes to `/profile/engagement/avatar/outfit` · Figma ☐

Notes:

### profile › engagement › avatar › hair

- [ ] Screen checked · URL: `/profile/engagement/avatar/hair` (http://localhost:5173/profile/engagement/avatar/hair)
- Wiki: [talent-engagement-revamp](../talent-engagement-revamp.md)

Controls:

- [ ] **Journey map** _(button, page)_ → goes to `/profile/engagement` · Figma ☐
- [ ] **Undo last change** _(button, page)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Edit name** _(button, page)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Shuffle avatar** _(button, page)_ → selects / switches · Figma ☐
- [ ] **Style** _(tab, sidebar)_ → goes to `/profile/engagement/avatar` · Figma ☐
- [ ] **Skin** _(tab, sidebar)_ → goes to `/profile/engagement/avatar/skin` · Figma ☐
- [ ] **Hair** _(tab, sidebar)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Extras** _(tab, sidebar)_ → goes to `/profile/engagement/avatar/extras` · Figma ☐
- [ ] **Outfit** _(tab, sidebar)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐
- [ ] **Box Braids** _(radio, sidebar)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Cornrows** _(radio, sidebar)_ → selects / switches · Figma ☐
- [ ] **Afro** _(radio, sidebar)_ → selects / switches · Figma ☐
- [ ] **Buzz Cut** _(radio, sidebar)_ → selects / switches · Figma ☐
- [ ] **Fade** _(radio, sidebar)_ → selects / switches · Figma ☐
- [ ] **Twists** _(radio, sidebar)_ → selects / switches · Figma ☐
- [ ] **Locs** _(radio, sidebar)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐
- [ ] **Hijab** _(radio, sidebar)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐
- [ ] **Kente Wrap** _(radio, sidebar)_ → selects / switches · Figma ☐
- [ ] **Long Curly** _(radio, sidebar)_ → selects / switches · Figma ☐
- [ ] **Bald** _(radio, sidebar)_ → selects / switches · Figma ☐
- [ ] **Bantu Knots** _(radio, sidebar)_ → selects / switches · Figma ☐
- [ ] **Black** _(radio, sidebar)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Dark Brown** _(radio, sidebar)_ → selects / switches · Figma ☐
- [ ] **Brown** _(radio, sidebar)_ → selects / switches · Figma ☐
- [ ] **Auburn** _(radio, sidebar)_ → selects / switches · Figma ☐
- [ ] **Chestnut** _(radio, sidebar)_ → selects / switches · Figma ☐
- [ ] **Honey** _(radio, sidebar)_ → selects / switches · Figma ☐
- [ ] **Violet** _(radio, sidebar)_ → selects / switches · Figma ☐
- [ ] **Pink** _(radio, sidebar)_ → selects / switches · Figma ☐
- [ ] **Green** _(radio, sidebar)_ → selects / switches · Figma ☐
- [ ] **Go back** _(button, sidebar)_ → goes to `/profile/engagement/avatar/skin` · Figma ☐
- [ ] **Save tone, next** _(button, sidebar)_ → goes to `/profile/engagement/avatar/extras` · Figma ☐

Notes:

### profile › engagement › avatar › outfit

- [ ] Screen checked · URL: `/profile/engagement/avatar/outfit` (http://localhost:5173/profile/engagement/avatar/outfit)
- Wiki: [talent-engagement-revamp](../talent-engagement-revamp.md)

Controls:

- [ ] **Journey map** _(button, page)_ → goes to `/profile/engagement` · Figma ☐
- [ ] **Undo last change** _(button, page)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Edit name** _(button, page)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Shuffle avatar** _(button, page)_ → selects / switches · Figma ☐
- [ ] **Style** _(tab, sidebar)_ → goes to `/profile/engagement/avatar` · Figma ☐
- [ ] **Skin** _(tab, sidebar)_ → goes to `/profile/engagement/avatar/skin` · Figma ☐
- [ ] **Hair** _(tab, sidebar)_ → goes to `/profile/engagement/avatar/hair` · Figma ☐
- [ ] **Extras** _(tab, sidebar)_ → goes to `/profile/engagement/avatar/extras` · Figma ☐
- [ ] **Outfit** _(tab, sidebar)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Designer fit** _(button, sidebar)_ → selects / switches · Figma ☐
- [ ] **Engineer fit** _(button, sidebar)_ → selects / switches · Figma ☐
- [ ] **Healthcare fit** _(button, sidebar)_ → selects / switches · Figma ☐
- [ ] **Educator fit** _(button, sidebar)_ → selects / switches · Figma ☐
- [ ] **Tee** _(radio, sidebar)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Hoodie** _(radio, sidebar)_ → selects / switches · Figma ☐
- [ ] **Polo** _(radio, sidebar)_ → selects / switches · Figma ☐
- [ ] **Button-down** _(radio, sidebar)_ → selects / switches · Figma ☐
- [ ] **Kente Top** _(radio, sidebar)_ → selects / switches · Figma ☐
- [ ] **Suit** _(radio, sidebar)_ → selects / switches · Figma ☐
- [ ] **Hijab fit** _(radio, sidebar)_ → selects / switches · Figma ☐
- [ ] **Dashiki** _(radio, sidebar)_ → selects / switches · Figma ☐
- [ ] **Lab coat** _(radio, sidebar)_ → selects / switches · Figma ☐
- [ ] **Chef whites** _(radio, sidebar)_ → selects / switches · Figma ☐
- [ ] **Athletic** _(radio, sidebar)_ → selects / switches · Figma ☐
- [ ] **Slim** _(radio, sidebar)_ → selects / switches · Figma ☐
- [ ] **Regular** _(radio, sidebar)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Relaxed** _(radio, sidebar)_ → selects / switches · Figma ☐
- [ ] **Original colours** _(radio, sidebar)_ → selects / switches · Figma ☐
- [ ] **Violet** _(radio, sidebar)_ → selects / switches · Figma ☐
- [ ] **Charcoal** _(radio, sidebar)_ → selects / switches · Figma ☐
- [ ] **White** _(radio, sidebar)_ → selects / switches · Figma ☐
- [ ] **Red** _(radio, sidebar)_ → selects / switches · Figma ☐
- [ ] **Sky** _(radio, sidebar)_ → selects / switches · Figma ☐
- [ ] **Green** _(radio, sidebar)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Yellow** _(radio, sidebar)_ → selects / switches · Figma ☐
- [ ] **Go back** _(button, sidebar)_ → goes to `/profile/engagement/avatar/extras` · Figma ☐
- [ ] **Save outfit , finish avatar** _(button, sidebar)_ → goes to `/profile/engagement` · Figma ☐

Notes:

### profile › engagement › avatar › skin

- [ ] Screen checked · URL: `/profile/engagement/avatar/skin` (http://localhost:5173/profile/engagement/avatar/skin)
- Wiki: [talent-engagement-revamp](../talent-engagement-revamp.md)

Controls:

- [ ] **Journey map** _(button, page)_ → goes to `/profile/engagement` · Figma ☐
- [ ] **Undo last change** _(button, page)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Edit name** _(button, page)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Shuffle avatar** _(button, page)_ → selects / switches · Figma ☐
- [ ] **Style** _(tab, sidebar)_ → goes to `/profile/engagement/avatar` · Figma ☐
- [ ] **Skin** _(tab, sidebar)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Hair** _(tab, sidebar)_ → goes to `/profile/engagement/avatar/hair` · Figma ☐
- [ ] **Extras** _(tab, sidebar)_ → goes to `/profile/engagement/avatar/extras` · Figma ☐
- [ ] **Outfit** _(tab, sidebar)_ → goes to `/profile/engagement/avatar/outfit` · Figma ☐
- [ ] **Soft Almond** _(radio, sidebar)_ → selects / switches · Figma ☐
- [ ] **Warm Sand** _(radio, sidebar)_ → selects / switches · Figma ☐
- [ ] **Honey** _(radio, sidebar)_ → selects / switches · Figma ☐
- [ ] **Caramel** _(radio, sidebar)_ → selects / switches · Figma ☐
- [ ] **Bronze** _(radio, sidebar)_ → selects / switches · Figma ☐
- [ ] **Cocoa Light** _(radio, sidebar)_ → selects / switches · Figma ☐
- [ ] **Cocoa** _(radio, sidebar)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Mahogany** _(radio, sidebar)_ → selects / switches · Figma ☐
- [ ] **Chestnut** _(radio, sidebar)_ → selects / switches · Figma ☐
- [ ] **Espresso** _(radio, sidebar)_ → selects / switches · Figma ☐
- [ ] **Deep Cocoa** _(radio, sidebar)_ → selects / switches · Figma ☐
- [ ] **Onyx** _(radio, sidebar)_ → selects / switches · Figma ☐
- [ ] **Daylight Default** _(radio, sidebar)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Studio Soft warm** _(radio, sidebar)_ → selects / switches · Figma ☐
- [ ] **Golden hour Cinematic** _(radio, sidebar)_ → selects / switches · Figma ☐
- [ ] **Go back** _(button, sidebar)_ → goes to `/profile/engagement/avatar` · Figma ☐
- [ ] **Save tone, next** _(button, sidebar)_ → goes to `/profile/engagement/avatar/hair` · Figma ☐

Notes:

### profile › engagement › identity

- [ ] Screen checked · URL: `/profile/engagement/identity` (http://localhost:5173/profile/engagement/identity)
- ⚠ Without a signed-in session this URL redirects to `/profile/engagement/avatar`: sign in with a test account and check it by hand.
- Wiki: [talent-home](../talent-home.md)

No clickable controls of its own (only shared chrome).

Notes:

### profile › engagement › milestone

- [ ] Screen checked · URL: `/profile/engagement/milestone` (http://localhost:5173/profile/engagement/milestone)
- Wiki: [talent-engagement-revamp](../talent-engagement-revamp.md)

Controls:

- [ ] **Close** _(button, dialog)_ → goes to `/profile/engagement?done=3&toast=1` · Figma ☐
- [ ] **Share it** _(button, dialog)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Keep going: Skills** _(button, dialog)_ → goes to `/profile/filling/skills` · Figma ☐

Notes:

### profile › engagement › milestone › top 20

- [ ] Screen checked · URL: `/profile/engagement/milestone/top-20` (http://localhost:5173/profile/engagement/milestone/top-20)
- Wiki: [talent-engagement-revamp](../talent-engagement-revamp.md)

Controls:

- [ ] **Close** _(button, dialog)_ → goes to `/profile/engagement?done=6` · Figma ☐
- [ ] **Share it** _(button, dialog)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Keep going: Certs** _(button, dialog)_ → goes to `/profile/filling/certs` · Figma ☐

Notes:

### profile › engagement › milestone › top talent

- [ ] Screen checked · URL: `/profile/engagement/milestone/top-talent` (http://localhost:5173/profile/engagement/milestone/top-talent)
- Wiki: [talent-engagement-revamp](../talent-engagement-revamp.md)

Controls:

- [ ] **Close** _(button, dialog)_ → goes to `/profile/engagement?done=9` · Figma ☐
- [ ] **Share my card** _(button, dialog)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Go to my dashboard** _(button, dialog)_ → goes to `/login` ⚠ page looks empty · Figma ☐

Notes:

### profile › filling › career buddy

- [ ] Screen checked · URL: `/profile/filling/career-buddy` (http://localhost:5173/profile/filling/career-buddy)
- Wiki: [parent-career-buddy](../parent-career-buddy.md), [recruiter-ai-chat](../recruiter-ai-chat.md), [recruiter-settings](../recruiter-settings.md)

<details><summary>1 documented states to open and compare with Figma</summary>

- [ ] `/profile/filling/career-buddy?role=recruiter&live=0&cb=landing`

</details>

Controls:

- [ ] **Scroll to next steps** _(button, page)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Copy message** _(button, page)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Helpful** _(button, page)_ → selects / switches · Figma ☐
- [ ] **Not helpful** _(button, page)_ → selects / switches · Figma ☐
- [ ] **Regenerate response** _(button, page)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Tell me more about GTH** _(button, page)_ → changes something on the page · Figma ☐
- [ ] **How does GTH match me with opportunities?** _(button, page)_ → changes something on the page · Figma ☐
- [ ] **Is my personal information safe on GTH** _(button, page)_ → changes something on the page · Figma ☐
- [ ] **Attach a file** _(button, page)_ → disabled here · Figma ☐
- [ ] **Dictate with microphone** _(button, page)_ → opens dialog “Your chats” (buttons: Close history · New chat · All · Interviews · CV · Jobs · Learning · My CV for Hubtel Buddy: Move your Figma projects above educa · Prepare for my Hubtel interview You: Can we practise the por · Which roles fit UX and data? Buddy: Product analyst and UX r · Rewrite my LinkedIn summary Buddy: Here’s a 3-line version t · Junior designer salaries in Accra Buddy: Most offers sit bet · Explain my personality results Buddy: As an Explorer, you en · Free ways to learn Figma Buddy: Start with Figma basics in S · Cover letter for mPharma You: Make it shorter and less forma · KNUST or Ashesi for design? Buddy: Both have strong programm) · Figma ☐
- [ ] **Start voice call** _(button, page)_ → disabled here · Figma ☐
- [ ] **Open Personal Info.** _(button, sidebar)_ → expands / opens · Figma ☐
- [ ] **Open Educational Background** _(button, sidebar)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐
- [ ] **Open Personal area of interest** _(button, sidebar)_ → expands / opens · Figma ☐
- [ ] **Open Personality** _(button, sidebar)_ → expands / opens · Figma ☐
- [ ] **Open Skills (Competencies)** _(button, sidebar)_ → expands / opens · Figma ☐
- [ ] **Open Work Experience** _(button, sidebar)_ → expands / opens · Figma ☐
- [ ] **Open Project Portfolio** _(button, sidebar)_ → expands / opens · Figma ☐
- [ ] **Open Certifications** _(button, sidebar)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐
- [ ] **Open Career Options** _(button, sidebar)_ → expands / opens · Figma ☐
- [ ] **Open Career Pitch** _(button, sidebar)_ → expands / opens · Figma ☐

Fields to try: Write a message…

Notes:

### profile › filling › certs

- [ ] Screen checked · URL: `/profile/filling/certs` (http://localhost:5173/profile/filling/certs)
- Wiki: [talent-engagement-revamp](../talent-engagement-revamp.md)

<details><summary>5 documented states to open and compare with Figma</summary>

- [ ] `/profile/filling/certs?modal=add`
- [ ] `/profile/filling/certs?modal=delete`
- [ ] `/profile/filling/certs?modal=edit`
- [ ] `/profile/filling/certs?state=complete`
- [ ] `/profile/filling/certs?state=list`

</details>

Controls:

- [ ] **Journey map** _(button, page)_ → goes to `/profile/engagement` · Figma ☐
- [ ] **Upload a certificate** _(button, page)_ → opens dialog “New certificate. Upload it or type it.” `modal=add` (buttons: Close · Browse files · Select a type Online course · Cancel · Save certificate) · Figma ☐
- [ ] **Add manually** _(button, page)_ → opens dialog “New certificate. Upload it or type it.” `modal=add` (buttons: Close · Browse files · Select a type Online course · Cancel · Save certificate) · Figma ☐
- [ ] **No certificates yet? Skip this stage** _(button, page)_ → goes to `/profile/filling/goals` · Figma ☐
- [ ] **Credential link** _(button, page)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Back: Portfolio** _(button, page)_ → goes to `/profile/filling/portfolio` · Figma ☐
- [ ] **Next: Goals** _(button, page)_ → disabled here · Figma ☐

Notes:

### profile › filling › certs › list

- [ ] Screen checked · URL: `/profile/filling/certs/list` (http://localhost:5173/profile/filling/certs/list)
- ⚠ Without a signed-in session this URL redirects to `/profile/filling/certs?state=list`: sign in with a test account and check it by hand.

No clickable controls of its own (only shared chrome).

Notes:

### profile › filling › complete

- [ ] Screen checked · URL: `/profile/filling/complete` (http://localhost:5173/profile/filling/complete)
- Wiki: [talent-engagement-revamp](../talent-engagement-revamp.md)

<details><summary>2 documented states to open and compare with Figma</summary>

- [ ] `/profile/filling/complete?state=ready`
- [ ] `/profile/filling/complete?state=writing`

</details>

Controls:

- [ ] **Journey map** _(button, page)_ → goes to `/profile/engagement` · Figma ☐
- [ ] **Professional** _(button, page)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Friendly** _(button, page)_ → selects / switches · Figma ☐
- [ ] **Ambitious** _(button, page)_ → selects / switches · Figma ☐
- [ ] **Back: Pitch** _(button, page)_ → goes to `/profile/filling/pitch` · Figma ☐
- [ ] **Go to my dashboard** _(button, page)_ → disabled here · Figma ☐

Notes:

### profile › filling › cv

- [ ] Screen checked · URL: `/profile/filling/cv` (http://localhost:5173/profile/filling/cv)
- Wiki: [talent-engagement-revamp](../talent-engagement-revamp.md)

<details><summary>7 documented states to open and compare with Figma</summary>

- [ ] `/profile/filling/cv?step=done`
- [ ] `/profile/filling/cv?step=failed`
- [ ] `/profile/filling/cv?step=reading`
- [ ] `/profile/filling/cv?step=review`
- [ ] `/profile/filling/cv?step=review&fix=1`
- [ ] `/profile/filling/cv?step=unsupported`
- [ ] `/profile/filling/cv?step=uploading`

</details>

Controls:

- [ ] **Close** _(button, dialog)_ → goes to `/profile/engagement` · Figma ☐
- [ ] **Drop your CV, browse, or take a photo PDF, Word, or up to 3 photos (JPG, PNG) · 10 MB max** _(button, dialog)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Back** _(button, dialog)_ → goes to `/profile/engagement?modal=add-work` · Figma ☐
- [ ] **Choose file** _(button, dialog)_ → ⚠ nothing visible happens · Figma ☐

Notes:

### profile › filling › goals

- [ ] Screen checked · URL: `/profile/filling/goals` (http://localhost:5173/profile/filling/goals)
- Wiki: [talent-engagement-revamp](../talent-engagement-revamp.md)

<details><summary>5 documented states to open and compare with Figma</summary>

- [ ] `/profile/filling/goals?modal=add`
- [ ] `/profile/filling/goals?modal=delete`
- [ ] `/profile/filling/goals?modal=edit`
- [ ] `/profile/filling/goals?state=complete`
- [ ] `/profile/filling/goals?state=list`

</details>

Controls:

- [ ] **Journey map** _(button, page)_ → goes to `/profile/engagement` · Figma ☐
- [ ] **Add your first goal** _(button, page)_ → opens dialog “New goal. Where do you want to go?” `modal=add` (buttons: Close · Select a type Full-time job Contract Postgraduate study · Select an industry Fintech · Select a timeline Within 6 months Within 1 year From Sep 202 · Accra only · Anywhere in Ghana · Remote-first · Accra or remote · Open to relocating · Cancel · Save goal) · Figma ☐
- [ ] **Not sure yet? Skip this stage** _(button, page)_ → goes to `/profile/filling/pitch` · Figma ☐
- [ ] **Back: Certs** _(button, page)_ → goes to `/profile/filling/certs` · Figma ☐
- [ ] **Next: Pitch** _(button, page)_ → disabled here · Figma ☐

Notes:

### profile › filling › goals › list

- [ ] Screen checked · URL: `/profile/filling/goals/list` (http://localhost:5173/profile/filling/goals/list)
- ⚠ Without a signed-in session this URL redirects to `/profile/filling/goals?state=list`: sign in with a test account and check it by hand.

No clickable controls of its own (only shared chrome).

Notes:

### profile › filling › interests

- [ ] Screen checked · URL: `/profile/filling/interests` (http://localhost:5173/profile/filling/interests)
- Wiki: [talent-engagement-revamp](../talent-engagement-revamp.md), [talent-home](../talent-home.md)

<details><summary>4 documented states to open and compare with Figma</summary>

- [ ] `/profile/filling/interests?modal=add-area`
- [ ] `/profile/filling/interests?state=complete`
- [ ] `/profile/filling/interests?step=areas`
- [ ] `/profile/filling/interests?step=specifics`

</details>

Controls:

- [ ] **Journey map** _(button, page)_ → goes to `/profile/engagement` · Figma ☐
- [ ] **Technology & Engineering** _(checkbox, page)_ → selects / switches · Figma ☐
- [ ] **Business & Finance** _(checkbox, page)_ → selects / switches · Figma ☐
- [ ] **Creative Arts & Design** _(checkbox, page)_ → selects / switches · Figma ☐
- [ ] **Health Sciences** _(checkbox, page)_ → selects / switches · Figma ☐
- [ ] **Education** _(checkbox, page)_ → selects / switches · Figma ☐
- [ ] **Agriculture & Environment** _(checkbox, page)_ → selects / switches · Figma ☐
- [ ] **Law & Policy** _(checkbox, page)_ → ⚠ not tested, try it by hand (it could not be clicked, maybe covered by something) · Figma ☐
- [ ] **Media & Communication** _(checkbox, page)_ → ⚠ not tested, try it by hand (it could not be clicked, maybe covered by something) · Figma ☐
- [ ] **Development & NGOs** _(checkbox, page)_ → ⚠ not tested, try it by hand (it could not be clicked, maybe covered by something) · Figma ☐
- [ ] **Skip for now** _(button, page)_ → goes to `/profile/filling/personality` · Figma ☐
- [ ] **Continue** _(button, page)_ → disabled here · Figma ☐

Notes:

### profile › filling › interests › categories

- [ ] Screen checked · URL: `/profile/filling/interests/categories` (http://localhost:5173/profile/filling/interests/categories)
- ⚠ Without a signed-in session this URL redirects to `/profile/filling/interests?step=areas`: sign in with a test account and check it by hand.

No clickable controls of its own (only shared chrome).

Notes:

### profile › filling › personality

- [ ] Screen checked · URL: `/profile/filling/personality` (http://localhost:5173/profile/filling/personality)
- Wiki: [talent-engagement-revamp](../talent-engagement-revamp.md)

<details><summary>6 documented states to open and compare with Figma</summary>

- [ ] `/profile/filling/personality?step=intro`
- [ ] `/profile/filling/personality?step=path`
- [ ] `/profile/filling/personality?step=quiz&q=7`
- [ ] `/profile/filling/personality?step=quiz&q=7&answer=1`
- [ ] `/profile/filling/personality?step=result`
- [ ] `/profile/filling/personality?step=working`

</details>

Controls:

- [ ] **Prefer games? Try the Personality Arcade** _(button, page)_ → changes the view `step=path` · Figma ☐
- [ ] **Skip for now** _(button, page)_ → goes to `/profile/filling/skills` · Figma ☐
- [ ] **Start the quiz** _(button, page)_ → changes the view `step=quiz&q=7` · Figma ☐

Notes:

### profile › filling › personality › arcade

- [ ] Screen checked · URL: `/profile/filling/personality/arcade` (http://localhost:5173/profile/filling/personality/arcade)
- Wiki: [talent-engagement-revamp](../talent-engagement-revamp.md)

Controls:

- [ ] **Journey map** _(button, page)_ → goes to `/profile/engagement` · Figma ☐
- [ ] **Play now** _(button, page)_ → opens dialog “Makola Haggle” `modal=details&game=makola-haggle` (buttons: Close · Back to Arcade · Start game) · Figma ☐
- [ ] **All 10** _(button, page)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Strategy 2** _(button, page)_ → changes the view `filter=Strategy` · Figma ☐
- [ ] **Social 2** _(button, page)_ → changes the view `filter=Social` · Figma ☐
- [ ] **Decisions 1** _(button, page)_ → changes the view `filter=Decisions` · Figma ☐
- [ ] **Planning 1** _(button, page)_ → changes the view `filter=Planning` · Figma ☐
- [ ] **Speed 1** _(button, page)_ → changes the view `filter=Speed` · Figma ☐
- [ ] **Logic 1** _(button, page)_ → changes the view `filter=Logic` · Figma ☐
- [ ] **Creativity 2** _(button, page)_ → changes the view `filter=Creativity` · Figma ☐
- [ ] **Play game** _(button, page, 9 on screen)_ → goes to `/profile/filling/personality/arcade/escape-room` · Figma ☐
- [ ] **Coming soon** _(button, page)_ → disabled here · Figma ☐
- [ ] **Suggest a game** _(button, page)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Take the quiz instead** _(button, page)_ → goes to `/profile/filling/personality?step=quiz` · Figma ☐
- [ ] **See my result** _(button, page)_ → disabled here · Figma ☐

Notes:

### profile › filling › personality › arcade › ‹game›

- [ ] Screen checked · URL: `/profile/filling/personality/arcade/:gameId` (needs a real id: open it from a link in this area)
- Needs a real id: reach it from a link on another screen of this phase.

No clickable controls of its own (only shared chrome).

Notes:

### profile › filling › pitch

- [ ] Screen checked · URL: `/profile/filling/pitch` (http://localhost:5173/profile/filling/pitch)
- Wiki: [talent-engagement-revamp](../talent-engagement-revamp.md)

<details><summary>8 documented states to open and compare with Figma</summary>

- [ ] `/profile/filling/pitch?modal=delete`
- [ ] `/profile/filling/pitch?mode=record&step=camera`
- [ ] `/profile/filling/pitch?mode=record&step=recording`
- [ ] `/profile/filling/pitch?mode=upload`
- [ ] `/profile/filling/pitch?mode=upload&step=ready`
- [ ] `/profile/filling/pitch?mode=write`
- [ ] `/profile/filling/pitch?step=published`
- [ ] `/profile/filling/pitch?step=review`

</details>

Controls:

- [ ] **Journey map** _(button, page)_ → goes to `/profile/engagement` · Figma ☐
- [ ] **Start recording** _(button, page)_ → changes the view `mode=record&step=camera` · Figma ☐
- [ ] **Upload** _(button, page)_ → changes the view `mode=upload` · Figma ☐
- [ ] **Start writing** _(button, page)_ → changes the view `mode=write` · Figma ☐
- [ ] **Back: Goals** _(button, page)_ → goes to `/profile/filling/goals` · Figma ☐
- [ ] **Skip for now** _(button, page)_ → goes to `/profile/engagement` · Figma ☐
- [ ] **Review and publish** _(button, page)_ → disabled here · Figma ☐

Notes:

### profile › filling › pitch › record

- [ ] Screen checked · URL: `/profile/filling/pitch/record` (http://localhost:5173/profile/filling/pitch/record)
- ⚠ Without a signed-in session this URL redirects to `/profile/filling/pitch?mode=record&step=camera`: sign in with a test account and check it by hand.

No clickable controls of its own (only shared chrome).

Notes:

### profile › filling › portfolio

- [ ] Screen checked · URL: `/profile/filling/portfolio` (http://localhost:5173/profile/filling/portfolio)
- Wiki: [talent-engagement-revamp](../talent-engagement-revamp.md)

<details><summary>5 documented states to open and compare with Figma</summary>

- [ ] `/profile/filling/portfolio?modal=add`
- [ ] `/profile/filling/portfolio?modal=delete`
- [ ] `/profile/filling/portfolio?modal=edit`
- [ ] `/profile/filling/portfolio?state=complete`
- [ ] `/profile/filling/portfolio?state=list`

</details>

Controls:

- [ ] **Journey map** _(button, page)_ → goes to `/profile/engagement` · Figma ☐
- [ ] **Add your first project** _(button, page)_ → opens dialog “New project. Show what you built.” `modal=add` (buttons: Close · Browse files · Select a type Mobile app Design / UX Data analysis Research · Cancel · Save project) · Figma ☐
- [ ] **Paste a link** _(button, page)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Nothing to show yet? Skip this stage** _(button, page)_ → goes to `/profile/filling/certs` ⚠ page looks empty · Figma ☐
- [ ] **Back: Work** _(button, page)_ → goes to `/profile/filling/work` · Figma ☐
- [ ] **Next: Certs** _(button, page)_ → disabled here · Figma ☐

Notes:

### profile › filling › portfolio › projects

- [ ] Screen checked · URL: `/profile/filling/portfolio/projects` (http://localhost:5173/profile/filling/portfolio/projects)
- ⚠ Without a signed-in session this URL redirects to `/profile/filling/portfolio?state=list`: sign in with a test account and check it by hand.

No clickable controls of its own (only shared chrome).

Notes:

### profile › filling › skills

- [ ] Screen checked · URL: `/profile/filling/skills` (http://localhost:5173/profile/filling/skills)
- Wiki: [talent-engagement-revamp](../talent-engagement-revamp.md)

<details><summary>3 documented states to open and compare with Figma</summary>

- [ ] `/profile/filling/skills?modal=add`
- [ ] `/profile/filling/skills?state=list`
- [ ] `/profile/filling/skills?view=lab`

</details>

Controls:

- [ ] **Journey map** _(button, page)_ → goes to `/profile/engagement` · Figma ☐
- [ ] **Add your first skill** _(button, page)_ → opens dialog “What are you adding?” `modal=add&blank=1` (buttons: Close · Beginner · Intermediate · Advanced · Expert · Data & analytics · Design & creative · Engineering · Leadership · Marketing · Product · Research · Communication · Cancel · Add skill) · Figma ☐
- [ ] **Import from my CV** _(button, page)_ → goes to `/profile/filling/cv` · Figma ☐
- [ ] **Back: Personality** _(button, page)_ → goes to `/profile/filling/personality` · Figma ☐
- [ ] **Skip for now** _(button, page)_ → goes to `/profile/filling/work` · Figma ☐
- [ ] **Next: Work** _(button, page)_ → disabled here · Figma ☐

Notes:

### profile › filling › skills › categories

- [ ] Screen checked · URL: `/profile/filling/skills/categories` (http://localhost:5173/profile/filling/skills/categories)
- ⚠ Without a signed-in session this URL redirects to `/profile/filling/skills?state=list`: sign in with a test account and check it by hand.

No clickable controls of its own (only shared chrome).

Notes:

### profile › filling › work

- [ ] Screen checked · URL: `/profile/filling/work` (http://localhost:5173/profile/filling/work)
- Wiki: [talent-engagement-revamp](../talent-engagement-revamp.md)

<details><summary>5 documented states to open and compare with Figma</summary>

- [ ] `/profile/filling/work?modal=add`
- [ ] `/profile/filling/work?modal=delete`
- [ ] `/profile/filling/work?modal=edit`
- [ ] `/profile/filling/work?state=complete`
- [ ] `/profile/filling/work?state=list`

</details>

Controls:

- [ ] **Journey map** _(button, page)_ → goes to `/profile/engagement` ⚠ page looks empty · Figma ☐
- [ ] **Add your first role** _(button, page)_ → opens dialog “New role. Tell the story.” `modal=add` (buttons: Close · Select a type Full-time Internship Freelance National servic · Cancel · Save role) · Figma ☐
- [ ] **Import from my CV** _(button, page)_ → goes to `/profile/filling/cv` · Figma ☐
- [ ] **No work experience yet? Skip this stage** _(button, page)_ → goes to `/profile/filling/portfolio` · Figma ☐
- [ ] **Back: Skills** _(button, page)_ → goes to `/profile/filling/skills` · Figma ☐
- [ ] **Next: Portfolio** _(button, page)_ → disabled here · Figma ☐

Notes:

### profile › filling › work › history

- [ ] Screen checked · URL: `/profile/filling/work/history` (http://localhost:5173/profile/filling/work/history)
- ⚠ Without a signed-in session this URL redirects to `/profile/filling/work?state=list`: sign in with a test account and check it by hand.

No clickable controls of its own (only shared chrome).

Notes:
