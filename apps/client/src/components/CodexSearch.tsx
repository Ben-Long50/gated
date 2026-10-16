import { useForm } from '@tanstack/react-form';
import { useContext, useEffect, useRef, useState } from 'react';
import InputField from './formFields/InputField';
import { Keyword } from '@gated/shared';
import Loading from './Loading';
import useKeywords from '../hooks/useKeywords';
import KeywordCard from './KeywordCard';
import PerkCard from './PerkCard';
import usePerks from '../hooks/usePerks';
import useActions from '../hooks/useActions';
import useConditions from '../hooks/useConditions';
import ActionCard from './ActionCard';
import ConditionCard from './ConditionCard';
import ArrowHeader2 from './ArrowHeader2';
import InputSelectField from './formFields/InputSelectField';
import Icon from '@mdi/react';
import { mdiCropSquare, mdiGrid, mdiSync } from '@mdi/js';
import { LayoutContext } from '../contexts/LayoutContext';
import ItemCard from './ItemCard';
import { Item } from '@gated/shared';
import { Action } from '@gated/shared';
import { Condition } from '@gated/shared';
import { camelCase } from 'change-case';
import useItemTypeQueries from 'src/hooks/useItemQueries/useItemTypeQueries';
import { itemTypes } from '@gated/shared';
import Page from './Page';

