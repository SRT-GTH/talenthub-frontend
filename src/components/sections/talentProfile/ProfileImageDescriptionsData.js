import { useCallback, useState } from 'react';
import { debug } from '../../../utils/debug.js';

const log = debug('ProfileImageDescriptionsData');

/* Mock data for AX-06 / AX-06b (Figma Playful 7591:3728 + 7591:4339, Focused 8110:393111 + 8110:393635). Verbatim. */

export const IMG_CHECK = {
  score: '3/5',
  scoreLabel: 'readable',
  title: 'Make your portfolio readable by everyone',
  cta: 'Describe 2 images',
  items: [
    { key: 'captions', label: 'Pitch has captions', ok: true },
    { key: 'links', label: 'Links say where they go', ok: true },
    { key: 'titles', label: 'Plain-language titles', ok: true },
    { key: 'images', label: '2 images need descriptions', ok: false },
    { key: 'pdf', label: 'PDF brief isn’t tagged', ok: false },
  ],
};

export const ALT_BADGE = { described: 'Described', missing: 'Add description', prefix: 'ALT' };

// Images in review order; `key` matches PORTFOLIO_PROJECTS keys. Accra is already described.
export const ALT_IMAGES = [
  {
    key: 'cocoa',
    title: 'Cocoa price forecast',
    caption: 'Cocoa price forecast · cover image',
    cover: 'line',
    tag: 'Notebook',
    draft:
      'Line chart of Ghana cocoa farm-gate prices rising from about GHS 800 to GHS 1,450 per bag between 2020 and 2025. A dashed forecast line keeps rising into 2026.',
  },
  {
    // No drafted text is drawn for this image in Figma: the field starts empty.
    key: 'trotro',
    title: 'Trotro fare survey',
    caption: 'Trotro fare survey · cover image',
    cover: 'dots',
    tag: 'Case study',
    draft: '',
  },
];

export const ALT_INITIAL_DESCRIBED = ['traffic'];

export const ALT_MODAL = {
  title: 'Describe this image',
  sub: 'People using screen readers will hear this instead of seeing the image.',
  field: 'Image description (alt text)',
  buddy: 'Drafted by Career Buddy. Edit it to make it yours',
  tryAgain: 'Try again',
  tipsTitle: 'Good descriptions…',
  tips: [
    'Say what it shows (a line chart, a dashboard, a photo of…)',
    'Include the key number or trend',
    'Skip “image of”. Screen readers already say it',
  ],
  decorative: 'This image is decorative only (screen readers skip it)',
  say: 'Screen readers will say: ',
  hear: 'Hear it',
  next: 'Next: ',
  skip: 'Skip for now',
  save: 'Save & next',
};

/*
 * Image-description state shared by the Portfolio tab (chips), the check card and the alt modal.
 * `described` = project keys whose cover image has alt text (or is marked decorative).
 */
export const useImageDescriptions = () => {
  const [described, setDescribed] = useState(ALT_INITIAL_DESCRIBED);
  const markDescribed = useCallback((key) => {
    log('described', key);
    setDescribed((list) => (list.includes(key) ? list : [...list, key]));
  }, []);
  return { described, markDescribed };
};
