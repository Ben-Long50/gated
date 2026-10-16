import { useContext } from 'react';
import ThemeContainer from './ThemeContainer';
import { ThemeContext } from '../contexts/ThemeContext';
import BtnRect from './buttons/BtnRect';
import { Link } from 'react-router-dom';
import { Campaign } from '@gated/shared';
import LocationIcon from './icons/LocationIcon';
import AccountPicture from './AccountPicture';
import { User } from '@gated/shared';
import ArrowHeader2 from './ArrowHeader2';
import ArrowHeader3 from './ArrowHeader3';
import { AuthContext } from 'src/contexts/AuthContext';
import { userLimits } from '@gated/shared';
import CloudinaryPicture from './CloudinaryPicture';
import Divider from './Divider';

const CampaignCard = ({ campaign }: { campaign: Campaign }) => {
  const { user } = useContext(AuthContext);
  const { accentPrimary } = useContext(ThemeContext);

  const limits = userLimits[user.role];

  return (
    <ThemeContainer
      className="w-full"
      chamfer="large"
      borderColor={accentPrimary}
      overflowHidden={true}
    >
      <div className="relative grid w-full cursor-pointer select-none grid-cols-[1fr_1fr_4fr]">
        <div className="-z-10 col-span-2 col-start-1 row-start-1">
          <CloudinaryPicture
            publicId={campaign?.generatedPicture?.publicId}
            style={{
              maskImage: 'linear-gradient(to right, black 0%, transparent 90%',
            }}
          />
        </div>
        <div className="col-span-2 col-start-2 row-start-1 flex h-full w-full flex-col justify-between gap-4 p-8 md:gap-6">
          <div className="flex w-full flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-4">
              <ArrowHeader2 className="text-left" title={campaign.name} />
              {campaign.pendingPlayers.length > 0 && (
                <p className="text-tertiary">(Pending)</p>
              )}
            </div>
            <div className="flex items-center gap-4">
              <LocationIcon className="text-accent size-6 shrink-0 sm:size-8" />
              <h3 className="!text-accent text-right">{campaign.location}</h3>
            </div>
          </div>
          <div className="grid grid-cols-[1fr_1fr] gap-8">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 flex items-center justify-start gap-4">
                <ArrowHeader3 title="Players" />
                <p>{`(${campaign.players.length} / ${limits.campaignPlayers})`}</p>
              </div>
              <Divider className="col-span-2" />
              {campaign.players.map((player: User) => (
                <div key={player.id} className="flex items-center gap-4">
                  <AccountPicture user={player} />
                  <p className="font-semibold">{player.username}</p>
                </div>
              ))}
              {campaign.pendingPlayers.map((player: User) => (
                <div key={player.id} className="flex items-center gap-4">
                  <AccountPicture className="opacity-50" user={player} />
                  <p className="font-semibold opacity-50">{player.username}</p>
                </div>
              ))}
            </div>
            <div className="flex w-full flex-col items-end justify-between gap-8">
              <div className="flex w-full flex-col items-end gap-4">
                <ArrowHeader3 title="Game Master" />
                <Divider />
                <div className="flex items-center gap-4">
                  <AccountPicture user={campaign.owner} />
                  <p className="font-semibold">{campaign.owner.username}</p>
                </div>
              </div>
            </div>
          </div>
          <Link className="mt-auto w-full" to={`${campaign.id}/dashboard`}>
            <BtnRect ariaLabel="navigate to campaign information ml-auto mt-auto self-end">
              Campaign Info
            </BtnRect>
          </Link>
        </div>
      </div>
    </ThemeContainer>
  );
};

export default CampaignCard;
