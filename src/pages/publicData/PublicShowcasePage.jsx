import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { usePublicDataState } from '../../components/sections/publicData/publicDataState.js';
import PublicDataFrame from '../../components/sections/publicData/PublicDataFrame.jsx';
import MobileActionBar from '../../components/sections/publicData/ui/MobileActionBar.jsx';
import ShowcaseGrid from '../../components/sections/publicData/showcase/ShowcaseGrid.jsx';
import ShowcaseProfileView from '../../components/sections/publicData/showcase/ShowcaseProfileView.jsx';
import {
  SHOWCASE_PROFILES,
  getShowcase,
  resolveProfile,
} from '../../components/sections/publicData/showcase/data/showcaseData.js';
import PublicDataModals from '../../components/sections/publicData/share/PublicDataModals.jsx';
import { debug } from '../../utils/debug.js';

const log = debug('PublicShowcasePage');

/*
 * PublicShowcasePage — Talent showcase (Figma canvas 8477:209484: 8.4.1a-d, 8.4.2a-b).
 *   /data/showcase                 default profile (Akosua O.)        /data/showcase/:profileId   one of the five consented sample profiles
 *   ?consent=open                  consent banner expanded (8.4.1c)    ?view=grid                  grid overview (8.4.2b)
 *   ?nav=next                      ⚠️ ASSUMPTION: frame 8.4.2a ("hover Next") draws the 2nd profile with the Next pill hovered, so this key
 *                                  shows profile 2 of 5 with that pill in its hover look (without a :profileId)
 * Unknown :profileId falls back to the first profile (⚠️ ASSUMPTION: no "not found" frame is drawn).
 */

const PublicShowcasePage = () => {
  const data = usePublicDataState();
  const { profileId } = useParams();
  const { params, update, view } = data;
  const consentOpen = params.get('consent') === 'open';
  const navHover = params.get('nav') === 'next' && !profileId;
  const showcase = useMemo(() => getShowcase(), []);
  const resolved = resolveProfile(navHover ? SHOWCASE_PROFILES[1].id : profileId);
  const isGrid = view === 'grid' && !profileId;

  useEffect(() => {
    log('mount', { profileId, view, consentOpen, navHover });
  }, [profileId, view, consentOpen, navHover]);

  return (
    <PublicDataFrame data={data} title="Talent showcase" active="showcase">
      {isGrid ? (
        <ShowcaseGrid
          profiles={showcase.profiles}
          consent={showcase.consent}
          copy={showcase.grid}
        />
      ) : (
        <ShowcaseProfileView
          resolved={resolved}
          consent={showcase.consent}
          consentOpen={consentOpen}
          onToggleConsent={() => {
            log('toggle consent', !consentOpen);
            update({ consent: consentOpen ? null : 'open' }, { replace: true });
          }}
          forceNextHover={navHover}
        />
      )}
      <MobileActionBar
        onShare={() => update({ modal: 'share' })}
        onDownload={() => update({ modal: 'download' })}
      />
      <PublicDataModals
        data={data}
        scope={{ title: 'Talent showcase', reportKind: 'overview', sharePath: 'showcase' }}
      />
    </PublicDataFrame>
  );
};

export default PublicShowcasePage;
