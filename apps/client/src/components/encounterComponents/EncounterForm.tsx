import useMaps from 'src/hooks/useMaps';
import useCreateCombatMutation from 'src/hooks/encounter hooks/useCreateCombatMutation/useCreateCombatMutation';
import { Outlet, useLocation, useParams } from 'react-router-dom';
import { useForm } from '@tanstack/react-form';
import Loading from '../Loading';
import useCampaignQuery from 'src/hooks/useCampaignQuery/useCampaignQuery';
import FormLayout from 'src/layouts/FormLayout';
import MapList from '../mapComponents/map/MapList';
import ArrowHeader2 from '../ArrowHeader2';

const EncounterForm = () => {
  const { campaignId } = useParams();
  const { data: campaign, isLoading } = useCampaignQuery(Number(campaignId));

  const mapIds = campaign?.maps.map((map) => map.id);

  const location = useLocation();
  const parts = location.pathname.split('/');

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
    <FormLayout label="Encounter" form={encounterForm}>
      <ArrowHeader2 title="Select Encounter Map" />
      <MapList mapIds={mapIds} />
      {/* <Outlet context={{ maps, form: encounterForm, createEncounter, parts }} /> */}
    </FormLayout>
  );
};

export default EncounterForm;