const CodexSearch = () => {
  const { mobile } = useContext(LayoutContext);

  const [nameQuery, setNameQuery] = useState('');
  const [descriptionQuery, setDescriptionQuery] = useState('');
  const [category, setCategory] = useState('');
  const [cardType, setCardType] = useState<'small' | 'large'>(() =>
    mobile ? 'small' : 'large',
  );

  const nameTimerRef = useRef<number | null>(null);
  const descriptionTimerRef = useRef<number | null>(null);

  const { items, isLoading, isPending } = useItemTypeQueries(itemTypes);

  const { filteredKeywords: keywords } = useKeywords();

  const { filteredPerkTree: perks } = usePerks();

  const { filteredActions: actions } = useActions();

  const { filteredConditions: conditions } = useConditions();

  const perkArray = Object.values(perks)
    .map((item) => Object.values(item).flat())
    .flat();

  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [filteredActions, setFilteredActions] = useState<Action[]>([]);
  const [filteredPerks, setFilteredPerks] = useState<Keyword[]>([]);
  const [filteredKeywords, setFilteredKeywords] = useState<Keyword[]>([]);
  const [filteredConditions, setFilteredConditions] = useState<Condition[]>([]);
  const [filtering, setFiltering] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const filter = (
      itemArray: Item[] | Keyword[] | Action[] | Condition[] | undefined,
    ) => {
      const nameFilter = nameQuery?.toLowerCase() ?? null;
      const descFilter = descriptionQuery?.toLowerCase() ?? null;
      const hasCategoryFilter = category !== '';

      const filteredItems = itemArray
        ? itemArray.filter((item) => {
            if (!item) return false;
            const nameMatch = item.name?.toLowerCase().includes(nameFilter);
            const descMatch = item.description
              ?.toLowerCase()
              .includes(descFilter);

            const categoryMatch = item.keywords
              ? !hasCategoryFilter ||
                item.keywords?.some(
                  (keyword: { keyword: Keyword }) =>
                    category === camelCase(keyword.keyword?.name),
                )
              : true;

            return nameMatch && descMatch && categoryMatch;
          })
        : [];

      return filteredItems;
    };

    const filtered = {
      items: filter(items),
      actions: category ? [] : filter(actions),
      perks: category ? [] : filter(perkArray),
      keywords: category ? [] : filter(keywords),
      conditions: category ? [] : filter(conditions),
    };

    if (!cancelled) {
      setFilteredItems(filtered.items);
      setFilteredActions(filtered.actions);
      setFilteredPerks(filtered.perks);
      setFilteredKeywords(filtered.keywords);
      setFilteredConditions(filtered.conditions);
      setFiltering(false);
    }

    return () => {
      cancelled = true;
    };
  }, [category, nameQuery, descriptionQuery]);

  const keywordList = keywords?.map((keyword) => keyword.name);

  const filterByNameQuery = (query: string) => {
    setFiltering(true);

    if (nameTimerRef.current) {
      clearTimeout(nameTimerRef.current);
    }

    nameTimerRef.current = setTimeout(() => {
      setNameQuery(query || (!descriptionQuery && !category ? null : query));

      if ((query && !descriptionQuery) || (category && !descriptionQuery)) {
        setDescriptionQuery('');
      } else if (!descriptionQuery) {
        setDescriptionQuery(null);
      }
    }, 1000);
  };

  const filterByDescriptionQuery = (query: string) => {
    setFiltering(true);

    if (descriptionTimerRef.current) {
      clearTimeout(descriptionTimerRef.current);
    }

    descriptionTimerRef.current = setTimeout(() => {
      if (!nameQuery && !query && !category) {
        setDescriptionQuery('');
      } else {
        setDescriptionQuery(query);
      }
      if ((query && !nameQuery) || (category && !nameQuery)) {
        setNameQuery('');
      } else if (!nameQuery) {
        setNameQuery('');
      }
    }, 1000);
  };

  return (
    <Page title="Search Codex">
      <div className="flex w-full flex-col gap-4">
        <div className="grid w-full grid-cols-2 gap-4 sm:gap-8">
          <ArrowHeader2 title="Filter Options" />
          <InputSelectField
            label="Trait"
            options={keywordList}
            value={category}
            onChange={(value) => {
              setCategory(value);
            }}
          />
        </div>
        <InputField
          label="Search by Name"
          value={nameQuery}
          onChange={(value) => {
            filterByNameQuery(value);
          }}
        />
        <div className="flex items-end gap-4">
          <InputField
            label="Search by Description"
            value={descriptionQuery}
            onChange={(value) => {
              filterByDescriptionQuery(value);
            }}
          />
          {!mobile && (
            <>
              <button
                className="text-accent bg-tertiary shadow-color group z-10 grid size-12 shrink-0 place-items-center rounded-md p-0.5 shadow-md hover:underline"
                onClick={(e) => {
                  e.preventDefault();
                  setCardType('large');
                }}
              >
                <Icon
                  path={mdiCropSquare}
                  className={`${cardType === 'large' && 'text-accent'} text-secondary group-hover:text-accent timing`}
                />
              </button>
              <button
                className="text-accent bg-tertiary shadow-color group z-10 grid size-12 shrink-0 place-items-center rounded-md p-2 shadow-md hover:underline"
                onClick={(e) => {
                  e.preventDefault();
                  setCardType('small');
                }}
              >
                <Icon
                  path={mdiGrid}
                  className={`${cardType === 'small' && 'text-accent'} text-secondary group-hover:text-accent timing`}
                />
              </button>
            </>
          )}
          <button
            className="text-accent bg-tertiary shadow-color group z-10 grid size-12 shrink-0 place-items-center rounded-md p-1.5 shadow-md hover:underline"
            onClick={(e) => {
              e.preventDefault();
              setCategory('');
              setNameQuery('');
              setDescriptionQuery('');
            }}
          >
            <Icon
              path={mdiSync}
              className="text-secondary group-hover:text-accent timing"
            />
          </button>
        </div>
      </div>
      {isLoading || isPending || filtering ? (
        <Loading />
      ) : [
          ...filteredItems,
          ...filteredKeywords,
          ...filteredPerks,
          ...filteredActions,
          ...filteredConditions,
        ].length === 0 ? (
        <h2>No Codex Items Found</h2>
      ) : (
        <>
          {filteredItems.length > 0 && (
            <>
              <ArrowHeader2 className="self-start" title="Items" />
              <div
                className={`${cardType === 'small' ? 'grid w-full grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-8' : 'flex w-full flex-col gap-8'}`}
              >
                {filteredItems.map((item) => (
                  <ItemCard key={item.id} item={item} mode="search" />
                ))}
              </div>
            </>
          )}
          {filteredKeywords.length > 0 && (
            <div className="flex w-full flex-col gap-4">
              <h2 className="pl-4">Keywords</h2>
              <div className="flex flex-col gap-4 md:grid md:grid-cols-2">
                {filteredKeywords.map((keyword, index) => {
                  return (
                    <KeywordCard
                      key={'triat' + index}
                      keyword={keyword}
                      mode="codex"
                    />
                  );
                })}
              </div>
            </div>
          )}
          {filteredPerks.length > 0 && (
            <div className="flex w-full flex-col gap-4">
              <h2 className="pl-4">Perks</h2>
              <div className="flex flex-col gap-4 md:grid md:grid-cols-2">
                {filteredPerks.map((perk, index) => {
                  return (
                    <PerkCard key={'perk' + index} perk={perk} mode="codex" />
                  );
                })}
              </div>
            </div>
          )}
          {filteredActions.length > 0 && (
            <div className="flex w-full flex-col gap-4">
              <h2 className="pl-4">Actions</h2>
              <div className="flex flex-col gap-4 md:grid md:grid-cols-2">
                {filteredActions.map((action, index) => {
                  return (
                    <ActionCard
                      key={'action' + index}
                      action={action}
                      mode="codex"
                    />
                  );
                })}
              </div>
            </div>
          )}
          {filteredConditions.length > 0 && (
            <div className="flex w-full flex-col gap-4">
              <h2 className="pl-4">Conditions</h2>
              <div className="flex flex-col gap-4 md:grid md:grid-cols-2">
                {filteredConditions.map((condition, index) => {
                  return (
                    <ConditionCard
                      key={'condition' + index}
                      condition={condition}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </Page>
  );
};

export default CodexSearch;
