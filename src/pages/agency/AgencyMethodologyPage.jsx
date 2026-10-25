import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AgencyFrame from '../../components/sections/agency/AgencyFrame.jsx';
import AgencyButton from '../../components/sections/agency/AgencyButton.jsx';
import AgencyPageHero from '../../components/sections/agency/AgencyPageHero.jsx';
import { useAgencyState } from '../../components/sections/agency/agencyState.js';
import MethodologyArticle from '../../components/sections/publicData/methodology/MethodologyArticle.jsx';
import { debug } from '../../utils/debug.js';

const log = debug('AgencyMethodologyPage');

/*
 * AgencyMethodologyPage — /agency/methodology (Figma 11.4.2r "How we count"). Theme 8's methodology article, `embedded` (stacked TOC + article), under the agency hero.
 * Deep links #privacy | #fresh | #sources | … scroll on arrival. "Download PDF" opens the briefing download dialog.
 */

const AgencyMethodologyPage = () => {
  const data = useAgencyState();
  const { hash } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    log('mount', { hash });
    if (!hash) return undefined;
    const raf = requestAnimationFrame(() =>
      document.getElementById(hash.slice(1))?.scrollIntoView({ block: 'start' })
    );
    return () => cancelAnimationFrame(raf);
  }, [hash]);

  return (
    <AgencyFrame data={data} title="How we count">
      <AgencyPageHero
        title="How we count"
        subtitle="Where the numbers come from, how often they refresh and why small groups are hidden."
        actions={<AgencyButton to="/agency/briefing?modal=download">Download PDF</AgencyButton>}
      />
      <MethodologyArticle
        embedded
        questionsTo="/agency/methodology#changes"
        onDownload={() => navigate('/agency/briefing?modal=download')}
      />
    </AgencyFrame>
  );
};

export default AgencyMethodologyPage;
