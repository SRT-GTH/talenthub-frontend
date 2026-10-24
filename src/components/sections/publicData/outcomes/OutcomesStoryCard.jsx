import { Link } from 'react-router-dom';
import { DATA_BASE } from '../publicDataNav.js';

/*
 * OutcomesStoryCard — Figma "story · From Tamale to a data internship" 8496:261 (437x358): white, 1px #e7e7e7, r24, shadow; photo 200 high (cover);
 * text p20 gap8: kicker "Northern · Data & analytics" 12/14 600 caps +0.72 #387440 · title 18/21 600 · summary 14/20 #595959 · "Read story →" 14/17 600 #387440.
 * The whole card is a link to /data/outcomes/stories/:id. Props: story, loading (8.5.1d draws the photo as a grey #f2f2ee block)
 */

const OutcomesStoryCard = ({ story, loading = false }) => (
  <Link
    to={`${DATA_BASE}/outcomes/stories/${story.id}`}
    className="group flex min-w-0 flex-col overflow-hidden rounded-[24px] border border-solid border-[#e7e7e7] bg-white text-inherit no-underline shadow-[0_5px_17px_rgba(0,0,0,0.04)] hover:border-[#387440] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
  >
    {loading ? (
      <span className="block h-[200px] w-full bg-[#f2f2ee]" aria-hidden="true" />
    ) : (
      <img
        src={story.photo}
        alt=""
        width="435"
        height="200"
        loading="lazy"
        className="h-[200px] w-full object-cover"
      />
    )}
    <span className="flex flex-col gap-[8px] p-[20px]">
      <span className="text-[12px] leading-[14px] font-semibold tracking-[0.72px] text-[#387440] uppercase">
        {story.kicker}
      </span>
      <span className="text-[18px] leading-[21px] font-semibold text-[#1c2a21]">{story.title}</span>
      <span className="text-[14px] leading-[20px] text-[#595959]">{story.summary}</span>
      <span className="pt-[4px] text-[14px] leading-[17px] font-semibold text-[#387440]">
        Read story →
      </span>
    </span>
  </Link>
);

export default OutcomesStoryCard;
