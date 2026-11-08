import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import api from '../../../services/api.js';
import { debug } from '../../../utils/debug.js';

const log = debug('LiveTalentDrawer');

/*
 * LiveTalentDrawer - signed-in recruiter: one talent from Talent Search, and "Invite to apply".
 *   GET  /search/talents/:profileId?opportunityId=   recruiter-safe profile (no contact / ID details)
 *   POST /search/talents/:profileId/invite           { opportunityId, message } -> { conversationId }
 * The backend applies the search rules (privacy, minors only for internship / training postings, blocks,
 * "let recruiters message me first", the under-18 parent rule) and answers with a message when it says no.
 * Props: profileId, postings ([{ id, title, type }] the recruiter's open postings), jobId (preselected),
 *        startWithInvite, onClose.
 */

const unwrap = (res) => (res?.data?.data !== undefined ? res.data.data : res?.data);
const errorText = (err) =>
  err?.response?.data?.message || 'Something went wrong. Please try again.';

const Section = ({ title, children }) => (
  <section className="flex flex-col gap-[8px]">
    <h3 className="m-0 font-sans text-[13px] font-semibold tracking-[0.4px] text-[#575755] uppercase">
      {title}
    </h3>
    {children}
  </section>
);

const Pill = ({ children }) => (
  <span className="inline-flex h-[26px] items-center rounded-full bg-[#ebf1ec] px-[10px] font-sans text-[12px] font-medium text-[#2a5730]">
    {children}
  </span>
);

