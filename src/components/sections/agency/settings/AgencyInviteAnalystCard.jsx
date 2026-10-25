import { useEffect, useRef, useState } from 'react';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import Button from '../../../ui/Button.jsx';
import TextInput from '../../../ui/form/TextInput.jsx';
import { SettingsACard } from '../../talentSettings/SettingsAUi.jsx';
import { AgencyArrowRightIcon } from '../agencyIcons.jsx';
import { ANALYST_DOMAIN, ANALYST_SEATS, ROLES } from './data/agencySettingsData.js';

const log = debug('AgencyInviteAnalystCard');

/*
 * AgencyInviteAnalystCard — Figma 11.6.1c "Invite an analyst" (8611:1068): name + work email, role pills (Admin selected), "Send invite →" and
 * "Seats after this invite: n of 5". Drawn in place of the analyst list. Esc or Cancel closes (⚠️ ASSUMPTION: Cancel is not drawn).
 * Figma draws the role pills as Admin · Analyst · Viewer · Admin (a leftover): the duplicate fourth pill is not rendered.
 * Props: seatsUsed, onSend({name,email,role}), onClose.
 */
const AgencyInviteAnalystCard = ({ seatsUsed, onSend, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Admin');
  const [errors, setErrors] = useState({});
  const nameRef = useRef(null);
  const full = seatsUsed + 1 > ANALYST_SEATS;

  useEffect(() => {
    nameRef.current?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const submit = (e) => {
    e.preventDefault();
    const next = {};
    if (!name.trim()) next.name = 'Enter their name';
    const addr = email.trim().toLowerCase();
    if (
      !addr.endsWith(ANALYST_DOMAIN) ||
      addr.length <= ANALYST_DOMAIN.length ||
      addr.includes(' ')
    ) {
      next.email = `Use an ${ANALYST_DOMAIN} address`;
    }
    setErrors(next);
    log('submit', { errors: Object.keys(next), role });
    if (Object.keys(next).length || full) return;
    onSend({ name: name.trim(), email: addr, role });
  };

  return (
    <form onSubmit={submit} noValidate>
      <SettingsACard title="Invite an analyst">
        <p className="m-0 -mt-[4px] text-[14px] leading-[1.5] text-[#595959]">
          They must use an @nya.gov.gh address. Invites expire after 7 days.
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
            disabled={full}
            rightIcon={<AgencyArrowRightIcon className="size-full" />}
          >
            Send invite
          </Button>
          <p className="m-0 text-[13px] leading-[16px] text-[#595959]">
            Seats after this invite: {Math.min(seatsUsed + 1, ANALYST_SEATS)} of {ANALYST_SEATS}
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
      </SettingsACard>
    </form>
  );
};

export default AgencyInviteAnalystCard;
