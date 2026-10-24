import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import MethodologyArticle from '../../components/sections/publicData/methodology/MethodologyArticle.jsx';
import MethodologyMobile from '../../components/sections/publicData/methodology/MethodologyMobile.jsx';
import MethodologyTipStage from '../../components/sections/publicData/methodology/MethodologyTipStage.jsx';
import PublicDataFrame from '../../components/sections/publicData/PublicDataFrame.jsx';
import { usePublicDataState } from '../../components/sections/publicData/publicDataState.js';
import PublicDataModals from '../../components/sections/publicData/share/PublicDataModals.jsx';
import { debug } from '../../utils/debug.js';

const log = debug('PublicMethodologyPage');

/*
 * PublicMethodologyPage — Figma canvas 8477:209484, 8.7.1a Methodology (8499:9) · phone 8.7.1b (8508:503) · tablet (8516:356171)
 * and the two component frames 8.7.2a Freshness tooltip / 8.7.2b Suppression popover, opened by ?tip=freshness | suppression.
 * Static, versioned copy (components/sections/publicData/methodology/data/methodologyData.js). Other pages import FreshnessTooltip and
 * SuppressionPopover from components/sections/publicData/methodology/.
 * Deep links: /data/methodology#privacy | #fresh | #sources | … (the tooltips link there); the hash is scrolled to on arrival.
 */
const useIsWide = () => {
  const [wide, setWide] = useState(() => window.matchMedia('(min-width: 768px)').matches);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const on = () => setWide(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return wide;
};

const PublicMethodologyPage = () => {
  const wide = useIsWide();
  const data = usePublicDataState();
  const { hash } = useLocation();
  const tip = data.params.get('tip');

  useEffect(() => {
    log('mount', { hash, tip });
    if (!hash || tip) return;
    const id = hash.slice(1);
    const raf = requestAnimationFrame(() => {
      const el =
        (window.matchMedia('(min-width: 768px)').matches
          ? null
          : document.getElementById(`m-${id}`)) ?? document.getElementById(id);
      el?.scrollIntoView({ block: 'start' });
    });
    return () => cancelAnimationFrame(raf);
  }, [hash, tip]);

  if (tip === 'freshness' || tip === 'suppression') return <MethodologyTipStage tip={tip} />;

  return (
    <PublicDataFrame data={data} title="Methodology" active="methodology" hideMobileTabs>
      {wide ? (
        <MethodologyArticle onDownload={() => data.update({ modal: 'download' })} />
      ) : (
        <MethodologyMobile />
      )}
      <PublicDataModals
        data={data}
        scope={{ title: 'Methodology', reportKind: 'overview', sharePath: 'methodology' }}
      />
    </PublicDataFrame>
  );
};

export default PublicMethodologyPage;
