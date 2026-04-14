import { Perk } from 'src/types/perk';

const constructFormData = (data: object) => {
  const filteredData = Object.fromEntries(
    Object.entries(data).filter(([, value]) => value),
  );

  const formData = new FormData();

  Object.entries(filteredData).forEach(([key, value]) => {
    if (key === 'perks') {
      const perkIds = value.map((perk: Perk) => perk.id) || [];
      formData.append(key, JSON.stringify(perkIds));
    } else if (value instanceof File) {
      formData.append(key, value);
    } else {
      formData.append(key, JSON.stringify(value));
    }
  });

  return formData;
};

export default constructFormData;
