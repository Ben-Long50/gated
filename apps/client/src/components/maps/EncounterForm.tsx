import useMaps from 'src/hooks/useMaps';
import CloudinaryImage from '../CloudinaryImage';
import ThemeContainer from '../ThemeContainer';
import { useContext } from 'react';
import { ThemeContext } from 'src/contexts/ThemeContext';
import ArrowHeader2 from '../ArrowHeader2';
import useCreateCombatMutation from 'src/hooks/combat hooks/useCreateCombatMutation/useCreateCombatMutation';
import { useParams } from 'react-router-dom';
import { useForm } from '@tanstack/react-form';
import BtnRect from '../buttons/BtnRect';

const EncounterForm = () => {
  const { accentPrimary } = useContext(ThemeContext);
  const { campaignId } = useParams();
  const { locations } = useMaps();

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

  return (
    <div className="flex max-w-6xl flex-col items-center gap-8">
      <h1>Create Encounter</h1>
      <ThemeContainer borderColor={accentPrimary} chamfer="medium">
        <div className="flex flex-col gap-4 p-4 sm:gap-8 sm:p-8">
          <ArrowHeader2 title="Select an Encounter Location" />
          <encounterForm.Field name="mapId">
            {(field) => (
              <div className="grid grid-cols-3 gap-4">
                {locations.map((location) => (
                  <button
                    key={location.id}
                    className={`${field.state.value === location.id ? 'border-accent' : 'border-transparent border-opacity-50 hover:border-gray-400'} bg-secondary timing flex flex-col gap-4 rounded-md border-2 p-4 shadow-md shadow-black`}
                    onClick={() => {
                      if (field.state.value === location.id) {
                        field.handleChange(null);
                      } else {
                        field.handleChange(location.id);
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
          <BtnRect
            className="sticky bottom-4 sm:bottom-8"
            ariaLabel="Next step"
            type="button"
          >
            Next
          </BtnRect>
        </div>
      </ThemeContainer>
    </div>
  );
};

export default EncounterForm;
