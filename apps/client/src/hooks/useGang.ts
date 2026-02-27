import { Character } from 'src/types/character';
import useGangQuery from './gang hooks/useGangQuery/useGangQuery';

const useGang = (gangId: number) => {
  const { data: gang, isLoading } = useGangQuery(Number(gangId));

  const leaderCount = gang?.leaders.length;

  const memberCount = gang?.characters.filter(
    (character: Character) =>
      !character.npcTypes || !character.npcTypes.includes('goon'),
  ).length;

  const goonCount = gang?.characters.filter(
    (character: Character) =>
      character.npcTypes && character.npcTypes.includes('goon'),
  ).length;

  const usedGangPoints = 0;

  let reputation = { level: 0, description: '' };
  let requiredNodes = 0;

  if (gang?.reputationPoints < 10) {
    reputation = { level: 1, description: 'New Kids on the Block' };
  } else if (gang?.reputationPoints < 20) {
    reputation = { level: 2, description: 'Up and Comers' };
  } else if (gang?.reputationPoints < 30) {
    reputation = { level: 3, description: 'Original Gangsters' };
  } else if (gang?.reputationPoints < 40) {
    reputation = { level: 4, description: 'Made Men' };
  } else if (gang?.reputationPoints < 50) {
    reputation = { level: 5, description: 'Living Legends' };
  } else {
    reputation = { level: 0, description: 'No Reputation' };
  }

  switch (gang?.level) {
    case 1:
      requiredNodes = 10;
      break;
    case 2:
      requiredNodes = 10;
      break;
    case 3:
      requiredNodes = 10;
      break;
    case 4:
      requiredNodes = 15;
      break;
    case 5:
      requiredNodes = 15;
      break;
    case 6:
      requiredNodes = 15;
      break;
    case 7:
      requiredNodes = 20;
      break;
    case 8:
      requiredNodes = 20;
      break;
    case 9:
      requiredNodes = 20;
      break;
    case 10:
      requiredNodes = 25;
      break;
    case 11:
      requiredNodes = 25;
      break;
    default:
      requiredNodes = 0;
      break;
  }

  const gangPoints = [0, 2, 5, 8, 10].reduce(
    (sum, points, index) => (reputation.level > index ? sum + points : sum),
    0,
  );

  return {
    gang,
    gangPoints,
    usedGangPoints,
    reputation,
    requiredNodes,
    leaderCount,
    memberCount,
    goonCount,
    gangLoading: isLoading,
  };
};

export default useGang;
