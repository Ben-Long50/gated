import useCampaignQuery from 'src/hooks/useCampaignQuery/useCampaignQuery';
import MapList from './MapList';
import { useNavigate, useParams } from 'react-router-dom';
import Page from 'src/components/Page';

const CampaignMapsPage = () => {
  const { campaignId } = useParams();
  const navigate = useNavigate();

  const { data: campaign } = useCampaignQuery(Number(campaignId));

  const mapIds = campaign?.maps.map((map) => map.id);

  return (
    <Page title="Campaign Maps">
      <MapList mapIds={mapIds} onClick={(id) => navigate(`${id}`)} />
    </Page>
  );
};

export default CampaignMapsPage;
