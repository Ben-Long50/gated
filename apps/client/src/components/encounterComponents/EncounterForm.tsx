import useMaps from 'src/hooks/useMaps';
import useCreateCombatMutation from 'src/hooks/encounter hooks/useCreateCombatMutation/useCreateCombatMutation';
import { Outlet, useLocation, useParams } from 'react-router-dom';
import { useForm } from '@tanstack/react-form';
import Loading from '../Loading';

const EncounterForm = () => {
  const { campaignId } = useParams();
  const { maps, isLoading } = useMaps(false, 'map');
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

  if (!maps) {
    return <h1>This Campaign has no Maps available for an Encounter</h1>;
  }

  return (
    <div className="flex max-h-full w-full flex-col items-center gap-8">
      <h1>Create Encounter</h1>
      <Outlet context={{ maps, form: encounterForm, createEncounter, parts }} />
    </div>
  );
};

export default EncounterForm;
