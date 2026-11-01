import { useState } from 'react';
import { debug } from '../../../utils/debug.js';
import { classNames } from '../../../utils/classNames.js';
import Button from '../../ui/Button.jsx';
import { reportFinished, apiErrorOf } from '../../../services/learningPath.api.js';
import { CARD_SOFT, FOCUS, HEAD } from './CourseUi.jsx';
import CourseShortCheck from './CourseShortCheck.jsx';

const log = debug('OffPlatformPanel');

/*
 * OffPlatformPanel — progress on a course that runs on another site (learning path iteration 4, C1).
 *   1. The talent opens the course from this page (the link carries no personal data).
 *   2. "Did you finish?" — Finished (optionally with a certificate link) / Not yet / I stopped.
 *   3. The short check raises "I finished" to "Checked" and adds training-evidenced skills.
 * Labels follow the trust tiers: Self-reported, Self-reported with proof, Checked, Seen on GTH, Verified.
 */
const STATUS_COPY = {
  not_started: 'Not started yet',
  clicked_out: 'Opened — come back and tell us how it went',
  in_progress: 'In progress',
  completed: 'Finished',
  dropped: 'You stopped this course',
};

const isHttps = (v) => {
  try {
    return new URL(v).protocol === 'https:';
  } catch {
    return false;
  }
};

const OffPlatformPanel = ({ courseId, courseTitle, page, onChanged }) => {
  const progress = page?.progress || { status: 'not_started' };
  const [proof, setProof] = useState('');
  const [showProof, setShowProof] = useState(false);
  const [busy, setBusy] = useState(null);
  const [error, setError] = useState(null);
  const [checkOpen, setCheckOpen] = useState(false);
  const [checkAvailable, setCheckAvailable] = useState(Boolean(page?.shortCheckAvailable));
  const done = progress.status === 'completed';
  const checked = ['T1', 'T2', 'T3'].includes(progress.trustTier);

  const answer = async (value) => {
    if (value === 'finished' && proof && !isHttps(proof)) {
      setError('The certificate link must start with https://');
      return;
    }
    setBusy(value);
    setError(null);
    try {
      const r = await reportFinished(
        courseId,
        value,
        value === 'finished' && proof ? proof : undefined
      );
      log('answered', { value, tier: r?.progress?.trustTier });
      if (typeof r?.shortCheckAvailable === 'boolean') setCheckAvailable(r.shortCheckAvailable);
      setShowProof(false);
      if (onChanged) onChanged();
    } catch (err) {
      setError(apiErrorOf(err).message);
    } finally {
      setBusy(null);
    }
  };

  return (
    <>
      <section
        data-testid="off-platform-panel"
        className={classNames(
          'flex flex-col gap-[14px] rounded-[22px] p-[clamp(14px,1.27vw,22px)]',
          CARD_SOFT
        )}
      >
        <div className="flex flex-wrap items-center gap-[8px]">
          <h2
            className={classNames(
              HEAD,
              'min-w-0 flex-1 text-[clamp(18px,1.27vw,22px)] leading-[1.25] text-[#1c2a21]'
            )}
          >
            Your progress
          </h2>
          {progress.trustLabel && (
            <span className="shrink-0 rounded-full bg-[#ebf1ec] px-[10px] py-[4px] text-[12px] font-bold text-[#1f4d26]">
              {progress.trustLabel}
            </span>
          )}
        </div>
        <p className="m-0 text-[14.5px] text-[#1c2a21]">
          {STATUS_COPY[progress.status] || STATUS_COPY.not_started}
          {progress.progressPct > 0 && progress.progressPct < 100
            ? ` · ${progress.progressPct}% watched`
            : ''}
        </p>

        {!done && (
          <div className="flex flex-col gap-[10px]">
            <p className="m-0 text-[14.5px] font-semibold text-[#1c2a21]">
              Did you finish {courseTitle || 'this course'}?
            </p>
            <div className="flex flex-wrap gap-[8px]">
              <Button
                variant="primary"
                size="sm"
                onClick={() => answer('finished')}
                disabled={Boolean(busy)}
              >
                {busy === 'finished' ? 'Saving…' : 'Yes, I finished'}
              </Button>
              <Button
                variant="tertiary"
                size="sm"
                onClick={() => answer('not_yet')}
                disabled={Boolean(busy)}
              >
                Not yet
              </Button>
              <Button
                variant="tertiary-cream"
                size="sm"
                onClick={() => answer('stopped')}
                disabled={Boolean(busy)}
              >
                I stopped
              </Button>
            </div>
            {showProof ? (
              <label className="flex flex-col gap-[6px] text-[13px] text-[#595959]">
                Certificate link (optional)
                <input
                  type="url"
                  inputMode="url"
                  placeholder="https://"
                  value={proof}
                  onChange={(e) => setProof(e.target.value.trim())}
                  className={classNames(
                    'h-[42px] rounded-[12px] border border-[#c1d4c4] bg-white px-[12px] text-[14.5px] text-[#1c2a21]',
                    FOCUS
                  )}
                />
              </label>
            ) : (
              <button
                type="button"
                onClick={() => setShowProof(true)}
                className={classNames(
                  'w-fit cursor-pointer text-[13.5px] font-semibold text-[#2d5d33]',
                  FOCUS
                )}
              >
                Got a certificate? Add the link
              </button>
            )}
          </div>
        )}

        {done && !checked && checkAvailable && !checkOpen && (
          <div className="flex flex-col gap-[8px]">
            <p className="m-0 text-[14px] leading-[1.45] text-[#595959]">
              “I finished” counts as self-reported. Take the short check to show what you learned.
            </p>
            <div>
              <Button variant="secondary" size="sm" onClick={() => setCheckOpen(true)}>
                Take the short check
              </Button>
            </div>
          </div>
        )}

        {page?.tracking && page.tracking.allowed === false && (
          <p className="m-0 text-[12.5px] leading-[1.4] text-[#737373]">
            {page.tracking.reason === 'GUARDIAN_CONSENT_REQUIRED'
              ? 'Progress tracking is off until a parent or guardian switches it on. You can still tell us when you finish.'
              : 'You’ve switched progress tracking off. You can still tell us when you finish.'}
          </p>
        )}
        {page?.needsGuardianConsent && (
          <p className="m-0 text-[12.5px] leading-[1.4] text-[#9a6b14]">
            This provider asks for a parent or guardian’s agreement before under-18s sign up.
          </p>
        )}
        {error && (
          <p className="m-0 text-[14px] text-[#9a3b2f]" role="alert">
            {error}
          </p>
        )}
      </section>

      {checkOpen && (
        <CourseShortCheck
          courseId={courseId}
          courseTitle={courseTitle}
          onClose={() => setCheckOpen(false)}
          onDone={() => onChanged && onChanged()}
        />
      )}
    </>
  );
};

export default OffPlatformPanel;
