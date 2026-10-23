import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense, useEffect } from 'react';
import './App.css';
import MainLayout from './layout/MainLayout.jsx';
const LandingHomePage = lazy(() => import('./pages/landing/LandingHomePage.jsx'));
const HowItWorksPage = lazy(() => import('./pages/landing/HowItWorksPage.jsx'));
const FeaturesPage = lazy(() => import('./pages/landing/FeaturesPage.jsx'));
const OpportunitiesPage = lazy(() => import('./pages/landing/OpportunitiesPage.jsx'));
const ForParentsSchoolsPage = lazy(() => import('./pages/landing/ForParentsSchoolsPage.jsx'));
const StoriesPage = lazy(() => import('./pages/landing/StoriesPage.jsx'));
const FaqPage = lazy(() => import('./pages/landing/FaqPage.jsx'));
const ComingSoonPage = lazy(() => import('./pages/landing/ComingSoonPage.jsx'));
const HomePage = lazy(() => import('./pages/HomePage.jsx'));
const LoginPage = lazy(() => import('./pages/LoginPage.jsx'));
const GetStartedPage = lazy(() => import('./pages/GetStartedPage.jsx'));
const OnboardingWelcomePage = lazy(() => import('./pages/onboarding/OnboardingWelcomePage.jsx'));
const OnboardingDobPage = lazy(() => import('./pages/onboarding/OnboardingDobPage.jsx'));
const OnboardingPersonalInfoPage = lazy(
  () => import('./pages/onboarding/OnboardingPersonalInfoPage.jsx')
);
const OnboardingContactPage = lazy(() => import('./pages/onboarding/OnboardingContactPage.jsx'));
const OnboardingAddressPage = lazy(() => import('./pages/onboarding/OnboardingAddressPage.jsx'));
const OnboardingEducationPage = lazy(
  () => import('./pages/onboarding/OnboardingEducationPage.jsx')
);
const OnboardingParentInfoPage = lazy(
  () => import('./pages/onboarding/OnboardingParentInfoPage.jsx')
);
const OnboardingReviewPage = lazy(() => import('./pages/onboarding/OnboardingReviewPage.jsx'));
const OnboardingDonePage = lazy(() => import('./pages/onboarding/OnboardingDonePage.jsx'));
const RecruiterProfilePage = lazy(
  () => import('./pages/onboarding/recruiter/RecruiterProfilePage.jsx')
);
const RecruiterTypePage = lazy(() => import('./pages/onboarding/recruiter/RecruiterTypePage.jsx'));
const RecruiterOrganisationPage = lazy(
  () => import('./pages/onboarding/recruiter/RecruiterOrganisationPage.jsx')
);
const RecruiterCreateOrganisationPage = lazy(
  () => import('./pages/onboarding/recruiter/RecruiterCreateOrganisationPage.jsx')
);
const RecruiterPlanPage = lazy(() => import('./pages/onboarding/recruiter/RecruiterPlanPage.jsx'));
const RecruiterPaymentPage = lazy(
  () => import('./pages/onboarding/recruiter/RecruiterPaymentPage.jsx')
);
const RecruiterPreferencesPage = lazy(
  () => import('./pages/onboarding/recruiter/RecruiterPreferencesPage.jsx')
);
const RecruiterReviewPage = lazy(
  () => import('./pages/onboarding/recruiter/RecruiterReviewPage.jsx')
);
const RecruiterDonePage = lazy(() => import('./pages/onboarding/recruiter/RecruiterDonePage.jsx'));
const ProfileEngagementPage = lazy(() => import('./pages/engagement/ProfileEngagementPage.jsx'));
const MilestoneUnlockPage = lazy(() => import('./pages/engagement/MilestoneUnlockPage.jsx'));
const Top20MilestonePage = lazy(() => import('./pages/engagement/Top20MilestonePage.jsx'));
const TopTalentMilestonePage = lazy(() => import('./pages/engagement/TopTalentMilestonePage.jsx'));
const AvatarCustomiserPage = lazy(() => import('./pages/engagement/AvatarCustomiserPage.jsx'));
const AvatarSkinTonePage = lazy(() => import('./pages/engagement/AvatarSkinTonePage.jsx'));
const AvatarHairPage = lazy(() => import('./pages/engagement/AvatarHairPage.jsx'));
const AvatarExtrasPage = lazy(() => import('./pages/engagement/AvatarExtrasPage.jsx'));
const AvatarOutfitPage = lazy(() => import('./pages/engagement/AvatarOutfitPage.jsx'));
const InstitutionGuidelinesPage = lazy(
  () => import('./pages/onboarding/institution/InstitutionGuidelinesPage.jsx')
);
const InstitutionYourInstitutionPage = lazy(
  () => import('./pages/onboarding/institution/InstitutionYourInstitutionPage.jsx')
);
const InstitutionContactPage = lazy(
  () => import('./pages/onboarding/institution/InstitutionContactPage.jsx')
);
const InstitutionActivatePage = lazy(
  () => import('./pages/onboarding/institution/InstitutionActivatePage.jsx')
);
const InstitutionTemplatePage = lazy(
  () => import('./pages/onboarding/institution/InstitutionTemplatePage.jsx')
);
const InstitutionTemplateGuidePage = lazy(
  () => import('./pages/onboarding/institution/InstitutionTemplateGuidePage.jsx')
);
const InstitutionUploadPage = lazy(
  () => import('./pages/onboarding/institution/InstitutionUploadPage.jsx')
);
const InstitutionValidatePage = lazy(
  () => import('./pages/onboarding/institution/InstitutionValidatePage.jsx')
);
const InstitutionConfirmPage = lazy(
  () => import('./pages/onboarding/institution/InstitutionConfirmPage.jsx')
);
const InstitutionReportPage = lazy(
  () => import('./pages/onboarding/institution/InstitutionReportPage.jsx')
);
import InstitutionOnboardingLayout from './layout/InstitutionOnboardingLayout.jsx';
import TalentOnboardingLayout from './layout/TalentOnboardingLayout.jsx';
import AvatarFlowLayout from './layout/AvatarFlowLayout.jsx';
// Engagement revamp (Figma canvas 3125:10352): one page per stage, owned by the engagement packages.
const JourneyMapPage = lazy(() => import('./pages/engagementV2/JourneyMapPage.jsx'));
const MilestoneDiscoverablePage = lazy(
  () => import('./pages/engagementV2/MilestoneDiscoverablePage.jsx')
);
const MilestoneTop20Page = lazy(() => import('./pages/engagementV2/MilestoneTop20Page.jsx'));
const MilestoneTopTalentPage = lazy(
  () => import('./pages/engagementV2/MilestoneTopTalentPage.jsx')
);
const InterestsPage = lazy(() => import('./pages/engagementV2/InterestsPage.jsx'));
const SkillsPage = lazy(() => import('./pages/engagementV2/SkillsPage.jsx'));
const WorkPage = lazy(() => import('./pages/engagementV2/WorkPage.jsx'));
const PortfolioPage = lazy(() => import('./pages/engagementV2/PortfolioPage.jsx'));
const CertsPage = lazy(() => import('./pages/engagementV2/CertsPage.jsx'));
const GoalsPage = lazy(() => import('./pages/engagementV2/GoalsPage.jsx'));
const PitchPage = lazy(() => import('./pages/engagementV2/PitchPage.jsx'));
const PersonalityPage = lazy(() => import('./pages/engagementV2/PersonalityPage.jsx'));
const PersonalityArcadePage = lazy(() => import('./pages/engagementV2/PersonalityArcadePage.jsx'));
const ProfileCompletePage = lazy(() => import('./pages/engagementV2/ProfileCompletePage.jsx'));
const UploadCvPage = lazy(() => import('./pages/engagementV2/UploadCvPage.jsx'));
const AvatarPage = lazy(() => import('./pages/engagementV2/AvatarPage.jsx'));
const InterestsIntroPage = lazy(() => import('./pages/profileFilling/InterestsIntroPage.jsx'));
const SkillsIntroPage = lazy(() => import('./pages/profileFilling/SkillsIntroPage.jsx'));
const WorkIntroPage = lazy(() => import('./pages/profileFilling/WorkIntroPage.jsx'));
const PortfolioIntroPage = lazy(() => import('./pages/profileFilling/PortfolioIntroPage.jsx'));
const CertsIntroPage = lazy(() => import('./pages/profileFilling/CertsIntroPage.jsx'));
const GoalsIntroPage = lazy(() => import('./pages/profileFilling/GoalsIntroPage.jsx'));
const PitchIntroPage = lazy(() => import('./pages/profileFilling/PitchIntroPage.jsx'));
const CareerBuddyPage = lazy(() => import('./pages/profileFilling/CareerBuddyPage.jsx'));
const TalentMessagesPage = lazy(() => import('./pages/talentMessages/TalentMessagesPage.jsx'));
const MessageLinkRedirect = lazy(() => import('./pages/talentMessages/MessageLinkRedirect.jsx'));
const TalentWalletPage = lazy(() => import('./pages/talentWallet/TalentWalletPage.jsx'));
const CommunityBrowsePage = lazy(() => import('./pages/talentCommunity/CommunityBrowsePage.jsx'));
const CommunityPage = lazy(() => import('./pages/talentCommunity/CommunityPage.jsx'));
const CommunityPostPage = lazy(() => import('./pages/talentCommunity/CommunityPostPage.jsx'));
const RecruiterHomePage = lazy(() => import('./pages/recruiterHome/RecruiterHomePage.jsx'));
const TalentHomePage = lazy(() => import('./pages/talentHome/TalentHomePage.jsx'));
const TalentSettingsRoute = lazy(() => import('./pages/talentSettings/TalentSettingsRoute.jsx'));
const TalentLoggedOutPage = lazy(() => import('./pages/talentSettings/TalentLoggedOutPage.jsx'));
const TalentLearningPage = lazy(() => import('./pages/talentLearning/TalentLearningPage.jsx'));
const TalentNotificationsPage = lazy(
  () => import('./pages/talentHome/TalentNotificationsPage.jsx')
);
const TalentProfilePage = lazy(() => import('./pages/talentProfile/TalentProfilePage.jsx'));
const TalentJobsPage = lazy(() => import('./pages/talentJobs/TalentJobsPage.jsx'));
const TalentStreakPage = lazy(() => import('./pages/talentStreak/TalentStreakPage.jsx'));
const AssessmentOverviewPage = lazy(
  () => import('./pages/talentAssessment/AssessmentOverviewPage.jsx')
);
const AssessmentDetailPage = lazy(
  () => import('./pages/talentAssessment/AssessmentDetailPage.jsx')
);
const AssessmentLibraryPage = lazy(
  () => import('./pages/talentAssessment/AssessmentLibraryPage.jsx')
);
const AssessmentFullPage = lazy(() => import('./pages/talentAssessment/AssessmentFullPage.jsx'));
const SkillsLabHubPage = lazy(() => import('./pages/talentSkillsLab/SkillsLabHubPage.jsx'));
const LabDetailPage = lazy(() => import('./pages/talentSkillsLab/LabDetailPage.jsx'));
const LabPlayPage = lazy(() => import('./pages/talentSkillsLab/LabPlayPage.jsx'));
const GamePage = lazy(() => import('./pages/talentSkillsLab/GamePage.jsx'));
const TalentSearchPage = lazy(() => import('./pages/talentSearch/TalentSearchPage.jsx'));
const JobTemplatesPage = lazy(() => import('./pages/jobTemplates/JobTemplatesPage.jsx'));
const JobPostingsPage = lazy(() => import('./pages/jobPostings/JobPostingsPage.jsx'));
const JobScreeningPage = lazy(() => import('./pages/jobScreening/JobScreeningPage.jsx'));
const ApplicationPipelinePage = lazy(
  () => import('./pages/applicationPipeline/ApplicationPipelinePage.jsx')
);
const RecruiterMessagesPage = lazy(
  () => import('./pages/recruiterMessages/RecruiterMessagesPage.jsx')
);
import ScrollToTop from './components/ui/ScrollToTop.jsx';
import ParentOnboardingLayout from './layout/ParentOnboardingLayout.jsx';
const ParentLoginPage = lazy(() => import('./pages/parentLogin/ParentLoginPage.jsx'));
const ParentWelcomePage = lazy(() => import('./pages/parentLogin/ParentWelcomePage.jsx'));
const ParentIdentityPage = lazy(() => import('./pages/parentLogin/ParentIdentityPage.jsx'));
const ParentVerificationPage = lazy(() => import('./pages/parentLogin/ParentVerificationPage.jsx'));
const ParentContactPage = lazy(() => import('./pages/parentLogin/ParentContactPage.jsx'));
const ParentSecurityPage = lazy(() => import('./pages/parentLogin/ParentSecurityPage.jsx'));
const ParentLinkWardPage = lazy(() => import('./pages/parentLogin/ParentLinkWardPage.jsx'));
const ParentReviewPage = lazy(() => import('./pages/parentLogin/ParentReviewPage.jsx'));
const ParentDonePage = lazy(() => import('./pages/parentLogin/ParentDonePage.jsx'));
const ParentInvitePage = lazy(() => import('./pages/parentLogin/ParentInvitePage.jsx'));
const ParentInviteIdentityPage = lazy(
  () => import('./pages/parentLogin/ParentInviteIdentityPage.jsx')
);
const ParentInviteVerificationPage = lazy(
  () => import('./pages/parentLogin/ParentInviteVerificationPage.jsx')
);
const ParentInviteContactPage = lazy(
  () => import('./pages/parentLogin/ParentInviteContactPage.jsx')
);
const ParentInviteSecurityPage = lazy(
  () => import('./pages/parentLogin/ParentInviteSecurityPage.jsx')
);
const ParentInviteLinkWardPage = lazy(
  () => import('./pages/parentLogin/ParentInviteLinkWardPage.jsx')
);
const ParentInviteConsentPage = lazy(
  () => import('./pages/parentLogin/ParentInviteConsentPage.jsx')
);
import { OnboardingProvider } from './providers/OnboardingProvider.jsx';
import { logoHomePath } from './services/auth.api.js';
import { RecruiterOnboardingProvider } from './providers/RecruiterOnboardingProvider.jsx';
import CareerBuddyRoleProvider from './providers/CareerBuddyRoleProvider.jsx';
import UiStyleProvider from './providers/UiStyleProvider.jsx';
import { AvatarSelectionProvider } from './providers/AvatarSelectionProvider.jsx';

