import { useEffect, useRef, useState } from 'react';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import Button from '../../../ui/Button.jsx';
import TextInput from '../../../ui/form/TextInput.jsx';
import { SettingsACard } from '../../talentSettings/SettingsAUi.jsx';
import { AgencyArrowRightIcon } from '../agencyIcons.jsx';
import { ROLES } from './data/agencySettingsData.js';

const log = debug('AgencyInviteAnalystCard');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?[0-9 ()-]{7,}$/;

/*
 * AgencyInviteAnalystCard — Figma 11.6.1c "Invite an analyst" (8611:1068): name, work email (+ phone, needed for the account), role pills,
 * "Send invite →" and "Seats after this invite: n of N". Drawn in place of the analyst list. Esc or Cancel closes.
 * The email must use the agency's domain when one is known (from the agency's own contact address).
 * Props: seatsUsed, seats, domain ("@agency.gov.gh" or ""), error (server message), onSend({name,email,phone,role}), onClose.
 */
const AgencyInviteAnalystCard = ({ seatsUsed, seats, domain, error, onSend, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('Analyst');
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const nameRef = useRef(null);
  const full = seatsUsed + 1 > seats;

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
    const next = {};
    if (!name.trim()) next.name = 'Enter their name';
    const addr = email.trim().toLowerCase();
    if (!EMAIL_RE.test(addr)) next.email = 'Enter a valid work email';
    else if (domain && !addr.endsWith(domain)) next.email = `Use an ${domain} address`;
    if (!PHONE_RE.test(phone.trim())) next.phone = 'Enter their phone number';
    setErrors(next);
    log('submit', { errors: Object.keys(next), role });
    if (Object.keys(next).length || full) return;
    setBusy(true);
    try {
      await onSend({ name: name.trim(), email: addr, phone: phone.trim(), role });
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} noValidate>
      <SettingsACard title="Invite an analyst">
        <p className="m-0 -mt-[4px] text-[14px] leading-[1.5] text-[#595959]">
          {domain ? `They must use an ${domain} address. ` : ''}We create their sign-in and show you
          a temporary password to hand over; they choose their own at first sign-in.
        </p>
        <div className="grid grid-cols-1 gap-[16px] md:grid-cols-2">
          <TextInput
            ref={nameRef}
            label="Their name"
            id="invite-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
            aria-invalid={errors.name ? 'true' : undefined}
          />
          <TextInput
            label="Work email"
            id="invite-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            aria-invalid={errors.email ? 'true' : undefined}
          />
          <TextInput
            label="Phone"
            id="invite-phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            error={errors.phone}
            aria-invalid={errors.phone ? 'true' : undefined}
          />
        </div>
        <div role="radiogroup" aria-label="Role" className="flex flex-wrap gap-[8px] pt-[8px]">
          {ROLES.map((r) => (
            <button
              key={r}
              type="button"
              role="radio"
              aria-checked={role === r}
              onClick={() => setRole(r)}
              className={classNames(
                'cursor-pointer rounded-full px-[14px] py-[8px] text-[14px] leading-[17px] font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]',
                role === r
                  ? 'bg-[#1c2a21] text-white'
                  : 'border border-[rgba(28,42,33,0.1)] bg-white text-[#1c2a21]'
              )}
            >
              {r}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-x-[12px] gap-y-[8px] pt-[12px]">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={full || busy}
            rightIcon={<AgencyArrowRightIcon className="size-full" />}
          >
            {busy ? 'Creating…' : 'Send invite'}
          </Button>
          <p className="m-0 text-[13px] leading-[16px] text-[#595959]">
            Seats after this invite: {Math.min(seatsUsed + 1, seats)} of {seats}
          </p>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer text-[14px] font-semibold text-[#595959] underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
          >
            Cancel
          </button>
        </div>
        {full ? (
          <p role="alert" className="m-0 text-[13.5px] leading-[20px] text-[#c0392b]">
            Seats are set by your MoU. Ask your GTH contact to add more.
          </p>
        ) : null}
        {error ? (
          <p role="alert" className="m-0 text-[13.5px] leading-[20px] text-[#c0392b]">
            {error}
          </p>
        ) : null}
      </SettingsACard>
    </form>
  );
};

export default AgencyInviteAnalystCard;
