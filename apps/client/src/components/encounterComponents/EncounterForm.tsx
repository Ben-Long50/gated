import useCreateCombatMutation from 'src/hooks/encounter hooks/useCreateCombatMutation/useCreateCombatMutation';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from '@tanstack/react-form';
import Loading from '../Loading';
import useCampaignQuery from 'src/hooks/useCampaignQuery/useCampaignQuery';
import FormLayout from 'src/layouts/FormLayout';
import Page from '../Page';
import BtnRect from '../buttons/BtnRect';
import Map from '../mapComponents/map/Map';
import ArrowHeader2 from '../ArrowHeader2';
import InputField from '../formFields/InputField';

const EncounterForm = () => {
  const { campaignId } = useParams();
  const { data: campaign, isLoading } = useCampaignQuery(Number(campaignId));
  const navigate = useNavigate();

  const mapIds = campaign?.maps.map((map) => map.id) || [];

  const createEncounter = useCreateCombatMutation(Number(campaignId));

  const encounterForm = useForm({
    defaultValues: {
      name: '',
      mapId: null as number | null,
      turnOrder: [] as number[],
      turnPosition: 0,
    },
    onSubmit: ({ value }) => {
      createEncounter.mutate(value);
    },
  });

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Page title="Create Encounter" context={{ mapIds, form: encounterForm }}>
      <FormLayout
        label="Encounter"
        form={encounterForm}
        createMutation={createEncounter}
      >
        <ArrowHeader2 title="Encounter Info" />
        <encounterForm.Field name="name">
          {(field) => (
            <InputField
              label="Encounter Name"
              value={field.state.value}
              onChange={(value) => field.handleChange(value)}
            />
          )}
        </encounterForm.Field>
        <encounterForm.Field name="mapId">
          {(field) => {
            return field.state.value ? (
              <>
                <ArrowHeader2 title="Place and Arrange Characters" />
                <Map
                  mapId={field.state.value}
                  sidebar={true}
                  gridDisplay={false}
                  mapScale={1}
                />
              </>
            ) : (
              <BtnRect
                ariaLabel="Select encounter map"
                onClick={() => navigate('modal/selectMap')}
              >
                Select Encoutner Map
              </BtnRect>
            );
          }}
        </encounterForm.Field>
      </FormLayout>
    </Page>
  );
};

export default EncounterForm;