/*
 * Demo-friendly avatar seed so Career Buddy voice call / chat show a
 * complete layered look before the user visits the customiser. Matches
 * Style panel `style-1` preset (AvatarStylePanel.jsx).
 */
const APP_AVATAR_INITIAL = {
  baseStyle: 'style-1',
  skinTone: 'cocoa',
  lightness: 0,
  hairStyle: 'hair-1',
  hairColor: 'black',
  apparel: 'outfit-tee',
  apparelColor: 'brand-green',
  fit: 'regular',
  eyewear: 'eyewear-none',
  facialHair: 'facial-none',
  earring: 'earring-none',
};
import { useCareerBuddyRole } from './hooks/useCareerBuddyRole.js';
import DemoNavigator from './components/shared/DemoNavigator.jsx';
import { perfEnabled } from './utils/perf.js';

// Load-time panel: only downloaded when ?perf=1 is on (see utils/perf.js).
const PerfPanel = lazy(() => import('./components/shared/PerfPanel.jsx'));

/*
 * Pages are code-split per route (React.lazy) so a phone only downloads the
 * screen it opens instead of the whole 2.4 MB app. The Suspense boundary sits
 * on each route element, not around <Routes>, so layouts (navbars, shells)
 * stay mounted while a page chunk loads.
 */
