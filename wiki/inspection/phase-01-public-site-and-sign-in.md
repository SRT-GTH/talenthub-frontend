# Phase 1 · Public site and sign-in

> The pages anyone sees before signing in: the landing site, choosing a role, signing in, password reset, invites and consent links.

18 screens · 0 documented states · click map generated 2026-11-11. Back to [all phases](README.md).

## Shared chrome (check once)

- [ ] **Ghana Talent Hub — home** _(link, top bar)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **How it works** _(link, top bar)_ → goes to `/how-it-works` · Figma ☐
- [ ] **Features** _(link, top bar)_ → goes to `/features` · Figma ☐
- [ ] **Opportunities** _(link, top bar)_ → goes to `/opportunities` · Figma ☐
- [ ] **For parents & schools** _(link, top bar)_ → goes to `/for-parents-schools` · Figma ☐
- [ ] **Stories** _(link, top bar)_ → goes to `/stories` · Figma ☐
- [ ] **FAQ** _(link, top bar)_ → goes to `/faq` · Figma ☐
- [ ] **EN · GH** _(button, top bar)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Log in** _(link, top bar)_ → goes to `/login` · Figma ☐
- [ ] **Get started** _(link, top bar)_ → goes to `/get-started` · Figma ☐
- [ ] **For students** _(button, footer)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **For parents** _(button, footer)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **For schools** _(button, footer)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **For recruiters** _(button, footer)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Skills Lab** _(button, footer)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Opportunities** _(button, footer)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **About us** _(button, footer)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Blog** _(button, footer)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Careers** _(button, footer)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Press** _(button, footer)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Contact** _(button, footer)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Privacy policy** _(button, footer)_ → opens dialog “Privacy Policy” (buttons: Close · Got it) · Figma ☐
- [ ] **Terms of service** _(button, footer)_ → opens dialog “Terms & Conditions” (buttons: Close · Got it) · Figma ☐
- [ ] **Cookie policy** _(button, footer)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Child safety** _(button, footer)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Accessibility statement** _(button, footer)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Home** _(link, navigation)_ → goes to `/` · Figma ☐
- [ ] **Ghana Talent Hub home** _(link, top bar)_ → goes to `/` · Figma ☐

## Landing site

### Landing home

- [ ] Screen checked · URL: `/` (http://localhost:5173/)
- Wiki: [landing-site](../landing-site.md)

Controls:

- [ ] **Create my free profile** _(link, page, 2 on screen)_ → goes to `/get-started` · Figma ☐
- [x] **Hiring? See GTH for recruiters** _(link, page)_ → goes to `/get-started?role=recruiter` (fixed 2026-11-12: role picker with Recruiter selected; ⚠️ ASSUMPTION, no target in Figma) · Figma ☐
- [ ] **Start your road** _(link, page)_ → goes to `/get-started` · Figma ☐
- [ ] **View role** _(button, page, 2 on screen)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Quick apply** _(button, page)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Browse all opportunities** _(link, page)_ → goes to `/opportunities` · Figma ☐
- [ ] **Students** _(tab, page)_ → switches which item is open · Figma ☐
- [ ] **Parents** _(tab, page)_ → switches which item is open · Figma ☐
- [ ] **Schools** _(tab, page)_ → switches which item is open · Figma ☐
- [ ] **Recruiters** _(tab, page)_ → ⚠ nothing visible happens · Figma ☐
- [x] **See GTH for recruiters** _(link, page)_ → goes to `/get-started?role=recruiter` (fixed 2026-11-12, same as the hero link) · Figma ☐
- [x] **Create my free profile** _(link, page, For everyone › Students tab)_ → goes to `/get-started?role=talent` (fixed 2026-11-12) · Figma ☐
- [x] **Invite my parent** _(link, page, For everyone › Parents tab)_ → goes to `/get-started?role=parent` (fixed 2026-11-12) · Figma ☐
- [x] **Bring GTH to my school** _(link, page, For everyone › Schools tab)_ → goes to `/institution/sign-up` (fixed 2026-11-12) · Figma ☐
- [x] **Ask Career Buddy or email info@ghanatalenthub.com** _(link, page, FAQ section “Still stuck?”)_ → opens the mail app to `info@ghanatalenthub.com` (fixed 2026-11-12; was plain text) · Figma ☐
- [ ] **Is GTH really free for students?** _(button, page)_ → collapses / closes · Figma ☐
- [ ] **Do I need a CV to start?** _(button, page)_ → switches which item is open · Figma ☐
- [ ] **How long does the profile take?** _(button, page)_ → switches which item is open · Figma ☐
- [ ] **Who can see my profile?** _(button, page)_ → switches which item is open · Figma ☐
- [ ] **I’m under 18. Can I join?** _(button, page)_ → switches which item is open · Figma ☐
- [ ] **Does it work on my phone and slow data?** _(button, page)_ → switches which item is open · Figma ☐
- [ ] **Already registered? Log in** _(link, page)_ → goes to `/login` · Figma ☐

Notes:

### How it works

- [ ] Screen checked · URL: `/how-it-works` (http://localhost:5173/how-it-works)
- Wiki: [landing-site](../landing-site.md)

Controls:

- [ ] **Create my free profile** _(link, page)_ → goes to `/get-started` · Figma ☐
- [ ] **Already registered? Log in** _(link, page)_ → goes to `/login` · Figma ☐

Notes:

### Features

- [ ] Screen checked · URL: `/features` (http://localhost:5173/features)
- Wiki: [landing-site](../landing-site.md)

Controls:

- [ ] **Create my free profile** _(link, page)_ → goes to `/get-started` · Figma ☐
- [ ] **Already registered? Log in** _(link, page)_ → goes to `/login` · Figma ☐

Notes:

### Opportunities

- [ ] Screen checked · URL: `/opportunities` (http://localhost:5173/opportunities)
- Wiki: [landing-site](../landing-site.md)

Controls:

- [ ] **Search** _(button, page)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **All 1580** _(button, page)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Internships 412** _(button, page)_ → changes the view `type=internships` · Figma ☐
- [ ] **Graduate schemes 96** _(button, page)_ → changes the view `type=graduate-schemes` · Figma ☐
- [ ] **NSS placements 220** _(button, page)_ → changes the view `type=nss` · Figma ☐
- [ ] **Scholarships 84** _(button, page)_ → changes the view `type=scholarships` · Figma ☐
- [ ] **Part-time 310** _(button, page)_ → changes the view `type=part-time` · Figma ☐
- [ ] **Remote 140** _(button, page)_ → changes the view `type=remote` · Figma ☐
- [ ] **Student / SHS** _(checkbox, sidebar)_ → changes the view `level=undergraduate,graduate,student-shs` · Figma ☐
- [ ] **Undergraduate** _(checkbox, sidebar)_ → changes the view `level=graduate` · Figma ☐
- [ ] **Graduate** _(checkbox, sidebar)_ → changes the view `level=undergraduate` · Figma ☐
- [ ] **Early career** _(checkbox, sidebar)_ → changes the view `level=undergraduate,graduate,early-career` · Figma ☐
- [ ] **On-site** _(checkbox, sidebar)_ → changes the view `style=hybrid` · Figma ☐
- [ ] **Hybrid** _(checkbox, sidebar)_ → changes the view `style=on-site` · Figma ☐
- [ ] **Remote** _(checkbox, sidebar)_ → changes the view `style=on-site,hybrid,remote` · Figma ☐
- [ ] **Greater Accra** _(checkbox, sidebar)_ → changes the view `region=` · Figma ☐
- [ ] **Ashanti** _(checkbox, sidebar)_ → changes the view `region=greater-accra,ashanti` · Figma ☐
- [ ] **Northern** _(checkbox, sidebar)_ → changes the view `region=greater-accra,northern` · Figma ☐
- [ ] **Western** _(checkbox, sidebar)_ → changes the view `region=greater-accra,western` · Figma ☐
- [ ] **Sort: Best fit** _(button, page)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Save Frontend Engineer** _(button, page)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Save Data Analyst Intern** _(button, page)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Save Analyst Trainee** _(button, page)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Save Marketing Graduate** _(button, page)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Save Agritech Field Associate** _(button, page)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Save Pharmacy Operations Intern** _(button, page)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Save Engineering Scholarship 2026** _(button, page)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Save Customer Experience Associate** _(button, page)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Load more roles** _(button, page)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Create my free profile** _(link, page)_ → goes to `/get-started` · Figma ☐
- [ ] **Already registered? Log in** _(link, page)_ → goes to `/login` · Figma ☐

Fields to try: Role, skill or company · Anywhere in Ghana

Notes:

### For parents and schools

- [ ] Screen checked · URL: `/for-parents-schools` (http://localhost:5173/for-parents-schools)
- Wiki: [landing-site](../landing-site.md)

Controls:

- [ ] **Approve** _(button, page)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Review first** _(button, page)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Invite my parent** _(link, page)_ → goes to `/get-started` · Figma ☐
- [ ] **Bring GTH to my school** _(link, page)_ → goes to `/get-started` · Figma ☐
- [ ] **Create my free profile** _(link, page)_ → goes to `/get-started` · Figma ☐
- [ ] **Already registered? Log in** _(link, page)_ → goes to `/login` · Figma ☐

Notes:

### Stories

- [ ] Screen checked · URL: `/stories` (http://localhost:5173/stories)
- Wiki: [landing-site](../landing-site.md)

Controls:

- [ ] **Share my story** _(button, page)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Create my free profile** _(link, page)_ → goes to `/get-started` · Figma ☐
- [ ] **Already registered? Log in** _(link, page)_ → goes to `/login` · Figma ☐

Notes:

### FAQ

- [ ] Screen checked · URL: `/faq` (http://localhost:5173/faq)
- Wiki: [landing-site](../landing-site.md)

Controls:

- [ ] **Getting started 6** _(button, navigation)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Profile and stages 8** _(button, navigation)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Assessments and Skills Lab 7** _(button, navigation)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Opportunities 6** _(button, navigation)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Privacy and safety 9** _(button, navigation)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Parents and under-18s 5** _(button, navigation)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Accessibility and languages 4** _(button, navigation)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Is GTH really free for students?** _(button, page)_ → collapses / closes · Figma ☐
- [ ] **Do I need a CV to start?** _(button, page)_ → switches which item is open · Figma ☐
- [ ] **How long does the profile take?** _(button, page)_ → switches which item is open · Figma ☐
- [ ] **What is Discoverable?** _(button, page)_ → switches which item is open · Figma ☐
- [ ] **Can I retake the personality quiz?** _(button, page)_ → switches which item is open · Figma ☐
- [ ] **What do the skill labels mean?** _(button, page)_ → switches which item is open · Figma ☐
- [ ] **Who can see my profile?** _(button, page)_ → switches which item is open · Figma ☐
- [ ] **Can I hide from my current employer?** _(button, page)_ → switches which item is open · Figma ☐
- [ ] **How do I delete my data?** _(button, page)_ → switches which item is open · Figma ☐
- [ ] **I’m under 18. Can I join?** _(button, page)_ → switches which item is open · Figma ☐
- [ ] **What can my parent see?** _(button, page)_ → switches which item is open · Figma ☐
- [ ] **Start chat** _(button, page)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Send an email** _(link, page)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Open WhatsApp** _(button, page)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Create my free profile** _(link, page)_ → goes to `/get-started` · Figma ☐
- [ ] **Already registered? Log in** _(link, page)_ → goes to `/login` · Figma ☐

Fields to try: Search help

Notes:

### Coming soon

- [ ] Screen checked · URL: `/coming-soon` (http://localhost:5173/coming-soon)
- Wiki: [landing-site](../landing-site.md)

Controls:

- [ ] **Student or graduate** _(radio, page)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Parent** _(radio, page)_ → selects / switches · Figma ☐
- [ ] **School** _(radio, page)_ → selects / switches · Figma ☐
- [ ] **Notify me** _(button, page)_ → changes the view `state=error` · Figma ☐

Fields to try: Your email address

Notes:

## Choose a role

### Get started · role selection

- [ ] Screen checked · URL: `/get-started` (http://localhost:5173/get-started)
- Wiki: [landing-site](../landing-site.md)

Controls:

- [ ] **Log In** _(link, top bar)_ → goes to `/login` · Figma ☐
- [ ] **Talent: Let's build my future.** _(radio, page)_ → selects / switches · Figma ☐
- [ ] **Parent/Guardian: I'm supporting my child.** _(radio, page)_ → selects / switches · Figma ☐
- [ ] **Company/Recruiter: I'm hiring Ghana's best.** _(radio, page)_ → selects / switches · Figma ☐
- [ ] **Select a role to continue** _(button, page)_ → disabled here · Figma ☐
- [ ] **Log in instead** _(link, page)_ → goes to `/login` · Figma ☐

Notes:

### Get started · Recruiter selected

- [ ] Screen checked · URL: `/get-started?role=recruiter` (http://localhost:5173/get-started?role=recruiter)
- Wiki: [landing-site](../landing-site.md)

Controls:

- [ ] **Log In** _(link, top bar)_ → goes to `/login` · Figma ☐
- [ ] **Talent: Let's build my future.** _(radio, page)_ → selects / switches · Figma ☐
- [ ] **Parent/Guardian: I'm supporting my child.** _(radio, page)_ → selects / switches · Figma ☐
- [ ] **Company/Recruiter: I'm hiring Ghana's best.** _(radio, page)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Continue As A Recruiter** _(button, page)_ → goes to `/onboarding/recruiter/profile` · Figma ☐
- [ ] **Log in instead** _(link, page)_ → goes to `/login` · Figma ☐

Notes:

## Sign in

### Log in

- [ ] Screen checked · URL: `/login` (http://localhost:5173/login)
- Wiki: [landing-site](../landing-site.md)

Controls:

- [ ] **Create Account** _(link, top bar)_ → goes to `/get-started` · Figma ☐
- [ ] **Phone Number** _(tab, page)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Email** _(tab, page)_ → selects / switches · Figma ☐
- [ ] **Select country code** _(button, page)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Forget Password** _(link, page)_ → goes to `/forgot-password` · Figma ☐
- [ ] **Show password** _(button, page)_ → selects / switches · Figma ☐
- [ ] **Keep me logged in** _(checkbox, page)_ → selects / switches · Figma ☐
- [ ] **Enter Your Details To Continue** _(button, page)_ → disabled here · Figma ☐
- [ ] **Create an account — it's free** _(link, page)_ → goes to `/get-started` · Figma ☐
- [ ] **Watch talent onboarding tutorial** _(button, sidebar)_ → opens dialog “How to register on GTH” (buttons: Close tutorial · Play tutorial video · 0:00 1 Choose your role Student, Parent, or Recruiter pickin · 0:42 2 Date of birth How age determines your experience on G · 1:15 3 Your details Name, contact, location, and education b · 2:10 4 If you're under 18 The parent contact step and why yo · Got It) · Figma ☐

Fields to try: 23 533 45 · Enter Your Password

Notes:

### Forgot password

- [ ] Screen checked · URL: `/forgot-password` (http://localhost:5173/forgot-password)
- Wiki: [landing-site](../landing-site.md)

Controls:

- [ ] **Log In** _(link, top bar)_ → goes to `/login` · Figma ☐
- [ ] **Send Reset Link** _(button, page)_ → disabled here · Figma ☐
- [ ] **Back to log in** _(link, page)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐
- [ ] **Watch talent onboarding tutorial** _(button, sidebar)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐

Fields to try: you@example.com

Notes:

### Reset password

- [ ] Screen checked · URL: `/reset-password` (http://localhost:5173/reset-password)
- Wiki: [landing-site](../landing-site.md)

Controls:

- [ ] **Log In** _(link, top bar)_ → ⚠ not tested, try it by hand (it could not be clicked, maybe covered by something) · Figma ☐
- [ ] **Request A New Link** _(link, page)_ → goes to `/forgot-password` · Figma ☐
- [ ] **Back to log in** _(link, page)_ → goes to `/login` · Figma ☐
- [ ] **Watch talent onboarding tutorial** _(button, sidebar)_ → opens dialog “How to register on GTH” (buttons: Close tutorial · Play tutorial video · 0:00 1 Choose your role Student, Parent, or Recruiter pickin · 0:42 2 Date of birth How age determines your experience on G · 1:15 3 Your details Name, contact, location, and education b · 2:10 4 If you're under 18 The parent contact step and why yo · Got It) · Figma ☐

Notes:

### Logged out

- [ ] Screen checked · URL: `/logged-out` (http://localhost:5173/logged-out)
- Wiki: [landing-site](../landing-site.md)

Controls:

- [ ] **Log back in** _(button, page)_ → goes to `/login` · Figma ☐
- [ ] **Go to the homepage** _(button, page)_ → goes to `/` · Figma ☐
- [ ] **Log in with a different account** _(link, page)_ → goes to `/login` · Figma ☐

Notes:

## Invites and consent links

### Complete an invite (link from email)

- [ ] Screen checked · URL: `/auth/complete-invite/demo-token` (http://localhost:5173/auth/complete-invite/demo-token)
- ⚠ Opens from an email link and needs a real token from the live backend (a test token shows “This link doesn’t work”): send yourself a real email and check it by hand.
- Wiki: [landing-site](../landing-site.md)

No clickable controls of its own (only shared chrome).

Notes:

### Guardian consent (link from email)

- [ ] Screen checked · URL: `/guardian-consent/demo-token` (http://localhost:5173/guardian-consent/demo-token)
- ⚠ Opens from an email link and needs a real token from the live backend (a test token shows “This link doesn’t work”): send yourself a real email and check it by hand.
- Wiki: [landing-site](../landing-site.md)

No clickable controls of its own (only shared chrome).

Notes:

### School links

- [ ] Screen checked · URL: `/school-links` (http://localhost:5173/school-links)
- ⚠ Without a signed-in session this URL redirects to `/login`: sign in with a test account and check it by hand.
- Wiki: [landing-site](../landing-site.md)

No clickable controls of its own (only shared chrome).

Notes:

## Public profiles

### Public institution page

- [ ] Screen checked · URL: `/institutions/savannah-hills-shs` (http://localhost:5173/institutions/savannah-hills-shs)
- Wiki: [landing-site](../landing-site.md)

Controls:

- [ ] **Ghana Talent Hub Public data** _(link, navigation)_ → goes to `/data` · Figma ☐
- [ ] **Collapse sidebar** _(button, navigation)_ → changes the view `rail=collapsed` · Figma ☐
- [ ] **Home** _(link, navigation)_ → goes to `/data` · Figma ☐
- [ ] **National overview** _(link, navigation)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐
- [ ] **Regions** _(link, navigation)_ → goes to `/data/regions/greater-accra` · Figma ☐
- [ ] **Talent showcase** _(link, navigation)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐
- [ ] **Outcomes** _(link, navigation)_ → goes to `/data/outcomes` · Figma ☐
- [ ] **Directory** _(link, navigation)_ → goes to `/data/partners` · Figma ☐
- [ ] **Methodology** _(link, navigation, 2 on screen)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐
- [ ] **Monthly digest** _(button, navigation, 2 on screen)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐
- [ ] **Partner sign-in →** _(link, navigation)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐
- [ ] **Updated 2 min ago · Live** _(button, top bar)_ → changes something on the page · Figma ☐
- [ ] **Share** _(button, top bar)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐
- [ ] **Try again** _(button, page)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐
- [ ] **Partner directory** _(link, navigation)_ → goes to `/data/methodology` · Figma ☐
- [ ] **Opportunity directory** _(link, navigation)_ → goes to `/data/opportunities` · Figma ☐

Fields to try: Search regions, partners, opportunities

Notes:
