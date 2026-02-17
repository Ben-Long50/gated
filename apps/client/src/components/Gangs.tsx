import BtnRect from './buttons/BtnRect';
import { Link, useParams } from 'react-router-dom';
import useCampaignQuery from 'src/hooks/useCampaignQuery/useCampaignQuery';
import useGangQueries from 'src/hooks/gang hooks/useGangQueries/useGangQueries';
import GangCard from './GangCard';
import { Gang } from 'src/types/gang';
import Loading from './Loading';

const Gangs = () => {
  const { campaignId } = useParams();

  const { data: campaign } = useCampaignQuery(Number(campaignId));

  console.log(campaign);

  const { gangs, isLoading } = useGangQueries(
    campaign?.gangs.map((gang: Gang) => gang.id),
  );

  console.log(gangs);

  if (isLoading) {
    return <Loading />;
  }

  if (gangs.length === 0) {
    return (
      <div className="flex w-full max-w-5xl flex-col items-center gap-8">
        <h1>Gangs</h1>
        <h3>No gangs found</h3>
        <Link to="/glam/campaigns/create">
          <BtnRect ariaLabel="navigate to create campaign" type="button">
            Create Campaign
          </BtnRect>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-6xl flex-col items-center gap-6 sm:gap-8">
      <h1>Gangs</h1>
      <div className="flex w-full flex-col gap-8">
        {gangs?.map((gang: Gang) => (
          <GangCard key={gang.id} gang={gang} />
        ))}
      </div>
    </div>
  );
};

export default Gangs;
