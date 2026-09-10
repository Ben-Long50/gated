import { useQuery } from '@tanstack/react-query';
import { Character } from 'src/types/character';
import getTemplateCharacters from './getCharacters';

const useTemplateCharactersQuery = () => {
  return useQuery<Character[]>({
    queryKey: ['templateCharacters'],
    queryFn: () => getTemplateCharacters(),
  });
};

export default useTemplateCharactersQuery;
