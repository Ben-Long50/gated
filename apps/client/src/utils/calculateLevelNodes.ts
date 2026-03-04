import { Gang } from 'src/types/gang';

const calculateLevelNodes = (gang: Gang) => {
  let level = 0;
  let levelNodes = 0;

  const levelNodeBonuses = gang.gangSessionBonuses.flatMap(
    (bonus) => bonus.levelNodeBonus,
  );

  const totalPoints = levelNodeBonuses
    .filter((bonus) => bonus)
    .flatMap((bonus) => bonus.value)
    .reduce((sum, bonus) => sum + bonus, 0);

  if (totalPoints < 10) {
    level = 1;
    levelNodes = totalPoints;
  } else if (totalPoints < 20) {
    level = 2;
    levelNodes = totalPoints - 10;
  } else if (totalPoints < 30) {
    level = 3;
    levelNodes = totalPoints - 20;
  } else if (totalPoints < 45) {
    level = 4;
    levelNodes = totalPoints - 30;
  } else if (totalPoints < 60) {
    level = 5;
    levelNodes = totalPoints - 45;
  } else if (totalPoints < 75) {
    level = 6;
    levelNodes = totalPoints - 60;
  } else if (totalPoints < 95) {
    level = 7;
    levelNodes = totalPoints - 75;
  } else if (totalPoints < 115) {
    level = 8;
    levelNodes = totalPoints - 95;
  } else if (totalPoints < 135) {
    level = 9;
    levelNodes = totalPoints - 115;
  } else if (totalPoints < 160) {
    level = 10;
    levelNodes = totalPoints - 135;
  } else if (totalPoints < 185) {
    level = 11;
    levelNodes = totalPoints - 160;
  } else {
    level = 12;
    levelNodes = 0;
  }

  return {
    level,
    levelNodes,
  };
};

export default calculateLevelNodes;
