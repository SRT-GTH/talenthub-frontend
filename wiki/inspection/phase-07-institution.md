# Phase 7 · Institution

> Schools and universities: onboarding and bulk upload, the institution portal (students, records, credentials, programmes, messages, progress, reports, settings) and public institution pages.

37 screens · 59 documented states · click map generated 2026-11-11. Back to [all phases](README.md).

## /institution

### institution (portal home and other pages)

- [ ] Screen checked · URL: `/institution` (http://localhost:5173/institution)
- ⚠ Without a signed-in session this URL redirects to `/login`: sign in with a test account and check it by hand.
- Wiki: [institution](../institution.md)

<details><summary>6 documented states to open and compare with Figma</summary>

- [ ] `/institution?modal=profile`
- [ ] `/institution?modal=welcome`
- [ ] `/institution?state=new`
- [ ] `/institution?tour=1`
- [ ] `/institution?tour=2`
- [ ] `/institution?tour=3`

</details>

No clickable controls of its own (only shared chrome).

Notes:

### institution › accreditation

- [ ] Screen checked · URL: `/institution/accreditation` (http://localhost:5173/institution/accreditation)
- ⚠ Without a signed-in session this URL redirects to `/login`: sign in with a test account and check it by hand.
- Wiki: [institution](../institution.md)

<details><summary>2 documented states to open and compare with Figma</summary>

- [ ] `/institution/accreditation?view=list`
- [ ] `/institution/accreditation?view=submitted`

</details>

No clickable controls of its own (only shared chrome).

Notes:

### institution › accreditation › status

- [ ] Screen checked · URL: `/institution/accreditation/status` (http://localhost:5173/institution/accreditation/status)
- ⚠ Without a signed-in session this URL redirects to `/login`: sign in with a test account and check it by hand.
- Wiki: [institution](../institution.md)

<details><summary>4 documented states to open and compare with Figma</summary>

- [ ] `/institution/accreditation/status?verify=approved`
- [ ] `/institution/accreditation/status?verify=needs-info`
- [ ] `/institution/accreditation/status?verify=not-approved`
- [ ] `/institution/accreditation/status?verify=under-review`

</details>

No clickable controls of its own (only shared chrome).

Notes:

### institution › credentials

- [ ] Screen checked · URL: `/institution/credentials` (http://localhost:5173/institution/credentials)
- ⚠ Without a signed-in session this URL redirects to `/login`: sign in with a test account and check it by hand.
- Wiki: [institution](../institution.md)

No clickable controls of its own (only shared chrome).

Notes:

### institution › credentials › ‹credential›

- [ ] Screen checked · URL: `/institution/credentials/cred-1` (http://localhost:5173/institution/credentials/cred-1)
- ⚠ Without a signed-in session this URL redirects to `/login`: sign in with a test account and check it by hand.
- Wiki: [institution](../institution.md)

<details><summary>3 documented states to open and compare with Figma</summary>

- [ ] `/institution/credentials/cred-1?modal=corrected`
- [ ] `/institution/credentials/cred-1?modal=revoke`
- [ ] `/institution/credentials/cred-1?state=revoked`

</details>

No clickable controls of its own (only shared chrome).

Notes:

### institution › credentials › new

- [ ] Screen checked · URL: `/institution/credentials/new` (http://localhost:5173/institution/credentials/new)
- ⚠ Without a signed-in session this URL redirects to `/login`: sign in with a test account and check it by hand.
- Wiki: [institution](../institution.md)

<details><summary>3 documented states to open and compare with Figma</summary>

- [ ] `/institution/credentials/new?modal=preview`
- [ ] `/institution/credentials/new?mode=class`
- [ ] `/institution/credentials/new?state=issued`

</details>

No clickable controls of its own (only shared chrome).

Notes:

### institution › messages

- [ ] Screen checked · URL: `/institution/messages` (http://localhost:5173/institution/messages)
- ⚠ Without a signed-in session this URL redirects to `/login`: sign in with a test account and check it by hand.
- Wiki: [institution](../institution.md)

<details><summary>1 documented states to open and compare with Figma</summary>

- [ ] `/institution/messages?state=empty`

</details>

No clickable controls of its own (only shared chrome).

Notes:

### institution › messages › ‹thread›

- [ ] Screen checked · URL: `/institution/messages/thread-1` (http://localhost:5173/institution/messages/thread-1)
- ⚠ Without a signed-in session this URL redirects to `/login`: sign in with a test account and check it by hand.
- Wiki: [institution](../institution.md)

<details><summary>2 documented states to open and compare with Figma</summary>

- [ ] `/institution/messages/thread-3?state=scheduled`
- [ ] `/institution/messages/thread-4?state=delivery-problem`

</details>

No clickable controls of its own (only shared chrome).

Notes:

### institution › messages › new

- [ ] Screen checked · URL: `/institution/messages/new` (http://localhost:5173/institution/messages/new)
- ⚠ Without a signed-in session this URL redirects to `/login`: sign in with a test account and check it by hand.
- Wiki: [institution](../institution.md)

<details><summary>1 documented states to open and compare with Figma</summary>

- [ ] `/institution/messages/new?step=confirm`

</details>

No clickable controls of its own (only shared chrome).

Notes:

### institution › programmes

- [ ] Screen checked · URL: `/institution/programmes` (http://localhost:5173/institution/programmes)
- ⚠ Without a signed-in session this URL redirects to `/login`: sign in with a test account and check it by hand.
- Wiki: [institution](../institution.md)

<details><summary>3 documented states to open and compare with Figma</summary>

- [ ] `/institution/programmes?modal=actions`
- [ ] `/institution/programmes?modal=close`
- [ ] `/institution/programmes?tab=drafts`

</details>

No clickable controls of its own (only shared chrome).

Notes:

### institution › programmes › ‹programme›

- [ ] Screen checked · URL: `/institution/programmes/science-scholarship-2027` (http://localhost:5173/institution/programmes/science-scholarship-2027)
- ⚠ Without a signed-in session this URL redirects to `/login`: sign in with a test account and check it by hand.
- Wiki: [institution](../institution.md)

No clickable controls of its own (only shared chrome).

Notes:

### institution › programmes › ‹programme› › applicants

- [ ] Screen checked · URL: `/institution/programmes/science-scholarship-2027/applicants` (http://localhost:5173/institution/programmes/science-scholarship-2027/applicants)
- ⚠ Without a signed-in session this URL redirects to `/login`: sign in with a test account and check it by hand.
- Wiki: [institution](../institution.md)

No clickable controls of its own (only shared chrome).

Notes:

### institution › programmes › new

- [ ] Screen checked · URL: `/institution/programmes/new` (http://localhost:5173/institution/programmes/new)
- ⚠ Without a signed-in session this URL redirects to `/login`: sign in with a test account and check it by hand.
- Wiki: [institution](../institution.md)

<details><summary>2 documented states to open and compare with Figma</summary>

- [ ] `/institution/programmes/new?modal=preview`
- [ ] `/institution/programmes/new?modal=templates`

</details>

No clickable controls of its own (only shared chrome).

Notes:

### institution › progress

- [ ] Screen checked · URL: `/institution/progress` (http://localhost:5173/institution/progress)
- ⚠ Without a signed-in session this URL redirects to `/login`: sign in with a test account and check it by hand.
- Wiki: [institution](../institution.md)

No clickable controls of its own (only shared chrome).

Notes:

### institution › progress › class outcomes

- [ ] Screen checked · URL: `/institution/progress/class-outcomes` (http://localhost:5173/institution/progress/class-outcomes)
- ⚠ Without a signed-in session this URL redirects to `/login`: sign in with a test account and check it by hand.
- Wiki: [institution](../institution.md)

<details><summary>1 documented states to open and compare with Figma</summary>

- [ ] `/institution/progress/class-outcomes?modal=download`

</details>

No clickable controls of its own (only shared chrome).

Notes:

### institution › progress › students › ‹student›

- [ ] Screen checked · URL: `/institution/progress/students/abena-mahama` (http://localhost:5173/institution/progress/students/abena-mahama)
- ⚠ Without a signed-in session this URL redirects to `/login`: sign in with a test account and check it by hand.
- Wiki: [institution](../institution.md)

<details><summary>1 documented states to open and compare with Figma</summary>

- [ ] `/institution/progress/students/abena-mahama?modal=flag`

</details>

No clickable controls of its own (only shared chrome).

Notes:

### institution › public page

- [ ] Screen checked · URL: `/institution/public-page` (http://localhost:5173/institution/public-page)
- ⚠ Without a signed-in session this URL redirects to `/login`: sign in with a test account and check it by hand.
- Wiki: [institution](../institution.md)

No clickable controls of its own (only shared chrome).

Notes:

### institution › records

- [ ] Screen checked · URL: `/institution/records` (http://localhost:5173/institution/records)
- ⚠ Without a signed-in session this URL redirects to `/login`: sign in with a test account and check it by hand.
- Wiki: [institution](../institution.md)

<details><summary>2 documented states to open and compare with Figma</summary>

- [ ] `/institution/records?modal=bulk-approve`
- [ ] `/institution/records?state=caught-up`

</details>

No clickable controls of its own (only shared chrome).

Notes:

### institution › records › ‹record›

- [ ] Screen checked · URL: `/institution/records/rec-1` (http://localhost:5173/institution/records/rec-1)
- ⚠ Without a signed-in session this URL redirects to `/login`: sign in with a test account and check it by hand.
- Wiki: [institution](../institution.md)

<details><summary>2 documented states to open and compare with Figma</summary>

- [ ] `/institution/records/rec-1?modal=approve`
- [ ] `/institution/records/rec-1?modal=reject`

</details>

No clickable controls of its own (only shared chrome).

Notes:

### institution › report

- [ ] Screen checked · URL: `/institution/report` (http://localhost:5173/institution/report)
- ⚠ Without a signed-in session this URL redirects to `/login`: sign in with a test account and check it by hand.
- Wiki: [institution](../institution.md)

<details><summary>8 documented states to open and compare with Figma</summary>

- [ ] `/institution/report?page=1`
- [ ] `/institution/report?page=2`
- [ ] `/institution/report?page=3`
- [ ] `/institution/report?page=4`
- [ ] `/institution/report?page=5`
- [ ] `/institution/report?page=6`
- [ ] `/institution/report?page=7`
- [ ] `/institution/report?page=8`

</details>

No clickable controls of its own (only shared chrome).

Notes:

### institution › settings

- [ ] Screen checked · URL: `/institution/settings` (http://localhost:5173/institution/settings)
- ⚠ Without a signed-in session this URL redirects to `/login`: sign in with a test account and check it by hand.

No clickable controls of its own (only shared chrome).

Notes:

### institution › settings › ‹tab›

- [ ] Screen checked · URL: `/institution/settings/data` (http://localhost:5173/institution/settings/data)
- ⚠ Without a signed-in session this URL redirects to `/login`: sign in with a test account and check it by hand.
- Wiki: [institution](../institution.md)

<details><summary>2 documented states to open and compare with Figma</summary>

- [ ] `/institution/settings/staff?modal=invite`
- [ ] `/institution/settings/staff?modal=remove`

</details>

No clickable controls of its own (only shared chrome).

Notes:

### institution › sign up

- [ ] Screen checked · URL: `/institution/sign-up` (http://localhost:5173/institution/sign-up)
- Wiki: [institution](../institution.md)

<details><summary>5 documented states to open and compare with Figma</summary>

- [ ] `/institution/sign-up?state=already-registered`
- [ ] `/institution/sign-up?state=code-sent`
- [ ] `/institution/sign-up?state=filled`
- [ ] `/institution/sign-up?state=success`
- [ ] `/institution/sign-up?state=wrong-code`

</details>

Controls:

- [ ] **Ghana Talent Hub home** _(link, top bar)_ → ⚠ not tested, try it by hand · Figma ☐
- [ ] **Log In** _(link, top bar)_ → goes to `/login` · Figma ☐
- [ ] **Upload crest** _(button, page)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **JHS, SHS, university, technical or vocational** _(combobox, page)_ → opens a menu: Senior high school (public) · Senior high school (private) · Junior high school · University · Technical or vocational institute · Figma ☐
- [ ] **Choose your region** _(combobox, page)_ → ⚠ not tested, try it by hand · Figma ☐
- [ ] **Show password** _(button, page, 2 on screen)_ → selects / switches · Figma ☐
- [ ] **Continue to verification** _(button, page)_ → disabled here · Figma ☐
- [ ] **Log in instead** _(link, page)_ → goes to `/login` · Figma ☐

Fields to try: e.g. Savannah Hills Senior High School · e.g. Savannah Hills SHS · e.g. GES/NR/SHS/0412 · e.g. NT-0123-4567 · e.g. Iddrisu Abdul-Rahman · e.g. Registrar · registrar@yourschool.edu.gh · Create a password

Notes:

### institution › students

- [ ] Screen checked · URL: `/institution/students` (http://localhost:5173/institution/students)
- ⚠ Without a signed-in session this URL redirects to `/login`: sign in with a test account and check it by hand.
- Wiki: [institution](../institution.md)

<details><summary>10 documented states to open and compare with Figma</summary>

- [ ] `/institution/students?filter=not-linked`
- [ ] `/institution/students?modal=add-student`
- [ ] `/institution/students?modal=consent`
- [ ] `/institution/students?modal=remove`
- [ ] `/institution/students?modal=transfer`
- [ ] `/institution/students?modal=upload`
- [ ] `/institution/students?modal=upload&state=checking`
- [ ] `/institution/students?modal=upload&state=errors`
- [ ] `/institution/students?modal=upload&state=review`
- [ ] `/institution/students?state=empty`

</details>

No clickable controls of its own (only shared chrome).

Notes:

### institution › students › ‹student›

- [ ] Screen checked · URL: `/institution/students/abena-mahama` (http://localhost:5173/institution/students/abena-mahama)
- ⚠ Without a signed-in session this URL redirects to `/login`: sign in with a test account and check it by hand.
- Wiki: [institution](../institution.md)

No clickable controls of its own (only shared chrome).

Notes:

### institution › students › new

- [ ] Screen checked · URL: `/institution/students/new` (http://localhost:5173/institution/students/new)
- ⚠ Without a signed-in session this URL redirects to `/login`: sign in with a test account and check it by hand.
- Wiki: [institution](../institution.md)

No clickable controls of its own (only shared chrome).

Notes:

### institution › verify › ‹credential›

- [ ] Screen checked · URL: `/institution/verify/cred-1` (http://localhost:5173/institution/verify/cred-1)
- Wiki: [institution](../institution.md)

<details><summary>1 documented states to open and compare with Figma</summary>

- [ ] `/institution/verify/cred-2?state=revoked`

</details>

Controls:

- [ ] **Ghana Talent Hub Public data** _(link, navigation)_ → goes to `/data` · Figma ☐
- [ ] **Collapse sidebar** _(button, navigation)_ → changes the view `rail=collapsed` · Figma ☐
- [ ] **Home** _(link, navigation)_ → goes to `/data` · Figma ☐
- [ ] **National overview** _(link, navigation)_ → goes to `/data/overview` · Figma ☐
- [ ] **Regions** _(link, navigation)_ → goes to `/data/regions/greater-accra` · Figma ☐
- [ ] **Talent showcase** _(link, navigation)_ → goes to `/data/showcase` · Figma ☐
- [ ] **Outcomes** _(link, navigation)_ → goes to `/data/outcomes` · Figma ☐
- [ ] **Directory** _(link, navigation)_ → goes to `/data/partners` · Figma ☐
- [ ] **Methodology** _(link, navigation, 2 on screen)_ → goes to `/data/methodology` · Figma ☐
- [ ] **Monthly digest** _(button, navigation, 2 on screen)_ → opens dialog “Get the monthly digest” `modal=digest` (buttons: Close · Government Investor Public · National + Volta ▾ · Cancel · Subscribe) · Figma ☐
- [ ] **Partner sign-in →** _(link, navigation)_ → goes to `/login` · Figma ☐
- [ ] **Updated 2 min ago · Live** _(button, top bar)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Share** _(button, top bar)_ → opens dialog “Share this page” `modal=share` (buttons: Close · Copy link · Copy link · Email · WhatsApp · X · Done) · Figma ☐
- [ ] **Download PDF** _(button, top bar)_ → opens dialog “Download a PDF snapshot” `modal=download` (buttons: Close · Cancel · Download PDF) · Figma ☐
- [ ] **gth.com** _(link, navigation)_ → goes to `/data` · Figma ☐
- [ ] **Check credential** _(button, page)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Partner directory** _(link, navigation)_ → goes to `/data/partners` · Figma ☐
- [ ] **Opportunity directory** _(link, navigation)_ → goes to `/data/opportunities` · Figma ☐

Fields to try: Search regions, partners, opportunities · GTH-CR-0000-00000

Notes:

## /onboarding/institution

### onboarding › institution › activate

- [ ] Screen checked · URL: `/onboarding/institution/activate` (http://localhost:5173/onboarding/institution/activate)

Controls:

- [ ] **Ghana Talent Hub home** _(link, top bar)_ → goes to `/` · Figma ☐
- [ ] **Log In** _(link, top bar)_ → goes to `/login` · Figma ☐
- [ ] **EDIT** _(link, page)_ → goes to `/onboarding/institution/your-institution` · Figma ☐
- [ ] **EDIT** _(link, page)_ → goes to `/onboarding/institution/contact` · Figma ☐
- [ ] **I agree to Institution Terms & Conditions and Privacy Policy.** _(checkbox, page)_ → selects / switches · Figma ☐
- [ ] **Terms & Conditions** _(link, page)_ → opens dialog “Terms & Conditions” (buttons: Drag down to close · Close · I understand and Accept) · Figma ☐
- [ ] **Privacy Policy.** _(link, page)_ → opens dialog “Privacy Policy” (buttons: Drag down to close · Close · Read full document · I understand and Accept) · Figma ☐
- [ ] **I consent to Ghana Talent Hub processing my data under Ghana DPA (Act 843). Learn more about data processing.** _(checkbox, page)_ → selects / switches · Figma ☐
- [ ] **Learn more about data processing.** _(link, page)_ → opens dialog “Data Processing Consent” (buttons: Drag down to close · Close · Read full document · I understand and Accept) · Figma ☐
- [ ] **I confirm that I am authorised to register this institution and that all information provided is accurate and complete. \*** _(checkbox, page)_ → selects / switches · Figma ☐
- [ ] **Log in Instead** _(link, page)_ → goes to `/login` · Figma ☐

Notes:

### onboarding › institution › confirm

- [ ] Screen checked · URL: `/onboarding/institution/confirm` (http://localhost:5173/onboarding/institution/confirm)
- ⚠ Without a signed-in session this URL redirects to `/onboarding/institution/upload`: sign in with a test account and check it by hand.

No clickable controls of its own (only shared chrome).

Notes:

### onboarding › institution › contact

- [ ] Screen checked · URL: `/onboarding/institution/contact` (http://localhost:5173/onboarding/institution/contact)

Controls:

- [ ] **Ghana Talent Hub home** _(link, top bar)_ → goes to `/` · Figma ☐
- [ ] **Log In** _(link, top bar)_ → goes to `/login` · Figma ☐
- [ ] **Show password** _(button, page, 2 on screen)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Save & Continue** _(button, page)_ → changes something on the page · Figma ☐
- [ ] **Log in Instead** _(link, page)_ → goes to `/login` · Figma ☐

Fields to try: e.g. Kwame Mensah · e.g. Registrar · 24 000 0000 · e.g. kwame@atc.edu.gh · Min. 8 characters · Re-enter password

Notes:

### onboarding › institution › guidelines

- [ ] Screen checked · URL: `/onboarding/institution/guidelines` (http://localhost:5173/onboarding/institution/guidelines)
- Wiki: [parent-link-ward](../parent-link-ward.md)

Controls:

- [ ] **Ghana Talent Hub home** _(link, top bar)_ → goes to `/` · Figma ☐
- [ ] **Log In** _(link, top bar)_ → goes to `/login` · Figma ☐
- [ ] **Let's Begin** _(button, page)_ → goes to `/onboarding/institution/your-institution` · Figma ☐
- [ ] **Log in Instead** _(link, page)_ → goes to `/login` · Figma ☐

Notes:

### onboarding › institution › report

- [ ] Screen checked · URL: `/onboarding/institution/report` (http://localhost:5173/onboarding/institution/report)
- ⚠ Without a signed-in session this URL redirects to `/onboarding/institution/upload`: sign in with a test account and check it by hand.

No clickable controls of its own (only shared chrome).

Notes:

### onboarding › institution › template

- [ ] Screen checked · URL: `/onboarding/institution/template` (http://localhost:5173/onboarding/institution/template)

Controls:

- [ ] **Ghana Talent Hub home** _(link, top bar)_ → goes to `/` · Figma ☐
- [ ] **Log In** _(link, top bar)_ → goes to `/login` · Figma ☐
- [ ] **Download GTH_Student_Upload_Template.csv** _(link, page)_ → downloads `GTH_Student_Upload_Template.csv` · Figma ☐
- [ ] **I have my file ready** _(button, page)_ → goes to `/onboarding/institution/upload` · Figma ☐
- [ ] **Log in Instead** _(link, page)_ → goes to `/login` · Figma ☐

Notes:

### onboarding › institution › template guide

- [ ] Screen checked · URL: `/onboarding/institution/template-guide` (http://localhost:5173/onboarding/institution/template-guide)

Controls:

- [ ] **Ghana Talent Hub home** _(link, top bar)_ → goes to `/` · Figma ☐
- [ ] **Log In** _(link, top bar)_ → goes to `/login` · Figma ☐
- [ ] **Download GTH_Student_Upload_Template.csv** _(link, page)_ → downloads `GTH_Student_Upload_Template.csv` · Figma ☐
- [ ] **I'm ready to fill the template** _(button, page)_ → goes to `/onboarding/institution/template` · Figma ☐

Notes:

### onboarding › institution › upload

- [ ] Screen checked · URL: `/onboarding/institution/upload` (http://localhost:5173/onboarding/institution/upload)

Controls:

- [ ] **Ghana Talent Hub home** _(link, top bar)_ → goes to `/` · Figma ☐
- [ ] **Log In** _(link, top bar)_ → goes to `/login` · Figma ☐
- [ ] **Upload file — click or drag a CSV, XLSX, or XLS here** _(button, page)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Run Pre-Flight Check** _(button, page)_ → disabled here · Figma ☐
- [ ] **Log in Instead** _(link, page)_ → goes to `/login` · Figma ☐

Notes:

### onboarding › institution › validate

- [ ] Screen checked · URL: `/onboarding/institution/validate` (http://localhost:5173/onboarding/institution/validate)
- ⚠ Without a signed-in session this URL redirects to `/onboarding/institution/upload`: sign in with a test account and check it by hand.

No clickable controls of its own (only shared chrome).

Notes:

### onboarding › institution › your institution

- [ ] Screen checked · URL: `/onboarding/institution/your-institution` (http://localhost:5173/onboarding/institution/your-institution)

Controls:

- [ ] **Ghana Talent Hub home** _(link, top bar)_ → goes to `/` · Figma ☐
- [ ] **Log In** _(link, top bar)_ → goes to `/login` ⚠ page looks empty · Figma ☐
- [ ] **Select institution type** _(combobox, page)_ → opens a menu: University · College of Education · Technical / Polytechnic University · Senior High School (SHS) · Junior High School (JHS) · Primary School · Vocational / Technical Institute · International School · Private School · Other · Figma ☐
- [ ] **Select Region** _(combobox, page)_ → opens a menu: Ahafo · Ashanti · Bono · Bono East · Central · Eastern · Greater Accra · North East · Northern · Oti · Savannah · Upper East · Figma ☐
- [ ] **Select a region first** _(combobox, page)_ → disabled here · Figma ☐
- [ ] **Save & Continue** _(button, page)_ → changes something on the page · Figma ☐
- [ ] **Log in Instead** _(link, page)_ → goes to `/login` · Figma ☐

Fields to try: e.g. Accra Technical College · e.g. ATC (if different)

Notes:
