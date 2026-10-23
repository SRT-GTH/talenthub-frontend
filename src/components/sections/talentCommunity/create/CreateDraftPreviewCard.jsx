import { classNames } from '../../../../utils/classNames.js';
import { COMMUNITY_CARD_FACES } from '../communityData.js';
import { CmUsersIcon } from '../CommunityPageIcons.jsx';
import { CommunityTagTargetIcon } from '../communityBrowseIcons.jsx';
import { CREATE_COPY, DEFAULT_COVER, toCardBlurb } from './createCommunityData.js';

/*
 * CreateDraftPreviewCard — Figma `preview · community card` (CC-05, 300x342): the card people will see, as a Draft.
 * Same chrome as the Community card ("Join" state, no button): cover 150 + "Draft" tag, 17/20 title, "1 member · Under review",
 * 13/19 description, three faces + "Just you so far". Props: name, about, cover ({ src } | null → the drawn default cover).
 */
const CreateDraftPreviewCard = ({ name, about, cover }) => {
  const copy = CREATE_COPY.review;
  return (
    <article className="flex w-full min-w-0 flex-col rounded-[20px] border border-solid border-[#e6e6e6] bg-white">
      <div className="relative h-[150px] shrink-0 overflow-hidden rounded-t-[19px] bg-[#ececea]">
        <img
          src={cover?.src ?? DEFAULT_COVER}
          alt=""
          aria-hidden="true"
          className="size-full object-cover"
          draggable={false}
        />
        <span
          className={classNames(
            'absolute left-[11px] top-[12px] inline-flex items-center gap-[5px] rounded-full border border-solid border-[rgba(28,42,33,0.12)] bg-[#ffd86b] py-[5px] pl-[8px] pr-[10px] font-sans text-[11px] font-bold leading-[17px] text-[#1c2a21] max-lg:text-[12px]',
            'playful:border-[1.2px] playful:border-[#1c2a21] playful:shadow-[2px_2px_0_#1c2a21]'
          )}
        >
          <CommunityTagTargetIcon className="size-[13px] shrink-0" />
          {copy.draft}
        </span>
      </div>
      <div className="flex flex-col gap-[8px] p-[16px]">
        <h3 className="m-0 break-words font-sans text-[17px] font-semibold leading-[20px] text-[#1c2a21]">
          {name}
        </h3>
        <p className="m-0 flex flex-wrap items-center gap-x-[6px] font-sans text-[12px] font-medium leading-[14px]">
          <CmUsersIcon className="size-[14px] shrink-0 text-[#595959]" />
          <span className="whitespace-nowrap text-[#595959]">{copy.memberOne}</span>
          <span aria-hidden="true" className="text-[#bfbfbf]">
            ·
          </span>
          <span className="whitespace-nowrap text-[#387440]">{copy.underReview}</span>
        </p>
        <p className="m-0 break-words font-sans text-[13px] font-normal leading-[19px] text-[#595959]">
          {toCardBlurb(about)}
        </p>
        <div className="flex items-center gap-[8px] py-[5px]">
          <span className="flex shrink-0 items-center" aria-hidden="true">
            {COMMUNITY_CARD_FACES.map((src, i) => (
              <img
                key={src}
                src={src}
                alt=""
                className="-ml-[8px] size-[26px] rounded-full border-2 border-solid border-white object-cover first:ml-0"
                style={{ zIndex: 3 - i }}
              />
            ))}
          </span>
          <span className="whitespace-nowrap font-sans text-[11px] font-medium leading-[13px] text-[#737373] max-lg:text-[12px]">
            {copy.justYou}
          </span>
        </div>
      </div>
    </article>
  );
};

export default CreateDraftPreviewCard;
