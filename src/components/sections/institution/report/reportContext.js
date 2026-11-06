import { createContext, useContext } from 'react';

/* The live board report (buildReport) for the eight page components; InstitutionReportViewer provides it. */
export const InstitutionReportContext = createContext(null);

export const useInstitutionReport = () => useContext(InstitutionReportContext);
