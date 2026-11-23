# Phase 5 · Parent

> Parent and guardian sign-up (self-serve and invited by a ward) and the parent dashboard: wards, reviews, flags, wallets, notifications, settings, help.

32 screens · 35 documented states · click map generated 2026-11-11. Back to [all phases](README.md).

## Shared chrome (check once)

- [ ] **Ghana Talent Hub home** _(link, top bar)_ → goes to `/` · Figma ☐
- [ ] **Log In** _(link, top bar)_ → goes to `/onboarding/parent-login` · Figma ☐
- [ ] **Search opportunities, skills, communities... ⌘K** _(button, top bar)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Help** _(button, top bar)_ → goes to `/parent/help` · Figma ☐
- [ ] **5 notifications** _(button, top bar)_ → opens dialog “Notifications” `notif=open` (buttons: Mark all read · Abena wanted you to see this She earned a Python Coding badg · Certificate waiting for you Abena · Intro to Python · 1 h · Payment request GHS 90.00 Abena · expires in 46 h · 2 h · Elliot reviewed your evaluation All 5 items accepted · yeste · Elliot linked to your account He signed up with your number ) · Figma ☐
- [ ] **4 messages** _(button, top bar)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **EN, language: English** _(button, top bar)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Accessibility** _(button, top bar)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Account menu, Emma M.** _(button, top bar)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Switch space** _(button, sidebar)_ → opens a menu: Parent view Abena and Elliot · 2 wards linked · My career Discoverable · 5 of 9 · 18 matches 2 new · Figma ☐
- [ ] **Parent view · tap to switch** _(button, sidebar)_ → opens a menu: Parent view Abena and Elliot · 2 wards linked · My career Discoverable · 5 of 9 · 18 matches 2 new · Figma ☐
- [ ] **1 payment waits for you →** _(link, sidebar)_ → goes to `/parent/review?tab=payments` · Figma ☐
- [ ] **Home** _(link, sidebar)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **My wards** _(link, sidebar)_ → goes to `/parent/wards` · Figma ☐
- [ ] **To review 4** _(link, sidebar)_ → goes to `/parent/review` · Figma ☐
- [ ] **Evaluate** _(link, sidebar)_ → goes to `/parent/evaluate` · Figma ☐
- [ ] **Ward wallets 1** _(link, sidebar)_ → goes to `/parent/wallets` · Figma ☐
- [ ] **Notifications 4** _(link, sidebar)_ → goes to `/parent/notifications` · Figma ☐
- [ ] **Settings** _(link, sidebar)_ → goes to `/parent/settings` · Figma ☐
- [ ] **Help and guides** _(link, sidebar)_ → goes to `/parent/help` · Figma ☐
- [ ] **My career** _(link, sidebar)_ → goes to `/login` · Figma ☐
- [ ] **Switch to My career** _(link, sidebar)_ → ⚠ not tested, try it by hand · Figma ☐
- [ ] **Collapse sidebar** _(button, sidebar)_ → changes the view `rail=collapsed` · Figma ☐

## /onboarding/parent-contact

### onboarding › parent contact

