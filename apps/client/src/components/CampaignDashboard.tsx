import { useContext } from 'react';
import { AuthContext } from 'src/contexts/AuthContext';
import userLimits from 'src/utils/userLimits';
import ThemeContainer from './ThemeContainer';
import { ThemeContext } from 'src/contexts/ThemeContext';
import ArrowHeader3 from './ArrowHeader3';
import Divider from './Divider';
import Campaigns from './Campaigns';

const CampaignDashboard = () => {
  const { user } = useContext(AuthContext);
  const { accentPrimary } = useContext(ThemeContext);

  const limits = userLimits[user.role];

  const ownerCampaignCount = user.ownerCampaigns.length;

  const playerCamapignCount = user.playerCampaigns.length;

  const pendingCampaignCount = user.pendingCampaigns.length;

  return (
    <div className="flex w-full max-w-8xl flex-col items-center gap-8">
      <h1>Camaigns</h1>
      <ThemeContainer
        className="w-full"
        borderColor={accentPrimary}
        chamfer="medium"
      >
        <div className="padding flex w-full flex-col gap-4">
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
      </ThemeContainer>
      <Divider />
      <Campaigns />
    </div>
  );
};

export default CampaignDashboard;
