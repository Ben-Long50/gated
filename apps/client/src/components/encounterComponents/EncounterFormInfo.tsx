import { useNavigate, useOutletContext } from 'react-router-dom';
import ArrowHeader2 from '../ArrowHeader2';
import CloudinaryImage from '../CloudinaryImage';
import { Map } from 'src/types/map';
import ArrowHeader3 from '../ArrowHeader3';

const EncounterFormInfo = () => {
  const { maps, form } = useOutletContext();

  const navigate = useNavigate();

  return (
    <div className="flex w-full flex-col gap-4 p-4 sm:gap-8 sm:p-8">
      <ArrowHeader2 title="Select Encounter Map" />
      <form.Field name="mapId">
        {(field) => (
          <div className="grid w-full grid-cols-[repeat(auto-fit,minmax(360px,1fr))] gap-4">
            {maps.map((map: Map) => {
              const activeEncounter =
                map?.encounters.some(
                  (encounter) => encounter.combatPhase !== 'completed',
                ) || false;

              return (
                <button
                  key={map.id}
                  className={`${activeEncounter && 'pointer-events-none opacity-50 grayscale'} hover:border-accent bg-secondary timing flex flex-col gap-4 rounded-md border-2 border-transparent p-4 shadow-md shadow-black`}
                  onClick={() => {
                    navigate(`maps/${map.id}`);
                    field.handleChange(map.id);
                  }}
                >
                  <ArrowHeader3 title={map.name} />
                  <div className="flex h-80 w-full items-center justify-center">
                    <CloudinaryImage
                      className="border-accent overflow-hidden rounded border"
                      publicId={map.picture.publicId}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </form.Field>
    </div>
  );
};

export default EncounterFormInfo;
