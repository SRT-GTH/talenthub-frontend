import { useEffect, useRef, useState } from 'react';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import Button from '../../../ui/Button.jsx';
import TextInput from '../../../ui/form/TextInput.jsx';
import { SettingsACard } from '../../talentSettings/SettingsAUi.jsx';
import { apiMessage } from '../../../../services/institutionPortal.api.js';
import { InstitutionSettingsArrowRightIcon } from './institutionSettingsIcons.jsx';
import { ROLES } from './data/institutionSettingsData.js';

const log = debug('InstitutionInviteStaffCard');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/*
 * InstitutionInviteStaffCard — Figma 11.6.1e "Invite a staff member" (8746:263): name + work email, role pills, "Send invite →" and "Seats after this invite:
 * n of N". Drawn in place of the staff list. Esc or Cancel closes. Sending calls POST /institution/staff: they get an email link (valid 7 days) to set up
 * their GTH login as this school's staff. The Figma rule "must use an @school domain" is dropped: many schools use personal addresses.
 * Props: seatsUsed, seatCap, prefill { name, email }, onSend({name,email,role}) -> Promise (throws on failure), onClose.
 */
const InstitutionInviteStaffCard = ({ seatsUsed, seatCap, prefill, onSend, onClose }) => {
  const [name, setName] = useState(prefill?.name ?? '');
  const [email, setEmail] = useState(prefill?.email ?? '');
  const [role, setRole] = useState('teacher');
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [failure, setFailure] = useState('');
  const nameRef = useRef(null);
  const full = seatsUsed + 1 > seatCap;

  useEffect(() => {
    nameRef.current?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const submit = async (e) => {
    e.preventDefault();
    if (busy) return;
    const next = {};
    if (name.trim().length < 2) next.name = 'Enter their name';
    const addr = email.trim().toLowerCase();
    if (!EMAIL_RE.test(addr)) next.email = 'Enter a valid email address';
    setErrors(next);
    setFailure('');
    log('submit', { errors: Object.keys(next), role });
    if (Object.keys(next).length || full) {
      requestAnimationFrame(() => document.querySelector('[aria-invalid="true"]')?.focus());
      return;
    }
    setBusy(true);
    try {
      await onSend({ name: name.trim(), email: addr, role });
    } catch (err) {
      const msg = apiMessage(err);
      if (/email|account|invite/i.test(msg)) setErrors({ email: msg });
      else setFailure(msg);
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} noValidate>
      <SettingsACard title="Invite a staff member">
        <p className="m-0 -mt-[4px] text-[14px] leading-[1.5] text-[#595959]">
          They get an email link to set up their own login. The link works for 7 days.
        </p>
        <div className="grid grid-cols-1 gap-[16px] md:grid-cols-2">
          <TextInput
            ref={nameRef}
            label="Their name"
            id="invite-name"
            placeholder="Kwabena Asare"
            autoComplete="off"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
            aria-invalid={errors.name ? 'true' : undefined}
          />
          <TextInput
            label="Work email"
            id="invite-email"
            type="email"
            placeholder="name@school.edu.gh"
            autoComplete="off"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            aria-invalid={errors.email ? 'true' : undefined}
          />
        </div>
        <div role="radiogroup" aria-label="Role" className="flex flex-wrap gap-[8px] pt-[8px]">
          {ROLES.map((r) => (
            <button
              key={r.id}
              type="button"
              role="radio"
              aria-checked={role === r.id}
              onClick={() => setRole(r.id)}
              className={classNames(
                'min-h-[34px] cursor-pointer rounded-full px-[14px] py-[8px] text-[14px] leading-[17px] font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]',
                role === r.id
                  ? 'bg-[#1c2a21] text-white'
                  : 'border border-[rgba(28,42,33,0.1)] bg-white text-[#1c2a21]'
              )}
            >
              {r.pill}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-x-[12px] gap-y-[8px] pt-[12px]">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={full || busy}
            rightIcon={<InstitutionSettingsArrowRightIcon className="size-full" />}
          >
            {busy ? 'Sending…' : 'Send invite'}
          </Button>
          <p className="m-0 text-[13px] leading-[16px] text-[#595959]">
            Seats after this invite: {Math.min(seatsUsed + 1, seatCap)} of {seatCap}
          </p>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex min-h-[24px] cursor-pointer items-center text-[14px] font-semibold text-[#595959] underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
          >
            Cancel
          </button>
        </div>
        {full ? (
          <p role="alert" className="m-0 text-[13.5px] leading-[20px] text-[#c0392b]">
            Every seat is in use. Ask your GTH contact if you need more.
          </p>
        ) : null}
        {failure ? (
          <p role="alert" className="m-0 text-[13.5px] leading-[20px] text-[#c0392b]">
            {failure}
          </p>
        ) : null}
      </SettingsACard>
    </form>
  );
};

export default InstitutionInviteStaffCard;
