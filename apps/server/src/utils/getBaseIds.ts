import prisma from '../../config/database';

const getItemUpdatedDates = async () => {
  const items = await prisma.item.findMany({
    where: { userId: { gt: 0 } },
  });
  console.log(items);
};

// getItemUpdatedDates();

const getOwnerItems = async () => {
  const items = await prisma.item.findMany({
    where: { characterInventoryId: { gt: 0 } },
    select: {
      id: true,
      characterInventory: {
        select: { character: { select: { userId: true } } },
      },
    },
  });

  for (let item of items) {
    await prisma.item.update({
      where: { id: item.id },
      data: {
        user: { connect: { id: item.characterInventory.character.userId } },
      },
    });

    console.log(`Successfully updated ${item.id}`);
  }
};

// getOwnerItems();

const deleteNullLocations = async () => {
  await prisma.location.deleteMany({ where: { characterId: null } });
};

// deleteNullLocations();

const updateActionStats = async () => {
  const characters = await prisma.character.findMany({});

  for (let character of characters) {
    const stats = {
      ...character.stats,
      currentActions: 3,
      currentReactions: 1,
    };
    console.log(character.stats);

    // await prisma.character.update({
    //   where: { id: character.id },
    //   data: { stats },
    // });
    // console.log(`Updated ${character.firstName}`);
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

updateActionCosts();

const deleteAllHistory = async () => {
  await prisma.history.deleteMany({});
};

// deleteAllHistory();
