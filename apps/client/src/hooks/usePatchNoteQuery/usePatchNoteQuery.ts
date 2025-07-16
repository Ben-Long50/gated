import { useQuery } from '@tanstack/react-query';
import getPatchNote from './getPatchNote';

const usePatchNoteQuery = (patchNoteId: string) => {
  return useQuery({
    queryKey: ['patchNote', patchNoteId],
    queryFn: async () => await getPatchNote(patchNoteId),
  });
};

export default usePatchNoteQuery;
