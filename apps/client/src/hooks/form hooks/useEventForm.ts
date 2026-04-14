import { useForm } from '@tanstack/react-form';
import { UseMutationResult } from '@tanstack/react-query';
import { Event } from 'src/types/campaign';
import { useParams } from 'react-router-dom';

const useEventForm = (
  mutation: UseMutationResult<any, Error, object>,
  event?: Event,
) => {
  const { month, day } = useParams();

  const eventForm = useForm({
    defaultValues: {
      id: null,
      characterId: null,
      name: '',
      description: '',
      month: month,
      day: Number(day),
      time: { hour: 0, minute: 0, second: 0 },
    },
    onSubmit: ({ value }) => {
      mutation.mutate(value);
    },
  });

  return eventForm;
};

export default useEventForm;
