import { createContext, useContext } from 'react';

/* The live report (buildReport) for the eight page components; AgencyReportViewer provides it. */
export const ReportContext = createContext(null);

export const useReport = () => useContext(ReportContext);
