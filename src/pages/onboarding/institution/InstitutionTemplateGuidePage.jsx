import TemplateGuideSection from '../../../components/sections/institutionOnboarding/TemplateGuideSection.jsx';

/*
 * InstitutionTemplateGuidePage — thin route wrapper for the Template Guide
 * step (part of Phase 4 "Bulk Upload" in the institution onboarding flow).
 *
 * Placement: activate → template-guide (this) → template → upload
 * Route:     /onboarding/institution/template-guide
 * Layout:    InstitutionOnboardingLayout (right panel visible)
 * Figma:     3007:39760 ("Template guide(CSV)")
 *
 * This guide explains the column structure of GTH_Bulk_Upload_Template.csv
 * so the admin knows what data to prepare before filling the spreadsheet.
 */
const InstitutionTemplateGuidePage = () => <TemplateGuideSection />;

export default InstitutionTemplateGuidePage;
