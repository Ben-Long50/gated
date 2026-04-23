const constructFormData = (data: object) => {
  const filteredData = filterFormData(data);

  const formData = new FormData();

  Object.entries(filteredData).forEach(([key, value]) => {
    if (value instanceof File) {
      formData.append(key, value);
    } else {
      formData.append(key, JSON.stringify(value));
    }
  });

  return formData;
};

export default constructFormData;

export const filterFormData = (data: object) => {
  const filteredData = Object.fromEntries(
    Object.entries(data).filter(([, value]) => value != null),
  );

  return filteredData;
};
