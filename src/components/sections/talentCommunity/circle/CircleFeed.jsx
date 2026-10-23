import { classNames } from '../../../../utils/classNames.js';
import { CIRCLE_COPY as COPY, CIRCLE_PEOPLE, FEED_RESPONSE } from './circleData.js';
import { circleActions } from './circleStore.js';
import CircleFeedPost from './CircleFeedPost.jsx';
import CircleFeedSide from './CircleFeedSide.jsx';
import CircleFeedUpdate from './CircleFeedUpdate.jsx';
import CircleFeedWin from './CircleFeedWin.jsx';
import CircleSidePanel from './CircleSidePanel.jsx';
import { HEADING, STICKER } from './circleStyles.js';

/*
 * CircleFeed — Figma NW-09 "Feed · From your network": the title "From your circle" 28/33 (Playful: Bricolage + the "CHEER THEM ON"
 * sticker, 3°), the grey subtitle, then wins / updates / mentor posts on the left and the Your circle panel + "People to link up
 * with" on the right. Props: store (useCircleStore()), statusFor(id), onLinkUp(person), onFollow(person), onSeeAll(), show(toast),
 * stats ({ inCircle }).
 * ⚠️ ASSUMPTION: "Congratulate" / "Say congrats" / the quick chips send a congratulation → toast (no backend yet).
 */
const CircleFeed = ({ store, statusFor, onLinkUp, onFollow, onSeeAll, show, stats }) => {
  const likedOf = (item) => (item.id in store.likes ? store.likes[item.id] : item.liked === true);
  const likesOf = (item) => item.likes - (item.liked ? 1 : 0) + (likedOf(item) ? 1 : 0);
  const congratulate = (item, text) => {
    const person = CIRCLE_PEOPLE[item.personId];
    circleActions.congratulate(item.id);
    show({ text: text ?? `You congratulated ${person.firstName}` });
  };
  return (
    <>
      <div className="flex flex-col gap-[4px]">
        <div className="flex flex-wrap items-center gap-[10px]">
          <h1
            className={classNames(
              HEADING,
              'text-[28px] leading-[33px] max-lg:text-[26px] playful:text-[34px] playful:leading-[41px]'
            )}
          >
            {FEED_RESPONSE.title}
          </h1>
          <span className={classNames(STICKER, 'rotate-[3deg]')}>{FEED_RESPONSE.sticker}</span>
        </div>
        <p className="m-0 font-sans text-[15px] leading-[18px] text-[#595959] max-lg:text-[14px] max-lg:leading-[20px]">
          {FEED_RESPONSE.subtitle}
        </p>
      </div>
      <div className="grid grid-cols-1 items-start gap-[28px] lg:grid-cols-[minmax(0,1fr)_minmax(280px,420px)]">
        <div className="flex min-w-0 flex-col gap-[28px]">
          {FEED_RESPONSE.items.map((item) => {
            if (item.kind === 'win')
              return (
                <CircleFeedWin
                  key={item.id}
                  item={item}
                  liked={likedOf(item)}
                  likes={likesOf(item)}
                  congratulated={store.congratulated.includes(item.id)}
                  onLike={() => circleActions.toggleLike(item.id, item.liked === true)}
                  onQuick={(text) =>
                    congratulate(item, `Sent to ${CIRCLE_PEOPLE[item.personId].firstName}: ${text}`)
                  }
                  onCongratulate={() => congratulate(item)}
                />
              );
            if (item.kind === 'update')
              return (
                <CircleFeedUpdate
                  key={item.id}
                  item={item}
                  done={store.congratulated.includes(item.id)}
                  onCongrats={() => congratulate(item)}
                />
              );
            return (
              <CircleFeedPost
                key={item.id}
                item={item}
                liked={likedOf(item)}
                likes={likesOf(item)}
                onLike={() => circleActions.toggleLike(item.id, item.liked === true)}
              />
            );
          })}
        </div>
        <div className="flex min-w-0 flex-col gap-[18px]">
          <CircleSidePanel stats={stats} />
          <CircleFeedSide
            block={FEED_RESPONSE.sideSuggestions}
            statusOf={statusFor}
            following={store.following}
            onLinkUp={onLinkUp}
            onFollow={onFollow}
            onSeeAll={onSeeAll}
          />
        </div>
      </div>
    </>
  );
};

export default CircleFeed;
