const combineObjects = (a, b) => {
    var _a;
    const result = Object.assign({}, a);
    for (const [key, value] of Object.entries(b)) {
        const combinedValue = ((_a = result[key]) !== null && _a !== void 0 ? _a : 0) + value;
        result[key] = combinedValue > 0 ? combinedValue : 0;
    }
    return result;
};
export default combineObjects;
