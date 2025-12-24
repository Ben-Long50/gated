import { useOutletContext, useParams } from 'react-router-dom';
import Map from '../mapComponents/map/Map';
import BtnRect from '../buttons/BtnRect';
import ThemeContainer from '../ThemeContainer';
import Loading from '../Loading';
import { useContext, useEffect } from 'react';
import { ThemeContext } from 'src/contexts/ThemeContext';
import InputField from '../InputField';
import useMap from 'src/hooks/useMap';

const EncounterFormMap = () => {
  const { accentPrimary } = useContext(ThemeContext);
  const { form, createEncounter } = useOutletContext();
  const { mapId } = useParams();

  const { map, mapLoading, locations } = useMap(Number(mapId));

  useEffect(() => {
    form.setFieldValue(
      'turnOrder',
      locations.map((location) => location.characterId),
    );
  }, [map, locations]);

  if (mapLoading) {
    return <Loading />;
  }

  return (
    <div className="flex h-full flex-col items-center gap-8">
      <ThemeContainer
        className="w-full max-w-5xl"
        chamfer="medium"
        borderColor={accentPrimary}
      >
        <div className="flex w-full flex-col gap-4 p-4">
          <form.Field
            name="name"
            validators={{
              onChange: ({ value }) =>
                value.length < 2
                  ? 'Encounter name must be at least 2 characters long'
                  : undefined,
            }}
          >
            {(field) => <InputField field={field} label="Encounter Name" />}
          </form.Field>
          <BtnRect
            type="button"
            ariaLabel="Create encounter"
            onClick={() => form.handleSubmit()}
          >
            {createEncounter.isPending ? (
              <Loading size={1.15} />
            ) : (
              'Create Encounter'
            )}
          </BtnRect>
        </div>
      </ThemeContainer>
      <Map />
    </div>
  );
};

export default EncounterFormMap;
