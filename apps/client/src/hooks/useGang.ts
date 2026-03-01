import { Character } from 'src/types/character';
import useGangQuery from './gang hooks/useGangQuery/useGangQuery';
import calculateReputation from 'src/utils/calculateReputation';

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

  let requiredNodes = 0;

  const { reputation, reputationPoints } = gang
    ? calculateReputation(gang)
    : { reputation: 0, reputationPoints: 0 };

  const reputationData = {
    reputation,
    reputationPoints,
  } as {
    reputation: number;
    reputationPoints: number;
    requiredPoints: number;
    description: string;
  };

  switch (reputation) {
    case 1:
      reputationData.requiredPoints = 10;
      reputationData.description = 'New Kids on the Block';
      break;
    case 2:
      reputationData.requiredPoints = 20;
      reputationData.description = 'Up and Comers';
      break;
    case 3:
      reputationData.requiredPoints = 30;
      reputationData.description = 'Original Gangsters';
      break;
    case 4:
      reputationData.requiredPoints = 50;
      reputationData.description = 'Made Men';
      break;
    case 5:
      reputationData.requiredPoints = 0;
      reputationData.description = 'Living Legends';
      break;
    default:
      break;
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
    reputationData,
    requiredNodes,
    leaderCount,
    memberCount,
    goonCount,
    gangLoading: isLoading,
  };
};

export default useGang;
