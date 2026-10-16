import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import CampaignCard from './CampaignCard';
import { Campaign } from '@gated/shared';
import BtnRect from './buttons/BtnRect';
import { Link, useSearchParams } from 'react-router-dom';
import { User } from '@gated/shared';
import { capitalCase } from 'change-case';
import { CampaignContext } from 'src/contexts/CampaignContext';
import BtnAuth from './buttons/BtnAuth';
import NavTabs from './NavTabs';
import Divider from './Divider';

const Campaigns = () => {
  const { user } = useContext(AuthContext);
  const { campaigns } = useContext(CampaignContext);
  const [searchParams, setSearchParams] = useSearchParams();

  const campaignType = searchParams.get('campaignType') || 'all';

  let campaignList = [];

  switch (campaignType) {
    case 'owner':
      campaignList =
        campaigns?.filter(
          (campaign: Campaign) => campaign.ownerId === user?.id,
        ) || [];
      break;
    case 'player':
      campaignList =
        campaigns?.filter((campaign: Campaign) =>
          campaign.players?.some((player: User) => player.id === user?.id),
        ) || [];
      break;
    case 'pending':
      campaignList =
        campaigns?.filter((campaign: Campaign) =>
          campaign.pendingPlayers?.some(
            (player: User) => player.id === user?.id,
          ),
        ) || [];
      break;
    default:
      campaignList = campaigns || [];
      break;
  }

  return (
    <>
      <NavTabs>
        <BtnAuth
          active={campaignType === 'all'}
          onClick={() => setSearchParams({ campaignType: 'all' })}
        >
          All
        </BtnAuth>
        <BtnAuth
          active={campaignType === 'owner'}
          onClick={() => setSearchParams({ campaignType: 'owner' })}
        >
          Owner
        </BtnAuth>
        <BtnAuth
          active={campaignType === 'player'}
          onClick={() => setSearchParams({ campaignType: 'player' })}
        >
          Player
        </BtnAuth>
        <BtnAuth
          active={campaignType === 'pending'}
          onClick={() => setSearchParams({ campaignType: 'pending' })}
        >
          Pending
        </BtnAuth>
      </NavTabs>
      <Divider />

      {campaignList.length > 0 ? (
        <div className="flex flex-col gap-8">
          {campaignList?.map((campaign: Campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          <p className="text-center">
            No campaigns found. If you want to be the game master of an upcoming
            campaign, head to the campaign creation page. Otherwise wait for
            another user to invite you to their own campaign.
          </p>
          <Link to="/glam/campaigns/create">
            <BtnRect ariaLabel="navigate to create campaign" type="button">
              Create Campaign
            </BtnRect>
          </Link>
        </div>
      )}
    </>
  );
};

export default Campaigns;
