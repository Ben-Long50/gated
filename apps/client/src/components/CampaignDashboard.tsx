import { useContext } from 'react';
import { AuthContext } from 'src/contexts/AuthContext';
import userLimits from 'src/utils/constants/userLimits';
import ArrowHeader3 from './ArrowHeader3';
import Divider from './Divider';
import Campaigns from './Campaigns';
import Container from './Container';

const CampaignDashboard = () => {
  const { user } = useContext(AuthContext);

  const limits = userLimits[user.role];

  const ownerCampaignCount = user.ownerCampaigns.length;

  const playerCamapignCount = user.playerCampaigns.length;

  const pendingCampaignCount = user.pendingCampaigns.length;

  return (
    <>
      <div className="flex w-full flex-col gap-4">
        <ArrowHeader3 title="Campaign Limits" />
        <div className="flex items-center justify-between gap-4">
          <p>Membership Level</p>
          <p>{limits.roleName}</p>
        </div>
        <Divider />
        <div className="flex items-center justify-between gap-4">
          <p>Owner Campaigns</p>
          <p>
            {ownerCampaignCount} / {limits.ownerCampaigns}
          </p>
        </div>
        <div className="flex items-center justify-between gap-4">
          <p>Campaign Player Limit</p>
          <p>{limits.campaignPlayers}</p>
        </div>
        <Divider />
        <div className="flex items-center justify-between gap-4">
          <p>Player Campaigns</p>
          <p>
            {playerCamapignCount} / {limits.playerCampaigns}
          </p>
        </div>
        <div className="flex items-center justify-between gap-4">
          <p>Pending Campaigns</p>
          <p>{pendingCampaignCount}</p>
        </div>
      </div>
      <Divider />
      <Campaigns />
    </>
  );
};

export default CampaignDashboard;
