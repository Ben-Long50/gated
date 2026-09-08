import useCampaignQuery from 'src/hooks/useCampaignQuery/useCampaignQuery';
import MapList from './MapList';
import { useParams } from 'react-router-dom';

const CampaignMapList = () => {
  const { campaignId } = useParams();

  const { data: campaign } = useCampaignQuery(Number(campaignId));

  const mapIds = campaign?.maps.map((map) => map.id);

  return <MapList mapIds={mapIds} />;
};

export default CampaignMapList;
