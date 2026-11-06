import { createContext, useContext } from 'react';

/* The raw institution session ({ loading, me, error, code, reload }); provided by InstitutionSessionProvider (InstitutionSessionContext.jsx). */
export const InstitutionSessionContext = createContext(null);

export const useInstitutionSessionState = () => useContext(InstitutionSessionContext);
