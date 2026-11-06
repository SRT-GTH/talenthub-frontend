import { boldRuns, richBlocks } from './previewModel.js';

/*
 * FaqRichText — the formatted answer of an FAQ item (Figma 7.8.3f "rich text": 15/22 #1c2a21, **bold** at 700, a bullet list with "•" 15/600 and gap 4 / 8).
 * ⚠️ ASSUMPTION: the editor stores the answer as light markdown (see previewHistoryData.js); only bold and bullets are drawn, so only those are rendered.
 */
const Runs = ({ text }) =>
  boldRuns(text).map((r, i) =>
    r.bold ? (
      <strong key={i} className="font-bold">
        {r.text}
      </strong>
    ) : (
      <span key={i}>{r.text}</span>
    )
  );

const FaqRichText = ({ text }) => (
  <div className="flex flex-col gap-[8px] font-sans text-[15px] leading-[22px] text-[#1c2a21]">
    {richBlocks(text).map((b, i) =>
      b.type === 'list' ? (
        <ul key={i} className="m-0 flex list-none flex-col gap-[4px] p-0 pr-[6px] pl-[6px]">
          {b.items.map((item, j) => (
            <li key={j} className="flex gap-[8px]">
              <span aria-hidden="true" className="w-[7px] shrink-0 leading-[22px] font-semibold">
                •
              </span>
              <span className="min-w-0">
                <Runs text={item} />
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p key={i} className="m-0">
          <Runs text={b.text} />
        </p>
      )
    )}
  </div>
);

export default FaqRichText;
