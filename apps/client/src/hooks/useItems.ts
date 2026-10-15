import { useState } from 'react';
import { Item, ItemType } from 'src/types/item';

const useItems = (itemList: Item[]) => {
  const items = itemList;

  const [query, setQuery] = useState<string>('');
  const [types, setTypes] = useState<ItemType[]>([]);
  const [priceFilter, setPriceFilter] = useState<
    'highToLow' | 'lowToHigh' | null
  >(null);
  const [rarity, setRarity] = useState<string | null>(null);

  const filterItems = () => {
    let filteredItems = items
      .filter((item) =>
        item.itemTypes.some(
          (type: ItemType) => types.length === 0 || types.includes(type),
        ),
      )
      .sort((a, b) => a.name.localeCompare(b.name));

    if (query) {
      filteredItems = filteredItems.filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase()),
      );
    }

    if (rarity) {
      filteredItems = filteredItems.filter(
        (item) => item.rarity.toLowerCase() === rarity.toLowerCase(),
      );
    }

    if (priceFilter) {
      switch (priceFilter) {
        case 'lowToHigh':
          filteredItems = filteredItems.sort((a, b) => {
            if (a.price === null) {
              return -1;
            } else if (b.price === null) {
              return 1;
            } else {
              return a.price - b.price;
            }
          });
          break;
        case 'highToLow':
          filteredItems = filteredItems.sort((a, b) => {
            if (b.price === null) {
              return -1;
            } else if (a.price === null) {
              return 1;
            } else {
              return b.price - a.price;
            }
          });
          break;
      }
    }

    return filteredItems;
  };

  const filterByQuery = (newQuery: string) => {
    setQuery(newQuery);
  };

  const filterByTypes = (types: ItemType[]) => {
    setTypes(types);
  };

  const filterByPrice = (direction: 'highToLow' | 'lowToHigh' | null) => {
    setPriceFilter(direction);
  };

  const filterByRarity = (rarity: string | null) => {
    setRarity(rarity);
  };

  const resetList = () => {
    setQuery('');
    setTypes([]);
    setPriceFilter(null);
    setRarity(null);
  };

  return {
    items: filterItems(),
    query,
    types,
    filterByQuery,
    filterByTypes,
    filterByPrice,
    filterByRarity,
    resetList,
  };
};

export default useItems;
