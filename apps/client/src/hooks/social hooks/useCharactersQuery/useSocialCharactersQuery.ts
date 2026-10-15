import { useQuery } from '@tanstack/react-query';
import getSocialCharacters from './getSocialCharacters';
import { Character } from 'src/types/character';

const useSocialCharactersQuery = () => {
  return useQuery<Character[]>({
    queryKey: ['socialCharacters'],
    queryFn: () => getSocialCharacters(),
  });
};

export default useSocialCharactersQuery;
