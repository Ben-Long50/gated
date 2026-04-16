import { useForm } from '@tanstack/react-form';
import { UseMutationResult } from '@tanstack/react-query';
import { Event } from 'src/types/campaign';
import { useParams } from 'react-router-dom';
import { filterFormData } from './constructFormData';

const useEventForm = (
  mutation: UseMutationResult<any, Error, object>,
  event?: Event,
) => {
  const { month, day } = useParams();

  const eventForm = useForm({
    defaultValues: {
      id: event?.id || null,
      characterId: event?.characterId || null,
      name: event?.name || '',
      description: event?.description || '',
      month: event?.month || month,
      day: event?.day || Number(day),
      time: event?.time || { hour: 0, minute: 0, second: 0 },
    },
    onSubmit: ({ value }) => {
      const filteredData = filterFormData(value);

      mutation.mutate(filteredData);
    },
  });

  return eventForm;
};

export default useEventForm;
