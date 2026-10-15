import useCreateCombatMutation from 'src/hooks/encounter hooks/useCreateCombatMutation/useCreateCombatMutation';
import { useParams } from 'react-router-dom';
import { useForm } from '@tanstack/react-form';
import Loading from '../Loading';
import useCampaignQuery from 'src/hooks/useCampaignQuery/useCampaignQuery';
import FormLayout from 'src/layouts/FormLayout';
import MapList from '../mapComponents/map/MapList';
import ArrowHeader2 from '../ArrowHeader2';
import Page from '../Page';

const EncounterForm = () => {
  const { campaignId } = useParams();
  const { data: campaign, isLoading } = useCampaignQuery(Number(campaignId));

  const mapIds = campaign?.maps.map((map) => map.id);

  const createEncounter = useCreateCombatMutation(Number(campaignId));

  const encounterForm = useForm({
    defaultValues: {
      name: '',
      mapId: null as number | null,
      turnOrder: [] as number[],
      turnPosition: 0,
    },
    onSubmit: ({ value }) => {
      if (typeof value.mapId === 'number') {
        createEncounter.mutate(value);
      }
    },
  });

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Page title="Create Encounter">
      <FormLayout label="Encounter" form={encounterForm}>
        <ArrowHeader2 title="Select Encounter Map" />
        <MapList mapIds={mapIds} />
      </FormLayout>
    </Page>
  );
};

export default EncounterForm;
