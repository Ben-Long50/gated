import { useContext, useState } from 'react';
import ThemeContainer from './ThemeContainer';
import { ThemeContext } from '../contexts/ThemeContext';
import InputField from './InputField';
import { FieldApi, useForm } from '@tanstack/react-form';
import Loading from './Loading';
import useBaseItems from '../hooks/useBaseItems';
import { Item } from 'src/types/item';
import ArrowHeader2 from './ArrowHeader2';
import { LayoutContext } from '../contexts/LayoutContext';
import Icon from '@mdi/react';
import { mdiCropSquare, mdiGrid, mdiLinkVariant, mdiSync } from '@mdi/js';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import InputSelectField from './InputSelectField';
import { capitalCase } from 'change-case';
import ItemCard from './ItemCard';
import BtnAuth from './buttons/BtnAuth';

const Items = ({
  itemList,
  field,
  toggleFormLink,
}: {
  itemList?: Item[];
  field?: FieldApi;
  toggleFormLink?: (itemId: number) => void;
}) => {
  const { mobile } = useContext(LayoutContext);
  const { accentPrimary } = useContext(ThemeContext);
  const [searchParams, setSearchParams] = useSearchParams();

  const { categorizedShopItems } = useOutletContext() || {};

  const category = searchParams.get('category') || '';
  const linkCategory = searchParams.get('linkCategory') || '';
  const mode = searchParams.get('mode');
  const include = searchParams.getAll('include');
  const exclude = searchParams.getAll('exclude');

  const [cardType, setCardType] = useState<'small' | 'large'>(() =>
    mobile ? 'small' : 'large',
  );

  const itemCategory = mode && mode === 'form' ? linkCategory : category;

  const {
    filteredItems: items,
    filterByCategory,
    filterByPrice,
    filterByQuery,
    filterByRarity,
    filteredKeywords,
    isLoading,
  } = useBaseItems({
    category: itemCategory,
    itemList: categorizedShopItems || itemList || undefined,
    includedKeywords: include.length > 0 ? include : undefined,
    excludedKeywords: exclude.length > 0 ? exclude : undefined,
  });

  const searchForm = useForm({
    defaultValues: {
      category: '',
      query: '',
      priceFilter: '',
      rarity: '',
    },
    onSubmit: () => {
      filterByCategory('');
      filterByPrice('');
      filterByRarity('');
      filterByQuery('');
    },
  });

  return (
    <div className="flex w-full max-w-6xl flex-col items-center gap-8">
      <h1 className="text-center">{capitalCase(itemCategory)}</h1>
      {mode && mode === 'form' && (
        <div className="flex w-full gap-4">
          <BtnAuth
            active={linkCategory === 'weapon'}
            className="w-full grow"
            onClick={() =>
              setSearchParams({ linkCategory: 'weapon', mode: 'form' })
            }
          >
            Weapons
          </BtnAuth>
          <BtnAuth
            active={linkCategory === 'armor'}
            className="w-full grow"
            onClick={() =>
              setSearchParams({ linkCategory: 'armor', mode: 'form' })
            }
          >
            Armors
          </BtnAuth>
          <BtnAuth
            active={linkCategory === 'vehicle'}
            className="w-full grow"
            onClick={() =>
              setSearchParams({ linkCategory: 'vehicle', mode: 'form' })
            }
          >
            Vehicles
          </BtnAuth>
        </div>
      )}
      <ThemeContainer
        className={`ml-auto w-full`}
        chamfer="medium"
        borderColor={accentPrimary}
      >
        <div className="flex flex-col gap-4 p-4">
          <div className="grid w-full grid-cols-2 items-center justify-between gap-4">
            <ArrowHeader2 title="Filter Options" />
            <searchForm.Field name="category">
              {(field) => (
                <InputSelectField
                  field={field}
                  label="Trait"
                  options={filteredKeywords || []}
                  onChange={() => {
                    filterByCategory(field.state.value);
                  }}
                />
              )}
            </searchForm.Field>
            <searchForm.Field name="priceFilter">
              {(field) => (
                <InputSelectField
                  className="w-full"
                  label={`Filter By Price`}
                  field={field}
                  options={['lowToHigh', 'highToLow']}
                  onChange={() => {
                    filterByPrice(field.state.value);
                  }}
                />
              )}
            </searchForm.Field>
            <searchForm.Field name="rarity">
              {(field) => (
                <InputSelectField
                  className="w-full"
                  label={`Rarity`}
                  field={field}
                  options={[
                    'common',
                    'uncommon',
                    'rare',
                    'blackMarket',
                    'artifact',
                  ]}
                  onChange={() => {
                    filterByRarity(field.state.value);
                  }}
                />
              )}
            </searchForm.Field>
          </div>
          <div className="flex items-center gap-4">
            <searchForm.Field name="query">
              {(field) => (
                <InputField
                  className="w-full"
                  label={
                    itemCategory
                      ? `Search ${capitalCase(itemCategory)}`
                      : 'Search All'
                  }
                  field={field}
                  onChange={() => {
                    filterByQuery(field.state.value);
                  }}
                />
              )}
            </searchForm.Field>
            {!mobile && (
              <>
                <button
                  className="text-accent bg-tertiary shadow-color group grid size-12 shrink-0 place-items-center rounded-md p-0.5 shadow-md hover:underline"
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
                  className="text-accent bg-tertiary shadow-color group grid size-12 shrink-0 place-items-center rounded-md p-2 shadow-md hover:underline"
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
              className="text-accent bg-tertiary shadow-color group grid size-12 shrink-0 place-items-center rounded-md p-1.5 shadow-md hover:underline"
              onClick={(e) => {
                e.preventDefault();
                searchForm.reset();
                searchForm.handleSubmit();
              }}
            >
              <Icon
                path={mdiSync}
                className="text-secondary group-hover:text-accent timing"
              />
            </button>
          </div>
        </div>
      </ThemeContainer>
      <div
        className={`${cardType === 'small' ? 'grid-cols-[repeat(auto-fit,_minmax(350px,_1fr))] gap-4' : 'grid-cols-1 gap-8'} grid w-full`}
      >
        {isLoading ? (
          <Loading />
        ) : (
          items?.map((item: Item) => {
            const linkCount =
              mode === 'form'
                ? field.state.value.reduce((sum: number, id: number) => {
                    if (id === item.id) {
                      return sum + 1;
                    } else {
                      return sum;
                    }
                  }, 0)
                : 0;

            return (
              <div className="flex w-full items-center gap-4">
                <ItemCard
                  className="grow"
                  key={item.id}
                  item={item}
                  cardType={cardType}
                />
                {toggleFormLink && mode === 'form' && (
                  <div className="flex flex-col items-center justify-center gap-2">
                    {linkCount > 0 && <p>{linkCount}</p>}
                    <button
                      className="shadow-color hover:border-accent timing bg-secondary group rounded border-2 border-transparent p-4"
                      onClick={() => toggleFormLink(item.id)}
                    >
                      <Icon
                        className="text-primary timing group-hover:text-accent"
                        path={mdiLinkVariant}
                        size={1.2}
                      />
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Items;