const LiveTalentDrawer = ({
  profileId,
  postings = [],
  jobId,
  startWithInvite = false,
  onClose,
}) => {
  const [data, setData] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [inviting, setInviting] = useState(startWithInvite);
  const [posting, setPosting] = useState(
    postings.some((p) => p.id === jobId) ? jobId : postings[0]?.id || ''
  );
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState(null);
  const [sent, setSent] = useState(null);

  useEffect(() => {
    let alive = true;
    setData(null);
    setLoadError(null);
    api
      .get(`/search/talents/${encodeURIComponent(profileId)}`, {
        params: jobId ? { opportunityId: jobId } : undefined,
      })
      .then((res) => alive && setData(unwrap(res)))
      .catch((err) => alive && setLoadError(errorText(err)));
    return () => {
      alive = false;
    };
  }, [profileId, jobId]);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const t = data?.talent;
  const job = postings.find((p) => p.id === posting);
  const appliedTo = new Set((data?.applications || []).map((a) => a.opportunityId));
  const defaultText =
    t && job
      ? `Hi ${t.firstName || 'there'}, I'd like to invite you to apply for ${job.title}. You can find it in Opportunities on GTH.`
      : '';

  const send = () => {
    if (!posting || sending) return;
    setSending(true);
    setSendError(null);
    api
      .post(`/search/talents/${encodeURIComponent(profileId)}/invite`, {
        opportunityId: posting,
        ...(message.trim() ? { message: message.trim() } : {}),
      })
      .then((res) => {
        const out = unwrap(res);
        log('invited', out?.conversationId);
        setSent(out);
      })
      .catch((err) => setSendError(errorText(err)))
      .finally(() => setSending(false));
  };

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t ? `${t.fullName}'s profile` : 'Talent profile'}
      className="fixed inset-0 z-50 flex justify-end bg-[#0b1a0f]/45"
      onClick={onClose}
    >
      <aside
        onClick={(e) => e.stopPropagation()}
        className="flex h-full w-full max-w-[520px] flex-col gap-[20px] overflow-y-auto bg-white px-[28px] py-[24px] shadow-[0_40px_100px_rgba(0,0,0,0.25)] max-sm:px-[16px]"
      >
        <div className="flex items-start justify-between gap-[12px]">
          <div className="flex min-w-0 flex-col gap-[4px]">
            <h2 className="m-0 font-heading text-[24px] leading-[30px] font-semibold text-[#1c2a21]">
              {t ? t.fullName : loadError ? 'Talent' : 'Loading…'}
            </h2>
            {t ? (
              <p className="m-0 font-sans text-[14px] text-[#575755]">
                {[t.headline, t.location?.city || t.location?.region].filter(Boolean).join(' · ')}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="cursor-pointer rounded-full border border-[#e1eae2] bg-white px-[12px] py-[6px] font-sans text-[13px] font-semibold text-[#1c2a21]"
          >
            Close
          </button>
        </div>

        {loadError ? (
          <p role="alert" className="m-0 font-sans text-[14px] text-[#b42318]">
            {loadError}
          </p>
        ) : null}

        {t ? (
          <>
            <div className="flex flex-wrap gap-[6px]">
              <Pill>{`Profile ${Math.round(t.profileCompletion || 0)}% complete`}</Pill>
              <Pill>{t.availability === 'available' ? 'Available now' : 'Open to offers'}</Pill>
              {t.isMinor ? <Pill>Under 18</Pill> : null}
              {(data.applications || []).map((a) => (
                <Pill key={a.opportunityId}>{`Applied: ${a.title}`}</Pill>
              ))}
            </div>
            {t.bio ? (
              <Section title="About">
                <p className="m-0 font-sans text-[14px] leading-[21px] text-[#1c2a21]">{t.bio}</p>
              </Section>
            ) : null}
            {t.skills?.length ? (
              <Section title="Skills">
                <div className="flex flex-wrap gap-[6px]">
                  {t.skills.map((s) => (
                    <Pill key={s}>{s}</Pill>
                  ))}
                </div>
              </Section>
            ) : null}
            {t.education?.length ? (
              <Section title="Education">
                {t.education.map((e, i) => (
                  <p key={i} className="m-0 font-sans text-[14px] text-[#1c2a21]">
                    <strong>
                      {[e.degree, e.fieldOfStudy].filter(Boolean).join(', ') || 'Studies'}
                    </strong>
                    {e.institution ? ` · ${e.institution}` : ''}
                    {e.startYear ? ` · ${e.startYear}–${e.current ? 'now' : e.endYear || ''}` : ''}
                  </p>
                ))}
              </Section>
            ) : null}
            {t.workExperience?.length ? (
              <Section title="Experience">
                {t.workExperience.map((w, i) => (
                  <p key={i} className="m-0 font-sans text-[14px] text-[#1c2a21]">
                    <strong>{w.title || 'Role'}</strong>
                    {w.company ? ` · ${w.company}` : ''}
                    {w.from ? ` · ${w.from}–${w.current ? 'now' : w.to || ''}` : ''}
                  </p>
                ))}
              </Section>
            ) : null}
            {t.certifications?.length ? (
              <Section title="Certificates">
                {t.certifications.map((c, i) => (
                  <p key={i} className="m-0 font-sans text-[14px] text-[#1c2a21]">
                    {[c.name, c.issuer, c.year].filter(Boolean).join(' · ')}
                  </p>
                ))}
              </Section>
            ) : null}

            <Section title="Invite to apply">
              {sent ? (
                <p className="m-0 font-sans text-[14px] text-[#2a5730]">
                  Invite sent.{' '}
                  <Link
                    to={`/recruiter/messages?conversation=${sent.conversationId}`}
                    className="font-semibold text-[#387440] underline"
                  >
                    Open the conversation
                  </Link>
                </p>
              ) : !postings.length ? (
                <p className="m-0 font-sans text-[14px] text-[#575755]">
                  Publish a job first, then invite talents to apply to it.
                </p>
              ) : !inviting ? (
                <button
                  type="button"
                  onClick={() => setInviting(true)}
                  disabled={!t.acceptsRecruiterMessages}
                  className="h-[42px] w-fit cursor-pointer rounded-[10px] border-2 border-[#2a5730] bg-[#387440] px-[18px] font-sans text-[14px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {t.acceptsRecruiterMessages
                    ? 'Invite to apply'
                    : 'Not accepting recruiter messages'}
                </button>
              ) : (
                <div className="flex flex-col gap-[10px]">
                  <label className="flex flex-col gap-[4px] font-sans text-[13px] font-medium text-[#1c2a21]">
                    Posting
                    <select
                      value={posting}
                      onChange={(e) => setPosting(e.target.value)}
                      className="h-[40px] rounded-[10px] border border-[#dbded9] bg-white px-[10px] font-sans text-[14px]"
                    >
                      {postings.map((p) => (
                        <option key={p.id} value={p.id} disabled={appliedTo.has(p.id)}>
                          {p.title}
                          {appliedTo.has(p.id) ? ' (already applied)' : ''}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="flex flex-col gap-[4px] font-sans text-[13px] font-medium text-[#1c2a21]">
                    Message
                    <textarea
                      rows={4}
                      value={message}
                      placeholder={defaultText}
                      onChange={(e) => setMessage(e.target.value)}
                      className="rounded-[10px] border border-[#dbded9] p-[10px] font-sans text-[14px]"
                    />
                  </label>
                  {sendError ? (
                    <p role="alert" className="m-0 font-sans text-[13px] text-[#b42318]">
                      {sendError}
                    </p>
                  ) : null}
                  <button
                    type="button"
                    onClick={send}
                    disabled={sending || !posting}
                    className="h-[42px] w-fit cursor-pointer rounded-[10px] border-2 border-[#2a5730] bg-[#387440] px-[18px] font-sans text-[14px] font-semibold text-white disabled:opacity-50"
                  >
                    {sending ? 'Sending…' : 'Send invite'}
                  </button>
                </div>
              )}
            </Section>
          </>
        ) : null}
      </aside>
    </div>,
    document.body
  );
};

export default LiveTalentDrawer;
