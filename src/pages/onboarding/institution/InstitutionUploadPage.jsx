import { Navigate } from 'react-router-dom';

/*
 * InstitutionUploadPage — /onboarding/institution/upload (step 5 of 8 of the institution bulk-onboarding flow, Figma 3010:42286).
 * The class-list upload lives in the school portal now: one upload for every education level, email or phone, opt-out notices for under-18s
 * (Students › Upload a class list, components/sections/institution/roster/InstitutionUploadDialog.jsx). The old step needed the registration
 * of this browser session and told an approved institution that signed in later to "Register your institution first", so this route sends
 * everyone to the portal dialog; the portal itself handles signing in and accreditation.
 */
const InstitutionUploadPage = () => <Navigate to="/institution/students?modal=upload" replace />;

export default InstitutionUploadPage;
