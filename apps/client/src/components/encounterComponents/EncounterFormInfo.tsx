import { useNavigate, useOutletContext } from 'react-router-dom';
import MapList from '../mapComponents/map/MapList';

const EncounterFormInfo = () => {
  const { mapIds, form } = useOutletContext();

  const navigate = useNavigate();

  return (
    <>
      <h1>Select Encounter Map</h1>
      <form.Field name="mapId">
        {(field) => (
          <MapList
            mapIds={mapIds}
            onClick={(id, characterIds) => {
              field.handleChange(id);
              form.setFieldValue('turnOrder', characterIds);
              navigate(-1);
            }}
          />
        )}
      </form.Field>
    </>
  );
};

export default EncounterFormInfo;
