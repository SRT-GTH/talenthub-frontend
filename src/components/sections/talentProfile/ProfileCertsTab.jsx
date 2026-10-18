import { useEffect } from 'react';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import Button from '../../ui/Button.jsx';
import { ProfileCertTrophyIcon, ProfileHourglassGlyph } from '../../shared/assets.jsx';
import {
  CERTS_IN_PROGRESS,
  CERTS_LIST,
  CERTS_SUGGESTED,
  CERTS_VERIFICATION,
} from './talentProfileTabsData.js';
import {
  EditButton,
  GlyphTile,
  HeadLink,
  Meter,
  ProfileCard,
  ProfileChip,
  TabLayout,
} from './ProfileTabsUi.jsx';
import { CARD_PLAIN, PAD, SHELF, TITLE, TITLE_SM } from './profileTabsStyles.js';

const log = debug('ProfileCertsTab');

const CertItem = ({ item }) => (
  <li
    className={classNames(
      CARD_PLAIN,
      'flex min-w-0 items-start gap-[18px] rounded-[16px] p-[clamp(14px,1.04vw,18px)]'
    )}
  >
    <span
      aria-hidden="true"
      className={classNames(
        'flex size-[64px] shrink-0 items-center justify-center rounded-[16px]',
        SHELF
      )}
      style={{ background: item.sealBg }}
    >
      <ProfileCertTrophyIcon className="size-[32px]" />
    </span>
    <div className="flex min-w-0 flex-1 flex-col items-start gap-[5px]">
      <div className="flex flex-wrap items-center gap-x-[8px] gap-y-[4px]">
        <h3 className="text-[17px] leading-[normal] font-semibold text-[#1c2a21]">{item.title}</h3>
        <ProfileChip tone={item.chip.tone} icon="check">
          {item.chip.label}
        </ProfileChip>
      </div>
      <p className="text-[14px] leading-[normal] font-medium text-[#595959]">{item.issuer}</p>
      <p className="text-[13px] leading-[normal] whitespace-pre-wrap text-[#737373]">{item.meta}</p>
      <div className="flex flex-wrap gap-[6px] pt-[6px]">
        {item.tags.map((t) => (
          <ProfileChip key={t}>{t}</ProfileChip>
        ))}
      </div>
    </div>
    <div className="flex shrink-0 flex-col items-end gap-[8px]">
      <EditButton label={`Edit ${item.title}`} onClick={() => log('edit cert', item.key)} />
      <HeadLink onClick={() => log('view credential', item.key)}>{item.action}</HeadLink>
    </div>
  </li>
);

const InProgress = () => {
  const c = CERTS_IN_PROGRESS;
  return (
    <section
      aria-label={c.title}
      className={classNames(CARD_PLAIN, 'flex min-w-0 flex-col gap-[16px] overflow-hidden', PAD)}
    >
      <header className="flex items-center gap-[10px]">
        <h2 className={classNames(TITLE, 'min-w-0 truncate')}>{c.title}</h2>
        <span aria-hidden="true" className="h-px min-w-px flex-1" />
        <p className="text-[12px] leading-[normal] font-medium whitespace-nowrap text-[#737373]">
          {c.hint}
        </p>
      </header>
      <div className="flex flex-wrap items-center gap-x-[18px] gap-y-[14px] rounded-[16px] bg-[#f8f8f4] p-[clamp(14px,1.04vw,18px)]">
        <span
          aria-hidden="true"
          className="flex size-[64px] shrink-0 items-center justify-center rounded-[16px] border-[1.5px] border-dashed border-[#bfbfbf] bg-white"
        >
          <ProfileHourglassGlyph className="size-[29px]" />
        </span>
        <div className="flex min-w-[200px] flex-1 flex-col items-start gap-[6px]">
          <h3 className="text-[17px] leading-[normal] font-semibold text-[#1c2a21]">
            {c.item.title}
          </h3>
          <p className="text-[14px] leading-[normal] font-medium text-[#595959]">{c.item.issuer}</p>
          <Meter pct={c.item.pct} height={8} fill="#c8951a" className="w-full max-w-[420px]" />
          <p className="text-[12px] leading-[normal] text-[#737373]">{c.item.progress}</p>
        </div>
        <Button variant="tertiary" size="sm" onClick={() => log('continue study (no backend)')}>
          {c.item.cta}
        </Button>
      </div>
    </section>
  );
};

const VerificationCard = () => (
  <section
    aria-label={CERTS_VERIFICATION.title}
    className={classNames('flex min-w-0 flex-col gap-[12px] rounded-[20px] bg-white', SHELF, PAD)}
  >
    <h2 className={TITLE_SM}>{CERTS_VERIFICATION.title}</h2>
    <ul className="flex flex-col gap-[12px]">
      {CERTS_VERIFICATION.rows.map((r) => (
        <li key={r.chip.label} className="flex items-center gap-[10px]">
          <ProfileChip tone={r.chip.tone} icon={r.chip.icon ? 'check' : undefined}>
            {r.chip.label}
          </ProfileChip>
          <span className="min-w-0 flex-1 text-[13px] leading-[1.4] text-[#595959]">{r.text}</span>
        </li>
      ))}
    </ul>
  </section>
);

const SuggestedCard = () => (
  <section
    aria-label={CERTS_SUGGESTED.title}
    className={classNames(CARD_PLAIN, 'flex min-w-0 flex-col gap-[16px] overflow-hidden', PAD)}
  >
    <header className="flex items-center gap-[10px]">
      <h2 className={TITLE}>{CERTS_SUGGESTED.title}</h2>
    </header>
    <ul className="flex flex-col gap-[16px]">
      {CERTS_SUGGESTED.rows.map((r) => (
        <li key={r.key} className="flex items-center gap-[12px]">
          <GlyphTile name={r.icon} size={40} glyph={19} />
          <div className="flex min-w-0 flex-1 flex-col gap-[2px]">
            <span className="text-[14px] leading-[normal] font-semibold text-[#1c2a21]">
              {r.title}
            </span>
            <span className="text-[12px] leading-[normal] text-[#737373]">{r.sub}</span>
          </div>
        </li>
      ))}
    </ul>
  </section>
);

/*
 * ProfileCertsTab — P-05 (Figma Focused 8110:370237 / Playful 7572:1128). Certifications and the
 * private "In progress" card on the left; verification legend + suggestions on the right.
 */
const ProfileCertsTab = ({ profile }) => {
  useEffect(() => {
    log('mount', { tab: profile?.tab });
  }, [profile?.tab]);

  return (
    <TabLayout
      tab="certs"
      left={
        <>
          <ProfileCard
            title={CERTS_LIST.title}
            link={CERTS_LIST.add}
            onLink={() => log('add certification (no frame)')}
          >
            {CERTS_LIST.items.length ? null : (
              <p className="text-[14px] leading-[1.5] text-[#737373]">
                No certificates yet. NVTI, school awards, first aid and online courses all count.
              </p>
            )}
            <ul className="flex flex-col gap-[16px]">
              {CERTS_LIST.items.map((item) => (
                <CertItem key={item.key} item={item} />
              ))}
            </ul>
          </ProfileCard>
          {CERTS_IN_PROGRESS ? <InProgress /> : null}
        </>
      }
      right={
        <>
          <VerificationCard />
          {CERTS_SUGGESTED ? <SuggestedCard /> : null}
        </>
      }
    />
  );
};

export default ProfileCertsTab;
