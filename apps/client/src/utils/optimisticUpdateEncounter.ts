import queryClient from 'src/queryClient';
import { Encounter } from 'src/types/encounter';

const optimisticUpdateEncounter = (encounterId: number, options: object) => {
  const prevEncounter = queryClient.getQueryData([
    'encounter',
    Number(encounterId),
  ]) as Encounter;

  queryClient.setQueryData(['encounter', encounterId], {
    ...prevEncounter,
    ...options,
  });
};

export default optimisticUpdateEncounter;
