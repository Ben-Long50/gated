import useMaps from 'src/hooks/useMaps';
import CloudinaryImage from '../CloudinaryImage';
import ThemeContainer from '../ThemeContainer';
import { useContext, useEffect, useState } from 'react';
import { ThemeContext } from 'src/contexts/ThemeContext';
import ArrowHeader2 from '../ArrowHeader2';
import useCreateCombatMutation from 'src/hooks/combat hooks/useCreateCombatMutation/useCreateCombatMutation';
import { useParams } from 'react-router-dom';
import { useForm, useStore } from '@tanstack/react-form';
import BtnRect from '../buttons/BtnRect';
import Map from './Map';
import InputSelectField from '../InputSelectField';
import ArrowHeader3 from '../ArrowHeader3';
import useCampaignCharactersQuery from 'src/hooks/useCampaignCharactersQuery/useCampaignCharactersQuery';
import useCampaignQuery from 'src/hooks/useCampaignQuery/useCampaignQuery';
import useMap from 'src/hooks/useMap';
import Loading from '../Loading';
import useUpdateCharacterLocationMutation from 'src/hooks/useUpdateCharacterLocationMutation/useUpdateCharacterLocationMutation';

const EncounterForm = () => {
  const { accentPrimary } = useContext(ThemeContext);
  const { campaignId } = useParams();
  const { locations: maps } = useMaps();
  const [formStage, setFormStage] = useState('map');

  const { data: campaign } = useCampaignQuery(Number(campaignId));

  const { nonPlayerCharacters } = useCampaignCharactersQuery(
    campaign.characters.map((character) => character.id),
  );

  const createCombat = useCreateCombatMutation(Number(campaignId));

  const encounterForm = useForm({
    defaultValues: {
      mapId: null as number | null,
      turnOrder: [] as number[],
      turnPosition: 0,
    },
    onSubmit: ({ value }) => {
      createCombat.mutate(value);
    },
  });

  const mapId = useStore(encounterForm.store, (store) => store.values.mapId);

  const { map, locations, isLoading } = useMap(mapId);

  const updateLocation = useUpdateCharacterLocationMutation(mapId);

  const locationForm = useForm({
    defaultValues: {
      character: null,
      locationId: null as number | null,
      index: null as number | null,
    },
    onSubmit: ({ value }) => {
      const data = {
        characterId: value.character?.id,
        locationId: value.character?.location?.id,
        index: value.index,
      };
      if (data.characterId && data.index) {
        updateLocation.mutate(data);
      }
      locationForm.reset();
    },
  });

  useEffect(() => {
    encounterForm.setFieldValue('locations', locations);
  }, [locations]);

  if (isLoading) return <Loading />;

  return (
    <div className="flex max-h-full max-w-6xl flex-col items-center gap-8">
      <h1>Create Encounter</h1>
      <ThemeContainer borderColor={accentPrimary} chamfer="medium">
        <div className="flex flex-col gap-4 p-4 sm:gap-8 sm:p-8">
          {formStage === 'map' && (
            <>
              <div className="flex items-center justify-between gap-8">
                <ArrowHeader2 title="Select Encounter Location" />
                <encounterForm.Subscribe
                  selector={(state) => state.values.mapId}
                >
                  {(mapId) =>
                    mapId && (
                      <BtnRect
                        className="min-w-48"
                        ariaLabel="Back to maps"
                        type="button"
                        onClick={() => setFormStage('characters')}
                      >
                        Place Characters
                      </BtnRect>
                    )
                  }
                </encounterForm.Subscribe>
              </div>
              <encounterForm.Field name="mapId">
                {(field) => (
                  <div className="grid grid-cols-3 gap-4">
                    {maps.map((location) => (
                      <button
                        key={location.id}
                        className={`${field.state.value === location.id ? 'border-accent' : 'border-transparent border-opacity-50 hover:border-gray-400'} bg-secondary timing flex flex-col gap-4 rounded-md border-2 p-4 shadow-md shadow-black`}
                        onClick={() => {
                          if (field.state.value === location.id) {
                            field.handleChange(null);
                          } else {
                            field.handleChange(location.id);
                            setFormStage('characters');
                          }
                        }}
                      >
                        <h3>{location.name}</h3>
                        <div className="flex h-80 w-full items-center justify-center">
                          <CloudinaryImage
                            className="border-accent overflow-hidden rounded border"
                            publicId={location.picture.publicId}
                          />
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </encounterForm.Field>
            </>
          )}
          {formStage === 'characters' && (
            <encounterForm.Subscribe selector={(state) => state.values.mapId}>
              {(mapId) =>
                mapId && (
                  <>
                    <div className="flex items-center justify-between gap-8">
                      <ArrowHeader2 title="Place Characters" />
                      <BtnRect
                        className="min-w-48"
                        ariaLabel="Back to maps"
                        type="button"
                        onClick={() => setFormStage('map')}
                      >
                        Maps
                      </BtnRect>
                    </div>
                    <Map mapId={mapId} form={locationForm} />
                  </>
                )
              }
            </encounterForm.Subscribe>
          )}
          <encounterForm.Subscribe selector={(state) => state.values.turnOrder}>
            {(turnOrder) =>
              turnOrder.length > 0 && (
                <BtnRect ariaLabel="Create encounter" type="button">
                  Create Encounter
                </BtnRect>
              )
            }
          </encounterForm.Subscribe>
        </div>
      </ThemeContainer>
      {formStage === 'characters' && (
        <ThemeContainer
          className="sticky bottom-4 w-full"
          chamfer="medium"
          borderColor={accentPrimary}
        >
          <div className="flex w-full flex-col gap-4 p-4">
            <ArrowHeader3 title="Place NPCs" />
            <locationForm.Field name="character">
              {(field) => (
                <InputSelectField
                  field={field}
                  label="Campaign NPCs"
                  options={nonPlayerCharacters}
                  reverse={true}
                />
              )}
            </locationForm.Field>
          </div>
        </ThemeContainer>
      )}
    </div>
  );
};

export default EncounterForm;
