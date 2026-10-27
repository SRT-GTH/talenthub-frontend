import { debug } from '../../../../utils/debug.js';
import ParentButton from '../ParentButton.jsx';
import abena from '../../../../assets/parent/abena.webp';
import iconStar from '../../../../assets/parent/2-0-star.svg';
import iconBook from '../../../../assets/parent/2-0-book.svg';
import iconHeart from '../../../../assets/parent/2-0-heart.svg';
import iconEye from '../../../../assets/parent/2-0-eye.svg';
import iconEdit from '../../../../assets/parent/2-0-edit.svg';
import iconShield from '../../../../assets/parent/2-0-shield.svg';

const log = debug('ParentFirstVisit');

/*
 * ParentFirstVisit — PD-01b "Parent home · First visit" (Figma 10034:1556): "Welcome, Emma" + the green "New" sticker, "Abena is set up and learning. Here's how you can support her.",
 * the ward card (52 avatar, Abena Mensah 20/600, "16 · SHS 2 · Achimota School", the Active chip, three stats 72% / 2 of 4 / 180, "THIS WEEK" with three wins, View Abena + Evaluate)
 * and the "Three things you can do" card (Review profile · Start evaluation · How it works).
 * Props: none. ⚠️ ASSUMPTION: every button only logs (the profile review, evaluation and how-it-works screens are other canvases).
 */
const STATS = [
  { value: '72%', label: 'Profile' },
  { value: '2 of 4', label: 'Assessments' },
  { value: '180', label: 'Cycles' },
];
const WINS = [
  { icon: iconStar, text: 'Earned the Python Coding badge in Skills Lab' },
  { icon: iconBook, text: 'Finished Module 3 of SQL for Data Analysis' },
  { icon: iconHeart, text: 'Volunteered at Accra Library coding club' },
];
const STEPS = [
  {
    icon: iconEye,
    title: 'Look over Abena’s profile',
    body: 'Spot something wrong? Flag it and she fixes it. You can’t edit it yourself.',
    action: 'Review profile',
  },
  {
    icon: iconEdit,
    title: 'Tell us what you see in her',
    body: 'A 10-minute evaluation adds a parent’s view to her profile.',
    action: 'Start evaluation',
  },
  {
    icon: iconShield,
    title: 'Know your controls',
    body: 'You can opt Abena out at any time. Her data is kept.',
    action: 'How it works',
  },
];

const CARD =
  'rounded-[24px] border border-solid border-[#e7e7e7] bg-white p-[22px] drop-shadow-[0_5px_8.5px_rgba(28,42,33,0.03)]';
const H20 =
  'm-0 font-sans text-[20px] leading-[1.25] font-semibold tracking-[-0.1px] text-[#1c2a21]';

const ParentFirstVisit = () => (
  <div className="mx-auto flex w-full max-w-[1329px] flex-col gap-[24px]">
    <div className="flex flex-col gap-[3px]">
      <div className="flex flex-wrap items-center gap-[12px]">
        <h1 className="m-0 font-sans text-[34px] leading-[1.2] font-semibold tracking-[-0.68px] text-[#1c2a21] max-sm:text-[28px]">
          Welcome, Emma
        </h1>
        <span className="flex items-center gap-[4px] rounded-[999px] bg-[#ebf1ec] px-[11px] py-[5px] font-sans text-[13px] leading-[normal] font-bold whitespace-nowrap text-[#1f4a2b]">
          New
        </span>
      </div>
      <p className="m-0 font-sans text-[16px] leading-[24px] tracking-[0.2px] text-[#999]">
        Abena is set up and learning. Here’s how you can support her.
      </p>
    </div>

    <div className="flex flex-col gap-[20px]">
      <section aria-label="Abena Mensah" className={`${CARD} flex flex-col gap-[20px]`}>
        <div className="flex flex-wrap items-center gap-[12px]">
          <img
            src={abena}
            alt=""
            draggable="false"
            className="size-[52px] shrink-0 rounded-[999px] object-cover"
          />
          <div className="flex min-w-0 flex-1 flex-col gap-[3px] whitespace-nowrap">
            <h2 className={H20}>Abena Mensah</h2>
            <p className="m-0 font-sans text-[13px] leading-[normal] text-[#575755]">
              16 · SHS 2 · Achimota School
            </p>
          </div>
          <span className="flex h-[32px] items-center gap-[6px] rounded-[999px] border border-solid border-[#c1d4c4] bg-[#ebf1ec] px-[14px] font-sans text-[13px] leading-[normal] font-semibold whitespace-nowrap text-[#387440]">
            Active
          </span>
        </div>
        <div className="flex gap-[10px] whitespace-nowrap max-sm:flex-wrap">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="flex min-w-0 flex-1 flex-col gap-[2px] rounded-[14px] bg-[#f8f8f4] px-[12px] py-[16px] max-sm:basis-full"
            >
              <p className={H20}>{s.value}</p>
              <p className="m-0 font-sans text-[12px] leading-[normal] text-[#575755]">{s.label}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-[16px]">
          <p className="m-0 font-sans text-[12px] leading-[normal] font-semibold tracking-[0.72px] whitespace-nowrap text-[#575755] uppercase">
            This week
          </p>
          <ul className="m-0 flex list-none flex-col gap-[14px] p-0">
            {WINS.map((w) => (
              <li key={w.text} className="flex items-center gap-[8px]">
                <img src={w.icon} alt="" className="size-[16px] shrink-0" />
                <span className="font-sans text-[14px] leading-[normal] text-[#1c2a21]">
                  {w.text}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-wrap items-start gap-[10px]">
          <ParentButton variant="secondary" onClick={() => log('view Abena (no screen drawn)')}>
            View Abena
          </ParentButton>
          <ParentButton variant="secondary" onClick={() => log('evaluate (no screen drawn)')}>
            Evaluate
          </ParentButton>
        </div>
      </section>

      <section aria-label="Get started" className={`${CARD} flex flex-col gap-[14px]`}>
        <h2 className={`${H20} whitespace-nowrap`}>Three things you can do</h2>
        {STEPS.map((st) => (
          <div
            key={st.title}
            className="flex items-center gap-[14px] rounded-[16px] bg-[#f8f8f4] p-[14px] max-md:flex-wrap"
          >
            <img src={st.icon} alt="" className="size-[22px] shrink-0" />
            <div className="flex min-w-0 flex-1 flex-col gap-[2px] leading-[normal] max-md:basis-[calc(100%-40px)]">
              <p className="m-0 font-sans text-[15px] font-semibold text-[#1c2a21]">{st.title}</p>
              <p className="m-0 max-w-[560px] font-sans text-[13px] text-[#575755]">{st.body}</p>
            </div>
            <ParentButton variant="secondary" onClick={() => log(st.action, '(no screen drawn)')}>
              {st.action}
            </ParentButton>
          </div>
        ))}
      </section>
    </div>
  </div>
);

export default ParentFirstVisit;
