export const filterObject = (data) => Object.fromEntries(Object.entries(data)
    .map(([key, value]) => {
    if (value != null) {
        return [key, value];
    }
    else {
        return [];
    }
})
    .filter((item) => item.length > 0));
