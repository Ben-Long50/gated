import { Character } from 'src/types/character';
import useGangQuery from './gang hooks/useGangQuery/useGangQuery';
import calculateReputation from 'src/utils/calculateReputation';
import calculateLevelNodes from 'src/utils/calculateLevelNodes';
import useCharacters from './useCharacters';
import useAffiliationQueries from './useAffiliationQueries/useAffiliationQueries';
import { Affiliation } from 'src/types/faction';

const useGang = (gangId: number) => {
  const { data: gang, isLoading } = useGangQuery(Number(gangId));

  const { data: affiliations, isLoading: affiliationsLoading } =
    useAffiliationQueries(
      gang?.affiliations.map((affiliation: Affiliation) => affiliation.id) ||
        [],
    );

  const gangCharacters =
    gang?.leaders.length > 0 || gang?.characters.length > 0
      ? [...gang?.leaders, ...gang?.characters]
      : [];

  const { characters } = useCharacters(
    gangCharacters.map((character) => character.id),
  );

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

  const { reputation, reputationPoints } = gang
    ? calculateReputation(gang)
    : { reputation: 0, reputationPoints: 0 };

  const { level, levelNodes } = gang
    ? calculateLevelNodes(gang)
    : { level: 0, levelNodes: 0 };

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

  const levelData = {
    level,
    levelNodes,
  } as { level: number; levelNodes: number; requiredNodes: number };

  switch (level) {
    case 1:
      levelData.requiredNodes = 10;
      break;
    case 2:
      levelData.requiredNodes = 10;
      break;
    case 3:
      levelData.requiredNodes = 10;
      break;
    case 4:
      levelData.requiredNodes = 15;
      break;
    case 5:
      levelData.requiredNodes = 15;
      break;
    case 6:
      levelData.requiredNodes = 15;
      break;
    case 7:
      levelData.requiredNodes = 20;
      break;
    case 8:
      levelData.requiredNodes = 20;
      break;
    case 9:
      levelData.requiredNodes = 20;
      break;
    case 10:
      levelData.requiredNodes = 25;
      break;
    case 11:
      levelData.requiredNodes = 25;
      break;
    default:
      levelData.requiredNodes = 0;
      break;
  }

  const gangPoints = [0, 2, 5, 8, 10].reduce(
    (sum, points, index) => (reputation > index ? sum + points : sum),
    0,
  );

  const gangLoading = isLoading || affiliationsLoading;

  return {
    gang,
    characters,
    gangPoints,
    usedGangPoints,
    reputationData,
    levelData,
    leaderCount,
    memberCount,
    goonCount,
    affiliations,
    gangLoading,
  };
};

export default useGang;
