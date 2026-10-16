import { useQuery } from '@tanstack/react-query';
import getPatchNote from './getPatchNote';
import { PatchNote } from '@gated/shared';

const usePatchNoteQuery = (patchNoteId: number) => {
  return useQuery<PatchNote>({
    queryKey: ['patchNote', patchNoteId],
    queryFn: async () => await getPatchNote(patchNoteId),
  });
};

export default usePatchNoteQuery;
