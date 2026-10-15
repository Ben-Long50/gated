const combineObjects = (a, b) => {
    const result = { ...a };
    for (const [key, value] of Object.entries(b)) {
        const combinedValue = (result[key] ?? 0) + value;
        result[key] = combinedValue > 0 ? combinedValue : 0;
    }
    return result;
};
export default combineObjects;