const RouteFallback = () => (
  <div
    data-route-fallback
    className="grid min-h-dvh flex-1 place-items-center bg-white"
    role="status"
    aria-label="Loading"
  >
    <span className="size-8 animate-spin rounded-full border-[3px] border-brand-green-light-active border-t-brand-green" />
  </div>
);

/** Old split route → shared shell + force recruiter demo role. */
function LegacyRecruiterBuddyRedirect() {
  const { setRole } = useCareerBuddyRole();
  useEffect(() => {
    setRole('recruiter');
  }, [setRole]);
  return <Navigate to="/profile/filling/career-buddy?cb=welcome" replace />;
}

const UnknownRouteRedirect = () => <Navigate to={logoHomePath()} replace />;

function App() {
  return (
    <BrowserRouter>
      {/* Reset window scroll on every route change so each new page
          starts at the top instead of inheriting the previous scroll. */}
      <ScrollToTop />
      <AvatarSelectionProvider initial={APP_AVATAR_INITIAL}>
        <UiStyleProvider>
          <CareerBuddyRoleProvider>
            <DemoNavigator />
            {perfEnabled() && (
              <Suspense fallback={null}>
                <PerfPanel />
              </Suspense>
            )}
            <Suspense fallback={<RouteFallback />}>
              <Routes>
                {/* /admin/* slot is reserved for a future lazy-loaded admin subsystem,
            mirroring the elysium pattern. Add it as:
            <Route path="/admin/*" element={<Suspense ...><AdminApp /></Suspense>} /> */}
                <Route element={<MainLayout />}>
                  <Route
                    path={'/get-started'}
                    element={
                      <Suspense fallback={<RouteFallback />}>
                        <GetStartedPage />
                      </Suspense>
                    }
                  />

                  {/* Talent auth + onboarding flow.
              TalentOnboardingLayout provides the two page-level background
              glow ellipses (TL green + BR pink) that persist across all talent
              screens and the login page, outside the scrollable content area.
              Mirrors the InstitutionOnboardingLayout / ParentOnboardingLayout
              pattern. */}
                  <Route element={<TalentOnboardingLayout />}>
                    <Route
                      path={'/login'}
                      element={
                        <Suspense fallback={<RouteFallback />}>
                          <LoginPage />
                        </Suspense>
                      }
                    />

                    {/* Wrapped in OnboardingProvider so DOB captured on step 01
                propagates to every downstream page (drives the Parent step
                in the breadcrumb + the under-18 branch out of Education). */}
                    <Route
                      path="/onboarding/talent/*"
                      element={
                        <OnboardingProvider>
                          <Routes>
                            <Route
                              path="welcome"
                              element={
                                <Suspense fallback={<RouteFallback />}>
                                  <OnboardingWelcomePage />
                                </Suspense>
                              }
                            />
                            <Route
                              path="dob"
                              element={
                                <Suspense fallback={<RouteFallback />}>
                                  <OnboardingDobPage />
                                </Suspense>
                              }
                            />
                            <Route
                              path="personal-info"
                              element={
                                <Suspense fallback={<RouteFallback />}>
                                  <OnboardingPersonalInfoPage />
                                </Suspense>
                              }
                            />
                            <Route
                              path="contact"
                              element={
                                <Suspense fallback={<RouteFallback />}>
                                  <OnboardingContactPage />
                                </Suspense>
                              }
                            />
                            <Route
                              path="address"
                              element={
                                <Suspense fallback={<RouteFallback />}>
                                  <OnboardingAddressPage />
                                </Suspense>
                              }
                            />
                            <Route
                              path="education"
                              element={
                                <Suspense fallback={<RouteFallback />}>
                                  <OnboardingEducationPage />
                                </Suspense>
                              }
                            />
                            <Route
                              path="parent-info"
                              element={
                                <Suspense fallback={<RouteFallback />}>
                                  <OnboardingParentInfoPage />
                                </Suspense>
                              }
                            />
                            <Route
                              path="review"
                              element={
                                <Suspense fallback={<RouteFallback />}>
                                  <OnboardingReviewPage />
                                </Suspense>
                              }
                            />
                            <Route
                              path="done"
                              element={
                                <Suspense fallback={<RouteFallback />}>
                                  <OnboardingDonePage />
                                </Suspense>
                              }
                            />
                          </Routes>
                        </OnboardingProvider>
                      }
                    />

                    {/* Recruiter onboarding (Figma 7356:96249). Shares the talent shell
                (TalentOnboardingLayout glow + OnboardingHeader). OnboardingProvider
                is mounted too because OnboardingHeader reads it; the recruiter's own
                mock state lives in RecruiterOnboardingProvider. No route guards -
                every step must open directly (DemoNavigator + deep links). */}
                    <Route
                      path="/onboarding/recruiter/*"
                      element={
                        <OnboardingProvider>
                          <RecruiterOnboardingProvider>
                            <Routes>
                              <Route index element={<Navigate to="profile" replace />} />
                              <Route
                                path="profile"
                                element={
                                  <Suspense fallback={<RouteFallback />}>
                                    <RecruiterProfilePage />
                                  </Suspense>
                                }
                              />
                              <Route
                                path="type"
                                element={
                                  <Suspense fallback={<RouteFallback />}>
                                    <RecruiterTypePage />
                                  </Suspense>
                                }
                              />
                              <Route
                                path="organisation"
                                element={
                                  <Suspense fallback={<RouteFallback />}>
                                    <RecruiterOrganisationPage />
                                  </Suspense>
                                }
                              />
                              <Route
                                path="organisation/create"
                                element={
                                  <Suspense fallback={<RouteFallback />}>
                                    <RecruiterCreateOrganisationPage />
                                  </Suspense>
                                }
                              />
                              <Route
                                path="plan"
                                element={
                                  <Suspense fallback={<RouteFallback />}>
                                    <RecruiterPlanPage />
                                  </Suspense>
                                }
                              />
                              <Route
                                path="payment"
                                element={
                                  <Suspense fallback={<RouteFallback />}>
                                    <RecruiterPaymentPage />
                                  </Suspense>
                                }
                              />
                              <Route
                                path="preferences"
                                element={
                                  <Suspense fallback={<RouteFallback />}>
                                    <RecruiterPreferencesPage />
                                  </Suspense>
                                }
                              />
                              <Route
                                path="review"
                                element={
                                  <Suspense fallback={<RouteFallback />}>
                                    <RecruiterReviewPage />
                                  </Suspense>
                                }
                              />
                              <Route
                                path="done"
                                element={
                                  <Suspense fallback={<RouteFallback />}>
                                    <RecruiterDonePage />
                                  </Suspense>
                                }
                              />
                            </Routes>
                          </RecruiterOnboardingProvider>
                        </OnboardingProvider>
                      }
                    />
                  </Route>

                  {/* Institution bulk-onboarding flow.
              All steps share InstitutionOnboardingLayout which renders the
              page bg ellipses, the shared right panel, and (for non-guidelines
              routes) the 8-step breadcrumb at the top. */}
                  <Route element={<InstitutionOnboardingLayout />}>
                    <Route
                      path="/onboarding/institution/guidelines"
                      element={
                        <Suspense fallback={<RouteFallback />}>
                          <InstitutionGuidelinesPage />
                        </Suspense>
                      }
                    />
                    <Route
                      path="/onboarding/institution/your-institution"
                      element={
                        <Suspense fallback={<RouteFallback />}>
                          <InstitutionYourInstitutionPage />
                        </Suspense>
                      }
                    />
                    <Route
                      path="/onboarding/institution/contact"
                      element={
                        <Suspense fallback={<RouteFallback />}>
                          <InstitutionContactPage />
                        </Suspense>
                      }
                    />
                    <Route
                      path="/onboarding/institution/activate"
                      element={
                        <Suspense fallback={<RouteFallback />}>
                          <InstitutionActivatePage />
                        </Suspense>
                      }
                    />
                    {/* Template Guide — part of Phase 4 "Bulk Upload".
                Comes BEFORE /template in the flow: activate → template-guide → template → upload.
                Has right panel (does not end with '/activate' or '/template').
                Automatically gets breadcrumb step 3 "Template" via startsWith match
                against STEP_PATHS[3] = '/onboarding/institution/template'. */}
                    <Route
                      path="/onboarding/institution/template-guide"
                      element={
                        <Suspense fallback={<RouteFallback />}>
                          <InstitutionTemplateGuidePage />
                        </Suspense>
                      }
                    />
                    <Route
                      path="/onboarding/institution/template"
                      element={
                        <Suspense fallback={<RouteFallback />}>
                          <InstitutionTemplatePage />
                        </Suspense>
                      }
                    />
                    <Route
                      path="/onboarding/institution/upload"
                      element={
                        <Suspense fallback={<RouteFallback />}>
                          <InstitutionUploadPage />
                        </Suspense>
                      }
                    />
                    <Route
                      path="/onboarding/institution/validate"
                      element={
                        <Suspense fallback={<RouteFallback />}>
                          <InstitutionValidatePage />
                        </Suspense>
                      }
                    />
                    <Route
                      path="/onboarding/institution/confirm"
                      element={
                        <Suspense fallback={<RouteFallback />}>
                          <InstitutionConfirmPage />
                        </Suspense>
                      }
                    />
                    <Route
                      path="/onboarding/institution/report"
                      element={
                        <Suspense fallback={<RouteFallback />}>
                          <InstitutionReportPage />
                        </Suspense>
                      }
                    />
                  </Route>

                  {/* Parent portal onboarding — shared layout provides BG ellipses + gold right panel.
              Layout swaps the right panel based on the active route:
                parent-welcome → ParentWelcomeRightPanel (single large photo + Ward Status overlay)
                parent-login   → ParentLoginRightPanel   (two photo cards + Error callout) */}
                  <Route element={<ParentOnboardingLayout />}>
                    <Route
                      path={'/onboarding/parent-welcome'}
                      element={
                        <Suspense fallback={<RouteFallback />}>
                          <ParentWelcomePage />
                        </Suspense>
                      }
                    />
                    <Route
                      path={'/onboarding/parent-invited'}
                      element={
                        <Suspense fallback={<RouteFallback />}>
                          <ParentInvitePage />
                        </Suspense>
                      }
                    />
                    <Route
                      path={'/onboarding/parent-invited-identity'}
                      element={
                        <Suspense fallback={<RouteFallback />}>
                          <ParentInviteIdentityPage />
                        </Suspense>
                      }
                    />
                    <Route
                      path={'/onboarding/parent-invited-verification'}
                      element={
                        <Suspense fallback={<RouteFallback />}>
                          <ParentInviteVerificationPage />
                        </Suspense>
                      }
                    />
                    <Route
                      path={'/onboarding/parent-invited-contact'}
                      element={
                        <Suspense fallback={<RouteFallback />}>
                          <ParentInviteContactPage />
                        </Suspense>
                      }
                    />
                    <Route
                      path={'/onboarding/parent-invited-security'}
                      element={
                        <Suspense fallback={<RouteFallback />}>
                          <ParentInviteSecurityPage />
                        </Suspense>
                      }
                    />
                    <Route
                      path={'/onboarding/parent-invited-link-ward'}
                      element={
                        <Suspense fallback={<RouteFallback />}>
                          <ParentInviteLinkWardPage />
                        </Suspense>
                      }
                    />
                    <Route
                      path={'/onboarding/parent-invited-consent'}
                      element={
                        <Suspense fallback={<RouteFallback />}>
                          <ParentInviteConsentPage />
                        </Suspense>
                      }
                    />
                    <Route
                      path={'/onboarding/parent-login'}
                      element={
                        <Suspense fallback={<RouteFallback />}>
                          <ParentLoginPage />
                        </Suspense>
                      }
                    />
                    <Route
                      path={'/onboarding/parent-identity'}
                      element={
                        <Suspense fallback={<RouteFallback />}>
                          <ParentIdentityPage />
                        </Suspense>
                      }
                    />
                    <Route
                      path={'/onboarding/parent-verification'}
                      element={
                        <Suspense fallback={<RouteFallback />}>
                          <ParentVerificationPage />
                        </Suspense>
                      }
                    />
                    <Route
                      path={'/onboarding/parent-contact'}
                      element={
                        <Suspense fallback={<RouteFallback />}>
                          <ParentContactPage />
                        </Suspense>
                      }
                    />
                    <Route
                      path={'/onboarding/parent-security'}
                      element={
                        <Suspense fallback={<RouteFallback />}>
                          <ParentSecurityPage />
                        </Suspense>
                      }
                    />
                    <Route
                      path={'/onboarding/parent-link-ward'}
                      element={
                        <Suspense fallback={<RouteFallback />}>
                          <ParentLinkWardPage />
                        </Suspense>
                      }
                    />
                    <Route
                      path={'/onboarding/parent-review'}
                      element={
                        <Suspense fallback={<RouteFallback />}>
                          <ParentReviewPage />
                        </Suspense>
                      }
                    />
                    <Route
                      path={'/onboarding/parent-done'}
                      element={
                        <Suspense fallback={<RouteFallback />}>
                          <ParentDonePage />
                        </Suspense>
                      }
                    />
                  </Route>

                  {/* /components hosts the design-system playground (HomePage). */}
                  <Route
                    path={'/components'}
                    element={
                      <Suspense fallback={<RouteFallback />}>
                        <HomePage />
                      </Suspense>
                    }
                  />
                </Route>

                {/* Profile engagement owns its own top/bottom chrome — mounted outside MainLayout. */}
                <Route
                  path={'/profile/engagement'}
                  element={
                    <Suspense fallback={<RouteFallback />}>
                      <JourneyMapPage />
                    </Suspense>
                  }
                />
                <Route
                  path={'/profile/engagement/identity'}
                  element={<Navigate to="/profile/engagement/avatar" replace />}
                />
                <Route
                  path={'/profile/engagement/milestone'}
                  element={
                    <Suspense fallback={<RouteFallback />}>
                      <MilestoneDiscoverablePage />
                    </Suspense>
                  }
                />
                <Route
                  path={'/profile/engagement/milestone/top-20'}
                  element={
                    <Suspense fallback={<RouteFallback />}>
                      <MilestoneTop20Page />
                    </Suspense>
                  }
                />
                <Route
                  path={'/profile/engagement/milestone/top-talent'}
                  element={
                    <Suspense fallback={<RouteFallback />}>
                      <MilestoneTopTalentPage />
                    </Suspense>
                  }
                />
                {/* Profile filling — each step owns its own full-bleed chrome (no shared layout). */}
                <Route
                  path={'/profile/filling/interests'}
                  element={
                    <Suspense fallback={<RouteFallback />}>
                      <InterestsPage />
                    </Suspense>
                  }
                />
                <Route
                  path={'/profile/filling/interests/categories'}
                  element={<Navigate to="/profile/filling/interests?step=areas" replace />}
                />
                <Route
                  path={'/profile/filling/skills'}
                  element={
                    <Suspense fallback={<RouteFallback />}>
                      <SkillsPage />
                    </Suspense>
                  }
                />
                <Route
                  path={'/profile/filling/skills/categories'}
                  element={<Navigate to="/profile/filling/skills?state=list" replace />}
                />
                <Route
                  path={'/profile/filling/work'}
                  element={
                    <Suspense fallback={<RouteFallback />}>
                      <WorkPage />
                    </Suspense>
                  }
                />
                <Route
                  path={'/profile/filling/work/history'}
                  element={<Navigate to="/profile/filling/work?state=list" replace />}
                />
                <Route
                  path={'/profile/filling/portfolio'}
                  element={
                    <Suspense fallback={<RouteFallback />}>
                      <PortfolioPage />
                    </Suspense>
                  }
                />
                <Route
                  path={'/profile/filling/portfolio/projects'}
                  element={<Navigate to="/profile/filling/portfolio?state=list" replace />}
                />
                <Route
                  path={'/profile/filling/certs'}
                  element={
                    <Suspense fallback={<RouteFallback />}>
                      <CertsPage />
                    </Suspense>
                  }
                />
                <Route
                  path={'/profile/filling/certs/list'}
                  element={<Navigate to="/profile/filling/certs?state=list" replace />}
                />
                <Route
                  path={'/profile/filling/goals'}
                  element={
                    <Suspense fallback={<RouteFallback />}>
                      <GoalsPage />
                    </Suspense>
                  }
                />
                <Route
                  path={'/profile/filling/goals/list'}
                  element={<Navigate to="/profile/filling/goals?state=list" replace />}
                />
                <Route
                  path={'/profile/filling/pitch'}
                  element={
                    <Suspense fallback={<RouteFallback />}>
                      <PitchPage />
                    </Suspense>
                  }
                />
                <Route
                  path={'/profile/filling/pitch/record'}
                  element={<Navigate to="/profile/filling/pitch?mode=record&step=camera" replace />}
                />
                {/* Shared Career Buddy shell — talent vs recruiter via CareerBuddyRoleProvider. */}
                {/* Engagement revamp: new screens (Figma canvas 3125:10352). */}
                <Route
                  path={'/profile/filling/personality'}
                  element={
                    <Suspense fallback={<RouteFallback />}>
                      <PersonalityPage />
                    </Suspense>
                  }
                />
                <Route
                  path={'/profile/filling/personality/arcade'}
                  element={
                    <Suspense fallback={<RouteFallback />}>
                      <PersonalityArcadePage />
                    </Suspense>
                  }
                />
                <Route
                  path={'/profile/filling/personality/arcade/:gameId'}
                  element={
                    <Suspense fallback={<RouteFallback />}>
                      <GamePage />
                    </Suspense>
                  }
                />
                <Route
                  path={'/profile/filling/complete'}
                  element={
                    <Suspense fallback={<RouteFallback />}>
                      <ProfileCompletePage />
                    </Suspense>
                  }
                />
                <Route
                  path={'/profile/filling/cv'}
                  element={
                    <Suspense fallback={<RouteFallback />}>
                      <UploadCvPage />
                    </Suspense>
                  }
                />
                <Route
                  path={'/profile/filling/career-buddy'}
                  element={
                    <Suspense fallback={<RouteFallback />}>
                      <CareerBuddyPage />
                    </Suspense>
                  }
                />
                {/* Legacy split route → shared shell + recruiter role. */}
                <Route
                  path={'/profile/filling/recruiter-buddy'}
                  element={<LegacyRecruiterBuddyRedirect />}
                />

                {/* New landing site — Figma canvas "New Landing Page" 7797:4614. Carries its own nav/footer, so it is mounted outside MainLayout. */}
                <Route
                  path={'/'}
                  element={
                    <Suspense fallback={<RouteFallback />}>
                      <LandingHomePage />
                    </Suspense>
                  }
                />
                <Route
                  path={'/how-it-works'}
                  element={
                    <Suspense fallback={<RouteFallback />}>
                      <HowItWorksPage />
                    </Suspense>
                  }
                />
                <Route
                  path={'/features'}
                  element={
                    <Suspense fallback={<RouteFallback />}>
                      <FeaturesPage />
                    </Suspense>
                  }
                />
                <Route
                  path={'/opportunities'}
                  element={
                    <Suspense fallback={<RouteFallback />}>
                      <OpportunitiesPage />
                    </Suspense>
                  }
                />
                <Route
                  path={'/for-parents-schools'}
                  element={
                    <Suspense fallback={<RouteFallback />}>
                      <ForParentsSchoolsPage />
                    </Suspense>
                  }
                />
                <Route
                  path={'/stories'}
                  element={
                    <Suspense fallback={<RouteFallback />}>
                      <StoriesPage />
                    </Suspense>
                  }
                />
                <Route
                  path={'/faq'}
                  element={
                    <Suspense fallback={<RouteFallback />}>
                      <FaqPage />
                    </Suspense>
                  }
                />
                <Route
                  path={'/coming-soon'}
                  element={
                    <Suspense fallback={<RouteFallback />}>
                      <ComingSoonPage />
                    </Suspense>
                  }
                />
                {/* Talent Messages — Figma canvas "Talent Messages" 7387:104275 (T-MSG, H, A, L frames, Playful + Focused).
            Frames are query params (see messagesState.js / wiki/talent-messages.md). Outside MainLayout. */}
                <Route
                  path={'/messages'}
                  element={
                    <Suspense fallback={<RouteFallback />}>
                      <TalentMessagesPage />
                    </Suspense>
                  }
                />
                <Route
                  path={'/messages/:conversationId'}
                  element={
                    <Suspense fallback={<RouteFallback />}>
                      <MessageLinkRedirect />
                    </Suspense>
                  }
                />
                {/* Talent Wallet — Figma canvas "Talent Wallet" 8817:693 (W-01 … W-27b, Playful + Focused, expanded + collapsed
            sidebar). Frames are query params (see talentWalletState.js / wiki/talent-wallet.md). Mock data only. Outside MainLayout. */}
                <Route
                  path={'/wallet'}
                  element={
                    <Suspense fallback={<RouteFallback />}>
                      <TalentWalletPage />
                    </Suspense>
                  }
                />
                {/* Talent Community v2 — Figma canvas "Talent - community Engagement" 5456:19207, section "Community v2 · Talent"
            (C-01 … C-17, Playful + Focused). Replaces the old recruiter-chrome Community (cancelled by design).
            Frames are query params (see communityState.js / wiki/talent-community.md). Outside MainLayout. */}
                <Route
                  path={'/community'}
                  element={
                    <Suspense fallback={<RouteFallback />}>
                      <CommunityBrowsePage />
                    </Suspense>
                  }
                />
                <Route
                  path={'/community/:communityId'}
                  element={
                    <Suspense fallback={<RouteFallback />}>
                      <CommunityPage />
                    </Suspense>
                  }
                />
                <Route
                  path={'/community/:communityId/post/:postId'}
                  element={
                    <Suspense fallback={<RouteFallback />}>
                      <CommunityPostPage />
                    </Suspense>
                  }
                />

                {/* Talent profile — Figma "Talent - Profile" 7500:92566 (Focused + Playful).
            Outside MainLayout like /home; state is chosen by query params (see
            talentProfileState.js / wiki/talent-profile.md). */}
                <Route
                  path={'/profile'}
                  element={
                    <Suspense fallback={<RouteFallback />}>
                      <TalentProfilePage />
                    </Suspense>
                  }
                />

                {/* Talent My Learning — Figma "Talent - My Learning" (Focused + Playful). Outside
            MainLayout like /home; state is chosen by query params (see
            talentLearningState.js / wiki/talent-my-learning.md). */}
                <Route
                  path={'/learning'}
                  element={
                    <Suspense fallback={<RouteFallback />}>
                      <TalentLearningPage />
                    </Suspense>
                  }
                />

                {/* Talent Settings & Account — Figma 7849:530 (Focused + Playful). Section = path param,
            states = query params (talentSettingsState.js / wiki/talent-settings.md). */}
                <Route
                  path={'/settings'}
                  element={
                    <Suspense fallback={<RouteFallback />}>
                      <TalentSettingsRoute />
                    </Suspense>
                  }
                />
                <Route
                  path={'/settings/:section'}
                  element={
                    <Suspense fallback={<RouteFallback />}>
                      <TalentSettingsRoute />
                    </Suspense>
                  }
                />
                <Route
                  path={'/logged-out'}
                  element={
                    <Suspense fallback={<RouteFallback />}>
                      <TalentLoggedOutPage />
                    </Suspense>
                  }
                />

                {/* Talent home — Figma "Talents dashboard" 5686:95479 (Focused + Playful).
            Outside MainLayout like the other dashboard screens; state is chosen by
            query params (see talentHomeState.js / wiki/talent-home.md). */}
                <Route
                  path={'/home'}
                  element={
                    <Suspense fallback={<RouteFallback />}>
                      <TalentHomePage />
                    </Suspense>
                  }
                />

                {/* Talent My Assessment — Figma canvas "Talent My Assessment" 7962:530 (overview, details, library, full
            assessment flow). Frames are query params (see assessmentState.js / wiki/talent-assessment.md). The Home tab
            /home?tab=assessment (HM-06) is unchanged. Outside MainLayout like /job-postings. */}
                <Route
                  path={'/my-assessment'}
                  element={
                    <Suspense fallback={<RouteFallback />}>
                      <AssessmentOverviewPage />
                    </Suspense>
                  }
                />
                <Route
                  path={'/my-assessment/personality'}
                  element={
                    <Suspense fallback={<RouteFallback />}>
                      <AssessmentDetailPage />
                    </Suspense>
                  }
                />
                <Route
                  path={'/my-assessment/skills/:skillId'}
                  element={
                    <Suspense fallback={<RouteFallback />}>
                      <AssessmentDetailPage />
                    </Suspense>
                  }
                />
                <Route
                  path={'/my-assessment/library'}
                  element={
                    <Suspense fallback={<RouteFallback />}>
                      <AssessmentLibraryPage />
                    </Suspense>
                  }
                />
                <Route
                  path={'/my-assessment/full/:skillId'}
                  element={
                    <Suspense fallback={<RouteFallback />}>
                      <AssessmentFullPage />
                    </Suspense>
                  }
                />

                {/* Talent Skills Lab — Figma canvas "Talent - Skills Lab" 7500:92564 (hub, lab details, lab flow, games).
            Frames are query params (see skillsLabState.js / wiki/talent-skills-lab.md). The old quiz page at
            /skills-lab/:skillSlug was removed. Outside MainLayout like /job-postings. */}
                <Route
                  path={'/skills-lab'}
                  element={
                    <Suspense fallback={<RouteFallback />}>
                      <SkillsLabHubPage />
                    </Suspense>
                  }
                />
                <Route
                  path={'/skills-lab/lab/:labId'}
                  element={
                    <Suspense fallback={<RouteFallback />}>
                      <LabDetailPage />
                    </Suspense>
                  }
                />
                <Route
                  path={'/skills-lab/lab/:labId/play'}
                  element={
                    <Suspense fallback={<RouteFallback />}>
                      <LabPlayPage />
                    </Suspense>
                  }
                />
                <Route
                  path={'/skills-lab/games/:gameId'}
                  element={
                    <Suspense fallback={<RouteFallback />}>
                      <GamePage />
                    </Suspense>
                  }
                />

                {/* Talent streak — Figma "Talent Streaks" 7532:2: S-07 "Your streak" full page (+ S-08 milestone
            modal via ?milestone=15). The pop-up (S-01..S-06) opens from the nav streak pill on any talent page
            (?streak=…). Outside MainLayout like /job-postings. */}
                <Route
                  path={'/streak'}
                  element={
                    <Suspense fallback={<RouteFallback />}>
                      <TalentStreakPage />
                    </Suspense>
                  }
                />

                {/* Talent job postings — Figma "Talent Job Postings" (J-01…J-21, Playful + Focused, expanded +
            collapsed rail). Frames are query params (see talentJobsState.js). Outside MainLayout. */}
                <Route
                  path={'/job-postings'}
                  element={
                    <Suspense fallback={<RouteFallback />}>
                      <TalentJobsPage />
                    </Suspense>
                  }
                />

                {/* Talent notifications full screen — Figma "Talent Notification Screens"
            7471:53182 (N-05 / N-06, Playful + Focused, collapsed + expanded rail). The pop-up and
            Help overlay open from the top-nav bell / help buttons (query params, see
            talentHomeState.js). Outside MainLayout like /home. */}
                <Route
                  path={'/notifications'}
                  element={
                    <Suspense fallback={<RouteFallback />}>
                      <TalentNotificationsPage />
                    </Suspense>
                  }
                />

                {/* Recruiter dashboard home — Figma 7249:73882 "Recruiter Home-
            Existing user". Mounts outside MainLayout and reuses DashboardShell
            (same top nav, sidebar and background, all built from this same
            Figma frame set), contributing only its own content column. The
            sidebar's Home item points here. */}
                <Route
                  path={'/recruiter/home'}
                  element={
                    <Suspense fallback={<RouteFallback />}>
                      <RecruiterHomePage />
                    </Suspense>
                  }
                />

                {/* Recruiter talent search — Figma 7249:74283 "Recruiter Talent
            Search". Same DashboardShell chrome as the recruiter home; the
            sidebar's Talent Search item points here. */}
                <Route
                  path={'/recruiter/talent-search'}
                  element={
                    <Suspense fallback={<RouteFallback />}>
                      <TalentSearchPage />
                    </Suspense>
                  }
                />

                {/* Remaining recruiter dashboard screens — Figma page "Job -
            Prospecting screens" (5566:50658), sections 7249:75045 / :75817 /
            :78065 / :79016 / :83992. All share DashboardShell chrome. */}
                <Route
                  path={'/recruiter/job-templates'}
                  element={
                    <Suspense fallback={<RouteFallback />}>
                      <JobTemplatesPage />
                    </Suspense>
                  }
                />
                <Route
                  path={'/recruiter/job-postings'}
                  element={
                    <Suspense fallback={<RouteFallback />}>
                      <JobPostingsPage />
                    </Suspense>
                  }
                />
                <Route
                  path={'/recruiter/job-screening'}
                  element={
                    <Suspense fallback={<RouteFallback />}>
                      <JobScreeningPage />
                    </Suspense>
                  }
                />
                <Route
                  path={'/recruiter/application-pipeline'}
                  element={
                    <Suspense fallback={<RouteFallback />}>
                      <ApplicationPipelinePage />
                    </Suspense>
                  }
                />
                <Route
                  path={'/recruiter/messages'}
                  element={
                    <Suspense fallback={<RouteFallback />}>
                      <RecruiterMessagesPage />
                    </Suspense>
                  }
                />

                {/* Avatar customiser steps. Selection state is on the app-root
            AvatarSelectionProvider so Career Buddy can reuse the same avatar. */}
                <Route element={<AvatarFlowLayout />}>
                  <Route
                    path={'/profile/engagement/avatar'}
                    element={
                      <Suspense fallback={<RouteFallback />}>
                        <AvatarPage />
                      </Suspense>
                    }
                  />
                  <Route
                    path={'/profile/engagement/avatar/skin'}
                    element={
                      <Suspense fallback={<RouteFallback />}>
                        <AvatarPage step="skin" />
                      </Suspense>
                    }
                  />
                  <Route
                    path={'/profile/engagement/avatar/hair'}
                    element={
                      <Suspense fallback={<RouteFallback />}>
                        <AvatarPage step="hair" />
                      </Suspense>
                    }
                  />
                  <Route
                    path={'/profile/engagement/avatar/extras'}
                    element={
                      <Suspense fallback={<RouteFallback />}>
                        <AvatarPage step="extras" />
                      </Suspense>
                    }
                  />
                  <Route
                    path={'/profile/engagement/avatar/outfit'}
                    element={
                      <Suspense fallback={<RouteFallback />}>
                        <AvatarPage step="outfit" />
                      </Suspense>
                    }
                  />
                </Route>

                {/* Unknown URLs: the signed-in user's home, or the landing page. */}
                <Route path="*" element={<UnknownRouteRedirect />} />
              </Routes>
            </Suspense>
          </CareerBuddyRoleProvider>
        </UiStyleProvider>
      </AvatarSelectionProvider>
    </BrowserRouter>
  );
}

export default App;
