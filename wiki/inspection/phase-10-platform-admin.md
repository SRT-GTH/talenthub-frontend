# Phase 10 · Platform admin

> GTH staff back office: accounts, moderation, verification, reports, live ops, comms, support, settings, site copy, product names, media, audit log.

20 screens · 74 documented states · click map generated 2026-11-11. Back to [all phases](README.md).

## /admin

### admin (portal home and other pages)

- [ ] Screen checked · URL: `/admin` (http://localhost:5173/admin)
- ⚠ Without a signed-in session this URL redirects to `/admin/sign-in?next=%2Fadmin`: sign in with a test account and check it by hand.
- Wiki: [admin](../admin.md), [responsive-plan](../responsive-plan.md)

<details><summary>6 documented states to open and compare with Figma</summary>

- [ ] `/admin?role=dpo`
- [ ] `/admin?role=moderator`
- [ ] `/admin?role=senior`
- [ ] `/admin?role=super`
- [ ] `/admin?role=super&copy=1`
- [ ] `/admin?role=support`

</details>

No clickable controls of its own (only shared chrome).

Notes:

### admin › accounts

- [ ] Screen checked · URL: `/admin/accounts` (http://localhost:5173/admin/accounts)
- ⚠ Without a signed-in session this URL redirects to `/admin/sign-in?next=%2Fadmin%2Faccounts`: sign in with a test account and check it by hand.
- Wiki: [admin](../admin.md)

<details><summary>1 documented states to open and compare with Figma</summary>

- [ ] `/admin/accounts?q=Kwamme&state=empty&role=support`

</details>

No clickable controls of its own (only shared chrome).

Notes:

### admin › accounts › ‹account›

- [ ] Screen checked · URL: `/admin/accounts/TAL-204-8812` (http://localhost:5173/admin/accounts/TAL-204-8812)
- ⚠ Without a signed-in session this URL redirects to `/admin/sign-in?next=%2Fadmin%2Faccounts%2FTAL-204-8812`: sign in with a test account and check it by hand.
- Wiki: [admin](../admin.md)

<details><summary>9 documented states to open and compare with Figma</summary>

- [ ] `/admin/accounts/TAL-204-8812?modal=approval`
- [ ] `/admin/accounts/TAL-204-8812?modal=delete&role=super`
- [ ] `/admin/accounts/TAL-204-8812?modal=override`
- [ ] `/admin/accounts/TAL-204-8812?modal=suspend`
- [ ] `/admin/accounts/TAL-204-8812?role=super`
- [ ] `/admin/accounts/TAL-204-8812?state=suspended`
- [ ] `/admin/accounts/TAL-204-8812?state=suspended&modal=reactivate`
- [ ] `/admin/accounts/TAL-204-8812?view=minor`
- [ ] `/admin/accounts/TAL-204-8812?view=minor&modal=reclassify`

</details>

No clickable controls of its own (only shared chrome).

Notes:

### admin › accounts › merge

- [ ] Screen checked · URL: `/admin/accounts/merge` (http://localhost:5173/admin/accounts/merge)
- ⚠ Without a signed-in session this URL redirects to `/admin/sign-in?next=%2Fadmin%2Faccounts%2Fmerge`: sign in with a test account and check it by hand.
- Wiki: [admin](../admin.md)

<details><summary>2 documented states to open and compare with Figma</summary>

- [ ] `/admin/accounts/merge?modal=blocked`
- [ ] `/admin/accounts/merge?view=minors&modal=parent`

</details>

No clickable controls of its own (only shared chrome).

Notes:

### admin › audit log

- [ ] Screen checked · URL: `/admin/audit-log` (http://localhost:5173/admin/audit-log)
- ⚠ Without a signed-in session this URL redirects to `/admin/sign-in?next=%2Fadmin%2Faudit-log`: sign in with a test account and check it by hand.
- Wiki: [admin](../admin.md)

<details><summary>4 documented states to open and compare with Figma</summary>

- [ ] `/admin/audit-log?role=senior`
- [ ] `/admin/audit-log?role=super`
- [ ] `/admin/audit-log?role=super&modal=event`
- [ ] `/admin/audit-log?role=super&modal=export`

</details>

No clickable controls of its own (only shared chrome).

Notes:

### admin › audit log › ‹event›

- [ ] Screen checked · URL: `/admin/audit-log/:eventId` (needs a real id: open it from a link in this area)
- Needs a real id: reach it from a link on another screen of this phase.

No clickable controls of its own (only shared chrome).

Notes:

### admin › comms (portal home and other pages)

- [ ] Screen checked · URL: `/admin/comms` (http://localhost:5173/admin/comms)
- ⚠ Without a signed-in session this URL redirects to `/admin/sign-in?next=%2Fadmin%2Fcomms`: sign in with a test account and check it by hand.
- Wiki: [admin](../admin.md)

<details><summary>8 documented states to open and compare with Figma</summary>

- [ ] `/admin/comms/bulk?modal=confirm`
- [ ] `/admin/comms/bulk?modal=submit`
- [ ] `/admin/comms/bulk?modal=test`
- [ ] `/admin/comms/message?account=TAL-204-8812`
- [ ] `/admin/comms/templates?modal=edit`
- [ ] `/admin/comms/templates?modal=history`
- [ ] `/admin/comms/templates?modal=publish`
- [ ] `/admin/comms?modal=sending`

</details>

No clickable controls of its own (only shared chrome).

Notes:

### admin › live ops

- [ ] Screen checked · URL: `/admin/live-ops` (http://localhost:5173/admin/live-ops)
- ⚠ Without a signed-in session this URL redirects to `/admin/sign-in?next=%2Fadmin%2Flive-ops`: sign in with a test account and check it by hand.
- Wiki: [admin](../admin.md)

<details><summary>3 documented states to open and compare with Figma</summary>

- [ ] `/admin/live-ops?role=moderator`
- [ ] `/admin/live-ops?role=senior`
- [ ] `/admin/live-ops?role=senior&modal=alert`

</details>

No clickable controls of its own (only shared chrome).

Notes:

### admin › moderation (portal home and other pages)

- [ ] Screen checked · URL: `/admin/moderation` (http://localhost:5173/admin/moderation)
- ⚠ Without a signed-in session this URL redirects to `/admin/sign-in?next=%2Fadmin%2Fmoderation`: sign in with a test account and check it by hand.
- Wiki: [admin](../admin.md)

<details><summary>14 documented states to open and compare with Figma</summary>

- [ ] `/admin/moderation/communities?role=moderator`
- [ ] `/admin/moderation/communities?role=moderator&modal=ask-change`
- [ ] `/admin/moderation/communities?role=moderator&modal=review`
- [ ] `/admin/moderation/flags/FL-2291?role=moderator`
- [ ] `/admin/moderation/flags/FL-2291?role=moderator&modal=claimed`
- [ ] `/admin/moderation/flags/FL-2291?role=moderator&modal=dismiss`
- [ ] `/admin/moderation/flags/FL-2291?role=moderator&modal=escalate`
- [ ] `/admin/moderation/flags/FL-2291?role=moderator&modal=remove`
- [ ] `/admin/moderation/posts?role=moderator`
- [ ] `/admin/moderation/posts?role=moderator&modal=warn`
- [ ] `/admin/moderation/removed?modal=government`
- [ ] `/admin/moderation/removed?modal=restore`
- [ ] `/admin/moderation?role=moderator`
- [ ] `/admin/moderation?state=empty&role=moderator`

</details>

No clickable controls of its own (only shared chrome).

Notes:

### admin › observability

- [ ] Screen checked · URL: `/admin/observability` (http://localhost:5173/admin/observability)
- ⚠ Without a signed-in session this URL redirects to `/admin/sign-in?next=%2Fadmin%2Fobservability`: sign in with a test account and check it by hand.

No clickable controls of its own (only shared chrome).

Notes:

### admin › report

- [ ] Screen checked · URL: `/admin/report` (http://localhost:5173/admin/report)
- ⚠ Without a signed-in session this URL redirects to `/admin/sign-in?next=%2Fadmin%2Freport`: sign in with a test account and check it by hand.
- Wiki: [admin](../admin.md)

<details><summary>1 documented states to open and compare with Figma</summary>

- [ ] `/admin/report?page=1`

</details>

No clickable controls of its own (only shared chrome).

Notes:

### admin › reports (portal home and other pages)

- [ ] Screen checked · URL: `/admin/reports` (http://localhost:5173/admin/reports)
- ⚠ Without a signed-in session this URL redirects to `/admin/sign-in?next=%2Fadmin%2Freports`: sign in with a test account and check it by hand.
- Wiki: [admin](../admin.md)

<details><summary>5 documented states to open and compare with Figma</summary>

- [ ] `/admin/reports/health?modal=blocked&role=super`
- [ ] `/admin/reports/health?modal=export&role=super`
- [ ] `/admin/reports/health?modal=ready&role=super`
- [ ] `/admin/reports?modal=building`
- [ ] `/admin/reports?modal=choose`

</details>

No clickable controls of its own (only shared chrome).

Notes:

### admin › settings

- [ ] Screen checked · URL: `/admin/settings` (http://localhost:5173/admin/settings)
- ⚠ Without a signed-in session this URL redirects to `/admin/sign-in?next=%2Fadmin%2Fsettings`: sign in with a test account and check it by hand.
- Wiki: [admin](../admin.md)

<details><summary>3 documented states to open and compare with Figma</summary>

- [ ] `/admin/settings?role=super`
- [ ] `/admin/settings?role=super&modal=in-use`
- [ ] `/admin/settings?role=super&modal=setting`

</details>

No clickable controls of its own (only shared chrome).

Notes:

### admin › settings › ‹tab›

- [ ] Screen checked · URL: `/admin/settings/staff` (http://localhost:5173/admin/settings/staff)
- ⚠ Without a signed-in session this URL redirects to `/admin/sign-in?next=%2Fadmin%2Fsettings%2Fstaff`: sign in with a test account and check it by hand.
- Wiki: [admin](../admin.md)

<details><summary>5 documented states to open and compare with Figma</summary>

- [ ] `/admin/settings/roles?role=super`
- [ ] `/admin/settings/staff-data?role=super&modal=deactivate`
- [ ] `/admin/settings/staff?role=super`
- [ ] `/admin/settings/staff?role=super&create=1`
- [ ] `/admin/settings/staff?role=super&modal=last-super`

</details>

No clickable controls of its own (only shared chrome).

Notes:

### admin › sign in

- [ ] Screen checked · URL: `/admin/sign-in` (http://localhost:5173/admin/sign-in)
- Wiki: [admin](../admin.md)

<details><summary>3 documented states to open and compare with Figma</summary>

- [ ] `/admin/sign-in?state=code`
- [ ] `/admin/sign-in?state=expired`
- [ ] `/admin/sign-in?state=locked`

</details>

Controls:

- [ ] **Ghana Talent Hub, staff sign-in** _(link, top bar)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Public site** _(link, top bar)_ → goes to `/` · Figma ☐
- [ ] **Forgot password?** _(link, page)_ → goes to `/forgot-password` · Figma ☐
- [ ] **Show password** _(button, page)_ → selects / switches · Figma ☐
- [ ] **Trust this device for 12 hours** _(checkbox, page)_ → selects / switches · Figma ☐
- [ ] **Continue to 2-step sign-in** _(button, page)_ → disabled here · Figma ☐
- [ ] **Ask your Super Admin** _(button, page)_ → ⚠ nothing visible happens · Figma ☐

Fields to try: you@ghanatalenthub.com · Enter Your Password

Notes:

### admin › site copy (portal home and other pages)

- [ ] Screen checked · URL: `/admin/site-copy` (http://localhost:5173/admin/site-copy)
- ⚠ Without a signed-in session this URL redirects to `/admin/sign-in?next=%2Fadmin%2Fsite-copy`: sign in with a test account and check it by hand.
- Wiki: [admin](../admin.md)

No clickable controls of its own (only shared chrome).

Notes:

### admin › staff

- [ ] Screen checked · URL: `/admin/staff` (http://localhost:5173/admin/staff)
- ⚠ Without a signed-in session this URL redirects to `/admin/sign-in?next=%2Fadmin%2Fstaff`: sign in with a test account and check it by hand.

No clickable controls of its own (only shared chrome).

Notes:

### admin › support

- [ ] Screen checked · URL: `/admin/support` (http://localhost:5173/admin/support)
- ⚠ Without a signed-in session this URL redirects to `/admin/sign-in?next=%2Fadmin%2Fsupport`: sign in with a test account and check it by hand.
- Wiki: [admin](../admin.md)

<details><summary>1 documented states to open and compare with Figma</summary>

- [ ] `/admin/support?role=support`

</details>

No clickable controls of its own (only shared chrome).

Notes:

### admin › support › ‹query›

- [ ] Screen checked · URL: `/admin/support/SUP-10451` (http://localhost:5173/admin/support/SUP-10451)
- ⚠ Without a signed-in session this URL redirects to `/admin/sign-in?next=%2Fadmin%2Fsupport%2FSUP-10451`: sign in with a test account and check it by hand.
- Wiki: [admin](../admin.md)

<details><summary>2 documented states to open and compare with Figma</summary>

- [ ] `/admin/support/SUP-10451?modal=escalate`
- [ ] `/admin/support/SUP-10451?modal=reply`

</details>

No clickable controls of its own (only shared chrome).

Notes:

### admin › verification (portal home and other pages)

- [ ] Screen checked · URL: `/admin/verification` (http://localhost:5173/admin/verification)
- ⚠ Without a signed-in session this URL redirects to `/admin/sign-in?next=%2Fadmin%2Fverification`: sign in with a test account and check it by hand.
- Wiki: [admin](../admin.md)

<details><summary>7 documented states to open and compare with Figma</summary>

- [ ] `/admin/verification/appeal?role=super`
- [ ] `/admin/verification/data-request?role=dpo`
- [ ] `/admin/verification/data-request?role=dpo&modal=approve`
- [ ] `/admin/verification/data-request?role=dpo&modal=reject`
- [ ] `/admin/verification/kyb?modal=approve`
- [ ] `/admin/verification/kyb?modal=info`
- [ ] `/admin/verification/kyb?modal=reject`

</details>

No clickable controls of its own (only shared chrome).

Notes:
