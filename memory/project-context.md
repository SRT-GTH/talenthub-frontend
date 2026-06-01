---
name: project-context
description: Ghana Talent Hub — product overview, current build progress, Figma file, and institution onboarding flow status
metadata:
  type: project
---

Ghana Talent Hub (GTH) is a Ghanaian talent and career-development platform. Figma file key: `Bin8roWL8sloyc36IgFMuT` (file name "Gh Design system - onboading", sic). PAT is a session secret — never store it here; it lives in the init prompt.

**Why:** Building the entire GTH frontend from Figma designs, screen by screen, with pixel-perfect fidelity.

**How to apply:** Each session starts with this init prompt which provides Figma credentials. Always re-read SOP.md and the wiki before touching code.

## Current build status (as of 2026-05-30)

### Institution onboarding flow — ALL 8 STEPS COMPLETE ✅

| Step   | Route                                      | Section                                            | Status   |
| ------ | ------------------------------------------ | -------------------------------------------------- | -------- |
| Splash | `/onboarding/institution/guidelines`       | `GuidelinesSection`                                | ✅ Built |
| 1      | `/onboarding/institution/your-institution` | `YourInstitutionSection` + `IdentityCapturedModal` | ✅ Built |
| 2      | `/onboarding/institution/contact`          | `ContactInfoSection` + `ContactVerificationModal`  | ✅ Built |
| 3      | `/onboarding/institution/activate`         | `ActivateSection` + `TermsAcceptedModal`           | ✅ Built |
| 4a     | `/onboarding/institution/template-guide`   | `TemplateGuideSection`                             | ✅ Built |
| 4b     | `/onboarding/institution/template`         | `TemplateSection`                                  | ✅ Built |
| 5      | `/onboarding/institution/upload`           | `UploadSection`                                    | ✅ Built |
| 6      | `/onboarding/institution/validate`         | `ValidateSection` + `ValidationCheckCard`          | ✅ Built |
| 7      | `/onboarding/institution/confirm`          | `ConfirmSection`                                   | ✅ Built |
| 8      | `/onboarding/institution/report`           | `ReportSection`                                    | ✅ Built |

### `showRightPanel` exclusion list (InstitutionOnboardingLayout)

Panel is HIDDEN for: `/activate`, `/template`, `/validate`, `/confirm`, `/report`
Panel is SHOWN for: `/guidelines`, `/your-institution`, `/contact`, `/template-guide`, `/upload`

### Talent onboarding — routes wired, build status unknown

Routes exist for welcome/dob/personal-info/contact/address/education/parent-info/review but depth of implementation is not confirmed this session.

### Landing page — HeroSection + HeroPhotoCard built ✅

### Engagement flows — built ✅

All engagement/avatar/milestone/identity-map pages are present.

### OnboardingWelcomePage — in progress (git status shows M)

`src/pages/onboarding/OnboardingWelcomePage.jsx` is modified (M in git status as of 2026-05-30).