- [ ] Screen checked · URL: `/onboarding/parent-contact` (http://localhost:5173/onboarding/parent-contact)

Controls:

- [ ] **Send Verification Code** _(button, page)_ → disabled here · Figma ☐
- [ ] **Log in Instead** _(link, page)_ → goes to `/onboarding/parent-login` · Figma ☐
- [ ] **Watch parent onboarding tutorial** _(button, sidebar)_ → opens dialog “How to register on GTH” (buttons: Close tutorial · Play tutorial video · 0:00 1 Kofi's account is already active. He registered himse · 0:42 2 If you have concerns, you can remove his access. One · 1:15 3 Your details Name, contact, location, and education b · 2:10 4 No action = Kofi stays active If you complete registr · Got It) · Figma ☐

Fields to try: 23 533 4567 · you@example.com

Notes:

## /onboarding/parent-done

### onboarding › parent done

- [ ] Screen checked · URL: `/onboarding/parent-done` (http://localhost:5173/onboarding/parent-done)

Controls:

- [ ] **Opt-out Kofi instead** _(link, page)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Go to Parent Dashboard** _(button, page)_ → goes to `/` · Figma ☐

Notes:

## /onboarding/parent-identity

### onboarding › parent identity

- [ ] Screen checked · URL: `/onboarding/parent-identity` (http://localhost:5173/onboarding/parent-identity)

Controls:

- [ ] **Select your relationship** _(combobox, page)_ → opens a menu: Mother · Father · Guardian · Grandmother · Grandfather · Uncle · Aunt · Sibling · Other · Figma ☐
- [ ] **Select your Gender** _(combobox, page)_ → opens a menu: Male · Female · Non-binary · Prefer not to say · Figma ☐
- [ ] **Select your Nationality** _(combobox, page)_ → opens a menu: Ghanaian · Nigerian · Ivorian · Togolese · Burkinabé · Beninese · Liberian · Sierra Leonean · Senegalese · Gambian · Malian · Guinean · Figma ☐
- [ ] **Fill In Your Details** _(button, page)_ → disabled here · Figma ☐
- [ ] **Log in Instead** _(link, page)_ → goes to `/onboarding/parent-login` · Figma ☐
- [ ] **Watch parent onboarding tutorial** _(button, sidebar)_ → opens dialog “How to register on GTH” (buttons: Close tutorial · Play tutorial video · 0:00 1 Kofi's account is already active. He registered himse · 0:42 2 If you have concerns, you can remove his access. One · 1:15 3 Your details Name, contact, location, and education b · 2:10 4 No action = Kofi stays active If you complete registr · Got It) · Figma ☐

Fields to try: Enter your first name · Enter your middle name · Enter your last name · DD-MM-YYYY

Notes:

## /onboarding/parent-invited-consent

### onboarding › parent invited consent

- [ ] Screen checked · URL: `/onboarding/parent-invited-consent` (http://localhost:5173/onboarding/parent-invited-consent)

Controls:

- [ ] **Back** _(button, page)_ → goes to `/onboarding/parent-login` · Figma ☐

Notes:

## /onboarding/parent-invited-contact

### onboarding › parent invited contact

- [ ] Screen checked · URL: `/onboarding/parent-invited-contact` (http://localhost:5173/onboarding/parent-invited-contact)

Controls:

- [ ] **Back** _(button, page)_ → goes to `/onboarding/parent-login` · Figma ☐

Fields to try: 24 123 4567 · Leave blank if same as above · you@example.com

Notes:

## /onboarding/parent-invited-identity

### onboarding › parent invited identity

- [ ] Screen checked · URL: `/onboarding/parent-invited-identity` (http://localhost:5173/onboarding/parent-invited-identity)

Controls:

- [ ] **Mother** _(button, page)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Father** _(button, page)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Aunt** _(button, page)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Uncle** _(button, page)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Nephew** _(button, page)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Niece** _(button, page)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Older Sibling** _(button, page)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Grandparent** _(button, page)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Legal Guardian** _(button, page)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Male** _(button, page)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Female** _(button, page)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Month** _(combobox, page)_ → opens a menu: January · February · March · April · May · June · July · August · September · October · November · December · Figma ☐
- [ ] **🇬🇭 Ghanaian** _(button, page)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **🇳🇬 Nigerian** _(button, page)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **🇨🇮 Ivorian** _(button, page)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Other** _(button, page)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Back** _(button, page)_ → goes to `/onboarding/parent-login` · Figma ☐

Fields to try: e.g. Abena · e.g. Mensah · e.g. Kofi · Day · Year

Notes:

## /onboarding/parent-invited-link-ward

### onboarding › parent invited link ward

- [ ] Screen checked · URL: `/onboarding/parent-invited-link-ward` (http://localhost:5173/onboarding/parent-invited-link-ward)

Controls:

- [ ] **Back** _(button, page)_ → goes to `/onboarding/parent-login` · Figma ☐
- [ ] **Confirm & Continue** _(button, page)_ → goes to `/onboarding/parent-invited-consent` · Figma ☐

Notes:

## /onboarding/parent-invited-security

### onboarding › parent invited security

- [ ] Screen checked · URL: `/onboarding/parent-invited-security` (http://localhost:5173/onboarding/parent-invited-security)

Controls:

- [ ] **Back** _(button, page)_ → goes to `/onboarding/parent-login` · Figma ☐

Fields to try: Create a password · Repeat your password

Notes:

## /onboarding/parent-invited-verification

### onboarding › parent invited verification

- [ ] Screen checked · URL: `/onboarding/parent-invited-verification` (http://localhost:5173/onboarding/parent-invited-verification)

Controls:

- [ ] **browse to choose a file** _(button, page, 2 on screen)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Continue without verification** _(button, page)_ → goes to `/onboarding/parent-invited-contact` · Figma ☐
- [ ] **Back** _(button, page)_ → goes to `/onboarding/parent-invited-contact` · Figma ☐
- [ ] **Continue** _(button, page)_ → goes to `/onboarding/parent-invited-contact` · Figma ☐

Notes:

## /onboarding/parent-invited

### onboarding › parent invited

- [ ] Screen checked · URL: `/onboarding/parent-invited` (http://localhost:5173/onboarding/parent-invited)
- Wiki: [onboarding-redesign](../onboarding-redesign.md)

Controls:

- [ ] **Create my parent account** _(button, page)_ → disabled here · Figma ☐
- [ ] **I have concerns — opt-out instead** _(button, page)_ → disabled here · Figma ☐
- [ ] **Log in** _(button, page)_ → goes to `/onboarding/parent-login` · Figma ☐

Notes:

## /onboarding/parent-link-ward

### onboarding › parent link ward

- [ ] Screen checked · URL: `/onboarding/parent-link-ward` (http://localhost:5173/onboarding/parent-link-ward)

Controls:

- [ ] **Confirm & Continue** _(button, page)_ → ⚠ not tested, try it by hand (it could not be clicked, maybe covered by something) · Figma ☐
- [ ] **Log in Instead** _(link, page)_ → ⚠ not tested, try it by hand (it could not be clicked, maybe covered by something) · Figma ☐
- [ ] **Watch parent onboarding tutorial** _(button, sidebar)_ → ⚠ not tested, try it by hand (it could not be clicked, maybe covered by something) · Figma ☐
- [ ] **Dismiss notification** _(button, page)_ → changes something on the page · Figma ☐

Notes:

## /onboarding/parent-login

### onboarding › parent login

- [ ] Screen checked · URL: `/onboarding/parent-login` (http://localhost:5173/onboarding/parent-login)

Controls:

- [ ] **Create Account** _(link, top bar)_ → goes to `/onboarding/parent-welcome` · Figma ☐
- [ ] **Create your account.** _(button, page)_ → goes to `/onboarding/parent-welcome` · Figma ☐
- [ ] **Forget Password** _(button, page)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Show password** _(button, page)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Keep me logged in** _(checkbox, page)_ → selects / switches · Figma ☐
- [ ] **Enter Your Details To Continue** _(button, page)_ → disabled here · Figma ☐
- [ ] **Set up your account** _(button, page)_ → goes to `/onboarding/parent-welcome` · Figma ☐
- [ ] **Watch parent onboarding tutorial** _(button, sidebar)_ → opens dialog “How to register on GTH” (buttons: Close tutorial · Play tutorial video · 0:00 1 Kofi's account is already active. He registered himse · 0:42 2 If you have concerns, you can remove his access. One · 1:15 3 Your details Name, contact, location, and education b · 2:10 4 No action = Kofi stays active If you complete registr · Got It) · Figma ☐
- [ ] **Dismiss notification** _(button, page)_ → changes something on the page · Figma ☐

Fields to try: davidadzato45gmail.com or 0245224995 · Enter Your Password

Notes:

## /onboarding/parent-review

### onboarding › parent review

- [ ] Screen checked · URL: `/onboarding/parent-review` (http://localhost:5173/onboarding/parent-review)

Controls:

- [ ] **EDIT** _(button, page, 4 on screen)_ → goes to `/onboarding/parent-verification` · Figma ☐
- [ ] **I understand my ward has immediate platform access. How the opt-out model works** _(checkbox, page)_ → selects / switches · Figma ☐
- [ ] **How the opt-out model works** _(link, page)_ → opens dialog “Immediate access what it means” (buttons: Close · Read full document · I understand and Accept) · Figma ☐
- [ ] **I have read and accept the Parent Rights Policy. Read Parent Rights Policy** _(checkbox, page)_ → selects / switches · Figma ☐
- [ ] **Read Parent Rights Policy** _(link, page)_ → opens dialog “Your rights as a parent” (buttons: Close · Read full document · I understand and Accept) · Figma ☐
- [ ] **I consent to Ghana Talent Hub processing my data. Learn more about data processing.** _(checkbox, page)_ → selects / switches · Figma ☐
- [ ] **Learn more about data processing** _(link, page)_ → opens dialog “Data Processing Consent” (buttons: Close · Read full document · I understand and Accept) · Figma ☐
- [ ] **Log in Instead** _(link, page)_ → goes to `/onboarding/parent-login` · Figma ☐

Notes:

## /onboarding/parent-security

### onboarding › parent security

- [ ] Screen checked · URL: `/onboarding/parent-security` (http://localhost:5173/onboarding/parent-security)

Controls:

- [ ] **Show password** _(button, page, 2 on screen)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Create a New Password** _(button, page)_ → disabled here · Figma ☐
- [ ] **Log in Instead** _(link, page)_ → goes to `/onboarding/parent-login` · Figma ☐
- [ ] **Watch parent onboarding tutorial** _(button, sidebar)_ → opens dialog “How to register on GTH” (buttons: Close tutorial · Play tutorial video · 0:00 1 Kofi's account is already active. He registered himse · 0:42 2 If you have concerns, you can remove his access. One · 1:15 3 Your details Name, contact, location, and education b · 2:10 4 No action = Kofi stays active If you complete registr · Got It) · Figma ☐

Fields to try: Create a password

Notes:

## /onboarding/parent-verification

### onboarding › parent verification

- [ ] Screen checked · URL: `/onboarding/parent-verification` (http://localhost:5173/onboarding/parent-verification)

Controls:

- [ ] **Continue without verification** _(link, page)_ → goes to `/onboarding/parent-contact` · Figma ☐
- [ ] **Fill In Your Details** _(button, page)_ → disabled here · Figma ☐
- [ ] **Log in Instead** _(link, page)_ → goes to `/onboarding/parent-login` · Figma ☐
- [ ] **Watch parent onboarding tutorial** _(button, sidebar)_ → opens dialog “How to register on GTH” (buttons: Close tutorial · Play tutorial video · 0:00 1 Kofi's account is already active. He registered himse · 0:42 2 If you have concerns, you can remove his access. One · 1:15 3 Your details Name, contact, location, and education b · 2:10 4 No action = Kofi stays active If you complete registr · Got It) · Figma ☐

Fields to try: Ghana Card ID · Profile Photo

Notes:

## /onboarding/parent-welcome

### onboarding › parent welcome

- [ ] Screen checked · URL: `/onboarding/parent-welcome` (http://localhost:5173/onboarding/parent-welcome)

Controls:

- [ ] **Create My Parent Account** _(button, page)_ → ⚠ not tested, try it by hand (it could not be clicked, maybe covered by something) · Figma ☐
- [ ] **I Have Concerns — Opt-Out Instead** _(button, page)_ → ⚠ not tested, try it by hand (it could not be clicked, maybe covered by something) · Figma ☐
- [ ] **Log in Instead** _(button, page)_ → ⚠ not tested, try it by hand (it could not be clicked, maybe covered by something) · Figma ☐
- [ ] **Watch parent onboarding tutorial** _(button, sidebar)_ → ⚠ not tested, try it by hand (it could not be clicked, maybe covered by something) · Figma ☐
- [ ] **Dismiss notification** _(button, page)_ → changes something on the page · Figma ☐

Notes:

## /parent

### parent (portal home and other pages)

- [ ] Screen checked · URL: `/parent` (http://localhost:5173/parent)
- Wiki: [parent-buddy](../parent-buddy.md), [parent-dashboard](../parent-dashboard.md), [parent-link-ward](../parent-link-ward.md), [parent-notifications](../parent-notifications.md), [parent-spaces](../parent-spaces.md)

<details><summary>12 documented states to open and compare with Figma</summary>

- [ ] `/parent?buddy=slow`
- [ ] `/parent?buddy=stopped`
- [ ] `/parent?buddy=thinking`
- [ ] `/parent?buddy=working`
- [ ] `/parent?buddy=writing`
- [ ] `/parent?career=none&modal=career-profile`
- [ ] `/parent?menu=switch`
- [ ] `/parent?modal=ward-linked`
- [ ] `/parent?notice=abena-joined`
- [ ] `/parent?notif=open`
- [ ] `/parent?notif=open&spaces=both`
- [ ] `/parent?state=none`

</details>

Controls:

- [ ] **Review now** _(link, page)_ → goes to `/parent/review` · Figma ☐
- [ ] **Evaluate my child** _(link, page)_ → goes to `/parent/evaluate` · Figma ☐
- [ ] **Link a ward** _(link, page)_ → goes to `/parent/link-ward` · Figma ☐
- [ ] **Customize** _(button, page, 2 on screen)_ → ⚠ not tested, try it by hand · Figma ☐
- [ ] **Overview** _(tab, page)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Abena 1 flag** _(tab, page)_ → goes to `/parent/wards/abena?tab=flags` · Figma ☐
- [ ] **Elliot 2 to review** _(tab, page)_ → goes to `/parent/wards/elliot` · Figma ☐
- [ ] **All wards** _(link, page)_ → goes to `/parent/wards` · Figma ☐
- [ ] **Open Abena** _(link, page, 2 on screen)_ → goes to `/parent/wards/abena` · Figma ☐
- [ ] **Open Elliot** _(link, page)_ → goes to `/parent/wards/elliot` · Figma ☐
- [ ] **Remind Kwesi** _(link, page)_ → goes to `/parent/link-ward?step=sent` · Figma ☐
- [ ] **To review (4)** _(link, page)_ → goes to `/parent/review` · Figma ☐
- [ ] **Review** _(link, page)_ → goes to `/parent/review?tab=certificates&modal=certificate` · Figma ☐
- [ ] **Decide** _(link, page)_ → goes to `/parent/review?tab=payments` · Figma ☐
- [ ] **Check** _(link, page)_ → goes to `/parent/review?tab=corrections` · Figma ☐
- [ ] **See all** _(link, page)_ → goes to `/parent/wards/abena?tab=activity` · Figma ☐
- [ ] **Send Abena a note** _(link, page)_ → goes to `/parent/notifications/milestone` · Figma ☐
- [ ] **See all** _(button, page)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐
- [ ] **Ask Buddy** _(button, page)_ → opens dialog “Career Buddy” `buddy=open` (buttons: History · Expand · Close · What needs my approval? · How does opting out work? · Explain Abena’s wallet · Send) · Figma ☐

Notes:

### parent › evaluate

- [ ] Screen checked · URL: `/parent/evaluate` (http://localhost:5173/parent/evaluate)
- Wiki: [parent-dashboard](../parent-dashboard.md), [parent-wiring](../parent-wiring.md)

<details><summary>2 documented states to open and compare with Figma</summary>

- [ ] `/parent/evaluate?state=none`
- [ ] `/parent/evaluate?state=resume`

</details>

Controls:

- [ ] **Abena · 16** _(radio, page)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Elliot · 15** _(radio, page)_ → selects / switches · Figma ☐
- [ ] **General evaluation A rounded picture · 20 questions · about 10 min** _(radio, page)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Academic strengths Subjects, study habits · 15 questions** _(radio, page)_ → selects / switches · Figma ☐
- [ ] **Character & social skills How they work with others · 15 questions** _(radio, page)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐
- [ ] **Career interests What lights them up · 12 questions** _(radio, page)_ → selects / switches · Figma ☐
- [ ] **Start evaluation** _(button, page)_ → goes to `/parent/evaluate/questions?state=general` · Figma ☐
- [ ] **Ask Buddy** _(button, page)_ → opens dialog “Career Buddy” `buddy=open` (buttons: History · Expand · Close · What needs my approval? · How does opting out work? · Explain Abena’s wallet · Send) · Figma ☐

Notes:

### parent › evaluate › questions

- [ ] Screen checked · URL: `/parent/evaluate/questions` (http://localhost:5173/parent/evaluate/questions)
- Wiki: [parent-dashboard](../parent-dashboard.md)

Controls:

- [ ] **Speaks up confidently and enjoys it** _(radio, page)_ → selects / switches · Figma ☐
- [ ] **Manages well once she has prepared** _(radio, page)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Gets nervous but still does it** _(radio, page)_ → selects / switches · Figma ☐
- [ ] **Avoids it if she can** _(radio, page)_ → selects / switches · Figma ☐
- [ ] **Discard evaluation** _(button, page)_ → opens dialog “Discard this evaluation?” (buttons: Close · Keep going · Discard evaluation) · Figma ☐
- [ ] **Back** _(button, page)_ → goes to `/parent/evaluate` · Figma ☐
- [ ] **Next question** _(button, page)_ → selects / switches · Figma ☐
- [ ] **Ask Buddy** _(button, page)_ → opens dialog “Career Buddy” `buddy=open` (buttons: History · Expand · Close · What needs my approval? · How does opting out work? · Explain Abena’s wallet · Send) · Figma ☐

Fields to try: text

Notes:

### parent › evaluate › result

- [ ] Screen checked · URL: `/parent/evaluate/result` (http://localhost:5173/parent/evaluate/result)
- Wiki: [parent-dashboard](../parent-dashboard.md)

Controls:

- [ ] **Evaluate Elliot next** _(link, page)_ → goes to `/parent/evaluate` · Figma ☐
- [ ] **Back to Home** _(link, page)_ → goes to `/parent` · Figma ☐
- [ ] **Ask Buddy** _(button, page)_ → opens dialog “Career Buddy” `buddy=open` (buttons: History · Expand · Close · What needs my approval? · How does opting out work? · Explain Abena’s wallet · Send) · Figma ☐

Notes:

### parent › help

- [ ] Screen checked · URL: `/parent/help` (http://localhost:5173/parent/help)
- Wiki: [parent-dashboard](../parent-dashboard.md), [parent-opt-out](../parent-opt-out.md)

<details><summary>1 documented states to open and compare with Figma</summary>

- [ ] `/parent/help?modal=report-sent&about=abena`

</details>

Controls:

- [ ] **Opting out and privacy What opt-out does, what’s kept, and how to restore access.** _(button, page)_ → ⚠ not tested, try it by hand · Figma ☐
- [ ] **Flagging your ward’s profile You flag, they fix. Why parents can’t edit.** _(button, page)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Approving certificates Why uploads wait for you and what to check.** _(button, page)_ → ⚠ not tested, try it by hand · Figma ☐
- [ ] **Evaluating your child 20 questions, autosave, and what your ward sees.** _(button, page)_ → ⚠ not tested, try it by hand · Figma ☐
- [ ] **Starter wallets and limits Payments over your limit, Cycles, and withdrawals at 18.** _(button, page)_ → ⚠ not tested, try it by hand · Figma ☐
- [ ] **When your ward turns 18 What changes and how to stay a trusted contact.** _(button, page)_ → ⚠ not tested, try it by hand · Figma ☐
- [ ] **Chat on WhatsApp** _(button, sidebar)_ → ⚠ not tested, try it by hand · Figma ☐
- [ ] **Report a concern** _(button, sidebar)_ → ⚠ not tested, try it by hand · Figma ☐
- [ ] **Ask Buddy** _(button, page)_ → ⚠ not tested, try it by hand · Figma ☐

Fields to try: Try “opt out” or “payment limit”

Notes:

### parent › help › ‹topic›

- [ ] Screen checked · URL: `/parent/help/opting-out` (http://localhost:5173/parent/help/opting-out)
- Wiki: [parent-dashboard](../parent-dashboard.md)

Controls:

- [ ] **Help and guides** _(link, page)_ → goes to `/parent/help` · Figma ☐
- [ ] **Yes** _(button, page)_ → ⚠ not tested, try it by hand · Figma ☐
- [ ] **Not really** _(button, page)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐
- [ ] **Flagging your ward’s profile →** _(button, sidebar)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **When your ward turns 18 →** _(button, sidebar)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Report a safety concern →** _(link, sidebar)_ → goes to `/parent/help?modal=report` · Figma ☐
- [ ] **Ask Buddy** _(button, page)_ → opens dialog “Career Buddy” `buddy=open` (buttons: History · Expand · Close · What needs my approval? · How does opting out work? · Explain Abena’s wallet · Send) · Figma ☐

Notes:

### parent › link ward

- [ ] Screen checked · URL: `/parent/link-ward` (http://localhost:5173/parent/link-ward)
- Wiki: [parent-dashboard](../parent-dashboard.md), [parent-link-ward](../parent-link-ward.md), [parent-testing-a11y](../parent-testing-a11y.md), [parent-wiring](../parent-wiring.md)

<details><summary>1 documented states to open and compare with Figma</summary>

- [ ] `/parent/link-ward?F`

</details>

Controls:

- [ ] **Son** _(radio, page)_ → changes the view `rel=son` · Figma ☐
- [ ] **Daughter** _(radio, page)_ → changes the view `rel=daughter` · Figma ☐
- [ ] **Nephew** _(radio, page)_ → changes the view `rel=nephew` · Figma ☐
- [ ] **Niece** _(radio, page)_ → changes the view `rel=niece` · Figma ☐
- [ ] **Ward** _(radio, page)_ → changes the view `rel=ward` · Figma ☐
- [ ] **Younger sibling** _(radio, page)_ → changes the view `rel=younger-sibling` · Figma ☐
- [ ] **Ask Buddy** _(button, page)_ → opens dialog “Career Buddy” `buddy=open` (buttons: History · Expand · Close · What needs my approval? · How does opting out work? · Explain Abena’s wallet · Send) · Figma ☐

Fields to try: text · DD / MM / YYYY

Notes:

### parent › notifications

- [ ] Screen checked · URL: `/parent/notifications` (http://localhost:5173/parent/notifications)
- Wiki: [parent-notifications](../parent-notifications.md)

Controls:

- [ ] **All 11** _(link, navigation)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐
- [ ] **Approvals 2** _(link, navigation)_ → ⚠ not tested, try it by hand · Figma ☐
- [ ] **Milestones 3** _(link, navigation)_ → changes the view `tab=milestones` · Figma ☐
- [ ] **Ward activity 5** _(link, navigation)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐
- [ ] **From GTH 1** _(link, navigation)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐
- [ ] **Abena wanted you to see this She earned the Python Coding badge · 2 min Milestone** _(link, page)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐
- [ ] **Certificate waiting for you Abena · Intro to Python · 1 h Needs you** _(link, page)_ → goes to `/parent/review?tab=certificates` ⚠ page looks empty · Figma ☐
- [ ] **Payment request GHS 90.00 Abena · expires in 46 h · 2 h Needs you** _(link, page)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐
- [ ] **Elliot reviewed your evaluation All 5 items accepted · yesterday Ward activity** _(link, page)_ → goes to `/parent/wards/elliot?tab=evaluations` · Figma ☐
- [ ] **Abena corrected her date of birth After your flag · Wed Ward activity** _(link, page)_ → ⚠ not tested, try it by hand · Figma ☐
- [ ] **Elliot linked to your account He signed up with your number · 9 Sep Ward activity** _(link, page)_ → goes to `/parent/wards/elliot` ⚠ page looks empty · Figma ☐
- [ ] **Notification settings** _(link, sidebar)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐
- [ ] **Ask Buddy** _(button, page)_ → opens dialog “Career Buddy” `buddy=open` (buttons: History · Expand · Close · What needs my approval? · How does opting out work? · Explain Abena’s wallet · Send) · Figma ☐

Notes:

### parent › notifications › milestone

- [ ] Screen checked · URL: `/parent/notifications/milestone` (http://localhost:5173/parent/notifications/milestone)
- Wiki: [parent-notifications](../parent-notifications.md), [parent-wiring](../parent-wiring.md)

<details><summary>1 documented states to open and compare with Figma</summary>

- [ ] `/parent/notifications/milestone?toast=sent`

</details>

Controls:

- [ ] **Well done!** _(radio, page)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐
- [ ] **So proud of you** _(radio, page)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐
- [ ] **Keep going** _(radio, page)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐
- [ ] **Write my own** _(radio, page)_ → ⚠ not tested, try it by hand · Figma ☐
- [ ] **View Abena** _(link, page)_ → ⚠ not tested, try it by hand · Figma ☐
- [ ] **Send reaction** _(button, page)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐
- [ ] **Ask Buddy** _(button, page)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐

Notes:

### parent › review

- [ ] Screen checked · URL: `/parent/review` (http://localhost:5173/parent/review)
- Wiki: [parent-flags](../parent-flags.md), [parent-review](../parent-review.md), [parent-wiring](../parent-wiring.md)

<details><summary>2 documented states to open and compare with Figma</summary>

- [ ] `/parent/review?tab=corrections`
- [ ] `/parent/review?tab=payments`

</details>

Controls:

- [ ] **All 4** _(link, navigation)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Certificates 1** _(link, navigation)_ → changes the view `tab=certificates` · Figma ☐
- [ ] **Evaluations 1** _(link, navigation)_ → changes the view `tab=evaluations` · Figma ☐
- [ ] **Corrections 1** _(link, navigation)_ → changes the view `tab=corrections` · Figma ☐
- [ ] **Payments 1** _(link, navigation)_ → changes the view `tab=payments` · Figma ☐
- [ ] **Review** _(button, page, 2 on screen)_ → opens dialog “Abena’s certificate” `modal=certificate` (buttons: Close · Open full file (PDF, 420 KB) · Decline with a note · Approve) · Figma ☐
- [ ] **Check** _(link, page)_ → goes to `/parent/wards/abena?tab=flags&modal=recheck&flag=dob` · Figma ☐
- [ ] **Decide** _(button, page)_ → goes to `/parent/wallets?modal=approve` · Figma ☐
- [ ] **Ask Buddy** _(button, page)_ → opens dialog “Career Buddy” `buddy=open` (buttons: History · Expand · Close · What needs my approval? · How does opting out work? · Explain Abena’s wallet · Send) · Figma ☐

Notes:

### parent › settings

- [ ] Screen checked · URL: `/parent/settings` (http://localhost:5173/parent/settings)
- Wiki: [parent-settings](../parent-settings.md), [parent-spaces](../parent-spaces.md), [parent-wiring](../parent-wiring.md)

<details><summary>2 documented states to open and compare with Figma</summary>

- [ ] `/parent/settings?tab=notifications`
- [ ] `/parent/settings?tab=roles`

</details>

Controls:

- [ ] **Account** _(link, navigation)_ → changes the view `tab=account` · Figma ☐
- [ ] **Your roles** _(link, navigation)_ → changes the view `tab=roles` · Figma ☐
- [ ] **Notifications** _(link, navigation)_ → changes the view `tab=notifications` · Figma ☐
- [ ] **Accessibility** _(link, navigation)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Language and data** _(link, navigation)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Security and sign-in** _(link, navigation)_ → changes the view `tab=security` · Figma ☐
- [ ] **Data and account** _(link, navigation)_ → changes the view `tab=data` · Figma ☐
- [ ] **Log out** _(button, navigation)_ → opens dialog “Log out of GTH?” `modal=logout` (buttons: Close · Stay · Log out) · Figma ☐
- [ ] **Your roles** _(button, page)_ → changes the view `tab=roles` · Figma ☐
- [ ] **Change photo** _(button, page)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Cancel** _(button, page)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Save changes** _(button, page)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Ask Buddy** _(button, page)_ → opens dialog “Career Buddy” `buddy=open` (buttons: History · Expand · Close · What needs my approval? · How does opting out work? · Explain Abena’s wallet · Send) · Figma ☐

Fields to try: text · email · tel

Notes:

### parent › wallets

- [ ] Screen checked · URL: `/parent/wallets` (http://localhost:5173/parent/wallets)
- Wiki: [parent-wallets](../parent-wallets.md), [parent-wiring](../parent-wiring.md)

<details><summary>1 documented states to open and compare with Figma</summary>

- [ ] `/parent/wallets?modal=approve`

</details>

Controls:

- [ ] **Decline** _(button, page)_ → opens dialog “Decline Abena’s GHS 90 payment?” `modal=decline` (buttons: Close · Let’s talk first · Too expensive · Not right now · Other · Cancel · Decline payment) · Figma ☐
- [ ] **Approve** _(button, page)_ → opens dialog “Approve GHS 90.00 for Abena?” `modal=approve` (buttons: Close · Decline · Approve payment) · Figma ☐
- [ ] **Elliot hasn’t opened a wallet He has 60 Cycles waiting. It opens when he asks and you’re t** _(button, page)_ → opens dialog “Elliot wants a Starter wallet” `modal=open-wallet` (buttons: Close · Not now · Open Elliot’s wallet) · Figma ☐
- [ ] **Change limits** _(button, sidebar)_ → opens dialog “Abena’s limits” `modal=limits` (buttons: Close · Cancel · Save limits) · Figma ☐
- [ ] **Ask Buddy** _(button, page)_ → ⚠ not tested, try it by hand · Figma ☐

Notes:

### parent › wards

- [ ] Screen checked · URL: `/parent/wards` (http://localhost:5173/parent/wards)
- Wiki: [parent-dashboard](../parent-dashboard.md), [parent-link-ward](../parent-link-ward.md), [parent-opt-out](../parent-opt-out.md), [parent-settings](../parent-settings.md), [parent-testing-a11y](../parent-testing-a11y.md), [parent-wiring](../parent-wiring.md)

<details><summary>2 documented states to open and compare with Figma</summary>

- [ ] `/parent/wards?toast=accepted`
- [ ] `/parent/wards?unlinked=elliot`

</details>

Controls:

- [ ] **Link another ward** _(button, page)_ → goes to `/parent/link-ward` · Figma ☐
- [ ] **Open →** _(link, page)_ → goes to `/parent/wards/abena` · Figma ☐
- [ ] **Open →** _(link, page)_ → goes to `/parent/wards/elliot` · Figma ☐
- [ ] **Resend** _(button, page)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Ask Buddy** _(button, page)_ → opens dialog “Career Buddy” `buddy=open` (buttons: History · Expand · Close · What needs my approval? · How does opting out work? · Explain Abena’s wallet · Send) · Figma ☐

Notes:

### parent › wards › ‹ward›

- [ ] Screen checked · URL: `/parent/wards/abena` (http://localhost:5173/parent/wards/abena)
- Wiki: [parent-dashboard](../parent-dashboard.md), [parent-flags](../parent-flags.md), [parent-link-ward](../parent-link-ward.md), [parent-notifications](../parent-notifications.md), [parent-opt-out](../parent-opt-out.md), [parent-review](../parent-review.md), [parent-wallets](../parent-wallets.md)

<details><summary>11 documented states to open and compare with Figma</summary>

- [ ] `/parent/wards/abena?modal=opt-out`
- [ ] `/parent/wards/abena?modal=report`
- [ ] `/parent/wards/abena?notice=turning18`
- [ ] `/parent/wards/abena?state=opted-out`
- [ ] `/parent/wards/abena?state=opted-out&modal=restore`
- [ ] `/parent/wards/abena?tab=flags`
- [ ] `/parent/wards/abena?tab=flags&modal=recheck&flag=dob`
- [ ] `/parent/wards/abena?tab=profile`
- [ ] `/parent/wards/abena?tab=wallet`
- [ ] `/parent/wards/abena?toast=access-restored`
- [ ] `/parent/wards/elliot?modal=unlink`

</details>

Controls:

- [ ] **Who can find Abena** _(button, page)_ → opens dialog “Who can find Abena” `modal=visibility` (buttons: Close · Verified partners only Recommended · schools, NGOs and appro · Hidden from search Nobody can find her. She can still learn · Cancel · Save) · Figma ☐
- [ ] **Review profile** _(link, page)_ → changes the view `tab=profile` · Figma ☐
- [ ] **Evaluate Abena** _(button, page)_ → goes to `/parent/evaluate` · Figma ☐
- [ ] **Unlink** _(button, page)_ → opens dialog “Unlink Abena from your account?” `modal=unlink` (buttons: Close · Cancel · Unlink Abena) · Figma ☐
- [ ] **Opt out** _(button, page)_ → opens dialog “Opt Abena out of GTH?” `modal=opt-out` (buttons: Close · Privacy concerns · Safety concerns · Too young · Other · Keep access · Opt out Abena) · Figma ☐
- [ ] **Overview** _(link, navigation)_ → changes the view `tab=overview` · Figma ☐
- [ ] **Profile** _(link, navigation)_ → changes the view `tab=profile` · Figma ☐
- [ ] **Flags 2** _(link, navigation)_ → changes the view `tab=flags` · Figma ☐
- [ ] **Evaluations 1** _(link, navigation)_ → changes the view `tab=evaluations` · Figma ☐
- [ ] **Wallet** _(link, navigation)_ → changes the view `tab=wallet` · Figma ☐
- [ ] **Crew** _(link, navigation)_ → changes the view `tab=crew` · Figma ☐
- [ ] **Activity** _(link, navigation)_ → changes the view `tab=activity` · Figma ☐
- [ ] **All activity →** _(link, page)_ → changes the view `tab=activity` · Figma ☐
- [ ] **Ask Buddy** _(button, page)_ → opens dialog “Career Buddy” `buddy=open` (buttons: History · Expand · Close · What needs my approval? · How does opting out work? · Explain Abena’s wallet · Send) · Figma ☐

Notes:

### parent › wards › ‹ward› › flags

- [ ] Screen checked · URL: `/parent/wards/:wardId/flags` (needs a real id: open it from a link in this area)
- Needs a real id: reach it from a link on another screen of this phase.

No clickable controls of its own (only shared chrome).

Notes:

### parent › wards › ‹ward› › profile

- [ ] Screen checked · URL: `/parent/wards/:wardId/profile` (needs a real id: open it from a link in this area)
- Needs a real id: reach it from a link on another screen of this phase.

No clickable controls of its own (only shared chrome).

Notes:
