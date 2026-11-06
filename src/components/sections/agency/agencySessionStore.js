import { createContext, useContext } from 'react';

/* The raw agency session ({ loading, me, error, code, reload }); provided by AgencySessionProvider (AgencySessionContext.jsx). */
export const AgencySessionContext = createContext(null);

export const useAgencySessionState = () => useContext(AgencySessionContext);
