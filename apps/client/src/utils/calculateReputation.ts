import { Gang } from 'src/types/gang';

const calculateReputation = (gang: Gang) => {
  let reputation = 0;
  let reputationPoints = 0;

  const reputationBonuses = gang.gangSessionBonuses.flatMap(
    (bonus) => bonus.reputationBonus,
  );

  const totalPoints = reputationBonuses
    .filter((bonus) => bonus)
    .flatMap((bonus) => bonus.value)
    .reduce((sum, bonus) => sum + bonus, 0);

  if (totalPoints < 10) {
    reputation = 1;
    reputationPoints = totalPoints;
  } else if (totalPoints < 30) {
    reputation = 2;
    reputationPoints = totalPoints - 10;
  } else if (totalPoints < 60) {
    reputation = 3;
    reputationPoints = totalPoints - 30;
  } else if (totalPoints < 110) {
    reputation = 4;
    reputationPoints = totalPoints - 60;
  } else {
    reputation = 5;
    reputationPoints = totalPoints - 110;
  }

  return {
    reputation,
    reputationPoints,
  };
};

export default calculateReputation;
