# Phase 6 · Recruiter

> Recruiter sign-up, Career Buddy for recruiters, dashboard, talent search, job templates and postings, screening, application pipeline, messages, community, settings and help.

33 screens · 76 documented states · click map generated 2026-11-11. Back to [all phases](README.md).

## Shared chrome (check once)

- [ ] **Ghana Talent Hub home** _(link, top bar)_ → goes to `/` · Figma ☐
- [ ] **Help** _(button, top bar)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐
- [ ] **Notifications, 5 unread** _(button, top bar)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐
- [ ] **Messages, 5 unread** _(button, top bar)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐
- [ ] **EN** _(button, top bar)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐
- [ ] **Accessibility mode** _(button, top bar)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐
- [ ] **Profile menu, Kofi A.** _(button, top bar)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Collapse sidebar** _(button, sidebar)_ → expands / opens · Figma ☐
- [ ] **Home** _(link, sidebar)_ → goes to `/recruiter/home` · Figma ☐
- [ ] **Talent Search** _(link, sidebar)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐
- [ ] **Job Postings 3** _(link, sidebar)_ → goes to `/recruiter/job-postings` · Figma ☐
- [ ] **Application Pipeline** _(link, sidebar)_ → goes to `/recruiter/application-pipeline` · Figma ☐
- [ ] **Messages** _(link, sidebar)_ → goes to `/recruiter/messages` · Figma ☐
- [ ] **Community** _(link, sidebar)_ → goes to `/recruiter/community` · Figma ☐
- [ ] **Profile** _(button, sidebar)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Upgrade** _(link, sidebar)_ → goes to `/recruiter/settings?tab=billing` · Figma ☐
- [ ] **Preview as talent** _(button, sidebar)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐

## /onboarding/recruiter

### onboarding › recruiter (portal home and other pages)

