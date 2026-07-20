import { debug } from '../../../utils/debug.js';
import Logo from '../../shared/Logo.jsx';
import { SwitchModesIcon, NotificationIcon } from '../../shared/assets.jsx';

const log = debug('SkillsLabNav');

export default function SkillsLabNav({ userName = 'Kofi A.' }) {
  log('rendering nav, user:', userName);
  const initials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <nav
      className="flex items-center justify-between px-[clamp(24px,4.4vw,64px)] py-[clamp(8px,0.8vw,12px)] bg-[#f8f8f4] border-b border-[#e7e7e7]"
      style={{ boxShadow: '0px 1px 1px rgba(27,36,44,0.12)' }}
    >
      <Logo size="md" />
      <div className="flex items-center gap-[clamp(12px,1.7vw,24px)]">
        <button
          className="flex items-center gap-[8px] px-[clamp(16px,1.9vw,28px)] py-[10px] rounded-[10px] text-[14px] font-sans font-bold tracking-[0.1px] leading-[24px] cursor-pointer"
          style={{
            background: '#c8951a',
            border: '1px solid #967014',
            borderBottomWidth: '2px',
            borderLeftWidth: '2px',
            borderRightWidth: '2px',
            boxShadow: '0px 4px 0px #967014',
            backgroundClip: 'padding-box',
          }}
        >
          <SwitchModesIcon />
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage: 'linear-gradient(190deg, #FEF1E7 0%, #E8F2ED 20.19%)',
            }}
          >
            Switch Modes{' '}
          </span>
        </button>

        <span
          className="font-sans font-medium text-[14px] tracking-[0.2px] leading-[24px] underline decoration-solid cursor-pointer bg-clip-text text-transparent"
          style={{
            backgroundImage: 'linear-gradient(161deg, #142916 0%, #2a5730 100%)',
          }}
        >
          Save &amp; Exit
        </span>

        <div className="size-[36px] rounded-[18px] bg-[#f8fafc] border border-[#e2e8f0] flex items-center justify-center cursor-pointer">
          <NotificationIcon />
        </div>

        <div className="flex items-center gap-[7px] px-[16px] py-[8px] rounded-[10px] bg-[#fffefc] border border-[#c1d4c4]">
          <div
            className="size-[24px] rounded-[12px] flex items-center justify-center"
            style={{
              backgroundImage: 'linear-gradient(135deg, #142916 0%, #2a5730 100%)',
            }}
          >
            <span
              className="text-white text-[10px] font-bold"
              style={{ fontFamily: 'Instrument Sans, sans-serif' }}
            >
              {initials}
            </span>
          </div>
          <span className="font-sans font-medium text-[14px] text-[#111] tracking-[0.2px] leading-[24px]">
            {userName}
          </span>
        </div>
      </div>
    </nav>
  );
}
