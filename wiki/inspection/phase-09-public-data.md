# Phase 9 · Public data

> The public dashboards under /data for the public, investors and government audiences.

21 screens · 55 documented states · click map generated 2026-11-11. Back to [all phases](README.md).

## Shared chrome (check once)

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
- [ ] **Partner directory** _(link, navigation)_ → goes to `/data/partners` · Figma ☐
- [ ] **Opportunity directory** _(link, navigation)_ → goes to `/data/opportunities` · Figma ☐

## /data

### data › \_ui

- [ ] Screen checked · URL: `/data/_ui` (http://localhost:5173/data/\_ui)

Controls:

- [ ] **Go to national snapshot** _(button, page)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐
- [ ] **Browse regions** _(button, page)_ → goes to `/data/regions/greater-accra` · Figma ☐

Fields to try: Search regions, partners, opportunities · Search regions, partners or opportunities

Notes:

### data (portal home and other pages)

- [ ] Screen checked · URL: `/data` (http://localhost:5173/data)
- Wiki: [public-data](../public-data.md)

<details><summary>2 documented states to open and compare with Figma</summary>

- [ ] `/data?state=fallback`
- [ ] `/data?state=returning`

</details>

Controls:

- [ ] **View the national snapshot** _(link, page)_ → goes to `/data/overview` · Figma ☐
- [ ] **For partners** _(link, page)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐
- [ ] **For recruiters** _(link, page)_ → goes to `/login` · Figma ☐
- [ ] **Explore regions →** _(link, page)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐
- [ ] **Meet the talents →** _(link, page)_ → goes to `/data/showcase` · Figma ☐
- [ ] **See outcomes →** _(link, page)_ → goes to `/data/outcomes` · Figma ☐
- [ ] **Browse directory →** _(link, page)_ → goes to `/data/partners` · Figma ☐
- [ ] **Open methodology** _(link, page)_ → goes to `/data/methodology` · Figma ☐

Fields to try: Search regions, partners, opportunities

Notes:

### data › compare

- [ ] Screen checked · URL: `/data/compare` (http://localhost:5173/data/compare)
- Wiki: [public-data](../public-data.md)

<details><summary>3 documented states to open and compare with Figma</summary>

- [ ] `/data/compare?regions=greater-accra,ashanti`
- [ ] `/data/compare?regions=greater-accra,ashanti&modal=compare`
- [ ] `/data/compare?regions=greater-accra,ashanti,northern`

</details>

Controls:

- [ ] **National** _(link, navigation)_ → goes to `/data/overview` · Figma ☐
- [ ] **+ Add a region** _(button, top bar)_ → opens dialog “Choose regions to compare” `modal=compare` (buttons: Close · Clear · Compare 2 regions) · Figma ☐
- [ ] **Try again** _(button, page)_ → ⚠ nothing visible happens · Figma ☐

Fields to try: Search regions, partners, opportunities

Notes:

### data › digest › unsubscribed

- [ ] Screen checked · URL: `/data/digest/unsubscribed` (http://localhost:5173/data/digest/unsubscribed)
- Wiki: [public-data](../public-data.md)

Controls:

- [ ] **Undo · resubscribe** _(button, page)_ → goes to `/data/overview?modal=digest&state=success` · Figma ☐
- [ ] **Go to the national snapshot** _(button, page)_ → goes to `/data/overview` · Figma ☐

Fields to try: Search regions, partners, opportunities

Notes:

### data › error

- [ ] Screen checked · URL: `/data/error` (http://localhost:5173/data/error)
- Wiki: [public-data](../public-data.md)

Controls:

- [ ] **Try again** _(button, page)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Check service status** _(button, page)_ → goes to `/data/maintenance` · Figma ☐

Fields to try: Search regions, partners, opportunities

Notes:

### data › maintenance

- [ ] Screen checked · URL: `/data/maintenance` (http://localhost:5173/data/maintenance)
- Wiki: [public-data](../public-data.md)

Controls:

- [ ] **Paused for maintenance** _(button, top bar)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Get notified when we’re back** _(button, page)_ → opens dialog “Get the monthly digest” `modal=digest` (buttons: Close · Government Investor Public · National + Volta ▾ · Cancel · Subscribe) · Figma ☐
- [ ] **Download last snapshot (PDF)** _(button, page)_ → opens dialog “Download a PDF snapshot” `modal=download` (buttons: Close · Cancel · Download PDF) · Figma ☐

Fields to try: Search regions, partners, opportunities

Notes:

### data › methodology

- [ ] Screen checked · URL: `/data/methodology` (http://localhost:5173/data/methodology)
- Wiki: [public-data](../public-data.md)

<details><summary>2 documented states to open and compare with Figma</summary>

- [ ] `/data/methodology?tip=freshness`
- [ ] `/data/methodology?tip=suppression`

</details>

Controls:

- [ ] **Where the data comes from** _(link, navigation)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **How we count** _(link, navigation)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Privacy protections** _(link, navigation)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **How fresh the data is** _(link, navigation)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Definitions** _(link, navigation)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Known limitations** _(link, navigation)_ → ⚠ nothing visible happens · Figma ☐
- [ ] **Changes to this page** _(link, navigation)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐
- [ ] **Download as PDF** _(button, navigation)_ → opens dialog “Download a PDF snapshot” `modal=download` (buttons: Close · Cancel · Download PDF) · Figma ☐
- [ ] **Ask the data team** _(link, sidebar)_ → ⚠ nothing visible happens · Figma ☐

Fields to try: Search regions, partners, opportunities

Notes:

### data › opportunities

- [ ] Screen checked · URL: `/data/opportunities` (http://localhost:5173/data/opportunities)
- Wiki: [public-data](../public-data.md)

<details><summary>1 documented states to open and compare with Figma</summary>

- [ ] `/data/opportunities?type=training&closing=month`

</details>

Controls:

- [ ] **Partners** _(link, navigation)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐
- [ ] **Opportunities** _(link, navigation)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐
- [ ] **Type ▾** _(button, page)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐
- [ ] **Region ▾** _(button, page)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐
- [ ] **Deadline ▾** _(button, page)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐
- [ ] **Eligibility ▾** _(button, page)_ → opens a menu: Anyone ✓ · Any education · SHS completed · In-tertiary · Post-tertiary · No prior experience · Figma ☐

Fields to try: Search regions, partners, opportunities · Search opportunities

Notes:

### data › opportunities › ‹opportunity›

- [ ] Screen checked · URL: `/data/opportunities/intro-to-coding` (http://localhost:5173/data/opportunities/intro-to-coding)
- Wiki: [public-data](../public-data.md)

Controls:

- [ ] **Directory** _(link, navigation)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐
- [ ] **Opportunities** _(link, navigation)_ → goes to `/data/opportunities` · Figma ☐
- [ ] **Apply on GTH** _(link, sidebar)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐
- [ ] **Share with someone who should apply** _(button, sidebar)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐
- [ ] **View partner →** _(link, sidebar)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐

Fields to try: Search regions, partners, opportunities

Notes:

### data › outcomes

- [ ] Screen checked · URL: `/data/outcomes` (http://localhost:5173/data/outcomes)
- Wiki: [public-data](../public-data.md)

<details><summary>2 documented states to open and compare with Figma</summary>

- [ ] `/data/outcomes?print=1`
- [ ] `/data/outcomes?state=loading`

</details>

No clickable controls of its own (only shared chrome).

Fields to try: Search regions, partners, opportunities

Notes:

### data › outcomes › stories › ‹story›

- [ ] Screen checked · URL: `/data/outcomes/stories/ama-k` (http://localhost:5173/data/outcomes/stories/ama-k)
- Wiki: [public-data](../public-data.md)

Controls:

- [ ] **Back to outcomes** _(link, page)_ → goes to `/data/outcomes` · Figma ☐

Fields to try: Search regions, partners, opportunities

Notes:

### data › outcomes › trends

- [ ] Screen checked · URL: `/data/outcomes/trends` (http://localhost:5173/data/outcomes/trends)
- Wiki: [public-data](../public-data.md)

<details><summary>3 documented states to open and compare with Figma</summary>

- [ ] `/data/outcomes/trends?range=1y&hover=assessments`
- [ ] `/data/outcomes/trends?range=90d`
- [ ] `/data/outcomes/trends?range=all`

</details>

Controls:

- [ ] **Try again** _(button, page)_ → ⚠ nothing visible happens · Figma ☐

Fields to try: Search regions, partners, opportunities

Notes:

### data › overview

- [ ] Screen checked · URL: `/data/overview` (http://localhost:5173/data/overview)
- Wiki: [public-data](../public-data.md)

<details><summary>25 documented states to open and compare with Figma</summary>

- [ ] `/data/overview?drawer=1`
- [ ] `/data/overview?map=hover&at=ashanti`
- [ ] `/data/overview?map=keyboard&at=ashanti`
- [ ] `/data/overview?map=low-data&at=upper-west`
- [ ] `/data/overview?map=pinned&at=ashanti`
- [ ] `/data/overview?modal=digest`
- [ ] `/data/overview?modal=digest&state=success`
- [ ] `/data/overview?modal=download`
- [ ] `/data/overview?modal=download&state=failed`
- [ ] `/data/overview?modal=download&state=generating`
- [ ] `/data/overview?modal=filters`
- [ ] `/data/overview?modal=share`
- [ ] `/data/overview?modal=share&preview=1`
- [ ] `/data/overview?modal=share&state=fallback`
- [ ] `/data/overview?modal=share&toast=copied`
- [ ] `/data/overview?print=1`
- [ ] `/data/overview?region=ashanti`
- [ ] `/data/overview?region=ashanti&edu=tertiary&interest=technology&age=18-24&gender=female`
- [ ] `/data/overview?region=ashanti&modal=share&scope=filtered`
- [ ] `/data/overview?region=volta&interest=technology&age=18-24`
- [ ] `/data/overview?state=error`
- [ ] `/data/overview?state=loading`
- [ ] `/data/overview?state=offline`
- [ ] `/data/overview?state=suppressed&region=upper-west&interest=technology&age=18-24`
- [ ] `/data/overview?state=zero&region=upper-west&interest=technology&age=18-24`

</details>

Controls:

- [ ] **How we count** _(link, page)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐
- [ ] **Region ▾** _(button, page)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐
- [ ] **Education level ▾** _(button, page)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐
- [ ] **Interest ▾** _(button, page)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐
- [ ] **Age range ▾** _(button, page)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐
- [ ] **Gender ▾** _(button, page)_ → opens a menu: All genders ✓ · Female · Male · Not shared · Figma ☐
- [ ] **Clear all** _(button, page)_ → changes something on the page · Figma ☐
- [ ] **Save as link** _(button, page)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐
- [ ] **Upper West, <5 talents, not enough data yet** _(button, page)_ → selects / switches · Figma ☐
- [ ] **Upper East, <5 talents, not enough data yet** _(button, page)_ → selects / switches · Figma ☐
- [ ] **North East, <5 talents, not enough data yet** _(button, page)_ → selects / switches · Figma ☐
- [ ] **Savannah, <5 talents, not enough data yet** _(button, page)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐
- [ ] **Northern, <5 talents, not enough data yet** _(button, page)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐
- [ ] **Bono, <5 talents, not enough data yet** _(button, page)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐
- [ ] **Bono East, <5 talents, not enough data yet** _(button, page)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐
- [ ] **Oti, <5 talents, not enough data yet** _(button, page)_ → selects / switches · Figma ☐
- [ ] **Western North, <5 talents, not enough data yet** _(button, page)_ → selects / switches · Figma ☐
- [ ] **Ahafo, <5 talents, not enough data yet** _(button, page)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐
- [ ] **Ashanti, <5 talents, not enough data yet** _(button, page)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐
- [ ] **Eastern, <5 talents, not enough data yet** _(button, page)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐
- [ ] **Volta, <5 talents, not enough data yet** _(button, page)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐
- [ ] **Central, <5 talents, not enough data yet** _(button, page)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐
- [ ] **Greater Accra, <5 talents, not enough data yet** _(button, page)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐
- [ ] **Western, <5 talents, not enough data yet** _(button, page)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐
- [ ] **Retry now** _(button, page)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐

Fields to try: Search regions, partners, opportunities

Notes:

### data › partners

- [ ] Screen checked · URL: `/data/partners` (http://localhost:5173/data/partners)
- Wiki: [public-data](../public-data.md)

<details><summary>1 documented states to open and compare with Figma</summary>

- [ ] `/data/partners?type=ngo&region=northern`

</details>

Controls:

- [ ] **Partners** _(link, navigation)_ → changes something on the page · Figma ☐
- [ ] **Opportunities** _(link, navigation)_ → goes to `/data/opportunities` · Figma ☐
- [ ] **Type ▾** _(button, page)_ → opens a menu: All types ✓ · NGO · Employer · School · University · Gov. agency · Figma ☐
- [ ] **Region ▾** _(button, page)_ → opens a menu: All regions ✓ · Greater Accra · Ashanti · Eastern · Northern · Western · Central · Volta · Upper East · Upper West · Bono · Bono East · Figma ☐
- [ ] **Focus area ▾** _(button, page)_ → opens a menu: All focus areas ✓ · Apprenticeships · Agriculture · Career guidance · Coding · Creative arts · Design · Digital skills · Engineering · Entrepreneurship · Girls in STEM · Grants · Figma ☐

Fields to try: Search regions, partners, opportunities · Search partners by name or focus

Notes:

### data › partners › ‹partner›

- [ ] Screen checked · URL: `/data/partners/ghana-code-club` (http://localhost:5173/data/partners/ghana-code-club)
- Wiki: [public-data](../public-data.md)

Controls:

- [ ] **Partners** _(link, navigation)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐
- [ ] **Visit website ↗** _(link, page)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐
- [ ] **Partner enquiries** _(link, page)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐
- [ ] **Girls in Data bootcamp Training · closes 15 Nov** _(link, page)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐
- [ ] **Club facilitator (part-time) Job · closes 30 Nov** _(link, page)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐
- [ ] **See all in Opportunities →** _(link, page)_ → ⚠ not tested, try it by hand (the page shows different items on each load) · Figma ☐

Fields to try: Search regions, partners, opportunities

Notes:

### data › regions

- [ ] Screen checked · URL: `/data/regions` (http://localhost:5173/data/regions)
- ⚠ Without a signed-in session this URL redirects to `/data/regions/greater-accra`: sign in with a test account and check it by hand.

No clickable controls of its own (only shared chrome).

Notes:

### data › regions › ‹region›

- [ ] Screen checked · URL: `/data/regions/oti` (http://localhost:5173/data/regions/oti)
- Wiki: [public-data](../public-data.md)

<details><summary>3 documented states to open and compare with Figma</summary>

- [ ] `/data/regions/greater-accra?modal=region`
- [ ] `/data/regions/greater-accra?state=loading`
- [ ] `/data/regions/oti?state=low-data`

</details>

Controls:

- [ ] **Try again** _(button, page)_ → ⚠ nothing visible happens · Figma ☐

Fields to try: Search regions, partners, opportunities

Notes:

### data › regions › ‹region› › districts › ‹district›

- [ ] Screen checked · URL: `/data/regions/greater-accra/districts/ga-south` (http://localhost:5173/data/regions/greater-accra/districts/ga-south)
- ⚠ Without a signed-in session this URL redirects to `/data/regions/greater-accra`: sign in with a test account and check it by hand.
- Wiki: [public-data](../public-data.md)

<details><summary>2 documented states to open and compare with Figma</summary>

- [ ] `/data/regions/greater-accra/districts/accra-metro?state=loading`
- [ ] `/data/regions/greater-accra/districts/ga-south?state=low-data`

</details>

No clickable controls of its own (only shared chrome).

Notes:

### data › report

- [ ] Screen checked · URL: `/data/report` (http://localhost:5173/data/report)
- Wiki: [public-data](../public-data.md)

<details><summary>8 documented states to open and compare with Figma</summary>

- [ ] `/data/report?page=1`
- [ ] `/data/report?page=2`
- [ ] `/data/report?page=3`
- [ ] `/data/report?page=4`
- [ ] `/data/report?page=5`
- [ ] `/data/report?page=6`
- [ ] `/data/report?page=7`
- [ ] `/data/report?page=8`

</details>

Controls:

- [ ] **Previous page** _(button, page)_ → disabled here · Figma ☐
- [ ] **Next page** _(button, page)_ → changes the view `page=2` · Figma ☐
- [ ] **Print** _(button, page)_ → ⚠ nothing visible happens · Figma ☐

Notes:

### data › showcase

- [ ] Screen checked · URL: `/data/showcase` (http://localhost:5173/data/showcase)
- Wiki: [public-data](../public-data.md)

<details><summary>3 documented states to open and compare with Figma</summary>

- [ ] `/data/showcase?consent=open`
- [ ] `/data/showcase?nav=next`
- [ ] `/data/showcase?view=grid`

</details>

Controls:

- [ ] **How consent works ▾** _(button, page)_ → changes the view `consent=open` · Figma ☐
- [ ] **Previous · Adwoa K.** _(link, navigation)_ → goes to `/data/showcase/adwoa-k` · Figma ☐
- [ ] **Next · Kofi M.** _(link, navigation)_ → goes to `/data/showcase/kofi-m` · Figma ☐
- [ ] **View all** _(link, navigation)_ → changes the view `view=grid` · Figma ☐
- [ ] **Become a partner →** _(link, page)_ → goes to `/login` · Figma ☐
- [ ] **Kofi M. Ashanti Aspiring product designer** _(link, page)_ → goes to `/data/showcase/kofi-m` · Figma ☐
- [ ] **Efua D. Greater Accra Data analyst in training** _(link, page)_ → goes to `/data/showcase/efua-d` · Figma ☐
- [ ] **Yaw B. Northern Future software developer** _(link, page)_ → goes to `/data/showcase/yaw-b` · Figma ☐
- [ ] **Adwoa K. Central Agribusiness manager** _(link, page)_ → goes to `/data/showcase/adwoa-k` · Figma ☐

Fields to try: Search regions, partners, opportunities

Notes:

### data › showcase › ‹profile›

- [ ] Screen checked · URL: `/data/showcase/yaw-b` (http://localhost:5173/data/showcase/yaw-b)
- Wiki: [public-data](../public-data.md)

Controls:

- [ ] **How consent works ▾** _(button, page)_ → changes the view `consent=open` · Figma ☐
- [ ] **Previous · Efua D.** _(link, navigation)_ → goes to `/data/showcase/efua-d` · Figma ☐
- [ ] **Next · Adwoa K.** _(link, navigation)_ → goes to `/data/showcase/adwoa-k` · Figma ☐
- [ ] **View all** _(link, navigation)_ → goes to `/data/showcase?view=grid` · Figma ☐
- [ ] **Become a partner →** _(link, page)_ → goes to `/login` · Figma ☐
- [ ] **Akosua O. Volta Future public health nurse** _(link, page)_ → goes to `/data/showcase/akosua-o` · Figma ☐
- [ ] **Kofi M. Ashanti Aspiring product designer** _(link, page)_ → goes to `/data/showcase/kofi-m` · Figma ☐
- [ ] **Efua D. Greater Accra Data analyst in training** _(link, page)_ → goes to `/data/showcase/efua-d` · Figma ☐
- [ ] **Adwoa K. Central Agribusiness manager** _(link, page)_ → goes to `/data/showcase/adwoa-k` · Figma ☐

Fields to try: Search regions, partners, opportunities

Notes:
