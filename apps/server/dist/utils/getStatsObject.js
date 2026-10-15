const getStatsObject = (item) => {
    if (!item.stats) {
        throw new Error('Armor not found');
    }
    const statsObject = Object.fromEntries(Object.entries(item.stats).map(([stat, value]) => {
        const modifiedValue = item.modifiedStats?.[stat] ?? 0;
        return [stat, value + modifiedValue];
    }));
    return statsObject;
};
export default getStatsObject;