- [ ] Screen checked · URL: `/onboarding/recruiter` (http://localhost:5173/onboarding/recruiter)
- ⚠ Without a signed-in session this URL redirects to `/onboarding/recruiter/profile`: sign in with a test account and check it by hand.
- Wiki: [onboarding-redesign](../onboarding-redesign.md)

No clickable controls of its own (only shared chrome).

Notes:

### onboarding › recruiter › done

- [ ] Screen checked · URL: `/onboarding/recruiter/done` (http://localhost:5173/onboarding/recruiter/done)
- Wiki: [onboarding-redesign](../onboarding-redesign.md)

Controls:

- [ ] **Log In** _(link, top bar)_ → goes to `/login` · Figma ☐
- [ ] **Post a job** _(link, page)_ → goes to `/recruiter/job-postings` ⚠ page looks empty · Figma ☐
- [ ] **Start searching** _(link, page)_ → goes to `/recruiter/talent-search` · Figma ☐
- [ ] **Open** _(link, page)_ → goes to `/recruiter/home` · Figma ☐
- [ ] **Go To Recruiter Dashboard** _(button, page)_ → goes to `/recruiter/home` ⚠ page looks empty · Figma ☐

Notes:

### onboarding › recruiter › organisation

- [ ] Screen checked · URL: `/onboarding/recruiter/organisation` (http://localhost:5173/onboarding/recruiter/organisation)
- Wiki: [onboarding-redesign](../onboarding-redesign.md)

Controls:

- [ ] **Log In** _(link, top bar)_ → goes to `/login` · Figma ☐
- [ ] **Request Affiliation** _(button, page)_ → disabled here · Figma ☐
- [ ] **Watch recruiter onboarding tutorial** _(button, sidebar)_ → changes something on the page · Figma ☐

Fields to try: Search organisation e.g. MTN Ghana

Notes:

### onboarding › recruiter › organisation › create

- [ ] Screen checked · URL: `/onboarding/recruiter/organisation/create` (http://localhost:5173/onboarding/recruiter/organisation/create)
- Wiki: [onboarding-redesign](../onboarding-redesign.md)

Controls:

- [ ] **Log In** _(link, top bar)_ → goes to `/login` · Figma ☐
- [ ] **Select industry** _(combobox, page)_ → opens a menu: Technology · Telecommunications · Financial services · Manufacturing · Construction · Mining · Oil & gas · Agriculture · Healthcare · Education · Hospitality · Retail · Figma ☐
- [ ] **Select size** _(combobox, page)_ → opens a menu: 11â€“50 employees · 51â€“200 employees · 201â€“500 employees · 500+ employees · Figma ☐
- [ ] **Select region** _(combobox, page)_ → opens a menu: Ahafo · Ashanti · Bono · Bono East · Central · Eastern · Greater Accra · North East · Northern · Oti · Savannah · Upper East · Figma ☐
- [ ] **Select district** _(combobox, page)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐
- [ ] **Create Organisation** _(button, page)_ → disabled here · Figma ☐
- [ ] **Watch recruiter onboarding tutorial** _(button, sidebar)_ → ⚠ nothing visible happens · Figma ☐

Fields to try: e.g. Kente Labs Ghana Limited · e.g. Kente Labs · https://

Notes:

### onboarding › recruiter › payment

- [ ] Screen checked · URL: `/onboarding/recruiter/payment` (http://localhost:5173/onboarding/recruiter/payment)
- Wiki: [onboarding-redesign](../onboarding-redesign.md), [recruiter-settings](../recruiter-settings.md)

Controls:

- [ ] **Log In** _(link, top bar)_ → ⚠ not tested, try it by hand (it could not be clicked, maybe covered by something) · Figma ☐
- [ ] **Card** _(tab, page)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐
- [ ] **Mobile Money** _(tab, page)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐
- [ ] **Pay $50.00** _(button, page)_ → disabled here · Figma ☐
- [ ] **Watch recruiter onboarding tutorial** _(button, sidebar)_ → selects / switches · Figma ☐

Fields to try: Name as shown on card · 0000 0000 0000 0000 · MM / YY · 3 digits

Notes:

### onboarding › recruiter › plan

- [ ] Screen checked · URL: `/onboarding/recruiter/plan` (http://localhost:5173/onboarding/recruiter/plan)
- Wiki: [onboarding-redesign](../onboarding-redesign.md), [recruiter-settings](../recruiter-settings.md)

<details><summary>1 documented states to open and compare with Figma</summary>

- [ ] `/onboarding/recruiter/plan?state=professional`

</details>

Controls:

- [ ] **Log In** _(link, top bar)_ → goes to `/login` · Figma ☐
- [ ] **Continue With Free** _(button, page)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐

Notes:

### onboarding › recruiter › preferences

- [ ] Screen checked · URL: `/onboarding/recruiter/preferences` (http://localhost:5173/onboarding/recruiter/preferences)
- Wiki: [onboarding-redesign](../onboarding-redesign.md)

Controls:

- [ ] **Log In** _(link, top bar)_ → goes to `/login` · Figma ☐
- [ ] **LocalGhana only** _(radio, page)_ → ⚠ not tested, try it by hand (it could not be clicked, maybe covered by something) · Figma ☐
- [ ] **InternationalOutside Ghana** _(radio, page)_ → ⚠ not tested, try it by hand (it could not be clicked, maybe covered by something) · Figma ☐
- [ ] **BothLocal + international** _(radio, page)_ → ⚠ not tested, try it by hand (it could not be clicked, maybe covered by something) · Figma ☐
- [ ] **Entry-level** _(button, page)_ → selects / switches · Figma ☐
- [ ] **Mid-level** _(button, page)_ → selects / switches · Figma ☐
- [ ] **Senior** _(button, page)_ → selects / switches · Figma ☐
- [ ] **Executive** _(button, page)_ → selects / switches · Figma ☐
- [ ] **Technology** _(button, page)_ → selects / switches · Figma ☐
- [ ] **Finance** _(button, page)_ → selects / switches · Figma ☐
- [ ] **Healthcare** _(button, page)_ → selects / switches · Figma ☐
- [ ] **Education** _(button, page)_ → selects / switches · Figma ☐
- [ ] **Manufacturing** _(button, page)_ → selects / switches · Figma ☐
- [ ] **Agriculture** _(button, page)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐
- [ ] **Hospitality** _(button, page)_ → selects / switches · Figma ☐
- [ ] **+ Other (from taxonomy)** _(button, page)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐
- [ ] **Save Preferences** _(button, page)_ → disabled here · Figma ☐
- [ ] **Watch recruiter onboarding tutorial** _(button, sidebar)_ → ⚠ nothing visible happens · Figma ☐

Notes:

### onboarding › recruiter › profile

- [ ] Screen checked · URL: `/onboarding/recruiter/profile` (http://localhost:5173/onboarding/recruiter/profile)
- Wiki: [onboarding-redesign](../onboarding-redesign.md)

Controls:

- [ ] **Log In** _(link, top bar)_ → goes to `/login` · Figma ☐
- [ ] **Show password** _(button, page)_ → selects / switches · Figma ☐
- [ ] **Show confirm password** _(button, page)_ → selects / switches · Figma ☐
- [ ] **Continue** _(button, page)_ → disabled here · Figma ☐
- [ ] **Log in Instead** _(link, page)_ → goes to `/login` · Figma ☐
- [ ] **Watch recruiter onboarding tutorial** _(button, sidebar)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐

Fields to try: Enter your full name · you@company.com · Enter phone number · Create a password · Re-enter your password

Notes:

### onboarding › recruiter › review

- [ ] Screen checked · URL: `/onboarding/recruiter/review` (http://localhost:5173/onboarding/recruiter/review)
- Wiki: [onboarding-redesign](../onboarding-redesign.md)

Controls:

- [ ] **Log In** _(link, top bar)_ → goes to `/login` · Figma ☐
- [ ] **Edit profile** _(link, page)_ → goes to `/onboarding/recruiter/profile` · Figma ☐
- [ ] **Edit Recruiter profile** _(link, page)_ → goes to `/onboarding/recruiter/profile` · Figma ☐
- [ ] **Edit Organisation** _(link, page)_ → goes to `/onboarding/recruiter/plan` · Figma ☐
- [ ] **Edit Plan & billing** _(link, page)_ → goes to `/onboarding/recruiter/plan` · Figma ☐
- [ ] **Edit Hiring preferences** _(link, page)_ → goes to `/onboarding/recruiter/preferences` · Figma ☐
- [ ] **I agree to Ghana Talent Hub's Recruiter Terms & Conditions and Privacy Policy.** _(checkbox, page)_ → selects / switches · Figma ☐
- [ ] **I'll use talent data only for genuine hiring and respect each talent's privacy settings (Data Protection Act, 2012).** _(checkbox, page)_ → selects / switches · Figma ☐
- [ ] **Accept Both To Continue** _(button, page)_ → disabled here · Figma ☐
- [ ] **Log in Instead** _(link, page)_ → goes to `/login` · Figma ☐

Notes:

### onboarding › recruiter › type

- [ ] Screen checked · URL: `/onboarding/recruiter/type` (http://localhost:5173/onboarding/recruiter/type)
- Wiki: [onboarding-redesign](../onboarding-redesign.md)

Controls:

- [ ] **Log In** _(link, top bar)_ → goes to `/login` · Figma ☐
- [ ] **DEDICATED RECRUITER I hire for one organisation. You work in-house (e.g. HR at MTN Ghana).** _(radio, page)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐
- [ ] **PROFESSIONAL / FREELANCE I recruit for clients. Talent broker or agency recruiter. Skip or** _(radio, page)_ → selects / switches · Figma ☐
- [ ] **Continue** _(button, page)_ → disabled here · Figma ☐
- [ ] **Watch recruiter onboarding tutorial** _(button, sidebar)_ → ⚠ nothing visible happens · Figma ☐

Notes:

## /profile

### profile › filling › recruiter buddy

- [ ] Screen checked · URL: `/profile/filling/recruiter-buddy` (http://localhost:5173/profile/filling/recruiter-buddy)
- ⚠ Without a signed-in session this URL redirects to `/profile/filling/career-buddy?cb=welcome`: sign in with a test account and check it by hand.

No clickable controls of its own (only shared chrome).

Notes:

## /recruiter

### recruiter › application pipeline

- [ ] Screen checked · URL: `/recruiter/application-pipeline` (http://localhost:5173/recruiter/application-pipeline)
- Wiki: [recruiter-application-pipeline](../recruiter-application-pipeline.md), [recruiter-job-prospecting](../recruiter-job-prospecting.md), [recruiter-job-screening-flow](../recruiter-job-screening-flow.md), [recruiter-settings-security](../recruiter-settings-security.md), [recruiter-talent-search](../recruiter-talent-search.md)

<details><summary>9 documented states to open and compare with Figma</summary>

- [ ] `/recruiter/application-pipeline?handoff=46`
- [ ] `/recruiter/application-pipeline?sidebar=collapsed&dropdown=job-posting&forceHover=senior-ux-designer`
- [ ] `/recruiter/application-pipeline?sidebar=collapsed&modal=cancel-interview`
- [ ] `/recruiter/application-pipeline?sidebar=collapsed&modal=schedule-confirmation`
- [ ] `/recruiter/application-pipeline?sidebar=collapsed&modal=schedule-interview`
- [ ] `/recruiter/application-pipeline?sidebar=collapsed&modal=schedule-interview&interviewers=open`
- [ ] `/recruiter/application-pipeline?sidebar=collapsed&modal=schedule-interview&state=filled&format=in-person`
- [ ] `/recruiter/application-pipeline?sidebar=collapsed&modal=schedule-interview&state=filled&format=online`
- [ ] `/recruiter/application-pipeline?sidebar=collapsed&modal=schedule-interview&state=filled&format=phone`

</details>

Controls:

- [ ] **Settings** _(link, sidebar)_ → goes to `/recruiter/settings` · Figma ☐
- [ ] **Choose Job Posting** _(combobox, page)_ → opens a menu: --None-- · Senior UX Designer — London, UK · DevOps Engineer — Ho, Ghana · Data Analyst Intern — Accra, Ghana · Figma ☐
- [ ] **Show qualified only (46)** _(switch, page)_ → changes the view `qualified=1` · Figma ☐
- [ ] **All stages 128** _(button, page)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Applied 3** _(button, page)_ → changes the view `stage=applied` · Figma ☐
- [ ] **Screening 1** _(button, page)_ → changes the view `stage=screening` · Figma ☐
- [ ] **Shortlisted 1** _(button, page)_ → changes the view `stage=shortlisted` · Figma ☐
- [ ] **Interview 3** _(button, page)_ → changes the view `stage=interview` · Figma ☐
- [ ] **Offer extended 1** _(button, page)_ → changes the view `stage=offer-extended` · Figma ☐
- [ ] **Hired 0** _(button, page)_ → changes the view `stage=hired` · Figma ☐
- [ ] **Not progressed 2** _(button, page)_ → changes the view `stage=not-progressed` · Figma ☐
- [ ] **Scroll for Hired and Not progressed** _(button, page)_ → changes the view `scroll=end` · Figma ☐
- [ ] **Select Ama Boateng** _(checkbox, page)_ → ⚠ not tested, try it by hand (it could not be clicked, maybe covered by something) · Figma ☐
- [ ] **Ama Boateng** _(button, page)_ → opens dialog “Ama Boateng” `drawer=ama-boateng` (buttons: Close candidate details · View full profile · ama.design/work · Open conversation · Not progressing · Move to Screening) · Figma ☐
- [ ] **More actions for Ama Boateng** _(button, page)_ → opens a menu: View candidate’s profile · Open application · Message Opens your conversation in Messages · Move to Screening · Move to Shortlisted · Schedule interview · Not progressing… Choose a reason and send a kind m · Figma ☐
- [ ] **Select Eleanor Fant** _(checkbox, page)_ → ⚠ not tested, try it by hand (it could not be clicked, maybe covered by something) · Figma ☐
- [ ] **Eleanor Fant** _(button, page)_ → opens dialog “Eleanor Fant” `drawer=eleanor-fant` (buttons: Close candidate details · View full profile · Not progressing · Move to Screening) · Figma ☐
- [ ] **More actions for Eleanor Fant** _(button, page)_ → opens a menu: View candidate’s profile · Open application · Message Opens your conversation in Messages · Move to Screening · Move to Shortlisted · Schedule interview · Not progressing… Choose a reason and send a kind m · Figma ☐
- [ ] **Select Marcus Thorne** _(checkbox, page)_ → ⚠ not tested, try it by hand (it could not be clicked, maybe covered by something) · Figma ☐
- [ ] **Marcus Thorne** _(button, page)_ → opens dialog “Marcus Thorne” `drawer=marcus-thorne` (buttons: Close candidate details · View full profile · Not progressing · Move to Screening) · Figma ☐
- [ ] **More actions for Marcus Thorne** _(button, page)_ → opens a menu: View candidate’s profile · Open application · Message Opens your conversation in Messages · Move to Screening · Move to Shortlisted · Schedule interview · Not progressing… Choose a reason and send a kind m · Figma ☐
- [ ] **Select Abena Owusu** _(checkbox, page)_ → ⚠ not tested, try it by hand (it could not be clicked, maybe covered by something) · Figma ☐
- [ ] **Abena Owusu** _(button, page)_ → opens dialog “Abena Owusu” `drawer=abena-owusu` (buttons: Close candidate details · View full profile · Not progressing · Move to Shortlisted) · Figma ☐
- [ ] **More actions for Abena Owusu** _(button, page)_ → opens a menu: View candidate’s profile · Open application · Message Opens your conversation in Messages · Move to Shortlisted · Schedule interview · Not progressing… Choose a reason and send a kind m · Figma ☐
- [ ] **Select Ella Mensah** _(checkbox, page)_ → ⚠ not tested, try it by hand (it could not be clicked, maybe covered by something) · Figma ☐
- [ ] **Ella Mensah** _(button, page)_ → opens dialog “Ella Mensah” `drawer=ella-mensah` (buttons: Close candidate details · View full profile · Not progressing · Move to Interview) · Figma ☐
- [ ] **Schedule Interview** _(button, page)_ → opens dialog “Schedule an Interview” `modal=schedule-interview&candidate=ella-mensah` (buttons: Close · Assessment Type · Online · Phone · In person · Add Interviewers · Month · Year · Previous days · SUN 04 · MON 05 · TUE 06 · WED 07 · THU 08 · FRI 09 · Next days · 11:30 AM · 01:00 PM · 02:00 PM · 03:30 PM · 04:00 PM · 05:30 PM · 09:00 AM · 10:00 AM · Cancel) · Figma ☐
- [ ] **More actions for Ella Mensah** _(button, page)_ → opens a menu: View candidate’s profile · Open application · Message Opens your conversation in Messages · Schedule interview · Not progressing… Choose a reason and send a kind m · Figma ☐
- [ ] **View Details** _(button, page)_ → opens dialog “Adam Sandler” `drawer=adam-sandler` (buttons: Close candidate details · View full profile · Not progressing · Move to Offer extended) · Figma ☐
- [ ] **Mark as Completed** _(button, page)_ → opens dialog “How did the interview with Elliot go?” `modal=interview-completed&candidate=elliot-whitmore` (buttons: Close dialog · Strong no · No · Yes · Strong yes · 1 of 5 · 2 of 5 · 3 of 5 · 4 of 5 · 5 of 5 · 1 of 5 · 2 of 5 · 3 of 5 · 4 of 5 · 5 of 5 · 1 of 5 · 2 of 5 · 3 of 5 · 4 of 5 · 5 of 5 · Extend offer · Another interview · Not progressing · Save for later · Save and extend offer) · Figma ☐
- [ ] **Reschedule** _(button, page)_ → opens dialog “Schedule an Interview” `modal=schedule-interview&candidate=elliot-whitmore` (buttons: Close · Assessment Type · Online · Phone · In person · Add Interviewers · Month · Year · Previous days · SUN 04 · MON 05 · TUE 06 · WED 07 · THU 08 · FRI 09 · Next days · 11:30 AM · 01:00 PM · 02:00 PM · 03:30 PM · 04:00 PM · 05:30 PM · 09:00 AM · 10:00 AM · Cancel) · Figma ☐
- [ ] **View Meeting** _(button, page)_ → opens dialog “Sarah Jenkins” `drawer=sarah-jenkins` (buttons: Close candidate details · View full profile · Not progressing · Move to Offer extended) · Figma ☐
- [ ] **Select Akosua Quansah** _(checkbox, page)_ → ⚠ not tested, try it by hand (it could not be clicked, maybe covered by something) · Figma ☐
- [ ] **Akosua Quansah** _(button, page)_ → opens dialog “Akosua Quansah” `drawer=akosua-quansah` (buttons: Close candidate details · View full profile · Not progressing) · Figma ☐
- [ ] **More actions for Akosua Quansah** _(button, page)_ → opens a menu: View candidate’s profile · Open application · Message Opens your conversation in Messages · Not progressing… Choose a reason and send a kind m · Figma ☐
- [ ] **Select Godfred Ansah** _(checkbox, page)_ → ⚠ not tested, try it by hand (it could not be clicked, maybe covered by something) · Figma ☐
- [ ] **Godfred Ansah** _(button, page)_ → opens dialog “Godfred Ansah” `drawer=godfred-ansah` (buttons: Close candidate details · View full profile · Not progressing) · Figma ☐
- [ ] **More actions for Godfred Ansah** _(button, page)_ → opens a menu: View candidate’s profile · Open application · Message Opens your conversation in Messages · Figma ☐
- [ ] **Select Kwesi Osei** _(checkbox, page)_ → ⚠ not tested, try it by hand (it could not be clicked, maybe covered by something) · Figma ☐
- [ ] **Kwesi Osei** _(button, page)_ → opens dialog “Kwesi Osei” `drawer=kwesi-osei` (buttons: Close candidate details · View full profile · Not progressing) · Figma ☐
- [ ] **More actions for Kwesi Osei** _(button, page)_ → opens a menu: View candidate’s profile · Open application · Message Opens your conversation in Messages · Figma ☐
- [ ] **Open Career Buddy** _(button, page)_ → goes to `/profile/filling/career-buddy` · Figma ☐

Fields to try: Search opportunities, skills, communities... · Search candidates in this pipeline

Notes:

### recruiter › community

- [ ] Screen checked · URL: `/recruiter/community` (http://localhost:5173/recruiter/community)
- Wiki: [recruiter-community](../recruiter-community.md), [recruiter-community-clubs](../recruiter-community-clubs.md), [recruiter-community-host](../recruiter-community-host.md), [recruiter-community-network](../recruiter-community-network.md)

<details><summary>5 documented states to open and compare with Figma</summary>

- [ ] `/recruiter/community?menu=joined&cat=software-engineering`
- [ ] `/recruiter/community?modal=milestone&rail=collapsed`
- [ ] `/recruiter/community?q=blockchain`
- [ ] `/recruiter/community?state=loading`
- [ ] `/recruiter/community?view=all`

</details>

Controls:

- [ ] **Continue setup →** _(button, sidebar)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Messages 3** _(link, sidebar)_ → goes to `/recruiter/messages` · Figma ☐
- [ ] **Clubs** _(link, navigation)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **My network 3** _(link, navigation)_ → changes the view `view=circle` · Figma ☐
- [ ] **Host a company club** _(link, page)_ → goes to `/recruiter/community/create` · Figma ☐
- [ ] **All** _(button, page)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Software engineering** _(button, page)_ → changes the view `cat=software-engineering` · Figma ☐
- [ ] **Data science** _(button, page)_ → changes the view `cat=data-science` · Figma ☐
- [ ] **Design** _(button, page)_ → changes the view `cat=design` · Figma ☐
- [ ] **Entrepreneurship** _(button, page)_ → changes the view `cat=entrepreneurship` · Figma ☐
- [ ] **STEM** _(button, page)_ → changes the view `cat=stem` · Figma ☐
- [ ] **Hackathons** _(button, page)_ → changes the view `cat=hackathons` · Figma ☐
- [ ] **Trades** _(button, page)_ → changes the view `cat=trades` · Figma ☐
- [ ] **Cybersecurity** _(button, page)_ → changes the view `cat=cybersecurity` · Figma ☐
- [ ] **Software Engineering Ghana** _(link, page)_ → goes to `/recruiter/community/software-engineering-ghana?joined=1` · Figma ☐
- [ ] **Joined, Software Engineering Ghana** _(button, page)_ → opens a menu: Open club · Mute notifications · Leave club · Figma ☐
- [ ] **Data Science Ghana** _(link, page)_ → goes to `/recruiter/community/data-science-ghana` · Figma ☐
- [ ] **Join, Data Science Ghana** _(button, page)_ → goes to `/recruiter/community/data-science-ghana?joined=1&welcome=1` · Figma ☐
- [ ] **Frontend Devs Ghana** _(link, page)_ → goes to `/recruiter/community/frontend-devs-ghana` · Figma ☐
- [ ] **Join, Frontend Devs Ghana** _(button, page)_ → goes to `/recruiter/community/frontend-devs-ghana?joined=1&welcome=1` · Figma ☐
- [ ] **STEM Girls Ghana** _(link, page)_ → goes to `/recruiter/community/stem-girls-ghana` · Figma ☐
- [ ] **Join, STEM Girls Ghana** _(button, page)_ → goes to `/recruiter/community/stem-girls-ghana?joined=1&welcome=1` · Figma ☐
- [ ] **Young Entrepreneurs Network** _(link, page)_ → goes to `/recruiter/community/young-entrepreneurs-network` · Figma ☐
- [ ] **Join, Young Entrepreneurs Network** _(button, page)_ → goes to `/recruiter/community/young-entrepreneurs-network?joined=1&welcome=1` · Figma ☐
- [ ] **Creatives & Designers Hub** _(link, page)_ → goes to `/recruiter/community/creatives-designers-hub` · Figma ☐
- [ ] **Join, Creatives & Designers Hub** _(button, page)_ → goes to `/recruiter/community/creatives-designers-hub?joined=1&welcome=1` · Figma ☐
- [ ] **Hackathons Ghana** _(link, page)_ → goes to `/recruiter/community/hackathons-ghana` · Figma ☐
- [ ] **Join, Hackathons Ghana** _(button, page)_ → goes to `/recruiter/community/hackathons-ghana?joined=1&welcome=1` · Figma ☐
- [ ] **First-Gen Scholars** _(link, page)_ → goes to `/recruiter/community/first-gen-scholars` · Figma ☐
- [ ] **Join, First-Gen Scholars** _(button, page)_ → goes to `/recruiter/community/first-gen-scholars?joined=1&welcome=1` · Figma ☐
- [ ] **Open Career Buddy** _(button, page)_ → goes to `/profile/filling/career-buddy` · Figma ☐

Fields to try: Search opportunities, skills, communities... · Search clubs

Notes:

### recruiter › community › ‹community›

- [ ] Screen checked · URL: `/recruiter/community/frontend-devs-ghana` (http://localhost:5173/recruiter/community/frontend-devs-ghana)
- Wiki: [recruiter-community-clubs](../recruiter-community-clubs.md)

<details><summary>2 documented states to open and compare with Figma</summary>

- [ ] `/recruiter/community/agritech-innovators-ghana?joined=1&state=empty&rail=collapsed`
- [ ] `/recruiter/community/frontend-devs-ghana?rail=collapsed`

</details>

Controls:

- [ ] **Continue setup →** _(button, sidebar)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Messages 3** _(link, sidebar)_ → goes to `/recruiter/messages` · Figma ☐
- [ ] **Clubs** _(link, navigation)_ → goes to `/recruiter/community` · Figma ☐
- [ ] **My network 3** _(link, navigation)_ → goes to `/recruiter/community?view=circle` · Figma ☐
- [ ] **All clubs** _(link, page)_ → goes to `/recruiter/community` · Figma ☐
- [ ] **Joined** _(button, page)_ → opens dialog “Leave #Frontend Devs Ghana?” `modal=leave` (buttons: Mute · Stay · Leave club) · Figma ☐
- [ ] **Share club** _(button, page)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Feed** _(tab, page)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **About** _(tab, page)_ → changes the view `tab=about` · Figma ☐
- [ ] **Members, 1,240** _(tab, page)_ → changes the view `tab=members` · Figma ☐
- [ ] **Events, 2** _(tab, page)_ → disabled here · Figma ☐
- [ ] **All** _(button, page)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Hiring** _(button, page)_ → selects / switches · Figma ☐
- [ ] **Updates** _(button, page)_ → selects / switches · Figma ☐
- [ ] **Questions** _(button, page)_ → selects / switches · Figma ☐
- [ ] **Resources** _(button, page)_ → selects / switches · Figma ☐
- [ ] **Share a role, a hiring update or an event…** _(button, page)_ → opens dialog “Create a post” `modal=create` (buttons: Close · Update · Case study · Question · Resource · Help me write it · Remove #PortfolioWeekend · Remove #ReactGh · + tag · Add photos or a screen recording Drag & drop or browse · PNG · Remove link · + Add link · Cancel · Post) · Figma ☐
- [ ] **Voice note** _(button, page)_ → opens dialog “Create a post” `modal=create` (buttons: Close · Update · Case study · Question · Resource · Help me write it · Remove #PortfolioWeekend · Remove #ReactGh · + tag · Add photos or a screen recording Drag & drop or browse · PNG · Remove link · + Add link · Cancel · Post) · Figma ☐
- [ ] **Voice message** _(button, page)_ → opens dialog “Create a post” `modal=create` (buttons: Close · Update · Case study · Question · Resource · Help me write it · Remove #PortfolioWeekend · Remove #ReactGh · + tag · Add photos or a screen recording Drag & drop or browse · PNG · Remove link · + Add link · Cancel · Post) · Figma ☐
- [ ] **Event** _(button, page)_ → opens dialog “Create a post” `modal=create` (buttons: Close · Update · Case study · Question · Resource · Help me write it · Remove #PortfolioWeekend · Remove #ReactGh · + tag · Add photos or a screen recording Drag & drop or browse · PNG · Remove link · + Add link · Cancel · Post) · Figma ☐
- [ ] **Share a role** _(button, page)_ → opens dialog “Create a post” `modal=create` (buttons: Close · Update · Case study · Question · Resource · Help me write it · Remove #PortfolioWeekend · Remove #ReactGh · + tag · Add photos or a screen recording Drag & drop or browse · PNG · Remove link · + Add link · Cancel · Post) · Figma ☐
- [ ] **Hiring update** _(button, page)_ → opens dialog “Create a post” `modal=create` (buttons: Close · Update · Case study · Question · Resource · Help me write it · Remove #PortfolioWeekend · Remove #ReactGh · + tag · Add photos or a screen recording Drag & drop or browse · PNG · Remove link · + Add link · Cancel · Post) · Figma ☐
- [ ] **More options** _(button, top bar, 2 on screen)_ → opens dialog “Report this post” `modal=report` (buttons: Close · Spam or scam. Fake jobs, pay-to-apply, phishing links · Harassment or hate. Targeting a person or group · Misleading or false. Fake credentials or claims · Inappropriate content. Not safe for a career club · Something else. Tell us more below · Cancel · Submit report) · Figma ☐
- [ ] **(no label)** _(button, page, 3 on screen)_ → goes to `/recruiter/community/frontend-devs-ghana/post/samuel-hydration-bug` · Figma ☐
- [ ] **Like** _(button, page, 2 on screen)_ → selects / switches · Figma ☐
- [ ] **Dislike** _(button, page, 2 on screen)_ → selects / switches · Figma ☐
- [ ] **Comments** _(button, page, 2 on screen)_ → goes to `/recruiter/community/frontend-devs-ghana/post/samuel-hydration-bug` · Figma ☐
- [ ] **Save** _(button, page, 2 on screen)_ → selects / switches · Figma ☐
- [ ] **Share** _(button, page, 2 on screen)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **#ReactGh** _(link, sidebar)_ → goes to `/recruiter/community?q=%23ReactGh` · Figma ☐
- [ ] **#FrontendJobsGh** _(link, sidebar)_ → goes to `/recruiter/community?q=%23FrontendJobsGh` · Figma ☐
- [ ] **#NextJS** _(link, sidebar)_ → goes to `/recruiter/community?q=%23NextJS` · Figma ☐
- [ ] **#PortfolioWeekend** _(link, sidebar)_ → goes to `/recruiter/community?q=%23PortfolioWeekend` · Figma ☐
- [ ] **#ShipItFriday** _(link, sidebar)_ → goes to `/recruiter/community?q=%23ShipItFriday` · Figma ☐
- [ ] **#TypeScriptWins** _(link, sidebar)_ → goes to `/recruiter/community?q=%23TypeScriptWins` · Figma ☐
- [ ] **#CSSIsHard** _(link, sidebar)_ → goes to `/recruiter/community?q=%23CSSIsHard` · Figma ☐
- [ ] **#InterviewPrepGh** _(link, sidebar)_ → goes to `/recruiter/community?q=%23InterviewPrepGh` · Figma ☐
- [ ] **Software Engineering Ghana 2,400 members** _(link, sidebar)_ → goes to `/recruiter/community/software-engineering-ghana` · Figma ☐
- [ ] **Hackathons Ghana 380 members** _(link, sidebar)_ → goes to `/recruiter/community/hackathons-ghana?joined=1` · Figma ☐
- [ ] **Data Science Ghana 890 members** _(link, sidebar)_ → goes to `/recruiter/community/data-science-ghana?joined=1` · Figma ☐
- [ ] **Open Career Buddy** _(button, page)_ → goes to `/profile/filling/career-buddy` · Figma ☐

Fields to try: Search opportunities, skills, communities...

Notes:

### recruiter › community › ‹community› › manage

- [ ] Screen checked · URL: `/recruiter/community/agritech-innovators-ghana/manage` (http://localhost:5173/recruiter/community/agritech-innovators-ghana/manage)
- ⚠ Without a signed-in session this URL redirects to `/recruiter/community`: sign in with a test account and check it by hand.
- Wiki: [recruiter-community-host](../recruiter-community-host.md)

No clickable controls of its own (only shared chrome).

Notes:

### recruiter › community › ‹community› › post › ‹post›

- [ ] Screen checked · URL: `/recruiter/community/:communityId/post/:postId` (needs a real id: open it from a link in this area)
- Needs a real id: reach it from a link on another screen of this phase.

No clickable controls of its own (only shared chrome).

Notes:

### recruiter › community › create

- [ ] Screen checked · URL: `/recruiter/community/create` (http://localhost:5173/recruiter/community/create)
- Wiki: [recruiter-community-clubs](../recruiter-community-clubs.md), [recruiter-community-host](../recruiter-community-host.md)

<details><summary>2 documented states to open and compare with Figma</summary>

- [ ] `/recruiter/community/create?cat=software-engineering&step=basics&demo=1`
- [ ] `/recruiter/community/create?state=not-ready&cat=software-engineering`

</details>

Controls:

- [ ] **Close** _(button, dialog)_ → goes to `/recruiter/community` · Figma ☐
- [ ] **Software engineering** _(radio, dialog)_ → selects / switches · Figma ☐
- [ ] **Data science** _(radio, dialog)_ → selects / switches · Figma ☐
- [ ] **Design** _(radio, dialog)_ → selects / switches · Figma ☐
- [ ] **Agriculture** _(radio, dialog)_ → selects / switches · Figma ☐
- [ ] **Entrepreneurship** _(radio, dialog)_ → selects / switches · Figma ☐
- [ ] **STEM** _(radio, dialog)_ → selects / switches · Figma ☐
- [ ] **Trades** _(radio, dialog)_ → selects / switches · Figma ☐
- [ ] **Health** _(radio, dialog)_ → selects / switches · Figma ☐
- [ ] **Add a cover photo** _(button, dialog)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Cancel** _(button, dialog)_ → goes to `/recruiter/community` · Figma ☐
- [ ] **Next: who can join** _(button, dialog)_ → disabled here · Figma ☐

Fields to try: text · textarea

Notes:

### recruiter › community › people › ‹person›

- [ ] Screen checked · URL: `/recruiter/community/people/:personId` (needs a real id: open it from a link in this area)
- Needs a real id: reach it from a link on another screen of this phase.

No clickable controls of its own (only shared chrome).

Notes:

### recruiter › help

- [ ] Screen checked · URL: `/recruiter/help` (http://localhost:5173/recruiter/help)
- Wiki: [recruiter-settings](../recruiter-settings.md), [recruiter-settings-help](../recruiter-settings-help.md)

<details><summary>4 documented states to open and compare with Figma</summary>

- [ ] `/recruiter/help?help=article`
- [ ] `/recruiter/help?help=contact`
- [ ] `/recruiter/help?help=report`
- [ ] `/recruiter/help?help=sent`

</details>

Controls:

- [ ] **Your recruiter profile. Photo, title, company page** _(button, page)_ → opens dialog “Help” `help=page` (buttons: Close help · How do I close or pause a posting? · How does Apply & Filter Pool work? · How do I add a teammate to a job? · A candidate asked me to pay or sent a strange link. What do · How do invites and InMails work? · How do I save screening criteria as a template? · Ask Hiring Assistant · WhatsApp us · Replay the recruiter tour · Open keyboard shortcuts · Help centre) · Figma ☐
- [ ] **Job Postings. Templates, screening, closing jobs** _(button, page)_ → opens dialog “Help” `help=page` (buttons: Close help · How do I close or pause a posting? · How does Apply & Filter Pool work? · How do I add a teammate to a job? · A candidate asked me to pay or sent a strange link. What do · How do invites and InMails work? · How do I save screening criteria as a template? · Ask Hiring Assistant · WhatsApp us · Replay the recruiter tour · Open keyboard shortcuts · Help centre) · Figma ☐
- [ ] **Pipeline and candidates. Stages, interviews, offers** _(button, page)_ → opens dialog “Help” `help=page` (buttons: Close help · How do I close or pause a posting? · How does Apply & Filter Pool work? · How do I add a teammate to a job? · A candidate asked me to pay or sent a strange link. What do · How do invites and InMails work? · How do I save screening criteria as a template? · Ask Hiring Assistant · WhatsApp us · Replay the recruiter tour · Open keyboard shortcuts · Help centre) · Figma ☐
- [ ] **Messages. Candidates, reporting, safety** _(button, page)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐
- [ ] **Hiring under-18s and NSS. Parent consent, internship rules** _(button, page)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐
- [ ] **Account and security. Password, 2-step, devices** _(button, page)_ → opens dialog “Help” `help=page` (buttons: Close help · How do I close or pause a posting? · How does Apply & Filter Pool work? · How do I add a teammate to a job? · A candidate asked me to pay or sent a strange link. What do · How do invites and InMails work? · How do I save screening criteria as a template? · Ask Hiring Assistant · WhatsApp us · Replay the recruiter tour · Open keyboard shortcuts · Help centre) · Figma ☐
- [ ] **Why can’t I see a candidate’s match score?** _(button, page)_ → collapses / closes · Figma ☐
- [ ] **How do I add a teammate to a job?** _(button, page)_ → opens dialog “Help” `help=searching&q=How do I add a teammate to a job?` (buttons: Close help · How do I add a teammate to a job? · Ask Hiring Assistant · Replay the recruiter tour · Open keyboard shortcuts · Help centre) · Figma ☐
- [ ] **A candidate asked me to pay or sent a strange link. What do I do?** _(button, page)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐
- [ ] **How do invites and InMails work?** _(button, page)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐
- [ ] **Report a problem** _(button, page)_ → opens dialog “Report a problem” `help=report` (buttons: Asked me to pay money · Asked for my MoMo PIN or password · Fake profile or documents · Harassment or unsafe messages · Something else · Cancel · Send report) · Figma ☐
- [ ] **Ask Hiring Assistant Instant answers, any time** _(button, page)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **WhatsApp support Weekdays 8 am to 6 pm** _(button, page)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Email us Reply within 1 working day** _(button, page)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Call us 030 222 0000 · toll free** _(link, page)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **KYB documents still in review #GTH-2291 · 2 days ago Answered** _(button, page)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Open Career Buddy** _(button, page)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐

Fields to try: Search opportunities, skills, communities... · Search help

Notes:

### recruiter › home

- [ ] Screen checked · URL: `/recruiter/home` (http://localhost:5173/recruiter/home)
- Wiki: [onboarding-redesign](../onboarding-redesign.md), [recruiter-application-pipeline](../recruiter-application-pipeline.md), [recruiter-community-network](../recruiter-community-network.md), [recruiter-dashboard](../recruiter-dashboard.md), [recruiter-design-system-gaps](../recruiter-design-system-gaps.md), [recruiter-figma-pages-map](../recruiter-figma-pages-map.md), [recruiter-job-prospecting](../recruiter-job-prospecting.md), [recruiter-settings](../recruiter-settings.md)

<details><summary>5 documented states to open and compare with Figma</summary>

- [ ] `/recruiter/home?view=setup`
- [ ] `/recruiter/home?view=setup&user=existing&actionsMenu=arthur-blair`
- [ ] `/recruiter/home?view=setup&user=existing&actionsMenu=elena-sterling&hoveredAction=mark-as-accepted`
- [ ] `/recruiter/home?view=setup&user=existing&actionsMenu=leila-wong`
- [ ] `/recruiter/home?view=setup&user=existing&actionsMenu=marcus-jensen`

</details>

Controls:

- [ ] **Recruiting on behalf of MTN Ghana** _(button, top bar)_ → opens a menu: MTN Ghana Recruiter · Enterprise plan · Hubtel Ltd Recruiter · Professional plan · Zeepay Ghana Ltd Awaiting Primary Admin approval P · Personal · Freelance Post jobs under your own name · Request affiliation with an organisation · Figma ☐
- [ ] **Search talents** _(button, page)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Post new opportunity** _(button, page)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Edit profile** _(button, page)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Customize** _(button, page)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Sort job postings** _(button, top bar)_ → opens a menu: Urgent first Deadline within 7 days · Most recent Newest publish date · Most applicants Highest applicant count · Figma ☐
- [ ] **View all** _(link, top bar)_ → goes to `/recruiter/job-postings` · Figma ☐
- [ ] **More actions for Junior Accountant** _(button, page)_ → opens a menu: View job · Edit · Pause Hide from talents · Close job · Figma ☐
- [ ] **More actions for Marketing Intern** _(button, page)_ → opens a menu: View job · Edit · Pause Hide from talents · Close job · Figma ☐
- [ ] **More actions for Data Analyst** _(button, page)_ → opens a menu: View job · Edit · Pause Hide from talents · Close job · Figma ☐
- [ ] **More actions for Customer Service Trainee** _(button, page)_ → opens a menu: View job · Edit · Pause Hide from talents · Close job · Figma ☐
- [ ] **Upload missing documents** _(button, page)_ → opens dialog “Upload KYB documents” `dialog=upload&step=choose` (buttons: Close dialog · TIN certificate · Cancel · Upload) · Figma ☐
- [ ] **Filter pipeline by opportunity** _(button, top bar)_ → opens a menu: All opportunities 45 candidates · Junior Accountant 12 candidates · Marketing Intern 45 candidates · Data Analyst 31 candidates · Customer Service Trainee 22 candidates · Figma ☐
- [ ] **7d** _(button, top bar)_ → changes the view `window=7d` · Figma ☐
- [ ] **30d** _(button, top bar)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **90d** _(button, top bar)_ → changes the view `window=90d` · Figma ☐
- [ ] **Applied: 45 candidates** _(button, page)_ → opens dialog “Applied · 8 candidates” `stage=applied` (buttons: Close drawer · All · 8 · Scheduled · 5 · Interviewed · 3 · ES Elena Sterling Junior Accountant Interviewed Oct 10 · AS Adam Sandler Senior UX Designer Scheduled · Tue Oct 21, 2 · EW Elliot Whitmore Data Analyst Scheduled · Wed Oct 22, 10:0 · SJ Sarah Jenkins Data Analyst Interviewed Oct 8 · KB Kofi Boateng Junior Accountant Scheduled · Thu Oct 23, 11 · Open in Application Pipeline) · Figma ☐
- [ ] **Screening: 22 candidates** _(button, page)_ → opens dialog “Screening · 8 candidates” `stage=screening` (buttons: Close drawer · All · 8 · Scheduled · 5 · Interviewed · 3 · ES Elena Sterling Junior Accountant Interviewed Oct 10 · AS Adam Sandler Senior UX Designer Scheduled · Tue Oct 21, 2 · EW Elliot Whitmore Data Analyst Scheduled · Wed Oct 22, 10:0 · SJ Sarah Jenkins Data Analyst Interviewed Oct 8 · KB Kofi Boateng Junior Accountant Scheduled · Thu Oct 23, 11 · Open in Application Pipeline) · Figma ☐
- [ ] **Shortlisted: 12 candidates** _(button, page)_ → opens dialog “Shortlisted · 8 candidates” `stage=shortlisted` (buttons: Close drawer · All · 8 · Scheduled · 5 · Interviewed · 3 · ES Elena Sterling Junior Accountant Interviewed Oct 10 · AS Adam Sandler Senior UX Designer Scheduled · Tue Oct 21, 2 · EW Elliot Whitmore Data Analyst Scheduled · Wed Oct 22, 10:0 · SJ Sarah Jenkins Data Analyst Interviewed Oct 8 · KB Kofi Boateng Junior Accountant Scheduled · Thu Oct 23, 11 · Open in Application Pipeline) · Figma ☐
- [ ] **Interview: 8 candidates** _(button, page)_ → opens dialog “Interview · 8 candidates” `stage=interview` (buttons: Close drawer · All · 8 · Scheduled · 5 · Interviewed · 3 · ES Elena Sterling Junior Accountant Interviewed Oct 10 · AS Adam Sandler Senior UX Designer Scheduled · Tue Oct 21, 2 · EW Elliot Whitmore Data Analyst Scheduled · Wed Oct 22, 10:0 · SJ Sarah Jenkins Data Analyst Interviewed Oct 8 · KB Kofi Boateng Junior Accountant Scheduled · Thu Oct 23, 11 · Open in Application Pipeline) · Figma ☐
- [ ] **Offer extended: 2 candidates** _(button, page)_ → opens dialog “Offer extended · 8 candidates” `stage=offer` (buttons: Close drawer · All · 8 · Scheduled · 5 · Interviewed · 3 · ES Elena Sterling Junior Accountant Interviewed Oct 10 · AS Adam Sandler Senior UX Designer Scheduled · Tue Oct 21, 2 · EW Elliot Whitmore Data Analyst Scheduled · Wed Oct 22, 10:0 · SJ Sarah Jenkins Data Analyst Interviewed Oct 8 · KB Kofi Boateng Junior Accountant Scheduled · Thu Oct 23, 11 · Open in Application Pipeline) · Figma ☐
- [ ] **Accepted: 1 candidates** _(button, page)_ → opens dialog “Accepted · 8 candidates” `stage=accepted` (buttons: Close drawer · All · 8 · Scheduled · 5 · Interviewed · 3 · ES Elena Sterling Junior Accountant Interviewed Oct 10 · AS Adam Sandler Senior UX Designer Scheduled · Tue Oct 21, 2 · EW Elliot Whitmore Data Analyst Scheduled · Wed Oct 22, 10:0 · SJ Sarah Jenkins Data Analyst Interviewed Oct 8 · KB Kofi Boateng Junior Accountant Scheduled · Thu Oct 23, 11 · Open in Application Pipeline) · Figma ☐
- [ ] **View all feedback** _(link, top bar)_ → goes to `/recruiter/application-pipeline` · Figma ☐
- [ ] **Give feedback · 3** _(tab, page)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **My feedback · 4.5 ★** _(tab, page)_ → changes the view `feedback=mine` · Figma ☐
- [ ] **Leave feedback** _(button, page, 3 on screen)_ → opens dialog “Feedback for Elena Sterling” `dialog=feedback&candidate=elena` (buttons: Close dialog · 1 star · 2 stars · 3 stars · 4 stars · 5 stars · Needs work · Good · Strong · Needs work · Good · Strong · Needs work · Good · Strong · Cancel · Submit feedback) · Figma ☐
- [ ] **Filter recommended talents by job** _(button, top bar)_ → opens a menu: All open roles 19 matches · Junior Accountant 5 matches · Marketing Intern 5 matches · Data Analyst 4 matches · Customer Service Trainee 5 matches · training · Figma ☐
- [ ] **See all matches** _(link, top bar)_ → goes to `/recruiter/talent-search` ⚠ page looks empty · Figma ☐
- [ ] **Save Akua Mensah** _(button, page)_ → changes the view `saved=akua&toast=saved` · Figma ☐
- [ ] **View** _(button, page, 5 on screen)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Invite** _(button, page, 5 on screen)_ → opens dialog “Invite Akua Mensah to apply” `dialog=invite&talent=akua` (buttons: Close dialog · Cancel · Send invite) · Figma ☐
- [ ] **Save Kofi Boateng** _(button, page)_ → changes the view `saved=kofi&toast=saved` · Figma ☐
- [ ] **Why is this identity hidden?** _(button, page)_ → changes the view `hint=hidden` · Figma ☐
- [ ] **Save Talent #4821** _(button, page)_ → changes the view `saved=hidden&toast=saved` · Figma ☐
- [ ] **Save Ama Serwaa** _(button, page)_ → changes the view `saved=ama&toast=saved` · Figma ☐
- [ ] **Save Yaw Darko** _(button, page)_ → changes the view `saved=yaw&toast=saved` · Figma ☐
- [ ] **Region** _(button, top bar)_ → opens a menu: Ghana · National All regions · Greater Accra Your region · Ashanti · Western · Central · Eastern · Northern · Upper West Low data · Figma ☐
- [ ] **Industry** _(button, top bar)_ → opens a menu: All industries · Technology · Finance · Healthcare · Education · Manufacturing · Agriculture · Hospitality · Figma ☐
- [ ] **Open Career Buddy** _(button, page)_ → goes to `/profile/filling/career-buddy` · Figma ☐

Fields to try: Search opportunities, skills, communities...

Notes:

### recruiter › job postings

- [ ] Screen checked · URL: `/recruiter/job-postings` (http://localhost:5173/recruiter/job-postings)
- Wiki: [recruiter-job-postings](../recruiter-job-postings.md), [recruiter-job-prospecting](../recruiter-job-prospecting.md), [recruiter-settings](../recruiter-settings.md), [recruiter-settings-help](../recruiter-settings-help.md)

<details><summary>15 documented states to open and compare with Figma</summary>

- [ ] `/recruiter/job-postings?help=none&q=bulk%20reject`
- [ ] `/recruiter/job-postings?help=page`
- [ ] `/recruiter/job-postings?help=searching&q=fee`
- [ ] `/recruiter/job-postings?help=shortcuts`
- [ ] `/recruiter/job-postings?menu=senior-ux-designer`
- [ ] `/recruiter/job-postings?menu=senior-ux-designer&menuItem=duplicate`
- [ ] `/recruiter/job-postings?menu=senior-ux-designer&menuKind=manage`
- [ ] `/recruiter/job-postings?modal=close-posting&posting=senior-ux-designer`
- [ ] `/recruiter/job-postings?modal=feedback`
- [ ] `/recruiter/job-postings?modal=invite`
- [ ] `/recruiter/job-postings?modal=published`
- [ ] `/recruiter/job-postings?modal=save-template&posting=senior-ux-designer`
- [ ] `/recruiter/job-postings?status=draft`
- [ ] `/recruiter/job-postings?toast=published`
- [ ] `/recruiter/job-postings?toast=published&modal=published`

</details>

Controls:

- [ ] **Your Postings** _(link, page)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Templates** _(link, page)_ → goes to `/recruiter/job-templates` · Figma ☐
- [ ] **Screening Criteria** _(link, page)_ → goes to `/recruiter/job-screening` · Figma ☐
- [ ] **All (5)** _(button, page)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Active** _(button, page)_ → changes the view `status=active` · Figma ☐
- [ ] **Draft** _(button, page)_ → changes the view `status=draft` · Figma ☐
- [ ] **Closed** _(button, page)_ → changes the view `status=closed` · Figma ☐
- [ ] **Create Post** _(button, page)_ → goes to `/recruiter/job-postings/new` · Figma ☐
- [ ] **Options for Senior UX Designer** _(button, page)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐
- [ ] **View Pipeline** _(button, page)_ → goes to `/recruiter/application-pipeline` · Figma ☐
- [ ] **Options for DevOps Engineer** _(button, page)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐
- [ ] **Continue Editing** _(button, page)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐
- [ ] **Options for Data Analyst Intern** _(button, page)_ → opens a menu: Edit Posting · Duplicate · Close posting · Figma ☐
- [ ] **View Summary** _(button, page)_ → goes to `/recruiter/application-pipeline` · Figma ☐
- [ ] **Open Career Buddy** _(button, page)_ → goes to `/profile/filling/career-buddy` · Figma ☐

Fields to try: Search opportunities, skills, communities... · Search your postings...

Notes:

### recruiter › job postings › ‹posting›

- [ ] Screen checked · URL: `/recruiter/job-postings/senior-ux-designer` (http://localhost:5173/recruiter/job-postings/senior-ux-designer)
- Wiki: [recruiter-job-postings](../recruiter-job-postings.md)

<details><summary>1 documented states to open and compare with Figma</summary>

- [ ] `/recruiter/job-postings/senior-ux-designer?saved=1`

</details>

Controls:

- [ ] **Back to Job Postings** _(link, page)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐
- [ ] **Edit posting** _(button, page)_ → goes to `/recruiter/job-postings/senior-ux-designer/edit` · Figma ☐
- [ ] **Edit screening** _(button, page)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐
- [ ] **Open pipeline** _(button, sidebar)_ → goes to `/recruiter/application-pipeline` · Figma ☐
- [ ] **Review screening results** _(button, sidebar)_ → goes to `/recruiter/job-screening` · Figma ☐
- [ ] **Copy** _(button, sidebar)_ → changes something on the page · Figma ☐
- [ ] **Open Career Buddy** _(button, page)_ → goes to `/profile/filling/career-buddy` · Figma ☐

Fields to try: Search opportunities, skills, communities...

Notes:

### recruiter › job postings › ‹posting› › edit

- [ ] Screen checked · URL: `/recruiter/job-postings/senior-ux-designer/edit` (http://localhost:5173/recruiter/job-postings/senior-ux-designer/edit)
- Wiki: [recruiter-job-postings](../recruiter-job-postings.md)

Controls:

- [ ] **Back to posting** _(link, page)_ → goes to `/recruiter/job-postings/senior-ux-designer` · Figma ☐
- [ ] **Design** _(button, page)_ → opens a menu: Design · Engineering · Marketing · Operations · Finance · Figma ☐
- [ ] **Full-time** _(button, page)_ → opens a menu: Full-time · Part-time · Contract Fixed term, set an end date · Internship Opens to students and recent graduates · National Service (NSS) For NSS-posted graduates · Apprenticeship · Figma ☐
- [ ] **Senior (5+ yrs)** _(button, page)_ → opens a menu: Entry-level (0–2 yrs) · Mid-level (2–5 yrs) · Senior (5+ yrs) · Lead / Manager · Figma ☐
- [ ] **On-site** _(radio, page)_ → selects / switches · Figma ☐
- [ ] **Hybrid** _(radio, page)_ → selects / switches · Figma ☐
- [ ] **Remote** _(radio, page)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Yearly salary (GBP)** _(button, page)_ → opens a menu: Monthly salary · Yearly salary (GBP) · Hourly rate · Stipend · Unpaid · Figma ☐
- [ ] **Show pay range on the postingChanged from GBP 50,000–60,000** _(checkbox, page)_ → ⚠ not tested, try it by hand (it could not be clicked, maybe covered by something) · Figma ☐
- [ ] **Remove Figma** _(button, page)_ → changes something on the page · Figma ☐
- [ ] **Remove Design systems** _(button, page)_ → changes something on the page · Figma ☐
- [ ] **Remove User research** _(button, page)_ → changes something on the page · Figma ☐
- [ ] **Remove Prototyping** _(button, page)_ → changes something on the page · Figma ☐
- [ ] **Remove Accessibility** _(button, page)_ → changes something on the page · Figma ☐
- [ ] **Remove Stakeholder management** _(button, page)_ → changes something on the page · Figma ☐
- [ ] **Senior design screening** _(button, page)_ → opens a menu: Product Designer screening 2–5 yrs · Figma, Protot · Senior design screening Saved by you · 5+ yrs · po · Graduate intake screening Saved by Akua M. · BSc · · Create new criteria · No screening · review everyone yourself · Figma ☐
- [ ] **Send applicants an automatic confirmation messageThey get it in Messages as soon as they apply.** _(checkbox, page)_ → ⚠ not tested, try it by hand (it could not be clicked, maybe covered by something) · Figma ☐
- [ ] **Let talent apply with their GTH profile (no CV needed)** _(checkbox, page)_ → ⚠ not tested, try it by hand (it could not be clicked, maybe covered by something) · Figma ☐
- [ ] **Accept applications from talent under 18Only for internships and training programmes. Parent consent is checked automatically.** _(checkbox, page)_ → ⚠ not tested, try it by hand (it could not be clicked, maybe covered by something) · Figma ☐
- [ ] **Save changes** _(button, sidebar)_ → opens dialog “Save changes to a live posting?” `modal=confirm` (buttons: Keep editing · Save changes) · Figma ☐
- [ ] **Cancel** _(button, sidebar)_ → goes to `/recruiter/job-postings/senior-ux-designer` · Figma ☐
- [ ] **Open Career Buddy** _(button, page)_ → goes to `/profile/filling/career-buddy` · Figma ☐

Fields to try: Search opportunities, skills, communities... · e.g. Junior Frontend Developer · Search a city or area · text · What will this person do, and why does it matter? · Add 3–6 short points, one per line · Search skills, e.g. Motion design · DD / MM / YYYY

Notes:

### recruiter › job postings › new

- [ ] Screen checked · URL: `/recruiter/job-postings/new` (http://localhost:5173/recruiter/job-postings/new)
- Wiki: [recruiter-job-postings](../recruiter-job-postings.md)

<details><summary>1 documented states to open and compare with Figma</summary>

- [ ] `/recruiter/job-postings/new?template=product-designer`

</details>

Controls:

- [ ] **Back to templates** _(link, page)_ → goes to `/recruiter/job-templates` · Figma ☐
- [ ] **Select** _(button, page, 4 on screen)_ → opens a menu: Design · Engineering · Marketing · Operations · Finance · Figma ☐
- [ ] **On-site** _(radio, page)_ → selects / switches · Figma ☐
- [ ] **Hybrid** _(radio, page)_ → selects / switches · Figma ☐
- [ ] **Remote** _(radio, page)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐
- [ ] **Show pay range on the postingYou can choose “Unpaid” or “Stipend” as the pay type for internships.** _(checkbox, page)_ → ⚠ not tested, try it by hand (it could not be clicked, maybe covered by something) · Figma ☐
- [ ] **Choose screening criteria** _(button, page)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐
- [ ] **Send applicants an automatic confirmation messageThey get it in Messages as soon as they apply.** _(checkbox, page)_ → ⚠ not tested, try it by hand (it could not be clicked, maybe covered by something) · Figma ☐
- [ ] **Let talent apply with their GTH profile (no CV needed)** _(checkbox, page)_ → ⚠ not tested, try it by hand (it could not be clicked, maybe covered by something) · Figma ☐
- [ ] **Accept applications from talent under 18Only for internships and training programmes. Parent consent is checked automatically.** _(checkbox, page)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐
- [ ] **Publish job** _(button, sidebar)_ → changes the view `state=errors` · Figma ☐
- [ ] **Preview** _(button, sidebar)_ → goes to `/recruiter/job-postings/new/preview` · Figma ☐
- [ ] **Save as draft** _(button, sidebar)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐
- [ ] **Open Career Buddy** _(button, page)_ → goes to `/profile/filling/career-buddy` ⚠ page looks empty · Figma ☐

Fields to try: Search opportunities, skills, communities... · e.g. Junior Frontend Developer · Search a city or area · text · What will this person do, and why does it matter? · Add 3–6 short points, one per line · Search skills, e.g. Motion design · DD / MM / YYYY

Notes:

### recruiter › job postings › new › preview

- [ ] Screen checked · URL: `/recruiter/job-postings/new/preview` (http://localhost:5173/recruiter/job-postings/new/preview)
- Wiki: [recruiter-job-postings](../recruiter-job-postings.md)

Controls:

- [ ] **Back to edit** _(link, page)_ → goes to `/recruiter/job-postings/new?template=product-designer` · Figma ☐
- [ ] **Apply with my GTH profile** _(button, page)_ → disabled here · Figma ☐
- [ ] **Save for later** _(button, page)_ → disabled here · Figma ☐
- [ ] **Back to edit** _(button, page)_ → goes to `/recruiter/job-postings/new?template=product-designer` · Figma ☐
- [ ] **Publish job** _(button, page)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐
- [ ] **Open Career Buddy** _(button, page)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐

Fields to try: Search opportunities, skills, communities...

Notes:

### recruiter › job screening

- [ ] Screen checked · URL: `/recruiter/job-screening` (http://localhost:5173/recruiter/job-screening)
- Wiki: [recruiter-job-prospecting](../recruiter-job-prospecting.md), [recruiter-job-screening-flow](../recruiter-job-screening-flow.md)

<details><summary>3 documented states to open and compare with Figma</summary>

- [ ] `/recruiter/job-screening?dropdown=experience&dropdownItem=2-5`
- [ ] `/recruiter/job-screening?job=product-designer&results=waiting`
- [ ] `/recruiter/job-screening?job=senior-ux-designer`

</details>

Controls:

- [ ] **Your Postings** _(link, page)_ → goes to `/recruiter/job-postings` · Figma ☐
- [ ] **Templates** _(link, page)_ → goes to `/recruiter/job-templates` · Figma ☐
- [ ] **Screening Criteria** _(link, page)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Senior UX Designer — London, UK** _(button, page)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **10+ Years** _(button, page)_ → changes the view `dropdown=experience` · Figma ☐
- [ ] **Minimum Experience** _(switch, page)_ → selects / switches · Figma ☐
- [ ] **+ Add Skill** _(button, page)_ → opens dialog “Add skill” `job=senior-ux-designer&skillSearch=` (buttons: Prototyping Listed in Senior UX Designer · Accessibility Listed in Senior UX Designer · Product thinking Common in senior design roles · Interaction design) · Figma ☐
- [ ] **Required Skills Match** _(switch, page)_ → selects / switches · Figma ☐
- [ ] **Education Level** _(switch, page)_ → selects / switches · Figma ☐
- [ ] **Apply & Filter Pool** _(button, page)_ → opens dialog “Screening 128 applicants…” `job=senior-ux-designer&run=processing` · Figma ☐
- [ ] **Save as Template** _(button, page)_ → opens dialog “Save screening criteria” `job=senior-ux-designer&modal=save-template` (buttons: Close dialog · Design roles · Cancel · Save criteria) · Figma ☐
- [ ] **Assessment Score** _(switch, page)_ → selects / switches · Figma ☐
- [ ] **Location Match** _(switch, page)_ → selects / switches · Figma ☐
- [ ] **Open Career Buddy** _(button, page)_ → goes to `/profile/filling/career-buddy` · Figma ☐

Fields to try: Search opportunities, skills, communities...

Notes:

### recruiter › job templates

- [ ] Screen checked · URL: `/recruiter/job-templates` (http://localhost:5173/recruiter/job-templates)
- Wiki: [recruiter-job-postings](../recruiter-job-postings.md), [recruiter-job-prospecting](../recruiter-job-prospecting.md), [recruiter-job-screening-flow](../recruiter-job-screening-flow.md)

<details><summary>6 documented states to open and compare with Figma</summary>

- [ ] `/recruiter/job-templates?category=design`
- [ ] `/recruiter/job-templates?mine=1&menu=junior-frontend-developer`
- [ ] `/recruiter/job-templates?mine=1&toast=copied`
- [ ] `/recruiter/job-templates?mine=1&toast=saved`
- [ ] `/recruiter/job-templates?modal=details&template=product-designer`
- [ ] `/recruiter/job-templates?view=screening`

</details>

Controls:

- [ ] **Your Postings** _(link, page)_ → goes to `/recruiter/job-postings` · Figma ☐
- [ ] **Templates** _(link, page)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Screening Criteria** _(link, page)_ → goes to `/recruiter/job-screening` · Figma ☐
- [ ] **All** _(button, page)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **My templates 1** _(button, page)_ → changes the view `mine=1` · Figma ☐
- [ ] **Screening criteria 3** _(button, page)_ → changes the view `view=screening` · Figma ☐
- [ ] **Technology** _(button, page)_ → changes the view `category=technology` · Figma ☐
- [ ] **Design** _(button, page)_ → changes the view `category=design` · Figma ☐
- [ ] **Healthcare** _(button, page)_ → changes the view `category=healthcare` · Figma ☐
- [ ] **Manufacturing** _(button, page)_ → changes the view `category=manufacturing` · Figma ☐
- [ ] **Retail** _(button, page)_ → changes the view `category=retail` · Figma ☐
- [ ] **Internship** _(button, page)_ → changes the view `category=internship` · Figma ☐
- [ ] **Create Custom** _(button, page)_ → goes to `/recruiter/job-templates/new` · Figma ☐
- [ ] **Software Engineer Technology • Full-Time Optimized for modern tech stacks. Includes requir** _(button, page)_ → opens dialog “Product Designer” `modal=details&template=software-engineer` (buttons: Close dialog · Preview as talent · Close · Use template) · Figma ☐
- [ ] **Marketing Associate Marketing • Part-Time Focuses on multi-channel campaign management, br** _(button, page)_ → opens dialog “Product Designer” `modal=details&template=marketing-associate` (buttons: Close dialog · Preview as talent · Close · Use template) · Figma ☐
- [ ] **Customer Support Rep Retail • Contract Standardized template for client-facing roles. Emph** _(button, page)_ → opens dialog “Product Designer” `modal=details&template=customer-support-rep` (buttons: Close dialog · Preview as talent · Close · Use template) · Figma ☐
- [ ] **General Internship Internship • Seasonal A versatile framework for university partnerships** _(button, page)_ → opens dialog “Product Designer” `modal=details&template=general-internship` (buttons: Close dialog · Preview as talent · Close · Use template) · Figma ☐
- [ ] **Product Designer Design • Temporal Crafted for design systems and UX/UI expertise. Focuses** _(button, page)_ → opens dialog “Product Designer” `modal=details&template=product-designer` (buttons: Close dialog · Preview as talent · Close · Use template) · Figma ☐
- [ ] **Create Custom Start with a blank canvas and build a bespoke job profile from scratch.** _(button, page)_ → goes to `/recruiter/job-templates/new` · Figma ☐
- [ ] **Open Career Buddy** _(button, page)_ → goes to `/profile/filling/career-buddy` · Figma ☐

Fields to try: Search opportunities, skills, communities... · Search templates...

Notes:

### recruiter › job templates › new

- [ ] Screen checked · URL: `/recruiter/job-templates/new` (http://localhost:5173/recruiter/job-templates/new)
- Wiki: [recruiter-job-postings](../recruiter-job-postings.md)

<details><summary>1 documented states to open and compare with Figma</summary>

- [ ] `/recruiter/job-templates/new?state=filled`

</details>

Controls:

- [ ] **Back to templates** _(link, page)_ → goes to `/recruiter/job-templates` · Figma ☐
- [ ] **Select** _(button, page, 4 on screen)_ → opens a menu: Design · Engineering · Marketing · Operations · Finance · Figma ☐
- [ ] **On-site** _(radio, page)_ → selects / switches · Figma ☐
- [ ] **Hybrid** _(radio, page)_ → selects / switches · Figma ☐
- [ ] **Remote** _(radio, page)_ → selects / switches · Figma ☐
- [ ] **Show pay range on the postingYou can choose “Unpaid” or “Stipend” as the pay type for internships.** _(checkbox, page)_ → ⚠ not tested, try it by hand (it could not be clicked, maybe covered by something) · Figma ☐
- [ ] **Choose screening criteria** _(button, page)_ → opens a menu: Product Designer screening 2–5 yrs · Figma, Protot · Senior design screening Saved by you · 5+ yrs · po · Graduate intake screening Saved by Akua M. · BSc · · Create new criteria · No screening · review everyone yourself · Figma ☐
- [ ] **Send applicants an automatic confirmation messageThey get it in Messages as soon as they apply.** _(checkbox, page)_ → ⚠ not tested, try it by hand (it could not be clicked, maybe covered by something) · Figma ☐
- [ ] **Let talent apply with their GTH profile (no CV needed)** _(checkbox, page)_ → ⚠ not tested, try it by hand (it could not be clicked, maybe covered by something) · Figma ☐
- [ ] **Accept applications from talent under 18Only for internships and training programmes. Parent consent is checked automatically.** _(checkbox, page)_ → ⚠ not tested, try it by hand (it could not be clicked, maybe covered by something) · Figma ☐
- [ ] **Select a category** _(button, sidebar)_ → opens a menu: Technology · Design · Finance and accounting · Sales and marketing · Customer service · Internships and NSS · Figma ☐
- [ ] **Only me** _(radio, sidebar)_ → selects / switches · Figma ☐
- [ ] **Everyone at Silver Rock Technology Your 4 teammates will see it in Templates** _(radio, sidebar)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Save screening criteria with this template** _(checkbox, sidebar)_ → ⚠ not tested, try it by hand (it could not be clicked, maybe covered by something) · Figma ☐
- [ ] **Save template** _(button, sidebar)_ → disabled here · Figma ☐
- [ ] **Preview** _(button, sidebar)_ → goes to `/recruiter/job-postings/new/preview` · Figma ☐
- [ ] **Open Career Buddy** _(button, page)_ → goes to `/profile/filling/career-buddy` · Figma ☐

Fields to try: Search opportunities, skills, communities... · e.g. Junior Frontend Developer · Search a city or area · text · What will this person do, and why does it matter? · Add 3–6 short points, one per line · Search skills, e.g. React

Notes:

### recruiter › job templates › product designer › preview

- [ ] Screen checked · URL: `/recruiter/job-templates/product-designer/preview` (http://localhost:5173/recruiter/job-templates/product-designer/preview)
- Wiki: [recruiter-job-postings](../recruiter-job-postings.md)

Controls:

- [ ] **Back to template** _(link, page)_ → goes to `/recruiter/job-templates` · Figma ☐
- [ ] **Apply with my GTH profile** _(button, page)_ → disabled here · Figma ☐
- [ ] **Save for later** _(button, page)_ → disabled here · Figma ☐
- [ ] **Close preview** _(button, page)_ → goes to `/recruiter/job-templates` · Figma ☐
- [ ] **Use template** _(button, page)_ → ⚠ not tested, try it by hand (it could not be clicked, maybe covered by something) · Figma ☐
- [ ] **Open Career Buddy** _(button, page)_ → goes to `/profile/filling/career-buddy` · Figma ☐

Fields to try: Search opportunities, skills, communities...

Notes:

### recruiter › messages

- [ ] Screen checked · URL: `/recruiter/messages` (http://localhost:5173/recruiter/messages)
- Wiki: [recruiter-application-pipeline](../recruiter-application-pipeline.md), [recruiter-community-network](../recruiter-community-network.md), [recruiter-job-prospecting](../recruiter-job-prospecting.md), [recruiter-messages-inbox](../recruiter-messages-inbox.md), [recruiter-talent-search](../recruiter-talent-search.md), [talent-messages](../talent-messages.md)

<details><summary>4 documented states to open and compare with Figma</summary>

- [ ] `/recruiter/messages?rail=collapsed&menu=thread&compareMenu=talent-side&forceHover=mute`
- [ ] `/recruiter/messages?rail=collapsed&tab=unread&menu=thread&forceHover=mute`
- [ ] `/recruiter/messages?view=talent`
- [ ] `/recruiter/messages?view=talent&menu=thread&forceHover=mute`

</details>

Controls:

- [ ] **Archived conversations** _(button, sidebar)_ → changes the view `archived=1` · Figma ☐
- [ ] **All (14)** _(tab, sidebar)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Unread (4)** _(tab, sidebar)_ → changes the view `tab=unread` · Figma ☐
- [ ] **Applicants 2** _(tab, sidebar)_ → changes the view `tab=applicants` · Figma ☐
- [ ] **Ama Boateng 9:32 AM Thank you! Happy to share my portfolio. Here’s the link… Applicant · S** _(button, sidebar)_ → changes the view `conversation=ama-boateng&thread=open` · Figma ☐
- [ ] **Akosua Quansah 8:40 AM Tuesday at 14:00 works for me. 1 Screening · Senior UX Designer** _(button, sidebar)_ → changes the view `conversation=akosua-quansah&thread=open` · Figma ☐
- [ ] **Julian Reed 8:12 AM New application · Senior UX Designer 1 Applicant · Senior UX Designer** _(button, sidebar)_ → changes the view `conversation=julian-reed&thread=open` · Figma ☐
- [ ] **KA Kofi Amankwah Mon Thanks for the invite! I’ll apply today. 2 Invited · Senior Product E** _(button, sidebar)_ → changes the view `conversation=kofi-amankwah&thread=open` · Figma ☐
- [ ] **EM Ella Mensah Yesterday Here’s my portfolio and two case studies. Shortlisted · Senior UX** _(button, sidebar)_ → changes the view `conversation=ella-mensah&thread=open` · Figma ☐
- [ ] **SJ Sarah Jenkins 12 Oct See you at the interview! Interview · Senior UX Designer** _(button, sidebar)_ → changes the view `conversation=sarah-jenkins&thread=open` · Figma ☐
- [ ] **Conversation options** _(button, top bar)_ → opens a menu: View candidate profile · Mute notifications · Archive conversation · Report conversation · Block this candidate · Delete Conversation · Figma ☐
- [ ] **View in Pipeline** _(button, page)_ → goes to `/recruiter/application-pipeline` · Figma ☐
- [ ] **View profile** _(button, page)_ → goes to `/recruiter/talent-search` · Figma ☐
- [ ] **Help me reply** _(button, page)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Send message** _(button, page)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Open Career Buddy** _(button, page)_ → goes to `/profile/filling/career-buddy` · Figma ☐

Fields to try: Search opportunities, skills, communities... · Search by name, job or message · Message

Notes:

### recruiter › settings

- [ ] Screen checked · URL: `/recruiter/settings` (http://localhost:5173/recruiter/settings)
- Wiki: [recruiter-application-pipeline](../recruiter-application-pipeline.md), [recruiter-settings](../recruiter-settings.md), [recruiter-settings-account](../recruiter-settings-account.md), [recruiter-settings-help](../recruiter-settings-help.md), [recruiter-settings-hiring](../recruiter-settings-hiring.md), [recruiter-settings-security](../recruiter-settings-security.md)

<details><summary>1 documented states to open and compare with Figma</summary>

- [ ] `/recruiter/settings?tab=billing`

</details>

Controls:

- [ ] **Settings** _(link, sidebar)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Account** _(link, navigation)_ → changes the view `tab=account` · Figma ☐
- [ ] **Organisation Verified** _(link, navigation)_ → changes the view `tab=organisation` · Figma ☐
- [ ] **Team and roles** _(link, navigation)_ → changes the view `tab=team` · Figma ☐
- [ ] **Hiring preferences** _(link, navigation)_ → changes the view `tab=hiring` · Figma ☐
- [ ] **Notifications** _(link, navigation)_ → changes the view `tab=notifications` · Figma ☐
- [ ] **Plan and billing** _(link, navigation)_ → changes the view `tab=billing` · Figma ☐
- [ ] **Accessibility** _(link, navigation)_ → changes the view `tab=accessibility` · Figma ☐
- [ ] **Language and data** _(link, navigation)_ → changes the view `tab=language` · Figma ☐
- [ ] **Security and sign-in** _(link, navigation)_ → changes the view `tab=security` · Figma ☐
- [ ] **Log out** _(button, navigation)_ → opens dialog “Log out of GTH?” `modal=logout` (buttons: Stay · Log out) · Figma ☐
- [ ] **Upload new logo** _(button, page)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Change** _(button, page)_ → changes the view `tab=organisation` · Figma ☐
- [ ] **Preview as talent** _(button, page)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Cancel** _(button, page)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Save changes** _(button, page)_ → disabled here · Figma ☐
- [ ] **Open Career Buddy** _(button, page)_ → goes to `/profile/filling/career-buddy` · Figma ☐

Fields to try: Search opportunities, skills, communities... · text · email · tel

Notes:

### recruiter › talent search

- [ ] Screen checked · URL: `/recruiter/talent-search` (http://localhost:5173/recruiter/talent-search)
- Wiki: [recruiter-job-prospecting](../recruiter-job-prospecting.md), [recruiter-settings-security](../recruiter-settings-security.md), [recruiter-talent-search](../recruiter-talent-search.md)

<details><summary>9 documented states to open and compare with Figma</summary>

- [ ] `/recruiter/talent-search?menu=experience`
- [ ] `/recruiter/talent-search?menu=location`
- [ ] `/recruiter/talent-search?menu=more-filters`
- [ ] `/recruiter/talent-search?menu=skills`
- [ ] `/recruiter/talent-search?menu=sort`
- [ ] `/recruiter/talent-search?state=empty&exp=10-plus&remote=0`
- [ ] `/recruiter/talent-search?state=first-visit`
- [ ] `/recruiter/talent-search?state=loading`
- [ ] `/recruiter/talent-search?typed=react%20nat&menu=search`

</details>

Controls:

- [ ] **Skills: React, Python, AWS** _(button, page)_ → opens dialog “Skills filter” `menu=skills` (buttons: Remove React · Remove Python · Remove AWS · TypeScript In 74% of top matches · Kubernetes In 41% of top matches · Clear skills) · Figma ☐
- [ ] **Remove Skills filter** _(button, page)_ → changes the view `skills=none` · Figma ☐
- [ ] **Exp: 5+ Years** _(button, page)_ → opens a menu: 0–2 years · 2–5 years · 5+ years · 10+ years · Figma ☐
- [ ] **Remove Exp filter** _(button, page)_ → changes the view `exp=any` · Figma ☐
- [ ] **Location: Accra, GH** _(button, page)_ → opens dialog “Location filter” `menu=location` (buttons: Accra, Greater Accra · Kumasi, Ashanti · Tema, Greater Accra · Takoradi, Western · Include remote talent Anywhere in Ghana · Within 50 km Distance from Accra) · Figma ☐
- [ ] **Remove Location filter** _(button, page)_ → changes the view `location=any` · Figma ☐
- [ ] **More Filters** _(button, page)_ → opens dialog “More filters” `menu=more-filters` (buttons: Close · Open to work · Available now · Within 1 month · Notice period · On-site · Hybrid · Remote · Bachelor’s or higher · Any score · Up to GHS 15,000 · Clear all · Show 9 talents) · Figma ☐
- [ ] **All Matches** _(tab, page)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Top Matches** _(tab, page)_ → changes the view `tab=top-matches` · Figma ☐
- [ ] **Available now** _(tab, page)_ → changes the view `tab=available-now` · Figma ☐
- [ ] **Sort: Best match** _(button, page)_ → opens a menu: Best match Skills, experience and location · Recently active · Assessment score · Available soonest · Open to work first · Figma ☐
- [ ] **Save Kofi Amankwah** _(button, page, 2 on screen)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **More options for Kofi Amankwah** _(button, page, 2 on screen)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **View profile** _(button, page, 6 on screen)_ → goes to `/recruiter/talent-search/kofi-amankwah?job=senior-product-engineer` · Figma ☐
- [ ] **Invite to apply** _(button, page, 6 on screen)_ → goes to `/recruiter/talent-search/kofi-amankwah?modal=invite&job=senior-product-engineer` · Figma ☐
- [ ] **Save Ama Boateng** _(button, page, 2 on screen)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **More options for Ama Boateng** _(button, page, 2 on screen)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Save Godfred Ansah** _(button, page, 2 on screen)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **More options for Godfred Ansah** _(button, page, 2 on screen)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **View Market Report** _(button, page)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Open Career Buddy** _(button, page)_ → goes to `/profile/filling/career-buddy` · Figma ☐

Fields to try: Search opportunities, skills, communities... · Search by name or keyword...

Notes:

### recruiter › talent search › ‹candidate›

- [ ] Screen checked · URL: `/recruiter/talent-search/ama-boateng` (http://localhost:5173/recruiter/talent-search/ama-boateng)
- Wiki: [recruiter-talent-search](../recruiter-talent-search.md)

<details><summary>7 documented states to open and compare with Figma</summary>

- [ ] `/recruiter/talent-search/kofi-amankwah?invited=senior-product-engineer&toast=invite-sent`
- [ ] `/recruiter/talent-search/kofi-amankwah?menu=more`
- [ ] `/recruiter/talent-search/kofi-amankwah?menu=save`
- [ ] `/recruiter/talent-search/kofi-amankwah?modal=invite`
- [ ] `/recruiter/talent-search/kofi-amankwah?modal=pipeline`
- [ ] `/recruiter/talent-search/kofi-amankwah?pipeline=shortlisted&toast=pipeline-added`
- [ ] `/recruiter/talent-search/kofi-amankwah?saved=job-shortlist&toast=saved`

</details>

Controls:

- [ ] **Back to Messages** _(button, navigation)_ → goes to `/recruiter/messages` · Figma ☐
- [ ] **Next candidate** _(button, navigation)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Open application** _(button, page)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **View in Pipeline** _(button, page)_ → goes to `/recruiter/application-pipeline` · Figma ☐
- [ ] **Message** _(button, page)_ → goes to `/recruiter/messages` · Figma ☐
- [ ] **Move to stage** _(button, page)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **More actions** _(button, page)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **MATCH FOR** _(combobox, sidebar)_ → opens a menu: Senior UX Designer · Figma ☐
- [ ] **ama.design/work** _(link, page)_ → opens a new tab `chrome-error://chromewebdata/` · Figma ☐
- [ ] **Open Career Buddy** _(button, page)_ → goes to `/profile/filling/career-buddy` · Figma ☐

Fields to try: Search opportunities, skills, communities... · Private note for your team

Notes:
