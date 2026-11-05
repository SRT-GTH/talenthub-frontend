import { useLayoutEffect, useRef } from 'react';
import Button from '../../../../ui/Button.jsx';
import heroPhoto from '../../../../../assets/admin/site-copy/preview/preview-hero-students-library.jpg';
import { classNames } from '../../../../../utils/classNames.js';
import { debug } from '../../../../../utils/debug.js';
import SectionOutline from './SectionOutline.jsx';

const log = debug('MockHero');

/*
 * MockHero — the Home hero of the mock public page (Figma 7.8.3a desktop 1279 x 415, 7.8.3b tablet 818 x 335, 7.8.3c phone 388 x 451).
 * desktop: copy 520 + photo 520 (r18, 520 x 340), headline 44/52 700, p 16/24, two buttons · tablet: copy 330, headline 34/40, photo 300 x 260, one button ·
 * phone: stacked, headline 28/34, p 14/20, photo 354 x 200. Props: device, t(key) (the text of a field), outline (SectionOutline props, `active` false hides it),
 * onLines({ now, original }) (phone: how many lines the headline wraps onto, measured, for the "How it fits" check), originalHeadline.
 */
const SIZES = {
  desktop: {
    box: 'flex-row items-center gap-[32px] px-[40px] py-[36px]',
    copy: 'w-[520px] shrink-0 gap-[12px]',
    h: 'text-[44px] leading-[52px]',
    p: 'text-[16px] leading-[24px]',
    img: 'h-[340px] w-[520px]',
    lh: 52,
  },
  tablet: {
    box: 'flex-row items-center gap-[32px] px-[40px] py-[36px]',
    copy: 'w-[330px] shrink-0 gap-[12px]',
    h: 'text-[34px] leading-[40px]',
    p: 'text-[16px] leading-[24px]',
    img: 'h-[260px] w-[300px]',
    lh: 40,
  },
  phone: {
    box: 'flex-col items-stretch gap-[16px] px-[18px] pt-[20px] pb-[24px]',
    copy: 'w-full gap-[12px]',
    h: 'text-[28px] leading-[34px]',
    p: 'text-[14px] leading-[20px]',
    img: 'h-[200px] w-full',
    lh: 34,
  },
};

const MockHero = ({ device, t, outline, onLines, originalHeadline }) => {
  const s = SIZES[device] ?? SIZES.desktop;
  const nowRef = useRef(null);
  const origRef = useRef(null);
  const headline = t('headline');

  useLayoutEffect(() => {
    if (!onLines || device !== 'phone') return;
    const lines = (el) => (el ? Math.max(1, Math.round(el.offsetHeight / s.lh)) : 1);
    const now = lines(nowRef.current);
    const original = lines(origRef.current);
    log('headline lines', { now, original, headline });
    onLines({ now, original });
  }, [headline, originalHeadline, device, onLines, s.lh]);

  const h2 = classNames('m-0 font-sans font-bold text-[#1c2a21]', s.h);
  return (
    <SectionOutline label="Hero" name="Hero section" {...outline} className="bg-[#f8f8f4]">
      <div className={classNames('flex', s.box)}>
        <div className={classNames('relative flex flex-col', s.copy)}>
          <h2 ref={nowRef} className={h2}>
            {headline}
          </h2>
          {device === 'phone' ? (
            <h2
              ref={origRef}
              aria-hidden="true"
              className={classNames(
                h2,
                'pointer-events-none invisible absolute top-0 left-0 w-full'
              )}
            >
              {originalHeadline}
            </h2>
          ) : null}
          <p className={classNames('m-0 font-sans text-[#575755]', s.p)}>{t('supporting')}</p>
          <div className="flex flex-wrap gap-[10px]">
            <Button variant="primary" size="lg" tabIndex={-1}>
              {t('primary_cta')}
            </Button>
            {device === 'desktop' ? (
              <Button variant="tertiary" size="lg" tabIndex={-1}>
                {t('secondary_cta')}
              </Button>
            ) : null}
          </div>
        </div>
        <img
          src={heroPhoto}
          alt=""
          className={classNames('shrink-0 rounded-[18px] object-cover', s.img)}
        />
      </div>
    </SectionOutline>
  );
};

export default MockHero;
