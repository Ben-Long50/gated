import prisma from '../config/database';

const updateActionStats = async () => {
  const characters = await prisma.character.findMany({});

  for (let character of characters) {
    const stats = {
      ...character.stats,
      currentActions: 3,
      currentReactions: 1,
    };
    console.log(character.stats);

    await prisma.character.update({
      where: { id: character.id },
      data: { stats },
    });
    console.log(`Updated ${character.firstName}`);
  }
};

// updateActionStats();

const updateHandsStats = async () => {
  const characters = await prisma.character.findMany({});

  for (let character of characters) {
    const stats = {
      ...character.stats,
      currentHands: 2,
    };

    await prisma.character.update({
      where: { id: character.id },
      data: { stats },
    });
    console.log(`Updated ${character.firstName}`);
  }
};

// updateHandsStats();

const updateActionCosts = async () => {
  const actions = await prisma.action.findMany({});

  for (let action of actions) {
    const { actionPoints, reactionPoints, health, sanity, power, ...rest } =
      action.costs;

    const newCosts = Object.fromEntries(
      Object.entries({
        ...rest,
        currentActions: actionPoints,
        currentReactions: reactionPoints,
        currentHealth: health,
        currentSanity: sanity,
        currentPower: power,
      })
        .filter(([key, value]) => !!value)
        .map(([key, value]) => [key, value]),
    );

    await prisma.action.update({
      where: { id: action.id },
      data: { costs: newCosts },
    });
    console.log(`Updated ${action.name}`);
  }
};

// updateActionCosts();
