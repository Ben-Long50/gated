import { useMemo, useState } from 'react';
import { Item, ItemType } from 'src/types/item';
import { camelCase } from 'change-case';
import useItemTypeQueries from './useItemQueries/useItemTypeQueries';

const useBaseItems = ({
  categories,
  itemList,
  includedKeywords,
  excludedKeywords,
  subcategory,
}: {
  categories: ItemType[];
  itemList?: Item[];
  includedKeywords?: string[];
  excludedKeywords?: string[];
  subcategory?: string;
}) => {
  const { items, isLoading } = useItemTypeQueries(categories);

  const list = itemList || items;

  const categorizeItems = (itemList: Item[]) => {
    let list = itemList;

    if (subcategory) {
      list = list?.filter((item) => item.itemSubtypes?.includes(subcategory));
    }

    if (excludedKeywords) {
      list = list?.filter((item: Item) =>
        item.keywords?.every(
          (keyword) => !excludedKeywords?.includes(keyword.keyword?.name),
        ),
      );
    }

    if (includedKeywords) {
      list = list?.filter((item: Item) =>
        item.keywords?.some((keyword) =>
          includedKeywords?.includes(keyword.keyword?.name),
        ),
      );
    }

    return list;
  };

  const categorizedItems = useMemo(
    () => categorizeItems(list || []),
    [list, includedKeywords, excludedKeywords, subcategory],
  );

  const filteredKeywords = useMemo(() => {
    if (!categorizedItems) return null;

    const kw = [
      ...new Set(
        categorizedItems.flatMap((item: Item) => {
          return item.keywords?.map((keyword) => keyword.keyword?.name);
        }),
      ),
    ] as string[];

    return kw.sort((a, b) => a.localeCompare(b));
  }, [categorizedItems]);

  const [query, setQuery] = useState('');
  const [trait, setTrait] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [rarity, setRarity] = useState('');

  const filterItems = (items: Item[]) => {
    if (!items) return;
    let filteredItems = items;
    if (trait) {
      filteredItems = items.filter((item: Item) =>
        item.keywords.some(
          (keyword) => camelCase(trait) === camelCase(keyword.keyword.name),
        ),
      );
    }
    if (query) {
      filteredItems = filteredItems.filter((item: Item) =>
        item.name.toLowerCase().includes(query.toLowerCase()),
      );
    }
    if (priceFilter === 'lowToHigh') {
      filteredItems = filteredItems.sort((a, b) => {
        if (a.price === null) {
          return -1;
        } else if (b.price === null) {
          return 1;
        } else {
          return a.price - b.price;
        }
      });
    }
    if (priceFilter === 'highToLow') {
      filteredItems = filteredItems.sort((a, b) => {
        if (b.price === null) {
          return -1;
        } else if (a.price === null) {
          return 1;
        } else {
          return b.price - a.price;
        }
      });
    }
    if (!priceFilter) {
      filteredItems = filteredItems.sort((a, b) =>
        a.name.localeCompare(b.name),
      );
    }
    if (rarity) {
      filteredItems = filteredItems.filter((item) => item.rarity === rarity);
    }
    return filteredItems;
  };

  const filteredItems = filterItems(categorizedItems);

  return {
    items: filteredItems,
    keywords: filteredKeywords,
    query,
    trait,
    priceFilter,
    rarity,
    setQuery,
    setTrait,
    setPriceFilter,
    setRarity,
    isLoading,
  };
};

export default useBaseItems;
