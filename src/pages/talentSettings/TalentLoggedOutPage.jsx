import UiStyleScope from '../../components/shared/UiStyleScope.jsx';
import LoggedOutScreen from '../../components/sections/talentSettings/LoggedOutScreen.jsx';
// Site copy: the texts staff edit are applied to this page's data (copy/copyBind.js).
import '../../copy/portals/talentPagesCopy.js';

/*
 * TalentLoggedOutPage — `/logged-out`, Figma LO-02 "Logged out" (Playful 7846:14928 / Focused 8110:57103).
 * Own route without the talent shell (the user is signed out); still themed by the style switch scope.
 */
const TalentLoggedOutPage = () => (
  <>
    <UiStyleScope enabled />
    <LoggedOutScreen />
  </>
);

export default TalentLoggedOutPage;
