import { useQuery } from '@tanstack/react-query';
import getCodexCharacters from './getCodexCharacters';
import { Character } from 'src/types/character';

const useCodexCharactersQuery = () => {
  return useQuery<Character[]>({
    queryKey: ['codexCharacters'],
    queryFn: () => getCodexCharacters(),
  });
};

export default useCodexCharactersQuery;
