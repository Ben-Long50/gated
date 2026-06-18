import { AttributeTree } from 'src/types/attributeTree';
import calculateLevelBonus from 'src/utils/calculateLevelBonus';
import usePerkQueries from './usePerkQueries/usePerkQueries';

const useLevelBonus = (
  level: number,
  attributes: AttributeTree,
  perkIds: number[],
) => {
  if (!level || !attributes) {
    return {};
  }

  const { perks, isLoading } = usePerkQueries(perkIds);

  if (isLoading) {
    return;
  }

  return calculateLevelBonus(level, attributes, perks);
};

export default useLevelBonus;
