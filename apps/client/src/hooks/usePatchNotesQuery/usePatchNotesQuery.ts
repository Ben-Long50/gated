import { useQuery } from '@tanstack/react-query';
import getPatchNotes from './getPatchNotes';

const usePatchNotesQuery = () => {
  return useQuery({
    queryKey: ['patchNotes'],
    queryFn: async () => await getPatchNotes(),
  });
};

export default usePatchNotesQuery;
