import { useQuery } from '@tanstack/react-query';
import { Notes } from '@gated/shared';
import getNotes from './getNotes';

const useNotesQuery = (characterId: number) => {
  return useQuery<Notes[]>({
    queryKey: ['notes', characterId],
    queryFn: async () => await getNotes(characterId),
    throwOnError: false,
  });
};

export default useNotesQuery;
