import Button from '../../../ui/Button.jsx';
import { CREATE_COPY } from './createCommunityData.js';
import { Callout, FooterBar, IconRow } from './CreateDialogParts.jsx';
import { CcCheckCircleIcon, CcInfoIcon, CcWarningIcon } from './CreateCommunityIcons.jsx';

/*
 * CC-12 · "Almost ready to start a community" (eligibility). Props: eligibility ({ phoneVerified, joinedOn, profilePercent,
 * minPercent }), onFinishProfile(), onNotNow().
 * Rows: phone verified · 7 days on GTH · profile ≥ 60% (the open one carries "Finish profile"); the "Under 18?" callout is always shown.
 */
const CreateNotReady = ({ eligibility, onFinishProfile, onNotNow }) => {
  const copy = CREATE_COPY.notReady;
  const profileOk = eligibility.profilePercent >= eligibility.minPercent;
  return (
    <>
      <div className="flex flex-col gap-[4px]">
        <p className="m-0 font-sans text-[14px] font-normal leading-[20px] text-[#737373]">
          {copy.intro}
        </p>
        <IconRow
          icon={CcCheckCircleIcon}
          title="Phone number verified"
          body={eligibility.phoneVerified ? 'Done' : 'Not yet'}
        />
        <IconRow
          icon={CcCheckCircleIcon}
          title="On GTH for at least 7 days"
          body={`Done · joined ${eligibility.joinedOn}`}
        />
        <IconRow
          icon={profileOk ? CcCheckCircleIcon : CcWarningIcon}
          tone={profileOk ? 'green' : 'amber'}
          title={`Profile at least ${eligibility.minPercent}% complete`}
          body={
            profileOk
              ? 'Done'
              : `Yours is ${eligibility.profilePercent}%. Add your education and one skill.`
          }
          trailing={
            profileOk ? null : (
              <Button variant="tertiary" size="lg" onClick={onFinishProfile}>
                {copy.finishProfile}
              </Button>
            )
          }
        />
      </div>
      <Callout title={copy.underTitle}>{copy.underBody}</Callout>
      <FooterBar note={copy.note} noteIcon={CcInfoIcon}>
        <Button variant="tertiary" size="lg" onClick={onNotNow}>
          {copy.notNow}
        </Button>
        <Button variant="primary" size="sm" onClick={onFinishProfile}>
          {copy.finishMine}
        </Button>
      </FooterBar>
    </>
  );
};

export default CreateNotReady;
